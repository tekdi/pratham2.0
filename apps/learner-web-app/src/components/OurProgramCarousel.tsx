import { getTenantInfo } from '@learner/utils/API/ProgramService';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  Box,
  Button,
  Card,
  CardActions,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { useTranslation } from '@shared-lib';

interface Program {
  ordering: number;
  name: string;
  tenantId: string;
  params?: {
    uiConfig?: {
      showSignup?: boolean;
      showSignIn?: boolean;
      showProgram?: boolean;
      [key: string]: any;
    };
    [key: string]: any;
  } | null;
  programImages: {
    label: string;
    description: string;
    [key: string]: any; // Additional properties for images
  }[];
}

const OurProgramCarousel = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [tenantId, setTenantId] = useState('');

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveSlide(swiper.realIndex);
  };

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const res = await getTenantInfo();
        // console.log('Tenant Info:', res?.result);
        const programsData = res?.result || [];
        const visiblePrograms = programsData?.filter(
          (program: any) =>
            program?.params?.uiConfig?.showProgram === true ||
            program?.params?.uiConfig?.sso?.length > 0
        );
        // console.log('visiblePrograms', visiblePrograms);
        setPrograms(visiblePrograms || []);
        const tenantIds = res?.result?.map((item: any) => item.tenantId);
        setTenantId(tenantIds);
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };

    fetchTenantInfo();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6 }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{
            mb: 3,
            fontWeight: 600,
            fontSize: '32px',
            color: '#1F1B13',
            textAlign: 'center',
          }}
        >
          {t('LEARNER_APP.HOME.OUR_PROGRAMS')}
        </Typography>

        <Grid container spacing={2} sx={{ my: 4 }}>
          {programs?.map((program) => (
            <Grid item xs={12} md={4} key={program?.ordering}>
              <SwiperSlide>
                <Card
                  sx={{
                    maxWidth: '100%',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 3,
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      backgroundColor: '#FFDEA1',
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 500,
                        fontSize: '18px',
                        color: '#1F1B13',
                      }}
                      component="div"
                      fontWeight="bold"
                    >
                      {program?.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                    }}
                  >
                    <Box sx={{ position: 'relative' }}>
                      <Swiper
                        modules={[Navigation, Pagination, Autoplay]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation={{
                          nextEl: `.next-${program?.ordering}`,
                          prevEl: `.prev-${program?.ordering}`,
                        }}
                        pagination={{
                          clickable: true,
                          el: `.pagination-${program?.ordering}`,
                          bulletActiveClass: 'swiper-pagination-bullet-active',
                          bulletClass: 'swiper-pagination-bullet',
                        }}
                        loop={true}
                        autoplay={{
                          delay: 3000,
                          disableOnInteraction: false,
                        }}
                      >
                        {(program?.programImages?.length > 0
                          ? program.programImages
                          : [null]
                        ).map((slide: any, slideIndex) => {
                          return (
                            <SwiperSlide
                              key={`slide-${program.ordering}-${slideIndex}`}
                            >
                              <Box
                                sx={{
                                  margin: '10px',
                                  height: '200px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                <img
                                  src={slide || '/images/default.png'} // Use dummy image if slide is null
                                  alt="img"
                                  style={{
                                    borderRadius: '24px',
                                    width: 'unset',
                                    height: '100%',
                                    objectFit: 'cover',
                                  }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      '/images/default.png';
                                  }}
                                />
                              </Box>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                      {program?.programImages?.length > 0 && (
                        <Box sx={{ my: 2 }}>
                          <Box
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            gap={2}
                          >
                            {/* Left Arrow Button */}
                            {program?.programImages?.length > 1 && (
                              <Button
                                className={`prev-${program.ordering}`}
                                sx={{
                                  minWidth: '30px',
                                  width: '30px',
                                  height: '30px',
                                  p: 0,
                                  borderRadius: '50%',
                                  backgroundColor: '#FFFFFF',
                                  boxShadow: '0px 1px 2px 0px #0000004D',
                                  color: 'gray',
                                  '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                  },
                                }}
                              >
                                <ChevronLeftIcon
                                  sx={{ color: '#1F1B13', fontSize: '30px' }}
                                />
                              </Button>
                            )}

                            {/* Pagination Dots */}
                            <Box
                              className={`pagination-${program?.ordering}`}
                              sx={{
                                display: 'flex',
                                '& .swiper-pagination-bullet': {
                                  width: '30px',
                                  height: '4px',
                                  borderRadius: '2px',
                                  backgroundColor: '#CDC5BD',
                                  opacity: 1,
                                  mx: 0.5,
                                },
                                '& .swiper-pagination-bullet-active': {
                                  backgroundColor: '#FDB813',
                                },
                              }}
                            ></Box>

                            {/* Right Arrow Button */}
                            {program?.programImages?.length > 1 && (
                              <Button
                                className={`next-${program?.ordering}`}
                                sx={{
                                  minWidth: '30px',
                                  width: '30px',
                                  height: '30px',
                                  p: 0,
                                  borderRadius: '50%',
                                  backgroundColor: '#FFFFFF',
                                  boxShadow: '0px 1px 2px 0px #0000004D',
                                  color: 'gray',
                                  '&:hover': {
                                    backgroundColor: '#e0e0e0',
                                  },
                                }}
                              >
                                <ChevronRightIcon
                                  sx={{ color: '#1F1B13', fontSize: '30px' }}
                                  fontSize="small"
                                />
                              </Button>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>

                  <CardActions
                    sx={
                      {
                        // justifyContent: 'center',
                        // p: 2,
                        // mt: 'auto',
                      }
                    }
                  >
                    {program?.params?.uiConfig?.showSignup === true && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: 50,
                          backgroundColor: '#FDBE16',
                          '&:hover': {
                            backgroundColor: '#FDBE16',
                          },
                        }}
                        onClick={() => {
                          if (
                            typeof window !== 'undefined' &&
                            window.localStorage
                          ) {
                            localStorage.setItem('userProgram', program?.name);
                          }

                          router.push(
                            '/registration?tenantId=' + program?.tenantId
                          );
                        }}
                      >
                        {t('LEARNER_APP.HOME.SIGN_UP')}
                      </Button>
                    )}
                    {program?.params?.uiConfig?.showSignIn === true && (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: 50,
                          backgroundColor: '#FDBE16',
                          '&:hover': {
                            backgroundColor: '#FDBE16',
                          },
                        }}
                        onClick={() => {
                          // console.log('Test####', program?.params?.uiConfig);
                          if (
                            typeof window !== 'undefined' &&
                            window.localStorage
                          ) {
                            localStorage.setItem('userProgram', program?.name);
                          }
                          if (
                            typeof window !== 'undefined' &&
                            window.localStorage
                          ) {
                            localStorage.setItem(
                              'userProgramTenantId',
                              program?.tenantId
                            );
                          }
                          const uiConfig = program?.params?.uiConfig || {};
                          localStorage.setItem(
                            'uiConfig',
                            JSON.stringify(uiConfig || {})
                          );
                          router.push('/login');
                        }}
                      >
                        {t('LEARNER_APP.HOME.SIGN_IN')}
                      </Button>
                    )}
                    {/* SSO Login Buttons */}
                    {program?.params?.uiConfig?.sso?.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          width: '100%',
                        }}
                      >
                        {program?.params?.uiConfig?.sso?.map(
                          (ssoOption: any, index: number) => {
                            // Check if current domain is in enable_domain array
                            const currentDomain =
                              typeof window !== 'undefined'
                                ? window.location.origin
                                : '';
                            const isDomainEnabled =
                              ssoOption?.enable_domain?.includes(
                                currentDomain
                              ) || false;

                            if (!isDomainEnabled) return null;

                            return (
                              <Button
                                key={index}
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{
                                  borderRadius: 50,
                                  backgroundColor: '#FDBE16',
                                  '&:hover': {
                                    backgroundColor: '#FDBE16',
                                  },
                                  flex: '1 1 calc(50% - 4px)', // Side by side layout with gap
                                  minWidth: '120px',
                                }}
                                onClick={() => {
                                  // Store program info and open SSO URL
                                  if (
                                    typeof window !== 'undefined' &&
                                    window.localStorage
                                  ) {
                                    localStorage.setItem(
                                      'userProgram',
                                      program?.name
                                    );
                                    const uiConfig =
                                      program?.params?.uiConfig || {};
                                    localStorage.setItem(
                                      'uiConfig',
                                      JSON.stringify(uiConfig)
                                    );
                                  }
                                  // Construct SSO URL with callback parameters
                                  const currentBaseUrl =
                                    typeof window !== 'undefined'
                                      ? window.location.origin
                                      : '';
                                  const callbackUrl = `${currentBaseUrl}/sso?env=newton&tenantid=${program?.tenantId}`;
                                  const encodedCallbackUrl = callbackUrl;
                                  // encodeURIComponent(callbackUrl);
                                  // roleId
                                  const ssoUrl = `${ssoOption?.url}?callbackurl=${encodedCallbackUrl}`;

                                  // Open SSO URL in new tab
                                  window.open(ssoUrl, '_blank');
                                }}
                              >
                                {t(ssoOption?.label) ||
                                  `Login with ${ssoOption?.type}`}
                              </Button>
                            );
                          }
                        )}
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </SwiperSlide>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default OurProgramCarousel;
