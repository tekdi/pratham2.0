import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { StatCardProps } from '../../interfaces/DashboardInterface';

// This component renders a card displaying a statistic with a title, value, and an icon.
// It accepts props for the title, value, and an icon component to display.
const StatCard: React.FC<StatCardProps> = ({ title, value, IconComponent }) => {
  const theme = useTheme();

  return (
    <Card elevation={1} sx={{ borderRadius: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography
              variant="body1"
              component="h2"
              fontWeight={700}
              mt={0.5}
              color="text.primary"
            >
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: theme.palette.primary.light,
              p: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconComponent
              sx={{ color: theme.palette.primary.contrastText, fontSize: 24 }}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
