import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BoltIcon from '@mui/icons-material/Bolt';
import { CourseStatusChipProps } from '../../../utils/Interface';

// Chips are only clickable when they have >=1 learner — an empty status has nobody to drill
// into, so it renders as plain (non-interactive), muted text instead of a colored pill.
const CourseStatusChip: React.FC<CourseStatusChipProps> = ({ label, count, colorToken, onClick }) => {
  const theme = useTheme<any>();
  const color = theme.palette.dashboardStatus[colorToken];
  // Most statuses derive their pill background from the status color itself; a few (e.g.
  // "Completed") have an explicit background in the theme instead of the computed tint.
  const background = theme.palette.dashboardStatusBackground?.[colorToken] ?? `${color}26`;
  const isZero = count === 0;
  const clickable = Boolean(onClick) && !isZero;

  return (
    <Box
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        px: 1.25,
        py: 0.5,
        borderRadius: '999px',
        backgroundColor: isZero ? 'transparent' : background,
        cursor: clickable ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
        transition: 'filter 0.15s ease, box-shadow 0.15s ease',
        '&:hover': clickable
          ? { filter: 'brightness(0.96)', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)' }
          : undefined,
      }}
    >
      {colorToken === 'highAttempts' && (
        <BoltIcon
          sx={{ fontSize: 14, color: isZero ? theme.palette.text.disabled : color, opacity: isZero ? 0.5 : 1 }}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          fontSize: '12px',
          fontWeight: 500,
          color: isZero ? theme.palette.text.disabled : color,
          opacity: isZero ? 0.6 : 1,
          mb: 0,
        }}
      >
        {label} <b>{count}</b>
      </Typography>
    </Box>
  );
};

export default CourseStatusChip;
