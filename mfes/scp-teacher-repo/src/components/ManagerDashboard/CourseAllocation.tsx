import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';

interface CourseAllocationProps {
  mandatory: number;
  nonMandatory: number;
  total: number;
}

const CourseAllocation: React.FC<CourseAllocationProps> = ({
  mandatory,
  nonMandatory,
  total,
}) => {
  const mandatoryPercentage = total > 0 ? (mandatory / total) * 100 : 0;
  const nonMandatoryPercentage = total > 0 ? (nonMandatory / total) * 100 : 0;

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.125rem' } }}>
        Course Allocation
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
            Total Courses Allocated
          </Typography>
          <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
            {total}
          </Typography>
        </Stack>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: { xs: 1.5, sm: 2 } }}>
          <Box
            sx={{
              flex: 1,
              width: { xs: '100%', sm: 'auto' },
              height: 24,
              borderRadius: 0.5,
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <Box
              sx={{
                width: `${mandatoryPercentage}%`,
                backgroundColor: '#4caf50',
                transition: 'width 0.3s ease',
              }}
            />
            <Box
              sx={{
                width: `${nonMandatoryPercentage}%`,
                backgroundColor: '#ffc107',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>

          <Stack spacing={1} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#4caf50',
                }}
              />
              <Typography variant="caption" color="text.primary" sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>
                Mandatory : {mandatory}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.8}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#ffc107',
                }}
              />
              <Typography variant="caption" color="text.primary" sx={{ fontSize: { xs: '0.75rem', sm: '0.75rem' } }}>
                Non Mandatory : {nonMandatory}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Paper>
  );
};

export default CourseAllocation;
