import React from 'react';
import { Avatar, Box, Button, Paper, Stack, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TopPerformersSectionProps } from '../../utils/Interface';
import { getUserInitials } from '../../utils/managerDashboardHelpers';
import NoDataFound from '../common/NoDataFound';

const TopPerformersSection: React.FC<TopPerformersSectionProps> = ({
  performers,
  loading,
  error,
  totalEmployees,
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onSeeAllClick,
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
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="h2"
            sx={{ fontSize: '15px', fontWeight: 600, mb: 0 }}
          >
            {t('MANAGER_OVERVIEW.TOP_PERFORMERS_TITLE')}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: '12px', mb: 0 }}
          >
            {t('MANAGER_OVERVIEW.TOP_PERFORMERS_SUBTITLE')}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={onSeeAllClick}
          sx={{
            textTransform: 'none',
            fontSize: '12px',
            minWidth: 0,
            px: 1.25,
            borderRadius: '7px',
            borderColor: theme.palette.warning['700'],
            color: theme.palette.text.secondary,
          }}
        >
          {t('MANAGER_OVERVIEW.SEE_ALL_EMPLOYEES', { count: totalEmployees })}
        </Button>
      </Stack>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mb: 2 }}>
          <DatePicker
            label={t('MANAGER_OVERVIEW.FROM_DATE', 'From date')}
            value={fromDate}
            onChange={onFromDateChange}
            format="DD-MMM-YYYY"
            maxDate={toDate ?? undefined}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
          <DatePicker
            label={t('MANAGER_OVERVIEW.TO_DATE', 'To date')}
            value={toDate}
            onChange={onToDateChange}
            format="DD-MMM-YYYY"
            minDate={fromDate ?? undefined}
            slotProps={{ textField: { size: 'small', fullWidth: true } }}
          />
        </Stack>
      </LocalizationProvider>

      {loading ? (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ py: 2, textAlign: 'center' }}
        >
          {t('MANAGER_OVERVIEW.LOADING_SUMMARY')}
        </Typography>
      ) : error ? (
        <NoDataFound title="MANAGER_OVERVIEW.SUMMARY_LOAD_FAILED" />
      ) : performers.length === 0 ? (
        <NoDataFound title="MANAGER_OVERVIEW.NO_TOP_PERFORMERS" />
      ) : (
        <Stack spacing={1.5}>
          {performers.map((performer, index) => (
            <Stack
              key={performer.userId}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1.5}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{ minWidth: 0 }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor: '#eaf3de',
                      color: '#3b6d11',
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {getUserInitials(performer.userName)}
                  </Avatar>
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    {index === 0 && (
                      <EmojiEventsIcon
                        sx={{
                          fontSize: 16,
                          color: theme.palette.primary.main,
                        }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ fontSize: '13px' }}
                      mb="0"
                      textTransform={'capitalize'}
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {performer.userName}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontSize: '11px' }}
                  >
                    {t('MANAGER_OVERVIEW.CERTIFICATES_ISSUED', {
                      count: performer.certificateCount,
                    })}
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="body1"
                fontWeight={600}
                sx={{
                  color: theme.palette.dashboardStatus.certificateIssued,
                  fontSize: '12px',
                }}
              >
                {performer.certificateCount}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Paper>
  );
};

export default TopPerformersSection;
