import React from 'react';
import { Box, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { CourseRowProps } from '../../../utils/Interface';
import {
  getCourseDisplayName,
  getCourseLanguageLabel,
  getCourseTypeBadge,
} from '../../../utils/managerDashboardHelpers';
import { COURSE_STATUS_CHIP_CONFIG } from '../../../utils/app.config';
import CourseStatusChip from './CourseStatusChip';
import { useTranslation } from 'next-i18next';

const CourseRow: React.FC<CourseRowProps> = ({ course, statusCounts, onStatusClick }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const courseName = getCourseDisplayName(course, course.identifier);
  const badge = getCourseTypeBadge(course.courseType);

  return (
    <TableRow>
      <TableCell sx={{ py: 1.5 }}>
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
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.warning['800'],
          }}
        >
          {badge}
        </Box>
      </TableCell>
      <TableCell sx={{ py: 1.5, minWidth: 200 }}>
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
              maxWidth: 260,
            }}
          >
            {courseName}
          </Typography>
        </Tooltip>
      </TableCell>
      <TableCell sx={{ py: 1.5 }}>
        <Box
          sx={{
            display: 'inline-flex',
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
      </TableCell>
      {COURSE_STATUS_CHIP_CONFIG.map((statusConfig) => (
        <TableCell key={statusConfig.key} align="center" sx={{ py: 1.5 }}>
          <CourseStatusChip
            label={t(statusConfig.labelKey)}
            count={statusCounts[statusConfig.key]}
            colorToken={statusConfig.colorToken}
            onClick={() => onStatusClick(course.identifier, statusConfig.key)}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default CourseRow;
