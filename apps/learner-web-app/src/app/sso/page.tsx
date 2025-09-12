'use client';

import React, { Suspense, useEffect, useState, useRef } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Card,
  CardContent,
  Fade,
  keyframes,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { post } from '@learner/utils/API/RestClient';
import { RoleId, TenantName } from '@learner/utils/app.constant';
import { showToastMessage } from '@learner/components/ToastComponent/Toastify';
import Header from '@learner/components/Header/Header';
import Image from 'next/image';
import welcomeGIF from '../../../public/images/welcome.gif';
import { getUserId } from '@learner/utils/API/LoginService';
import { profileComplitionCheck } from '@learner/utils/API/userService';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';
import { logEvent } from '@learner/utils/googleAnalytics';
import SwitchAccountDialog from '@shared-lib-v2/SwitchAccount/SwitchAccount';

interface SSOAuthParams {
  accessToken: string;
  userId: string;
  tenantId: string;
  roleId: string;
  ssoProvider: string;
}

// Pulse animation for loading dots
const pulseAnimation = keyframes`
  0%, 80%, 100% { 
    transform: scale(0.8);
    opacity: 0.3;
  }
  40% { 
    transform: scale(1.2);
    opacity: 1;
  }
`;

// Success checkmark animation
const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(45deg);
    opacity: 1;
  }
`;

const SSOContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false); // Prevent duplicate calls
  const authenticationRef = useRef(false); // Additional safeguard with useRef

  useEffect(() => {
    // Prevent duplicate authentication calls using both state and ref
    if (hasAuthenticated || authenticationRef.current) {
      console.log('Authentication already in progress or completed');
      return;
    }

    const handleSSOCallback = async () => {
      try {
        // Mark authentication as started to prevent duplicates
        setHasAuthenticated(true);
        authenticationRef.current = true;
        console.log('Starting SSO authentication...');

        // Extract parameters from URL
        const env = searchParams.get('env');
        const tenantId = searchParams.get('tenantid');
        const accessToken = searchParams.get('accesstoken');
        const userId = searchParams.get('USER_ID');

        // Validate required parameters
        if (!env || !tenantId || !accessToken || !userId) {
          const missingParams = [];
          if (!env) missingParams.push('env');
          if (!tenantId) missingParams.push('tenantid');
          if (!accessToken) missingParams.push('accesstoken');
          if (!userId) missingParams.push('USER_ID');

          throw new Error(
            `Missing required parameters: ${missingParams.join(', ')}`
          );
        }

        // Prepare SSO authentication payload
        const ssoAuthData: SSOAuthParams = {
          accessToken,
          userId,
          tenantId,
          roleId: RoleId.STUDENT,
          ssoProvider: env,
        };

        // Make API call to authenticate
        const baseUrl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;
        const apiUrl = `${baseUrl}/user/sso/authenticate`;

        const response = await post(apiUrl, ssoAuthData);

        if (response?.data?.success || response?.data?.result) {
          setSuccess(true);
          await handleSuccessfulLogin(
            response?.data?.result,
            { remember: false },
            router
          );
          showToastMessage('Authentication successful!', 'success');

          // Redirect after brief success display
          setTimeout(() => {
            router.push('/content');
          }, 1500);
        } else {
          throw new Error(response?.data?.message || 'Authentication failed');
        }
      } catch (error: any) {
        console.error('SSO authentication error:', error);
        showToastMessage(error.message || 'Authentication failed', 'error');

        // Reset authentication flags on error so user can retry
        setHasAuthenticated(false);
        authenticationRef.current = false;

        // Redirect to home page after error
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } finally {
        setTimeout(() => {
          setProcessing(false);
        }, 800);
      }
    };

    handleSSOCallback();
  }, [searchParams.toString()]); // Use toString() to stabilize the dependency

  const [switchDialogOpen, setSwitchDialogOpen] = useState(false);
  const [userResponse, setUserResponse] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string>('');
  const [tenantName, setTenantName] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  const [roleName, setRoleName] = useState<string>('');

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
      setUserResponse(userResponse);

      setSwitchDialogOpen(true);
    }
  };

  const callBackSwitchDialog = async (
    tenantId: string,
    tenantName: string,
    roleId: string,
    roleName: string
  ) => {
    setSwitchDialogOpen(false);

    // Set the state values
    setTenantId(tenantId);
    setTenantName(tenantName);
    setRoleId(roleId);
    setRoleName(roleName);

    // const userResponse = await getUserId();

    if (userResponse) {
      const token =
        typeof window !== 'undefined' && window.localStorage
          ? localStorage.getItem('token')
          : '';
      if (roleName === 'Learner') {
        const tenantData = userResponse?.tenantData?.find(
          (tenant: any) => tenant.tenantId === tenantId
        );
        localStorage.setItem('userId', userResponse?.userId);
        localStorage.setItem('templtateId', tenantData.templateId);
        localStorage.setItem('userIdName', userResponse?.username);
        localStorage.setItem('firstName', userResponse?.firstName || '');

        const uiConfig = tenantData?.params?.uiConfig;

        localStorage.setItem('uiConfig', JSON.stringify(uiConfig || {}));

        localStorage.setItem('tenantId', tenantId);
        localStorage.setItem('userProgram', tenantName);
        await profileComplitionCheck();
        if (tenantName === TenantName.YOUTHNET) {
          const academicYearResponse = await getAcademicYear();
          if (academicYearResponse[0]?.id) {
            localStorage.setItem('academicYearId', academicYearResponse[0]?.id);
          }
        }
        const telemetryInteract = {
          context: { env: 'sign-in', cdata: [] },
          edata: {
            id: 'sso-login-success',
            type: 'CLICK',
            pageid: 'sign-in',
            uid: userResponse?.userId || 'Anonymous',
          },
        };
        telemetryFactory.interact(telemetryInteract);

        const channelId = tenantData.channelId;
        localStorage.setItem('channelId', channelId);

        const collectionFramework = tenantData?.collectionFramework;
        localStorage.setItem('collectionFramework', collectionFramework);

        document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;
        const query = new URLSearchParams(window.location.search);
        const redirectUrl = query.get('redirectUrl');
        const activeLink = query.get('activeLink');
        if (redirectUrl && redirectUrl.startsWith('/')) {
          router.push(
            `${redirectUrl}${activeLink ? `?activeLink=${activeLink}` : ''}`
          );
        }
        logEvent({
          action: 'successfully-login-in-learner-app-sso',
          category: 'SSO ERP',
          label: 'Login Button Clicked',
        });
        if (tenantName === TenantName.YOUTHNET) {
          router.push('/content');
        } else if (tenantName === TenantName.CAMP_TO_CLUB) {
          router.push('/courses-contents');
        } else if (tenantName === TenantName.PRAGYANPATH) {
          router.push('/courses-contents');
        }
      } else {
        showToastMessage('Authentication failed - invalid user role', 'error');
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
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFFDF6, #F8EFDA)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header />

      <Container
        maxWidth="sm"
        sx={{ flex: 1, display: 'flex', alignItems: 'center', py: 4 }}
      >
        <Card
          sx={{
            width: '100%',
            borderRadius: 3,
            boxShadow: 3,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
            >
              {/* Animated GIF */}
              <Fade in={true}>
                <Box>
                  <Image
                    src={welcomeGIF}
                    alt="Authentication"
                    width={100}
                    height={100}
                    style={{
                      borderRadius: '50%',
                      boxShadow: '0 4px 20px rgba(253, 190, 22, 0.3)',
                    }}
                  />
                </Box>
              </Fade>

              {/* Loading State */}
              {processing && !success && (
                <Fade in={processing}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={3}
                  >
                    <CircularProgress
                      size={60}
                      thickness={4}
                      sx={{
                        color: '#FDBE16',
                        '& .MuiCircularProgress-circle': {
                          strokeLinecap: 'round',
                        },
                      }}
                    />

                    {/* Animated loading dots */}
                    <Box display="flex" gap={1} alignItems="center">
                      {[0, 1, 2].map((index) => (
                        <Box
                          key={index}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#FDBE16',
                            animation: `${pulseAnimation} 1.4s ease-in-out infinite`,
                            animationDelay: `${index * 0.2}s`,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* Success State */}
              {success && (
                <Fade in={success}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={3}
                  >
                    {/* Success checkmark */}
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: '#1A8825',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        animation: `${checkmarkAnimation} 0.6s ease-in-out`,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 12,
                          border: '3px solid white',
                          borderTop: 'none',
                          borderRight: 'none',
                          transform: 'rotate(-45deg)',
                          position: 'absolute',
                          top: '18px',
                          left: '18px',
                        }}
                      />
                    </Box>

                    {/* Success pulse effect */}
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        border: '2px solid #1A8825',
                        position: 'absolute',
                        animation: `${pulseAnimation} 2s ease-in-out infinite`,
                        opacity: 0.3,
                      }}
                    />
                  </Box>
                </Fade>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
      <SwitchAccountDialog
        open={switchDialogOpen}
        onClose={() => setSwitchDialogOpen(false)}
        callbackFunction={callBackSwitchDialog}
        authResponse={userResponse?.tenantData}
      />
    </Box>
  );
};

const SSOPage = () => {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #FFFDF6, #F8EFDA)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress
            size={60}
            thickness={4}
            sx={{
              color: '#FDBE16',
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              },
            }}
          />
        </Box>
      }
    >
      <SSOContent />
    </Suspense>
  );
};

export default SSOPage;
