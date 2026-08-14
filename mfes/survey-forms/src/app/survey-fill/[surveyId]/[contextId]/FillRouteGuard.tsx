'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { fetchSurveyById, fetchSurveyResponseStatus } from '../../../../utils/API/surveyService';
import SurveyRenderer from './SurveyRenderer';

const FillRouteGuard: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const surveyId = params.surveyId as string;
  const contextId = params.contextId as string;
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const resolvedContextId = contextId === 'self' ? '' : contextId;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

    fetchSurveyById(surveyId).then((surveyResult) => {
      if (cancelled) return;
      const survey = surveyResult.result?.data;

      if (survey?.surveyType === 'multi') {
        setChecked(true);
        return;
      }

      fetchSurveyResponseStatus(surveyId, resolvedContextId, userId).then((status) => {
        if (cancelled) return;
        if (status === 'submitted') {
          router.replace(`/survey-fill/${surveyId}/${contextId}/view`);
          return;
        }
        setChecked(true);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [surveyId, contextId, router]);

  if (!checked) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    );
  }

  return <SurveyRenderer />;
};

export default FillRouteGuard;
