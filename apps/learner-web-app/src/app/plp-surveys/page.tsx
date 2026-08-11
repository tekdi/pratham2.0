'use client';

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import dynamic from 'next/dynamic';
import Layout from '@learner/components/Layout';

const SurveyListPage = dynamic(
  () => import('@survey-forms/app/survey-list/SurveyListPage'),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    ),
  }
);

const PlpSurveysPage: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    localStorage.setItem('surveyCategory', '["learner"]');
    setIsReady(true);
  }, []);

  return (
    <Layout>
      <Box display="flex" flexDirection="column">
        {isReady && <SurveyListPage skipAcademicYear />}
      </Box>
    </Layout>
  );
};

export default PlpSurveysPage;
