import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TopCoursesChartProps } from '../../../utils/Interface';
import ChartCard from './ChartCard';

const ROW_HEIGHT = 34;
const MAX_LABEL_LENGTH = 24;

// Magnitude comparison across courses — same single-hue horizontal-bar treatment as the custom
// field distribution charts, for the same long-label reason (course names run long).
const TopCoursesChart: React.FC<TopCoursesChartProps> = ({ courses }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const data = useMemo(
    () => courses.map((course) => ({ name: course.courseName, count: course.progress.total })),
    [courses]
  );

  return (
    <ChartCard
      title={t('MANAGER_OVERVIEW.TOP_COURSES_TITLE')}
      subtitle={t('MANAGER_OVERVIEW.TOP_COURSES_SUBTITLE', { count: data.length })}
      isEmpty={data.length === 0}
      emptyLabel="MANAGER_OVERVIEW.NO_COURSES_FOUND"
    >
      <div style={{ width: '100%', height: Math.max(data.length * ROW_HEIGHT, 120) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.warning['A100']} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={180}
              interval={0}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: string) =>
                value.length > MAX_LABEL_LENGTH ? `${value.slice(0, MAX_LABEL_LENGTH)}…` : value
              }
            />
            <Tooltip />
            <Bar dataKey="count" fill={theme.palette.primary.main} radius={[0, 4, 4, 0]} barSize={16}>
              <LabelList dataKey="count" position="right" style={{ fontSize: 11, fill: theme.palette.text.secondary }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default TopCoursesChart;
