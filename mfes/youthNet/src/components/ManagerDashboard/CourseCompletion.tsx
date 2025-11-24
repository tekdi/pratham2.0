import React from 'react';
import { Box, Typography, Paper, Stack, useMediaQuery } from '@mui/material';
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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    // Responsive radius values: smaller for mobile, original for desktop
    const innerRadius = isMobile ? 38 : 48;
    const outerRadius = isMobile ? 55 : 68;
    
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, maxWidth: '100%' }}>
        <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom sx={{ mb: { xs: 1, sm: 2 }, fontSize: { xs: '0.875rem', sm: '0.875rem' }, flexShrink: 0 }}>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row', lg: 'row' }, alignItems: 'center', gap: { xs: 1.5, sm: 2, lg: 1.5 }, width: '100%', minWidth: 0, flex: 1 }}>
          <Box sx={{ position: 'relative', height: { xs: 120, sm: 150, lg: 130, xl: 140 }, width: { xs: 120, sm: 150, lg: 130, xl: 140 }, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={backgroundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  dataKey="value"
                  startAngle={0}
                  endAngle={360}
                  fill="#E0E0E0"
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
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
                width: { xs: '60px', sm: '80px' },
              }}
            >
              {/* <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px', textTransform: 'uppercase', lineHeight: 1.2 }}>
                NO. OF EMPLOYEES
              </Typography> */}
            </Box>
          </Box>
          <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
            {data.map((item, index) => (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ minWidth: 0 }}
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
                    color: theme.palette.primary.main,
                    fontSize: { xs: '12px', sm: '13px', lg: '12px', xl: '13px' },
                    minWidth: 0,
                    wordBreak: 'break-word'
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
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #E0E0E0', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden', overflowY: 'visible' }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.125rem' }, flexShrink: 0 }}>
        Course Completion
      </Typography>
      <Stack 
        direction={{ xs: 'column', sm: 'column', lg: 'row', xl: 'row' }} 
        spacing={{ xs: 2, sm: 2, lg: 2, xl: 2.5 }} 
        sx={{ 
          mt: 2,
          flex: 1,
          minHeight: 0,
          width: '100%',
          alignItems: { xs: 'stretch', sm: 'stretch', lg: 'flex-start', xl: 'flex-start' },
          '& > *': {
            flex: { lg: '1 1 auto', xl: '1 1 auto' },
            minWidth: 0,
            maxWidth: { lg: 'calc(50% - 4px)', xl: 'calc(50% - 5px)' }
          }
        }}
      >
        {renderDonutChart(prepareMandatoryData(), 'Mandatory Courses')}
        {renderDonutChart(prepareNonMandatoryData(), 'Non Mandatory Courses')}
      </Stack>
    </Paper>
  );
};
export default CourseCompletion;

