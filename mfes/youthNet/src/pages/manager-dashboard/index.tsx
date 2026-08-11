import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
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
  DashboardOverview,
  ManagerDashboardLoadingScreen,
} from '../../components/ManagerDashboard';
import Header from '../../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useManagerDashboardData } from '../../hooks/useManagerDashboardData';
import { useManagerDashboardUIState } from '../../hooks/useManagerDashboardUIState';
import { useTopPerformers } from '../../hooks/useTopPerformers';
import {
  AttemptSortOrder,
  CourseListFilters,
  CourseStatusKey,
  CourseStatusSelection,
  HighAttemptFilter,
} from '../../utils/Interface';
import { MANAGER_DASHBOARD_ALL_FILTER_OPTION } from '../../utils/app.config';
import {
  buildCourseById,
  buildUserById,
  filterCourseLearningSummaryForFilteredCourses,
  filterCoursesByUserCustomFilters,
  filterHighAttemptUsersByAttempt,
  filterSummaryByCourseIds,
  getCourseEntryCount,
  getSelectedCourseIds,
  getCourseUsersByStatus,
  getHighQuizAttemptUsers,
  getUniqueCourseCount,
  sortHighAttemptUsers,
} from '../../utils/managerDashboardHelpers';

// Sentinel option shown at the top of each JOB_FAMILY/PSU/EMP_GROUP dropdown — checking it selects
// every real option for that label in one go, unchecking it clears the whole filter.
const ALL_OPTION = MANAGER_DASHBOARD_ALL_FILTER_OPTION;

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
    user_custom,
    courses,
    coursesLoading,
    coursesError,
    courseLearningSummary,
    summaryLoading,
    summaryError,
    hasLoaded,
  } = useManagerDashboardData();

  console.log("##########namane courseLearningSummary",courseLearningSummary);

  // --- UI state (filters, pagination, sort) — kept in a module-level singleton via
  // `useManagerDashboardUIState` (not plain `useState`) so it survives navigating to the Employee
  // Detail Page and back, instead of resetting to defaults on that full page remount, and is
  // mirrored to sessionStorage so a hard refresh doesn't lose it either. -------------------------
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
      userFilterFamily: user_filter_family,
    },
    setUIState,
  ] = useManagerDashboardUIState();

  // Explicit picks per user_custom label (JOB_FAMILY / PSU / EMP_GROUP). A label with no entry
  // here (or an empty one) means "nothing explicitly picked yet" — the dropdown then shows and
  // filters by every option for that label, i.e. behaves as if ALL_OPTION plus every real option
  // were selected.
  const handleUserCustomFilterChange = useCallback(
    (label: string, options: string[]) => (event: SelectChangeEvent<string[]>) => {
      const { value } = event.target;
      const nextValue = typeof value === 'string' ? value.split(',') : value;

      // `user_filter_family[label]` is `undefined` only when the user hasn't touched this filter
      // yet — an explicit `[]` (every option unchecked down to none) must stay `[]`, not snap back
      // to "everything selected", so this checks presence rather than truthiness/length.
      const previouslySelected =
        user_filter_family[label] !== undefined ? user_filter_family[label] : [ALL_OPTION, ...options];
      const hadAll = previouslySelected.includes(ALL_OPTION);
      const hasAll = nextValue.includes(ALL_OPTION);

      let resolved: string[];
      if (hasAll && !hadAll) {
        // "ALL" was just checked — select every option.
        resolved = [ALL_OPTION, ...options];
      } else if (!hasAll && hadAll) {
        // "ALL" was just unchecked — clear the whole filter.
        resolved = [];
      } else {
        // An individual option was toggled — keep "ALL" in sync with full coverage.
        const withoutAll = nextValue.filter((v) => v !== ALL_OPTION);
        resolved = withoutAll.length === options.length ? [ALL_OPTION, ...withoutAll] : withoutAll;
      }

      setUIState({ userFilterFamily: { ...user_filter_family, [label]: resolved } });
    },
    [user_filter_family, setUIState]
  );

  const handleClearUserCustomFilters = useCallback(
    () => setUIState({ userFilterFamily: {} }),
    [setUIState]
  );

  // Nothing has been picked yet ⇒ every dropdown is at its "ALL" default ⇒ the filter pipeline
  // below is a no-op by construction, but skipping it entirely also means `filteredCourses` /
  // `filteredCourseLearningSummary` stay reference-equal to the hook's original `courses` /
  // `courseLearningSummary` — i.e. the "original values" the page starts from are never touched
  // until the user actually interacts with a filter.
  const hasActiveUserCustomFilter = Object.keys(user_filter_family).length > 0;

  const filteredCourses = useMemo(
    () =>
      hasActiveUserCustomFilter
        ? filterCoursesByUserCustomFilters(courses, user_filter_family)
        : courses,
    [hasActiveUserCustomFilter, courses, user_filter_family]
  );

  const filteredCourseLearningSummary = useMemo(
    () =>
      hasActiveUserCustomFilter
        ? filterCourseLearningSummaryForFilteredCourses(courseLearningSummary, filteredCourses, users)
        : courseLearningSummary,
    [hasActiveUserCustomFilter, courseLearningSummary, filteredCourses, users]
  );

  // The raw label from the API (JOB_FAMILY / PSU / EMP_GROUP) is also the option value used for
  // filtering/selection — only its on-screen display goes through translation, via
  // MANAGER_OVERVIEW.CUSTOM_FIELD_LABELS. Falls back to the raw label for anything not yet added
  // there so a new custom field label never renders blank.
  const getUserCustomFieldLabel = useCallback(
    (label: string) => t(`MANAGER_OVERVIEW.CUSTOM_FIELD_LABELS.${label}`, { defaultValue: label }),
    [t]
  );

  // Only labels that actually have at least one value get a dropdown (e.g. PSU with no values
  // never renders one). The count of *those* drives the grid split the dropdowns share evenly —
  // 3 up → 4/4/4, 2 up → 6/6, 1 up → 12 — and how many chips each can show before "+N".
  const userCustomFilterEntries = useMemo(
    () => Object.entries(user_custom || {}).filter(([, options]) => options && options.length > 0),
    [user_custom]
  );
  const userCustomFilterColumnSpan = userCustomFilterEntries.length
    ? 12 / userCustomFilterEntries.length
    : 12;
  const userCustomFilterMaxVisibleChips =
    userCustomFilterEntries.length <= 1 ? 4 : userCustomFilterEntries.length === 2 ? 2 : 1;

  // console.log("###########managerdashboard user",users);
  // console.log("###########managerdashboard courses",courses);
  // console.log("###########managerdashboard user_custom",user_custom);

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
  // Built from filteredCourses/filteredCourseLearningSummary (not the hook's raw courses/
  // courseLearningSummary) so the JOB_FAMILY/PSU/EMP_GROUP filters above flow through to every
  // tab that reads them.
  const userById = useMemo(() => buildUserById(users), [users]);
  const courseById = useMemo(() => buildCourseById(filteredCourses), [filteredCourses]);

  // High Quiz Attempt Count and Top Performers scope down to just the courses matching the
  // Course Type / Language / Course Name filters (null = no filters active = every course).
  const selectedCourseIds = useMemo(
    () => getSelectedCourseIds(filteredCourses, courseFilters),
    [filteredCourses, courseFilters]
  );
  const scopedCourseLearningSummary = useMemo(
    () => filterSummaryByCourseIds(filteredCourseLearningSummary, selectedCourseIds),
    [filteredCourseLearningSummary, selectedCourseIds]
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

  const {
    performers: topPerformers,
    loading: topPerformersLoading,
    error: topPerformersError,
    fromDate: topPerformersFromDate,
    toDate: topPerformersToDate,
    setFromDate: setTopPerformersFromDate,
    setToDate: setTopPerformersToDate,
  } = useTopPerformers(users, 5);

  const selectedStatusCourse = selectedCourseStatus ? courseById[selectedCourseStatus.courseId] : undefined;
  const selectedStatusUsers = useMemo(() => {
    if (!selectedCourseStatus) return [];
    return getCourseUsersByStatus(
      selectedCourseStatus.courseId,
      selectedCourseStatus.status,
      filteredCourseLearningSummary,
      userById
    );
  }, [selectedCourseStatus, filteredCourseLearningSummary, userById]);

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

        {!hasLoaded ? (
          <ManagerDashboardLoadingScreen
            usersLoading={usersLoading}
            usersError={usersError}
            coursesLoading={coursesLoading}
            coursesError={coursesError}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
          />
        ) : (
          <>
            {userCustomFilterEntries.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                <Grid container spacing={2} sx={{ flex: 1 }}>
                  {userCustomFilterEntries.map(([label, options]) => {
                    // Presence check, not truthiness — an explicitly emptied filter (`[]`) must
                    // render with nothing checked, not fall back to "everything selected".
                    const selected =
                      user_filter_family[label] !== undefined
                        ? user_filter_family[label]
                        : [ALL_OPTION, ...options];
                    const isAllSelected = selected.includes(ALL_OPTION);
                    const visibleChips = isAllSelected ? [] : selected.slice(0, userCustomFilterMaxVisibleChips);
                    const hiddenCount = isAllSelected ? 0 : selected.length - visibleChips.length;

                    const fieldLabel = getUserCustomFieldLabel(label);

                    return (
                      <Grid item xs={userCustomFilterColumnSpan} key={label}>
                        <FormControl size="small" fullWidth>
                          <InputLabel id={`${label}-filter-label`}>{fieldLabel}</InputLabel>
                          <Select
                            labelId={`${label}-filter-label`}
                            label={fieldLabel}
                            multiple
                            value={selected}
                            onChange={handleUserCustomFilterChange(label, options)}
                            sx={{ '& .MuiSelect-select': { display: 'flex', overflow: 'hidden' } }}
                            renderValue={() =>
                              isAllSelected ? (
                                <Chip
                                  size="small"
                                  label={t('MANAGER_OVERVIEW.ALL_CUSTOM_FIELD', { label: fieldLabel })}
                                />
                              ) : (
                                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 0.5, overflow: 'hidden' }}>
                                  {visibleChips.map((value) => (
                                    <Chip key={value} size="small" label={value} />
                                  ))}
                                  {hiddenCount > 0 && <Chip size="small" label={`+${hiddenCount}`} />}
                                </Box>
                              )
                            }
                          >
                            <MenuItem value={ALL_OPTION}>
                              <Checkbox checked={isAllSelected} />
                              <ListItemText primary="ALL" />
                            </MenuItem>
                            <Divider />
                            {options.map((option) => (
                              <MenuItem key={option} value={option}>
                                <Checkbox checked={selected.indexOf(option) > -1} />
                                <ListItemText primary={option} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    );
                  })}
                </Grid>
                <Button
                  size="small"
                  onClick={handleClearUserCustomFilters}
                  disabled={Object.keys(user_filter_family).length === 0}
                >
                  Clear
                </Button>
              </Box>
            )}
      
        {/* <DashboardHeader
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
        /> */}

        {activeTab === 'dashboard' && (
          <DashboardOverview
            users={users}
            courses={filteredCourses}
            courseLearningSummary={filteredCourseLearningSummary}
            userCustom={user_custom}
            usersLoading={usersLoading}
            usersError={usersError}
            coursesLoading={coursesLoading}
            coursesError={coursesError}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
          />
        )}

        {activeTab === 'team' && (
          <>
            <IndividualProgress
              users={users}
              courses={filteredCourses}
              courseLearningSummary={filteredCourseLearningSummary}
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
          </>
        )}

        {/*activeTab === 'courses' && (
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
        )*/}
        {activeTab === 'courses' && (
          <Grid container spacing={{ xs: 1.5, sm: 2 }}>
            <Grid item xs={12}>
              <CourseList
                courses={filteredCourses}
                coursesLoading={coursesLoading || usersLoading}
                coursesError={coursesError || usersError}
                courseLearningSummary={filteredCourseLearningSummary}
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
                loading={topPerformersLoading}
                error={topPerformersError}
                totalEmployees={users.length}
                fromDate={topPerformersFromDate}
                toDate={topPerformersToDate}
                onFromDateChange={setTopPerformersFromDate}
                onToDateChange={setTopPerformersToDate}
                onSeeAllClick={handleSeeAllEmployees}
              />
            </Grid>
          </Grid>
        )}
          </>
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
