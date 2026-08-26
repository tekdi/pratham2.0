import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { HighAttemptFilter, HighAttemptLevelsChartProps } from '../../../utils/Interface';
import { ATTEMPT_FILTER_OPTIONS } from '../../../utils/app.config';
import ChartCard from './ChartCard';

const LEVEL_LABEL_KEYS: Record<HighAttemptFilter, string> = {
  '3': 'MANAGER_OVERVIEW.ATTEMPTS_BUCKET_3',
  '4': 'MANAGER_OVERVIEW.ATTEMPTS_BUCKET_4',
  '5+': 'MANAGER_OVERVIEW.ATTEMPTS_BUCKET_5',
};

// theme.palette.highAttemptLevelColors only has '3'/'4'/'5' keys (the '5+' bucket shares the '5'
// — most alarming — color), matching how the High Quiz Attempt section already colors attempt counts.
const LEVEL_COLOR_KEYS: Record<HighAttemptFilter, '3' | '4' | '5'> = { '3': '3', '4': '4', '5+': '5' };

// 3 short, already-ordered categories — vertical bars read fine here (unlike the long-label
// horizontal charts elsewhere in this tab). Each bar takes its own color from the app's existing
// attempt-severity ramp, so no separate legend is needed — the x-axis labels already carry identity.
const HighAttemptLevelsChart: React.FC<HighAttemptLevelsChartProps> = ({ counts }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const data = useMemo(
    () =>
      ATTEMPT_FILTER_OPTIONS.map((filter) => ({
        filter,
        label: t(LEVEL_LABEL_KEYS[filter]),
        count: counts[filter] ?? 0,
      })),
    [counts, t]
  );
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <ChartCard
      title={t('MANAGER_OVERVIEW.HIGH_ATTEMPT_LEVELS_TITLE')}
      subtitle={t('MANAGER_OVERVIEW.HIGH_ATTEMPT_LEVELS_SUBTITLE')}
      isEmpty={total === 0}
      emptyLabel="MANAGER_OVERVIEW.NO_HIGH_ATTEMPT_USERS"
    >
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 16, bottom: 4, left: 8 }} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.palette.warning['A100']} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48}>
              {data.map((item) => (
                <Cell key={item.filter} fill={theme.palette.highAttemptLevelColors[LEVEL_COLOR_KEYS[item.filter]]} />
              ))}
              <LabelList dataKey="count" position="top" style={{ fontSize: 12, fill: theme.palette.text.secondary }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default HighAttemptLevelsChart;
