import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Container, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import Header from '../../../components/Header';
import {
  EmployeeCourseBreakdown,
  EmployeeProfileCard,
  EmployeeSummaryCards,
} from '../../../components/ManagerDashboard';
import NoDataFound from '../../../components/common/NoDataFound';
import { useManagerDashboardData } from '../../../hooks/useManagerDashboardData';
import { ManagerDashboardTabKey } from '../../../utils/Interface';
import {
  buildUserById,
  getEmployeeCourseProgress,
  getEmployeeProgressSummary,
  getUserCustomFieldChipValues,
  getUserDisplayName,
  groupEmployeeCoursesByType, isManagerDashboardTabKey
} from '../../../utils/managerDashboardHelpers';

const EmployeeDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme<any>();
  const userId = typeof router.query.userId === 'string' ? router.query.userId : undefined;
  const fromTab: ManagerDashboardTabKey = isManagerDashboardTabKey(router.query.from)
    ? (router.query.from as ManagerDashboardTabKey)
    : 'team';

  // A direct URL hit or a hard refresh loses the in-memory shared cache (it's a module-level
  // singleton, not persisted storage) — rather than dead-ending on "go back to the dashboard",
  // re-fetch the same Users/Courses/Course Learning Summary the dashboard itself loads, so this
  // page also works as a standalone deep link.
  const {
    users,
    usersLoading,
    usersError,
    courses,
    coursesLoading,
    coursesError,
    courseLearningSummary,
    summaryLoading,
    summaryError,
    hasLoaded,
  } = useManagerDashboardData();

  const userById = useMemo(() => buildUserById(users), [users]);
  const employee = userId ? userById[userId] : undefined;

  const employeeCourses = useMemo(
    () => (userId ? getEmployeeCourseProgress(userId, courses, courseLearningSummary, employee) : []),
    [userId, courses, courseLearningSummary, employee]
  );
  const employeeCourseGroups = useMemo(() => groupEmployeeCoursesByType(employeeCourses), [employeeCourses]);
  const employeeProgressSummary = useMemo(() => getEmployeeProgressSummary(employeeCourses), [employeeCourses]);

  const handleBackToTeam = useCallback(() => {
    router.push({
      pathname: '/manager-dashboard',
      query: fromTab === 'dashboard' ? {} : { tab: fromTab },
    });
  }, [router, fromTab]);

  const isLoading = !router.isReady || usersLoading || coursesLoading || summaryLoading;
  const dataUnavailable = hasLoaded && (usersError || coursesError || summaryError);

  let body: React.ReactNode;
  if (!userId) {
    body = <NoDataFound title="MANAGER_OVERVIEW.EMPLOYEE_NOT_FOUND" />;
  } else if (isLoading) {
    body = (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
        <Typography variant="h6">{t('MANAGER_OVERVIEW.LOADING_TEAM')}</Typography>
      </Box>
    );
  } else if (dataUnavailable) {
    body = <NoDataFound title="MANAGER_OVERVIEW.DASHBOARD_DATA_UNAVAILABLE" />;
  } else if (!employee) {
    body = <NoDataFound title="MANAGER_OVERVIEW.EMPLOYEE_NOT_FOUND" />;
  } else {
    const employeeName = getUserDisplayName(employee, userId);
    const metadata = employee.designation || employee.role || '';
    const email = typeof employee.email === 'string' ? employee.email : undefined;
    const customFieldValues = getUserCustomFieldChipValues(employee);

    body = (
      <>
        <EmployeeProfileCard
          employeeName={employeeName}
          metadata={metadata}
          email={email}
          customFieldValues={customFieldValues}
        />
        <EmployeeSummaryCards summary={employeeProgressSummary} />
        <EmployeeCourseBreakdown groups={employeeCourseGroups} />
      </>
    );
  }

  return (
    <>
      <Box>
        <Header />
      </Box>
      <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
        <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ArrowBackIcon fontSize="small" />}
            onClick={handleBackToTeam}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '13px',
              borderRadius: '8px',
              borderColor: theme.palette.warning['A100'],
              color: theme.palette.text.primary,
              backgroundColor: 'white',
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            {t('MANAGER_OVERVIEW.BACK_TO_TEAM')}
          </Button>

          {body}
        </Container>
      </Box>
    </>
  );
};

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default EmployeeDetailPage;
