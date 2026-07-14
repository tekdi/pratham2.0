import React from 'react';
import { Avatar, Box, Paper, Stack, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useTheme } from '@mui/material/styles';
import { EmployeeProfileCardProps } from '../../../utils/Interface';
import { getUserInitials } from '../../../utils/managerDashboardHelpers';

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({ employeeName, metadata, email }) => {
  const theme = useTheme<any>();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: 2,
        backgroundColor: 'white',
        mb: { xs: 1.5, sm: 2 },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          sx={{
            width: 56,
            height: 56,
            backgroundColor: theme.palette.warning['800'],
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: '20px',
            flexShrink: 0,
          }}
        >
          {getUserInitials(employeeName)}
        </Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h2" sx={{ fontSize: '16px', fontWeight: 600, mb: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
            {employeeName}
          </Typography>
          {email && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <EmailOutlinedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 0 }}>
                {email}
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default EmployeeProfileCard;
