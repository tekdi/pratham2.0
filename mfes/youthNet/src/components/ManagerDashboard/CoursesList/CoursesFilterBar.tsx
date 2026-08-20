import React, { useMemo } from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CoursesFilterBarProps, FilterPillOption } from '../../../utils/Interface';
import { DEFAULT_COURSE_LIST_FILTERS, COURSE_LANGUAGE_OPTIONS } from '../../../utils/app.config';
import {
  getCourseDisplayName,
  getCourseLanguageLabel,
  getCourseLanguageName,
  getCourseTypeValue,
} from '../../../utils/managerDashboardHelpers';
import SearchableMultiSelectDropdown from '../../common/SearchableMultiSelectDropdown';
import FilterPill from './FilterPill';

const CoursesFilterBar: React.FC<CoursesFilterBarProps> = ({ courses, filters, onFiltersChange }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  // All courses are already loaded (no backend pagination), so filter option lists are derived
  // directly from them instead of a separate lookup request.
  const courseTypeOptions: FilterPillOption[] = useMemo(() => {
    const types = new Set(courses.map((c) => getCourseTypeValue(c.courseType)).filter(Boolean));
    return Array.from(types).map((type) => ({
      value: type,
      label: type.toLowerCase() === 'optional' ? t('MANAGER_OVERVIEW.NON_MANDATORY') : type,
    }));
  }, [courses, t]);

  // EN/HI are always offered even before any such course has loaded; any other language present
  // in the fetched courses (e.g. Marathi, Tamil) is appended using its raw name as the label.
  const courseLanguageOptions: FilterPillOption[] = useMemo(() => {
    const options = new Map<string, string>(COURSE_LANGUAGE_OPTIONS.map((option) => [option.value, option.label]));
    courses.forEach((course) => {
      const name = getCourseLanguageName(course);
      const code = getCourseLanguageLabel(course).toLowerCase();
      if (!options.has(code)) options.set(code, name);
    });
    return Array.from(options.entries()).map(([value, label]) => ({ value, label }));
  }, [courses]);

  // Scoped to the currently selected Course Type / Language, so the Course Name list never
  // offers a name that couldn't actually match those filters.
  const courseNameOptions: FilterPillOption[] = useMemo(() => {
    const names = courses
      .filter((course) => {
        if (filters.courseType && getCourseTypeValue(course.courseType) !== filters.courseType) return false;
        if (filters.language && getCourseLanguageLabel(course).toLowerCase() !== filters.language.toLowerCase()) {
          return false;
        }
        return true;
      })
      .map((course) => getCourseDisplayName(course, ''))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
    return Array.from(new Set(names)).map((name) => ({ value: name, label: name }));
  }, [courses, filters.courseType, filters.language]);

  const isFiltered =
    filters.courseType !== DEFAULT_COURSE_LIST_FILTERS.courseType ||
    filters.language !== DEFAULT_COURSE_LIST_FILTERS.language ||
    filters.courseNames.length > 0;

  const handleReset = () => onFiltersChange({ ...DEFAULT_COURSE_LIST_FILTERS });

  // Course Type / Language are "parent" filters — changing either one can make some of the
  // already-selected Course Names invalid (they were picked under the old type/language), so
  // drop only the ones that no longer match instead of wiping the whole Course Name selection.
  const applyParentFilterChange = (nextFilters: typeof filters) => {
    const stillValidNames = filters.courseNames.filter((name) =>
      courses.some((course) => {
        if (getCourseDisplayName(course, '') !== name) return false;
        if (nextFilters.courseType && getCourseTypeValue(course.courseType) !== nextFilters.courseType) {
          return false;
        }
        if (
          nextFilters.language &&
          getCourseLanguageLabel(course).toLowerCase() !== nextFilters.language.toLowerCase()
        ) {
          return false;
        }
        return true;
      })
    );
    onFiltersChange({ ...nextFilters, courseNames: stillValidNames });
  };

  return (
    <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap" rowGap={1}>
      <FilterPill
        label={t('MANAGER_OVERVIEW.FILTER_COURSE_TYPE')}
        value={filters.courseType}
        allLabel={t('MANAGER_OVERVIEW.ALL_TYPES')}
        options={courseTypeOptions}
        onChange={(value) => applyParentFilterChange({ ...filters, courseType: value })}
      />

      <FilterPill
        label={t('MANAGER_OVERVIEW.FILTER_LANGUAGE')}
        value={filters.language}
        allLabel={t('MANAGER_OVERVIEW.ALL_LANGUAGES')}
        options={courseLanguageOptions}
        onChange={(value) => applyParentFilterChange({ ...filters, language: value })}
      />

      <SearchableMultiSelectDropdown
        label={t('MANAGER_OVERVIEW.FILTER_COURSE_NAME')}
        values={filters.courseNames}
        allLabel={t('MANAGER_OVERVIEW.ALL_COURSE_NAMES')}
        options={courseNameOptions}
        onChange={(values) => onFiltersChange({ ...filters, courseNames: values })}
        searchPlaceholder={t('MANAGER_OVERVIEW.SEARCH_COURSE_NAME')}
      />

      <Tooltip title={t('MANAGER_OVERVIEW.RESET')} arrow>
        <Box
          onClick={isFiltered ? handleReset : undefined}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1,
            py: 0.75,
            borderRadius: '7px',
            cursor: isFiltered ? 'pointer' : 'default',
            color: isFiltered ? theme.palette.text.secondary : theme.palette.text.disabled,
            bgcolor: isFiltered ? theme.palette.warning['800'] : theme.palette.warning['700'],
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': isFiltered ? { color: theme.palette.text.primary } : undefined,
          }}
        >
          <RestartAltIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: '13px', fontWeight: 600, mb: 0 }}>
            {t('MANAGER_OVERVIEW.RESET')}
          </Typography>
        </Box>
      </Tooltip>
    </Stack>
  );
};

export default CoursesFilterBar;
