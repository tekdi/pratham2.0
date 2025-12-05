'use client';

import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LanguageIcon from '@mui/icons-material/Language';
import { useRouter } from 'next/navigation';

export default function CmsLinkPage() {
  const router = useRouter();

  const [programName, setProgramName] = React.useState<string | null>(null);
  const [contentType, setContentType] = React.useState<
    'course' | 'content' | null
  >(null);
  const [identifier, setIdentifier] = React.useState<string | null>(null);
  const [isAndroidMobile, setIsAndroidMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if device is Android mobile
    const userAgent = window.navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isMobile = /Mobi|Android/i.test(userAgent);
    setIsAndroidMobile(isAndroid && isMobile);

    const params = new URLSearchParams(window.location.search);
    const typeFromRoute = params.get('type');
    const identifierFromRoute = params.get('identifier');
    const programFromRoute = params.get('program');

    setProgramName(programFromRoute);
    setContentType(
      typeFromRoute === 'course' || typeFromRoute === 'content'
        ? (typeFromRoute as 'course' | 'content')
        : null
    );
    setIdentifier(identifierFromRoute);

    if (
      typeFromRoute == null ||
      identifierFromRoute == null ||
      programFromRoute == null
    ) {
      router.push('/');
    }
  }, [router]);

  const handleOpenInMobile = () => {
    const deeplinkurl = `pratham://learnerapp?page=cmslink&type=${contentType}&identifier=${identifier}&program=${programName}`;

    // Encode the deep link parameters for Play Store referrer
    const deepLinkParams = encodeURIComponent(
      `page=cmslink&type=${contentType}&identifier=${identifier}&program=${programName}`
    );
    const appurl = `https://play.google.com/store/apps/details?id=com.pratham.learning&referrer=${deepLinkParams}`;

    // Try to open the deeplink
    const startTime = Date.now();
    const timeout = 2500; // 2.5 seconds timeout

    // Create a hidden iframe to attempt opening the deeplink
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = deeplinkurl;
    document.body.appendChild(iframe);

    // Set up a timer to check if the app opened
    const timer = setTimeout(() => {
      // If we're still here after the timeout, the app likely isn't installed
      // Redirect to Play Store
      window.location.href = appurl;
      document.body.removeChild(iframe);
    }, timeout);

    // Listen for page visibility change (app opening would hide the page)
    const handleVisibilityChange = () => {
      if (document.hidden || Date.now() - startTime > 1000) {
        // App likely opened, clear the timer
        clearTimeout(timer);
        document.body.removeChild(iframe);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
      }
    };

    // Listen for focus events (returning from app would trigger this)
    const handleFocus = () => {
      clearTimeout(timer);
      document.body.removeChild(iframe);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    // Fallback: try direct navigation as well
    setTimeout(() => {
      try {
        window.location.href = deeplinkurl;
      } catch (error) {
        console.log('Deeplink failed, will redirect to Play Store');
      }
    }, 100);
  };

  const handleContinueWithWeb = () => {
    if (!contentType || !identifier) {
      router.push('/');
      return;
    }
    const landingPage =
    typeof window !== "undefined"
      ? localStorage.getItem("landingPage")
      : "";
  
  const targetUrl =
    contentType === "course"
      ? `/content-details/${identifier}?activeLink=${landingPage}`
      : `/player/${identifier}?activeLink=${landingPage}&tab=1`;
  
  

    if (targetUrl) {
      router.push(targetUrl);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: (theme) => theme.palette.background.default,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card elevation={2} sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5} alignItems="stretch">
              {/* TODO: uncomment after deep linking done for mobile redirect */}
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ fontWeight: 600 }}
                >
                  {isAndroidMobile
                    ? 'How would you like to continue?'
                    : 'Continue with your content'}
                </Typography>
                {isAndroidMobile && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Choose an option below to proceed with your content.
                  </Typography>
                )}
              </Box>

              <Stack spacing={1.5} sx={{ mt: 1 }}>
                {/* TODO: uncomment after deep linking done for mobile redirect */}

                {isAndroidMobile && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenInMobile}
                    startIcon={<PhoneIphoneIcon />}
                    fullWidth
                  >
                    Open in mobile
                  </Button>
                )}

                <Button
                  variant={isAndroidMobile ? 'outlined' : 'contained'}
                  size="large"
                  onClick={handleContinueWithWeb}
                  startIcon={<LanguageIcon />}
                  fullWidth
                >
                  Continue with web
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
