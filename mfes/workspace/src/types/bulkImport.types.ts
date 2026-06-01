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
  description?: string;
  primaryCategory: string;
  /** pos-framework | scp-framework */
  framework: FrameworkId;
  subject?: string;
  medium?: string;
  gradeLevel?: string;
  audience?: string;
  language?: string;
  keywords?: string;
  license?: string;
  copyright?: string;
  copyrightYear?: string;
  author?: string;
  /** Public Google Drive share URL */
  driveUrl: string;
  /** pdf | zip | mp4 | h5p */
  fileType: 'pdf' | 'zip' | 'mp4' | 'h5p';
  /** Resolved after creation */
  resolvedIdentifier?: string;
  status?: ImportItemStatus;
  error?: string;
  retryCount?: number;
}

export interface QuestionSetRow {
  tempId: string;
  name: string;
  description?: string;
  primaryCategory: string;
  framework: FrameworkId;
  subject?: string;
  medium?: string;
  gradeLevel?: string;
  audience?: string;
  language?: string;
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
  description?: string;
  framework: FrameworkId;
  // POS course fields
  subject?: string;
  medium?: string;
  gradeLevel?: string;
  language?: string;
  // SCP course fields (target*Ids use platform identifiers; contentLanguage is plain string)
  board?: string;
  courseType?: string;
  contentLanguage?: string;
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
  /** e.g. EXISTING_CONTENT_1 */
  tempId: string;
  /** Real platform identifier e.g. do_xxxx */
  existingIdentifier: string;
  entityType: 'content' | 'questionset';
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
