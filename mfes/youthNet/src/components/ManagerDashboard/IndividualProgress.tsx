import React, { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { IndividualProgressProps } from '../../utils/Interface';
import { EMPLOYEES_PER_PAGE } from '../../utils/app.config';
import {
  buildIndividualProgressRows,
  buildUserCourseLearningMap,
  filterCourses,
  isMandatoryCourse,
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
  onFiltersChange,
  onPageChange,
  onViewEmployee,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  // Language / Course Type / Course Name filters narrow down which courses count toward
  // progress — they never remove an employee from the table.
  const filteredCourses = useMemo(() => filterCourses(courses, filters), [courses, filters]);

  const mandatoryCourseIds = useMemo(
    () => filteredCourses.filter(isMandatoryCourse).map((course) => course.identifier),
    [filteredCourses]
  );
  const nonMandatoryCourseIds = useMemo(
    () => filteredCourses.filter((course) => !isMandatoryCourse(course)).map((course) => course.identifier),
    [filteredCourses]
  );

  const userCourseLearningMap = useMemo(
    () => buildUserCourseLearningMap(courseLearningSummary),
    [courseLearningSummary]
  );

  const individualProgressRows = useMemo(
    () => buildIndividualProgressRows(users, mandatoryCourseIds, nonMandatoryCourseIds, userCourseLearningMap),
    [users, mandatoryCourseIds, nonMandatoryCourseIds, userCourseLearningMap]
  );

  const { visibleItems: visibleRows, totalPages } = useMemo(
    () => paginateUsers(individualProgressRows, currentPage, EMPLOYEES_PER_PAGE),
    [individualProgressRows, currentPage]
  );

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

        <CoursesFilterBar courses={courses} filters={filters} onFiltersChange={onFiltersChange} />
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
        totalEmployees={individualProgressRows.length}
        onPageChange={onPageChange}
        onViewEmployee={onViewEmployee}
      />
    </Box>
  );
};

export default IndividualProgress;
