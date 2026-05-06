export type TeacherSurveyStatus = 'none' | 'draft' | 'submitted';

export interface TeacherContextRow {
  id: string;
  label: string;
  subtitle?: string;
}

export interface TeacherHubFilterState {
  search: string;
  cohortId?: string;
}
