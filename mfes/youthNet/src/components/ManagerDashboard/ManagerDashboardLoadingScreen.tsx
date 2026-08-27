import React from 'react';
import { Box, CircularProgress, LinearProgress, Paper, Stack, Typography, Zoom } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ManagerDashboardLoadStepStatus, ManagerDashboardLoadingScreenProps } from '../../utils/Interface';

interface Step {
  key: string;
  labelKey: string;
  status: ManagerDashboardLoadStepStatus;
}

const STATUS_KEY: Record<ManagerDashboardLoadStepStatus, string> = {
  pending: 'MANAGER_OVERVIEW.LOADING_SCREEN_STATUS_PENDING',
  loading: 'MANAGER_OVERVIEW.LOADING_SCREEN_STATUS_LOADING',
  done: 'MANAGER_OVERVIEW.LOADING_SCREEN_STATUS_DONE',
  error: 'MANAGER_OVERVIEW.LOADING_SCREEN_STATUS_ERROR',
};

const StepIcon: React.FC<{ status: ManagerDashboardLoadStepStatus; color: string }> = ({ status, color }) => {
  const theme = useTheme<any>();

  if (status === 'loading') {
    return <CircularProgress size={18} thickness={5} sx={{ color }} />;
  }
  if (status === 'error') {
    return (
      <Zoom in>
        <ErrorOutlineIcon sx={{ fontSize: 20, color: theme.palette.error.main }} />
      </Zoom>
    );
  }
  if (status === 'done') {
    return (
      <Zoom in>
        <CheckCircleIcon sx={{ fontSize: 20, color: theme.palette.dashboardStatus.certificateIssued }} />
      </Zoom>
    );
  }
  // pending — hasn't started yet, waiting for an earlier step to finish first.
  return <FiberManualRecordIcon sx={{ fontSize: 10, color: theme.palette.warning['600'] }} />;
};

// Shown in place of the whole Manager Dashboard (filters + tab content) until
// useManagerDashboardData's 3 sequential fetches (users -> courses -> learning summary) have all
// settled — a step only ever shows "loading" once every step before it is done, matching the
// hook's actual sequential execution, not just "is its own flag true".
const ManagerDashboardLoadingScreen: React.FC<ManagerDashboardLoadingScreenProps> = ({
  usersLoading,
  usersError,
  coursesLoading,
  coursesError,
  summaryLoading,
  summaryError,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  const usersStatus: ManagerDashboardLoadStepStatus = usersError ? 'error' : usersLoading ? 'loading' : 'done';
  const coursesStatus: ManagerDashboardLoadStepStatus = usersLoading
    ? 'pending'
    : coursesError
    ? 'error'
    : coursesLoading
    ? 'loading'
    : 'done';
  const summaryStatus: ManagerDashboardLoadStepStatus =
    usersLoading || coursesLoading ? 'pending' : summaryError ? 'error' : summaryLoading ? 'loading' : 'done';

  const steps: Step[] = [
    { key: 'users', labelKey: 'MANAGER_OVERVIEW.LOADING_SCREEN_STEP_USERS', status: usersStatus },
    { key: 'courses', labelKey: 'MANAGER_OVERVIEW.LOADING_SCREEN_STEP_COURSES', status: coursesStatus },
    { key: 'summary', labelKey: 'MANAGER_OVERVIEW.LOADING_SCREEN_STEP_SUMMARY', status: summaryStatus },
  ];
  const doneCount = steps.filter((step) => step.status === 'done' || step.status === 'error').length;
  const progress = (doneCount / steps.length) * 100;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, sm: 5 },
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: 2,
        maxWidth: 460,
        mx: 'auto',
        mt: { xs: 4, sm: 8 },
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mx: 'auto',
          mb: 2.5,
          backgroundColor: theme.palette.primary.light,
          '@keyframes dashboardLoadingPulse': {
            '0%': { transform: 'scale(1)', boxShadow: `0 0 0 0 ${theme.palette.primary.light}` },
            '70%': { transform: 'scale(1.06)', boxShadow: `0 0 0 12px transparent` },
            '100%': { transform: 'scale(1)', boxShadow: `0 0 0 0 transparent` },
          },
          animation: 'dashboardLoadingPulse 2.2s ease-in-out infinite',
        }}
      >
        <InsightsOutlinedIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
      </Box>

      <Typography variant="h2" sx={{ fontSize: '18px', fontWeight: 600, mb: 0.75 }}>
        {t('MANAGER_OVERVIEW.LOADING_SCREEN_TITLE')}
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            ml: 0.5,
            verticalAlign: 'bottom',
            '& span': {
              width: 4,
              height: 4,
              mx: '1px',
              borderRadius: '50%',
              display: 'inline-block',
              backgroundColor: theme.palette.text.primary,
              animation: 'dashboardLoadingDot 1.4s ease-in-out infinite',
            },
            '@keyframes dashboardLoadingDot': {
              '0%, 80%, 100%': { opacity: 0.2, transform: 'translateY(0)' },
              '40%': { opacity: 1, transform: 'translateY(-2px)' },
            },
            '& span:nth-of-type(2)': { animationDelay: '0.2s' },
            '& span:nth-of-type(3)': { animationDelay: '0.4s' },
          }}
        >
          <span />
          <span />
          <span />
        </Box>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 3 }}>
        {t('MANAGER_OVERVIEW.LOADING_SCREEN_SUBTITLE')}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        className="dashboard-loading-progress"
        sx={{
          height: 6,
          borderRadius: 3,
          mb: 3,
          // globals.css forces .MuiLinearProgress-root/-bar colors with `!important` app-wide;
          // the extra class name raises specificity so this override actually wins.
          '&.dashboard-loading-progress.MuiLinearProgress-root': {
            backgroundColor: `${theme.palette.warning['800']} !important`,
          },
          '&.dashboard-loading-progress .MuiLinearProgress-bar': {
            borderRadius: 3,
            backgroundColor: `${theme.palette.primary.main} !important`,
          },
        }}
      />

      <Stack spacing={1.75} sx={{ textAlign: 'left' }}>
        {steps.map((step) => (
          <Stack key={step.key} direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box sx={{ width: 20, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <StepIcon status={step.status} color={theme.palette.primary.main} />
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '13px',
                  fontWeight: step.status === 'loading' ? 600 : 500,
                  color: step.status === 'pending' ? theme.palette.text.secondary : theme.palette.text.primary,
                }}
              >
                {t(step.labelKey)}
              </Typography>
            </Stack>
            <Typography
              variant="caption"
              sx={{
                fontSize: '11px',
                fontWeight: 500,
                color:
                  step.status === 'error'
                    ? theme.palette.error.main
                    : step.status === 'done'
                    ? theme.palette.dashboardStatus.certificateIssued
                    : theme.palette.text.secondary,
              }}
            >
              {t(STATUS_KEY[step.status])}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
};

export default ManagerDashboardLoadingScreen;
