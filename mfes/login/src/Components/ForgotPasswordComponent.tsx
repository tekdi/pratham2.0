'use client';

import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const ForgotPasswordComponent = ({
  onNext,
}: {
  onNext: (value: string) => void;
}) => {
  const [input, setInput] = useState('');

  const handleNext = () => {
    if (input.trim()) {
      onNext(input.trim());
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      //  bgcolor="#fffbe6"
      px={2}
    >
      <LockIcon sx={{ fontSize: 40, color: '#000', mb: 2 }} />

      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Trouble with logging in?
      </Typography>
      <Typography variant="body2" color="textSecondary" mb={3}>
        No worries, we’ll help you get back to your account
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 400,
          textAlign: 'center',
        }}
      >
        <TextField
          label="Enter username or phone number"
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          margin="normal"
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: '#FFC107',
            color: '#000',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#ffb300',
            },
            borderRadius: 9999,
            py: 1.2,
          }}
          onClick={handleNext}
        >
          Next
        </Button>
      </Paper>
    </Box>
  );
};

export default ForgotPasswordComponent;
