'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { fetchSurveyById } from '../../../utils/API/surveyService';
import BackHeader from '../../../Components/BackHeader/BackHeader';

const ContextPicker: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;

  const [contextId, setContextId] = useState('');
  const [surveyTitle, setSurveyTitle] = useState('');
  const [contextType, setContextType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const result = await fetchSurveyById(surveyId);
        if (result.params.status === 'successful') {
          setSurveyTitle(result.result.data.surveyTitle);
          setContextType(result.result.data.contextType);
          if (
            result.result.data.contextType === 'self' ||
            result.result.data.contextType === 'none'
          ) {
            router.replace(`/survey-fill/${surveyId}/self`);
          }
        } else {
          toast.error('Failed to load survey');
          router.back();
        }
      } catch {
        toast.error('Failed to load survey');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    loadSurvey();
  }, [surveyId, router]);

  const handleProceed = () => {
    if (!contextId.trim()) {
      toast.error('Please enter a valid ID');
      return;
    }
    router.push(`/survey-fill/${surveyId}/${contextId.trim()}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    );
  }

  return (
    <Box>
      <BackHeader title={surveyTitle} subtitle="Select context to fill survey" />
      <Box sx={{ p: 3, maxWidth: 500, mx: 'auto' }}>
        <Typography variant="body1" sx={{ color: '#1E1B16', mb: 2 }}>
          This survey requires a <strong>{contextType}</strong> context. Please
          enter the {contextType} ID to proceed.
        </Typography>
        <TextField
          fullWidth
          label={`${contextType} ID`}
          value={contextId}
          onChange={(e) => setContextId(e.target.value)}
          placeholder={`Enter ${contextType} UUID`}
          size="small"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
          }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleProceed}
          disabled={!contextId.trim()}
          sx={{
            backgroundColor: '#FDBE16',
            color: '#1E1B16',
            fontWeight: 600,
            '&:hover': { backgroundColor: '#e6ab0e' },
            '&.Mui-disabled': { backgroundColor: '#eee' },
          }}
        >
          Proceed to Survey
        </Button>
      </Box>
    </Box>
  );
};

export default ContextPicker;
