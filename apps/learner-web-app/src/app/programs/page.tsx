'use client';

import { Box, Container, Grid, Typography, Tabs, Tab } from '@mui/material';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { useTranslation } from '@shared-lib';
import Header from '@learner/components/Header/Header';
import EnrollProgramCarousel from '@learner/components/EnrollProgramCarousel/EnrollProgramCarousel';
import { getUserDetails } from '@learner/utils/API/userService';

function ProgramsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAndroidApp, setIsAndroidApp] = useState(true);

  useEffect(() => {
    const processData = async () => {
      // Safely access localStorage only on client side
      const storedUserId = localStorage.getItem('userId');
      setUserId(storedUserId);
      
      // Check if user is on Android app
      const isAndroid = localStorage.getItem('isAndroidApp') === 'yes';
      setIsAndroidApp(isAndroid);

      // Read tab from query params on mount
      const tabParam = searchParams.get('tab');
      if (tabParam === 'my-programs') {
        setCurrentTab(1);
      } else if (tabParam === 'explore') {
        setCurrentTab(0);
      } else {
        // Default to explore programs if no tab param
        if (storedUserId) {
          // Fetch user's enrolled programs to exclude them from explore programs
          const data = await getUserDetails(storedUserId, true);
          console.log('data=====>', data?.result?.userData?.tenantData);
          const tenantData = data?.result?.userData?.tenantData || [];
          const enrolledTenantIds = tenantData
            .filter(
              (item: any) =>
                (item.tenantStatus === 'active' ||
                  item.tenantStatus === 'pending') &&
                item.tenantName !== 'Pratham' && item?.roles?.some((role: any) => role?.roleName === 'Learner')
            )
            .map((item: any) => item.tenantId);
          if (enrolledTenantIds.length > 0) {
            setCurrentTab(1);
          } else {
            setCurrentTab(0);
          }
        }
        // setCurrentTab(0);
      }
    };
    processData();
  }, [searchParams]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);

    // Update query params based on tab
    const tabValue = newValue === 0 ? 'explore' : 'my-programs';
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabValue);
    router.push(`/programs?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <Header isShowLogout={true} />

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
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 2 } }}>
            <Box
              sx={{
                textAlign: 'center',
                my: { xs: 2, sm: 3 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: { xs: 1, sm: 2 },
                width: '100%',
                //  px: { xs: 2, sm: 0 },
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
                  fontSize: { xs: '20px', sm: '24px', md: '28px' },
                  lineHeight: { xs: '28px', sm: '32px', md: '36px' },
                  px: { xs: 1, sm: 0 },
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
            overflowX: 'auto',
          }}
        >
          {/* <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 3, md: 2 } }}> */}
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: '48px',
              '& .MuiTabs-indicator': {
                backgroundColor: '#FFC107',
                height: '3px',
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '14px', sm: '15px', md: '16px' },
                fontWeight: 500,
                color: '#666',
                minHeight: '48px',
                padding: { xs: '12px 16px', sm: '12px 20px', md: '12px 24px' },
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
          {/* </Container> */}
        </Box>

        {/* Content Section */}
        <Box
          sx={{
            marginBottom: isAndroidApp 
              ? { xs: '20px', sm: '20px', md: '20px' } 
              : { xs: '100px', sm: '90px', md: '80px' }, // More space on mobile for footer
          }}
        >
          {currentTab === 0 && userId !== null && (
            <EnrollProgramCarousel userId={userId} isExplorePrograms={true} />
          )}
          {currentTab === 1 && userId !== null && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <EnrollProgramCarousel userId={userId} />
            </Box>
          )}
        </Box>

        {/* QR and App Download Section - Sticky at bottom */}
        {!isAndroidApp && (
        <Box
          sx={{
            background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
            py: { xs: 1.5, sm: 1 },
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
            <Grid
              container
              spacing={{ xs: 1.5, sm: 1 }}
              sx={{ alignItems: 'center' }}
            >
              <Grid item xs={12} sm={5}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: { xs: '6px', sm: '8px' },
                      alignItems: 'center',
                      justifyContent: { xs: 'center', sm: 'flex-start' },
                    }}
                  >
                    <Box sx={{ flexShrink: 0 }}>
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
                          textAlign: { xs: 'left', sm: 'left' },
                          color: '#1F1B13',
                          fontWeight: '600',
                          fontSize: { xs: '13px', sm: '14px' },
                        }}
                      >
                        {t('LEARNER_APP.HOME.GET_THE_APP')}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '11px', sm: '12px' } }}
                      >
                        {t('LEARNER_APP.HOME.POINT_CAMERA')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}
                sm={2}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
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
                    justifyContent: { xs: 'center', sm: 'flex-end' },
                    alignItems: 'center',
                    cursor: 'pointer',
                    gap: { xs: '6px', sm: '8px' },
                  }}
                  onClick={() => {
                    router.push(
                      'https://play.google.com/store/apps/details?id=com.pratham.learning'
                    );
                  }}
                >
                  <Box sx={{ flexShrink: 0 }}>
                    <Image
                      src="/images/playstore.png"
                      alt="Play Store"
                      width={100}
                      height={30}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: { xs: '11px', sm: '12px' } }}>
                      {t('LEARNER_APP.HOME.SEARCH_PLAYSTORE')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
        )}
      </Box>
    </>
  );
}

export default function Index() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div>{t('LEARNER_APP.PROGRAMS.LOADING')}</div>}>
      <ProgramsContent />
    </Suspense>
  );
}
