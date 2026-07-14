import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { UserCourseProgressProps } from '../../utils/Interface';
import { getVisibleStatusSummaries } from '../../utils/managerDashboardHelpers';
import SegmentedProgressBar from './SegmentedProgressBar';

// Maps each status key to a real MUI icon (in place of the plain ✓/◆/▶/○ glyphs) for a richer,
// more polished look — same mapping as the Course Card's status summary line.
const STATUS_ICON_COMPONENTS: Record<string, React.ComponentType<{ sx?: object }>> = {
  certificateIssued: VerifiedIcon,
  completed: TaskAltIcon,
  inProgress: PlayCircleFilledIcon,
  notStarted: RadioButtonUncheckedIcon,
};

// Segmented status bar + non-zero status summary for one employee's course progress — used for
// both Mandatory and Non-Mandatory columns in the My Team table, so the segment/summary logic is
// written once instead of duplicated per column.
const UserCourseProgress: React.FC<UserCourseProgressProps> = ({ statusCounts }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const summaries = getVisibleStatusSummaries(statusCounts);

  if (statusCounts.total === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0 }}>
        {t('MANAGER_OVERVIEW.NO_COURSES_FOUND')}
      </Typography>
    );
  }

  return (
    <Box sx={{ minWidth: 160 }}>
      <SegmentedProgressBar counts={statusCounts} />

      <Stack direction="row" flexWrap="wrap" columnGap={1.25} rowGap={0.25} sx={{ mt: 0.5 }}>
        {summaries.map((summary) => {
          const StatusIcon = STATUS_ICON_COMPONENTS[summary.colorToken];
          return (
            <Stack key={summary.key} direction="row" spacing={0.4} alignItems="center">
              {StatusIcon && (
                <StatusIcon sx={{ fontSize: 12, color: theme.palette.dashboardStatus[summary.colorToken] }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  fontSize: '10px',
                  color: theme.palette.dashboardStatus[summary.colorToken],
                  mb: 0,
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              >
                {t(summary.labelKey, { count: summary.count })}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Box>
  );
};

export default UserCourseProgress;
