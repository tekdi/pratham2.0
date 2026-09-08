'use client';

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@learner/components/Header/Header';
import {
  getTenantInfo,
  getPrathamTenantId,
} from '@learner/utils/API/ProgramService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from '@shared-lib';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Program {
  ordering: number;
  name: string;
  tenantId: string;
  description?: string;
  params?: {
    uiConfig?: {
      showSignup?: boolean;
      showSignIn?: boolean;
      showProgram?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
  programImages?: (
    | string
    | {
        label?: string;
        description?: string;
        [key: string]: any;
      }
  )[];
}

export default function LandingPage() {
  const router = useRouter();
  const { t, setLanguage } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  // Set Telugu as default language for this page only
  useEffect(() => {
    // Set Telugu as the default language when this page loads
    // This runs immediately on mount to ensure language is set before Header renders
    if (typeof window !== 'undefined') {
      const currentLang = localStorage.getItem('lang');
      // Only set if not already Telugu to avoid unnecessary updates
      if (currentLang !== 'tel') {
        localStorage.setItem('lang', 'tel');
        localStorage.setItem('preferredLanguage', 'tel');
        setLanguage('tel');
      }
    }
  }, [setLanguage]);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getTenantInfo();
        const programsData = res?.result || [];
        const visiblePrograms = programsData?.filter(
          (program: any) => program?.params?.uiConfig?.showProgram === true
          // program?.params?.uiConfig?.sso?.length > 0
        );
        setPrograms(visiblePrograms || []);
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
    localStorage.setItem('isForNavaPatham', 'true');
  }, []);

  const handleGetStarted = async () => {
    router.push(`/registration?tenantId=Pratham&enroll=Second%20Chance%20Program`);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handlePragyanpath = () => {
    const program = programs.find((p) =>
      p.name.toLowerCase().includes('pragyanpath')
    );
    if (program) {
      if (program?.params?.uiConfig?.sso?.length > 0) {
        const ssoOption = program?.params?.uiConfig?.sso?.find(
          (option: any) => {
            const currentDomain =
              typeof window !== 'undefined' ? window.location.origin : '';
            return option?.enable_domain?.includes(currentDomain);
          }
        );

        if (ssoOption) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(
              'landingPage',
              program?.params?.uiConfig?.landingPage
            );
            localStorage.setItem('userProgram', program?.name);
            const uiConfig = program?.params?.uiConfig || {};
            localStorage.setItem('uiConfig', JSON.stringify(uiConfig));
          }
          // Construct SSO URL with callback parameters
          const currentBaseUrl =
            typeof window !== 'undefined' ? window.location.origin : '';
          const callbackUrl = `${currentBaseUrl}/sso?env=newton&tenantid=${program?.tenantId}`;
          const encodedCallbackUrl = callbackUrl;
          // encodeURIComponent(callbackUrl);
          // roleId
          const ssoUrl = `${ssoOption?.url}?callbackurl=${encodedCallbackUrl}`;

          // Open SSO URL in new tab
          window.open(ssoUrl, '_blank');
        }
      }
    }
  };

  const aboutNavaPathamText = t('NAVAPATHAM.ABOUT_NAVAPATHAM_TEXT');
  const aboutPrathamText = t('NAVAPATHAM.ABOUT_PRATHAM_INFO');

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#fff',
        }}
      >
        {/* Hero Banner Section */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: { xs: '400px', md: '500px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: 'url(/images/nava-patham.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            },
          }}
        >
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                textAlign: 'center',
                color: '#fff',
                py: { xs: 3, md: 4 },
              }}
            >
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '32px',
                  lineHeight: '40px',
                  letterSpacing: '0px',
                  textAlign: 'center',
                  mb: 1,
                  color: '#fff',
                }}
              >
                {t('NAVAPATHAM.WELCOME_TO_NAVAPATHAM')}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: '22px',
                  lineHeight: '28px',
                  letterSpacing: '0px',
                  textAlign: 'center',
                  mb: 2,
                  color: '#fff',
                }}
              >
                {t('LANDING.YOUR_LEARNING_JOURNEY_BEGINS_HERE')}
              </Typography>
              <Button
                variant="contained"
                onClick={handleGetStarted}
                sx={{
                  fontFamily: 'Poppins',
                  backgroundColor: '#FFC107',
                  color: '#1E1B16',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.15px',
                  textAlign: 'center',
                  px: 4,
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  //  mb: 2,
                  '&:hover': {
                    backgroundColor: '#FFB300',
                  },
                }}
              >
                {t('LANDING.GET_STARTED')}
              </Button>
              <Box
                sx={{
                  //  mt: 2,
                  borderRadius: '8px',
                  py: 3,
                  px: 3,
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    mb: 1,
                    fontSize: '20px',
                  }}
                >
                  {t('LANDING.ALREADY_SIGNED_UP')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handleLogin}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    fontFamily: 'Poppins',
                    backgroundColor: 'rgba(31, 27, 19, 0.5)',
                    borderColor: '#fff',
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '16px',
                    lineHeight: '24px',
                    letterSpacing: '0.15px',
                    textAlign: 'center',
                    px: 4,
                    py: 1.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#fff',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {t('LANDING.LOGIN')}
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* About Pratham Section */}
        <Container
          maxWidth="xl"
          disableGutters
          sx={{ my: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}
        >
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 450,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  //  marginTop: '80px',
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/GHDXLXVgH-E?si=96TpyN_qbCfF2V4T"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ borderRadius: '24px' }}
                ></iframe>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  fontSize: '32px',
                  lineHeight: '100%',
                  letterSpacing: '0px',
                  textAlign: 'center',
                  mb: 3,
                  color: '#1F1B13',
                }}
              >
                {t('NAVAPATHAM.ABOUT_NAVAPATHAM')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.8,
                  color: '#1F1B13',
                  fontSize: '16px',
                  textAlign: { xs: 'left', md: 'justify' },
                  whiteSpace: 'pre-line',
                }}
              >
                {aboutNavaPathamText}
              </Typography>
            </Grid>
          </Grid>
        </Container>

        {/* About Pratham Learning Platform Section */}
        <Box
          sx={{
            backgroundColor: '#FFFDF7',
            py: { xs: 3, md: 4 },
          }}
        >
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                fontSize: '32px',
                lineHeight: '100%',
                letterSpacing: '0px',
                //   textAlign: 'center',
                mb: 3,
                color: '#FFC107',
              }}
            >
              {t('NAVAPATHAM.ABOUT_PRATHAM')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: '#1F1B13',
                fontSize: '16px',
                textAlign: { xs: 'left', md: 'justify' },
                whiteSpace: 'pre-line',
              }}
            >
              {aboutPrathamText}
            </Typography>
          </Container>
        </Box>

        {/* Bottom CTA Section */}
        <Box
          sx={{
            backgroundColor: '#FFFDF7',
            py: { xs: 3, md: 4 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <Button
              variant="contained"
              onClick={handleGetStarted}
              sx={{
                fontFamily: 'Poppins',
                backgroundColor: '#FFC107',
                color: '#1E1B16',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '24px',
                letterSpacing: '0.15px',
                textAlign: 'center',
                px: 6,
                py: 2,
                borderRadius: '8px',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#FFB300',
                },
              }}
            >
              {t('LANDING.GET_STARTED_WITH_YOUR_LEARNING_JOURNEY_NOW')}
            </Button>
          </Container>
        </Box>
      </Box>
    </>
  );
}
