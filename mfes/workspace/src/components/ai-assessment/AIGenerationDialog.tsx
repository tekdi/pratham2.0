import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Box,
  Typography,
  Fade,
  Button,
  CircularProgress,
} from '@mui/material';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import { useRouter } from 'next/router';
import Image from 'next/image';
const poppinsFont = {
  fontFamily: 'Poppins',
};

interface AIGenerationDialogProps {
  open: boolean;
  state: 'loader' | 'success' | 'failed' | 'processing';
  aiStatus?: string | null;
  errorMessage?: string;
  onRetry?: () => void;
  onClose?: () => void;
  onGoToEditor?: () => void;
  onGoAssessment?: () => void;
}

const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
  open,
  state,
  aiStatus = null,
  errorMessage,
  onRetry,
  onClose,
  onGoToEditor,
  onGoAssessment,
}) => {
  const router = useRouter();
  // Helper for close button in failed state
  const handleFailedClose = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Footer button handler
  const handleGoBackToWorkspace = () => {
    router.push('/');
  };

  // Timer state for loader
  const [timer, setTimer] = useState(60);
  useEffect(() => {
    if (state === 'loader' && open) {
      setTimer(60);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev > 0) return prev - 1;
          return 0;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state, open]);

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
        {/* Success State */}



        {state === 'loader' &&(
          <>
            <Box sx={{ mb: 3 }}>
              <CheckCircleOutlineOutlinedIcon
                sx={{ fontSize: 40, color: '#019722' }}
              />
            </Box>
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 400,
                fontSize: 22,
                color: '#1F1B13',
                textAlign: 'center',
                mb: 2,
              }}
            >
              Questions generated successfully!
            </Typography>
            <Typography
              sx={{
                ...poppinsFont,
                fontWeight: 400,
                fontSize: 16,
                color: '#635E57',
                mb: 4,
                textAlign: 'center',
                maxWidth: 600,
                lineHeight: 1.5,
              }}
            >
              You can head to the editor and review the questions.
            </Typography>
          </>
        )}

        {/* Loader State */}

        {/* Failed/Retry State */}
        {state === 'failed' && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                gap: 2,
              }}
            >
              <ReportProblemOutlinedIcon
                sx={{
                  fontSize: 40,
                  color: '#BA1A1A',
                }}
              />
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 600,
                  fontSize: 24,
                  color: '#1F1B13',
                  textAlign: 'center',
                }}
              >
                Something Went Wrong
              </Typography>
              <Typography
                sx={{
                  ...poppinsFont,
                  fontWeight: 400,
                  fontSize: 16,
                  color: '#635E57',
                  mb: 1,
                  textAlign: 'center',
                  maxWidth: 600,
                  lineHeight: 1.5,
                }}
              >
                {errorMessage ||
                  "We couldn't generate the questions due to a technical issue. Please try again or restart after some time"}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 2,
                  width: '100%',
                  borderTop: '1px solid #D0C5B4',
                  pt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderRadius: '100px',
                    py: 1.5,
                    borderColor: '#635E57',
                    color: '#1E1B16',
                    textTransform: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      borderColor: '#1F1B13',
                      color: '#1F1B13',
                    },
                  }}
                  onClick={onGoToEditor}
                >
                  Go Back to Workspace
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
        {/* Sub-message and Footer Button for all states */}
        {state !== 'failed' && state !== 'processing' && (
          <Box
            sx={{
              width: '100%',
              borderTop: '1px solid #D0C5B4',
              pt: 4,
            }}
          >
            <Button
              variant="contained"
              fullWidth
              onClick={state === 'success' ? onGoToEditor : onGoAssessment}
            >
              {state === 'success'
                ? 'Go to Editor'
                : 'Go Back to Assessment List'}
            </Button>
          </Box>
        )}
      </Box>
    </Dialog>
  );
};

export default AIGenerationDialog;
