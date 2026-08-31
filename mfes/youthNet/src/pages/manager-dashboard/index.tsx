import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
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
import {
  buildCourseById,
  buildUserById,
  filterCourseLearningSummaryForFilteredCourses,
  filterCoursesByUserCustomFilters,
  filterHighAttemptUsersByAttempt,
  filterSummaryByCourseIds,
  filterUsersByCustomFilters,
  getActiveUserCustomFilters,
  getCourseEntryCount,
  getSelectedCourseIds,
  getCourseUsersByStatus,
  getHighQuizAttemptUsers,
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
    user_custom,
    courses,
    coursesLoading,
    coursesError,
    courseLearningSummary,
    summaryLoading,
    summaryError,
    hasLoaded,
  } = useManagerDashboardData();

  console.log("##########manager dashboard users",users);
  console.log("##########manager dashboard user_custom",user_custom);
  console.log("##########manager dashboard courses",courses);
  console.log("##########manager dashboard courseLearningSummary",courseLearningSummary);

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
      teamSearchTerm,
      courseBreakdownFilters,
      courseBreakdownPage,
      userFilterFamily: user_filter_family,
    },
    setUIState,
  ] = useManagerDashboardUIState();

  // Explicit picks per user_custom label (JOB_FAMILY / PSU / EMP_GROUP). No "ALL" sentinel — the
  // dropdown's own checkboxes are the real options, and a label with no entry here means "nothing
  // explicitly picked yet", which the render/filter logic below treats the same as every option
  // being checked (see the default fallback to the full `options` list).
  const handleUserCustomFilterChange = useCallback(
    (label: string) => (event: SelectChangeEvent<string[]>) => {
      const { value } = event.target;
      const resolved = typeof value === 'string' ? value.split(',') : value;
      setUIState({ userFilterFamily: { ...user_filter_family, [label]: resolved } });
    },
    [user_filter_family, setUIState]
  );

  const handleClearUserCustomFilters = useCallback(
    () => setUIState({ userFilterFamily: {} }),
    [setUIState]
  );

  // Resets ONE label back to genuinely untouched (removes its key entirely, rather than setting it
  // to `[]` or the full option list) — the only way to undo a single-option label's pick (e.g.
  // Group Membership with just "None"), since re-checking its one box can never distinguish itself
  // from the untouched default the way a multi-option label's full re-check can. Without this, a
  // single-option label picked once stays an invisible, permanent restriction until the page-wide
  // Clear wipes every other filter along with it too.
  const handleResetUserCustomFilter = useCallback(
    (label: string) => {
      const nextUserFilterFamily = { ...user_filter_family };
      delete nextUserFilterFamily[label];
      setUIState({ userFilterFamily: nextUserFilterFamily });
    },
    [user_filter_family, setUIState]
  );

  // Whether any label actually restricts results right now — untouched or re-checked back up to
  // every real option both mean "no restriction", per `getActiveUserCustomFilters`. Checking
  // `Object.keys(user_filter_family).length` instead would stay "active" forever after the first
  // interaction, even once every dropdown is fully re-checked — that reapplies the per-user
  // course-eligibility narrowing in `filterCourseLearningSummaryForFilteredCourses` for no reason
  // and silently drops enrollments that should still count.
  const hasActiveUserCustomFilter = getActiveUserCustomFilters(user_filter_family, user_custom).length > 0;

  // Step A for the Dashboard/Courses tabs — a course survives only if ITS OWN declared audience
  // overlaps the values actually picked in the top filters (see filterCoursesByUserCustomFilters).
  const filteredCourses = useMemo(
    () =>
      hasActiveUserCustomFilter
        ? filterCoursesByUserCustomFilters(courses, user_filter_family, user_custom)
        : courses,
    [hasActiveUserCustomFilter, courses, user_filter_family, user_custom]
  );

  // The Dashboard tab's employee-count/distribution stats and the My Team tab's roster read from
  // `users` directly (not from filteredCourseLearningSummary), so they need their own narrowing by
  // the same top-of-page filters — otherwise only the course-derived numbers move when a filter
  // changes and "Total Employees" / My Team's list stay stuck on the full team.
  const filteredUsers = useMemo(
    () =>
      hasActiveUserCustomFilter ? filterUsersByCustomFilters(users, user_filter_family, user_custom) : users,
    [hasActiveUserCustomFilter, users, user_filter_family, user_custom]
  );

  // Dashboard + Courses tab summary — scoped to `filteredCourses` (courses whose OWN tags match
  // the selected filter values) AND `filteredUsers` (not the full org-wide roster), so a course's
  // status breakdown (e.g. "Not started: 54") only counts the same filtered employees "Total
  // Employees" already reflects, instead of quietly including people outside the current filter.
  const filteredCourseLearningSummary = useMemo(
    () =>
      hasActiveUserCustomFilter
        ? filterCourseLearningSummaryForFilteredCourses(courseLearningSummary, filteredCourses, filteredUsers)
        : courseLearningSummary,
    [hasActiveUserCustomFilter, courseLearningSummary, filteredCourses, filteredUsers]
  );

  // My Team tab summary — deliberately scoped to the FULL, unfiltered `courses` (not
  // `filteredCourses`) alongside `filteredUsers`: once an employee matches the top filter, the
  // courses that count toward THEIR progress are whichever ones THEY are personally eligible for
  // (their own JOB_FAMILY/PSU/EMP_GROUP values against each course's declared audience, see
  // isUserEligibleForCourse) — not narrowed a second time down to only courses that also happen to
  // match the exact values picked in the filter. A course tagged only with a Group Membership the
  // employee genuinely holds, even if Group Membership isn't what's currently selected, still
  // belongs on their own row.
  const teamCourseLearningSummary = useMemo(
    () =>
      hasActiveUserCustomFilter
        ? filterCourseLearningSummaryForFilteredCourses(courseLearningSummary, courses, filteredUsers)
        : courseLearningSummary,
    [hasActiveUserCustomFilter, courseLearningSummary, courses, filteredUsers]
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
  const setTeamSearchTerm = useCallback((term: string) => setUIState({ teamSearchTerm: term }), [setUIState]);
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

  const handleTeamSearchTermChange = useCallback(
    (term: string) => {
      setTeamSearchTerm(term);
      setTeamCurrentPage(1);
    },
    [setTeamSearchTerm, setTeamCurrentPage]
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
                    // render with nothing checked, not fall back to "everything selected". No
                    // "ALL" sentinel: the untouched default is just every real option selected.
                    const isTouched = user_filter_family[label] !== undefined;
                    const selected = isTouched ? user_filter_family[label] : options;
                    // Mirrors getActiveUserCustomFilters's own "does this label restrict anything"
                    // check exactly (untouched, or re-selected back to every option, regardless of
                    // how many options exist) — so the cosmetic chip is always consistent with what
                    // actually is/isn't restricting results. An explicitly emptied label still
                    // shows its real (blank) state, since that's a genuine active choice.
                    const isAllSelected = !isTouched || selected.length >= options.length;
                    const visibleChips = isAllSelected ? [] : selected.slice(0, userCustomFilterMaxVisibleChips);
                    const hiddenCount = isAllSelected ? 0 : selected.length - visibleChips.length;

                    const fieldLabel = getUserCustomFieldLabel(label);

                    // Only shown once this specific label carries explicit state — makes an
                    // otherwise-easy-to-miss "touched" filter discoverable at a glance (on top of
                    // the chip above now always showing its real value instead of "All X"), and
                    // lets it be undone on its own instead of via the page-wide Clear.
                    const isActiveFilter = isTouched && !isAllSelected;

                    return (
                      <Grid item xs={userCustomFilterColumnSpan} key={label}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FormControl size="small" fullWidth>
                            <InputLabel id={`${label}-filter-label`}>{fieldLabel}</InputLabel>
                            <Select
                              labelId={`${label}-filter-label`}
                              label={fieldLabel}
                              multiple
                              value={selected}
                              onChange={handleUserCustomFilterChange(label)}
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
                              {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                  <Checkbox checked={selected.indexOf(option) > -1} />
                                  <ListItemText primary={option} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          {isActiveFilter && (
                            <IconButton
                              size="small"
                              onClick={() => handleResetUserCustomFilter(label)}
                              aria-label={t('MANAGER_OVERVIEW.RESET_CUSTOM_FIELD', { label: fieldLabel })}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Box>
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
            users={filteredUsers}
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
              users={filteredUsers}
              courses={courses}
              courseLearningSummary={teamCourseLearningSummary}
              usersLoading={usersLoading}
              usersError={usersError}
              coursesLoading={coursesLoading}
              coursesError={coursesError}
              summaryLoading={summaryLoading}
              summaryError={summaryError}
              filters={teamFilters}
              currentPage={teamCurrentPage}
              searchTerm={teamSearchTerm}
              onFiltersChange={handleTeamFiltersChange}
              onPageChange={setTeamCurrentPage}
              onSearchTermChange={handleTeamSearchTermChange}
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
