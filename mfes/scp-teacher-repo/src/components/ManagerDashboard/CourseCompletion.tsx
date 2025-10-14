import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { CourseData } from './types';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CourseCompletionProps {
  mandatoryCourses: CourseData;
  nonMandatoryCourses: CourseData;
}

const CourseCompletion: React.FC<CourseCompletionProps> = ({
  mandatoryCourses,
  nonMandatoryCourses,
}) => {
  const theme = useTheme();

  const prepareMandatoryData = (): ChartDataItem[] => [
    {
      name: 'Completed',
      value: mandatoryCourses.completed,
      color: '#4caf50',
    },
    {
      name: 'In Progress',
      value: mandatoryCourses.inProgress,
      color: '#ffc107',
    },
    {
      name: 'Overdue',
      value: mandatoryCourses.overdue,
      color: '#f44336',
    },
  ];

  const prepareNonMandatoryData = (): ChartDataItem[] => [
    {
      name: 'Completed',
      value: nonMandatoryCourses.completed,
      color: '#4caf50',
    },
    {
      name: 'In Progress',
      value: nonMandatoryCourses.inProgress,
      color: '#ffc107',
    },
    {
      name: 'Overdue',
      value: nonMandatoryCourses.overdue,
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
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                width: '80px',
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', textTransform: 'uppercase', lineHeight: 1.2 }}>
                NO. OF EMPLOYEES
              </Typography>
            </Box>
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
                    textDecoration: 'underline',
                    color: theme.palette.primary.main,
                    fontSize: '13px',
                  }}
                >
                  {item.name} : {item.value}
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
        Course Completion
      </Typography>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} sx={{ mt: 2 }}>
        {renderDonutChart(prepareMandatoryData(), 'Mandatory Courses')}
        {renderDonutChart(prepareNonMandatoryData(), 'Non Mandatory Courses')}
      </Stack>
    </Paper>
  );
};

export default CourseCompletion;
