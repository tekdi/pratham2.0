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
import { Loader, useTranslation } from '@shared-lib';
import {
  firstLetterInUpperCase,
  getMissingFields,
  isUnderEighteen,
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
import Header from '../Header/Header';

type UserAccount = {
  name: string;
  username: string;
};
interface EditProfileProps {
  completeProfile: boolean;
  enrolledProgram?: boolean;
  uponEnrollCompletion?: () => void;
}

const EditProfile = ({ completeProfile, enrolledProgram, uponEnrollCompletion }: EditProfileProps) => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const directEnroll = searchParams.get('directEnroll');
  console.log('directEnroll', directEnroll);

  // Helper function to get program name (Navapatham if isForNavaPatham is true, otherwise userProgram)
  const getProgramName = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
      return '';
    }
    const isForNavaPatham =
      typeof window !== 'undefined' && window.localStorage
        ? localStorage.getItem('isForNavaPatham') === 'true'
        : false;
    return isForNavaPatham
      ? t('NAVAPATHAM.NAVAPATHAM')
      : localStorage.getItem('userProgram') || '';
  };
  // let formData: any = {};
  const [loading, setLoading] = useState(true);
  const [invalidLinkModal, setInvalidLinkModal] = useState(false);

  const localFormData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('formData') || '{}') : {};
  const [userFormData, setUserFormData] = useState<any>(localFormData);
  const [userData, setuserData] = useState<any>({});
  const [responseFormData, setResponseFormData] = useState<any>({});
  const localPayload = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('localPayload') || '{}') : {};
  const uiConfig =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
      : {};

  //formData.email = 'a@tekditechnologies.com';

  const router = useRouter();

  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);

  // Mobile field states
  const [mobileAddUiSchema, setMobileAddUiSchema] = useState({});
  const [mobileSchema, setMobileSchema] = useState({});

  // Parent data states (parent_phone, guardian_relation, guardian_name)
  const [parentDataAddUiSchema, setParentDataAddUiSchema] = useState({});
  const [parentDataSchema, setParentDataSchema] = useState({});

  console.log('addSchema', addSchema);

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

        const responseFormForEnroll: any = await fetchForm([
          {
            fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
            header: {
              tenantid: localStorage.getItem('tenantId'),
            },
          },
        ]);
        delete responseFormForEnroll?.schema?.properties?.password;
        delete responseFormForEnroll?.schema?.properties.confirm_password;
        delete responseFormForEnroll?.schema?.properties?.username;
        delete responseFormForEnroll?.schema?.properties?.program;
        delete responseFormForEnroll?.schema?.properties?.batch;
        delete responseFormForEnroll?.schema?.properties?.center;
        delete responseFormForEnroll?.schema?.properties?.state;
        delete responseFormForEnroll?.schema?.properties?.district;
        delete responseFormForEnroll?.schema?.properties?.block;
        delete responseFormForEnroll?.schema?.properties?.village;
        delete responseFormForEnroll?.schema?.properties?.consent_file;
        responseFormForEnroll?.schema?.required?.pop('batch');

        const responseFormCopy = JSON.parse(JSON.stringify(responseForm));
        setResponseFormData(responseFormCopy);
        console.log('responseForm===>', responseFormCopy?.schema);
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
          if (isUnderEighteen(useInfo?.result?.userData?.dob)) {
            delete responseForm?.schema.properties.mobile;
          }

          const updatedSchema = getMissingFields(
            responseForm?.schema,
            useInfo?.result?.userData
          );
          const updatedSchemaForEnroll = getMissingFields(
            responseFormForEnroll?.schema,
            useInfo?.result?.userData
          );
          console.log(updatedSchema);

          setUserFormData(mappedData);
          //unit name is missing from required so handled from frotnend
          let alterSchema = enrolledProgram?responseFormForEnroll?.schema:completeProfile
            ? updatedSchema
            : responseForm?.schema;
          let alterUISchema =enrolledProgram? responseFormForEnroll?.uiSchema: responseForm?.uiSchema;

          // Set mobile field states
          setMobileAddUiSchema(responseForm?.uiSchema?.mobile);
          setMobileSchema(responseFormCopy?.schema?.properties?.mobile);

          // Set parent data states (grouping parent_phone, guardian_relation, guardian_name)
          setParentDataAddUiSchema({
            parent_phone: responseForm?.uiSchema?.parent_phone,
            guardian_relation: responseForm?.uiSchema?.guardian_relation,
            guardian_name: responseForm?.uiSchema?.guardian_name
          });
          setParentDataSchema({
            parent_phone: responseFormCopy?.schema?.properties?.parent_phone,
            guardian_relation: responseFormCopy?.schema?.properties?.guardian_relation,
            guardian_name: responseFormCopy?.schema?.properties?.guardian_name
          });

          //set 2 grid layout
          alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

          // Add helper text to all CustomTextFieldWidget fields if isForNavaPatham is true
          alterUISchema = addHelperTextToTextFieldWidgets(alterUISchema);

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
                // 'ui:disabled': true,
              },
              lastName: {
                ...alterUISchema.lastName,
                'ui:disabled': true,
              },
            };
          }
          delete alterSchema?.properties?.is_volunteer;
       if(alterSchema?.properties?.family_member_details){
            if (!alterSchema?.required?.includes('family_member_details')) {
                        alterSchema?.required?.push('family_member_details')

            }
          }
          setAddSchema(alterSchema);
          alterUISchema.mobile=responseForm?.uiSchema?.mobile
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

  const addHelperTextToTextFieldWidgets = (uiSchema: any): any => {
    // Check if isForNavaPatham is true in localStorage
    const isForNavaPatham =
      typeof window !== 'undefined'
        ? localStorage.getItem('isForNavaPatham') === 'true'
        : false;

    // If isForNavaPatham is not true, return the schema without modifications
    if (!isForNavaPatham) {
      return uiSchema;
    }

    const enhancedSchema = { ...uiSchema };

    Object.keys(enhancedSchema).forEach((fieldKey) => {
      // Skip ui:order and other non-field keys
      if (fieldKey === 'ui:order') return;

      if (
        typeof enhancedSchema[fieldKey] === 'object' &&
        enhancedSchema[fieldKey] !== null
      ) {
        // Check if this field uses CustomTextFieldWidget
        if (enhancedSchema[fieldKey]['ui:widget'] === 'CustomTextFieldWidget') {
          // Ensure ui:options exists
          if (!enhancedSchema[fieldKey]['ui:options']) {
            enhancedSchema[fieldKey]['ui:options'] = {};
          }

          // Add helperText if it doesn't already exist
          if (!enhancedSchema[fieldKey]['ui:options'].helperText) {
            enhancedSchema[fieldKey]['ui:options'].helperText =
              'దయచేసి ఈ సమాచారాన్ని ఇంగ్లీష్ భాషలో మాత్రమే నమోదు చేయండి';
          }
        }
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
    const { userData, customFields = [] } = splitUserData(payload);
    //custom field hardcoded for pending status
    const data= {
      fieldId:
       'f8dc1d5f-9b2b-412e-a22a-351bd8f14963',
      value: 'pending'
    }
    const storedUiConfig = JSON.parse(localStorage.getItem('uiConfig') || '{}');
    const userTenantStatus = storedUiConfig?.isTenantPendingStatus;
if(enrolledProgram && userTenantStatus){
      customFields.push(data);
    }

    // Ensure "WHAT PROGRAM ARE YOU PART OF" is explicitly sent even when empty
    const programSchema =
      responseFormData?.schema?.properties?.what_program_are_you_part_of;
    const programFieldId = programSchema?.fieldId;

    const programFieldIndex = customFields.findIndex(
      (field: any) =>
        field?.fieldId === programFieldId ||
        field?.label === 'WHAT PROGRAM ARE YOU PART OF'
    );

    if (programFieldIndex === -1) {
      if(programFieldId) {
        customFields.push({
          fieldId: programFieldId,
          value: [],
        });
      }
    } else if (!Array.isArray(customFields[programFieldIndex].selectedValues)) {
      customFields[programFieldIndex].selectedValues = [];
    }

    const parentPhoneField = customFields.find(
      (field: any) => field.value === formData.parent_phone
    );
    console.log('Parent Phone Field:', parentPhoneField);
    if (parentPhoneField) {
      userData.mobile = parentPhoneField.value;
    }
    let userId = localStorage.getItem('userId');
    const object = {
      userData: {
        ...userData,
        future_work: t('LEARNER_APP.EDIT_PROFILE.FUTURE_WORK'),
      },
      customFields: customFields,
    };
    if (userId) {
      const updateUserResponse = await updateUser(userId, object);
      // console.log('updatedResponse', updateUserResponse);

      if (
        updateUserResponse &&
        updateUserResponse?.data?.params?.err === null
        && !enrolledProgram
      ) {
        showToastMessage('Profile Updated succeessfully', 'success');
      }
      if(enrolledProgram){
        uponEnrollCompletion?.();
        // Don't redirect here - let the callback handle navigation after showing modal
        return;
      }
      if (completeProfile) {
        const uiConfig =
          typeof window !== 'undefined'
            ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
            : {};
        //  const hasBothContentCoursetab = uiConfig?.showContent?.includes("courses") && uiConfig?.showContent?.includes("contents");

        //                 if (hasBothContentCoursetab) {
        //                   router.push('/courses-contents');
        //                 }
        //                  else
        //                 router.push('/content');

        const landingPage = localStorage.getItem('landingPage') || '';

        if (landingPage) {
          router.push(landingPage);
        } else {
          router.push('/content');
        }
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
          {directEnroll == 'true' && <Header isShowLogout={true} />}

         {directEnroll != 'true' && (<Box
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
          </Box>)}
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
              variant="body8"
              component="h2"
              sx={{
                fontWeight: 600,
                // fontSize: '24px',
                // lineHeight: '32px',
                letterSpacing: '0px',
                textAlign: 'center',
              }}
            >
              {enrolledProgram &&
              typeof window !== 'undefined' &&
              window.localStorage &&
              localStorage.getItem('userProgram')
                ? `${t('NAVAPATHAM.ENROLL_INTO')} ${getProgramName()}`
                : completeProfile
                ? t('LEARNER_APP.EDIT_PROFILE.COMPLETE_PROFILE_TITLE')
                : t('LEARNER_APP.EDIT_PROFILE.TITLE')}
            </Typography>

            {enrolledProgram &&
              typeof window !== 'undefined' &&
              window.localStorage &&
              uiConfig.registrationdescription && (
                <Typography
                  sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    p: '5px',
                  }}
                >
                  {uiConfig?.registrationdescription}
                </Typography>
              )}
          </Box>
          <Box
            sx={{
              ml: 'auto',
              mr: 'auto',
              width: {
                xs: '90vw',
                md: '50vw',
              },
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#fff',
              p: '40px',
            }}
          >
            {completeProfile && !enrolledProgram && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Image src={face} alt="Step Icon" />
                <Typography fontWeight={600}>
                  {t('LEARNER_APP.EDIT_PROFILE.BACKGROUND_HELP_TEXT')}
                </Typography>
              </Box>
            )}
            {enrolledProgram &&
              typeof window !== 'undefined' &&
              window.localStorage &&
              localStorage.getItem('userProgram') && (
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Image src={face} alt="Step Icon" />
                  <Typography fontWeight={600}>
                    {t('NAVAPATHAM.WELCOME_JOINED')} {getProgramName()}!<br />
                    {t('NAVAPATHAM.ENROLLMENT_INTRO')}
                  </Typography>
                </Box>
              )}
            {addSchema && addUiSchema && (
              <DynamicForm
                schema={addSchema}
                uiSchema={addUiSchema}
                mobileAddUiSchema={mobileAddUiSchema}
                mobileSchema={mobileSchema}
                parentDataAddUiSchema={parentDataAddUiSchema}
                parentDataSchema={parentDataSchema}
                forEditedschema={responseFormData?.schema?.properties}
                FormSubmitFunction={FormSubmitFunction}
                prefilledFormData={completeProfile ? {} : userFormData}
                hideSubmit={true}
                type="learner"
                isCompleteProfile={completeProfile}
                createNew={false}
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
              {enrolledProgram
                ? t('NAVAPATHAM.FINISH_ENROLL')
                : t('COMMON.SUBMIT')}
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
        <Box p="10px">{t('LEARNER_APP.EDIT_PROFILE.INVALID_LINK')}</Box>
      </SimpleModal>
    </Box>
  );
};

export default EditProfile;
