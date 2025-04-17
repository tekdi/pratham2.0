import React, { useEffect, useRef, useState } from 'react';
// import { GetStaticPropsContext } from 'next';
// import WelcomeScreen from '../../Components/WelcomeScreen';
import { Box } from '@mui/material';
import LoginComponent from '@login/Components/LoginComponent/LoginComponent';
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
    <Box display="flex" height="100vh" width="100vw">
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
      </Box>

      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        pr={6} // Padding right = 4rem
        boxSizing="border-box"
        bgcolor="#ffffff" // Optional
      >
        <LoginComponent
          onLogin={onLoginSuccess}
          handleForgotPassword={handleForgotPassword}
          handleAddAccount={handleAddAccount}
        />
      </Box>
    </Box>
  );
};

export default LoginPage;
