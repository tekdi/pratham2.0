import React from 'react';
import { Paper, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { EmployeeSummaryCardProps } from '../../../utils/Interface';

const EmployeeSummaryCard: React.FC<EmployeeSummaryCardProps> = ({ title, value, subtitle, colorToken }) => {
  const theme = useTheme<any>();
  const valueColor = colorToken ? theme.palette.dashboardStatus[colorToken] : theme.palette.text.primary;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, sm: 2 },
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: 2,
        backgroundColor: 'white',
        height: '100%',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h2" sx={{ fontSize: '28px', fontWeight: 600, mb: 0.5, color: valueColor }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mb: 0 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
};

export default EmployeeSummaryCard;
