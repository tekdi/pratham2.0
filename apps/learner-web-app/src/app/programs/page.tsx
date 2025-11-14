'use client';

import { Box, Container, Grid, Typography, Tabs, Tab } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useTranslation } from '@shared-lib';
import Header from '@learner/components/Header/Header';
import EnrollProgramCarousel from '@learner/components/EnrollProgramCarousel/EnrollProgramCarousel';

export default function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Safely access localStorage only on client side
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
   
      <Suspense fallback={<div>Loading...</div>}>
                <Header/>
        
        <Box
          display="flex"
          flexDirection="column"
          sx={{ overflowWrap: 'break-word', wordBreak: 'break-word' }}
        >
          {/* <Header /> */}

          <Box
            sx={{
              background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
              boxShadow: '0px 4px 8px 3px #00000026, 0px 1px 3px 0px #0000004D',
           //   pt: '20px',
            }}
          >
            
            <Container>
              <Box
                sx={{
                  textAlign: 'center',
                  my: { xs: 2, sm: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: { xs: 1, sm: 2 },
                  width: '100%',
                //  px: { xs: 2, sm: 0 },
                  maxWidth: '100%',
                }}
              >
                <Box
                  sx={{
                    width: { xs: 40, sm: 60 },
                    height: { xs: 40, sm: 60 },
                    position: 'relative',
                  }}
                >
                  <Image
                    src="/images/welcome.gif"
                    alt="welcome gif"
                    width={60}
                    height={60}
                  />
                </Box>
               
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: '400',
                    textAlign: 'center',
                  }}
                >
                  {t('LEARNER_APP.HOME.DISCOVER_LEARNING_OPPORTUNITIES')}
                </Typography>

            

            
              </Box>
            </Container>
           
          </Box>

          {/* Tabs Section */}
          <Box
  sx={{
    background: '#fff',
    borderBottom: '1px solid #E0E0E0',
    overflowX: 'auto', // allow horizontal scroll on very small screens
  }}
>
  <Tabs
    value={currentTab}
    onChange={handleTabChange}
    variant="scrollable" // makes it swipeable on mobile
    scrollButtons="auto" // adds small arrows on tablet/desktop when needed
    sx={{
      minHeight: '48px',
      ml: { xs: 1, sm: 2, md: '100px' }, // responsive left margin
      '& .MuiTabs-indicator': {
        backgroundColor: '#FFC107',
        height: '3px',
      },
      '& .MuiTab-root': {
        textTransform: 'none',
        fontSize: { xs: '14px', sm: '15px', md: '16px' }, // smaller text on mobile
        fontWeight: 500,
        color: '#666',
        minHeight: '48px',
        padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' }, // tighter padding on mobile
        '&.Mui-selected': {
          color: '#000',
          fontWeight: 600,
        },
      },
      '& .MuiTabs-flexContainer': {
        justifyContent: { xs: 'flex-start', md: 'flex-start' },
      },
    }}
  >
    <Tab label={t('LEARNER_APP.PROGRAMS.EXPLORE_PROGRAMS')} />
    <Tab label={t('LEARNER_APP.PROGRAMS.MY_PROGRAMS')} />
  </Tabs>
</Box>

          {/* Content Section */}
          <Box
            sx={{
              marginBottom: '80px', // Add space for the sticky footer
            }}
          >
            {currentTab === 0 && <EnrollProgramCarousel />}
            {currentTab === 1 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <EnrollProgramCarousel userId={userId} />
              </Box>
            )}
          </Box>
         

          {/* QR and App Download Section - Sticky at bottom */}
          <Box 
            sx={{ 
              background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1000,
              boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
              py: 1,
            }}
          >
              <Container maxWidth="md">
                <Grid
                  container
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Grid item xs={12} sm={5}>
                    <Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        <Box>
                          <Image
                            src="/images/prathamQR.png"
                            alt="QR Code"
                            width={50}
                            height={50}
                          />
                        </Box>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              textAlign: 'left',
                              color: '#1F1B13',
                              fontWeight: '600',
                              fontSize: '14px',
                            }}
                          >
                            {t('LEARNER_APP.HOME.GET_THE_APP')}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ fontSize: '12px' }}
                          >
                            {t('LEARNER_APP.HOME.POINT_CAMERA')}
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
                          height: '10px',
                          backgroundColor: '#D9D9D9',
                        }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#1F1B13',
                          fontWeight: '400',
                          fontSize: '12px',
                        }}
                      >
                        {t('LEARNER_APP.HOME.OR')}
                      </Typography>
                      <Box
                        sx={{
                          width: '1px',
                          height: '10px',
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
                        alignItems: 'center',
                        cursor: 'pointer',
                        gap: '8px',
                      }}
                      onClick={() => {
                        router.push(
                          'https://play.google.com/store/apps/details?id=com.pratham.learning'
                        );
                      }}
                    >
                      <Box>
                        <Image
                          src="/images/playstore.png"
                          alt="Play Store"
                          width={100}
                          height={30}
                        />
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: '12px' }}>
                          {t('LEARNER_APP.HOME.SEARCH_PLAYSTORE')}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
        </Box>
      </Suspense>
  );
}
