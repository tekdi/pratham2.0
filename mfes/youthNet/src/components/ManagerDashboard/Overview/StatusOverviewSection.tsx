import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { StatusOverviewSectionProps } from '../../../utils/Interface';
import { COURSE_CARD_STATUS_CONFIG } from '../../../utils/app.config';
import { getProgressSegmentPercentage, getVisibleStatusSummaries } from '../../../utils/managerDashboardHelpers';
import SegmentedProgressBar from '../SegmentedProgressBar';
import ChartCard from './ChartCard';

// Part-to-whole composition reads best as a single stacked bar, not a pie — this reuses the same
// SegmentedProgressBar every course card / employee row already uses, just full-width and taller,
// with a written legend (color + label + count + %) underneath so identity is never color-alone.
const StatusOverviewSection: React.FC<StatusOverviewSectionProps> = ({ counts }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const summaries = getVisibleStatusSummaries(counts, COURSE_CARD_STATUS_CONFIG);

  return (
    <ChartCard
      title={t('MANAGER_OVERVIEW.STATUS_OVERVIEW_TITLE')}
      subtitle={t('MANAGER_OVERVIEW.STATUS_OVERVIEW_SUBTITLE')}
      isEmpty={counts.total === 0}
      emptyLabel="MANAGER_OVERVIEW.NO_COURSES_FOUND"
    >
      <SegmentedProgressBar counts={counts} statusConfig={COURSE_CARD_STATUS_CONFIG} height={14} />
      <Stack direction="row" flexWrap="wrap" rowGap={1.5} columnGap={3} sx={{ mt: 2 }}>
        {summaries.map((summary) => (
          <Stack key={summary.key} direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: theme.palette.dashboardStatus[summary.colorToken],
                flexShrink: 0,
              }}
            />
            <Typography variant="body2" sx={{ fontSize: '13px' }}>
              {t(summary.labelKey)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
              {summary.count} ({getProgressSegmentPercentage(summary.count, counts.total).toFixed(0)}%)
            </Typography>
          </Stack>
        ))}
      </Stack>
    </ChartCard>
  );
};

export default StatusOverviewSection;
