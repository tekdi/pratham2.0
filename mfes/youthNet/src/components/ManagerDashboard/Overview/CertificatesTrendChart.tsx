import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CertificatesTrendChartProps } from '../../../utils/Interface';
import ChartCard from './ChartCard';

// Trend-over-time job → line, not bar (a single series, so one hue and no legend needed — the
// title already names it).
const CertificatesTrendChart: React.FC<CertificatesTrendChartProps> = ({ data }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <ChartCard
      title={t('MANAGER_OVERVIEW.CERTIFICATES_TREND_TITLE')}
      subtitle={t('MANAGER_OVERVIEW.CERTIFICATES_TREND_SUBTITLE')}
      isEmpty={data.length === 0}
      emptyLabel="MANAGER_OVERVIEW.NO_TOP_PERFORMERS"
    >
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 16, right: 24, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.warning['A100']} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke={theme.palette.dashboardStatus.certificateIssued}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default CertificatesTrendChart;
