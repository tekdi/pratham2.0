import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { LearnerDetailsProps } from './types';

const LearnerDetails: React.FC<LearnerDetailsProps> = ({
  employeeId,
  dateOfJoining,
  jobType,
  department,
  reportingManager,
}) => {
  return (
    <Paper elevation={0} sx={{ p: 2.5, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Learner Details
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Employee ID
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {employeeId}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Date of Joining
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {dateOfJoining}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Job Type
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {jobType}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Department
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {department}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Reporting Manager
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {reportingManager}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
              Department
            </Typography>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {department}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default LearnerDetails;

