import React, { useEffect, useState } from 'react';
import { Dialog, Box, Typography, Fade, Slider, Button } from '@mui/material';
import {
  createAIQuestionsSet,
  getAIQuestionSetStatus,
} from '../../services/ContentService';
import { useRouter } from 'next/router';

const poppinsFont = {
  fontFamily: 'Poppins',
};

interface AIGenerationDialogProps {
  open: any;
  onClose?: () => void;
}

const AIGenerationDialog: React.FC<AIGenerationDialogProps> = ({
  open,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);
  const [showRetry, setShowRetry] = useState(false);
  const [aiStatus, setAIStatus] = useState<string | null>(null);
  const [aiStatusLoading, setAIStatusLoading] = useState(false);
  const router = useRouter();

  const sendToAi = React.useCallback(() => {
    setProgress(0);
    let prog = 0;
    const interval = setInterval(async () => {
      prog += 16.67;
      setProgress(Math.min(prog, 100)); // Ensure we don't exceed 100
      setAIStatusLoading(true);
      try {
        const status = await getAIQuestionSetStatus(
          open.identifier,
          open.token
        );
        setAIStatus(status);
        console.log('AI Status:', status);
      } catch (error) {
        console.error('Error checking AI status:', error);
      } finally {
        setAIStatusLoading(false);
      }
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          router.push(`/editor?identifier=${open.identifier}`);
        }, 400);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [open, router]);

  const handleAIQuestionSetCreation = React.useCallback(
    async (newFormData: any, identifier: string, token: string) => {
      try {
        setShowRetry(false);
        const response = await createAIQuestionsSet({
          ...newFormData,
          questionSetId: identifier,
          token,
        });
        sendToAi();
        return { success: true, data: response };
      } catch (error) {
        console.error('Error creating AI question set:', error);
        setShowRetry(true);
        return { success: false, error };
      }
    },
    [sendToAi]
  );

  const handleRetry = () => {
    if (open && open.newFormData && open.identifier && open.token) {
      handleAIQuestionSetCreation(
        open.newFormData,
        open.identifier,
        open.token
      );
    }
  };

  useEffect(() => {
    if (open) {
      handleAIQuestionSetCreation(
        open.newFormData,
        open.identifier,
        open.token
      );
    }
  }, [open, handleAIQuestionSetCreation]);

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
        {/* AI Status */}
        {aiStatusLoading ? (
          <Typography
            sx={{
              ...poppinsFont,
              fontWeight: 400,
              fontSize: 16,
              color: '#1976d2',
              mb: 1,
            }}
          >
            AI Status: Checking again...
          </Typography>
        ) : aiStatus ? (
          <Typography
            sx={{
              ...poppinsFont,
              fontWeight: 400,
              fontSize: 16,
              color: '#1976d2',
              mb: 1,
            }}
          >
            AI Status: {aiStatus}
          </Typography>
        ) : null}
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
          <Box
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}
          >
            {showRetry && (
              <>
                <Button variant="outlined" onClick={handleRetry}>
                  Retry
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    router.push(`/editor?identifier=${open.identifier}`)
                  }
                >
                  Close
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AIGenerationDialog;
