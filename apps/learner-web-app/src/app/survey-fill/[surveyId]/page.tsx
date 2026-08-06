'use client';

import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import Layout from '@learner/components/Layout';

const ContextPicker = dynamic(
  () => import('@survey-forms/app/survey-fill/[surveyId]/ContextPicker'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    ),
  }
);

export default function SurveyContextPickerPage() {
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
          <ContextPicker />
        </Suspense>
      </Box>
    </Layout>
  );
}
