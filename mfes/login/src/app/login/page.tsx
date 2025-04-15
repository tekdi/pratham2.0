import React, { useEffect, useRef, useState } from 'react';
// import { GetStaticPropsContext } from 'next';
import LoginComponent from '../../Components/loginComponent';
// import TestComp from '@learner/components/TestComp/TestComp';
// import {TestComp } from '@learner/components/TestComp/TestComp';
//  import TestComp from '@learner/';

// import ForgotPasswordComponent from '../Components/ForgotPasswordComponent';
// import AccountSelectionForm from '../Components/AccountSelectionForm';
// import ResetPasswordForm from '../Components/ResetPasswordForm';
type LoginPageProps = {
  onLoginSuccess: (response: any) => void;
  handleAddAccount?: () => void;
  handleForgotPassword?: () => void;
};

const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  handleAddAccount,
  handleForgotPassword,
}) => {
  const users = [
    { name: 'Anagha Dhinesh', username: 'anagha_28' },
    { name: 'Kanchan Srivastava', username: 'kanchan1998' },
    { name: 'Shivam Karnajan', username: 'shivam.karnajan765' },
    { name: 'Somnath Gharware', username: 'som@gharware' },
  ];
  return (
    <>
      {/* <ForgotPasswordComponent
        onNext={(value) => console.log('Next with:', value)}
      /> */}
      {/* <AccountSelectionForm
        userAccounts={users}
        onNext={(selected) => console.log(selected)}
      /> */}
      {/* <ResetPasswordForm onSubmit={onLoginSuccess} /> */}
      {/* <TestComp /> */}
      <main
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingRight: '4rem',
          boxSizing: 'border-box',
        }}
      >
        <LoginComponent
          onLogin={onLoginSuccess}
          handleForgotPassword={handleForgotPassword}
          handleAddAccount={handleAddAccount}
        />
      </main>
    </>
  );
};

export default LoginPage;
