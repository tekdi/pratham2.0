// ============================================================
// BULK IMPORT — PROCESSING QUEUE ENGINE
// Pratham 2.0 — Workspace MFE
//
// Features:
//   • Topological dependency-aware execution
//   • Parallel execution for independent jobs (configurable concurrency)
//   • Exponential backoff retry
//   • Progress event emitter
//   • Partial success handling (failed jobs don't block independent ones)
//   • Rollback registry for cleanup on abort
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import {
  ParsedImportData,
  QueueJob,
  ImportProgress,
  ImportItemStatus,
  JobType,
  FrameworkId,
} from '../types/bulkImport.types';
import {
  SCP_BOARD_NAME_TO_ID,
  SCP_MEDIUM_NAME_TO_ID,
  SCP_GRADE_NAME_TO_ID,
  SCP_SUBJECT_NAME_TO_ID,
  SCP_COURSE_TYPE_NAME_TO_ID,
  POS_DOMAIN_NAME_TO_ID,
  POS_SUB_DOMAIN_NAME_TO_ID,
  POS_SUBJECT_NAME_TO_ID,
} from './frameworkConfig';
import {
  createContentNode,
  getContentUploadUrl,
  uploadFileToPresignedUrl,
  associateUploadedFile,
  submitContentForReview,
  createQuestionSetNode,
  createQuestion,
  updateQuestionSetHierarchy,
  createCourseNode,
  updateCourseHierarchy,
  downloadGoogleDriveFile,
  convertDriveToDirectUrl,
  FILE_MIME_MAP,
} from '../services/BulkImportService';

// ─── Config ───────────────────────────────────────────────────

const MAX_CONCURRENCY = 3;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 2_000;

// ─── Event System ─────────────────────────────────────────────

type ProgressListener = (progress: ImportProgress) => void;

// ─── Queue Engine ─────────────────────────────────────────────

export class BulkImportQueue {
  private jobs: Map<string, QueueJob> = new Map();
  /** tempId → real platform identifier (resolved after creation) */
  private resolvedIds: Map<string, string> = new Map();
  /** Jobs queued for rollback if abort is called */
  private rollbackRegistry: { type: string; identifier: string }[] = [];

  private progressListeners: ProgressListener[] = [];
  private activeCount = 0;
  private abortSignal = false;

  // ─── Build Jobs from Parsed Data ───────────────────────────

  buildJobs(data: ParsedImportData): void {
    this.jobs.clear();
    this.resolvedIds.clear();
    this.rollbackRegistry = [];

    // Register existing identifier mappings immediately
    data.existingMappings.forEach((em) => {
      this.resolvedIds.set(em.tempId, em.existingIdentifier);
    });

    // ── CONTENT JOBS ──
    data.contents.forEach((content) => {
      // Job 1: Create content metadata node
      const createJobId = `create_content_${content.tempId}`;
      this.addJob({
        id: createJobId,
        type: 'create_content',
        tempId: content.tempId,
        dependsOn: [],
        payload: {
          name: content.name,
          description: content.description,
          primaryCategory: content.primaryCategory,
          framework: 'pos-framework' as const, // content always pos-framework for all users
          mimeType: FILE_MIME_MAP[content.fileType] || 'application/pdf',
          // pos-framework has no medium/gradeLevel taxonomy — do NOT send them for content
          // API expects arrays for these taxonomy fields
          subject:        content.subject        ? [content.subject]        : undefined,
          domain:         content.domain         ? [content.domain]         : undefined,
          subDomain:      content.subDomain      ? [content.subDomain]      : undefined,
          targetAgeGroup: content.targetAgeGroup ? [content.targetAgeGroup] : undefined,
          primaryUser:    content.primaryUser     ? [content.primaryUser]    : undefined,
          audience:       content.audience        ? [content.audience]       : undefined,
          language:       content.language        ? [content.language]       : undefined,
          // program → array; keywords → array; copyrightYear → number
          program:       content.program ? [content.program] : undefined,
          keywords:      content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined,
          copyrightYear: content.copyrightYear ? Number(content.copyrightYear) : undefined,
          contentLanguage: content.contentLanguage,  // string, not array
          license:   content.license,
          copyright: content.copyright,
          author:    content.author,
          creator:   content.creator,
          driveUrl:  content.driveUrl,
          fileType:  content.fileType,
          _contentTempId: content.tempId,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      // Job 2: Upload file (depends on create)
      const uploadJobId = `upload_content_${content.tempId}`;
      this.addJob({
        id: uploadJobId,
        type: 'upload_content_file',
        tempId: content.tempId,
        dependsOn: [createJobId],
        payload: {
          driveUrl: content.driveUrl,
          fileType: content.fileType,
          _contentTempId: content.tempId,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      // Job 3: Send for review (depends on upload)
      const reviewJobId = `review_content_${content.tempId}`;
      this.addJob({
        id: reviewJobId,
        type: 'review_content',
        tempId: content.tempId,
        dependsOn: [uploadJobId],
        payload: { _contentTempId: content.tempId },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });
    });

    // ── QUESTION SET JOBS ──
    data.questionSets.forEach((qs) => {
      const createQsJobId = `create_qs_${qs.tempId}`;
      this.addJob({
        id: createQsJobId,
        type: 'create_questionset',
        tempId: qs.tempId,
        dependsOn: [],
        payload: {
          name: qs.name,
          description: qs.description,
          primaryCategory: qs.primaryCategory,
          framework: qs.framework,
          mimeType: 'application/vnd.sunbird.questionset',
          // POS QS: domain (string), subDomain (array), subject (array),
          // targetAgeGroup (array), primaryUser (array), contentLanguage (string)
          // SCP QS: subject (array), board (string), courseType/program (arrays)
          // Neither framework uses medium or gradeLevel for QS.
          subject:         qs.subject    ? [qs.subject]    : undefined,
          domain:          qs.domain     || undefined,
          subDomain:       qs.subDomain  ? [qs.subDomain]  : undefined,
          targetAgeGroup:  qs.targetAgeGroup  ? [qs.targetAgeGroup]  : undefined,
          primaryUser:     qs.primaryUser     ? [qs.primaryUser]     : undefined,
          contentLanguage: qs.contentLanguage || undefined,
          audience:        qs.audience   ? [qs.audience]   : undefined,
          // SCP-specific fields: board → string, courseType/program → arrays
          board:          qs.board       || undefined,
          courseType:     qs.courseType  ? [qs.courseType]  : undefined,
          program:        qs.program     ? [qs.program]     : undefined,
          assessmentType: qs.assessmentType || undefined,
          // evaluationType is required per form-read — validated before import runs
          evaluationType: qs.evaluationType || undefined,
          maxAttempts:   qs.maxAttempts,
          showFeedback:  qs.showFeedback,
          showSolutions: qs.showSolutions,
          allowAnonymousAccess: 'Yes',
          shuffle: false,   // keep section order fixed
          _qsTempId: qs.tempId,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      // Questions for this QS
      const questionsForQs = data.questions.filter(
        (q) => q.questionSetTempId === qs.tempId
      );

      if (questionsForQs.length > 0) {
        const createQuestionJobIds: string[] = [];

        questionsForQs.forEach((q, qIdx) => {
          const qJobId = `create_question_${qs.tempId}_${qIdx}`;
          this.addJob({
            id: qJobId,
            type: 'create_question',
            tempId: qs.tempId,
            dependsOn: [createQsJobId],
            payload: {
              questionType: q.questionType,
              questionText: q.questionText,
              options: q.options,
              correctAnswer: q.correctAnswer,
              maxScore: q.maxScore,
              // bloomsLevel and difficultyLevel removed — invalid props per platform API
              hint: q.hint,
              solution: q.solution,
              sectionName: q.sectionName || 'Section 1',
              // Inherit taxonomy from parent QS so the question passes validation
              _qsSubject:    qs.subject,
              _qsMedium:     qs.medium,
              _qsGradeLevel: qs.gradeLevel,
              _qsLanguage:   qs.language,
              _qsFramework:  qs.framework,
              _qsTempId: qs.tempId,
              _qIndex: qIdx,
            },
            status: 'queued',
            retryCount: 0,
            maxRetries: MAX_RETRIES,
          });
          createQuestionJobIds.push(qJobId);
        });

        // Hierarchy update after all questions created
        const hierarchyJobId = `hierarchy_qs_${qs.tempId}`;
        this.addJob({
          id: hierarchyJobId,
          type: 'update_questionset_hierarchy',
          tempId: qs.tempId,
          dependsOn: createQuestionJobIds,
          payload: {
            _qsTempId: qs.tempId,
            _qsName: qs.name,                    // needed for hierarchy root name
            _qsPrimaryCategory: qs.primaryCategory,
            questionCount: questionsForQs.length,
            questions: questionsForQs,
          },
          status: 'queued',
          retryCount: 0,
          maxRetries: MAX_RETRIES,
        });
      }
    });

    // ── COURSE JOBS ──
    data.courses.forEach((course) => {
      // Collect child dependencies
      const childMappings = data.courseChildMappings.filter(
        (m) => m.courseTempId === course.tempId
      );

      // The course depends on all its children being processed
      const childDependencies = childMappings
        .map((m) => {
          const childRef = m.childRef;
          // If childRef is a tempId, find the last job for that entity
          if (childRef.startsWith('TEMP_CONTENT_')) {
            return `review_content_${childRef}`;
          }
          if (childRef.startsWith('TEMP_QS_')) {
            const hasQuestions = data.questions.some((q) => q.questionSetTempId === childRef);
            return hasQuestions ? `hierarchy_qs_${childRef}` : `create_qs_${childRef}`;
          }
          // Existing identifier or TEMP_EXISTING — already resolved, no dependency
          return null;
        })
        .filter(Boolean) as string[];

      const createCourseJobId = `create_course_${course.tempId}`;
      this.addJob({
        id: createCourseJobId,
        type: 'create_course',
        tempId: course.tempId,
        dependsOn: childDependencies,
        payload: {
          name: course.name,
          description: course.description,
          framework: course.framework,
          // SCP courses: targetBoardIds / targetMediumIds / targetGradeLevelIds / targetSubjectIds / targetCourseTypeIds
          // POS courses: targetDomainIds / targetSubDomainIds / targetSubjectIds / targetAgeGroup / primaryUser / contentLanguage
          // Neither framework uses plain medium or gradeLevel for courses.
          ...(course.framework === 'scp-framework'
            ? {
                // SCP form-read uses target*Ids with output:"identifier"
                targetBoardIds:      course.board       ? [SCP_BOARD_NAME_TO_ID[course.board]       || course.board]       : undefined,
                targetMediumIds:     course.medium      ? [SCP_MEDIUM_NAME_TO_ID[course.medium]      || course.medium]      : undefined,
                targetGradeLevelIds: course.gradeLevel  ? [SCP_GRADE_NAME_TO_ID[course.gradeLevel]   || course.gradeLevel]  : undefined,
                targetSubjectIds:    course.subject     ? [SCP_SUBJECT_NAME_TO_ID[course.subject]    || course.subject]     : undefined,
                targetCourseTypeIds: course.courseType  ? [SCP_COURSE_TYPE_NAME_TO_ID[course.courseType] || course.courseType] : undefined,
                // contentLanguage: plain string for SCP (form-read range of strings, not identifiers)
                contentLanguage: course.contentLanguage || undefined,
              }
            : {
                // POS course form-read uses targetDomainIds / targetSubDomainIds /
                // targetSubjectIds with output:"identifier" — display name → identifier
                targetDomainIds:    course.targetDomainIds
                  ? [POS_DOMAIN_NAME_TO_ID[course.targetDomainIds]    || course.targetDomainIds]
                  : undefined,
                targetSubDomainIds: course.targetSubDomainIds
                  ? [POS_SUB_DOMAIN_NAME_TO_ID[course.targetSubDomainIds] || course.targetSubDomainIds]
                  : undefined,
                targetSubjectIds:   course.targetSubjectIds
                  ? [POS_SUBJECT_NAME_TO_ID[course.targetSubjectIds]  || course.targetSubjectIds]
                  : undefined,
                // targetAgeGroup, primaryUser: plain string arrays (no identifier mapping needed)
                targetAgeGroup: course.targetAgeGroup ? [course.targetAgeGroup] : undefined,
                primaryUser:    course.primaryUser    ? [course.primaryUser]    : undefined,
                // contentLanguage: plain string
                contentLanguage: course.contentLanguage || undefined,
              }
          ),
          audience:   course.audience   ? [course.audience]   : undefined,
          // keywords → array; copyrightYear → number
          keywords:      course.keywords ? course.keywords.split(',').map((k: string) => k.trim()) : undefined,
          copyrightYear: course.copyrightYear ? Number(course.copyrightYear) : undefined,
          license:   course.license,
          copyright: course.copyright,
          author:    course.author,
          _courseTempId: course.tempId,
          _childMappings: childMappings,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      if (childMappings.length > 0) {
        const courseHierarchyJobId = `hierarchy_course_${course.tempId}`;
        this.addJob({
          id: courseHierarchyJobId,
          type: 'update_course_hierarchy',
          tempId: course.tempId,
          dependsOn: [createCourseJobId],
          payload: {
            _courseTempId: course.tempId,
            _courseName: course.name,   // needed for hierarchy root name
            _childMappings: childMappings,
          },
          status: 'queued',
          retryCount: 0,
          maxRetries: MAX_RETRIES,
        });
      }
    });
  }

  private addJob(job: QueueJob): void {
    this.jobs.set(job.id, job);
  }

  // ─── Subscribe to progress ─────────────────────────────────

  onProgress(listener: ProgressListener): () => void {
    this.progressListeners.push(listener);
    return () => {
      this.progressListeners = this.progressListeners.filter((l) => l !== listener);
    };
  }

  private emitProgress(): void {
    const jobsArray = Array.from(this.jobs.values());
    const completed = jobsArray.filter((j) => j.status === 'success').length;
    const failed = jobsArray.filter((j) => j.status === 'failed').length;
    const skipped = jobsArray.filter((j) => j.status === 'skipped').length;
    const active = jobsArray.filter((j) => j.status === 'processing' || j.status === 'retrying').length;
    const total = jobsArray.length;

    const progress: ImportProgress = {
      phase: this.abortSignal ? 'failed' : (completed + failed + skipped >= total ? 'completed' : 'importing'),
      totalJobs: total,
      completedJobs: completed,
      failedJobs: failed,
      skippedJobs: skipped,
      activeJobs: active,
      percentComplete: total > 0 ? Math.round(((completed + failed + skipped) / total) * 100) : 0,
      jobs: jobsArray,
    };

    this.progressListeners.forEach((l) => l(progress));
  }

  // ─── Main Run Loop ─────────────────────────────────────────

  async run(): Promise<ImportProgress> {
    this.abortSignal = false;

    return new Promise((resolve) => {
      const tick = async () => {
        if (this.abortSignal) {
          resolve(this.buildProgress());
          return;
        }

        const jobsArray = Array.from(this.jobs.values());
        const allDone = jobsArray.every((j) =>
          ['success', 'failed', 'skipped'].includes(j.status)
        );

        if (allDone) {
          resolve(this.buildProgress());
          return;
        }

        // Find jobs that are ready to run
        const readyJobs = jobsArray.filter((job) => {
          if (job.status !== 'queued') return false;
          return job.dependsOn.every((depId) => {
            const dep = this.jobs.get(depId);
            if (!dep) return true; // dep doesn't exist = no blocker
            if (dep.status === 'success') return true;
            if (dep.status === 'failed' || dep.status === 'skipped') {
              // Mark this job as skipped due to failed dependency
              job.status = 'skipped';
              job.error = `Skipped: dependency job "${depId}" failed`;
              return false;
            }
            return false; // dep still in progress
          });
        });

        this.emitProgress();

        // Launch up to MAX_CONCURRENCY jobs
        const toRun = readyJobs
          .filter((j) => j.status === 'queued')
          .slice(0, MAX_CONCURRENCY - this.activeCount);

        if (toRun.length === 0 && this.activeCount === 0) {
          // Nothing running and nothing ready — check for stall
          const pending = jobsArray.filter((j) => j.status === 'queued');
          if (pending.length > 0) {
            // Mark stalled jobs as skipped
            pending.forEach((j) => {
              j.status = 'skipped';
              j.error = 'Skipped: dependency chain could not be resolved';
            });
          }
          resolve(this.buildProgress());
          return;
        }

        toRun.forEach((job) => {
          this.activeCount++;
          this.executeJob(job).finally(() => {
            this.activeCount--;
            setTimeout(tick, 100);
          });
        });

        // Continue ticking
        setTimeout(tick, 200);
      };

      tick();
    });
  }

  abort(): void {
    this.abortSignal = true;
  }

  // ─── Execute a Single Job ──────────────────────────────────

  private async executeJob(job: QueueJob): Promise<void> {
    job.status = 'processing';
    job.startedAt = Date.now();
    this.emitProgress();

    try {
      await this.runJobWithRetry(job);
      job.status = 'success';
      job.completedAt = Date.now();
    } catch (err: any) {
      job.status = 'failed';
      job.error = err?.message || 'Unknown error';
      job.completedAt = Date.now();
      console.error(`Job ${job.id} failed:`, err);
    }

    this.emitProgress();
  }

  private async runJobWithRetry(job: QueueJob): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= job.maxRetries; attempt++) {
      if (attempt > 0) {
        job.status = 'retrying';
        job.retryCount = attempt;
        this.emitProgress();
        const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1);
        await sleep(delay);
      }

      try {
        await this.dispatchJob(job);
        return; // success
      } catch (err: any) {
        lastError = err;
        // Don't retry on 4xx client errors
        if (err?.response?.status >= 400 && err?.response?.status < 500) {
          throw err;
        }
      }
    }

    throw lastError || new Error('Max retries exceeded');
  }

  private async dispatchJob(job: QueueJob): Promise<void> {
    switch (job.type) {
      case 'create_content':
        await this.handleCreateContent(job);
        break;
      case 'upload_content_file':
        await this.handleUploadContentFile(job);
        break;
      case 'review_content':
        await this.handleReviewContent(job);
        break;
      case 'create_questionset':
        await this.handleCreateQuestionSet(job);
        break;
      case 'create_question':
        await this.handleCreateQuestion(job);
        break;
      case 'update_questionset_hierarchy':
        await this.handleUpdateQsHierarchy(job);
        break;
      case 'create_course':
        await this.handleCreateCourse(job);
        break;
      case 'update_course_hierarchy':
        await this.handleUpdateCourseHierarchy(job);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }
  }

  // ─── Job Handlers ──────────────────────────────────────────

  private async handleCreateContent(job: QueueJob): Promise<void> {
    const { _contentTempId, driveUrl, fileType, ...metadata } = job.payload;

    const identifier = await createContentNode({
      name:            metadata.name,
      description:     metadata.description,
      primaryCategory: metadata.primaryCategory,
      framework:       metadata.framework,
      mimeType:        FILE_MIME_MAP[fileType] || 'application/pdf',
      // pos-framework has no medium/gradeLevel taxonomy — omitted for content
      subject:         metadata.subject,
      domain:          metadata.domain,
      subDomain:       metadata.subDomain,
      targetAgeGroup:  metadata.targetAgeGroup,
      primaryUser:     metadata.primaryUser,
      audience:        metadata.audience,
      language:        metadata.language,
      program:         metadata.program,
      contentLanguage: metadata.contentLanguage,  // string, separate from language array
      keywords:        metadata.keywords,
      license:         metadata.license,
      copyright:       metadata.copyright,
      copyrightYear:   metadata.copyrightYear,
      author:          metadata.author,
      creator:         metadata.creator,
    });

    this.resolvedIds.set(_contentTempId, identifier);
    job.resolvedIdentifier = identifier;

    this.rollbackRegistry.push({ type: 'content', identifier });
  }

  // Maps a declared fileType → all MIME types that Google Drive may return for that format.
  // ZIP and H5P are both ZIP archives at the OS level, so they share the same allowed MIMEs.
  private static readonly ALLOWED_MIME_FOR_FILE_TYPE: Record<string, string[]> = {
    pdf: ['application/pdf'],
    mp4: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-m4v'],
    zip: [
      'application/zip',
      'application/x-zip',
      'application/x-zip-compressed',
      'application/octet-stream',
    ],
    h5p: [
      'application/zip',
      'application/x-zip',
      'application/x-zip-compressed',
      'application/octet-stream',
    ],
  };

  private async handleUploadContentFile(job: QueueJob): Promise<void> {
    const { _contentTempId, driveUrl, fileType } = job.payload;
    const contentId = this.resolvedIds.get(_contentTempId);
    if (!contentId) throw new Error(`Content ID not resolved for ${_contentTempId}`);

    const mimeType = FILE_MIME_MAP[fileType] || 'application/pdf';

    // Download from Google Drive — returns the actual content-type from the server
    const { buffer, fileName, mimeType: actualMimeType } = await downloadGoogleDriveFile(driveUrl);

    // ── File type validation ─────────────────────────────────────
    // Check that the actual MIME type of the downloaded file matches
    // the fileType declared in the Excel sheet. This catches cases where
    // a user declares "pdf" but the Drive link points to an MP4, etc.
    const allowedMimes = BulkImportQueue.ALLOWED_MIME_FOR_FILE_TYPE[fileType?.toLowerCase()] ?? [];
    const actualBase   = (actualMimeType || '').split(';')[0].trim().toLowerCase();

    if (allowedMimes.length > 0 && actualBase && !allowedMimes.includes(actualBase)) {
      throw new Error(
        `File type mismatch for ${_contentTempId}: ` +
        `declared "${fileType}" (expects ${allowedMimes[0]}) ` +
        `but the Google Drive file is "${actualBase}". ` +
        `Please update the File Type column in the Content sheet to match the actual file.`
      );
    }

    // Get pre-signed upload URL
    const { preSignedUrl } = await getContentUploadUrl(contentId, fileName);

    // Upload to S3
    await uploadFileToPresignedUrl(preSignedUrl, buffer, mimeType);

    // Associate the file with the content node
    const fileUrl = preSignedUrl.split('?')[0]; // Strip query params to get the base S3 URL
    await associateUploadedFile(contentId, fileUrl, mimeType);

    job.resolvedIdentifier = contentId;
  }

  private async handleReviewContent(job: QueueJob): Promise<void> {
    const { _contentTempId } = job.payload;
    const contentId = this.resolvedIds.get(_contentTempId);
    if (!contentId) throw new Error(`Content ID not resolved for ${_contentTempId}`);

    await submitContentForReview(contentId);
    job.resolvedIdentifier = contentId;
  }

  private async handleCreateQuestionSet(job: QueueJob): Promise<void> {
    const { _qsTempId, ...metadata } = job.payload;

    const identifier = await createQuestionSetNode({
      name: metadata.name,
      description: metadata.description,
      primaryCategory: metadata.primaryCategory,
      framework: metadata.framework,
      mimeType: 'application/vnd.sunbird.questionset',
      subject:    metadata.subject,
      medium:     metadata.medium,
      gradeLevel: metadata.gradeLevel,
      audience:   metadata.audience,
      language:   metadata.language,
      // SCP-specific taxonomy
      board:          metadata.board,
      courseType:     metadata.courseType,
      program:        metadata.program,
      assessmentType: metadata.assessmentType,
      // Behaviour flags
      evaluationType:      metadata.evaluationType,
      allowAnonymousAccess: metadata.allowAnonymousAccess,
      shuffle:       metadata.shuffle,
      maxAttempts:   metadata.maxAttempts,
      showFeedback:  metadata.showFeedback,
      showSolutions: metadata.showSolutions,
    });

    this.resolvedIds.set(_qsTempId, identifier);
    job.resolvedIdentifier = identifier;

    this.rollbackRegistry.push({ type: 'questionset', identifier });
  }

  private async handleCreateQuestion(job: QueueJob): Promise<void> {
    const {
      _qsTempId, _qIndex,
      questionType, questionText, options, correctAnswer, maxScore, hint, solution,
      _qsSubject, _qsMedium, _qsGradeLevel, _qsLanguage, _qsFramework,
    } = job.payload;
    const qsId = this.resolvedIds.get(_qsTempId);
    if (!qsId) throw new Error(`QuestionSet ID not resolved for ${_qsTempId}`);

    const taxonomy = {
      subject:    _qsSubject    ? [_qsSubject]    : undefined,
      medium:     _qsMedium     ? [_qsMedium]     : undefined,
      gradeLevel: _qsGradeLevel ? [_qsGradeLevel] : undefined,
      language:   _qsLanguage   ? [_qsLanguage]   : undefined,
      framework:  _qsFramework  || 'pos-framework',
    };

    const questionBody = buildQuestionBody(questionType, questionText, options, correctAnswer, maxScore, hint, solution, qsId, taxonomy);

    const questionId = await createQuestion(questionBody);

    // Store in a special namespaced key: {qsTempId}_{qIndex} → questionId
    this.resolvedIds.set(`${_qsTempId}_q${_qIndex}`, questionId);
    job.resolvedIdentifier = questionId;
  }

  private async handleUpdateQsHierarchy(job: QueueJob): Promise<void> {
    const { _qsTempId, _qsName, _qsPrimaryCategory, questionCount, questions } = job.payload;
    const qsId = this.resolvedIds.get(_qsTempId);
    if (!qsId) throw new Error(`QuestionSet ID not resolved for ${_qsTempId}`);

    // ── 1. Group questions by section (preserve insertion order) ──
    // Each unique Section Name becomes one section node with a client-generated UUID.
    const sectionMap = new Map<string, { name: string; sectionId: string; children: string[] }>();

    for (let i = 0; i < questionCount; i++) {
      const q = questions[i];
      const sectionName = (q.sectionName || 'Section 1').trim();

      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, {
          name: sectionName,
          sectionId: uuidv4(),   // Sunbird requires a proper UUID for new section nodes
          children: [],
        });
      }

      const questionId = this.resolvedIds.get(`${_qsTempId}_q${i}`);
      if (questionId) {
        sectionMap.get(sectionName)!.children.push(questionId);
      }
    }

    const sections = Array.from(sectionMap.values());

    // ── 2. nodesModified ──────────────────────────────────────────
    // QS root: isNew=false (already created), sections: isNew=true (created inline)
    const nodesModified: Record<string, any> = {
      [qsId]: {
        isNew: false,
        root: true,
        objectType: 'QuestionSet',
        metadata: {},
      },
    };

    sections.forEach((sec) => {
      nodesModified[sec.sectionId] = {
        isNew: true,
        root: false,
        objectType: 'QuestionSet',
        metadata: {
          name: sec.name,
          mimeType: 'application/vnd.sunbird.questionset',
          primaryCategory: _qsPrimaryCategory || 'QuestionSet',
          visibility: 'Parent',
          allowAnonymousAccess: 'Yes',
          shuffle: false,           // keep section question order fixed
          showFeedback: false,
          showSolutions: false,
        },
      };
    });

    // ── 3. hierarchy ──────────────────────────────────────────────
    // QS root → [section UUIDs] → [question do_ identifiers]
    const hierarchy: Record<string, any> = {
      [qsId]: {
        name: _qsName,
        children: sections.map((s) => s.sectionId),
        root: true,
      },
    };

    sections.forEach((sec) => {
      hierarchy[sec.sectionId] = {
        name: sec.name,
        children: sec.children,   // already resolved do_ question identifiers
        root: false,
      };
    });

    await updateQuestionSetHierarchy(qsId, { nodesModified, hierarchy });
    job.resolvedIdentifier = qsId;
  }

  private async handleCreateCourse(job: QueueJob): Promise<void> {
    const { _courseTempId, _childMappings, ...metadata } = job.payload;

    const identifier = await createCourseNode({
      name:          metadata.name,
      description:   metadata.description,
      framework:     metadata.framework,
      // SCP course fields
      targetBoardIds:      metadata.targetBoardIds,
      targetMediumIds:     metadata.targetMediumIds,
      targetGradeLevelIds: metadata.targetGradeLevelIds,
      targetCourseTypeIds: metadata.targetCourseTypeIds,
      // POS course fields (targetDomainIds / targetSubDomainIds / targetSubjectIds)
      // and shared target*Ids for POS Subject (also used in SCP)
      targetDomainIds:    metadata.targetDomainIds,
      targetSubDomainIds: metadata.targetSubDomainIds,
      targetSubjectIds:   metadata.targetSubjectIds,
      // POS + SCP shared plain-value fields
      targetAgeGroup:  metadata.targetAgeGroup,
      primaryUser:     metadata.primaryUser,
      contentLanguage: metadata.contentLanguage,
      // Common fields
      audience:      metadata.audience,
      keywords:      metadata.keywords,
      license:       metadata.license,
      copyright:     metadata.copyright,
      author:        metadata.author,
      copyrightYear: metadata.copyrightYear,
    });

    this.resolvedIds.set(_courseTempId, identifier);
    job.resolvedIdentifier = identifier;

    this.rollbackRegistry.push({ type: 'course', identifier });
  }

  private async handleUpdateCourseHierarchy(job: QueueJob): Promise<void> {
    const { _courseTempId, _courseName, _childMappings } = job.payload;
    const courseId = this.resolvedIds.get(_courseTempId);
    if (!courseId) throw new Error(`Course ID not resolved for ${_courseTempId}`);

    // ── 1. Group children by unit (preserve insertion order with Map) ──
    // Each unique Unit Name becomes one unit node with a client-generated UUID.
    const unitMap = new Map<string, { name: string; unitId: string; children: string[] }>();

    _childMappings
      .sort((a: any, b: any) => a.sequence - b.sequence)
      .forEach((mapping: any) => {
        const unitName = (mapping.unitName || 'Unit 1').trim();

        if (!unitMap.has(unitName)) {
          unitMap.set(unitName, {
            name: unitName,
            unitId: uuidv4(),   // Sunbird requires a proper UUID for new unit nodes
            children: [],
          });
        }

        // Resolve child identifier (temp ID → resolved do_xxx, or direct do_xxx)
        const childId =
          this.resolvedIds.get(mapping.childRef) ||
          mapping.childRef;

        if (childId) {
          unitMap.get(unitName)!.children.push(childId);
        }
      });

    const units = Array.from(unitMap.values());

    // ── 2. nodesModified ──────────────────────────────────────────
    const nodesModified: Record<string, any> = {
      [courseId]: { root: true, objectType: 'Collection', isNew: false, metadata: {} },
    };

    units.forEach((unit) => {
      nodesModified[unit.unitId] = {
        root: false,
        objectType: 'Collection',
        isNew: true,
        metadata: {
          name: unit.name,
          mimeType: 'application/vnd.ekstep.content-collection',
          primaryCategory: 'Course Unit',
          contentType: 'CourseUnit',
        },
      };
    });

    // ── 3. hierarchy ──────────────────────────────────────────────
    const hierarchy: Record<string, any> = {
      [courseId]: {
        name: _courseName,   // use the actual course name, not the temp ID
        children: units.map((u) => u.unitId),
        root: true,
      },
    };

    units.forEach((unit) => {
      hierarchy[unit.unitId] = {
        name: unit.name,
        children: unit.children,
        root: false,
      };
    });

    await updateCourseHierarchy(courseId, nodesModified, hierarchy);
    job.resolvedIdentifier = courseId;
  }

  // ─── Progress Snapshot ─────────────────────────────────────

  private buildProgress(): ImportProgress {
    const jobsArray = Array.from(this.jobs.values());
    const completed = jobsArray.filter((j) => j.status === 'success').length;
    const failed = jobsArray.filter((j) => j.status === 'failed').length;
    const skipped = jobsArray.filter((j) => j.status === 'skipped').length;
    const total = jobsArray.length;

    return {
      phase: failed > 0 && completed > 0 ? 'partial' : failed > 0 ? 'failed' : 'completed',
      totalJobs: total,
      completedJobs: completed,
      failedJobs: failed,
      skippedJobs: skipped,
      activeJobs: 0,
      percentComplete: total > 0 ? Math.round(((completed + failed + skipped) / total) * 100) : 100,
      jobs: jobsArray,
    };
  }

  getResolvedIds(): Record<string, string> {
    return Object.fromEntries(this.resolvedIds.entries());
  }
}

// ─── Question type → platform metadata map ────────────────────
//
// Derived from editor-created question reference payload:
//   qType          — platform's internal question type string
//   interactionTypes — array sent to platform API
//   templateId     — template string used by the editor renderer
//   primaryCategory — platform primaryCategory for the question

const QUESTION_TYPE_META: Record<string, {
  qType: string;
  interactionTypes?: string[];
  templateId?: string;
  primaryCategory: string;
}> = {
  MCQ: {
    qType:            'MCQ',
    interactionTypes: ['choice'],
    templateId:       'mcq-vertical',
    primaryCategory:  'Multiple Choice Question',
  },
  Match: {
    qType:            'MTF',
    interactionTypes: ['match'],
    templateId:       'mtf-vertical',
    primaryCategory:  'Match The Following Question',
  },
  Arrange: {
    qType:            'ASQ',
    interactionTypes: ['order'],
    templateId:       'asq-vertical',
    primaryCategory:  'Arrange Sequence Question',
  },
  Subjective: {
    qType:            'SA',
    primaryCategory:  'Subjective Question',
  },
};

// ─── Question Body Builder ────────────────────────────────────

function buildQuestionBody(
  type: string,
  text: string,
  options: string | undefined,
  correctAnswer: string | undefined,
  maxScore: number | undefined,
  hint: string | undefined,
  solution: string | undefined,
  qsId: string,
  taxonomy?: {
    subject?: string[];
    medium?: string[];
    gradeLevel?: string[];
    language?: string[];
    framework?: string;
  }
): Record<string, any> {
  // Platform requires `name` — derive from question text (max 120 chars)
  const name = text.replace(/<[^>]*>/g, '').trim().slice(0, 120) || 'Question';

  const meta = QUESTION_TYPE_META[type] ?? QUESTION_TYPE_META['Subjective'];

  const base: Record<string, any> = {
    name,
    mimeType:         'application/vnd.sunbird.question',
    primaryCategory:  meta.primaryCategory,
    qType:            meta.qType,
    ...(meta.interactionTypes?.length && { interactionTypes: meta.interactionTypes }),
    ...(meta.templateId               && { templateId:       meta.templateId }),
    visibility:       'Default',
    // Inherit taxonomy from parent QS for platform validation
    ...(taxonomy?.framework  && { framework:  taxonomy.framework }),
    ...(taxonomy?.subject    && { subject:    taxonomy.subject }),
    ...(taxonomy?.medium     && { medium:     taxonomy.medium }),
    ...(taxonomy?.gradeLevel && { gradeLevel: taxonomy.gradeLevel }),
    ...(taxonomy?.language   && { language:   taxonomy.language }),
    // MTF has its own body format — overridden below for Match type
    body:      type === 'Match'
      ? `<div class='question-body' tabindex='-1'><div class='mtf-title' tabindex='0'><p>${text}</p></div><div data-match-interaction='response1' class='mtf-vertical'></div></div>`
      : `<div class='question-body' tabindex='-1'><p>${text}</p></div>`,
    hints:     hint     ? [hint]     : undefined,
    solutions: solution ? [solution] : undefined,
    maxScore:  maxScore ?? 1,
  };

  if (type === 'MCQ') {
    const optionList = (options || '').split('|').map((o) => ({
      label: o.trim(),
      value: { body: `<p>${o.trim()}</p>` },
    }));

    // Find the 0-based index of the correct answer option
    const correctIndex = optionList.findIndex(
      (o) => o.label.toLowerCase() === (correctAnswer || '').toLowerCase()
    );

    return {
      ...base,
      answer: correctAnswer,
      editorState: {
        options: optionList,
        question: text,
        answer: correctAnswer,
      },
      interactions: {
        response1: {
          type: 'choice',
          options: optionList.map((o, i) => ({ label: o.label, value: i })),
        },
        validation: { required: 'Yes' },
      },
      responseDeclaration: {
        response1: {
          cardinality: 'single',
          type:        'integer',
          correctResponse: { value: correctIndex >= 0 ? correctIndex : 0 },
          mapping: [{ response: correctIndex >= 0 ? correctIndex : 0, outcomes: { score: maxScore ?? 1 } }],
        },
      },
      outcomeDeclaration: {
        maxScore: { cardinality: 'single', type: 'integer', defaultValue: maxScore ?? 1 },
      },
    };
  }

  if (type === 'Match') {
    // Parse "Dog:Bark|Cat:Meow|Cow:Moo" → left/right arrays with index-based values
    const pairs = (options || '').split('|').map((p) => {
      const [left, right] = p.split(':');
      return { left: left?.trim() ?? '', right: right?.trim() ?? '' };
    });

    // Platform format: separate left/right arrays, each item has label (HTML) and value (index)
    const leftOptions  = pairs.map((p, i) => ({ label: `<p>${p.left}</p>`,  value: i }));
    const rightOptions = pairs.map((p, i) => ({ label: `<p>${p.right}</p>`, value: i }));

    // editorState uses a nested value wrapper
    const editorLeft  = pairs.map((p, i) => ({ value: { body: `<p>${p.left}</p>`,  value: i } }));
    const editorRight = pairs.map((p, i) => ({ value: { body: `<p>${p.right}</p>`, value: i } }));

    // responseDeclaration: each left maps to its matching right index
    const correctResponse = pairs.map((_, i) => ({ left: i, right: [i] }));
    const perPairScore    = pairs.length > 0 ? parseFloat((1 / pairs.length).toFixed(4)) : 1;
    const mapping         = pairs.map((_, i) => ({
      value: { left: i, right: i },
      score: perPairScore,
    }));

    // answer HTML — match-container format used by platform renderer
    const answerLeft  = pairs.map((p) => `<div class='left-option'><p>${p.left}</p></div>`).join('');
    const answerRight = pairs.map((p) => `<div class='right-option'><p>${p.right}</p></div>`).join('');
    const answer = `<div class='match-container'><div class='left-options'>${answerLeft}</div><div class='right-options'>${answerRight}</div></div>`;

    return {
      ...base,
      answer,
      editorState: {
        question: `<p>${text}</p>`,
        options:  { left: editorLeft, right: editorRight },
      },
      interactions: {
        response1: {
          type:    'match',
          options: { left: leftOptions, right: rightOptions },
          validation: { required: 'Yes' },
        },
      },
      responseDeclaration: {
        response1: {
          cardinality:     'multiple',
          type:            'map',
          correctResponse: { value: correctResponse },
          mapping,
        },
      },
      outcomeDeclaration: {
        maxScore: {
          cardinality:  'multiple',
          type:         'integer',
          defaultValue: maxScore ?? 1,
        },
      },
    };
  }

  if (type === 'Arrange') {
    const items = (options || '').split('|').map((o) => o.trim());
    return {
      ...base,
      editorState: { question: text, options: items },
      interactions: {
        response1: {
          type:    'order',
          options: items.map((label, i) => ({ label, value: i })),
          validation: { required: 'Yes' },
        },
      },
    };
  }

  // Subjective — no interactions, no responseDeclaration
  return {
    ...base,
    editorState: { question: text },
  };
}

// ─── Utility ──────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
