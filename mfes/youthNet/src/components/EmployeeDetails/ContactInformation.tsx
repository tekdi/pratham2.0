import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ContactInformationProps } from './types';

const ContactInformation: React.FC<ContactInformationProps> = ({
  email,
  phone,
}) => {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2.5, 
        border: '1px solid #e0e0e0', 
        borderLeft: '4px solid #1976d2', // Vertical line on the left
        borderRadius: 2 
      }}
    >
      <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        Contact Information
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Email Address
        </Typography>
        <Typography variant="body2" color="text.primary">
          {email}
        </Typography>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          Phone Number
        </Typography>
        <Typography variant="body2" color="text.primary">
          {phone}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ContactInformation;

