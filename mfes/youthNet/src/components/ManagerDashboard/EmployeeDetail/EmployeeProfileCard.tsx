import React from 'react';
import { Avatar, Box, Chip, Paper, Stack, Tooltip, Typography } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { EmployeeProfileCardProps } from '../../../utils/Interface';
import { getUserInitials } from '../../../utils/managerDashboardHelpers';

const EmployeeProfileCard: React.FC<EmployeeProfileCardProps> = ({
  employeeName,
  metadata,
  email,
  customFieldValues = [],
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
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: customFieldValues.length > 0 ? 0.75 : 0 }}>
              <EmailOutlinedIcon sx={{ fontSize: 14, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 0 }}>
                {email}
              </Typography>
            </Stack>
          )}
          {customFieldValues.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={0.5}>
              {customFieldValues.map((field) => (
                <Tooltip
                  key={field.label}
                  title={t(`MANAGER_OVERVIEW.CUSTOM_FIELD_LABELS.${field.label}`, { defaultValue: field.label })}
                  arrow
                >
                  <Chip
                    label={field.value}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '11px',
                      backgroundColor: theme.palette.warning['800'],
                      color: theme.palette.text.secondary,
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                </Tooltip>
              ))}
            </Stack>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default EmployeeProfileCard;
