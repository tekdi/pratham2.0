// ============================================================
// BULK IMPORT TYPES & INTERFACES
// Pratham 2.0 — Workspace MFE
// ============================================================

// ─── Framework ───────────────────────────────────────────────
export type FrameworkId = 'pos-framework' | 'scp-framework';

// ─── Excel Row Shapes ────────────────────────────────────────

export interface ContentRow {
  /** Internal temp ID e.g. TEMP_CONTENT_1 */
  tempId: string;
  name: string;
  /** Title of the content in English (optional, from form-read englishName field) */
  englishName?: string;
  description?: string;
  primaryCategory: string;
  /** pos-framework | scp-framework */
  framework: FrameworkId;
  subject?: string;
  medium?: string;
  gradeLevel?: string;
  domain?: string;
  subDomain?: string;
  targetAgeGroup?: string;
  primaryUser?: string;
  audience?: string;
  language?: string;
  /** Plain string content language (from content form-read API range) */
  contentLanguage?: string;
  program?: string;
  keywords?: string;
  /** Google Drive URL for the thumbnail/app icon image */
  appIconUrl?: string;
  author?: string;
  /** Name of the content creator (platform `creator` field, shown in Creator column) */
  creator?: string;
  /** Google Drive share URL or YouTube URL (for youtube file type) */
  driveUrl: string;
  /** pdf | zip | mp4 | h5p | youtube */
  fileType: 'pdf' | 'zip' | 'mp4' | 'h5p' | 'youtube';
  /** Resolved after creation */
  resolvedIdentifier?: string;
  status?: ImportItemStatus;
  error?: string;
  retryCount?: number;
}

export interface QuestionSetRow {
  tempId: string;
  name: string;
  /** Title in English (optional, from form-read englishName field) */
  englishName?: string;
  description?: string;
  primaryCategory: string;
  framework: FrameworkId;
  subject?: string;
  medium?: string;
  gradeLevel?: string;
  domain?: string;
  subDomain?: string;
  /** Google Drive URL for the thumbnail/app icon image */
  appIconUrl?: string;
  // POS QS fields (from pos-channel form-read)
  targetAgeGroup?: string;
  primaryUser?: string;
  contentLanguage?: string;
  audience?: string;
  language?: string;
  // SCP-specific QS fields
  board?: string;
  courseType?: string;
  program?: string;
  assessmentType?: string;
  evaluationType?: string;
  maxAttempts?: number;
  showFeedback?: boolean;
  showSolutions?: boolean;
  /** Resolved after creation */
  resolvedIdentifier?: string;
  status?: ImportItemStatus;
  error?: string;
  retryCount?: number;
}

export interface QuestionRow {
  /** Links to QuestionSet tempId */
  questionSetTempId: string;
  /** e.g. Section 1 */
  sectionName?: string;
  /** MCQ | Arrange | Match | Subjective */
  questionType: QuestionType;
  questionText: string;
  /** Pipe-separated options for MCQ / Match */
  options?: string;
  correctAnswer?: string;
  maxScore?: number;
  bloomsLevel?: string;
  difficulty?: string;
  hint?: string;
  solution?: string;
  status?: ImportItemStatus;
  error?: string;
}

export interface CourseRow {
  tempId: string;
  name: string;
  /** Title in English (optional, from form-read englishName field) */
  englishName?: string;
  description?: string;
  framework: FrameworkId;
  /** Google Drive URL for the thumbnail/app icon image */
  appIconUrl?: string;
  // POS course fields — form-read uses target*Ids with output:"identifier"
  // (no medium or gradeLevel for POS courses; same target*Ids pattern as SCP)
  targetDomainIds?: string;    // display name from Excel → resolved to identifier in queue
  targetSubDomainIds?: string; // display name from Excel → resolved to identifier in queue
  targetSubjectIds?: string;   // display name from Excel → resolved to identifier in queue
  targetAgeGroup?: string;     // plain string e.g. "0-3 yrs"
  primaryUser?: string;        // plain string e.g. "Educators"
  // SCP course fields
  board?: string;
  courseType?: string;
  contentLanguage?: string;    // used by both SCP and POS courses
  // Legacy fields — kept for backwards compatibility only
  subject?: string;
  medium?: string;
  gradeLevel?: string;
  language?: string;
  // Common
  audience?: string;
  program?: string;
  keywords?: string;
  license?: string;
  copyright?: string;
  copyrightYear?: string;
  author?: string;
  resolvedIdentifier?: string;
  status?: ImportItemStatus;
  error?: string;
  retryCount?: number;
}

export interface CourseChildMappingRow {
  /** TEMP_COURSE_1 */
  courseTempId: string;
  /** Unit/Section name */
  unitName: string;
  /** TEMP_CONTENT_1 | TEMP_QS_1 | an existing do_xxx identifier */
  childRef: string;
  childType: 'content' | 'questionset';
  sequence: number;
}

export interface ExistingContentMappingRow {
  /** e.g. TEMP_EXISTING_1 */
  tempId: string;
  /** Real platform identifier e.g. do_xxxx */
  existingIdentifier: string;
  entityType: 'content' | 'questionset';
  /**
   * Optional direct course mapping — if filled, the existing content is added
   * to the specified course unit without needing a CourseChildrenMapping row.
   */
  courseTempId?: string;
  unitName?: string;
  sequence?: number;
}

// ─── Question Types ───────────────────────────────────────────

export type QuestionType = 'MCQ' | 'Arrange' | 'Match' | 'Subjective';

// ─── Processing Status ────────────────────────────────────────

export type ImportItemStatus =
  | 'pending'
  | 'validating'
  | 'valid'
  | 'invalid'
  | 'queued'
  | 'processing'
  | 'success'
  | 'failed'
  | 'skipped'
  | 'retrying';

export type ImportPhase =
  | 'idle'
  | 'uploading'
  | 'parsing'
  | 'validating'
  | 'previewing'
  | 'importing'
  | 'completed'
  | 'partial'
  | 'failed';

// ─── Validation ───────────────────────────────────────────────

export interface ValidationError {
  sheet: SheetName;
  row: number;
  column: string;
  tempId?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    contentCount: number;
    questionSetCount: number;
    courseCount: number;
    questionCount: number;
  };
}

// ─── Parsed Excel Data ────────────────────────────────────────

export type SheetName =
  | 'General'                  // global errors not tied to any specific sheet
  | 'Content'
  | 'QuestionSets'
  | 'Questions'
  | 'Courses'
  | 'CourseChildrenMapping'
  | 'ExistingContentMapping'
  | 'LookupData';

export interface ParsedImportData {
  contents: ContentRow[];
  questionSets: QuestionSetRow[];
  questions: QuestionRow[];
  courses: CourseRow[];
  courseChildMappings: CourseChildMappingRow[];
  existingMappings: ExistingContentMappingRow[];
}

// ─── Queue / Job ──────────────────────────────────────────────

export type JobType =
  | 'create_content'
  | 'upload_content_file'
  | 'upload_app_icon'
  | 'review_content'
  | 'create_questionset'
  | 'create_question'
  | 'update_questionset_hierarchy'
  | 'create_course'
  | 'update_course_hierarchy';

export interface QueueJob {
  id: string;
  type: JobType;
  /** tempId of the entity being processed */
  tempId: string;
  /** Jobs that must complete before this one runs */
  dependsOn: string[];
  payload: Record<string, any>;
  status: ImportItemStatus;
  retryCount: number;
  maxRetries: number;
  error?: string;
  resolvedIdentifier?: string;
  startedAt?: number;
  completedAt?: number;
}

export interface ImportProgress {
  phase: ImportPhase;
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  skippedJobs: number;
  activeJobs: number;
  percentComplete: number;
  jobs: QueueJob[];
  startedAt?: number;
  completedAt?: number;
}

// ─── Import Session (persisted in state) ─────────────────────

export interface ImportSession {
  id: string;
  fileName: string;
  uploadedAt: number;
  phase: ImportPhase;
  parsedData: ParsedImportData | null;
  validationResult: ValidationResult | null;
  progress: ImportProgress | null;
  /** tempId → real platform identifier */
  resolvedIds: Record<string, string>;
}

// ─── API Shapes ───────────────────────────────────────────────

export interface ContentCreatePayload {
  name: string;
  description?: string;
  primaryCategory: string;
  mimeType: string;
  framework: string;
  createdBy: string;
  code: string;
  [key: string]: any;
}

export interface QuestionSetCreatePayload {
  name: string;
  mimeType: string;
  primaryCategory: string;
  code: string;
  createdBy: string;
  framework: string;
  [key: string]: any;
}

export interface HierarchyUpdatePayload {
  nodesModified: Record<string, any>;
  hierarchy: Record<string, any>;
}

export interface DriveDownloadResult {
  buffer: Buffer;
  fileName: string;
  mimeType: string;
  fileSize: number;
}

// ─── Error Report ─────────────────────────────────────────────

export interface ErrorReportRow {
  Sheet: string;
  Row: number;
  TempID: string;
  Field: string;
  Error: string;
  Severity: 'Error' | 'Warning';
}
