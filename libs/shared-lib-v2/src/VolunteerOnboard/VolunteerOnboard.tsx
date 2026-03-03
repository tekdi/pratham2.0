import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useRouter } from 'next/navigation';

import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import {
  fetchForm,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { FormContext } from '../DynamicForm/components/DynamicFormConstant';

interface VolunteerOnboardProps {
  t: any;
}


const VolunteerOnboard: React.FC<VolunteerOnboardProps> = ({
  t,
}) => {


  const router = useRouter();

  const [learnerSchema, setLearnerSchema] = useState<any>(null);
  const [learnerUiSchema, setLearnerUiSchema] = useState<any>(null);

  const [orgSchema, setOrgSchema] = useState<any>(null);
  const [orgUiSchema, setOrgUiSchema] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  //form steps schema and ui schema
  const [formStepsSchemaAndUiSchema, setFormStepsSchemaAndUiSchema] = useState<any>(null);
  const [activeStep, setActiveStep] = useState('step1');
  const [allVisitedSteps, setAllVisitedSteps] = useState<string[]>([]);
  const [formStepsData, setFormStepsData] = useState<any>({});


  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      try {
        setLoading(true);
        const responseForm: any = await fetchForm([
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
            header: {
              tenantid: localStorage.getItem('onboardTenantId'),
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
              tenantid: localStorage.getItem('onboardTenantId'),
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

  useEffect(() => {
    if (learnerSchema && learnerUiSchema && orgSchema && orgUiSchema) {
      let tempFormStepsSchemaAndUiSchema = {
        step1: {
          schema: {
            "type": "object",
            "properties": {
              nda_policy: learnerSchema?.properties?.nda_policy,
              child_pocso_fraud_policy: learnerSchema?.properties?.child_pocso_fraud_policy,
            },
            "required": [
              "nda_policy",
              "child_pocso_fraud_policy",
            ]
          },
          uiSchema: {
            nda_policy: learnerUiSchema?.nda_policy,
            child_pocso_fraud_policy: learnerUiSchema?.child_pocso_fraud_policy,
          },
        },
        step2: {
          schema: {
            "type": "object",
            "properties": {
              how_would_you_like_to_register: learnerSchema?.properties?.how_would_you_like_to_register,
            },
            "required": [
              "how_would_you_like_to_register",
            ]
          },
          uiSchema: {
            how_would_you_like_to_register: learnerUiSchema?.how_would_you_like_to_register,
          },
        },
        step3_1: {
          schema: {
            "type": "object",
            "properties": {
              volunteer_type: learnerSchema?.properties?.volunteer_type,
            },
            "required": [
              "volunteer_type",
            ]
          },
          uiSchema: {
            volunteer_type: learnerUiSchema?.volunteer_type,
          },
        },
        step3_2: {
          schema: {
            "type": "object",
            "properties": {
              organisation_registered: learnerSchema?.properties?.organisation_registered,
            },
            "required": [
              "organisation_registered",
            ]
          },
          uiSchema: {
            organisation_registered: learnerUiSchema?.organisation_registered,
          },
        },
        step4_1: {
          schema: {
            "type": "object",
            "properties": {
              ptm_id: learnerSchema?.properties?.ptm_id,
            },
            "required": [
              "ptm_id",
            ]
          },
          uiSchema: {
            ptm_id: learnerUiSchema?.ptm_id,
          },
        },
        step4_2: {
          schema: {
            "type": "object",
            "properties": {
              org_id: learnerSchema?.properties?.org_id,
              poc_id: learnerSchema?.properties?.poc_id,
            },
            "required": [
              "org_id",
              "poc_id",
            ]
          },
          uiSchema: {
            org_id: learnerUiSchema?.org_id,
            poc_id: learnerUiSchema?.poc_id,
          },
        },
        step4_3: {
          schema: orgSchema,
          uiSchema: orgUiSchema,
        },
        step4_4: {
          schema: {
            "type": "object",
            "properties": {
              org_id: learnerSchema?.properties?.org_id,
            },
            "required": [
              "org_id",
            ]
          },
          uiSchema: {
            org_id: learnerUiSchema?.org_id,
          },
        },
      };
      setFormStepsSchemaAndUiSchema(tempFormStepsSchemaAndUiSchema);
    }
  }, [learnerSchema, learnerUiSchema, orgSchema, orgUiSchema]);

  useEffect(() => {
    if (activeStep.includes('step4')) {
      console.log('##########formsteps end of form submit call', formStepsData);
    }
  }, [formStepsData]);
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
        {formStepsSchemaAndUiSchema
          ?
          <Box display="flex" flexDirection="column" gap={1} mb={2}>
            <Typography fontWeight={600}>
              {allVisitedSteps.length > 0 && (
                <IconButton
                  onClick={() => {
                    const lastStep = allVisitedSteps[allVisitedSteps.length - 1];
                    setActiveStep(lastStep);
                    setAllVisitedSteps(allVisitedSteps.slice(0, -1));
                  }}
                  sx={{ mb: 2 }}
                >
                  <ArrowBackIcon />
                </IconButton>
              )}
            </Typography>
            <DynamicForm
              key={activeStep}
              schema={formStepsSchemaAndUiSchema?.[activeStep]?.schema}
              uiSchema={formStepsSchemaAndUiSchema?.[activeStep]?.uiSchema}
              FormSubmitFunction={(formData: any, payload: any) => {
                console.log('##########formsteps debug payload', payload);
                console.log('##########formsteps debug formdata', formData);
                setFormStepsData({ ...formStepsData, [activeStep]: formData });
                setAllVisitedSteps([...allVisitedSteps, activeStep]);
                if (activeStep == 'step1') {
                  setActiveStep('step2');
                }
                else if (activeStep == 'step2') {
                  if (formData.how_would_you_like_to_register == 'individual_volunteer') {
                    setActiveStep('step3_1');
                  }
                  else if (formData.how_would_you_like_to_register == 'register_an_organisation_as_poc') {
                    setActiveStep('step3_2');
                  }
                }
                else if (activeStep == 'step3_1') {
                  if (formData.volunteer_type == 'individual_volunteer') {
                    setActiveStep('step4_1');
                  }
                  else if (formData.volunteer_type == 'individual_volunteer_through_an_organisation') {
                    setActiveStep('step4_2');
                  }
                }
                else if (activeStep == 'step3_2') {
                  if (formData.organisation_registered == 'this_is_the_first_time_my_organisation_is_registering') {
                    setActiveStep('step4_3');
                  }
                  else if (formData.organisation_registered == 'my_organisation_is_already_registered') {
                    setActiveStep('step4_4');
                  }
                }
              }}
              prefilledFormData={formStepsData?.[activeStep] || {}}
              hideSubmit={true}
              type={''}
            />
            <Button
              sx={{
                backgroundColor: '#FFC107',
                color: '#000',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '14px',
                height: '40px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                textAlign: 'center',
                verticalAlign: 'middle',
                '&:hover': {
                  backgroundColor: '#ffb300',
                },
                width: '100%',
                mt: 4,
              }}
              form="dynamic-form-id"
              type="submit"
            >
              {activeStep.includes('step4') ? t('COMMON.SUBMIT') : t('COMMON.NEXT')}
            </Button>
          </Box>
          :
          <>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          </>
        }
      </Box>
    </Box>
  );
};

export default VolunteerOnboard;
