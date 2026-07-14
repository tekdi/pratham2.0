import React from 'react';
import { Box, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { MANAGER_DASHBOARD_NAV_ITEMS } from '../../utils/app.config';
import { DashboardHeaderProps } from '../../utils/Interface';
import StatusLegend from './StatusLegend';

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  totalEmployees,
  lastUpdatedLabel,
  activeTab,
  onTabChange,
  subtitle,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.warning['A100']}`,
        backgroundColor: 'white',
        mb: { xs: 1.5, sm: 2 },
        overflow: 'hidden',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', md: 'center' }}
        spacing={1.5}
        sx={{ p: { xs: 1.5, sm: 2 } }}
      >
        <Box>
          <Typography variant="h1" sx={{ fontSize: '18px', fontWeight: 600, mb: 0.25 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
            {subtitle ?? `${t('DASHBOARD_TABS.EMPLOYEE_COUNT', { count: totalEmployees })} · ${lastUpdatedLabel}`}
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_e, value) => onTabChange(value)}
          sx={{
            minHeight: '36px',
            backgroundColor: theme.palette.warning['800'],
            borderRadius: '8px',
            p: 0.5,
            '& .MuiTabs-indicator': { display: 'none' },
          }}
        >
          {MANAGER_DASHBOARD_NAV_ITEMS.map((item) => (
            <Tab
              key={item.key}
              value={item.key}
              label={t(item.tabLabelKey)}
              sx={{
                minHeight: '32px',
                textTransform: 'none',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '6px',
                px: 2,
                color: theme.palette.text.secondary,
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  color: theme.palette.text.primary,
                  boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.15)',
                },
              }}
            />
          ))}
        </Tabs>
      </Stack>

      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.warning['A100']}`,
          px: { xs: 1.5, sm: 2 },
          py: 1.25,
        }}
      >
        <StatusLegend />
      </Box>
    </Paper>
  );
};

export default DashboardHeader;
