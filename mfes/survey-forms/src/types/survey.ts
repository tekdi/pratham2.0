export interface ApiResponse<T> {
  id: string;
  ver: string;
  ts: string;
  params: {
    resmsgid: string;
    status: 'successful' | 'failed';
    err: string | null;
    errmsg: string | null;
    successmessage?: string;
  };
  responseCode: number;
  result: T;
}

export interface Survey {
  surveyId: string;
  tenantId: string;
  surveyTitle: string;
  surveyDescription: string | null;
  status: 'draft' | 'published' | 'closed' | 'archived';
  surveyType: string | null;
  contextType: 'learner' | 'center' | 'teacher' | 'self' | 'none';
  targetRoles: string[] | null;
  settings: SurveySettings;
  theme: Record<string, any>;
  version: number;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  closedAt: string | null;
  sections?: SurveySection[];
}

export interface SurveySettings {
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  [key: string]: any;
}

export interface SurveySection {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string | null;
  displayOrder: number;
  isVisible: boolean;
  conditionalLogic: ConditionalLogic | null;
  fields: SurveyField[];
}

export interface SurveyField {
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: FieldType;
  isRequired: boolean;
  displayOrder: number;
  placeholder: string | null;
  helpText: string | null;
  defaultValue: any | null;
  validations: FieldValidations;
  dataSource: DataSource | null;
  uploadConfig: UploadConfig | null;
  uiConfig: Record<string, any>;
  conditionalLogic: ConditionalLogic | null;
  options: FieldOption[] | null;
}

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'time'
  | 'datetime'
  | 'select'
  | 'multi_select'
  | 'radio'
  | 'checkbox'
  | 'rating'
  | 'scale'
  | 'image_upload'
  | 'video_upload'
  | 'file_upload'
  | 'signature'
  | 'location'
  | 'matrix';

export interface FieldOption {
  value: string | number;
  label: string;
}

export interface FieldValidations {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface UploadConfig {
  maxSizeMb?: number;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

export interface DataSource {
  type: 'static' | 'api' | 'internal_api';
  options?: FieldOption[];
  api?: {
    url: string;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: any;
    mapping?: {
      valueField: string;
      labelField: string;
      dataPath?: string;
    };
  };
  cache?: { enabled: boolean; ttl: number };
  fallback?: FieldOption[];
}

export interface ConditionalLogic {
  action: 'show' | 'hide';
  conditions: Condition[];
}

export interface Condition {
  fieldName: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'greater_than'
    | 'less_than'
    | 'greater_than_or_equal'
    | 'less_than_or_equal'
    | 'is_empty'
    | 'is_not_empty';
  value?: string;
}

export interface SurveyResponse {
  responseId: string;
  tenantId: string;
  surveyId: string;
  respondentId: string | null;
  contextType: string | null;
  contextId: string | null;
  status: 'in_progress' | 'submitted' | 'reviewed';
  responseData: Record<string, any>;
  responseMetadata: ResponseMetadata;
  fileUploadIds: Record<string, string[]>;
  submissionVersion: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

export interface ResponseMetadata {
  userAgent?: string;
  ipAddress?: string;
  startedAt?: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  deviceType?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
