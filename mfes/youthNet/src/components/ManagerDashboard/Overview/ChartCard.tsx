import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { ChartCardProps } from '../../../utils/Interface';
import NoDataFound from '../../common/NoDataFound';

// Generic Paper-card shell shared by every Dashboard tab chart — same border/padding/title style
// as TopPerformersSection/EmployeeSummaryCard, so the new tab visually matches Team/Courses.
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  loading = false,
  error = false,
  isEmpty = false,
  emptyLabel = 'MANAGER_OVERVIEW.NO_DATA_FOR_CHART',
  children,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ fontSize: '15px', fontWeight: 600, mb: 0 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0 }}>
            {subtitle}
          </Typography>
        )}
      </Box>

      {loading ? (
        <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
          {t('MANAGER_OVERVIEW.LOADING_SUMMARY')}
        </Typography>
      ) : error ? (
        <NoDataFound title="MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED" />
      ) : isEmpty ? (
        <NoDataFound title={emptyLabel} />
      ) : (
        children
      )}
    </Paper>
  );
};

export default ChartCard;
