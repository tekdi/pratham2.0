'use client';

import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import Layout from '@learner/components/Layout';

const SurveyResponseViewer = dynamic(
  () => import('@survey-forms/app/survey-fill/[surveyId]/[contextId]/SurveyResponseViewer'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    ),
  }
);

export default function SurveyResponseViewPage() {
  return (
    <Layout>
      <Box display="flex" flexDirection="column">
        <SurveyResponseViewer />
      </Box>
    </Layout>
  );
}
