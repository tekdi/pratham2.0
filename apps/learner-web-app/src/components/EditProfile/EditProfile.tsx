'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Link, Typography, useRadioGroup } from '@mui/material';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import axios from 'axios';

import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import {
  fetchForm,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import { useRouter } from 'next/navigation';
import { createUser } from '@shared-lib-v2/DynamicForm/services/CreateUserService';
import { RoleId } from '@shared-lib-v2/DynamicForm/utils/app.constant';
import { Loader } from '@shared-lib';
import {
  firstLetterInUpperCase,
  getMissingFields,
  mapUserData,
} from '@learner/utils/helper';
import face from '../../../public/images/Group 3.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

//build issue fix for  ⨯ useSearchParams() should be wrapped in a suspense boundary at page
import { useSearchParams } from 'next/navigation';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';

import Image from 'next/image';
import { set } from 'lodash';
import {
  getUserDetails,
  profileComplitionCheck,
  updateUser,
} from '@learner/utils/API/userService';

type UserAccount = {
  name: string;
  username: string;
};
interface EditProfileProps {
  completeProfile: boolean;
}

const EditProfile = ({ completeProfile }: EditProfileProps) => {
  const searchParams = useSearchParams();

  // let formData: any = {};
  const [loading, setLoading] = useState(true);
  const [invalidLinkModal, setInvalidLinkModal] = useState(false);

  const localFormData = JSON.parse(localStorage.getItem('formData') || '{}');
  const [userFormData, setUserFormData] = useState<any>(localFormData);
  const [userData, setuserData] = useState<any>({});

  const localPayload = JSON.parse(localStorage.getItem('localPayload') || '{}');

  //formData.email = 'a@tekditechnologies.com';

  const router = useRouter();

  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);

  // const [schema, setSchema] = useState(facilitatorSearchSchema);
  // const [uiSchema, setUiSchema] = useState(facilitatorSearchUISchema);
  useEffect(() => {
    // const token = localStorage.getItem('token');
    if (!checkAuth()) {
      router.push('/login');
    }
  }, []);
  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      try {
        setLoading(true);
        const responseForm: any = await fetchForm([
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
            header: {},
          },
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
            header: {
              tenantid: localStorage.getItem('tenantId'),
            },
          },
        ]);
        console.log('responseForm', responseForm?.schema);
        const r = await profileComplitionCheck();
        console.log(r);
        delete responseForm?.schema?.properties.password;
        delete responseForm?.schema?.properties.confirm_password;
        delete responseForm?.schema?.properties.username;
        delete responseForm?.schema?.properties.program;
        delete responseForm?.schema?.properties.batch;
        delete responseForm?.schema?.properties.center;
        delete responseForm?.schema?.properties.state;
        delete responseForm?.schema?.properties.district;
        delete responseForm?.schema?.properties.block;
        delete responseForm?.schema?.properties.village;

        responseForm?.schema?.required.pop('batch');
        let userId = localStorage.getItem('userId');
        if (userId) {
          const useInfo = await getUserDetails(userId, true);
          console.log('useInfo', useInfo?.result?.userData);
          setuserData(useInfo?.result?.userData);
          const mappedData = mapUserData(useInfo?.result?.userData);
          console.log(mappedData);

          const updatedSchema = getMissingFields(
            responseForm?.schema,
            useInfo?.result?.userData
          );
          console.log(updatedSchema);

          setUserFormData(mappedData);

          //unit name is missing from required so handled from frotnend
          let alterSchema = completeProfile
            ? updatedSchema
            : responseForm?.schema;
          let alterUISchema = responseForm?.uiSchema;

          //set 2 grid layout
          alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);
          console.log('alterUISchema', alterUISchema);
          if (!completeProfile) {
            alterUISchema = {
              ...alterUISchema,
              firstName: {
                ...alterUISchema.firstName,
                'ui:disabled': true,
              },
              dob: {
                ...alterUISchema.dob,
                'ui:disabled': true,
              },
              lastName: {
                ...alterUISchema.lastName,
                'ui:disabled': true,
              },
            };
          }

          setAddSchema(alterSchema);
          setAddUiSchema(alterUISchema);
        }
      } catch (error) {
        console.log('error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const enhanceUiSchemaWithGrid = (uiSchema: any): any => {
    const enhancedSchema = { ...uiSchema };

    Object.keys(enhancedSchema).forEach((fieldKey) => {
      if (typeof enhancedSchema[fieldKey] === 'object') {
        // Ensure ui:options exists
        if (!enhancedSchema[fieldKey]['ui:options']) {
          enhancedSchema[fieldKey]['ui:options'] = {};
        }

        // Push grid option
        enhancedSchema[fieldKey]['ui:options'].grid = { xs: 12, sm: 12, md: 6 };
      }
    });

    return enhancedSchema;
  };

  // formData.mobile = '8793607919';
  // formData.firstName = 'karan';
  // formData.lastName = 'patil';

  const onCloseInvalidLinkModal = () => {};
  const renderHomePage = () => {
    router.push('/');
  };

  const FormSubmitFunction = async (formData: any, payload: any) => {
    console.log('formData', formData);
    console.log(userFormData);
    if (userFormData.email == payload.email) {
      delete payload.email;
    }
    console.log('payload', payload);
    const { userData, customFields } = splitUserData(payload);
    let userId = localStorage.getItem('userId');
    const object = {
      userData: userData,
      customFields: customFields,
    };
    if (userId) {
      const updateUserResponse = await updateUser(userId, object);
      // console.log('updatedResponse', updateUserResponse);

      if (
        updateUserResponse &&
        updateUserResponse?.data?.params?.err === null
      ) {
        showToastMessage('Profile Updated succeessfully', 'success');
      }
      if (completeProfile) {
        router.push('/content');
      }
    }

    console.log(payload);
  };
  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      sx={{
        background: 'linear-gradient(to bottom, #fff7e6, #fef9ef)',
        overflow: 'auto',
      }}
    >
      {loading ? (
        <Box
          width="100%"
          id="check"
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Loader isLoading={true} layoutHeight={0}>
            {/* Your actual content goes here, even if it's an empty div */}
            <div />
          </Loader>
        </Box>
      ) : (
        <>
          <Box
            sx={{
              //   p: 2,
              mt: 2,
              ml: 2,
              cursor: 'pointer',
              width: 'fit-content',
              background: 'linear-gradient(to bottom, #fff7e6, #fef9ef)',
            }}
            onClick={() => router.back()}
          >
            <ArrowBackIcon
              sx={{ color: '#4B5563', '&:hover': { color: '#000' } }}
            />
          </Box>
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              fontFamily: `'Inter', sans-serif`,
              mb: '10px',
              // assuming Inter or similar
              //   mt: '15px',
              //  p: '25px',
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                fontSize: '24px',
                lineHeight: '32px',
                letterSpacing: '0px',
                textAlign: 'center',
              }}
            >
              {completeProfile ? 'Complete Your Profile' : 'Edit Profile'}
            </Typography>
          </Box>
          <Box
            ml="25%"
            // mt="70px"
            width="50vw"
            // height="100vh"
            display="flex"
            flexDirection="column"
            bgcolor={'#fff'}
            padding={'40px'}
            mb="20px"
          >
            {completeProfile && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Image src={face} alt="Step Icon" />
                <Typography fontWeight={600}>
                  Help us with your background & other details
                </Typography>
              </Box>
            )}
            {addSchema && addUiSchema && (
              <DynamicForm
                schema={addSchema}
                uiSchema={addUiSchema}
                FormSubmitFunction={FormSubmitFunction}
                prefilledFormData={completeProfile ? {} : userFormData}
                hideSubmit={true}
                type="learner"
              />
            )}
            <Button
              sx={{
                mt: 3,
                backgroundColor: '#FFC107',
                color: '#000',
                fontWeight: 'bold',
                '&:hover': {
                  backgroundColor: '#ffb300',
                },
              }}
              form="dynamic-form-id"
              type="submit"
            >
              Submit
            </Button>
          </Box>
        </>
      )}

      <SimpleModal
        open={invalidLinkModal}
        onClose={onCloseInvalidLinkModal}
        showFooter={true}
        primaryText={'Okay'}
        primaryActionHandler={renderHomePage}
      >
        <Box p="10px">Invalid Link</Box>
      </SimpleModal>
    </Box>
  );
};

export default EditProfile;
