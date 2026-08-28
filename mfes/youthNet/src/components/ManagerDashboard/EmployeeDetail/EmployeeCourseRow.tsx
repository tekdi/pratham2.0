import React from 'react';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { EmployeeCourseRowProps } from '../../../utils/Interface';
import { getCourseStatusConfig, isHighAttempt } from '../../../utils/managerDashboardHelpers';

const EmployeeCourseRow: React.FC<EmployeeCourseRowProps> = ({ course }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const statusConfig = getCourseStatusConfig(course.status);

  return (
    <Stack
      direction={ 'row' }
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      spacing={1}
      sx={{ py: 1.25, borderBottom: `1px solid ${theme.palette.warning['800']}` }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: '4px',
            backgroundColor: course.isMandatory
              ? theme.palette.courseTypeBadge.mandatory.background
              : theme.palette.courseTypeBadge.nonMandatory.background,
            fontSize: '11px',
            fontWeight: 600,
            color: course.isMandatory
              ? theme.palette.courseTypeBadge.mandatory.color
              : theme.palette.courseTypeBadge.nonMandatory.color,
            flexShrink: 0,
          }}
        >
          {course.isMandatory ? t('MANAGER_OVERVIEW.MANDATORY') : t('MANAGER_OVERVIEW.NON_MANDATORY')}
        </Box>
        <Tooltip title={course.courseName} arrow>
          <Typography
            variant="body2"
            fontWeight={500}
            color="text.primary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mb: 0,
              textTransform: 'capitalize',
              maxWidth: 260,
            }}
          >
            {course.courseName}
          </Typography>
        </Tooltip>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
        <Box
          sx={{
            px: 1,
            py: 0.25,
            borderRadius: '4px',
            backgroundColor: theme.palette.secondary.light,
            fontSize: '11px',
            fontWeight: 500,
            color: theme.palette.secondary.main,
          }}
        >
          {course.language}
        </Box>

        {isHighAttempt(course.highestAttempt) && (
          <Box
            sx={{
              px: 1,
              py: 0.25,
              borderRadius: '4px',
              backgroundColor: theme.palette.warning['800'],
              fontSize: '11px',
              fontWeight: 500,
              color: theme.palette.dashboardStatus.highAttempts,
            }}
          >
            {t('MANAGER_OVERVIEW.ATTEMPTS_COUNT', { count: course.highestAttempt })}
          </Box>
        )}

        {statusConfig && (
          <Box
            sx={{
              px: 1.25,
              py: 0.4,
              borderRadius: '999px',
              backgroundColor:
                theme.palette.dashboardStatusBackground?.[statusConfig.colorToken] ??
                `${theme.palette.dashboardStatus[statusConfig.colorToken]}26`,
              color: theme.palette.dashboardStatus[statusConfig.colorToken],
              fontSize: '11px',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            {t(statusConfig.labelKey)}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export default EmployeeCourseRow;
