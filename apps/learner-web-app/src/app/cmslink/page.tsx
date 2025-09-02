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

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

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
    console.log('typeFromRoute11', typeFromRoute);
    console.log('typeFromRouteidenti', identifierFromRoute);
    console.log('typeFromRouteprogram', programFromRoute);

    if (
      typeFromRoute == null ||
      identifierFromRoute == null ||
      programFromRoute == null
    ) {
      router.push('/');
    }
  }, [router]);

  const handleOpenInMobile = () => {
    alert('Mobile link not supported yet!!!');
  };

  const handleContinueWithWeb = () => {
    if (!contentType || !identifier) {
      router.push('/');
      return;
    }

    const targetUrl =
      contentType === 'course'
        ? `/content-details/${identifier}?activeLink=/courses-contents`
        : `/player/${identifier}?activeLink=/courses-contents?tab=1`;

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
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{ fontWeight: 600 }}
                >
                  How would you like to continue?
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Choose an option below to proceed with your content.
                </Typography>
              </Box>

              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleOpenInMobile}
                  startIcon={<PhoneIphoneIcon />}
                  fullWidth
                >
                  Open in mobile
                </Button>

                <Button
                  variant="outlined"
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
