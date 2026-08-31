import React, { useEffect, useMemo } from 'react';
import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { IndividualProgressProps } from '../../utils/Interface';
import { EMPLOYEES_PER_PAGE } from '../../utils/app.config';
import {
  buildIndividualProgressRows,
  buildUserCourseLearningMap,
  filterCourses,
  filterIndividualProgressRowsBySearchTerm,
  paginateUsers,
} from '../../utils/managerDashboardHelpers';
import CoursesFilterBar from './CoursesList/CoursesFilterBar';
import IndividualProgressTable from './IndividualProgressTable';

// Team-member-centric view of the same Users/Courses/Course Learning Summary data the Overview
// tab uses — no separate API calls, no separate mock, no separate transformation. Course-centric
// summary is inverted once (`buildUserCourseLearningMap`) and everything below is pure client-side
// filtering/pagination on data that's already in memory.
const IndividualProgress: React.FC<IndividualProgressProps> = ({
  users,
  courses,
  courseLearningSummary,
  usersLoading,
  usersError,
  coursesLoading,
  coursesError,
  summaryLoading,
  summaryError,
  filters,
  currentPage,
  searchTerm,
  onFiltersChange,
  onPageChange,
  onSearchTermChange,
  onViewEmployee,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  // Language / Course Type / Course Name filters narrow down which courses count toward
  // progress — they never remove an employee from the table. Eligibility (does this course even
  // apply to a given user's JOB_FAMILY/PSU/EMP_GROUP) is applied per user, inside
  // buildIndividualProgressRows, since it differs from row to row.
  const filteredCourses = useMemo(() => filterCourses(courses, filters), [courses, filters]);

  const userCourseLearningMap = useMemo(
    () => buildUserCourseLearningMap(courseLearningSummary),
    [courseLearningSummary]
  );

  const individualProgressRows = useMemo(
    () => buildIndividualProgressRows(users, filteredCourses, userCourseLearningMap),
    [users, filteredCourses, userCourseLearningMap]
  );

  // The name search box DOES remove non-matching employees from the table (unlike the Course
  // Type/Language/Course Name filters above, which only narrow which courses count).
  const searchedRows = useMemo(
    () => filterIndividualProgressRowsBySearchTerm(individualProgressRows, searchTerm),
    [individualProgressRows, searchTerm]
  );

  const { visibleItems: visibleRows, totalPages } = useMemo(
    () => paginateUsers(searchedRows, currentPage, EMPLOYEES_PER_PAGE),
    [searchedRows, currentPage]
  );

  // Narrowing a filter (the top-of-page Job Family/PSU/Group Membership row, or this search box)
  // can shrink the result set enough that the page you were on no longer exists — e.g. sitting on
  // page 4 of a larger list, then a filter change leaves only 2 pages, renders a blank page instead
  // of silently clamping back. Snap back to the last real page (or page 1 if now empty) whenever
  // that happens, rather than requiring every filter's own change handler to know about every other
  // filter that could also affect the row count.
  useEffect(() => {
    if (currentPage > totalPages) onPageChange(Math.max(1, totalPages));
  }, [currentPage, totalPages, onPageChange]);

  const isLoading = usersLoading || coursesLoading;
  const hasError = usersError || coursesError;
  // The employee list and progress bars can render as soon as users/courses are ready — only the
  // per-course status distribution depends on the summary, so a summary failure/slow-load doesn't
  // block the whole table, it's surfaced as an inline notice instead (matches Course List pattern).

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        border: `1px solid ${theme.palette.warning['A100']}`,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', xl: 'center' }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="body1" color="warning.100" fontWeight={600} sx={{ mb: 0.25 }}>
            {t('MANAGER_OVERVIEW.MY_TEAM_TITLE')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0, maxWidth: 480 }}>
            {t('MANAGER_OVERVIEW.MY_TEAM_SUBTITLE')}
          </Typography>
        </Box>

        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" rowGap={1}>
          <CoursesFilterBar courses={courses} filters={filters} onFiltersChange={onFiltersChange} />
          <TextField
            size="small"
            placeholder={t('MANAGER_OVERVIEW.SEARCH_EMPLOYEE_NAME')}
            value={searchTerm}
            onChange={(event) => onSearchTermChange(event.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 220 }}
          />
        </Stack>
      </Stack>

      {summaryError && !isLoading && !hasError && (
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="body2" sx={{ color: theme.palette.error.main, fontSize: '12px' }}>
            {t('MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED')}
          </Typography>
        </Box>
      )}

      <IndividualProgressTable
        rows={visibleRows}
        loading={isLoading}
        error={hasError}
        currentPage={currentPage}
        totalPages={totalPages}
        totalEmployees={searchedRows.length}
        onPageChange={onPageChange}
        onViewEmployee={onViewEmployee}
      />
    </Box>
  );
};

export default IndividualProgress;
