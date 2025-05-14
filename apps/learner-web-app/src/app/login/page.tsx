'use client';

import React, { Suspense, useEffect } from 'react';
import { Box } from '@mui/material';
import dynamic from 'next/dynamic';
import WelcomeScreen from '@learner/components/WelcomeComponent/WelcomeScreen';
import Header from '@learner/components/Header/Header';
import { getUserId, login } from '@learner/utils/API/LoginService';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import { useRouter } from 'next/navigation';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from '@shared-lib';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { preserveLocalStorage } from '@learner/utils/helper';
import { getDeviceId } from '@shared-lib-v2/DynamicForm/utils/Helper';
import { profileComplitionCheck } from '@learner/utils/API/userService';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';

const Login = dynamic(
  () => import('@login/Components/LoginComponent/LoginComponent'),
  {
    ssr: false,
  }
);

const LoginPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const handleAddAccount = () => {
    router.push('/');
  };
  const { t } = useTranslation();

  useEffect(() => {
    const init = async () => {
      try {
        // localStorage.clear();()
        preserveLocalStorage();

        const access_token = localStorage.getItem('token');
        const refresh_token = localStorage.getItem('refreshToken');
        if (access_token) {
          const response = {
            result: {
              access_token,
              refresh_token,
            },
          };
          handleSuccessfulLogin(response?.result, { remember: false }, router);
        }
        if (!localStorage.getItem('did')) {
          const visitorId = await getDeviceId();
          localStorage.setItem(
            'did',
            typeof visitorId === 'string' ? visitorId : ''
          );
          console.log('Device fingerprint generated successfully');
        }
      } catch (error) {
        console.error('Error generating device fingerprint:', error);
      }
    };
    init();
  }, []);

  const handleForgotPassword = () => {
    localStorage.setItem('redirectionRoute', '/login');
    //   router.push('/password-forget?redirectRoute=/login');

    router.push('/password-forget');
  };
  const handleLogin = async (data: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    const username = data?.username;
    const password = data?.password;
    try {
      const response = await login({ username, password });
      if (response?.result?.access_token) {
        handleSuccessfulLogin(response?.result, data, router);
      } else {
        showToastMessage(
          t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT'),
          'error'
        );
        const telemetryInteract = {
          context: { env: 'sign-in', cdata: [] },
          edata: {
            id: 'login-failed',
            type: 'CLICK',
            pageid: 'sign-in',
          },
        };
        telemetryFactory.interact(telemetryInteract);
      }
      // setLoading(false);
    } catch (error: any) {
      //   setLoading(false);
      const errorMessage = t('LOGIN_PAGE.USERNAME_PASSWORD_NOT_CORRECT');
      showToastMessage(errorMessage, 'error');
      const telemetryInteract = {
        context: { env: 'sign-in', cdata: [] },
        edata: {
          id: 'login-failed',
          type: 'CLICK',
          pageid: 'sign-in',
        },
      };
      telemetryFactory.interact(telemetryInteract);
    }
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Box
        height="100vh"
        width="100vw"
        display="flex"
        flexDirection="column"
        overflow="hidden"
        sx={{
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          background: 'linear-gradient(135deg, #FFFDF6, #F8EFDA)',
        }}
      >
        {/* Fixed Header */}
        <Header />

        {/* Main Content: Split screen */}
        <Box flex={1} display="flex" overflow="hidden">
          {/* Left: Welcome Screen */}
          {!isMobile && (
            <Box
              flex={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <WelcomeScreen />
            </Box>
          )}

          {/* Right: Login Component */}
          <Box
            flex={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
            pr={6}
            boxSizing="border-box"
            // bgcolor="#ffffff"
          >
            <Login
              onLogin={handleLogin}
              handleForgotPassword={handleForgotPassword}
              handleAddAccount={handleAddAccount}
            />
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
};

export default LoginPage;

const handleSuccessfulLogin = async (
  response: any,
  data: { remember: boolean },
  router: any
) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const token = response.access_token;
    const refreshToken = response?.refresh_token;
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
        localStorage.setItem(
          'templtateId',
          userResponse?.tenantData?.[0]?.templateId
        );
        localStorage.setItem('userIdName', userResponse?.username);
        localStorage.setItem('firstName', userResponse?.firstName || '');

        const tenantId = userResponse?.tenantData?.[0]?.tenantId;
        localStorage.setItem('tenantId', tenantId);
        await profileComplitionCheck();
        const academicYearResponse = await getAcademicYear();

        console.log(academicYearResponse[0]?.id, 'academicYearResponse');
        const telemetryInteract = {
          context: { env: 'sign-in', cdata: [] },
          edata: {
            id: 'login-success',
            type: 'CLICK',
            pageid: 'sign-in',
            uid: userResponse?.userId || 'Anonymous',
          },
        };
        telemetryFactory.interact(telemetryInteract);
        if (academicYearResponse[0]?.id) {
          localStorage.setItem('academicYearId', academicYearResponse[0]?.id);
        }

        const channelId = userResponse?.tenantData?.[0]?.channelId;
        localStorage.setItem('channelId', channelId);

        const collectionFramework =
          userResponse?.tenantData?.[0]?.collectionFramework;
        localStorage.setItem('collectionFramework', collectionFramework);

        document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;
        const redirectUrl = new URLSearchParams(window.location.search).get(
          'redirectUrl'
        );
        if (redirectUrl && redirectUrl.startsWith('/')) {
          router.push(redirectUrl);
        } else {
          router.push('/content');
        }
      } else {
        showToastMessage('Username or password not correct', 'error');
        const telemetryInteract = {
          context: { env: 'sign-in', cdata: [] },
          edata: {
            id: 'login-failed',
            type: 'CLICK',
            pageid: 'sign-in',
          },
        };
        telemetryFactory.interact(telemetryInteract);
      }
    }
  }
};
