// Export all Manager Dashboard components
export { default as CourseCompletion } from './CourseCompletion';
export { default as CourseAllocation } from './CourseAllocation';
export { default as CourseAchievement } from './CourseAchievement';
export { default as TopPerformers } from './TopPerformers';
export { default as UserCard } from './UserCard';
export { default as IndividualProgress } from './IndividualProgress';
export { default as IndividualProgressTable } from './IndividualProgressTable';
export { default as UserCourseProgress } from './UserCourseProgress';
export { default as EmployeeFlags } from './EmployeeFlags';
export { default as AssignCourseModal } from './AssignCourseModal';
export { default as DashboardHeader } from './DashboardHeader';
export { default as StatusLegend } from './StatusLegend';
export { default as HighQuizAttemptSection } from './HighQuizAttemptSection';
export { default as TopPerformersSection } from './TopPerformersSection';
export { default as SegmentedProgressBar } from './SegmentedProgressBar';
export { default as ManagerDashboardLoadingScreen } from './ManagerDashboardLoadingScreen';
export * from './CoursesList';
export * from './CourseBreakdown';
export * from './EmployeeDetail';
export * from './Overview';

// Export types
export * from './types';

// Manager Dashboard navigation: types live in utils/Interface.ts, config values in
// utils/app.config.ts, the classifier helper in utils/managerDashboardHelpers.ts — re-exported
// here so existing `from '../../components/ManagerDashboard'` imports keep working.
export type { ManagerDashboardTabKey, ManagerDashboardNavItem } from '../../utils/Interface';
export { MANAGER_DASHBOARD_NAV_ITEMS, DEFAULT_MANAGER_DASHBOARD_TAB } from '../../utils/app.config';
export { isManagerDashboardTabKey } from '../../utils/managerDashboardHelpers';

