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
  splitMultiValue,
  EVALUATION_TYPE_LABEL_TO_VALUE,
  getUnitPath,
} from './frameworkConfig';
import {
  createContentNode,
  getContentUploadUrl,
  uploadFileToPresignedUrl,
  notifyContentUploaded,
  associateYouTubeUrl,
  submitContentForReview,
  publishContent,
  createQuestionSetNode,
  updateQuestionSetHierarchy,
  reviewQuestionSet,
  publishQuestionSet,
  retireQuestionSet,
  createCourseNode,
  updateCourseHierarchy,
  downloadGoogleDriveFile,
  convertDriveToDirectUrl,
  readContent,
  FILE_MIME_MAP,
  uploadAppIconFromDrive,
  checkDriveFileAccessible,
} from '../services/BulkImportService';
import { patch } from '../services/RestClient';

// ─── Multi-select helper ──────────────────────────────────────
// Splits pipe- or comma-separated values from Excel into an array.
// Returns undefined if the value is blank.
const toArray = (val: string | undefined): string[] | undefined => {
  const parts = splitMultiValue(val);
  return parts.length > 0 ? parts : undefined;
};

// Convert Excel 'true'/'false' strings (or actual booleans) → JavaScript boolean.
// Used for QS create/hierarchy APIs which require boolean true/false.
const toBool = (val: any, defaultVal = false): boolean => {
  if (val === undefined || val === null || val === '') return defaultVal;
  if (val === true  || String(val).toLowerCase() === 'true')  return true;
  if (val === false || String(val).toLowerCase() === 'false') return false;
  return defaultVal;
};

// ─── Config ───────────────────────────────────────────────────

const MAX_CONCURRENCY = 3;
const MAX_RETRIES = 3;
const RETRY_BASE_DELAY_MS = 2_000;

// Upper bound on the exponential backoff. Browsers throttle timers in
// background tabs (roughly one per minute), so an uncapped backoff makes a
// backgrounded import look frozen. Capping keeps the worst-case wait short.
const RETRY_MAX_DELAY_MS = 15_000;

// File uploads stream large payloads (Drive download → presigned upload →
// platform processing). Running several at once overloads the gateway and
// produces 502s on big files, so they are limited to one at a time.
// Lightweight metadata jobs still run at MAX_CONCURRENCY.
const HEAVY_JOB_TYPES: ReadonlySet<string> = new Set(['upload_content_file']);
const MAX_HEAVY_CONCURRENCY = 1;

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
          englishName: content.englishName || undefined,
          description: content.description,
          primaryCategory: content.primaryCategory,
          resourceType: 'Learn',   // matches editor-created content; helps platform assign correct contentType
          framework: 'pos-framework' as const,
          mimeType: FILE_MIME_MAP[content.fileType] || 'application/pdf',
          // Multi-select fields use pipe-separated values in Excel → split into arrays
          subject:        toArray(content.subject),
          domain:         content.domain ? [content.domain.trim()] : undefined,  // API expects array
          subDomain:      toArray(content.subDomain),
          targetAgeGroup: toArray(content.targetAgeGroup),
          primaryUser:    toArray(content.primaryUser),
          program:        toArray(content.program),
          audience:       content.audience ? [content.audience] : undefined,
          language:       content.language ? [content.language] : undefined,
          keywords:       content.keywords ? content.keywords.split(',').map((k: string) => k.trim()) : undefined,
          contentLanguage: content.contentLanguage,  // string, not array
          author:    content.author,
          creator:   content.creator,
          driveUrl:  content.driveUrl,
          fileType:  content.fileType,
          appIconUrl: content.appIconUrl,
          _contentTempId: content.tempId,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      // Job 2a (optional): Upload app icon (depends on create)
      let iconJobId: string | undefined;
      if (content.appIconUrl) {
        iconJobId = `upload_icon_${content.tempId}`;
        this.addJob({
          id: iconJobId,
          type: 'upload_app_icon',
          tempId: content.tempId,
          dependsOn: [createJobId],
          payload: { appIconUrl: content.appIconUrl, _entityTempId: content.tempId, _entityType: 'content' },
          status: 'queued',
          retryCount: 0,
          maxRetries: MAX_RETRIES,
        });
      }

      // Job 2b: Upload file (depends on create + optional icon)
      const uploadJobId = `upload_content_${content.tempId}`;
      this.addJob({
        id: uploadJobId,
        type: 'upload_content_file',
        tempId: content.tempId,
        dependsOn: iconJobId ? [createJobId, iconJobId] : [createJobId],
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

      // Job 4: Publish content (depends on review)
      // Publishing triggers the platform processing pipeline:
      //   • H5P / ZIP → creates streamingUrl
      //   • Sets pkgVersion and transitions status to "Live"
      // Without this step, H5P content has no streamingUrl and the player
      // cannot render it, causing React hydration errors.
      this.addJob({
        id: `publish_content_${content.tempId}`,
        type: 'publish_content',
        tempId: content.tempId,
        dependsOn: [reviewJobId],
        payload: { _contentTempId: content.tempId },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });
    });

    // ── QUESTION SET JOBS ──
    data.questionSets.forEach((qs) => {
      const createQsJobId = `create_qs_${qs.tempId}`;

      const questionsForQs = data.questions.filter(
        (q) => q.questionSetTempId === qs.tempId
      );

      this.addJob({
        id: createQsJobId,
        type: 'create_questionset',
        tempId: qs.tempId,
        dependsOn: [],
        payload: {
          name: qs.name,
          englishName: qs.englishName || undefined,
          description: qs.description,
          primaryCategory: qs.primaryCategory,
          framework: qs.framework,
          mimeType: 'application/vnd.sunbird.questionset',
          // POS QS: domain=string (single), subDomain/subject/targetAgeGroup/primaryUser/program=array (pipe-sep)
          // SCP QS: board=string (single), medium/gradeLevel/subject/courseType=array (pipe-sep)
          domain:          qs.domain ? qs.domain.trim() : undefined,   // QS API expects string (not array)
          subDomain:       toArray(qs.subDomain),
          subject:         toArray(qs.subject),
          targetAgeGroup:  toArray(qs.targetAgeGroup),
          primaryUser:     toArray(qs.primaryUser),
          program:         toArray(qs.program),
          contentLanguage: qs.contentLanguage || undefined,
          audience:        qs.audience ? [qs.audience] : undefined,
          // SCP-specific fields: board=string, medium/gradeLevel/courseType=arrays
          board:      qs.board || undefined,
          medium:     toArray(qs.medium),
          gradeLevel: toArray(qs.gradeLevel),
          courseType: toArray(qs.courseType),
          assessmentType: qs.assessmentType || undefined,
          // Excel shows friendly labels — convert to API value (online/offline/ai)
          evaluationType: qs.evaluationType
            ? EVALUATION_TYPE_LABEL_TO_VALUE[qs.evaluationType] || qs.evaluationType
            : undefined,
          // QS create API requires boolean true/false for these fields
          showFeedback:  toBool(qs.showFeedback),
          showSolutions: toBool(qs.showSolutions),
          showTimer:     false,
          showHints:     false,
          allowAnonymousAccess: 'Yes',
          shuffle: false,
          // appIconUrl skipped for QS — QS uses a different API for icons (TBD)
          _qsTempId: qs.tempId,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      // NOTE: QS app icon upload skipped — QS uses a different API for icons (will be added later)

      // Tracks the last structural job for this QS — review must wait for it.
      let lastStructuralJobId = createQsJobId;

      if (questionsForQs.length > 0) {
        // Sections AND questions are created inside this single atomic
        // hierarchy update (editor-style). If any question is invalid the
        // whole update fails, nothing is attached, and the queue retires
        // the QS — so no incomplete QuestionSet is left on the platform.
        const hierarchyJobId = `hierarchy_qs_${qs.tempId}`;
        lastStructuralJobId = hierarchyJobId;
        this.addJob({
          id: hierarchyJobId,
          type: 'update_questionset_hierarchy',
          tempId: qs.tempId,
          dependsOn: [createQsJobId],
          payload: {
            _qsTempId: qs.tempId,
            _qsName: qs.name,                    // needed for hierarchy root name
            _qsPrimaryCategory: qs.primaryCategory,
            questionCount: questionsForQs.length,
            questions: questionsForQs,
            // Inherit taxonomy from parent QS so questions pass validation
            _qsSubject:    qs.subject,
            _qsMedium:     qs.medium,
            _qsGradeLevel: qs.gradeLevel,
            _qsLanguage:   qs.language,
            _qsFramework:  qs.framework,
          },
          status: 'queued',
          retryCount: 0,
          maxRetries: MAX_RETRIES,
        });
      }

      // Auto-publish: review → publish, mirroring the content pipeline.
      // Publishing the QuestionSet also publishes the questions inside its
      // hierarchy, so the questions need no separate publish jobs.
      // Both run after the hierarchy update — reviewing an empty QS would
      // leave its questions in Draft.
      const reviewQsJobId = `review_qs_${qs.tempId}`;
      this.addJob({
        id: reviewQsJobId,
        type: 'review_questionset',
        tempId: qs.tempId,
        dependsOn: [lastStructuralJobId],
        payload: { _qsTempId: qs.tempId },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      this.addJob({
        id: `publish_qs_${qs.tempId}`,
        type: 'publish_questionset',
        tempId: qs.tempId,
        dependsOn: [reviewQsJobId],
        payload: { _qsTempId: qs.tempId },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });
    });

    // ── COURSE JOBS ──
    data.courses.forEach((course) => {
      // Collect child mappings from CourseChildrenMapping sheet
      const childMappings = data.courseChildMappings.filter(
        (m) => m.courseTempId === course.tempId
      );

      // Also fold in ExistingContentMapping rows that directly specify this course.
      // This allows existing do_xxx content to be added to a course unit without
      // requiring a separate CourseChildrenMapping row.
      // Existing content can target a nested unit too, so the full level path
      // is carried across rather than just a single unit name.
      const existingChildMappings = data.existingMappings
        .filter((e) => e.courseTempId === course.tempId && getUnitPath(e).length > 0)
        .map((e) => ({
          courseTempId: course.tempId,
          unitName:     e.unitName,
          unitLevel1:   e.unitLevel1,
          unitLevel2:   e.unitLevel2,
          unitLevel3:   e.unitLevel3,
          unitLevel4:   e.unitLevel4,
          childRef:     e.existingIdentifier,  // use do_xxx directly
          childType:    e.entityType as 'content' | 'questionset',
          sequence:     e.sequence ?? 999,
        }));

      // Merge — CourseChildrenMapping rows first, then existing content mappings
      const allChildMappings = [...childMappings, ...existingChildMappings];

      // The course depends on all its children being processed
      const childDependencies = allChildMappings
        .map((m) => {
          const childRef = m.childRef;
          // If childRef is a tempId, find the last job for that entity
          if (childRef.startsWith('TEMP_CONTENT_')) {
            return `publish_content_${childRef}`;
          }
          if (childRef.startsWith('TEMP_QS_')) {
            // Every QS now ends with a publish job (regardless of whether it has
            // questions), so the course waits for the QS to reach "Live" — the
            // same contract used for content above.
            return `publish_qs_${childRef}`;
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
          englishName: course.englishName || undefined,
          description: course.description,
          framework: course.framework,
          // SCP courses: targetBoardIds / targetMediumIds / targetGradeLevelIds / targetSubjectIds / targetCourseTypeIds
          // POS courses: targetDomainIds / targetSubDomainIds / targetSubjectIds / targetAgeGroup / primaryUser / contentLanguage
          // Neither framework uses plain medium or gradeLevel for courses.
          ...(course.framework === 'scp-framework'
            ? {
                // SCP form-read uses target*Ids with output:"identifier"
                // board=single, medium/gradeLevel/subject/courseType=multi (pipe-separated)
                targetBoardIds:      course.board ? [SCP_BOARD_NAME_TO_ID[course.board] || course.board] : undefined,
                targetMediumIds:     toArray(course.medium)?.map(v => SCP_MEDIUM_NAME_TO_ID[v] || v),
                targetGradeLevelIds: toArray(course.gradeLevel)?.map(v => SCP_GRADE_NAME_TO_ID[v] || v),
                targetSubjectIds:    toArray(course.subject)?.map(v => SCP_SUBJECT_NAME_TO_ID[v] || v),
                targetCourseTypeIds: toArray(course.courseType)?.map(v => SCP_COURSE_TYPE_NAME_TO_ID[v] || v),
                contentLanguage: course.contentLanguage || undefined,
              }
            : {
                // POS course: domain=single identifier, subDomain/subject=multi identifiers
                targetDomainIds:    course.targetDomainIds
                  ? [POS_DOMAIN_NAME_TO_ID[course.targetDomainIds] || course.targetDomainIds]
                  : undefined,
                targetSubDomainIds: toArray(course.targetSubDomainIds)?.map(v => POS_SUB_DOMAIN_NAME_TO_ID[v] || v),
                targetSubjectIds:   toArray(course.targetSubjectIds)?.map(v => POS_SUBJECT_NAME_TO_ID[v] || v),
                targetAgeGroup:     toArray(course.targetAgeGroup),
                primaryUser:        toArray(course.primaryUser),
                contentLanguage:    course.contentLanguage || undefined,
              }
          ),
          audience: course.audience ? [course.audience] : undefined,
          program:  toArray(course.program),
          keywords: course.keywords ? course.keywords.split(',').map((k: string) => k.trim()) : undefined,
          author:   course.author,
          appIconUrl: course.appIconUrl,
          _courseTempId: course.tempId,
          _childMappings: allChildMappings,
        },
        status: 'queued',
        retryCount: 0,
        maxRetries: MAX_RETRIES,
      });

      // Optional: Upload app icon for this course
      if (course.appIconUrl) {
        this.addJob({
          id: `upload_icon_${course.tempId}`,
          type: 'upload_app_icon',
          tempId: course.tempId,
          dependsOn: [createCourseJobId],
          payload: { appIconUrl: course.appIconUrl, _entityTempId: course.tempId, _entityType: 'course' },
          status: 'queued',
          retryCount: 0,
          maxRetries: MAX_RETRIES,
        });
      }

      if (allChildMappings.length > 0) {
        const courseHierarchyJobId = `hierarchy_course_${course.tempId}`;
        this.addJob({
          id: courseHierarchyJobId,
          type: 'update_course_hierarchy',
          tempId: course.tempId,
          dependsOn: [createCourseJobId],
          payload: {
            _courseTempId: course.tempId,
            _courseName: course.name,   // needed for hierarchy root name
            _childMappings: allChildMappings,
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

        // Launch up to MAX_CONCURRENCY jobs, with heavy (file upload) jobs
        // additionally capped at MAX_HEAVY_CONCURRENCY to avoid gateway 502s
        let heavyActive = jobsArray.filter(
          (j) =>
            HEAVY_JOB_TYPES.has(j.type) &&
            (j.status === 'processing' || j.status === 'retrying')
        ).length;

        const toRun: QueueJob[] = [];
        for (const j of readyJobs) {
          if (j.status !== 'queued') continue;
          if (toRun.length >= MAX_CONCURRENCY - this.activeCount) break;
          if (HEAVY_JOB_TYPES.has(j.type)) {
            if (heavyActive >= MAX_HEAVY_CONCURRENCY) continue;
            heavyActive++;
          }
          toRun.push(j);
        }

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

      // The hierarchy update creates sections + questions atomically. If it
      // failed for good, retire the (empty) QuestionSet so the import never
      // leaves a QS without its questions on the platform.
      if (job.type === 'update_questionset_hierarchy') {
        await this.retireQuestionSetOnFailure(job);
      }
    }

    this.emitProgress();
  }

  private async retireQuestionSetOnFailure(job: QueueJob): Promise<void> {
    const qsId = this.resolvedIds.get(job.payload._qsTempId);
    if (!qsId) return;
    try {
      await retireQuestionSet(qsId);
      job.error = `${job.error} — the QuestionSet was removed so it is not left without its questions`;
    } catch (cleanupErr) {
      console.error(`Failed to retire QuestionSet ${qsId} after hierarchy failure:`, cleanupErr);
    }
  }

  private async runJobWithRetry(job: QueueJob): Promise<void> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= job.maxRetries; attempt++) {
      if (attempt > 0) {
        job.status = 'retrying';
        job.retryCount = attempt;
        this.emitProgress();
        const delay = Math.min(
          RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1),
          RETRY_MAX_DELAY_MS
        );
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
      case 'upload_app_icon':
        await this.handleUploadAppIcon(job);
        break;
      case 'review_content':
        await this.handleReviewContent(job);
        break;
      case 'publish_content':
        await this.handlePublishContent(job);
        break;
      case 'create_questionset':
        await this.handleCreateQuestionSet(job);
        break;
      case 'update_questionset_hierarchy':
        await this.handleUpdateQsHierarchy(job);
        break;
      case 'review_questionset':
        await this.handleReviewQuestionSet(job);
        break;
      case 'publish_questionset':
        await this.handlePublishQuestionSet(job);
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

    // ── Pre-flight: verify Drive URL is accessible AND file type matches ──────
    // YouTube URLs skip this check — the URL is set directly as artifactUrl.
    // For all other file types:
    //   1. Confirm the Drive link is reachable (not private/deleted)
    //   2. Confirm the actual MIME type matches the declared fileType column
    // Both checks run BEFORE createContentNode so no orphaned draft is created.
    if (fileType !== 'youtube' && driveUrl) {
      const { mimeType: actualMime } = await checkDriveFileAccessible(driveUrl);

      // Validate actual MIME against declared fileType using the same allowlist
      // used later in handleUploadContentFile (catches mismatch before node creation)
      const allowedMimes = BulkImportQueue.ALLOWED_MIME_FOR_FILE_TYPE[fileType?.toLowerCase()] ?? [];
      const actualBase   = (actualMime || '').split(';')[0].trim().toLowerCase();

      if (
        allowedMimes.length > 0 &&
        actualBase &&
        actualBase !== 'application/octet-stream' &&   // octet-stream is Drive's fallback — accept it
        !allowedMimes.includes(actualBase)
      ) {
        throw new Error(
          `File type mismatch: you declared "${fileType}" (expects ${allowedMimes[0]}) ` +
          `but the Google Drive file is "${actualBase}". ` +
          `Update the File Type column in the Content sheet to match the actual file, ` +
          `or re-upload the correct file to Drive.`
        );
      }
    }

    const identifier = await createContentNode({
      name:            metadata.name,
      englishName:     metadata.englishName || undefined,
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
      contentLanguage: metadata.contentLanguage,
      keywords:        metadata.keywords,
      author:          metadata.author,
      creator:         metadata.creator,
    });

    this.resolvedIds.set(_contentTempId, identifier);
    job.resolvedIdentifier = identifier;

    this.rollbackRegistry.push({ type: 'content', identifier });
  }

  // Maps a declared fileType → all MIME types that Google Drive may return for that format.
  // ZIP and H5P are both ZIP archives at the OS level, so they share the same allowed MIMEs.
  // Google Drive often returns 'application/octet-stream' for any file it cannot
  // identify server-side (large PDFs, ZIPs, MP4s behind access checks, etc.).
  // We accept it for every declared file type so that a valid Drive link never
  // fails solely because of Drive's generic fallback content-type.
  private static readonly ALLOWED_MIME_FOR_FILE_TYPE: Record<string, string[]> = {
    pdf: ['application/pdf', 'application/octet-stream'],
    mp4: ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-m4v', 'application/octet-stream'],
    mp3: ['audio/mp3', 'audio/mpeg', 'audio/mpeg3', 'audio/x-mpeg-3', 'application/octet-stream'],
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

  // ── App Icon upload handler ────────────────────────────────────

  private async handleUploadAppIcon(job: QueueJob): Promise<void> {
    const { appIconUrl, _entityTempId } = job.payload;
    const entityId = this.resolvedIds.get(_entityTempId);
    if (!entityId) throw new Error(`Entity ID not resolved for ${_entityTempId}`);
    if (!appIconUrl) return;

    // Upload icon image from Drive → get permanent S3 URL
    const iconUrl = await uploadAppIconFromDrive(entityId, appIconUrl);

    // Fetch current versionKey (required for every PATCH on Sunbird)
    const contentData = await readContent(entityId);
    const versionKey: string | undefined = contentData?.versionKey;
    if (!versionKey) throw new Error(`Could not retrieve versionKey for ${_entityTempId} when setting appIcon`);

    // PATCH with the uploaded icon URL
    await patch(`/action/content/v3/update/${entityId}`, {
      request: { content: { appIcon: iconUrl, versionKey } },
    });

    job.resolvedIdentifier = entityId;
  }

  // ── Content file upload handler ────────────────────────────────

  private async handleUploadContentFile(job: QueueJob): Promise<void> {
    const { _contentTempId, driveUrl, fileType } = job.payload;
    const contentId = this.resolvedIds.get(_contentTempId);
    if (!contentId) throw new Error(`Content ID not resolved for ${_contentTempId}`);

    const mimeType = FILE_MIME_MAP[fileType] || 'application/pdf';

    // ── YouTube: store URL directly, no file download or processing ─
    if (fileType === 'youtube') {
      await associateYouTubeUrl(contentId, driveUrl, mimeType);
      job.resolvedIdentifier = contentId;
      return;
    }

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

    // Get pre-signed upload URL and upload file to S3
    const { preSignedUrl } = await getContentUploadUrl(contentId, fileName);
    await uploadFileToPresignedUrl(preSignedUrl, buffer, mimeType);

    // ── Notify the platform via the upload endpoint ───────────────
    // POST /action/content/v3/upload/{contentId} with fileUrl triggers the
    // platform's processing pipeline. For H5P/ZIP this extracts the archive,
    // creates content/h5p/{id}-latest/ on S3, and sets streamingUrl.
    // Simply PATCHing artifactUrl bypasses all of this processing.
    const s3FileUrl = preSignedUrl.split('?')[0]; // base S3 URL (public, no auth params needed)
    await notifyContentUploaded(contentId, s3FileUrl);

    job.resolvedIdentifier = contentId;
  }

  private async handleReviewContent(job: QueueJob): Promise<void> {
    const { _contentTempId } = job.payload;
    const contentId = this.resolvedIds.get(_contentTempId);
    if (!contentId) throw new Error(`Content ID not resolved for ${_contentTempId}`);

    await submitContentForReview(contentId);
    job.resolvedIdentifier = contentId;
  }

  private async handlePublishContent(job: QueueJob): Promise<void> {
    const { _contentTempId } = job.payload;
    const contentId = this.resolvedIds.get(_contentTempId);
    if (!contentId) throw new Error(`Content ID not resolved for ${_contentTempId}`);

    // Publish triggers the platform processing pipeline:
    // H5P/ZIP → streamingUrl is generated, pkgVersion is set, status → "Live"
    await publishContent(contentId);
    job.resolvedIdentifier = contentId;
  }

  private async handleCreateQuestionSet(job: QueueJob): Promise<void> {
    const { _qsTempId, ...metadata } = job.payload;

    const identifier = await createQuestionSetNode({
      name:            metadata.name,
      englishName:     metadata.englishName     || undefined,
      description:     metadata.description,
      primaryCategory: metadata.primaryCategory,
      framework:       metadata.framework,
      mimeType:        'application/vnd.sunbird.questionset',
      // POS taxonomy fields (were missing — caused blank fields on platform)
      domain:          metadata.domain,
      subDomain:       metadata.subDomain,
      subject:         metadata.subject,
      targetAgeGroup:  metadata.targetAgeGroup,
      primaryUser:     metadata.primaryUser,
      contentLanguage: metadata.contentLanguage || undefined,
      // Shared fields
      program:         metadata.program,
      audience:        metadata.audience,
      language:        metadata.language,
      // SCP-specific taxonomy
      board:           metadata.board,
      medium:          metadata.medium,
      gradeLevel:      metadata.gradeLevel,
      courseType:      metadata.courseType,
      assessmentType:  metadata.assessmentType,
      // Behaviour flags — QS create API requires boolean true/false
      evaluationType:      metadata.evaluationType,
      allowAnonymousAccess: 'Yes',
      shuffle:       metadata.shuffle      ?? false,
      showFeedback:  metadata.showFeedback  ?? false,
      showSolutions: metadata.showSolutions ?? false,
      showTimer:     metadata.showTimer     ?? false,
      showHints:     metadata.showHints     ?? false,
    });

    this.resolvedIds.set(_qsTempId, identifier);
    job.resolvedIdentifier = identifier;

    this.rollbackRegistry.push({ type: 'questionset', identifier });
  }

  private async handleUpdateQsHierarchy(job: QueueJob): Promise<void> {
    const {
      _qsTempId, _qsName, _qsPrimaryCategory, questionCount, questions,
      _qsSubject, _qsMedium, _qsGradeLevel, _qsLanguage, _qsFramework,
    } = job.payload;
    const qsId = this.resolvedIds.get(_qsTempId);
    if (!qsId) throw new Error(`QuestionSet ID not resolved for ${_qsTempId}`);

    // Taxonomy inherited from the parent QS so questions pass platform
    // validation. Multi-select cells hold comma/pipe-separated values.
    const taxonomy = {
      subject:    toArray(_qsSubject),
      medium:     toArray(_qsMedium),
      gradeLevel: toArray(_qsGradeLevel),
      language:   toArray(_qsLanguage),
      framework:  _qsFramework  || 'pos-framework',
    };

    // ── 1. Group questions by section (preserve insertion order) ──
    // Each unique Section Name becomes one section node with a client-generated UUID.
    // Questions are CREATED here as isNew hierarchy nodes (like the platform
    // editor does): the question create API rejects visibility 'Parent', and
    // visibility cannot be changed afterwards (restricted prop on update, and
    // nodesModified cannot reach questions nested under sections).
    const sectionMap = new Map<string, {
      name: string;
      sectionId: string;
      description?: string;
      instructions?: string;
      children: string[];
    }>();

    /** client UUID → question node for nodesModified */
    const questionNodes: Record<string, any> = {};

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

      const section = sectionMap.get(sectionName)!;

      // Take description/instructions from the first row of the section that
      // has them filled (users typically fill only the section's first row)
      if (!section.description && q.sectionDescription?.trim()) {
        section.description = q.sectionDescription.trim();
      }
      if (!section.instructions && q.sectionInstructions?.trim()) {
        section.instructions = q.sectionInstructions.trim();
      }

      // Excel 'Public' → API 'Default' (independently discoverable);
      // 'Parent' (the default) → belongs to this QS only
      const visibility =
        String(q.visibility || 'Parent').trim().toLowerCase() === 'public'
          ? 'Default'
          : 'Parent';

      const questionUuid = uuidv4();
      questionNodes[questionUuid] = {
        isNew: true,
        root: false,
        objectType: 'Question',
        metadata: {
          ...buildQuestionBody(
            q.questionType, q.questionText, q.options, q.correctAnswer,
            q.maxScore, q.hint, q.solution, taxonomy, visibility
          ),
          code: questionUuid,
        },
      };
      section.children.push(questionUuid);
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
          ...(sec.description  && { description: sec.description }),
          ...(sec.instructions && { instructions: sec.instructions }),
          mimeType: 'application/vnd.sunbird.questionset',
          primaryCategory: _qsPrimaryCategory || 'QuestionSet',
          visibility: 'Parent',
          allowAnonymousAccess: 'Yes',
          // QS hierarchy update also uses the questionset API — booleans required
          shuffle:       false,
          showFeedback:  false,
          showSolutions: false,
          showTimer:     false,
          showHints:     false,
        },
      };
    });

    // Question nodes (isNew) — created by the hierarchy service with the
    // correct visibility in a single atomic request
    Object.assign(nodesModified, questionNodes);

    // ── 3. hierarchy ──────────────────────────────────────────────
    // QS root → [section UUIDs] → [question UUIDs]
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
        children: sec.children,   // client UUIDs of the isNew question nodes
        root: false,
      };
    });

    await updateQuestionSetHierarchy(qsId, { nodesModified, hierarchy });
    job.resolvedIdentifier = qsId;
  }

  private async handleCreateCourse(job: QueueJob): Promise<void> {
    const { _courseTempId, _childMappings, ...metadata } = job.payload;

    const identifier = await createCourseNode({
      name:        metadata.name,
      englishName: metadata.englishName || undefined,
      description: metadata.description,
      framework:   metadata.framework,
      // SCP course: target*Ids (arrays of identifiers)
      targetBoardIds:      metadata.targetBoardIds,
      targetMediumIds:     metadata.targetMediumIds,
      targetGradeLevelIds: metadata.targetGradeLevelIds,
      targetCourseTypeIds: metadata.targetCourseTypeIds,
      // POS course: targetDomainIds/targetSubDomainIds/targetSubjectIds (arrays of identifiers)
      targetDomainIds:    metadata.targetDomainIds,
      targetSubDomainIds: metadata.targetSubDomainIds,
      targetSubjectIds:   metadata.targetSubjectIds,
      // Shared plain-value arrays
      targetAgeGroup:  metadata.targetAgeGroup,
      primaryUser:     metadata.primaryUser,
      program:         metadata.program,
      contentLanguage: metadata.contentLanguage,
      audience:        metadata.audience,
      keywords:        metadata.keywords,
      author:          metadata.author,
    });

    this.resolvedIds.set(_courseTempId, identifier);
    job.resolvedIdentifier = identifier;

    this.rollbackRegistry.push({ type: 'course', identifier });
  }

  private async handleUpdateCourseHierarchy(job: QueueJob): Promise<void> {
    const { _courseTempId, _courseName, _childMappings } = job.payload;
    const courseId = this.resolvedIds.get(_courseTempId);
    if (!courseId) throw new Error(`Course ID not resolved for ${_courseTempId}`);

    // ── 1. Resolve each row's unit path into a nested unit tree ──
    // A row addresses its unit with up to 4 levels (Unit Level 1-4). Every
    // distinct path prefix becomes its own unit node, so "Unit 1 / Basics"
    // creates BOTH "Unit 1" and "Basics" nested inside it, and any later row
    // under the same prefix reuses the same nodes rather than duplicating them.
    //
    // Keyed by the joined path so lookups are O(1) and order of insertion is
    // preserved — units appear in the course in the order they first appear.
    interface UnitNode {
      name: string;
      unitId: string;
      /** Joined path key of the parent unit, or null for a top-level unit */
      parentKey: string | null;
      description?: string;
      appIconUrl?: string;
      /** Resolved identifiers of content/QS attached directly to this unit */
      children: string[];
    }

    const unitMap = new Map<string, UnitNode>();
    const pathKey = (segments: string[]) => segments.join(' › ');

    /**
     * Ensure every node along a path exists, and return the deepest one.
     * Intermediate units are created implicitly, so users never have to add
     * filler rows just to declare a parent.
     */
    const ensureUnitPath = (segments: string[]): UnitNode | null => {
      let parentKey: string | null = null;
      let node: UnitNode | null = null;

      segments.forEach((name, idx) => {
        const key = pathKey(segments.slice(0, idx + 1));
        if (!unitMap.has(key)) {
          unitMap.set(key, {
            name,
            unitId: uuidv4(),  // Sunbird requires a proper UUID for new nodes
            parentKey,
            children: [],
          });
        }
        node = unitMap.get(key)!;
        parentKey = key;
      });

      return node;
    };

    _childMappings
      .sort((a: any, b: any) => a.sequence - b.sequence)
      .forEach((mapping: any) => {
        const segments = getUnitPath(mapping);
        // A row with no unit at all still needs somewhere to live.
        const path = segments.length > 0 ? segments : ['Unit 1'];

        const unit = ensureUnitPath(path);
        if (!unit) return;

        // Metadata applies to the DEEPEST unit on the row. First non-empty
        // value wins, so users fill it on any single row for that unit.
        if (!unit.description && mapping.unitDescription) {
          unit.description = String(mapping.unitDescription).trim();
        }
        if (!unit.appIconUrl && mapping.unitAppIconUrl) {
          unit.appIconUrl = String(mapping.unitAppIconUrl).trim();
        }

        // Resolve child identifier (temp ID → resolved do_xxx, or direct do_xxx)
        const childId =
          this.resolvedIds.get(mapping.childRef) ||
          mapping.childRef;

        if (childId) {
          unit.children.push(childId);
        }
      });

    const units = Array.from(unitMap.values());

    // ── 1b. Upload unit icons from Drive → permanent S3 URLs ──────
    // Unit nodes don't exist yet (they're created inline by the hierarchy
    // update), so there's no unit identifier to upload against. We use the
    // parent course's upload endpoint instead — the returned S3 URL is just a
    // storage location and is valid as any node's `appIcon`.
    // A failed icon must not abort the whole course, so failures are logged
    // and the unit is created without an icon.
    const unitIconUrls = new Map<string, string>();

    for (const unit of units) {
      if (!unit.appIconUrl) continue;
      try {
        const uploadedUrl = await uploadAppIconFromDrive(courseId, unit.appIconUrl);
        unitIconUrls.set(unit.unitId, uploadedUrl);
      } catch (err: any) {
        console.warn(
          `[bulk-import] Unit icon upload failed for "${unit.name}" in ${_courseTempId}: ${err?.message}. `
          + 'Unit will be created without an icon.'
        );
      }
    }

    // ── 2. nodesModified ──────────────────────────────────────────
    const nodesModified: Record<string, any> = {
      [courseId]: { root: true, objectType: 'Collection', isNew: false, metadata: {} },
    };

    units.forEach((unit) => {
      const iconUrl = unitIconUrls.get(unit.unitId);
      nodesModified[unit.unitId] = {
        root: false,
        objectType: 'Collection',
        isNew: true,
        metadata: {
          name: unit.name,
          ...(unit.description && { description: unit.description }),
          ...(iconUrl        && { appIcon: iconUrl }),
          mimeType: 'application/vnd.ekstep.content-collection',
          primaryCategory: 'Course Unit',
          contentType: 'CourseUnit',
        },
      };
    });

    // ── 3. hierarchy ──────────────────────────────────────────────
    // A unit's children are its sub-units FIRST, then its own content/QS, so
    // sub-units surface above loose items in the course view. Only top-level
    // units (parentKey === null) hang off the course root.
    const childUnitIdsOf = (parentKey: string | null): string[] =>
      units.filter((u) => u.parentKey === parentKey).map((u) => u.unitId);

    const hierarchy: Record<string, any> = {
      [courseId]: {
        name: _courseName,   // use the actual course name, not the temp ID
        children: childUnitIdsOf(null),
        root: true,
      },
    };

    // Key each unit by its own path so we can find its sub-units.
    const keyByUnitId = new Map<string, string>();
    unitMap.forEach((node, key) => keyByUnitId.set(node.unitId, key));

    units.forEach((unit) => {
      const ownKey = keyByUnitId.get(unit.unitId)!;
      hierarchy[unit.unitId] = {
        name: unit.name,
        children: [...childUnitIdsOf(ownKey), ...unit.children],
        root: false,
      };
    });

    await updateCourseHierarchy(courseId, nodesModified, hierarchy);
    job.resolvedIdentifier = courseId;
  }

  // ── QuestionSet review / publish handlers ──────────────────────

  private async handleReviewQuestionSet(job: QueueJob): Promise<void> {
    const { _qsTempId } = job.payload;
    const qsId = this.resolvedIds.get(_qsTempId);
    if (!qsId) throw new Error(`QuestionSet ID not resolved for ${_qsTempId}`);

    await reviewQuestionSet(qsId);
    job.resolvedIdentifier = qsId;
  }

  private async handlePublishQuestionSet(job: QueueJob): Promise<void> {
    const { _qsTempId } = job.payload;
    const qsId = this.resolvedIds.get(_qsTempId);
    if (!qsId) throw new Error(`QuestionSet ID not resolved for ${_qsTempId}`);

    // Publishing the QS also publishes the questions in its hierarchy and
    // transitions the QS to "Live" so the QuML player can load it.
    await publishQuestionSet(qsId);
    job.resolvedIdentifier = qsId;
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
  taxonomy?: {
    subject?: string[];
    medium?: string[];
    gradeLevel?: string[];
    language?: string[];
    framework?: string;
  },
  visibility: 'Parent' | 'Default' = 'Parent'
): Record<string, any> {
  // Platform requires `name` — derive from question text (max 120 chars)
  const name = text.replace(/<[^>]*>/g, '').trim().slice(0, 120) || 'Question';

  const meta = QUESTION_TYPE_META[type] ?? QUESTION_TYPE_META['Subjective'];

  const score = maxScore ?? 1;

  // Questions are created as isNew nodes inside the QS hierarchy update,
  // where visibility 'Parent' is accepted. (The standalone question create
  // API rejects 'Parent', and visibility is a restricted prop on update —
  // so creating within the hierarchy is the only way to honour it.)

  // QuML solution blocks. The SAME array shape is used for the top-level
  // `solutions` (what the player iterates) and `editorState.solutions` (what the
  // question editor binds its rich-text solution field to). Keeping them in sync
  // is what the Sunbird editor itself does; omitting editorState.solutions makes
  // the editor fall back to the raw object and render "[object Object]".
  const solutionBlocks = solution
    ? [{ id: uuidv4(), type: 'html', value: `<p>${solution}</p>` }]
    : undefined;

  // Body varies by type — each type has its own wrapper and interaction placeholder
  const buildBody = (): string => {
    if (type === 'Match')
      return `<div class='question-body' tabindex='-1'><div class='mtf-title' tabindex='0'><p>${text}</p></div><div data-match-interaction='response1' class='mtf-vertical'></div></div>`;
    if (type === 'Arrange')
      return `<div class='question-body' tabindex='-1'><div class='asq-title' tabindex='0'><p>${text}</p></div><div data-order-interaction='response1' class='asq-vertical'></div></div>`;
    if (type === 'MCQ')
      return `<div class='question-body' tabindex='-1'><div class='mcq-title' tabindex='0'><p>${text}</p></div><div data-choice-interaction='response1' class='mcq-horizontal'></div></div>`;
    // Subjective
    return `<div class='question-body' tabindex='-1'><p>${text}</p></div>`;
  };

  const base: Record<string, any> = {
    name,
    mimeType:         'application/vnd.sunbird.question',
    primaryCategory:  meta.primaryCategory,
    qType:            meta.qType,
    ...(meta.interactionTypes?.length && { interactionTypes: meta.interactionTypes }),
    ...(meta.templateId               && { templateId:       meta.templateId }),
    visibility,  // 'Parent' = belongs to this QS only; 'Default' = independently discoverable ("Public")
    // Inherit taxonomy from parent QS for platform validation
    ...(taxonomy?.framework  && { framework:  taxonomy.framework }),
    ...(taxonomy?.subject    && { subject:    taxonomy.subject }),
    ...(taxonomy?.medium     && { medium:     taxonomy.medium }),
    ...(taxonomy?.gradeLevel && { gradeLevel: taxonomy.gradeLevel }),
    ...(taxonomy?.language   && { language:   taxonomy.language }),
    body:      buildBody(),
    hints:     hint     ? [hint]     : undefined,
    // QuML 1.0 stores solutions as an array of {id, type, value} — an object
    // (or empty {}) breaks graph node creation with a generic SERVER_ERROR
    solutions: solutionBlocks,
    maxScore:  score,
    // Mandatory at review time on this platform. Accepted here because
    // questions are created through the QS hierarchy update (QuML 1.1
    // schema) — the standalone question create API rejected this prop.
    outcomeDeclaration: {
      maxScore: {
        cardinality: 'single',
        type: 'integer',
        defaultValue: score,
      },
    },
  };

  // ── MCQ ──────────────────────────────────────────────────────
  if (type === 'MCQ') {
    const items = (options || '').split('|').map((o) => o.trim());

    // Find the 0-based index of the correct answer option
    const correctIndex = items.findIndex(
      (o) => o.toLowerCase() === (correctAnswer || '').toLowerCase()
    );
    const ci = correctIndex >= 0 ? correctIndex : 0;

    return {
      ...base,
      answer: correctAnswer,
      editorState: {
        question: `<p>${text}</p>`,
        options:  items.map((o, i) => ({ value: { body: `<p>${o}</p>`, value: i } })),
        ...(solutionBlocks && { solutions: solutionBlocks }),
      },
      interactions: {
        response1: {
          type:       'choice',
          options:    items.map((o, i) => ({ label: `<p>${o}</p>`, value: i })),
          validation: { required: 'Yes' },
        },
      },
      responseDeclaration: {
        response1: {
          cardinality:     'single',
          type:            'integer',
          correctResponse: { value: ci },
          mapping:         [{ value: ci, score }],
        },
      },
    };
  }

  // ── Arrange Sequence ─────────────────────────────────────────
  if (type === 'Arrange') {
    // Options pipe-separated in CORRECT order: "1|3|2|4"
    const items = (options || '').split('|').map((o) => o.trim());
    const n = items.length;
    const perScore = n > 0 ? parseFloat((score / n).toFixed(4)) : score;

    // correctResponse is always [0, 1, 2 … n-1] — the user supplies items in the correct order
    const correctSeq = items.map((_, i) => i);
    const mapping    = items.map((_, i) => ({ value: i, score: perScore }));

    const answerHtml = `<div class='answer-container'>${items.map((o) => `<div class='answer-body'><p>${o}</p></div>`).join('')}</div>`;

    return {
      ...base,
      answer: answerHtml,
      editorState: {
        question: `<p>${text}</p>`,
        options:  items.map((o, i) => ({ value: { body: `<p>${o}</p>`, value: i } })),
        ...(solutionBlocks && { solutions: solutionBlocks }),
      },
      interactions: {
        response1: {
          type:       'order',
          options:    items.map((o, i) => ({ label: `<p>${o}</p>`, value: i })),
          validation: { required: 'Yes' },
        },
      },
      responseDeclaration: {
        response1: {
          cardinality:     'ordered',
          type:            'integer',
          correctResponse: { value: correctSeq },
          mapping,
        },
      },
    };
  }

  // ── Match The Following ───────────────────────────────────────
  if (type === 'Match') {
    // Parse "Dog:Bark|Cat:Meow|Cow:Moo" → left/right arrays with index-based values
    const pairs = (options || '').split('|').map((p) => {
      const [left, right] = p.split(':');
      return { left: left?.trim() ?? '', right: right?.trim() ?? '' };
    });

    const leftOptions  = pairs.map((p, i) => ({ label: `<p>${p.left}</p>`,  value: i }));
    const rightOptions = pairs.map((p, i) => ({ label: `<p>${p.right}</p>`, value: i }));
    const editorLeft   = pairs.map((p, i) => ({ value: { body: `<p>${p.left}</p>`,  value: i } }));
    const editorRight  = pairs.map((p, i) => ({ value: { body: `<p>${p.right}</p>`, value: i } }));

    const correctResponse = pairs.map((_, i) => ({ left: i, right: [i] }));
    const perPairScore    = pairs.length > 0 ? parseFloat((score / pairs.length).toFixed(4)) : score;
    const mapping         = pairs.map((_, i) => ({
      value: { left: i, right: i },
      score: perPairScore,
    }));

    const answerLeft  = pairs.map((p) => `<div class='left-option'><p>${p.left}</p></div>`).join('');
    const answerRight = pairs.map((p) => `<div class='right-option'><p>${p.right}</p></div>`).join('');
    const answer = `<div class='match-container'><div class='left-options'>${answerLeft}</div><div class='right-options'>${answerRight}</div></div>`;

    return {
      ...base,
      answer,
      editorState: {
        question: `<p>${text}</p>`,
        options:  { left: editorLeft, right: editorRight },
        ...(solutionBlocks && { solutions: solutionBlocks }),
      },
      interactions: {
        response1: {
          type:       'match',
          options:    { left: leftOptions, right: rightOptions },
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
    };
  }

  // ── Subjective ────────────────────────────────────────────────
  // answer is required by the platform — use provided answer or '-' as placeholder.
  // Stored as HTML to match every other question type and what the editor expects;
  // a bare string here is what made the editor render "[object Object]" once it
  // fell back to the raw solutions object.
  const subjectiveAnswer = solution || correctAnswer || '-';
  const subjectiveAnswerHtml = /^\s*</.test(subjectiveAnswer)
    ? subjectiveAnswer                    // already HTML — leave as-is
    : `<p>${subjectiveAnswer}</p>`;

  return {
    ...base,
    answer: subjectiveAnswerHtml,
    editorState: {
      question: `<p>${text}</p>`,
      answer:   subjectiveAnswerHtml,
      ...(solutionBlocks && { solutions: solutionBlocks }),
    },
    responseDeclaration: {},
  };
}

// ─── Utility ──────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
