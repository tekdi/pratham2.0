import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CourseCompletionData } from './types';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CourseCompletionDetailProps {
  mandatory: CourseCompletionData;
  nonMandatory: CourseCompletionData;
}

const CourseCompletionDetail: React.FC<CourseCompletionDetailProps> = ({
  mandatory,
  nonMandatory,
}) => {
  const mandatoryChartData: ChartDataItem[] = [
    { name: 'Completed', value: mandatory.completed, color: '#4caf50' },
    { name: 'In Progress', value: mandatory.inProgress, color: '#ffc107' },
    { name: 'Overdue', value: mandatory.overdue, color: '#f44336' },
  ];

  const nonMandatoryChartData: ChartDataItem[] = [
    { name: 'Completed', value: nonMandatory.completed, color: '#4caf50' },
    { name: 'In Progress', value: nonMandatory.inProgress, color: '#ffc107' },
    { name: 'Overdue', value: nonMandatory.overdue, color: '#f44336' },
  ];

  const renderDonutChart = (data: ChartDataItem[], title: string) => {
    const backgroundData = [{ value: 100 }];
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          color="text.primary"
          gutterBottom
          sx={{ mb: 2 }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          {/* Pie Chart */}
          <Box
            sx={{
              position: 'relative',
              height: 150,
              width: 150,
              flexShrink: 0,
            }}
          >
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                {/* Background gray circle */}
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
                {/* Actual data */}
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

          {/* Legend - Side by side with chart */}
          <Stack spacing={1.5} sx={{ flex: 1 }}>
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
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
        Course Completion
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {renderDonutChart(mandatoryChartData, 'Mandatory Courses')}
        {renderDonutChart(nonMandatoryChartData, 'Non-mandatory Courses')}
      </Box>
    </Paper>
  );
};

export default CourseCompletionDetail;

