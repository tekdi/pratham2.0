// Shared TypeScript interfaces for youthNet. Add new cross-component interfaces here rather
// than inlining them per-file.
import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import type { Dayjs } from 'dayjs';
// Re-exported so consumers only need to import from this one place, while the actual API
// contract (shared with the backend team / usable by other mfes) is owned by the shared-lib
// service. Imported (not just re-exported) so these names are also usable below in this file.
import type {
  CourseLearningStatus,
  CourseUserLearningSummary,
  CourseUserLearningMap,
  CourseLearningSummaryResult,
  CourseLearningSummaryRequest,
  CourseLearningSummaryApiResponse,
} from '@shared-lib-v2/utils/CourseLearningSummaryService/courseLearningSummary';

export type {
  CourseLearningStatus,
  CourseUserLearningSummary,
  CourseUserLearningMap,
  CourseLearningSummaryResult,
  CourseLearningSummaryRequest,
  CourseLearningSummaryApiResponse,
};

// --- Manager Dashboard: shared user/course lookups -----------------------------------------

// Minimal shape we rely on from the existing `fetchUserList` API response. The manager-dashboard
// team roster only returns these fields today (no department/designation on the bulk list), so
// keep this narrow and treat anything else as optional/unknown rather than widening the API.
export interface ManagerTeamUser {
  userId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  designation?: string;
  [key: string]: unknown;
}

export interface Course {
  identifier: string;
  name: string;
  englishName?: string;
  appIcon?: string;
  // The composite search API is inconsistent here — sometimes a plain string, sometimes an
  // array (e.g. ["Mandatory"]). Use `getCourseTypeValue` from managerDashboardHelpers rather
  // than reading this directly.
  courseType?: string | string[];
  language?: string[];
  // Preferred over `language` for filtering/display — a single human-readable name
  // (e.g. "Marathi", "Tamil") rather than the ISO-ish `language` array.
  contentLanguage?: string;
  [key: string]: unknown;
}

export type UserById = Record<string, ManagerTeamUser>;
export type CourseById = Record<string, Course>;

// --- Normalized status vocabulary used by the UI --------------------------------------------

// The 4 mutually-exclusive learning stages. "High attempts" is intentionally NOT one of these —
// it's an attempt-count-derived flag that can co-occur with any of the 4 (e.g. a learner can be
// "completed" AND have needed 4 attempts to get there).
export type NormalizedStatus = 'notStarted' | 'inProgress' | 'completed' | 'certificateIssued';

// All 5 chips/keys shown per course row (4 normalized statuses + the derived high-attempts flag).
export type CourseStatusKey = NormalizedStatus | 'highAttempts';

export interface CourseStatusCounts {
  notStarted: number;
  inProgress: number;
  completed: number;
  certificateIssued: number;
  highAttempts: number;
}

export interface CourseStatusChipConfig {
  key: CourseStatusKey;
  labelKey: string;
  // Key into theme.palette.dashboardStatus.
  colorToken: CourseStatusKey;
}

// --- Course List filters ---------------------------------------------------------------------

export interface CourseListFilters {
  courseType: string;
  language: string;
  // Multi-select — a course row matches if its name is in this list (empty list = no filter).
  courseNames: string[];
}

// Default value lives in app.config.ts (DEFAULT_COURSE_LIST_FILTERS) alongside the rest of the
// Manager Dashboard config constants — this file holds types only.

// --- High Quiz Attempts ------------------------------------------------------------------------

export interface HighAttemptUser {
  userId: string;
  courseId: string;
  userName: string;
  courseName: string;
  language: string;
  highestAttempt: number;
}

export type HighAttemptFilter = '3' | '4' | '5+';
export type AttemptSortOrder = 'desc' | 'asc';

// --- Top Performers ------------------------------------------------------------------------

export interface TopPerformer {
  userId: string;
  userName: string;
  certificateCount: number;
}

// --- Status Details Modal --------------------------------------------------------------------

export interface CourseStatusSelection {
  courseId: string;
  status: CourseStatusKey;
}

// --- Manager Dashboard navigation (side menu <-> header tabs) -------------------------------

export type ManagerDashboardTabKey = 'dashboard' | 'team' | 'courses';

export interface ManagerDashboardNavItem {
  key: ManagerDashboardTabKey;
  menuLabelKey: string;
  tabLabelKey: string;
}

// --- Generic filter-pill option shape (Course Type / Language / Course Name filters) --------

export interface FilterPillOption {
  value: string;
  label: string;
}

// Same shape as `FilterPillOption` — aliased rather than redeclared so the searchable dropdown
// isn't tied to Courses List naming, while still sharing one definition.
export type SearchableMultiSelectOption = FilterPillOption;

// --- Component prop types ---------------------------------------------------------------------

// One of the 3 sequential data-loading steps behind the Manager Dashboard's initial load screen —
// derived (not stored) from the loading/error booleans useManagerDashboardData already exposes;
// see ManagerDashboardLoadingScreen for how 'pending' vs 'loading' is worked out.
export type ManagerDashboardLoadStepStatus = 'pending' | 'loading' | 'done' | 'error';

export interface ManagerDashboardLoadingScreenProps {
  usersLoading: boolean;
  usersError: boolean;
  coursesLoading: boolean;
  coursesError: boolean;
  summaryLoading: boolean;
  summaryError: boolean;
}

export interface DashboardHeaderProps {
  title: string;
  totalEmployees: number;
  lastUpdatedLabel: string;
  activeTab: ManagerDashboardTabKey;
  onTabChange: (tab: ManagerDashboardTabKey) => void;
  // Overrides the default "{{count}} employees · Updated today" line — used by the Courses tab to
  // show its entry/unique-course counts instead, without a second title rendered further down.
  subtitle?: string;
}

export interface FilterPillProps {
  label: string;
  value: string;
  allLabel: string;
  options: FilterPillOption[];
  onChange: (value: string) => void;
}

export interface MultiFilterPillProps {
  label: string;
  values: string[];
  allLabel: string;
  options: FilterPillOption[];
  onChange: (values: string[]) => void;
}

export interface SearchableMultiSelectDropdownProps {
  label: string;
  values: string[];
  allLabel: string;
  options: SearchableMultiSelectOption[];
  onChange: (values: string[]) => void;
  searchPlaceholder?: string;
  noResultsLabel?: string;
}

export interface CoursesFilterBarProps {
  courses: Course[];
  filters: CourseListFilters;
  onFiltersChange: (filters: CourseListFilters) => void;
}

export interface CourseStatusChipProps {
  label: string;
  count: number;
  colorToken: CourseStatusKey;
  onClick?: () => void;
}

export interface CourseRowProps {
  course: Course;
  statusCounts: CourseStatusCounts;
  onStatusClick: (courseId: string, status: CourseStatusKey) => void;
}

export interface CourseListProps {
  courses: Course[];
  coursesLoading: boolean;
  coursesError: boolean;
  courseLearningSummary: CourseLearningSummaryResult;
  summaryLoading: boolean;
  summaryError: boolean;
  filters: CourseListFilters;
  currentPage: number;
  onFiltersChange: (filters: CourseListFilters) => void;
  onPageChange: (page: number) => void;
  onStatusClick: (courseId: string, status: CourseStatusKey) => void;
}

export interface CourseStatusModalProps {
  open: boolean;
  onClose: () => void;
  course?: Course;
  status?: CourseStatusKey;
  users: CourseLearnerEntry[];
  onUserClick: (userId: string, courseId: string) => void;
}

export interface HighQuizAttemptSectionProps {
  users: HighAttemptUser[];
  loading: boolean;
  error: boolean;
  selectedFilter: HighAttemptFilter;
  onFilterChange: (filter: HighAttemptFilter) => void;
  sortOrder: AttemptSortOrder;
  onSortOrderChange: (order: AttemptSortOrder) => void;
  onViewClick: (userId: string, courseId: string) => void;
}

export interface TopPerformersSectionProps {
  performers: TopPerformer[];
  loading: boolean;
  error: boolean;
  totalEmployees: number;
  fromDate: Dayjs | null;
  toDate: Dayjs | null;
  onFromDateChange: (date: Dayjs | null) => void;
  onToDateChange: (date: Dayjs | null) => void;
  onSeeAllClick: () => void;
}

// --- My Team / Individual Progress ------------------------------------------------------------

// Course-centric summary re-keyed by user first, built once via `buildUserCourseLearningMap` so
// per-employee lookups (mandatory/non-mandatory progress, high-attempt flags) are O(1) instead of
// re-scanning the whole `CourseLearningSummaryResult` per table cell.
export type UserCourseLearningMap = Record<string, Record<string, CourseUserLearningSummary>>;

// Same 4 mutually-exclusive stages as `CourseStatusCounts`, minus the `highAttempts` flag — My
// Team surfaces high attempts separately, under its own Flags column, not blended into progress.
export interface UserProgressCounts {
  notStarted: number;
  inProgress: number;
  completed: number;
  certificateIssued: number;
  total: number;
}

export interface EmployeeFlags {
  highAttemptCount: number;
}

export interface StatusSummaryItem {
  key: NormalizedStatus;
  count: number;
  labelKey: string;
  icon: string;
  colorToken: NormalizedStatus;
}

// Shape of one entry in a status-config array (e.g. INDIVIDUAL_PROGRESS_STATUS_CONFIG,
// COURSE_CARD_STATUS_CONFIG) — named so `getVisibleStatusSummaries`/`SegmentedProgressBar` can
// accept either config without depending on one specific constant.
export interface StatusConfigItem {
  key: NormalizedStatus;
  icon: string;
  labelKey: string;
  colorToken: NormalizedStatus;
}

// One of a user's own JOB_FAMILY/PSU/EMP_GROUP custom field values — only labels the user
// actually carries a value for are ever produced (see getUserCustomFieldChipValues), so this
// never needs an "empty" state of its own.
export interface CustomFieldChipValue {
  label: string;
  value: string;
}

export interface IndividualProgressRow {
  userId: string;
  userName: string;
  metadata: string;
  mandatoryProgress: UserProgressCounts;
  nonMandatoryProgress: UserProgressCounts;
  flags: EmployeeFlags;
  customFieldValues: CustomFieldChipValue[];
}

export interface UserCourseProgressProps {
  statusCounts: UserProgressCounts;
}

export interface IndividualProgressTableProps {
  rows: IndividualProgressRow[];
  loading: boolean;
  error: boolean;
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  onPageChange: (page: number) => void;
  onViewEmployee: (userId: string) => void;
}

export interface IndividualProgressProps {
  users: ManagerTeamUser[];
  courses: Course[];
  courseLearningSummary: CourseLearningSummaryResult;
  usersLoading: boolean;
  usersError: boolean;
  coursesLoading: boolean;
  coursesError: boolean;
  summaryLoading: boolean;
  summaryError: boolean;
  filters: CourseListFilters;
  currentPage: number;
  onFiltersChange: (filters: CourseListFilters) => void;
  onPageChange: (page: number) => void;
  onViewEmployee: (userId: string) => void;
}

// --- Course Breakdown (Courses tab) -----------------------------------------------------------

// One rendered Course Card — a single language/course-entry, not a "logical course" (the same
// logical course in EN and HI produces two of these). Reuses `UserProgressCounts` (same 4
// mutually-exclusive stages + total) so it can share `SegmentedProgressBar`/`getVisibleStatusSummaries`
// with My Team's employee progress instead of a parallel shape.
export interface CourseCardModel {
  courseId: string;
  courseName: string;
  language: string;
  category: string;
  isMandatory: boolean;
  progress: UserProgressCounts;
}

export interface SegmentedProgressBarProps {
  counts: UserProgressCounts;
  statusConfig?: StatusConfigItem[];
  height?: number;
}

export interface CourseProgressCardProps {
  course: CourseCardModel;
  // The whole card is a single click target — opens the Learners Modal for every non-zero
  // status on this course. Status summaries below the bar are informational only.
  onCardClick: () => void;
}

export interface CourseLearnerEntry {
  user: ManagerTeamUser;
  highestAttempt: number;
  issuedOn: string | null;
}

export interface CourseLearnersModalProps {
  open: boolean;
  onClose: () => void;
  course?: Course;
  courseLearningSummary: CourseLearningSummaryResult;
  userById: UserById;
  onViewEmployee: (userId: string) => void;
}

export interface CourseBreakdownListProps {
  courses: Course[];
  coursesLoading: boolean;
  coursesError: boolean;
  courseLearningSummary: CourseLearningSummaryResult;
  summaryLoading: boolean;
  summaryError: boolean;
  userById: UserById;
  filters: CourseListFilters;
  currentPage: number;
  onFiltersChange: (filters: CourseListFilters) => void;
  onPageChange: (page: number) => void;
  onViewEmployee: (userId: string) => void;
}

// --- Employee Detail Page ---------------------------------------------------------------------

// One rendered course entry for a single employee — same "one row per course+language entry"
// convention as `CourseCardModel`, just re-keyed to a specific user's status/attempt instead of
// aggregate counts.
export interface EmployeeCourseProgress {
  courseId: string;
  courseName: string;
  language: string;
  isMandatory: boolean;
  status: NormalizedStatus;
  highestAttempt: number;
}

export interface EmployeeCourseGroups {
  mandatory: EmployeeCourseProgress[];
  nonMandatory: EmployeeCourseProgress[];
}

export interface EmployeeProgressCategorySummary {
  total: number;
  mandatory: number;
  nonMandatory: number;
}

export interface EmployeeHighAttemptSummary {
  total: number;
  highestAttempt: number;
}

export interface EmployeeProgressSummary {
  certificatesIssued: EmployeeProgressCategorySummary;
  completed: EmployeeProgressCategorySummary;
  inProgress: EmployeeProgressCategorySummary;
  highAttemptCourses: EmployeeHighAttemptSummary;
}

export interface EmployeeDetailHeaderProps {
  employeeName: string;
  metadata: string;
  email?: string;
}

export interface EmployeeProfileCardProps {
  employeeName: string;
  metadata: string;
  email?: string;
  customFieldValues?: CustomFieldChipValue[];
}

export interface EmployeeSummaryCardProps {
  title: string;
  // Most callers show a raw count; the Dashboard tab's Certificate Rate tile needs a
  // pre-formatted "72%" string instead of forcing every consumer through a formatter.
  value: number | string;
  subtitle: string;
  colorToken?: CourseStatusKey;
}

export interface EmployeeSummaryCardsProps {
  summary: EmployeeProgressSummary;
}

export interface EmployeeCourseRowProps {
  course: EmployeeCourseProgress;
}

export interface EmployeeCourseGroupProps {
  titleKey: string;
  courses: EmployeeCourseProgress[];
}

export interface EmployeeCourseBreakdownProps {
  groups: EmployeeCourseGroups;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  headerExtra?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
  // Custom styling for the dialog's Paper — merged after the component's own base styles, so
  // callers can override sizing (e.g. a fixed max-width) without forking the shared shell.
  sx?: SxProps<Theme>;
}

// --- Dashboard Overview (Dashboard tab) --------------------------------------------------------

// How many team members carry a given JOB_FAMILY/PSU/EMP_GROUP value — the Dashboard tab's team
// composition charts, sorted by count desc (see getUserCustomFieldValueCounts).
export interface CustomFieldValueCount {
  value: string;
  count: number;
}

// Certificates issued in one calendar month (UTC) — see getCertificatesIssuedByMonth.
export interface MonthlyCertificateCount {
  monthKey: string; // "YYYY-MM", sortable as a plain string
  label: string; // "Jan 2026", for axis/tooltip display
  count: number;
}

// Generic Paper-card shell shared by every Dashboard tab chart — title/subtitle header plus a
// loading/error/empty slot, so each chart component only has to supply its own visualization.
export interface ChartCardProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  error?: boolean;
  isEmpty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
}

export interface StatusOverviewSectionProps {
  counts: UserProgressCounts;
}

export interface CustomFieldDistributionChartProps {
  title: string;
  data: CustomFieldValueCount[];
}

export interface TopCoursesChartProps {
  courses: CourseCardModel[];
}

export interface HighAttemptLevelsChartProps {
  counts: Record<HighAttemptFilter, number>;
}

export interface CertificatesTrendChartProps {
  data: MonthlyCertificateCount[];
}

export interface DashboardOverviewProps {
  users: ManagerTeamUser[];
  courses: Course[];
  courseLearningSummary: CourseLearningSummaryResult;
  userCustom: Record<string, string[]>;
  usersLoading: boolean;
  usersError: boolean;
  coursesLoading: boolean;
  coursesError: boolean;
  summaryLoading: boolean;
  summaryError: boolean;
}
