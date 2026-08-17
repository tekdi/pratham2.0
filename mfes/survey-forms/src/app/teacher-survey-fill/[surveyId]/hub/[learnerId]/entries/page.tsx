'use client';

import React, { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import EntriesListPage from './EntriesListPage';

export default function Page() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress sx={{ color: '#FDBE16' }} />
        </Box>
      }
    >
      <EntriesListPage />
    </Suspense>
  );
}
