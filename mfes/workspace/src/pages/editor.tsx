import React, { useEffect, useState } from 'react';
import { QuestionSet } from '@shared-lib';
import {
  searchAiAssessment,
  updateAIQuestionSet,
} from '@workspace/services/ContentService';
import { useRouter } from 'next/router';
import {
  Dialog,
  Box,
  Typography,
  CircularProgress,
  Fade,
  Button,
} from '@mui/material';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';

const Editor = () => {
  const router = useRouter();
  const { identifier } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<string>('');
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      if (identifier) {
        const response = await searchAiAssessment({
          question_set_id: [identifier],
        });
        if (
          response.data?.[0]?.status &&
          response.data?.[0]?.status !== 'COMPLETED'
        ) {
          setStatus(response.data?.[0].status);
          setIsModalOpen(true);
        }
      }
      setIsLoading(false);
    };
    init();
  }, [identifier]);

  const onEvent = async (event: any) => {
    if (event.detail?.action === 'publishContent') {
      await updateAIQuestionSet(event.detail?.identifier);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <QuestionSet onEvent={onEvent} />
      <Dialog
        open={isModalOpen}
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
          <Box sx={{ mb: 2 }}>
            <PendingOutlinedIcon sx={{ fontSize: 40, color: '#B1AAA2' }} />
          </Box>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 22,
              color: '#1F1B13',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Status: {status === 'COMPLETED' ? 'Completed' : 'Processing'}
          </Typography>

          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 16,
              color: '#1F1B13',
              mb: 2,
              textAlign: 'center',
            }}
          >
            Taking longer than expected..
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: 16,
              color: '#635E57',
              mb: 2,
              textAlign: 'center',
              maxWidth: 400,
              lineHeight: 1.5,
            }}
          >
            You can continue to wait here or check back later
          </Typography>
          <CircularProgress sx={{ mb: 4, color: '#635E57' }} />
          <Button
            variant="contained"
            sx={{
              colorScheme: 'primary',
            }}
            onClick={() => router.back()}
          >
            Go Back
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default Editor;
