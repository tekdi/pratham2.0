'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import WelcomeScreen from '@learner/components/WelcomeComponent/WelcomeScreen';
import Header from '@learner/components/Header/Header';
import { getUserId, login } from '@learner/utils/API/LoginService';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import { useRouter } from 'next/navigation';

const Login = dynamic(
  () => import('@login/Components/LoginComponent/LoginComponent'),
  {
    ssr: false,
  }
);

const LoginPage = () => {
  const router = useRouter();

  const handleAddAccount = () => {};
  const handleForgotPassword = () => {
    localStorage.setItem('loginRoute', '/login');
    router.push('/forget-password');
  };
  const handleLogin = async (data: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    console.log('Login Data:', data?.username);
    let username = data?.username;
    let password = data?.password;
    try {
      const response = await login({ username, password });
      if (response?.result?.access_token) {
        if (typeof window !== 'undefined' && window.localStorage) {
          const token = response.result.access_token;
          const refreshToken = response?.result?.refresh_token;
          localStorage.setItem('token', token);
          data?.remember
            ? localStorage.setItem('refreshToken', refreshToken)
            : localStorage.removeItem('refreshToken');

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
              router.push('/home');
            } else {
              showToastMessage(
                'LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT',
                'error'
              );
            }
          }
        }
      } else {
        showToastMessage('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT', 'error');
      }
      // setLoading(false);
    } catch (error: any) {
      //   setLoading(false);
      const errorMessage = 'LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT';
      showToastMessage(errorMessage, 'error');
    }
  };
  return (
    <Box
      height="100vh"
      width="100vw"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {/* Fixed Header */}
      <Header />

      {/* Main Content: Split screen */}
      <Box flex={1} display="flex" overflow="hidden">
        {/* Left: Welcome Screen */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <WelcomeScreen />
        </Box>

        {/* Right: Login Component */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
          pr={6}
          boxSizing="border-box"
          bgcolor="#ffffff"
        >
          <Login
            onLogin={handleLogin}
            handleForgotPassword={handleForgotPassword}
            handleAddAccount={handleAddAccount}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
