import React from 'react';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Typography, Button } from '@mui/material';

interface ResponseRecordedProps {
}

const ResponseRecorded: React.FC<ResponseRecordedProps> = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '16px',
      }}
    >
      <Box sx={{ color: '#4CAF50', fontSize: '48px', mb: 2 }}>
        <CheckCircleOutlineIcon fontSize="inherit" />
      </Box>
      
      <Typography variant="h5" fontWeight="medium" mb={2}>
        Your response has been recorded
      </Typography>
      
      <Typography variant="body1" mb={1}>
        Our expert will reach out to you soon
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={4}>
        In the meantime, feel free to explore more courses or continue building your skills!
      </Typography>
    </Box>
  );
};

export default ResponseRecorded;
