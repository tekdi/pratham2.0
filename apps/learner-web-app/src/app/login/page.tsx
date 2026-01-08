'use client';

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import WelcomeScreen from '@learner/components/WelcomeComponent/WelcomeScreen';
import Header from '@learner/components/Header/Header';
import { getUserId, login } from '@learner/utils/API/LoginService';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { preserveLocalStorage } from '@learner/utils/helper';
import Loader from '@learner/components/Loader/Loader';
import { getDeviceId } from '@shared-lib-v2/DynamicForm/utils/Helper';
import { getUserDetails, profileComplitionCheck } from '@learner/utils/API/userService';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';
import Image from 'next/image';
import playstoreIcon from '../../../public/images/playstore.png';
import prathamQRCode from '../../../public/images/prathamQR.png';
import welcomeGIF from '../../../public/images/welcome.gif';
import { logEvent } from '@learner/utils/googleAnalytics';
import { FilterKey, TenantName } from '../../utils/app.constant';

const Login = dynamic(
  () => import('@login/Components/LoginComponent/LoginComponent'),
  {
    ssr: false,
  }
);

const AppDownloadSection = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      maxWidth="500px"
    >
      {/* QR Code Section */}
      <Grid item xs={5} sm={5} md={4}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={1}
        >
          <Image
            src={prathamQRCode}
            alt={t('LEARNER_APP.LOGIN.qr_image_alt')}
            width={120}
            height={120}
            style={{ objectFit: 'contain' }}
          />
          <Box textAlign="center">
            <Typography fontWeight={600} fontSize="14px">
              {t('LEARNER_APP.LOGIN.GET_THE_APP')}
            </Typography>
            <Typography fontSize="12px" color="textSecondary">
              {t('LEARNER_APP.LOGIN.POINT_YOUR_PHONE')}
              <br />
              {t('LEARNER_APP.LOGIN.POINT_CAMERA')}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* OR Divider */}
      <Grid
        item
        xs={2}
        sm={2}
        md={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontWeight={500} fontSize="14px">
          {t('LEARNER_APP.LOGIN.OR')}
        </Typography>
      </Grid>

      {/* Play Store Section */}
      <Grid item xs={5} sm={5} md={5}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            router.push(
              'https://play.google.com/store/apps/details?id=com.pratham.learning'
            );
          }}
        >
          <Image
            src={playstoreIcon}
            alt={t('LEARNER_APP.LOGIN.playstore_image_alt')}
            width={100}
            height={32}
          />
          <Box textAlign="center">
            <Typography fontSize="12px" color="textSecondary">
              {t('LEARNER_APP.LOGIN.SEARCH_PLAYSTORE')}
              <br />
              {t('LEARNER_APP.LOGIN.ON_PLAYSTORE')}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const WelcomeMessage = () => {
  const { t } = useTranslation();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
      <Image
        src={welcomeGIF}
        alt={t('LEARNER_APP.LOGIN.welcome_image_alt')}
        width={60}
        height={60}
        style={{ marginBottom: '8px' }}
      />

      <Typography
        fontWeight={400}
        fontSize={{ xs: '24px', sm: '32px' }}
        lineHeight={{ xs: '32px', sm: '40px' }}
        letterSpacing="0px"
        textAlign="center"
        sx={{ verticalAlign: 'middle' }}
      >
        {t('LEARNER_APP.LOGIN.welcome_title')}
      </Typography>
      <Typography
        fontWeight={400}
        fontSize={{ xs: '18px', sm: '22px' }}
        lineHeight={{ xs: '24px', sm: '28px' }}
        letterSpacing="0px"
        textAlign="center"
        sx={{ verticalAlign: 'middle' }}
        mb={2}
      >
        {t('LEARNER_APP.LOGIN.welcome_subtitle')}
      </Typography>
    </Box>
  );
};

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleAddAccount = () => {
    router.push('/');
  };
  const { t } = useTranslation();

  const [tenantId, setTenantId] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');
  const [isAndroidApp, setIsAndroidApp] = useState(true);

  const handleSuccessfulLogin = useCallback(
    async (
      response: { access_token: string; refresh_token?: string | null },
      data: { remember: boolean }
    ) => {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      setLoading(true);

      const token = response.access_token;
      const refreshToken = response?.refresh_token ?? '';
      localStorage.setItem('token', token);
      data?.remember
        ? localStorage.setItem('refreshToken', refreshToken)
        : localStorage.removeItem('refreshToken');

      const userResponse = await getUserId();

      // Find tenantData with active status and Learner role
      //bug fix for roleid empty issue
      const tenantData = userResponse?.tenantData?.find((tenant: any) => {
        return (
          (tenant?.tenantStatus === 'active' || tenant?.tenantStatus === 'pending') &&
          tenant?.roles?.some((role: any) => role?.roleName === 'Learner')
        );
      });
      const tenantDataDetails = userResponse?.tenantData?.filter((tenant: any) => {
        return (
          (tenant?.tenantStatus === 'active' || tenant?.tenantStatus === 'pending') &&
          tenant?.roles?.some((role: any) => role?.roleName === 'Learner') && tenant?.tenantName !== "Pratham"
        );
      });
      // Extract role information from the matching tenant
      const learnerRole = tenantData?.roles?.find(
        (role: any) => role?.roleName === 'Learner'
      );

      const selectedTenantId = tenantData?.tenantId;
      const selectedTenantName = tenantData?.tenantName;
      const selectedRoleId = learnerRole?.roleId || '';
      const selectedRoleName = learnerRole?.roleName || 'Learner';

      setTenantId(selectedTenantId || '');
      setTenantName(selectedTenantName || '');
      setRoleId(selectedRoleId);
      setRoleName(selectedRoleName);
      if(tenantDataDetails[0]?.tenantName === "Pragyanpath" && tenantDataDetails.length === 1){
      setTimeout(async () => {
        const res = await getUserDetails(userResponse?.userId, true);
        console.log('response=========>', res?.result);
        localStorage.setItem(FilterKey.GROUP_MEMBERSHIP, JSON.stringify(["NA"]));
        localStorage.setItem(FilterKey.JOB_FAMILY, JSON.stringify(["NA"]));
        localStorage.setItem(FilterKey.PSU, JSON.stringify(["NA"]));
        
        // Store custom fields in localStorage
        if (res?.result?.userData?.customFields) {
          res.result.userData.customFields.forEach((field: any) => {
            const { label, selectedValues } = field;
            // localStorage.setItem(
            //   FilterKey[label as keyof typeof FilterKey],
            //   JSON.stringify(selectedValues)
            // );
            if(label === 'EMP_GROUP') {
              localStorage.setItem(FilterKey.GROUP_MEMBERSHIP, JSON.stringify(selectedValues));
            }
            
            if(label === 'JOB_FAMILY') {
              localStorage.setItem(FilterKey.JOB_FAMILY, JSON.stringify(selectedValues));
            }
           
            if(label === 'PSU') {
              localStorage.setItem(FilterKey.PSU, JSON.stringify(selectedValues));
            }
           
  
           
          });
        }
        const uiConfig = userResponse?.tenantData?.find(
          (tenant: any) => tenant.tenantName === "Pragyanpath"
         )?.params?.uiConfig;
        console.log('uiConfig', uiConfig);
        const landingPage =
          userResponse?.tenantData?.find(
            (tenant: any) => tenant.tenantName === "Pragyanpath"
           )?.params?.uiConfig?.landingPage;
        localStorage.setItem('landingPage', landingPage);

        localStorage.setItem('uiConfig', JSON.stringify(uiConfig || {}));

      //  setUserResponse(userResponse);

        //setSwitchDialogOpen(true);
      }, 1000);
    }
      if (tenantData && selectedRoleName === 'Learner') {
        localStorage.setItem('userId', userResponse?.userId);
        localStorage.setItem('roleId', selectedRoleId);
        localStorage.setItem('templtateId', tenantData?.templateId);
        localStorage.setItem('userIdName', userResponse?.username);
        localStorage.setItem('firstName', userResponse?.firstName || '');

        const uiConfig = tenantData?.params?.uiConfig;
        const landingPage = tenantData?.params?.uiConfig?.landingPage;
        localStorage.setItem('landingPage', landingPage);
        localStorage.setItem('uiConfig', JSON.stringify(uiConfig || {}));

        localStorage.setItem('tenantId', selectedTenantId || '');
        localStorage.setItem('userProgram', selectedTenantName || '');
        await profileComplitionCheck();
        if (selectedTenantName === TenantName.YOUTHNET) {
          const academicYearResponse = await getAcademicYear();
          if (academicYearResponse[0]?.id) {
            localStorage.setItem('academicYearId', academicYearResponse[0]?.id);
          }
        }
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

        const channelId = tenantData?.channelId;
        localStorage.setItem('channelId', channelId);

        const collectionFramework = tenantData?.collectionFramework;
        localStorage.setItem('collectionFramework', collectionFramework);

        document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;
        const query = new URLSearchParams(window.location.search);
        const redirectUrl = query.get('redirectUrl');
        const activeLink = query.get('activeLink');
        logEvent({
          action: 'successfully-login-in-learner-app',
          category: 'Login Page',
          label: 'Login Button Clicked',
        });
        if (redirectUrl && redirectUrl.startsWith('/')) {
          router.push(
            `${redirectUrl}${activeLink ? `?activeLink=${activeLink}` : ''}`
          );
        } else {
        console.log('tenantData', tenantDataDetails);
        if(tenantDataDetails.length ===1) {
          if(localStorage.getItem('isAndroidApp') == 'yes')
            {
             // Send message to React Native WebView
             if (window.ReactNativeWebView) {
               window.ReactNativeWebView.postMessage(JSON.stringify({
                 type: 'LOGIN_INTO_ONLY_ONE_PROGRAM_EVENT', // Event type identifier
                 data: {
                   userId: userResponse?.userId,
                   tenantId:selectedTenantId,
                   token: localStorage.getItem('token'),
                   refreshToken: localStorage.getItem('refreshTokenForAndroid'),
                 
                   // Add any data you want to send
                 }
               }));
             }
            }
            else{
         router.push(`${landingPage}`)
            }
         // router.push(`/programs?tenantId=${tenantDataDetails[0]?.tenantId}`);
        }
        else{
        router.push('/programs');
        }
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
      setLoading(false);
    },
    [router]
  );

  useEffect(() => {
    const init = async () => {
      try {
        const isAndroid = localStorage.getItem('isAndroidApp') === 'yes';
        setIsAndroidApp(isAndroid);
        // localStorage.clear();()
        preserveLocalStorage();

        const access_token = localStorage.getItem('token');
        const refresh_token = localStorage.getItem('refreshToken');
        if (access_token) {
          const response = {
            result: {
              access_token,
              refresh_token: refresh_token || undefined,
            },
          };
          handleSuccessfulLogin(response?.result, { remember: false });
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
  }, [handleSuccessfulLogin]);

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
        handleSuccessfulLogin(response?.result, data);
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
    } catch {
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
        //height="100vh"
        // width="100vw"
        display="flex"
        flexDirection="column"
        //  overflow="hidden"
        sx={{
          //  overflowWrap: 'break-word',
          wordBreak: 'break-word',
          background: 'linear-gradient(135deg, #FFFDF6, #F8EFDA)',
        }}
      >
        {/* Fixed Header */}
        <Header />

        {/* Main Content: Split screen */}
        <Box
          flex={1}
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          {/* Left: Welcome Screen - Hidden on mobile */}
          <Box
            flex={1}
            display={{ xs: 'none', sm: 'flex' }}
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: { xs: 'auto', sm: '100%' },
              py: { xs: 4, sm: 0 },
            }}
          >
            <WelcomeScreen />
          </Box>

          {/* Right: Login Component */}
          <Box
            flex={1}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            px={3}
            boxSizing="border-box"
            sx={{
              minHeight: { xs: 'auto', sm: '100%' },
              py: { xs: 2, sm: 0 },
            }}
          >
            {/* Welcome Message - Only visible on mobile */}
            <Box
              display={{ xs: 'flex', sm: 'none' }}
              justifyContent="center"
              alignItems="center"
              width="100%"
              mb={1}
            >
              <WelcomeMessage />
            </Box>

            <Login
              onLogin={handleLogin}
              handleForgotPassword={handleForgotPassword}
              handleAddAccount={handleAddAccount}
            />

            {/* App Download Section - Only visible on mobile */}
           { !isAndroidApp && (<Box
              display={{ xs: 'flex', sm: 'none' }}
              justifyContent="center"
              alignItems="center"
              width="100%"
              mt={4}
            >
              <AppDownloadSection />
            </Box>)
}
          </Box>
        </Box>
      </Box>
      {/* <SwitchAccountDialog
        open={switchDialogOpen}
        onClose={() => setSwitchDialogOpen(false)}
        callbackFunction={callBackSwitchDialog}
        authResponse={userResponse?.tenantData}
      /> */}
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
    </Suspense>
  );
};

export default LoginPage;
