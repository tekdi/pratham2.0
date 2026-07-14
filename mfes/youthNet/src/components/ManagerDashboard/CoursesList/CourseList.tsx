import React, { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CommonPagination } from '@shared-lib-v2/lib/Pagination/CommonPagination';
import { CourseListProps } from '../../../utils/Interface';
import { COURSES_PER_PAGE, EMPTY_COURSE_STATUS_COUNTS } from '../../../utils/app.config';
import { filterCourses, getCourseStatusCounts, paginateCourses } from '../../../utils/managerDashboardHelpers';
import NoDataFound from '../../common/NoDataFound';
import CoursesFilterBar from './CoursesFilterBar';
import CourseRow from './CourseRow';
import { getThinScrollbarSx } from 'mfes/youthNet/src/utils/scrollbarSx';

const CourseList: React.FC<CourseListProps> = ({
  courses,
  coursesLoading,
  coursesError,
  courseLearningSummary,
  summaryLoading,
  summaryError,
  filters,
  currentPage,
  onFiltersChange,
  onPageChange,
  onStatusClick,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  // Everything is fetched once and kept in memory — filtering/pagination is pure client-side
  // slicing, so no API call is triggered by any interaction in this component.
  const filteredCourses = useMemo(() => filterCourses(courses, filters), [courses, filters]);
  const { visibleItems: visibleCourses, totalPages } = useMemo(
    () => paginateCourses(filteredCourses, currentPage, COURSES_PER_PAGE),
    [filteredCourses, currentPage]
  );

  const isLoading = coursesLoading;
  const showEmpty = !isLoading && !coursesError && filteredCourses.length === 0;

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
          <Typography variant="body1" color={'warning.100'} fontWeight={600} sx={{ mb: 0.25 }}>
            {t('MANAGER_OVERVIEW.COURSE_LIST_TITLE')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0, maxWidth: 400 }}>
            {t('MANAGER_OVERVIEW.COURSE_LIST_SUBTITLE')}
          </Typography>
        </Box>

        <CoursesFilterBar courses={courses} filters={filters} onFiltersChange={onFiltersChange} />
      </Stack>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <Typography variant="h6">{t('MANAGER_OVERVIEW.LOADING_COURSES')}</Typography>
        </Box>
      ) : coursesError ? (
        <NoDataFound title="MANAGER_OVERVIEW.COURSES_LOAD_FAILED" />
      ) : showEmpty ? (
        <NoDataFound title="MANAGER_OVERVIEW.NO_COURSES_FOUND" />
      ) : (
        <>
          {summaryError && (
            <Box sx={{ mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: theme.palette.error.main, fontSize: '12px' }}>
                {t('MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED')}
              </Typography>
            </Box>
          )}
          {/* Horizontally scrollable, like IndividualProgress's table, so the status chips never
              wrap/crush on narrow screens — they scroll into view instead. */}
          <Box sx={{ overflowX: 'auto', ...getThinScrollbarSx(theme) }}>
            <Stack sx={{ minWidth: 900 }}>
              {visibleCourses.map((course) => (
                <CourseRow
                  key={course.identifier}
                  course={course}
                  // Counts stay all-zero (not fabricated/misleading) while the summary is still
                  // loading or failed — CourseRow/CourseStatusChip render zero-state chips, which
                  // is honest, not "wrong data" per the no-silent-zero requirement for failures.
                  statusCounts={
                    summaryLoading
                      ? EMPTY_COURSE_STATUS_COUNTS
                      : getCourseStatusCounts(course.identifier, courseLearningSummary)
                  }
                  onStatusClick={onStatusClick}
                />
              ))}
            </Stack>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{ mt: 2, pt: 1.5, borderTop: `1px solid ${theme.palette.warning['800']}` }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 0 }}>
              {(currentPage - 1) * COURSES_PER_PAGE + 1}–
              {Math.min(currentPage * COURSES_PER_PAGE, filteredCourses.length)} {t('OF')}{' '}
              {filteredCourses.length}
            </Typography>
            <CommonPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              firstLabel={t('COMMON.FIRST')}
              previousLabel={t('COMMON.PREV')}
              nextLabel={t('COMMON.NEXT')}
              lastLabel={t('COMMON.LAST')}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default CourseList;
