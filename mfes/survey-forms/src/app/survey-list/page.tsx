'use client';

import React from 'react';
import { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import SurveyListPage from './SurveyListPage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#FDBE16' }} />
        </Box>
      }
    >
      <SurveyListPage />
    </Suspense>
  );
}
