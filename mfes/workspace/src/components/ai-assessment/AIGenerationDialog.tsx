import React from 'react';
import { Dialog, Box, Typography, Fade, Slider } from '@mui/material';
import Image from 'next/image';

const poppinsFont = {
  fontFamily: 'Poppins',
};

interface AIGenerationDialogProps {
  open: boolean;
  progress: number; // 0-100
  onClose?: () => void;
}

const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
  open,
  progress,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: '#fff',
          boxShadow: '0px 8px 32px rgba(31, 27, 19, 0.12)',
          p: 0,
          minWidth: 310,
          maxWidth: 600,
        },
      }}
      transitionDuration={400}
      TransitionComponent={Fade}
      hideBackdrop={false}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: { xs: 3, sm: 4 },
          width: { xs: 320, sm: 512 },
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 3 }}>
          <img src={'/logo.png'} alt="Logo" width={69} height={64} />
        </Box>
        {/* Progress Bar */}
        <Box sx={{ position: 'relative', width: 414, height: 80, mb: 2 }}>
          <Slider
            value={progress}
            min={0}
            max={100}
            sx={{ color: '#FDBE16' }}
          />
          {/* Percentage */}
          <Typography
            sx={{
              position: 'absolute',
              right: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              ...poppinsFont,
              fontWeight: 400,
              fontSize: 14,
              color: '#635E57',
              textAlign: 'center',
              width: 40,
            }}
          >
            {progress}%
          </Typography>
        </Box>
        {/* Main Text */}
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Typography
            sx={{
              ...poppinsFont,
              fontWeight: 400,
              fontSize: 22,
              color: '#1F1B13',
              mb: 1,
            }}
          >
            Generating your questions..
          </Typography>
          <Typography
            sx={{
              ...poppinsFont,
              fontWeight: 400,
              fontSize: 16,
              color: '#1F1B13',
              opacity: 0.8,
              letterSpacing: '3.1%',
            }}
          >
            Sit tight while we create a tailored set of questions based on your
            content.
          </Typography>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AIGenerationDialog;
