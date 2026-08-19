import React, { useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { DashboardOverviewProps } from '../../../utils/Interface';
import {
  buildCourseById,
  buildUserById,
  getAggregateStatusCounts,
  getCertificatesIssuedByMonth,
  getHighAttemptLevelCounts,
  getHighQuizAttemptUsers,
  getTopCoursesByEnrollment,
  getUserCustomFieldValueCounts,
  toProgressCounts,
} from '../../../utils/managerDashboardHelpers';
import EmployeeSummaryCard from '../EmployeeDetail/EmployeeSummaryCard';
import NoDataFound from '../../common/NoDataFound';
import StatusOverviewSection from './StatusOverviewSection';
import CustomFieldDistributionChart from './CustomFieldDistributionChart';
import TopCoursesChart from './TopCoursesChart';
import HighAttemptLevelsChart from './HighAttemptLevelsChart';
import CertificatesTrendChart from './CertificatesTrendChart';

const TOP_COURSES_LIMIT = 6;

// Dashboard tab — team-wide analytics built entirely from the same 4 values the Team/Courses tabs
// already use (users, courses, courseLearningSummary, user_custom), post the JOB_FAMILY/PSU/
// EMP_GROUP filters at the top of the page. Every number here is a pure derivation of those 4
// inputs — no separate fetch, no local UI-filter state of its own.
const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  users,
  courses,
  courseLearningSummary,
  userCustom,
  usersLoading,
  usersError,
  coursesLoading,
  coursesError,
  summaryLoading,
  summaryError,
}) => {
  const { t } = useTranslation();

  const loading = usersLoading || coursesLoading || summaryLoading;
  const hasError = usersError || coursesError || summaryError;

  const userById = useMemo(() => buildUserById(users), [users]);
  const courseById = useMemo(() => buildCourseById(courses), [courses]);

  const aggregateCounts = useMemo(
    () => toProgressCounts(getAggregateStatusCounts(courses, courseLearningSummary)),
    [courses, courseLearningSummary]
  );

  const highAttemptUsers = useMemo(
    () => getHighQuizAttemptUsers(courseLearningSummary, userById, courseById),
    [courseLearningSummary, userById, courseById]
  );
  const highAttemptLevelCounts = useMemo(() => getHighAttemptLevelCounts(highAttemptUsers), [highAttemptUsers]);
  // Same learner can appear against multiple courses — count people, not (user, course) pairs.
  const highAttemptLearnerCount = useMemo(
    () => new Set(highAttemptUsers.map((user) => user.userId)).size,
    [highAttemptUsers]
  );

  const topCourses = useMemo(
    () => getTopCoursesByEnrollment(courses, courseLearningSummary, TOP_COURSES_LIMIT),
    [courses, courseLearningSummary]
  );

  const certificatesByMonth = useMemo(
    () => getCertificatesIssuedByMonth(courseLearningSummary),
    [courseLearningSummary]
  );

  // Only labels user_custom actually has values for get a chart — same "don't show an empty PSU
  // dropdown" rule the top-of-page filters already follow (userCustom is the same data those
  // filters are built from; getUserCustomFieldValueCounts re-derives per-value counts from users,
  // since user_custom itself only tracks the distinct values, not how many people hold each one).
  const customFieldDistributions = useMemo(
    () =>
      Object.entries(userCustom || {})
        .filter(([, values]) => values && values.length > 0)
        .map(([label]) => ({
          label,
          title: t(`MANAGER_OVERVIEW.CUSTOM_FIELD_LABELS.${label}`, { defaultValue: label }),
          data: getUserCustomFieldValueCounts(users, label),
        })),
    [users, userCustom, t]
  );

  // Exact percentage, not rounded to a whole number — e.g. 34.72%, not 35%.
  const certificateRate =
    aggregateCounts.total > 0
      ? ((aggregateCounts.certificateIssued / aggregateCounts.total) * 100).toFixed(2)
      : '0.00';

  if (loading) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
        {t('MANAGER_OVERVIEW.LOADING_SUMMARY')}
      </Typography>
    );
  }

  if (hasError) {
    return <NoDataFound title="MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED" />;
  }

  return (
    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('TOTAL_EMPLOYEES')}
          value={users.length}
          subtitle={t('MANAGER_OVERVIEW.OVERVIEW_TOTAL_EMPLOYEES_SUBTITLE')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.OVERVIEW_TOTAL_COURSES')}
          value={courses.length}
          subtitle={t('MANAGER_OVERVIEW.OVERVIEW_TOTAL_COURSES_SUBTITLE')}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.OVERVIEW_CERTIFICATE_RATE')}
          value={`${certificateRate}%`}
          subtitle={t('MANAGER_OVERVIEW.OVERVIEW_CERTIFICATE_RATE_SUBTITLE', {
            count: aggregateCounts.certificateIssued,
            total: aggregateCounts.total,
          })}
          colorToken="certificateIssued"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <EmployeeSummaryCard
          title={t('MANAGER_OVERVIEW.OVERVIEW_HIGH_ATTEMPT_LEARNERS')}
          value={highAttemptLearnerCount}
          subtitle={t('MANAGER_OVERVIEW.OVERVIEW_HIGH_ATTEMPT_LEARNERS_SUBTITLE')}
          colorToken="highAttempts"
        />
      </Grid>

      <Grid item xs={12}>
        <StatusOverviewSection counts={aggregateCounts} />
      </Grid>

      {customFieldDistributions.map((entry) => (
        <Grid item xs={12} md={6} key={entry.label}>
          <CustomFieldDistributionChart title={entry.title} data={entry.data} />
        </Grid>
      ))}

      <Grid item xs={12} md={6}>
        <TopCoursesChart courses={topCourses} />
      </Grid>
      <Grid item xs={12} md={6}>
        <HighAttemptLevelsChart counts={highAttemptLevelCounts} />
      </Grid>

      <Grid item xs={12}>
        <CertificatesTrendChart data={certificatesByMonth} />
      </Grid>
    </Grid>
  );
};

export default DashboardOverview;
