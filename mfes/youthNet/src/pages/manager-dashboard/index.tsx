import React, { useCallback, useMemo, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useRouter } from 'next/router';
import {
  IndividualProgress,
  DashboardHeader,
  ManagerDashboardTabKey,
  DEFAULT_MANAGER_DASHBOARD_TAB,
  isManagerDashboardTabKey,
  CourseList,
  CourseStatusModal,
  HighQuizAttemptSection,
  TopPerformersSection,
  CourseBreakdownList,
} from '../../components/ManagerDashboard';
import Header from '../../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useManagerDashboardData } from '../../hooks/useManagerDashboardData';
import { useManagerDashboardUIState } from '../../hooks/useManagerDashboardUIState';
import {
  AttemptSortOrder,
  CourseListFilters,
  CourseStatusKey,
  CourseStatusSelection,
  HighAttemptFilter,
} from '../../utils/Interface';
import {
  buildCourseById,
  buildUserById,
  filterHighAttemptUsersByAttempt,
  filterSummaryByCourseIds,
  getCourseEntryCount,
  getSelectedCourseIds,
  getCourseUsersByStatus,
  getHighQuizAttemptUsers,
  getTopPerformers,
  getUniqueCourseCount,
  sortHighAttemptUsers,
} from '../../utils/managerDashboardHelpers';

const ManagerDashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const activeTab: ManagerDashboardTabKey = isManagerDashboardTabKey(router.query.tab)
    ? (router.query.tab as ManagerDashboardTabKey)
    : DEFAULT_MANAGER_DASHBOARD_TAB;

  const handleTabChange = (tab: ManagerDashboardTabKey) => {
    router.push({
      pathname: '/manager-dashboard',
      query: tab === DEFAULT_MANAGER_DASHBOARD_TAB ? {} : { tab },
    });
  };

  // --- Overview data: users, courses, and the single learning-summary call — loaded once via the
  // shared Manager Dashboard data hook and reused by every tab, and by the Employee Detail Page
  // after navigating away from here. -------------------------------------------------------------
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
  } = useManagerDashboardData();

  // --- UI state (filters, pagination, sort) — kept in a module-level singleton via
  // `useManagerDashboardUIState` (not plain `useState`) so it survives navigating to the Employee
  // Detail Page and back, instead of resetting to defaults on that full page remount. -------------
  const [
    {
      courseFilters,
      currentCoursePage,
      selectedAttemptFilter,
      attemptSortOrder,
      teamFilters,
      teamCurrentPage,
      courseBreakdownFilters,
      courseBreakdownPage,
    },
    setUIState,
  ] = useManagerDashboardUIState();
  const [selectedCourseStatus, setSelectedCourseStatus] = useState<CourseStatusSelection | null>(null);

  const setCourseFilters = useCallback((filters: CourseListFilters) => setUIState({ courseFilters: filters }), [setUIState]);
  const setCurrentCoursePage = useCallback((page: number) => setUIState({ currentCoursePage: page }), [setUIState]);
  const setSelectedAttemptFilter = useCallback(
    (filter: HighAttemptFilter) => setUIState({ selectedAttemptFilter: filter }),
    [setUIState]
  );
  const setAttemptSortOrder = useCallback((order: AttemptSortOrder) => setUIState({ attemptSortOrder: order }), [setUIState]);
  const setTeamFilters = useCallback((filters: CourseListFilters) => setUIState({ teamFilters: filters }), [setUIState]);
  const setTeamCurrentPage = useCallback((page: number) => setUIState({ teamCurrentPage: page }), [setUIState]);
  const setCourseBreakdownFilters = useCallback(
    (filters: CourseListFilters) => setUIState({ courseBreakdownFilters: filters }),
    [setUIState]
  );
  const setCourseBreakdownPage = useCallback((page: number) => setUIState({ courseBreakdownPage: page }), [setUIState]);

  // --- Derived lookups / analytics (memoized — the raw summary is the single source of truth,
  // everything else is computed from it rather than stored separately). ----------------------
  const userById = useMemo(() => buildUserById(users), [users]);
  const courseById = useMemo(() => buildCourseById(courses), [courses]);

  // High Quiz Attempt Count and Top Performers scope down to just the courses matching the
  // Course Type / Language / Course Name filters (null = no filters active = every course).
  const selectedCourseIds = useMemo(
    () => getSelectedCourseIds(courses, courseFilters),
    [courses, courseFilters]
  );
  const scopedCourseLearningSummary = useMemo(
    () => filterSummaryByCourseIds(courseLearningSummary, selectedCourseIds),
    [courseLearningSummary, selectedCourseIds]
  );

  const highAttemptUsers = useMemo(
    () => getHighQuizAttemptUsers(scopedCourseLearningSummary, userById, courseById),
    [scopedCourseLearningSummary, userById, courseById]
  );

  const filteredHighAttemptUsers = useMemo(
    () =>
      sortHighAttemptUsers(
        filterHighAttemptUsersByAttempt(highAttemptUsers, selectedAttemptFilter),
        attemptSortOrder
      ),
    [highAttemptUsers, selectedAttemptFilter, attemptSortOrder]
  );

  const topPerformers = useMemo(
    () => getTopPerformers(scopedCourseLearningSummary, userById, 5),
    [scopedCourseLearningSummary, userById]
  );

  const selectedStatusCourse = selectedCourseStatus ? courseById[selectedCourseStatus.courseId] : undefined;
  const selectedStatusUsers = useMemo(() => {
    if (!selectedCourseStatus) return [];
    return getCourseUsersByStatus(
      selectedCourseStatus.courseId,
      selectedCourseStatus.status,
      courseLearningSummary,
      userById
    );
  }, [selectedCourseStatus, courseLearningSummary, userById]);

  const handleTeamFiltersChange = useCallback(
    (nextFilters: CourseListFilters) => {
      setTeamFilters(nextFilters);
      setTeamCurrentPage(1);
    },
    [setTeamFilters, setTeamCurrentPage]
  );

  const handleCourseBreakdownFiltersChange = useCallback(
    (nextFilters: CourseListFilters) => {
      setCourseBreakdownFilters(nextFilters);
      setCourseBreakdownPage(1);
    },
    [setCourseBreakdownFilters, setCourseBreakdownPage]
  );

  // Centralized navigation handler for every "view employee" entry point (My Team's View button,
  // the High Quiz Attempt Count's View button, and both Course Status / Course Learners modal
  // rows) — all route to the same Employee Detail Page by userId only. `activeTab` is passed as
  // `from` so the Back button can return to whichever tab the click originated from.
  const handleViewEmployee = useCallback(
    (userId: string) => {
      router.push({ pathname: '/manager-dashboard/team/[userId]', query: { userId, from: activeTab } });
    },
    [router, activeTab]
  );

  const handleCourseFiltersChange = useCallback(
    (filters: CourseListFilters) => {
      setCourseFilters(filters);
      setCurrentCoursePage(1);
    },
    [setCourseFilters, setCurrentCoursePage]
  );

  const handleStatusClick = useCallback((courseId: string, status: CourseStatusKey) => {
    setSelectedCourseStatus({ courseId, status });
  }, []);

  const handleCloseStatusModal = useCallback(() => setSelectedCourseStatus(null), []);

  // Course Status Modal rows and the High Quiz Attempt Count's View button both resolve a
  // (userId, courseId) pair, but drill down to the same employee-level detail page — the courseId
  // isn't needed there, so both forward to the single `handleViewEmployee` navigation handler.
  const handleUserClick = useCallback((userId: string) => handleViewEmployee(userId), [handleViewEmployee]);

  const handleHighAttemptViewClick = useCallback((userId: string) => handleViewEmployee(userId), [handleViewEmployee]);

  const handleSeeAllEmployees = useCallback(() => handleTabChange('team'), [router]);

  return (
    <>
    <Box>
        <Header />
      </Box>
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', p: { xs: 1, sm: 2 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 } }}>
        <DashboardHeader
          title={
            activeTab === 'team'
              ? t('MANAGER_OVERVIEW.MY_TEAM_TITLE')
              : activeTab === 'courses'
              ? t('MANAGER_OVERVIEW.COURSE_BREAKDOWN_TITLE')
              : t('TEAM_LEARNING_OVERVIEW')
          }
          subtitle={
            activeTab === 'courses'
              ? t('MANAGER_OVERVIEW.COURSE_BREAKDOWN_SUBTITLE', {
                  entries: getCourseEntryCount(courses),
                  unique: getUniqueCourseCount(courses),
                })
              : undefined
          }
          totalEmployees={users.length}
          lastUpdatedLabel={t('DASHBOARD_TABS.UPDATED_TODAY')}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === 'dashboard' && (
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12}>
              <CourseList
                courses={courses}
                coursesLoading={coursesLoading || usersLoading}
                coursesError={coursesError || usersError}
                courseLearningSummary={courseLearningSummary}
                summaryLoading={summaryLoading}
                summaryError={summaryError}
                filters={courseFilters}
                currentPage={currentCoursePage}
                onFiltersChange={handleCourseFiltersChange}
                onPageChange={setCurrentCoursePage}
                onStatusClick={handleStatusClick}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <HighQuizAttemptSection
                users={filteredHighAttemptUsers}
                loading={summaryLoading}
                error={summaryError}
                selectedFilter={selectedAttemptFilter}
                onFilterChange={setSelectedAttemptFilter}
                sortOrder={attemptSortOrder}
                onSortOrderChange={setAttemptSortOrder}
                onViewClick={handleHighAttemptViewClick}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TopPerformersSection
                performers={topPerformers}
                loading={summaryLoading}
                error={summaryError}
                totalEmployees={users.length}
                onSeeAllClick={handleSeeAllEmployees}
              />
            </Grid>
          </Grid>
        )}

        {activeTab === 'team' && (
          <IndividualProgress
            users={users}
            courses={courses}
            courseLearningSummary={courseLearningSummary}
            usersLoading={usersLoading}
            usersError={usersError}
            coursesLoading={coursesLoading}
            coursesError={coursesError}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
            filters={teamFilters}
            currentPage={teamCurrentPage}
            onFiltersChange={handleTeamFiltersChange}
            onPageChange={setTeamCurrentPage}
            onViewEmployee={handleViewEmployee}
          />
        )}

        {activeTab === 'courses' && (
          <CourseBreakdownList
            courses={courses}
            coursesLoading={coursesLoading || usersLoading}
            coursesError={coursesError || usersError}
            courseLearningSummary={courseLearningSummary}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
            userById={userById}
            filters={courseBreakdownFilters}
            currentPage={courseBreakdownPage}
            onFiltersChange={handleCourseBreakdownFiltersChange}
            onPageChange={setCourseBreakdownPage}
            onViewEmployee={handleViewEmployee}
          />
        )}
      </Container>
    </Box>

    <CourseStatusModal
      open={Boolean(selectedCourseStatus)}
      onClose={handleCloseStatusModal}
      course={selectedStatusCourse}
      status={selectedCourseStatus?.status}
      users={selectedStatusUsers}
      onUserClick={handleUserClick}
    />
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
export default ManagerDashboard;
