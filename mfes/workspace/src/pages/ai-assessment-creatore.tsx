import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Layout from '../components/Layout';
import WorkspaceHeader from '../components/WorkspaceHeader';
import { getLocalStoredUserId } from '../services/LocalStorageService';
import SelectContent from '../components/ai-assessment/SelectContent';
import SetParameters from '../components/ai-assessment/SetParameters';
import useTenantConfig from '../hooks/useTenantConfig';
import AIGenerationDialog from '../components/ai-assessment/AIGenerationDialog';
import {
  createAIQuestionsSet,
  createQuestionSet,
  deleteContent,
  getAIQuestionSetStatus,
  updateQuestionSet,
} from '@workspace/services/ContentService';
import { MIME_TYPE } from '@workspace/utils/app.config';

const poppinsFont = {
  fontFamily: 'Poppins',
};

const CustomStepper = ({ activeStep }: { activeStep: number }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          bgcolor: activeStep <= 2 ? '#FDBE16' : '#DADADA',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: activeStep <= 2 ? '#1F1B13' : '#FFFFFF',
            fontWeight: 500,
          }}
        >
          1
        </Typography>
      </Box>
      <Typography
        sx={{
          ml: 2,
          ...poppinsFont,
          fontWeight: 500,
          fontSize: 16,
          color: activeStep <= 2 ? '#1F1B13' : '#7C766F',
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
          bgcolor: activeStep === 1 ? '#FDBE16' : '#DADADA',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: activeStep === 1 ? '#1F1B13' : '#FFFFFF',
            fontWeight: 500,
          }}
        >
          2
        </Typography>
      </Box>
      <Typography
        sx={{
          ml: 2,
          ...poppinsFont,
          fontWeight: 500,
          fontSize: 16,
          color: activeStep === 1 ? '#1F1B13' : '#7C766F',
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
          bgcolor: activeStep === 2 ? '#FDBE16' : '#DADADA',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            color: activeStep === 2 ? '#1F1B13' : '#FFFFFF',
            fontWeight: 500,
          }}
        >
          3
        </Typography>
      </Box>
      <Typography
        sx={{
          ml: 2,
          ...poppinsFont,
          fontWeight: 500,
          fontSize: 16,
          color: activeStep === 2 ? '#1F1B13' : '#7C766F',
        }}
      >
        Review Questions
      </Typography>
    </Box>
  </Box>
);
const staticFilter = {
  program: [
    typeof window !== 'undefined' ? localStorage.getItem('program') : '',
  ],
  // se_subjects: ['English'],
};

const onlyFields = [
  'program',
  'se_domains',
  'se_subDomains',
  'se_subjects',
  'primaryUser',
  'targetAgeGroup',
  'contentLanguage',
];
const inputType = {
  program: 'dropdown-single',
  se_domains: 'dropdown-single',
  se_subDomains: 'dropdown-multi',
  se_subjects: 'dropdown-multi',
  primaryUser: 'dropdown-multi',
  targetAgeGroup: 'dropdown-multi',
  contentLanguage: 'dropdown-single',
};
const AIAssessmentCreator: React.FC = () => {
  const [selectedContent, setSelectedContent] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState('create');
  const [showHeader, setShowHeader] = useState<boolean | null>(null);
  const [formState, setFormState] = useState<any>({});
  const tenantConfig = useTenantConfig();
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleNextFromSelectContent = (newFormData: any) => {
    setFormState((prev: any) => ({
      ...prev,
      ...newFormData,
    }));
    setActiveStep((s) => s + 1);
  };

  const fetchData = async (data: any) => {
    let response: any = '';
    try {
      response = await createQuestionSet(tenantConfig?.COLLECTION_FRAMEWORK);
      const updateResponse = await updateQuestionSet({
        identifier: response?.result?.identifier,
        ...(data?.metadata || {}),
      });
      console.log('updateResponse', updateResponse);
      return updateResponse?.result?.identifier;
    } catch (error) {
      if (response?.result?.identifier) {
        const resultDelet = await deleteContent(
          response?.result?.identifier,
          MIME_TYPE.QUESTIONSET_MIME_TYPE
        );
        console.log('resultDelet', resultDelet);
      }
      console.error('Error creating question set:', error);
    }
  };
  const handleNextFromSetParameters = (parameters: any) => {
    const newFormState = {
      framework: tenantConfig?.CONTENT_FRAMEWORK,
      channel: tenantConfig?.CHANNEL_ID,
      ...parameters,
    };
    setFormState((prev: any) => ({ ...prev, ...newFormState }));
    // setActiveStep((s) => s + 1);
    handleSubmit(newFormState);
  };

  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async (formData: any) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');
    // Convert dropdown-single array values to single string
    const formattedData = { ...(formData?.metadata || {}) };
    Object.keys(inputType).forEach((key: string) => {
      let newKey = key;
      if (key.startsWith('se_') && key.endsWith('s')) {
        newKey = key.slice(3, -1); // Remove 'se_' prefix and 's' suffix
      }
      if (
        inputType?.[key as keyof typeof inputType] === 'dropdown-single' &&
        Array.isArray(formData?.metadata?.[key]) &&
        key !== 'program'
      ) {
        formattedData[newKey] = formData?.metadata?.[key][0] || '';
      } else {
        formattedData[newKey] = formData?.metadata?.[key];
      }
      if (key.startsWith('se_') && key.endsWith('s')) {
        delete formattedData[key];
      }
    });
    const newFormData = { ...formData, metadata: formattedData };
    const identifier = await fetchData(newFormData);
    const resultAi = await createAIQuestionsSet({
      ...newFormData,
      questionSetId: identifier,
      token,
    });
    console.log('resultAi sagar', resultAi);
    if (identifier) {
      setShowAIDialog(true);
      setProgress(0);
      let prog = 0;
      const interval = setInterval(async () => {
        // Increase progress by 16.67 to reach 100 in 1 minute (6 intervals of 10 seconds)
        prog += 16.67;
        setProgress(Math.min(prog, 100)); // Ensure we don't exceed 100

        // Check AI status every 10 seconds
        try {
          const status = await getAIQuestionSetStatus(identifier, token);
          console.log('AI Status:', status);
        } catch (error) {
          console.error('Error checking AI status:', error);
        }

        if (prog >= 100) {
          clearInterval(interval);
          setTimeout(() => setShowAIDialog(false), 400);
        }
      }, 10000); // Run every 10 seconds for 1 minute total
      // TODO: Replace with real API call and progress logic
      console.log('Form Data:', newFormData);
    }
  };

  let stepContent = null;
  if (activeStep === 0) {
    stepContent = (
      <SelectContent
        formState={formState}
        selected={selectedContent}
        setSelected={setSelectedContent}
        staticFilter={staticFilter}
        onlyFields={onlyFields}
        inputType={inputType}
        onNext={handleNextFromSelectContent}
      />
    );
  } else if (activeStep === 1) {
    stepContent = (
      <SetParameters
        formState={formState}
        staticFilter={staticFilter}
        onlyFields={onlyFields}
        inputType={inputType}
        onNext={(parameters: any) => handleNextFromSetParameters(parameters)}
        onBack={handleBack}
      />
    );
  }

  return (
    <Layout selectedKey={selectedKey} onSelect={setSelectedKey}>
      {showHeader && <WorkspaceHeader />}
      <Box p={3} sx={{ minHeight: '100vh', background: '#F2F5F8' }}>
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
          AI Question Set Generator
        </Typography>
        <CustomStepper activeStep={activeStep} />
        <Box
          sx={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0px 2px 6px 2px #00000026',
          }}
        >
          {stepContent}
        </Box>
        <AIGenerationDialog open={showAIDialog} progress={progress} />
      </Box>
    </Layout>
  );
};

export default AIAssessmentCreator;
