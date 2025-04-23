'use client';
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
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

interface Program {
  ordering: number;
  name: string;
  programImages: {
    label: string;
    description: string;
    [key: string]: any; // Additional properties for images
  }[];
}

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const [imgError, setImgError] = useState<boolean>(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [programs, setPrograms] = useState<Program[]>([]);

  const handleImageError = () => {
    setImgError(true);
  };

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveSlide(swiper.realIndex);
  };

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const res = await getTenantInfo();
        console.log('Tenant Info:', res);
        setPrograms(res?.result || []);
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };

    fetchTenantInfo();
  }, []);

  return (
    <>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
          boxShadow: '0px 4px 8px 3px #00000026, 0px 1px 3px 0px #0000004D',
          pt: '20px',
        }}
      >
        <Container>
          <Box
            sx={{
              textAlign: 'center',
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ width: 60, height: 60, position: 'relative' }}>
              <Image
                src="/images/welcome.gif"
                alt="welcome gif"
                width={60}
                height={60}
                onError={handleImageError}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: '400',
                color: '#1F1B13',
                textAlign: 'center',
              }}
            >
              Welcome to Pratham myLearning!
            </Typography>
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '22px',
                textAlign: 'center',
              }}
            >
              Your Learning Journey begins here
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                borderRadius: '100px',
                backgroundColor: '#FDBE16',
                color: '#1E1B16',
                fontWeight: '500',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#FDBE16',
                },
              }}
              onClick={() => router.push('/login')}
            >
              Sign Up for Program Now!
            </Button>

            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Typography variant="body2" color="#1F1B13" display="inline">
                Already signed up?
              </Typography>
              <Typography
                variant="body2"
                color="#0D599E"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: '500',
                }}
                display="inline"
                onClick={() => router.push('/login')}
              >
                Click here to login
              </Typography>
            </Box>
          </Box>
        </Container>
        <Box sx={{ background: '#fff', py: '4px', borderRadius: '24px' }}>
          <Container maxWidth="md">
            <Grid container spacing={2} sx={{ my: 4, alignItems: 'center' }}>
              <Grid item xs={12} sm={5}>
                <Box>
                  <Box
                    sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}
                  >
                    <Box>
                      <Image
                        src="/images/prathamQR.png"
                        alt="QR Code"
                        width={62}
                        height={61}
                        onError={handleImageError}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textAlign: 'left',
                          color: '#1F1B13',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                        fontWeight="bold"
                      >
                        Get the App
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Point your phone camera here
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '1px',
                      height: '20px',
                      backgroundColor: '#D9D9D9',
                    }}
                  />
                  <Typography
                    sx={{
                      my: 1,
                      color: '#1F1B13',
                      fontSize: '14px',
                      fontWeight: '400',
                    }}
                  >
                    OR
                  </Typography>
                  <Box
                    sx={{
                      width: '1px',
                      height: '20px',
                      backgroundColor: '#D9D9D9',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <img
                      src="/images/playstore.png"
                      alt="Play Store"
                      width="122"
                    />
                  </Box>

                  {/* Search Bar (placeholder) */}
                  <Box>
                    <Typography>
                      Search &quot;Pratham myLearning&quot; on Playstore
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* About Pratham Section */}
      <Container maxWidth="xl">
        <Box sx={{ my: 6, px: '20px' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: '32px',
                  color: '#1F1B13',
                }}
              >
                About Pratham
              </Typography>
              <Typography
                sx={{
                  mb: 3,
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#1F1B13',
                }}
                variant="body1"
                paragraph
              >
                Pratham creates innovative education solutions with thoughtful,
                impactful interventions that span the age spectrum. Working both
                directly and through government systems, these programs
                collectively reach millions of children and young people each
                year. The direct work follows two tracks: Pratham works with
                children either in the school or in the community, whereas the
                &ldquo;partnership&rdquo; model involves Pratham teams working
                closely with government teams at the state, district, or block
                level. Our unwavering commitment to developing, testing, and
                improving learning outcomes continues to serve as a model, both
                within India and beyond.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 278,
                  borderRadius: '24px',
                  overflow: 'hidden',
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
          </Grid>
        </Box>
      </Container>

      {/* Our Programs Section */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
          padding: '20px',
        }}
      >
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
              Our Programs
            </Typography>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              loop={true}
              // autoplay={{
              //   delay: 3000,
              //   disableOnInteraction: false,
              // }}
              navigation
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 30,
                },
              }}
              style={{ padding: '20px 10px 40px' }}
              onSlideChange={handleSlideChange}
            >
              {programs?.map((program) => (
                <SwiperSlide key={program?.ordering}>
                  <Card
                    sx={{
                      maxWidth: '100%',
                      height: '100%',
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
                        backgroundColor: '#FFE4B5',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        fontWeight="bold"
                      >
                        {program?.name}
                      </Typography>
                    </Box>

                    <Box sx={{ position: 'relative' }}>
                      <Swiper
                        modules={[Navigation, Pagination]}
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
                      >
                        {program?.programImages?.map(
                          (slide: any, slideIndex) => (
                            <SwiperSlide
                              key={`slide-${program.ordering}-${slideIndex}`}
                            >
                              <Box
                                sx={{ position: 'relative', height: '200px' }}
                              >
                                <Image
                                  src={slide}
                                  alt={'img'}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  onError={handleImageError}
                                />
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: 'rgba(73, 108, 184, 0.9)',
                                    p: 2,
                                    color: 'white',
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    component="div"
                                    sx={{
                                      backgroundColor: 'rgba(0,0,0,0.2)',
                                      display: 'inline-block',
                                      px: 1,
                                      py: 0.5,
                                      borderRadius: 1,
                                      mb: 1,
                                    }}
                                  >
                                    {slide.label}
                                  </Typography>
                                  <Typography variant="body2">
                                    {slide.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </SwiperSlide>
                          )
                        )}
                      </Swiper>

                      <Box
                        sx={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          zIndex: 1,
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <Button
                          className={`prev-${program.ordering}`}
                          sx={{
                            minWidth: '30px',
                            width: '30px',
                            height: '30px',
                            p: 0,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            color: 'gray',
                            '&:hover': { backgroundColor: '#e0e0e0' },
                          }}
                        >
                          <ChevronLeftIcon fontSize="small" />
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          zIndex: 1,
                          transform: 'translateY(-50%)',
                        }}
                      >
                        <Button
                          className={`next-${program?.ordering}`}
                          sx={{
                            minWidth: '30px',
                            width: '30px',
                            height: '30px',
                            p: 0,
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            color: 'gray',
                            '&:hover': { backgroundColor: '#e0e0e0' },
                          }}
                        >
                          <ChevronRightIcon fontSize="small" />
                        </Button>
                      </Box>

                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: '10px',
                          left: 0,
                          right: 0,
                          display: 'flex',
                          justifyContent: 'center',
                          zIndex: 1,
                        }}
                      >
                        <Box
                          className={`pagination-${program?.ordering}`}
                          sx={{
                            '& .swiper-pagination-bullet': {
                              width: '30px',
                              height: '4px',
                              borderRadius: '2px',
                              backgroundColor: '#D0D0D0',
                              opacity: 1,
                              mx: 0.5,
                            },
                            '& .swiper-pagination-bullet-active': {
                              backgroundColor: '#FDB813',
                            },
                          }}
                        ></Box>
                      </Box>
                    </Box>

                    <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: 50,
                          backgroundColor: '#F99F1B',
                          '&:hover': {
                            backgroundColor: '#e08c0f',
                          },
                        }}
                        onClick={() => router.push('/signup')}
                      >
                        Sign Up
                      </Button>
                    </CardActions>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        </Container>
      </Box>
    </>
  );
}
