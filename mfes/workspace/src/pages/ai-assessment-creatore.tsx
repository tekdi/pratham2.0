import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../components/Layout';
import WorkspaceHeader from '../components/WorkspaceHeader';
import { getLocalStoredUserId } from '../services/LocalStorageService';
import SelectContent from '../components/ai-assessment/SelectContent';
import SetParameters from '../components/ai-assessment/SetParameters';

const poppinsFont = {
  fontFamily: 'Poppins',
};

const CustomStepper = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          bgcolor: '#FDBE16',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#1F1B13', fontWeight: 500 }}>1</Typography>
      </Box>
      <Typography
        sx={{
          ml: 2,
          ...poppinsFont,
          fontWeight: 500,
          fontSize: 16,
          color: '#1F1B13',
        }}
      >
        Select Content
      </Typography>
    </Box>
    <Box sx={{ width: 40, height: 2, bgcolor: '#CDC5BD', mx: 2 }} />
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          bgcolor: '#FDBE16',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#1F1B13', fontWeight: 500 }}>2</Typography>
      </Box>
      <Typography
        sx={{
          ml: 2,
          ...poppinsFont,
          fontWeight: 500,
          fontSize: 16,
          color: '#1F1B13',
        }}
      >
        Set Parameters
      </Typography>
    </Box>
    <Box sx={{ width: 40, height: 2, bgcolor: '#CDC5BD', mx: 2 }} />
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          bgcolor: '#DADADA',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ color: '#FFFFFF', fontWeight: 500 }}>3</Typography>
      </Box>
      <Typography
        sx={{
          ml: 2,
          ...poppinsFont,
          fontWeight: 500,
          fontSize: 16,
          color: '#7C766F',
        }}
      >
        Review Questions
      </Typography>
    </Box>
  </Box>
);

const AIAssessmentCreator: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState('create');
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = getLocalStoredUserId();

    const headerValue = localStorage.getItem('showHeader');
    setShowHeader(headerValue === 'true');

    if (token && userId) {
      document.cookie = `authToken=${token}; path=/; secure; SameSite=Strict`;
      document.cookie = `userId=${userId}; path=/; secure; SameSite=Strict`;
    }
  }, []);
  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => s - 1);

  let stepContent = null;
  if (activeStep === 0) {
    stepContent = (
      <SelectContent
        selected={selectedContent}
        setSelected={setSelectedContent}
        onNext={handleNext}
      />
    );
  } else if (activeStep === 1) {
    stepContent = (
      <Box>
        <Typography
          variant="h5"
          sx={{
            ...poppinsFont,
            fontWeight: 400,
            fontSize: 22,
            color: '#1F1B13',
            mb: 2,
          }}
        >
          AI Assessment Creator
        </Typography>
        <SetParameters onBack={handleBack} />
      </Box>
    );
  }

  return (
    <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
      {showHeader && <WorkspaceHeader />}

      <Box sx={{ bgcolor: '#F2F5F8', minHeight: '100vh', p: 4 }}>
        <CustomStepper />
        {stepContent}
      </Box>
    </Layout>
  );
};

export default AIAssessmentCreator;
