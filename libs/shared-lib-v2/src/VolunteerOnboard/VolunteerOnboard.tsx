import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';

import { useRouter } from 'next/navigation';

import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import {
  fetchForm,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { FormContext } from '../DynamicForm/components/DynamicFormConstant';

interface VolunteerOnboardProps {

}


const VolunteerOnboard: React.FC<VolunteerOnboardProps> = ({

}) => {


  const router = useRouter();

  const [learnerSchema, setLearnerSchema] = useState(null);
  const [learnerUiSchema, setLearnerUiSchema] = useState(null);

  const [orgSchema, setOrgSchema] = useState(null);
  const [orgUiSchema, setOrgUiSchema] = useState(null);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      try {
        setLoading(true);
        const responseForm: any = await fetchForm([
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
            header: {
              tenantid: localStorage.getItem('onboardTennatId'),
            },
          },
        ]);
        let responseLearnerSchema = responseForm?.schema;
        let responseLearnerUiSchema = responseForm?.uiSchema;
        setLearnerSchema(responseLearnerSchema);
        setLearnerUiSchema(responseLearnerUiSchema);

        const responseOrgForm: any = await fetchForm([
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.organization.context}&contextType=${FormContext.organization.contextType}`,
            header: {
            },
          },
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.organization.context}&contextType=${FormContext.organization.contextType}`,
            header: {
              tenantid: localStorage.getItem('onboardTennatId'),
            },
          },
        ]);
        let responseOrgSchema = responseOrgForm?.schema;
        let responseOrgUiSchema = responseOrgForm?.uiSchema;
        setOrgSchema(responseOrgSchema);
        setOrgUiSchema(responseOrgUiSchema);
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          ml: 'auto',
          mr: 'auto',
          width: {
            xs: '95vw',
            md: '85vw',
          },
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#fff',
          p: '40px',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography fontWeight={600}>
            ddd
          </Typography>
        </Box>
      </Box>
      {JSON.stringify(learnerSchema)}
      {JSON.stringify(learnerUiSchema)}
      {JSON.stringify(orgSchema)}
      {JSON.stringify(orgUiSchema)}
    </Box>
  );
};

export default VolunteerOnboard;
