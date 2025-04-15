'use client';

import React, { useEffect, useRef, useState } from 'react';
import ForgotPasswordComponent from '../../Components/ForgotPasswordComponent';
import SimpleModal from '../../Components/SimpleModal';
import OtpVerificationComponent from '../../Components/OtpVerificationComponent';
import ResetPasswordForm from '../../Components/ResetPasswordForm';
import AccountSelectionForm from '../../Components/AccountSelectionForm';
import PasswordResetSuccess from '../../Components/PasswordResetSuccess';
import ChangeUsernameComponent from '../../Components/ChangeUsernameComponent';

type ForgotPasswordPageProps = {
  onLoginSuccess: (response: any) => void;
  handleAddAccount?: () => void;
  handleForgotPassword?: () => void;
};

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({
  onLoginSuccess,
  handleAddAccount,
  handleForgotPassword,
}) => {
  const [mobileNumber, setmobileNumber] = useState<any>('');
  const [usernames, setUsernames] = useState<any>([]);

  const [otpmodal, setOtpModal] = useState<any>(false);
  const [resetPasswordScreen, setResetPasswordScreeen] = useState<any>(false);
  const [resetPasswordSuccessModal, setResetPasswordSucccessModal] =
    useState<any>(false);

  const [accountSelectionScreen, setAccountSelectionScreen] =
    useState<any>(false);

  const [otp, setOtp] = useState<string[]>(['', '', '', '']);

  const users = [
    { name: 'Anagha Dhinesh', username: 'anagha_28' },
    { name: 'Kanchan Srivastava', username: 'kanchan1998' },
    { name: 'Shivam Karnajan', username: 'shivam.karnajan765' },
    { name: 'Somnath Gharware', username: 'som@gharware' },
  ];
  const handleNextStep = (value: string) => {
    //api call get phone number by using username
    // if(getmobnumber)
    const isValidMobileNumber = /^[0-9]{10}$/.test(value);
    if (isValidMobileNumber) {
      // fetch all usernames by this  mobile number
      //  setUsernames()
      setAccountSelectionScreen(true);
    } else {
      setOtpModal(true);
    }
    console.log('User input:', value);
  };
  const onVerify = () => {
    console.log(otp);
    //if(otp is verified)
    setResetPasswordScreeen(true);
    setOtpModal(false);
  };
  const onCloseSuccessModal = () => {
    setResetPasswordSucccessModal(false);
  };
  const onResend = () => {
    console.log('resend otp');
  };
  const onResetpassword = () => {
    console.log('reset pass');
    setResetPasswordSucccessModal(true);
  };
  const handleCloseModal = () => {
    setOtpModal(false);
  };
  return (
    <>
      <ChangeUsernameComponent
        suggestedUsernames={[
          'anaghdadinesh789',
          'anaghdadinesh267',
          'anaghdadinesh342',
        ]}
        handleContinue={(selectedUsername) => {
          console.log('User selected:', selectedUsername);
        }}
      />{' '}
      {resetPasswordScreen ? (
        <ResetPasswordForm onSubmit={onResetpassword} />
      ) : accountSelectionScreen ? (
        <AccountSelectionForm userAccounts={users} onNext={handleNextStep} />
      ) : (
        <ForgotPasswordComponent onNext={handleNextStep} />
      )}
      <SimpleModal
        open={otpmodal}
        onClose={handleCloseModal}
        showFooter={true}
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
        showFooter={true}
        primaryText={'Okay'}
        primaryActionHandler={onCloseSuccessModal}
      >
        <PasswordResetSuccess />
      </SimpleModal>
    </>
  );
};

export default ForgotPasswordPage;
