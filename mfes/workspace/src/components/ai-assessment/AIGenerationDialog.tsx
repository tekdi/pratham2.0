import React from 'react';
import { Dialog, Box, Typography, Fade, Slider, Button } from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
const poppinsFont = {
  fontFamily: 'Poppins',
};

interface AIGenerationDialogProps {
  open: boolean;
  state: 'loader' | 'success' | 'failed' | 'processing';
  progress?: number;
  aiStatus?: string | null;
  onRetry?: () => void;
  onClose?: () => void;
  onGoToEditor?: () => void;
}

const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
  open,
  state,
  progress = 0,
  aiStatus = null,
  onRetry,
  onClose,
  onGoToEditor,
}) => {
  // Helper for close button in failed state
  const handleFailedClose = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <Dialog
      open={open}
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
          width: { xs: 320, sm: 536 },
        }}
      >
        {/* Processing State */}
        {state === 'processing' && (
          <>
            <Box sx={{ mb: 3 }}>
              <PendingOutlinedIcon sx={{ fontSize: 80, color: '#FDBE16' }} />
            </Box>
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 600,
                fontSize: 24,
                color: '#1F1B13',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Taking longer than expected..
            </Typography>
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 400,
                fontSize: 16,
                color: '#635E57',
                mb: 4,
                textAlign: 'center',
                maxWidth: 400,
                lineHeight: 1.5,
              }}
            >
              Hold on, we will redirect you to the editor in some time
            </Typography>
          </>
        )}
        {/* Loader State */}
        {state === 'loader' && (
          <>
            <Box sx={{ mb: 3 }}>
              <img src={'/logo.png'} alt="Logo" height={64} />
            </Box>
            <Box sx={{ position: 'relative', width: 414, height: 80 }}>
              <Slider
                value={progress}
                min={0}
                max={100}
                sx={{ color: '#FDBE16' }}
              />
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
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 400,
                fontSize: 16,
                color: '#1976d2',
                mb: 1,
              }}
            >
              {aiStatus ? `AI Status: ${aiStatus}` : ''}
            </Typography>
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
                textAlign: 'center',
              }}
            >
              Sit tight while we create a tailored set of questions based on
              your content.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#FDBE16',
                color: '#1E1B16',
                borderRadius: '100px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#E5AB14',
                },
              }}
              onClick={onGoToEditor}
            >
              Start Editing
            </Button>
          </>
        )}
        {/* Success State */}
        {state === 'success' && (
          <>
            <Box sx={{ mb: 3 }}>
              <CheckCircleOutlineOutlinedIcon
                sx={{ fontSize: 80, color: '#019722' }}
              />
            </Box>
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 600,
                fontSize: 24,
                color: '#1F1B13',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Questions Generated Successfully
            </Typography>
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 400,
                fontSize: 16,
                color: '#635E57',
                mb: 4,
                textAlign: 'center',
                maxWidth: 400,
                lineHeight: 1.5,
              }}
            >
              Redirecting you to the editor for review.
            </Typography>
            <Button
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#FDBE16',
                color: '#1E1B16',
                borderRadius: '100px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#E5AB14',
                },
              }}
              onClick={onGoToEditor}
            >
              Start Editing
            </Button>
          </>
        )}
        {/* Failed/Retry State */}
        {state === 'failed' && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <ReportProblemOutlinedIcon
                sx={{
                  fontSize: 80,
                  color: '#BA1A1A',
                  mb: 3,
                }}
              />
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 600,
                  fontSize: 24,
                  color: '#1F1B13',
                  mb: 1,
                  textAlign: 'center',
                }}
              >
                Generation Failed
              </Typography>
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 400,
                  fontSize: 16,
                  color: '#635E57',
                  mb: 4,
                  textAlign: 'center',
                  maxWidth: 400,
                  lineHeight: 1.5,
                }}
              >
                Something went wrong while generating your questions. Please try
                again.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  width: '100%',
                  mt: 2,
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: '100px',
                    py: 1.5,
                    borderColor: '#635E57',
                    color: '#635E57',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#1F1B13',
                      color: '#1F1B13',
                    },
                  }}
                  onClick={handleFailedClose}
                >
                  Go back
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: '#FDBE16',
                    color: '#1E1B16',
                    borderRadius: '100px',
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      bgcolor: '#E5AB14',
                    },
                  }}
                  onClick={onRetry}
                >
                  Try Again
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default AIGenerationDialog;
