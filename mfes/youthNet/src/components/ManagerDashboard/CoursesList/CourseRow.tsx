import React from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CourseRowProps } from '../../../utils/Interface';
import {
  getCourseDisplayName,
  getCourseLanguageLabel,
  getCourseTypeBadge,
} from '../../../utils/managerDashboardHelpers';
import { COURSE_STATUS_CHIP_CONFIG } from '../../../utils/app.config';
import CourseStatusChip from './CourseStatusChip';

const CourseRow: React.FC<CourseRowProps> = ({ course, statusCounts, onStatusClick }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const courseName = getCourseDisplayName(course, course.identifier);
  const badge = getCourseTypeBadge(course.courseType);

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={1.5}
      sx={{
        py: 1.5,
        borderBottom: `1px solid ${theme.palette.warning['800']}`,
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        sx={{ minWidth: 220, flexShrink: 0 }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            flexShrink: 0,
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.warning['800'],
          }}
        >
          {badge}
        </Box>
        <Tooltip title={courseName} arrow>
          <Typography
            variant="body1"
            fontWeight={500}
            color={'warning.100'}
            sx={{
              fontSize: '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 220,
            }}
          >
            {courseName}
          </Typography>
        </Tooltip>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ flexShrink: 0 }}
      >
        <Box
          sx={{
            px: 1,
            py: 0.4,
            borderRadius: '4px',
            backgroundColor: theme.palette.secondary.light,
            fontSize: '11px',
            fontWeight: 500,
            color: theme.palette.secondary.main,
          }}
        >
          {getCourseLanguageLabel(course)}
        </Box>
        {COURSE_STATUS_CHIP_CONFIG.map((statusConfig) => (
          <CourseStatusChip
            key={statusConfig.key}
            label={t(statusConfig.labelKey)}
            count={statusCounts[statusConfig.key]}
            colorToken={statusConfig.colorToken}
            onClick={() => onStatusClick(course.identifier, statusConfig.key)}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default CourseRow;
