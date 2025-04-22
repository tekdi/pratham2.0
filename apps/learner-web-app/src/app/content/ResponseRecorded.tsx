import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Typography, Button } from '@mui/material';

interface ResponseRecordedProps {}

const ResponseRecorded: React.FC<ResponseRecordedProps> = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box sx={{ color: '#4CAF50', fontSize: '48px', mb: 2 }}>
        <CheckCircleOutlineIcon fontSize="inherit" />
      </Box>

      <Typography
        variant="h1"
        sx={{
          color: '#1F1B13',
          textAlign: 'center',
        }}
        mb={2}
      >
        Your response has been recorded
      </Typography>

      <Typography
        variant="body1"
        mb={1}
        sx={{
          color: '#1F1B13',
          textAlign: 'center',
        }}
      >
        Our expert will reach out to you soon
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#1F1B13',
          textAlign: 'center',
        }}
        mb={4}
      >
        In the meantime, feel free to explore more courses or continue building
        your skills!
      </Typography>
    </Box>
  );
};

export default ResponseRecorded;
