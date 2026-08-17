import React from 'react';
import { Box, Paper, Skeleton, Typography } from '@mui/material';

export interface SurveyStatusCounts {
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface StatCardProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, count, total, color }) => {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: '1 1 140px',
        minWidth: 140,
        borderRadius: '12px',
        borderColor: color,
        p: 1.5,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, color }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '2rem', lineHeight: 1.2, fontWeight: 700, color, mt: 0.5 }}>
        {pct}%
      </Typography>
      <Typography variant="caption" sx={{ color: '#7C766F' }}>
        {count.toLocaleString()} of {total.toLocaleString()}
      </Typography>
    </Paper>
  );
};

interface Props {
  counts: SurveyStatusCounts | null;
  loading?: boolean;
}

const SurveyStatusSummary: React.FC<Props> = ({ counts, loading }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" sx={{ flex: '1 1 140px', minWidth: 140 }} height={72} />
        ))}
      </Box>
    );
  }

  if (!counts) return null;

  const total = counts.completed + counts.inProgress + counts.notStarted;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
      <StatCard label="Completed" count={counts.completed} total={total} color="#2E7D32" />
      <StatCard label="In Progress" count={counts.inProgress} total={total} color="#B26A00" />
      <StatCard label="Not Started" count={counts.notStarted} total={total} color="#7C766F" />
    </Box>
  );
};

export default SurveyStatusSummary;
