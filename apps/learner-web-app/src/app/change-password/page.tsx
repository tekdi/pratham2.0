'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Header from '@learner/components/Header/Header';
import ResetPasswordForm from '@learner/components/ResetPasswordForm/ResetPasswordForm';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import { sendOTP, verifyOTP } from '@learner/utils/API/OtPService';
import OtpVerificationComponent from '@learner/components/OtpVerificationComponent/OtpVerificationComponent';
import { maskMobileNumber } from '@learner/utils/helper';
import { useRouter } from 'next/navigation';
import PasswordResetSuccess from '@forget-password/Components/PasswordResetSuccess/PasswordResetSuccess';
import { login, resetPassword } from '@learner/utils/API/LoginService';
const ChangePassword = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [otpmodal, setOtpModal] = useState(false);
  const [hash, setHash] = useState<string>('');
  const [mobile, setMobile] = useState(
    localStorage.getItem('usermobile') || ''
  );
  const [resetPasswordSuccessModal, setResetPasswordSuccessModal] =
    useState(false);
  const router = useRouter();

  const handleResetPassword = async (
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    try {
      let userIdName = localStorage.getItem('userIdName');
      if (userIdName) {
        try {
          const response = await login({
            username: userIdName,
            password: oldPassword,
          });
          try {
            if (response) {
              console.log('hii');
              const response = await resetPassword(newPassword);
              console.log('Password reset response:', response);
              setResetPasswordSuccessModal(true);
            } else {
              showToastMessage(
                'The old password you entered is incorrect',
                'error'
              );
            }
          } catch (error) {
            console.log('error');
          }
        } catch (error) {
          showToastMessage(
            'The old password you entered is incorrect',
            'error'
          );
        }
      }

      //   const response = await resetPassword(newPassword);
      //   console.log('Password reset response:', response);
    } catch (error) {}
    // Add API call logic here
  };

  const handleForgotPassword = async () => {
    try {
      let reason = 'forgot';
      const response = await sendOTP({ mobile: mobile, reason });
      console.log('sendOTP', response);
      setHash(response?.result?.data?.hash);
      setOtpModal(true);
    } catch (error) {}
    console.log('Forgot Password clicked');
    // Navigate or show forgot password modal
  };
  const onVerify = async () => {
    try {
      // let mobile = mobile.toString();
      let reason = 'forgot';
      // let username = enterdUserName;
      const response = await verifyOTP({
        mobile: localStorage.getItem('usermobile') || '',
        reason,
        otp: otp.join(''),
        hash,
        //  username,
      });
      console.log('verifyOtp', response);
      let isValid = response.result.success;
      localStorage.setItem('tokenForResetPassword', response.result.token); // temporary assume true
      // let isValid = true;
      if (isValid) {
        // setVerificationSuccessModal(true);
        setOtpModal(false);
        localStorage.setItem('redirectionRoute', '/profile');
        router.push('/reset-Password');
      } else {
        showToastMessage('Please enter valid otp', 'error');
      }
    } catch (error) {
      showToastMessage('Please enter valid otp', 'error');
    } finally {
      setOtp(['', '', '', '']);
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
  const handleOTPModal = () => {
    setOtpModal(false);
    setOtp(['', '', '', '']);
  };
  const onCloseSuccessModal = () => {
    // const route = localStorage.getItem('redirectionRoute');
    // if (route)
    router.push('/profile');

    setResetPasswordSuccessModal(false);
  };

  return (
    <>
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        flexDirection="column"
        overflow="auto"
        mt="70px"
      >
        <Typography
          variant="body1"
          mb="20px"
          sx={{
            fontWeight: 600,
            fontSize: '24px',
            lineHeight: '32px',
            letterSpacing: '0px',
            textAlign: 'center',
          }}
        >
          Change Password
        </Typography>
        <ResetPasswordForm
          onResetPassword={handleResetPassword}
          onForgotPassword={handleForgotPassword}
        />
      </Box>
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
        open={resetPasswordSuccessModal}
        onClose={onCloseSuccessModal}
        showFooter
        primaryText={'Okay'}
        primaryActionHandler={onCloseSuccessModal}
      >
        <PasswordResetSuccess />
      </SimpleModal>
    </>
  );
};

export default ChangePassword;
