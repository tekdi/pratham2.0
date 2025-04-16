'use client';

import React, { useEffect, useRef, useState } from 'react';
import ForgotPasswordComponent from '../../Components/ForgotPasswordComponent';
import SimpleModal from '../../Components/SimpleModal';
import OtpVerificationComponent from '../../Components/OtpVerificationComponent';
import ResetPasswordForm from '../../Components/ResetPasswordForm';
import AccountSelectionForm from '../../Components/AccountSelectionForm';
import PasswordResetSuccess from '../../Components/PasswordResetSuccess';
type UserAccount = {
  name: string;
  username: string;
};

type ForgotPasswordPageProps = {
  fetchMobileByUsername: (username: string) => Promise<string>;
  fetchUsernamesByMobile: (mobile: string) => Promise<UserAccount[]>;
  verifyOtp: (otp: string[]) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<void>;
  suggestedUsernames?: string[];
};

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  fetchMobileByUsername,
  fetchUsernamesByMobile,
  verifyOtp,
  resetPassword,
  suggestedUsernames = [],
}) => {
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [usernames, setUsernames] = useState<UserAccount[]>([]);
  const [otpmodal, setOtpModal] = useState(false);
  const [resetPasswordScreen, setResetPasswordScreen] = useState(false);
  const [resetPasswordSuccessModal, setResetPasswordSuccessModal] =
    useState(false);
  const [accountSelectionScreen, setAccountSelectionScreen] = useState(false);
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  const handleNextStep = async (value: string) => {
    const isValidMobileNumber = /^[0-9]{10}$/.test(value);

    if (isValidMobileNumber) {
      //const userList = await fetchUsernamesByMobile(value);
      let userList = [
        { name: 'Anagha Dhinesh', username: 'anagha_28' },
        { name: 'Kanchan Srivastava', username: 'kanchan1998' },
        { name: 'Shivam Karnajan', username: 'shivam.karnajan765' },
        { name: 'Somnath Gharware', username: 'som@gharware' },
      ]; // currently assume here dummy data
      setUsernames(userList);
      setAccountSelectionScreen(true);
    } else {
      // const mobile = await fetchMobileByUsername(value);
      let mobile = '9087'; // currently assume here dummy mob number
      setMobileNumber(mobile);
      setOtpModal(true);
    }

    console.log('User input:', value);
  };

  const onVerify = async () => {
    // const isValid = await verifyOtp(otp);
    const isValid = true; // temporary assume true
    if (isValid) {
      setResetPasswordScreen(true);
      setOtpModal(false);
    }
  };

  const onResetPassword = async (newPassword: string) => {
    // await resetPassword(newPassword);
    setResetPasswordSuccessModal(true);
  };

  const onCloseSuccessModal = () => setResetPasswordSuccessModal(false);
  const onResend = () => console.log('resend otp');
  const handleCloseModal = () => setOtpModal(false);

  return (
    <>
      {resetPasswordScreen ? (
        <ResetPasswordForm onSubmit={onResetPassword} />
      ) : accountSelectionScreen ? (
        <AccountSelectionForm
          userAccounts={usernames}
          onNext={handleNextStep}
        />
      ) : (
        <ForgotPasswordComponent onNext={handleNextStep} />
      )}
      <SimpleModal
        open={otpmodal}
        onClose={handleCloseModal}
        showFooter
        primaryText={'Verify OTP'}
        modalTitle={'Verify Your Phone Number'}
        primaryActionHandler={onVerify}
      >
        <OtpVerificationComponent
          onVerify={onVerify}
          onResend={onResend}
          otp={otp}
          setOtp={setOtp}
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

export default ForgotPasswordPage;
