import React from 'react';
import { Box } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { SegmentedProgressBarProps } from '../../utils/Interface';
import { getProgressSegmentPercentage, getVisibleStatusSummaries } from '../../utils/managerDashboardHelpers';

// Generic proportional status bar shared by Employee Course Progress (My Team) and Course Team
// Progress (Courses) — both work off the same `UserProgressCounts` shape, so the segment math and
// markup are written once instead of duplicated per page.
const SegmentedProgressBar: React.FC<SegmentedProgressBarProps> = ({ counts, statusConfig, height = 8 }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const summaries = getVisibleStatusSummaries(counts, statusConfig);

  const tooltipContent = (
    <Box>
      {summaries.map((summary) => (
        <Box key={summary.key} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: theme.palette.dashboardStatus[summary.colorToken],
              mr: 1,
            }}
          />
          <span>
            {t(summary.labelKey, { count: summary.count })} (
            {getProgressSegmentPercentage(summary.count, counts.total).toFixed(1)}%)
          </span>
        </Box>
      ))}
    </Box>
  );

  return (
    <Tooltip title={tooltipContent} arrow placement="bottom">
      <Box
        sx={{
          width: '100%',
          height,
          display: 'flex',
          borderRadius: 0.5,
          overflow: 'hidden',
          backgroundColor: theme.palette.dashboardStatus.notStarted,
          cursor: 'pointer',
        }}
      >
        {summaries.map((summary) => (
          <Box
            key={summary.key}
            sx={{
              width: `${getProgressSegmentPercentage(summary.count, counts.total)}%`,
              backgroundColor: theme.palette.dashboardStatus[summary.colorToken],
            }}
          />
        ))}
      </Box>
    </Tooltip>
  );
};

export default SegmentedProgressBar;
