import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { EmployeeFlags as EmployeeFlagsType } from '../../utils/Interface';
import { HIGH_ATTEMPT_FLAG_ICON } from '../../utils/app.config';

// Kept as its own small component (rather than inline JSX per row) so additional flag types can
// be added later without touching the table/row markup.
const EmployeeFlags: React.FC<{ flags: EmployeeFlagsType }> = ({ flags }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  if (flags.highAttemptCount === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0 }}>
        —
      </Typography>
    );
  }

  const color = theme.palette.highAttemptLevelColors['3'];

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: '5px',
        py: '1px',
        borderRadius: '7px',
        backgroundColor: `${color}26`,
        border: `1px solid ${color}`,
        whiteSpace: 'nowrap',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '12px', fontWeight: 500, color, mb: 0 }}>
        {HIGH_ATTEMPT_FLAG_ICON} {t('MANAGER_OVERVIEW.HIGH_ATTEMPT_FLAG', { count: flags.highAttemptCount })}
      </Typography>
    </Box>
  );
};

export default EmployeeFlags;
