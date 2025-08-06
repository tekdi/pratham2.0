import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import WarningIcon from '@mui/icons-material/Warning';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

interface UnauthorizedAccessProps {
  message?: string;
  backUrl?: string;
}

const UnauthorizedAccess: React.FC<UnauthorizedAccessProps> = ({
  message = 'You do not have access to this cohort.',
  backUrl,
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backUrl) {
      router.push(backUrl);
    } else {
      router.back();
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{ height: '100vh', px: 2 }}
    >
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: '#4D4639',
        }}
      >
        <KeyboardBackspaceOutlinedIcon />
      </IconButton>

      <WarningIcon sx={{ fontSize: 64, color: '#FF9800', mb: 2 }} />

      <Typography
        variant="h6"
        color="error"
        textAlign="center"
        sx={{ maxWidth: 400 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default UnauthorizedAccess;
