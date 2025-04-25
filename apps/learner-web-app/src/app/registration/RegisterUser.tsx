'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button, Link, Typography } from '@mui/material';
import Header from '@learner/components/Header/Header';
import dynamic from 'next/dynamic';
import { userCheck } from '@learner/utils/API/userService';
import AccountExistsCard from '@learner/components/AccountExistsCard/AccountExistsCard';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import OtpVerificationComponent from '@learner/components/OtpVerificationComponent/OtpVerificationComponent';
import { sendOTP, verifyOTP } from '@learner/utils/API/OtPService';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import axios from 'axios';
import MobileVerificationSuccess from '@learner/components/MobileVerificationSuccess/MobileVerificationSuccess';
import CreateAccountForm from '@learner/components/CreateAccountForm/CreateAccountForm';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { fetchForm } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import { useRouter } from 'next/navigation';
import { createUser } from '@shared-lib-v2/DynamicForm/services/CreateUserService';
import { RoleId } from '@shared-lib-v2/DynamicForm/utils/app.constant';
import { getUserId, login } from '@learner/utils/API/LoginService';
import SignupSuccess from '@learner/components/SignupSuccess /SignupSuccess ';
import { Loader } from '@shared-lib';
import { firstLetterInUpperCase } from '@learner/utils/helper';
import face from '../../../public/images/Group 3.png';

//build issue fix for  ⨯ useSearchParams() should be wrapped in a suspense boundary at page
import { useSearchParams } from 'next/navigation';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import Image from 'next/image';

type UserAccount = {
  name: string;
  username: string;
};
const RegisterUser = () => {
  const searchParams = useSearchParams();
  const newAccount = searchParams.get('newAccount');
  const tenantId = searchParams.get('tenantId');

  // let formData: any = {};
  const [usernames, setUsernames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [invalidLinkModal, setInvalidLinkModal] = useState(false);

  const [accountExistModal, setAccountExistModal] = useState<boolean>(false);
  const [usernamePasswordForm, setUsernamePasswordForm] =
    useState<boolean>(false);

  const [otpmodal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [hash, setHash] = useState<string>('');
  const localFormData = JSON.parse(localStorage.getItem('formData') || '{}');
  const [formData, setFormData] = useState<any>(localFormData);
  const localPayload = JSON.parse(localStorage.getItem('localPayload') || '{}');

  const [payload, setPayload] = useState<any>(localPayload);

  const [verificationSuccessModal, setVerificationSuccessModal] =
    useState(false);
  const [signupSuccessModal, setSignupSuccessModal] = useState(false);

  //formData.email = 'a@tekditechnologies.com';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const router = useRouter();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);

  // const [schema, setSchema] = useState(facilitatorSearchSchema);
  // const [uiSchema, setUiSchema] = useState(facilitatorSearchUISchema);
  function checkTenantId(tenantIdToCheck: any, tenantData: any) {
    return tenantData?.some((item: any) => item.tenantId === tenantIdToCheck);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTenantInfo();
        console.log('res', res?.result);

        const isPresent = checkTenantId(tenantId, res?.result);
        console.log('isPresent', isPresent);
        if (!isPresent) {
          setInvalidLinkModal(true);
        }
      } catch (error) {}
    };
    fetchData();
  }, [tenantId]);
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
          // {
          //   fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.learner.context}&contextType=${FormContext.learner.contextType}`,
          //   header: {
          //     tenantid: localStorage.getItem('tenantId'),
          //   },
          // },
        ]);
        console.log('responseForm', responseForm?.schema);
        delete responseForm?.schema?.properties.password;
        delete responseForm?.schema?.properties.confirm_password;
        delete responseForm?.schema?.properties.username;
        delete responseForm?.schema?.properties.program;

        //unit name is missing from required so handled from frotnend
        let alterSchema = responseForm?.schema;
        let alterUISchema = responseForm?.uiSchema;

        //set 2 grid layout
        alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

        setAddSchema(alterSchema);
        setAddUiSchema(alterUISchema);
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

  useEffect(() => {
    let timer: any;
    if (verificationSuccessModal) {
      timer = setTimeout(() => {
        //   router.push(`/account-selection?newAccount=${'true'}`);
        // params.set('newAccount', 'true');

        onCloseSuccessModal();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [verificationSuccessModal]);
  const handleCreateAccount = async () => {
    try {
      console.log('Username:', username);
      console.log('Username:', formData);
      console.log('Username:', payload);

      console.log('Password:', password);
      console.log('Confirm Password:', confirmPassword);
      console.log('Confirm Password:', confirmPassword);
      const localPayload = localStorage.getItem('localPayload');
      if (localPayload && tenantId) {
        const payloadData = JSON.parse(
          localStorage.getItem('localPayload') || '{}'
        );
        const tenantData = [{ roleId: RoleId.STUDENT, tenantId: tenantId }];

        const createuserPayload = {
          ...payload,
          username: username,
          password: password,
          program: tenantId,
          tenantCohortRoleMapping: tenantData,
        };
        localStorage.setItem('localPayload', JSON.stringify(createuserPayload));
        const responseUserData = await createUser(createuserPayload);
        console.log(responseUserData);
        if (responseUserData) {
          setSignupSuccessModal(true);
        } else {
          showToastMessage('Username Already Exist', 'error');
        }

        console.log(responseUserData);
      }
    } catch (error) {}
  };
  // formData.mobile = '8793607919';
  // formData.firstName = 'karan';
  // formData.lastName = 'patil';
  console.log(payload);
  const maskMobileNumber = (mobile: string) => {
    if (mobile && mobile.length < 2) return mobile;
    else if (mobile) {
      const first = mobile[0];
      const last = mobile[mobile.length - 1];
      const masked = '*'.repeat(mobile.length - 2);
      return first + masked + last;
    }
  };
  const handleSendOtp = async (mob: string) => {
    try {
      const reason = 'signup';
      const response = await sendOTP({ mobile: mob, reason });

      console.log('sendOTP', response);
      setHash(response?.result?.data?.hash);
      setOtpModal(true);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleAccountValidation = async (formData: any) => {
    try {
      const isEmailCheck = Boolean(formData.email);
      const payload = isEmailCheck
        ? { email: formData.email }
        : { firstName: formData.firstName, mobile: formData.mobile };

      const response = await userCheck(payload);
      const users = response?.result || [];
      if (users.length > 0 && isEmailCheck) {
        showToastMessage('Email already exists', 'error');
      } else if (users.length > 0) {
        const usernameList = users.map((user: any) => user.username);

        setUsernames(usernameList);
        setAccountExistModal(true);
      } else {
        setOtpModal(true);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response?.data?.params?.errmsg);
      }
      const errorMessage = error.response?.data?.params?.errmsg;
      if (errorMessage == 'User does not exist') {
        let reason = 'signup';
        handleSendOtp(formData.mobile);
      }
      // errmsg: 'User does not exist'

      console.error('Error in account validation:', error);
      // Optionally handle fallback here
    }
  };

  const handleLoginClick = () => {
    router.push('/login');
  };
  const handleCloseModal = () => {
    setAccountExistModal(false);
  };
  const handleOTPModal = () => {
    setOtpModal(false);
    setOtp(['', '', '', '', '', '']);
  };
  const onCreateAnotherAccount = async () => {
    setAccountExistModal(false);
    await handleSendOtp(mobile);
  };
  const onVerify = async () => {
    try {
      // let mobile = mobile.toString();
      let reason = 'signup';
      // let username = enterdUserName;
      const response = await verifyOTP({
        mobile: mobile.toString(),
        reason,
        otp: otp.join(''),
        hash,
        //  username,
      });
      console.log('verifyOtp', response);
      const isValid = response.result.success;
      localStorage.setItem('tokenForResetPassword', response.result.token); // temporary assume true

      if (isValid) {
        setVerificationSuccessModal(true);
        setOtpModal(false);

        // router.push('/reset-Password');
      } else {
        showToastMessage('Please enter valid otp', 'error');
      }
    } catch (error) {
      showToastMessage('Please enter valid otp', 'error');
    } finally {
      setOtp(['', '', '', '', '', '']);
    }
  };
  const onResend = async () => {
    try {
      let reason = 'forgot';
      const response = await sendOTP({ mobile: mobile, reason });
      console.log('sendOTP', response);
      setHash(response?.result?.data?.hash);
    } catch (error) {}
  };

  const onCloseSuccessModal = () => {
    //  const route = localStorage.getItem('redirectionRoute');
    //   if (route) router.push(route);

    setVerificationSuccessModal(false);
    setUsernamePasswordForm(true);
  };
  const onCloseSignupSuccessModal = () => {
    //  const route = localStorage.getItem('redirectionRoute');
    //   if (route) router.push(route);

    setSignupSuccessModal(false);
    // setUsernamePasswordForm(true);
  };
  const onCloseInvalidLinkModal = () => {};
  const renderHomePage = () => {
    router.push('/');
  };
  const onSigin = async () => {
    let username;
    let password;
    const localPayload = localStorage.getItem('localPayload');
    if (localPayload) {
      const payloadData = JSON.parse(
        localStorage.getItem('localPayload') || '{}'
      );
      username = payloadData?.username;
      password = payloadData?.password;
    }

    try {
      if (username && password) {
        console.log('hello');

        const response = await login({ username, password });
        if (response?.result?.access_token) {
          if (typeof window !== 'undefined' && window.localStorage) {
            const token = response.result.access_token;
            const refreshToken = response?.result?.refresh_token;
            localStorage.setItem('token', token);

            const userResponse = await getUserId();

            if (userResponse) {
              if (
                userResponse?.tenantData?.[0]?.roleName === 'Learner' &&
                userResponse?.tenantData?.[0]?.tenantName === 'YouthNet'
              ) {
                localStorage.setItem('userId', userResponse?.userId);
                console.log(userResponse?.tenantData);
                localStorage.setItem(
                  'templtateId',
                  userResponse?.tenantData?.[0]?.templateId
                );

                localStorage.setItem('userIdName', userResponse?.username);

                const tenantId = userResponse?.tenantData?.[0]?.tenantId;
                localStorage.setItem('tenantId', tenantId);

                const channelId = userResponse?.tenantData?.[0]?.channelId;
                localStorage.setItem('channelId', channelId);

                const collectionFramework =
                  userResponse?.tenantData?.[0]?.collectionFramework;
                localStorage.setItem(
                  'collectionFramework',
                  collectionFramework
                );

                document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;

                router.push('/content');
              } else {
                // showToastMessage(
                //   'LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT',
                //   'error'
                // );
              }
            }
          }
        } else {
          // showToastMessage('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT', 'error');
        }
        setSignupSuccessModal(false);
      }
      // setLoading(false);
    } catch (error: any) {
      //   setLoading(false);
      const errorMessage = 'LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT';
      showToastMessage(errorMessage, 'error');
    }
  };
  //   const handleLogin = async () => {
  //     if (formData.email) {
  //       const email = formData.email;
  //       const response = await userCheck({ email });
  //       console.log('response', response.result);
  //       const userList = response.result.map((user: any) => ({
  //         name: [user.firstName, user.middleName, user.lastName]
  //           .filter(Boolean)
  //           .join(' '),
  //         username: user.username,
  //       }));
  //       const usernameList = response.result.map((user: any) => user.username);

  //       console.log(usernameList);
  //       setUsernames(usernameList);
  //     }
  //   };
  const FormSubmitFunction = async (formData: any, payload: any) => {
    localStorage.setItem('formData', JSON.stringify(formData));
    setPayload(payload);
    localStorage.setItem('localPayload', JSON.stringify(payload));
    setFormData(formData);
    handleAccountValidation(formData);
    console.log(formData);
    console.log(payload);
    setMobile(formData.mobile);
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
          </Loader>{' '}
        </Box>
      ) : usernamePasswordForm ? (
        <Box mt="10%">
          <CreateAccountForm
            username={username}
            onUsernameChange={setUsername}
            password={password}
            onPasswordChange={setPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleCreateAccount}
            belowEighteen={formData.guardian_name ? true : false}
          />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              fontFamily: `'Inter', sans-serif`, // assuming Inter or similar
              mt: '15px',
            }}
          >
            <Typography variant="h2" fontWeight="bold" gutterBottom>
              Sign Up for YouthNet
            </Typography>

            <Typography variant="body1" color="text.secondary" mb={2}>
              Get vocational training to land an entry level job with 2 months
              of training
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Already signed up?{' '}
              <Link
                href="/login"
                underline="hover"
                color="secondary"
                fontWeight="bold"
              >
                Click here to login
              </Link>
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
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Image src={face} alt="Step Icon" />
              <Typography fontWeight={600}>
                1/2 Tell us about yourself
              </Typography>
            </Box>

            {addSchema && addUiSchema && (
              <DynamicForm
                schema={addSchema}
                uiSchema={addUiSchema}
                FormSubmitFunction={FormSubmitFunction}
                prefilledFormData={formData}
                hideSubmit={true}
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
              Continue
            </Button>
          </Box>
        </>
      )}

      <SimpleModal
        open={accountExistModal}
        onClose={handleCloseModal}
        showFooter
        primaryText={'Yes, Create Another Account'}
        modalTitle={'Account Already Exists'}
        primaryActionHandler={onCreateAnotherAccount}
        footerText="Are you sure you want to create another account?"
      >
        <AccountExistsCard
          fullName={firstLetterInUpperCase(
            formData.firstName + ' ' + formData?.lastName
          )}
          usernames={usernames}
          onLoginClick={handleLoginClick}
        />
      </SimpleModal>

      <SimpleModal
        open={otpmodal}
        onClose={handleOTPModal}
        showFooter
        primaryText={'Verify OTP'}
        modalTitle={'Verify Your Phone Number'}
        primaryActionHandler={onVerify}
      >
        <OtpVerificationComponent
          onResend={onResend}
          otp={otp}
          setOtp={setOtp}
          maskedNumber={maskMobileNumber(mobile || '')}
        />
      </SimpleModal>

      <SimpleModal
        open={verificationSuccessModal}
        onClose={onCloseSuccessModal}
        showFooter={false}
        primaryText={'Okay'}
        primaryActionHandler={onCloseSuccessModal}
      >
        <Box p="10px">
          <MobileVerificationSuccess />
        </Box>
      </SimpleModal>

      <SimpleModal
        open={signupSuccessModal}
        onClose={onCloseSignupSuccessModal}
        showFooter={true}
        primaryText={'Start learning'}
        primaryActionHandler={onSigin}
      >
        <Box p="10px">
          <SignupSuccess />
        </Box>
      </SimpleModal>

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

export default RegisterUser;
