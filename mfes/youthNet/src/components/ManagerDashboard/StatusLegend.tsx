import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

const StatusDot: React.FC<{ color: string }> = ({ color }) => (
  <Box
    sx={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      backgroundColor: color,
      flexShrink: 0,
    }}
  />
);

const StatusLegend: React.FC = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const dashboardStatus = theme.palette.dashboardStatus;

  const statuses = [
    { color: dashboardStatus.notStarted, label: t('DASHBOARD_TABS.STATUS_NOT_STARTED') },
    { color: dashboardStatus.inProgress, label: t('DASHBOARD_TABS.STATUS_IN_PROGRESS') },
    { color: dashboardStatus.completed, label: t('DASHBOARD_TABS.STATUS_COMPLETED') },
    { color: dashboardStatus.certificateIssued, label: t('DASHBOARD_TABS.STATUS_CERTIFICATE_ISSUED') },
  ];

  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      alignItems="center"
      rowGap={1}
      gap={1}
    >
      {statuses.map((status) => (
        <Stack key={status.label} direction="row" alignItems="center" spacing={0.75}>
          <StatusDot color={status.color} />
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 0 }}>
            {status.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default StatusLegend;
