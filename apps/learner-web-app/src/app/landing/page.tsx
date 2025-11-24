'use client';

import { Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@learner/components/Header/Header';
import { getTenantInfo, getPrathamTenantId } from '@learner/utils/API/ProgramService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
  programImages?: (string | {
    label?: string;
    description?: string;
    [key: string]: any;
  })[];
}

export default function LandingPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getTenantInfo();
        const programsData = res?.result || [];
        const visiblePrograms = programsData?.filter(
          (program: any) =>
            program?.params?.uiConfig?.showProgram === true ||
            program?.params?.uiConfig?.sso?.length > 0
        );
        setPrograms(visiblePrograms || []);
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleGetStarted = async () => {
    try {
      const tenantId = await getPrathamTenantId();
      if (tenantId) {
        router.push(`/registration?tenantId=${tenantId}`);
      } else {
        console.error('Failed to get tenant ID');
        // Fallback: redirect without tenantId or show error
        router.push('/registration');
      }
    } catch (error) {
      console.error('Error fetching tenant ID:', error);
      // Fallback: redirect without tenantId
      router.push('/registration');
    }
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

  const aboutPrathamText =
    'Pratham Education Foundation (Pratham) is one of the largest education NGOs in India with a record of innovative, rigorously evaluated programs that have inspired similar programs across three continents. With a history spanning 30 years, Pratham\'s work today extends from programs for early and elementary years to girls and women, and youth skilling.\n\nThrough programs covering 25 states and Union Territories, in an average year, Pratham usually reaches over 6 million children and youth. This is achieved through a combination of efforts: directly working with children and youth in communities, as well as through collaborations with state and district-level governments. Pratham has received notable awards such as the Lui Che Woo Prize, WISE Prize for Innovation, Skoll Award for Social Entrepreneurship, the Henry R Kravis Prize in Leadership and the CNN-IBN Indian of the Year for Public Service. Pratham also received the 2021 Yidan Prize for Education Development and the Yashraj Bharati Samman in 2025.';

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
                Welcome to the Pratham Learning Platform!
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
                Your Learning Journey Begins here
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
                  mb: 1,
                  '&:hover': {
                    backgroundColor: '#FFB300',
                  },
                }}
              >
                Get Started!
              </Button>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    display: 'inline',
                  }}
                >
                  Already signed up?{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: '#fff',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': {
                        textDecoration: 'none',
                      },
                    }}
                    onClick={handleLogin}
                  >
                    Click here
                  </Typography>
                  {' '}to login
                </Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#fff',
                    display: 'inline',
                  }}
                >
                  Are you a Pratham Employee?{' '}
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{
                      color: '#fff',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      '&:hover': {
                        textDecoration: 'none',
                      },
                    }}
                    onClick={handlePragyanpath}
                  >
                  Click here 
                  </Typography>
                  {' '}to get access to Pragyanpath
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>

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
                About Pratham
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
              About Pratham Learning Platform
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

        {/* Our Programs Section */}
        <Container maxWidth="xl" disableGutters sx={{ my: { xs: 3, md: 4 }, px: { xs: 2, md: 3 } }}>
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
            Our Programs
          </Typography>

          {loading ? (
            <Box sx={{  py: 4 }}>
              <Typography>Loading programs...</Typography>
            </Box>
          ) : programs.length === 0 ? (
            <Box sx={{  py: 4 }}>
              <Typography>No programs available at the moment.</Typography>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {programs.slice(0, 3).map((program, index) => (
                <Grid item xs={12} md={4} key={program.tenantId || index}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      boxShadow: 3,
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        height: '250px',
                        overflow: 'hidden',
                      }}
                    >
                      {program.programImages && program.programImages.length > 0 ? (
                        <>
                          <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            spaceBetween={0}
                            slidesPerView={1}
                            navigation={{
                              nextEl: `.next-${program.tenantId || index}`,
                              prevEl: `.prev-${program.tenantId || index}`,
                            }}
                            pagination={{
                              clickable: true,
                              el: `.pagination-${program.tenantId || index}`,
                            }}
                            loop={program.programImages.length > 1}
                            autoplay={
                              program.programImages.length > 1
                                ? {
                                    delay: 3000,
                                    disableOnInteraction: false,
                                  }
                                : false
                            }
                            style={{ height: '100%' }}
                          >
                            {program.programImages.map((imageItem: any, slideIndex: number) => {
                              const imageUrl: string =
                                typeof imageItem === 'string'
                                  ? imageItem
                                  : imageItem?.description || '/images/default.png';
                              const imageAlt: string =
                                typeof imageItem === 'string'
                                  ? program.name
                                  : imageItem?.label || program.name;
                              return (
                                <SwiperSlide key={`slide-${program.tenantId}-${slideIndex}`}>
                                  <img
                                    src={imageUrl}
                                    alt={imageAlt}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                    }}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/images/default.png';
                                    }}
                                  />
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                          {program.programImages.length > 1 && (
                            <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, zIndex: 10 }}>
                              <Box
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                                gap={1}
                              >
                                <Button
                                  className={`prev-${program.tenantId || index}`}
                                  sx={{
                                    minWidth: '24px',
                                    width: '24px',
                                    height: '24px',
                                    p: 0,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3)',
                                    color: '#1F1B13',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 1)',
                                    },
                                  }}
                                >
                                  <ChevronLeftIcon sx={{ fontSize: '20px' }} />
                                </Button>
                                <Box
                                  className={`pagination-${program.tenantId || index}`}
                                  sx={{
                                    display: 'flex',
                                    '& .swiper-pagination-bullet': {
                                      width: '24px',
                                      height: '4px',
                                      borderRadius: '2px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                      opacity: 1,
                                      mx: 0.5,
                                    },
                                    '& .swiper-pagination-bullet-active': {
                                      backgroundColor: '#FFC107',
                                    },
                                  }}
                                />
                                <Button
                                  className={`next-${program.tenantId || index}`}
                                  sx={{
                                    minWidth: '24px',
                                    width: '24px',
                                    height: '24px',
                                    p: 0,
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.3)',
                                    color: '#1F1B13',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 1)',
                                    },
                                  }}
                                >
                                  <ChevronRightIcon sx={{ fontSize: '20px' }} />
                                </Button>
                              </Box>
                            </Box>
                          )}
                        </>
                      ) : (
                        <img
                          src="/images/default.png"
                          alt={program.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      <Box
                        sx={{
                          width: 'fit-content',
                          height: '40px',
                          opacity: 1,
                          gap: '10px',
                          paddingTop: '8px',
                          paddingRight: '16px',
                          paddingBottom: '8px',
                          paddingLeft: '16px',
                          background: '#FDBE16',
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="h6"
                          component="h3"
                          sx={{
                            fontWeight: 700,
                            color: '#1F1B13',
                          }}
                        >
                          {program.name}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.6,
                        }}
                      >
                        {program.description || ''}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>

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
              Get Started With Your Learning Journey Now!
            </Button>
          </Container>
        </Box>
      </Box>
    </>
  );
}