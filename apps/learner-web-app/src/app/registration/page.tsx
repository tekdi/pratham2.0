'use client';

import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
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

type UserAccount = {
  name: string;
  username: string;
};
const registrationPage = () => {
  let formData: any = {};
  const [usernames, setUsernames] = useState<any[]>([]);
  const [accountExistModal, setAccountExistModal] = useState<boolean>(false);
  const [usernamePasswordForm, setUsernamePasswordForm] =
    useState<boolean>(false);

  const [otpmodal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [hash, setHash] = useState<string>('');
  const [verificationSuccessModal, setVerificationSuccessModal] =
    useState(false);
  //formData.email = 'a@tekditechnologies.com';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  useEffect(() => {
    let timer: any;
    if (verificationSuccessModal) {
      timer = setTimeout(() => {
        setUsernamePasswordForm(true);
        onCloseSuccessModal();
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [verificationSuccessModal]);
  const handleCreateAccount = () => {
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };
  formData.mobile = '8793607919';
  formData.firstName = 'karan';
  formData.lastName = 'patil';

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

      if (users.length > 0) {
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

  const handleLoginClick = () => {};
  const handleCloseModal = () => {
    setAccountExistModal(false);
  };
  const handleOTPModal = () => {
    setOtpModal(false);
    setOtp(['', '', '', '', '', '']);
  };
  const onCreateAnotherAccount = async () => {
    setAccountExistModal(false);
    await handleSendOtp(formData.mobile);
  };
  const onVerify = async () => {
    try {
      let mobile = formData.mobile.toString();
      let reason = 'signup';
      // let username = enterdUserName;
      const response = await verifyOTP({
        mobile,
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
      const response = await sendOTP({ mobile: formData.mobileNumber, reason });
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
  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      // overflow="hidden"
      sx={{
        background: 'linear-gradient(to bottom, #fff7e6, #fef9ef)',
      }}
    >
      {usernamePasswordForm ? (
        <Box mt="10%">
          <CreateAccountForm
            username={username}
            onUsernameChange={setUsername}
            password={password}
            onPasswordChange={setPassword}
            confirmPassword={confirmPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onSubmit={handleCreateAccount}
          />
        </Box>
      ) : (
        <Box
          // height="100vh"
          //   m="80px"
          ml="25%"
          mt="500px"
          width="50vw"
          display="flex"
          flexDirection="column"
          // overflow="hidden"
          sx={{
            background: 'linear-gradient(to bottom, #fff7e6, #fef9ef)',
          }}
        >
          <Button
            // variant="contained"
            //fullWidth
            sx={{
              mt: 3,
              backgroundColor: '#FFC107',
              color: '#000',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#ffb300',
              },
            }}
            onClick={() => handleAccountValidation(formData)}
          >
            {/* {t('LOGIN_PAGE.LOGIN')} */}
            Continue
          </Button>
        </Box>
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
          fullName={formData.firstName + ' ' + formData?.lastName}
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
          maskedNumber={maskMobileNumber(formData.mobileNumber)}
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
    </Box>
  );
};

export default registrationPage;
