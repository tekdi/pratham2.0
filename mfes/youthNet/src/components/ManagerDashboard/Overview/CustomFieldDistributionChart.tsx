import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomFieldDistributionChartProps } from '../../../utils/Interface';
import ChartCard from './ChartCard';

const ROW_HEIGHT = 32;
const MAX_LABEL_LENGTH = 22;

// Team composition by JOB_FAMILY/PSU/EMP_GROUP — a magnitude comparison across categories, so a
// single-hue horizontal bar (long job-family names read far better as row labels than rotated
// x-axis ticks). Rendered once per label from user_custom that actually has values.
const CustomFieldDistributionChart: React.FC<CustomFieldDistributionChartProps> = ({ title, data }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <ChartCard
      title={title}
      subtitle={t('MANAGER_OVERVIEW.CUSTOM_FIELD_DISTRIBUTION_SUBTITLE', { label: title })}
      isEmpty={data.length === 0}
    >
      <div style={{ width: '100%', height: Math.max(data.length * ROW_HEIGHT, 120) }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, bottom: 4, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.palette.warning['A100']} />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
            <YAxis
              type="category"
              dataKey="value"
              width={160}
              interval={0}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: string) =>
                value.length > MAX_LABEL_LENGTH ? `${value.slice(0, MAX_LABEL_LENGTH)}…` : value
              }
            />
            <Tooltip />
            <Bar dataKey="count" fill={theme.palette.secondary.main} radius={[0, 4, 4, 0]} barSize={16}>
              <LabelList dataKey="count" position="right" style={{ fontSize: 11, fill: theme.palette.text.secondary }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default CustomFieldDistributionChart;
