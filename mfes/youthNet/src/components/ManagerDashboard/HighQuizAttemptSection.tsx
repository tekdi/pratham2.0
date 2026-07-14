import React from 'react';
import { Avatar, Box, Button, Paper, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { HighAttemptUser, HighQuizAttemptSectionProps } from '../../utils/Interface';
import { ATTEMPT_FILTER_OPTIONS } from '../../utils/app.config';
import { getHighAttemptLevel, getUserInitials } from '../../utils/managerDashboardHelpers';
import NoDataFound from '../common/NoDataFound';
import { getThinScrollbarSx } from '../../utils/scrollbarSx';

interface HighAttemptRowProps {
  user: HighAttemptUser;
  onViewClick: (userId: string, courseId: string) => void;
}

const HighAttemptRow: React.FC<HighAttemptRowProps> = ({ user, onViewClick }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
        <Avatar
          sx={{
            width: 36,
            height: 36,
            backgroundColor: theme.palette.warning['800'],
            color: theme.palette.text.primary,
            fontWeight: 600,
            fontSize: '13px',
          }}
        >
          {getUserInitials(user.userName)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" fontWeight={500} mb={0} sx={{ fontSize: '13px', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.userName}
          </Typography>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontSize: '11px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {user.courseName}
            </Typography>
            <Box
              sx={{
                px: 0.6,
                borderRadius: '4px',
                backgroundColor: theme.palette.secondary.light,
                fontSize: '10px',
                fontWeight: 400,
                color: theme.palette.secondary.main,
              }}
            >
              {user.language}
            </Box>
          </Stack>
        </Box>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: '12px',
            color: theme.palette.highAttemptLevelColors[getHighAttemptLevel(user.highestAttempt)],
            fontWeight: 600,
          }}
        >
          {t('MANAGER_OVERVIEW.ATTEMPTS_COUNT', { count: user.highestAttempt })}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onViewClick(user.userId, user.courseId)}
          sx={{ textTransform: 'none', fontSize: '12px', minWidth: 0, px: 1.25, borderRadius: '7px', borderColor: theme.palette.warning['700'], color: theme.palette.text.secondary }}
        >
          {t('MANAGER_OVERVIEW.VIEW')}
        </Button>
      </Stack>
    </Stack>
  );
};

const HighQuizAttemptSection: React.FC<HighQuizAttemptSectionProps> = ({
  users,
  loading,
  error,
  selectedFilter,
  onFilterChange,
  sortOrder,
  onSortOrderChange,
  onViewClick,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  let body: React.ReactNode;
  if (loading) {
    body = (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        {t('MANAGER_OVERVIEW.LOADING_SUMMARY')}
      </Typography>
    );
  } else if (error) {
    body = <NoDataFound title="MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED" />;
  } else if (users.length === 0) {
    body = <NoDataFound title="MANAGER_OVERVIEW.NO_HIGH_ATTEMPT_USERS" />;
  } else {
    body = (
      // Cap to ~5 rows tall; anything beyond that scrolls instead of growing the card
      // indefinitely (matches the fixed row height used in HighAttemptRow: avatar 36px + spacing).
      <Stack spacing={1.5} sx={{ maxHeight: 300, overflowY: 'auto', pr: 0.5, ...getThinScrollbarSx(theme) }} >
        {users.map((user) => (
          <HighAttemptRow key={`${user.userId}-${user.courseId}`} user={user} onViewClick={onViewClick} />
        ))}
      </Stack>
    );
  }

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: `1px solid ${theme.palette.warning['A100']}`, borderRadius: 2, height: '100%' }}>
      <Stack
        direction={{ xs: 'column', xl: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', xl: 'center' }}
        gap={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Stack direction="row" spacing={0.75} alignItems="center">
            <BoltIcon sx={{ fontSize: 18, color: theme.palette.dashboardStatus.highAttempts }} />
            <Typography variant="h2" sx={{ fontSize: '15px', fontWeight: 600, mb: 0 }}>
              {t('MANAGER_OVERVIEW.HIGH_ATTEMPT_TITLE')}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0 }}>
            {t('MANAGER_OVERVIEW.HIGH_ATTEMPT_SUBTITLE')}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <ToggleButtonGroup
            size="small"
            exclusive
            value={selectedFilter}
            onChange={(_e, value) => value && onFilterChange(value)}
            sx={{
              '& .MuiToggleButton-root': {
                fontSize: '12px',
                fontWeight: 600,
                px: 1.25,
                py: 0.4,
                border: `1px solid ${theme.palette.warning['700']}`,
              },
            }}
          >
            {ATTEMPT_FILTER_OPTIONS.map((option) => (
              <ToggleButton key={option} value={option}>
                {option}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Button
            size="small"
            variant="outlined"
            onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
            startIcon={sortOrder === 'desc' ? <ArrowDownwardIcon fontSize="small" /> : <ArrowUpwardIcon fontSize="small" />}
            sx={{ textTransform: 'none', fontSize: '12px', borderColor: theme.palette.warning['700'], color: theme.palette.text.secondary }}
          >
            {sortOrder === 'desc' ? t('MANAGER_OVERVIEW.SORT_HIGH_LOW') : t('MANAGER_OVERVIEW.SORT_LOW_HIGH')}
          </Button>
        </Stack>
      </Stack>

      {body}
    </Paper>
  );
};

export default HighQuizAttemptSection;
