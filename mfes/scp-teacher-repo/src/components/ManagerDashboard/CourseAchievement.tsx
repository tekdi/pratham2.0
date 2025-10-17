import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { AchievementData } from './types';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CourseAchievementProps {
  mandatoryCourses: AchievementData;
  nonMandatoryCourses: AchievementData;
}

const CourseAchievement: React.FC<CourseAchievementProps> = ({
  mandatoryCourses,
  nonMandatoryCourses,
}) => {
  const prepareMandatoryData = (): ChartDataItem[] => [
    {
      name: '100% Completed',
      value: mandatoryCourses.completed100,
      color: '#4caf50',
    },
    {
      name: '70-99% Completed',
      value: mandatoryCourses.completed70to99,
      color: '#2196f3',
    },
    {
      name: '50-69% Completed',
      value: mandatoryCourses.completed50to69,
      color: '#ff9800',
    },
    {
      name: '< 50% Completed',
      value: mandatoryCourses.completedBelow50,
      color: '#f44336',
    },
  ];

  const prepareNonMandatoryData = (): ChartDataItem[] => [
    {
      name: '100% Completed',
      value: nonMandatoryCourses.completed100,
      color: '#4caf50',
    },
    {
      name: '70-99% Completed',
      value: nonMandatoryCourses.completed70to99,
      color: '#2196f3',
    },
    {
      name: '50-69% Completed',
      value: nonMandatoryCourses.completed50to69,
      color: '#ff9800',
    },
    {
      name: '< 50% Completed',
      value: nonMandatoryCourses.completedBelow50,
      color: '#f44336',
    },
  ];

  const renderDonutChart = (data: ChartDataItem[], title: string) => {
    const backgroundData = [{ value: 100 }];
    
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          <Box sx={{ position: 'relative', height: { xs: 120, sm: 150 }, width: { xs: 120, sm: 150 }, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={backgroundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  dataKey="value"
                  startAngle={0}
                  endAngle={360}
                  fill="#e0e0e0"
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          <Stack spacing={1} sx={{ flex: 1 }}>
            {data.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ cursor: 'pointer' }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    fontSize: { xs: '12px', sm: '13px' },
                  }}
                >
                  {item.name}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
        Course Achievement
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
        {renderDonutChart(prepareMandatoryData(), 'Mandatory Courses')}
        {renderDonutChart(prepareNonMandatoryData(), 'Non Mandatory Courses')}
      </Stack>
    </Paper>
  );
};

export default CourseAchievement;
