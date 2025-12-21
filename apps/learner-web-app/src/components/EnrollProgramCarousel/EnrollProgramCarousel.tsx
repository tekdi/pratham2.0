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
  CircularProgress,
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
import {
  getUserDetails,
  profileComplitionCheck,
} from '@learner/utils/API/userService';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import SignupSuccess from '@learner/components/SignupSuccess /SignupSuccess ';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { TenantName } from '@learner/utils/app.constant';
import { logEvent } from '@learner/utils/googleAnalytics';

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

const EnrollProgramCarousel = ({
  userId,
  isExplorePrograms = false,
}: {
  userId?: string | null;
  isExplorePrograms?: boolean;
} = {}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [signupSuccessModal, setSignupSuccessModal] = useState(false);
  const [loadingProgram, setLoadingProgram] = useState<{
    id: string;
    action: 'enrolling' | 'accessing';
  } | null>(null);
  const [enrolledProgram, setEnrolledProgram] = useState<Program | null>(null);

  const handleSlideChange = (swiper: SwiperClass) => {
    setActiveSlide(swiper.realIndex);
  };

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        setIsLoading(true);
        const res = await getTenantInfo();
        // console.log('Tenant Info:', res?.result);
        const programsData = res?.result || [];
        const visiblePrograms = programsData?.filter(
          (program: any) =>
            program?.params?.uiConfig?.showProgram === true &&
            program?.params?.uiConfig?.showSignup === true
          //below code show pragyanpath program in explore programs tab
          // || program?.params?.uiConfig?.sso?.length > 0
        );
        // console.log('visiblePrograms', visiblePrograms);

        // If it's Explore Programs tab, exclude enrolled programs
        if (isExplorePrograms) {
          if (userId) {
            // Fetch user's enrolled programs to exclude them from explore programs
            const data = await getUserDetails(userId, true);
            console.log('data=====>', data?.result?.userData?.tenantData);
            const tenantData = data?.result?.userData?.tenantData || [];
            const enrolledTenantIds = tenantData.map(
              (item: any) => item.tenantId
            );
            // Filter out programs that user is already enrolled in
            const explorePrograms = visiblePrograms?.filter(
              (program: any) => !enrolledTenantIds.includes(program.tenantId)
            );
            setPrograms(explorePrograms || []);
          } else {
            // If no userId, show all visible programs
            setPrograms(visiblePrograms || []);
          }
        } else if (userId) {
          // For My Programs tab, show only enrolled programs
          const data = await getUserDetails(userId, true);
          console.log('data=====>', data?.result?.userData?.tenantData);
          const tenantData = data?.result?.userData?.tenantData;
          const filterIds = tenantData.map((item: any) => item.tenantId);
          const filteredPrograms = programsData?.filter((program: any) =>
            filterIds.includes(program.tenantId)
          );
          setPrograms(filteredPrograms || []);
        } else {
          console.log('visiblePrograms=====>', visiblePrograms);
          setPrograms(visiblePrograms || []);
        }
        const tenantIds = res?.result?.map((item: any) => item.tenantId);
        setTenantId(tenantIds);
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenantInfo();
  }, [userId, isExplorePrograms]);

  const handleProgramSwitch = async (program: Program) => {
    if (!userId) {
      router.push('/login');
      return;
    }

    try {
      const storedUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!storedUserId || !token) {
        console.error('UserId or token not found in localStorage');
        router.push('/login');
        return;
      }

      // Get user details to find tenant data
      const userResponse = await getUserDetails(storedUserId, true);
      const tenantData = userResponse?.result?.userData?.tenantData?.find(
        (tenant: any) => tenant.tenantId === program.tenantId
      );

      if (!tenantData) {
        console.error('Tenant data not found for this program');
        return;
      }

      // Check if user has Learner role
      const roles = tenantData?.roles || [];
      const hasLearnerRole = roles.some(
        (role: any) => role?.roleName === 'Learner'
      );
      if (!hasLearnerRole && roles.length > 0) {
        console.error('User does not have Learner role for this program');
        return;
      }

      // Set all localStorage values for the selected program
      localStorage.setItem('userId', storedUserId);
      localStorage.setItem('templtateId', tenantData?.templateId);
      localStorage.setItem(
        'userIdName',
        userResponse?.result?.userData?.username
      );
      localStorage.setItem(
        'firstName',
        userResponse?.result?.userData?.firstName || ''
      );

      const tenantId = tenantData?.tenantId;
      const tenantName = tenantData?.tenantName;
      const uiConfig = tenantData?.params?.uiConfig;
      const landingPage = tenantData?.params?.uiConfig?.landingPage;

      localStorage.setItem('landingPage', landingPage);
      localStorage.setItem('uiConfig', JSON.stringify(uiConfig || {}));
      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('userProgram', tenantName);

      // Set channel and collection framework
      const channelId = tenantData?.channelId;
      if (channelId) {
        localStorage.setItem('channelId', channelId);
      }

      const collectionFramework = tenantData?.collectionFramework;
      if (collectionFramework) {
        localStorage.setItem('collectionFramework', collectionFramework);
      }

      // Set cookie
      document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;

      // Check profile completion
      await profileComplitionCheck();

      // Handle academic year for YOUTHNET
      if (tenantName === TenantName.YOUTHNET) {
        const academicYearResponse = await getAcademicYear();
        if (academicYearResponse?.[0]?.id) {
          localStorage.setItem('academicYearId', academicYearResponse[0].id);
        }
      }

      // Log analytics event
      logEvent({
        action: 'switch-program-from-card',
        category: 'Programs Page',
        label: 'Program Card Clicked',
      });

      // Navigate to landing page to avoid unauthorized issues
      router.push(landingPage || '/home');
    } catch (error) {
      console.error('Failed to switch program:', error);
    }
  };

  const handleAccessProgram = async (program: Program) => {
    if (!userId) {
      // If no userId, redirect to login
      router.push('/login');
      return;
    }

    try {
      setLoadingProgram({ id: program.tenantId, action: 'accessing' });
      const storedUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');

      if (!storedUserId || !token) {
        console.error('UserId or token not found in localStorage');
        router.push('/login');
        return;
      }

      // Get user details to find tenant data
      const userResponse = await getUserDetails(storedUserId, true);
      const tenantData = userResponse?.result?.userData?.tenantData?.find(
        (tenant: any) => tenant.tenantId === program.tenantId
      );

      if (!tenantData) {
        console.error('Tenant data not found for this program');
        return;
      }

      // Check if user has Learner role (for MY_PROGRAMS, user should already be enrolled)
      const roles = tenantData?.roles || [];
      console.log('roles=====>', roles);
      const hasLearnerRole = roles.some(
        (role: any) => role?.roleName === 'Learner'
      );
      console.log('hasLearnerRole=====>', hasLearnerRole);
      if (!hasLearnerRole && roles.length > 0) {
        console.error('User does not have Learner role for this program');
        return;
      }

      // Set localStorage values similar to callBackSwitchDialog
      localStorage.setItem('userId', storedUserId);
      localStorage.setItem('templtateId', tenantData?.templateId);
      localStorage.setItem(
        'userIdName',
        userResponse?.result?.userData?.username
      );
      localStorage.setItem(
        'firstName',
        userResponse?.result?.userData?.firstName || ''
      );

      const tenantId = tenantData?.tenantId;
      const tenantName = tenantData?.tenantName;
      const uiConfig = tenantData?.params?.uiConfig;
      const landingPage = tenantData?.params?.uiConfig?.landingPage;

      localStorage.setItem('landingPage', landingPage);
      localStorage.setItem('uiConfig', JSON.stringify(uiConfig || {}));
      localStorage.setItem('tenantId', tenantId);
      localStorage.setItem('userProgram', tenantName);

      // Check profile completion
      await profileComplitionCheck();

      // Handle academic year for YOUTHNET
      if (tenantName === TenantName.YOUTHNET) {
        const academicYearResponse = await getAcademicYear();
        if (academicYearResponse?.[0]?.id) {
          localStorage.setItem('academicYearId', academicYearResponse[0].id);
        }
      }

      // Set channel and collection framework
      const channelId = tenantData?.channelId;
      localStorage.setItem('channelId', channelId);

      const collectionFramework = tenantData?.collectionFramework;
      localStorage.setItem('collectionFramework', collectionFramework);

      // Set cookie
      document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;

      // Log analytics event
      logEvent({
        action: 'access-program-from-my-programs',
        category: 'Programs Page',
        label: 'Access Program Button Clicked',
      });
      console.log('enrolledProgram=====>', enrolledProgram);
      // Redirect to landing page
      if (enrolledProgram) {
        router.push(enrolledProgram?.params?.uiConfig?.landingPage || '/home');
      }
      router.push(landingPage || '/home');
    } catch (error) {
      console.error('Failed to access program:', error);
      // You can add error handling/toast notification here
    } finally {
      setLoadingProgram(null);
    }
  };

  const handleEnroll = async (program: Program) => {
    if (!userId || !isExplorePrograms) {
      // If no userId or not explore programs tab, redirect to registration
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('userProgram', program?.name);
      }
      router.push('/registration?tenantId=' + program?.tenantId);
      return;
    }

    try {
      setLoadingProgram({ id: program.tenantId, action: 'enrolling' });
      const storedUserId = localStorage.getItem('userId');

      if (!storedUserId) {
        console.error('UserId not found in localStorage');
        return;
      }

      // Store program information for EditProfile page
      if (typeof window !== 'undefined' && window.localStorage) {
        // Store tenantId temporarily for EditProfile to fetch correct form schema
        const currentTenantId = localStorage.getItem('tenantId');
        localStorage.setItem('previousTenantId', currentTenantId || '');
        localStorage.setItem('tenantId', program.tenantId);
        localStorage.setItem('userProgram', program?.name);

        // Store uiConfig if available
        if (program?.params?.uiConfig) {
          localStorage.setItem(
            'uiConfig',
            JSON.stringify(program.params.uiConfig)
          );
        }

        // Store landing page if available
        if (program?.params?.uiConfig?.landingPage) {
          localStorage.setItem(
            'landingPage',
            program.params.uiConfig.landingPage
          );
        }

        // Store enrolled program data for the profile completion page
        localStorage.setItem(
          'enrolledProgramData',
          JSON.stringify({
            tenantId: program.tenantId,
            name: program.name,
            params: program.params,
          })
        );
      }

      // Navigate to enrollment profile completion page
      router.push('/enroll-profile-completion');
    } catch (error) {
      console.error('Failed to enroll in program:', error);
      // You can add error handling/toast notification here
    } finally {
      setLoadingProgram(null);
    }
  };

  const onCloseSignupSuccessModal = () => {
    setSignupSuccessModal(false);
    setEnrolledProgram(null); // Clear enrolled program when modal is closed
  };

  const onSigin = async () => {
    setSignupSuccessModal(false);

    // If there's an enrolled program, sign in to it
    if (enrolledProgram) {
      await handleAccessProgram(enrolledProgram);
      setEnrolledProgram(null); // Clear the enrolled program
    } else {
      // Fallback to home if no program is stored
      router.push('/home');
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        px: { xs: 2, sm: 3, md: 2 },
        mx: 'auto',
      }}
    >
      <Box sx={{ my: { xs: 3, sm: 4, md: 3 } }}>
        {/* <Typography
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
        </Typography> */}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : programs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" color="textSecondary">
              {t('LEARNER_APP.HOME.NO_PROGRAMS_FOUND') ||
                "No programs found."}
            </Typography>
          </Box>
        ) : !isExplorePrograms && programs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h2" color="textSecondary">
              {t('LEARNER_APP.HOME.NO_REGISTERED_PROGRAMS') ||
                "You haven't registered for any program."}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 2, md: 2 }}>
            {programs?.map((program) => (
              <Grid item xs={12} sm={6} md={4} key={program?.ordering}>
                <SwiperSlide>
                  <Card
                    onClick={() => {
                      // If it's My Programs tab (not explore), make card clickable to switch program
                      if (!isExplorePrograms && userId) {
                        handleProgramSwitch(program);
                      }
                    }}
                    sx={{
                      maxWidth: '100%',
                      height: { xs: 'auto', sm: '400px' },
                      minHeight: { xs: '350px', sm: '400px' },
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: 3,
                      cursor:
                        !isExplorePrograms && userId ? 'pointer' : 'default',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover':
                        !isExplorePrograms && userId
                          ? {
                              transform: 'translateY(-4px)',
                              boxShadow: 6,
                            }
                          : {},
                    }}
                  >
                    <Box
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        backgroundColor: '#FFDEA1',
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          fontSize: { xs: '16px', sm: '18px' },
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
                        minHeight: 0,
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
                            bulletActiveClass:
                              'swiper-pagination-bullet-active',
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
                                    margin: { xs: '8px', sm: '10px' },
                                    height: { xs: '180px', sm: '200px' },
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
                                    sx={{
                                      color: '#1F1B13',
                                      fontSize: '30px',
                                    }}
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
                                    sx={{
                                      color: '#1F1B13',
                                      fontSize: '30px',
                                    }}
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
                      sx={{
                        p: { xs: 1.5, sm: 2 },
                        pt: { xs: 1, sm: 2 },
                        mt: 'auto',
                        pb: { xs: 1.5, sm: 2 },
                      }}
                    >
                      {program?.params?.uiConfig?.showSignup === true && (
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          disabled={loadingProgram?.id === program.tenantId}
                          sx={{
                            borderRadius: 50,
                            backgroundColor: '#FDBE16',
                            fontSize: { xs: '14px', sm: '16px' },
                            py: { xs: 1, sm: 1.5 },
                            '&:hover': {
                              backgroundColor: '#FDBE16',
                            },
                          }}
                          onClick={(e) => {
                            // Prevent card click when button is clicked
                            e.stopPropagation();
                            // If userId exists and it's not explore programs tab, call handleAccessProgram
                            if (userId && !isExplorePrograms) {
                              handleAccessProgram(program);
                            } else {
                              handleEnroll(program);
                            }
                          }}
                        >
                          {loadingProgram?.id === program.tenantId
                            ? loadingProgram.action === 'accessing'
                              ? t('LEARNER_APP.HOME.ACCESSING_PROGRAM') ||
                                'Accessing Program...'
                              : t('LEARNER_APP.HOME.ENROLLING') ||
                                'Enrolling...'
                            : userId && isExplorePrograms
                            ? t('LEARNER_APP.HOME.ENROLL')
                            : userId
                            ? t('LEARNER_APP.HOME.ACCESS_PROGRAM')
                            : t('LEARNER_APP.HOME.ENROLL')}
                        </Button>
                      )}
                    </CardActions>
                  </Card>
                </SwiperSlide>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <SimpleModal
        open={signupSuccessModal}
        onClose={onCloseSignupSuccessModal}
        showFooter={true}
        primaryText={'Start learning'}
        primaryActionHandler={onSigin}
      >
        <Box p="10px">
          <SignupSuccess />
        </Box>
      </SimpleModal>
    </Container>
  );
};

export default EnrollProgramCarousel;
