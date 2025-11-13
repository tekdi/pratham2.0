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
interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}
interface CourseStatus {
  userId: string;
  courseId: string;
  status: 'completed' | 'inprogress';
}
interface CourseCompletionProps {
  mandatoryCourses: CourseStatus[];
  nonMandatoryCourses: CourseStatus[];
}
const CourseCompletion: React.FC<CourseCompletionProps> = ({
  mandatoryCourses,
  nonMandatoryCourses,
}) => {
  const theme = useTheme();
  const prepareMandatoryData = (): ChartDataItem[] => {
    const completed = mandatoryCourses.filter(course => course.status === 'completed').length;
    const inProgress = mandatoryCourses.filter(course => course.status === 'inprogress').length;
    return [
      {
        name: 'Completed',
        value: completed,
        color: '#4CAF50',
      },
      {
        name: 'In Progress',
        value: inProgress,
        color: '#FFC107',
      },
    ];
  };
  const prepareNonMandatoryData = (): ChartDataItem[] => {
    const completed = nonMandatoryCourses.filter(course => course.status === 'completed').length;
    const inProgress = nonMandatoryCourses.filter(course => course.status === 'inprogress').length;
    return [
      {
        name: 'Completed',
        value: completed,
        color: '#4CAF50',
      },
      {
        name: 'In Progress',
        value: inProgress,
        color: '#FFC107',
      },
    ];
  };
  const renderDonutChart = (data: ChartDataItem[], title: string) => {
    const backgroundData = [{ value: 100 }];
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '0.875rem' } }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', lg: 'row' }, alignItems: 'center', gap: { xs: 1.5, sm: 2, lg: 1.5 } }}>
          <Box sx={{ position: 'relative', height: { xs: 120, sm: 150, lg: 130, xl: 150 }, width: { xs: 120, sm: 150, lg: 130, xl: 150 }, flexShrink: 0 }}>
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
                  fill="#E0E0E0"
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
              {/* <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', textTransform: 'uppercase', lineHeight: 1.2 }}>
                NO. OF EMPLOYEES
              </Typography> */}
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
                    fontSize: { xs: '12px', sm: '13px', lg: '12px', xl: '13px' },
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
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #E0E0E0', borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
        Course Completion
      </Typography>
      <Stack direction={{ xs: 'column', sm: 'column', lg: 'row', xl: 'row' }} spacing={{ xs: 2, sm: 2, lg: 2.5, xl: 3 }} sx={{ mt: 2 }}>
        {renderDonutChart(prepareMandatoryData(), 'Mandatory Courses')}
        {renderDonutChart(prepareNonMandatoryData(), 'Non Mandatory Courses')}
      </Stack>
    </Paper>
  );
};
export default CourseCompletion;

