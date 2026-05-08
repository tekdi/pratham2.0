'use client';

import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@learner/components/Header/Header';
import { getTenantInfo, getPrathamTenantId } from '@learner/utils/API/ProgramService';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTranslation } from '@shared-lib';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RoleCard, { ROLE_CARD_THEMES } from '@learner/components/RoleCard/RoleCard';
import ProgramCard from '@learner/components/ProgramCard/ProgramCard';

interface Program {
  ordering: number;
  name: string;
  tenantId: string;
  description?: string;
  type?: string;
  params?: {
    uiConfig?: {
      showSignup?: boolean;
      showSignIn?: boolean;
      showProgram?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
  programImages?: (string | {
    label?: string;
    description?: string;
    [key: string]: any;
  })[];
}

const PROGRAM_CARD_COLORS = ['#2979FF', '#00C853', '#FF6D00', '#AA00FF', '#00B8D4'];
const VOLUNTEER_CARD_COLORS = ['#FF9800', '#F44336', '#E91E63', '#9C27B0', '#FF5722'];

export default function LandingPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [ssoPrograms, setSsoPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getTenantInfo();
        const programsData = res?.result || [];
        const visiblePrograms = programsData?.filter(
          (program: any) =>
            program?.params?.uiConfig?.showProgram === true 
           // program?.params?.uiConfig?.sso?.length > 0
        );
        console.log('Fetched Programs:', programsData);
        setPrograms(visiblePrograms || []);
        const ssoProgramsData = programsData?.filter(
          (program: any) =>
            program?.params?.uiConfig?.sso?.length > 0
        );
        setSsoPrograms(ssoProgramsData || []);
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('isForNavaPatham');
  }
  }, []);

  const learnerPrograms = programs.filter((p) => p.type !== 'VolunteerOnboarding');
  const volunteerPrograms = programs.filter((p) => p.type === 'VolunteerOnboarding');

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToLearner = () => scrollTo('learner-programs');
  const handleScrollToVolunteer = () => scrollTo('volunteer-programs');

  const handleLogin = () => {
    router.push('/login');
  };

  const handlePragyanpath = () => {
    const program = ssoPrograms.find((p) =>
      p.name.toLowerCase().includes('pragyanpath')
    );
    if (program) {
      if (program?.params?.uiConfig?.sso?.length > 0) {
        const ssoOption = program?.params?.uiConfig?.sso?.find((option: any) => {
          const currentDomain =
            typeof window !== 'undefined' ? window.location.origin : '';
          return option?.enable_domain?.includes(currentDomain);
        });

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

  const aboutPrathamText = t('LANDING.ABOUT_PRATHAM_TEXT');
  const aboutPrathamLearningPlatformText = t('LANDING.ABOUT_PRATHAM_LEARNING_PLATFORM_TEXT');

  return (
    <>
      <Header isLogin={true}/>
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
            backgroundImage: 'url(/images/home-page-banner.png)',
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
                {t('LANDING.WELCOME_TO_PRATHAM_LEARNING_PLATFORM')}
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
              {/* <Button
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
              </Button> */}

              {/* <Box
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
                     fontSize: '20px'
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
              </Box> */}
              
              {/* For Pratham Employees Section */}
              {/* <Box
                sx={{
                  mt: { xs: 4, md: 6 },
                  backgroundColor: 'rgba(31, 27, 19, 0.5)',
                  borderRadius: '8px',
                  py: 3,
                  px: 3,
                  maxWidth: '500px',
                  mx: 'auto',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '20px',
                    lineHeight: '28px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    mb: 3,
                    color: '#fff',
                  }}
                >
                  {t('LANDING.FOR_PRATHAM_EMPLOYEES')}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={handlePragyanpath}
                  startIcon={<LockIcon />}
                  sx={{
                    fontFamily: 'Poppins',
                    backgroundColor: 'transparent',
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
                  {t('LANDING.ACCESS_PRAGYANPATH')}
                </Button>
              </Box> */}
            </Box>
          </Container>
        </Box>

       

        {/* About Pratham Learning Platform Section */}
      

        {/* Role Selection Cards Section */}
        <Box sx={{ backgroundColor: '#FFFDF7', py: { xs: 3, md: 5 } }}>
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: { xs: '20px', md: '24px' },
                lineHeight: '32px',
                color: '#1F1B13',
                textAlign: 'center',
                mb: 3,
              }}
            >
              {t('LANDING.HOW_WOULD_YOU_LIKE_TO_GET_STARTED')}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <RoleCard
                  icon={<MenuBookOutlinedIcon fontSize="inherit" />}
                  title={t('LANDING.ARE_YOU_HERE_TO_LEARN')}
                  description={t('LANDING.REGISTER_FOR_LEARNING')}
                  theme={ROLE_CARD_THEMES.learn}
                  onClick={handleScrollToLearner}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RoleCard
                  icon={<FavoriteBorderIcon fontSize="inherit" />}
                  title={t('LANDING.ARE_YOU_HERE_TO_VOLUNTEER')}
                  description={t('LANDING.MAKE_A_DIFFERENCE')}
                  theme={ROLE_CARD_THEMES.volunteer}
                  onClick={handleScrollToVolunteer}
                />
              </Grid>
            </Grid>
          </Container>
        </Box>
        {/* Our Programs for Learners Section */}
        <Box id="learner-programs" sx={{ backgroundColor: '#fff', py: { xs: 3, md: 5 } }}>
          <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: { xs: '22px', md: '28px' },
                lineHeight: '36px',
                textAlign: 'center',
                mb: 1,
                color: '#1F1B13',
              }}
            >
              {t('LANDING.OUR_PROGRAMS_FOR_LEARNERS')}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '14px',
                color: '#5C5952',
                textAlign: 'center',
                mb: 4,
              }}
            >
              {t('LANDING.OUR_PROGRAMS_SUBTITLE')}
            </Typography>

            {loading ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography>{t('LANDING.LOADING_PROGRAMS')}</Typography>
              </Box>
            ) : learnerPrograms.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <Typography>{t('LANDING.NO_PROGRAMS_AVAILABLE')}</Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {learnerPrograms.map((program, index) => {
                  const imageItem = program.programImages?.[0];
                  const image =
                    typeof imageItem === 'string'
                      ? imageItem
                      : (imageItem as any)?.description || '/images/default.png';
                  return (
                    <Grid item xs={12} sm={6} md={4} key={program.tenantId || index}>
                      <ProgramCard
                        image={image}
                        title={program.name}
                        description={program.description}
                        buttonColor={PROGRAM_CARD_COLORS[index % PROGRAM_CARD_COLORS.length]}
                        onExplore={() => router.push(`/programs/${program.tenantId}`)}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Container>
        </Box>

        {/* Our Programs for Volunteers Section */}
        {(loading || volunteerPrograms.length > 0) && (
          <Box id="volunteer-programs" sx={{ backgroundColor: '#F7FAF7', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 3 } }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: { xs: '22px', md: '28px' },
                  lineHeight: '36px',
                  textAlign: 'center',
                  mb: 1,
                  color: '#1F1B13',
                }}
              >
                {t('LANDING.OUR_PROGRAMS_FOR_VOLUNTEERS')}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: '14px',
                  color: '#5C5952',
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                {t('LANDING.OUR_PROGRAMS_VOLUNTEERS_SUBTITLE')}
              </Typography>

              {loading ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography>{t('LANDING.LOADING_PROGRAMS')}</Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {volunteerPrograms.map((program, index) => {
                    const imageItem = program.programImages?.[0];
                    const image =
                      typeof imageItem === 'string'
                        ? imageItem
                        : (imageItem as any)?.description || '/images/default.png';
                    return (
                      <Grid item xs={12} sm={6} md={4} key={program.tenantId || index}>
                        <ProgramCard
                          image={image}
                          title={program.name}
                          description={program.description}
                          buttonColor={VOLUNTEER_CARD_COLORS[index % VOLUNTEER_CARD_COLORS.length]}
                          onExplore={() => router.push(`/programs/${program.tenantId}`)}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Container>
          </Box>
        )}

 {/* About Pratham Section */}
         <Container maxWidth="xl" disableGutters sx={{ my: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
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
                {t('LANDING.ABOUT_PRATHAM')}
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
                {aboutPrathamLearningPlatformText}
              </Typography>
            </Grid>
          </Grid>
        </Container> 

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
              {t('LANDING.ABOUT_PRATHAM_LEARNING_PLATFORM')}
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
        {/* <Box
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
        </Box> */}
      </Box>
    </>
  );
}