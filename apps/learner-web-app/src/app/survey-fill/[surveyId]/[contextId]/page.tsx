'use client';

import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import Layout from '@learner/components/Layout';

const SurveyRenderer = dynamic(
  () => import('@survey-forms/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    ),
  }
);

export default function SurveyFillPage() {
  return (
    <Layout>
      <Box display="flex" flexDirection="column">
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress sx={{ color: '#FDBE16' }} />
            </Box>
          }
        >
          <SurveyRenderer />
        </Suspense>
      </Box>
    </Layout>
  );
}
