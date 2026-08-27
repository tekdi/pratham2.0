import React, { useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CommonPagination } from '@shared-lib-v2/lib/Pagination/CommonPagination';
import { CourseBreakdownListProps } from '../../../utils/Interface';
import { COURSES_PER_PAGE, COURSE_LANGUAGE_OPTIONS } from '../../../utils/app.config';
import { filterCourses, getCourseCardModels, paginateCourses } from '../../../utils/managerDashboardHelpers';
import NoDataFound from '../../common/NoDataFound';
import CoursesFilterBar from '../CoursesList/CoursesFilterBar';
import CourseProgressCard from './CourseProgressCard';
import CourseLearnersModal from './CourseLearnersModal';

// Course-centric counterpart to the Overview's `CourseList` — same courses/summary data, same
// filters/pagination helpers, but rendered as Course Cards with a segmented progress bar instead
// of status-chip rows. No API calls: everything here is derived from props already fetched once
// at the page level. The "Course Breakdown" title/count lives in the shared `DashboardHeader`
// (via its `subtitle` override) — not repeated here — so this component starts at "Filter courses".
const CourseBreakdownList: React.FC<CourseBreakdownListProps> = ({
  courses,
  coursesLoading,
  coursesError,
  courseLearningSummary,
  summaryLoading,
  summaryError,
  userById,
  filters,
  currentPage,
  onFiltersChange,
  onPageChange,
  onViewEmployee,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  // Minimal modal selection state only — the learner list itself is derived on demand, not stored.
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const languageLabel =
    COURSE_LANGUAGE_OPTIONS.find((option) => option.value === filters.language)?.label ??
    t('MANAGER_OVERVIEW.ALL_LANGUAGES').toLowerCase();
  const courseTypeLabel = filters.courseType || t('MANAGER_OVERVIEW.ALL_TYPES').toLowerCase();

  const filteredCourses = useMemo(() => filterCourses(courses, filters), [courses, filters]);
  const { visibleItems: visibleCourses, totalPages } = useMemo(
    () => paginateCourses(filteredCourses, currentPage, COURSES_PER_PAGE),
    [filteredCourses, currentPage]
  );
  const courseCards = useMemo(
    () => getCourseCardModels(visibleCourses, courseLearningSummary),
    [visibleCourses, courseLearningSummary]
  );

  // Loading/error gates cover both courses and the summary — a course card without status counts
  // isn't a valid partial render, it's misleading zero data.
  const isLoading = coursesLoading || summaryLoading;
  const showEmpty = !isLoading && !coursesError && filteredCourses.length === 0;

  const selectedCourse = selectedCourseId ? courses.find((course) => course.identifier === selectedCourseId) : undefined;

  const handleOpenCourse = (courseId: string) => setSelectedCourseId(courseId);
  const handleCloseModal = () => setSelectedCourseId(null);

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
        sx={{ mb: 1 }}
      >
        <Box>
          <Typography variant="body1" color="warning.100" fontWeight={600} sx={{ mb: 0.25 }}>
            {t('MANAGER_OVERVIEW.FILTER_COURSES_TITLE')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0, maxWidth: 480 }}>
            {t('MANAGER_OVERVIEW.FILTER_COURSES_SUBTITLE')}
          </Typography>
        </Box>

        <CoursesFilterBar courses={courses} filters={filters} onFiltersChange={onFiltersChange} />
      </Stack>

      {!isLoading && !coursesError && (
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 2 }}>
          {t('MANAGER_OVERVIEW.SHOWING_COURSE_ENTRIES', {
            count: filteredCourses.length,
            language: languageLabel,
            courseType: courseTypeLabel,
          })}
        </Typography>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px',
          }}
        >
          <Typography variant="h6">
            {t('MANAGER_OVERVIEW.LOADING_COURSES')}
          </Typography>
        </Box>
      ) : coursesError ? (
        <NoDataFound title="MANAGER_OVERVIEW.COURSES_LOAD_FAILED" />
      ) : summaryError ? (
        <NoDataFound title="MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED" />
      ) : showEmpty ? (
        <NoDataFound title="MANAGER_OVERVIEW.NO_COURSES_FOUND" />
      ) : (
        <>
          <Stack spacing={1.5}>
            {courseCards.map((card) => (
              <CourseProgressCard
                key={card.courseId}
                course={card}
                onCardClick={() => handleOpenCourse(card.courseId)}
              />
            ))}
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
            sx={{
              mt: 2,
              pt: 1.5,
              borderTop: `1px solid ${theme.palette.warning['800']}`,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '13px', mb: 0 }}
            >
              {(currentPage - 1) * COURSES_PER_PAGE + 1}–
              {Math.min(currentPage * COURSES_PER_PAGE, filteredCourses.length)}{' '}
              {t('OF')} {filteredCourses.length}
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

      <CourseLearnersModal
        open={Boolean(selectedCourseId)}
        onClose={handleCloseModal}
        course={selectedCourse}
        courseLearningSummary={courseLearningSummary}
        userById={userById}
        onViewEmployee={onViewEmployee}
      />
    </Box>
  );
};

export default CourseBreakdownList;
