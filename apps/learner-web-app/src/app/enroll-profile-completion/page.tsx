'use client';

import React, { Suspense, useState } from 'react';
import EditProfile from '@learner/components/EditProfile/EditProfile';
import { useRouter } from 'next/navigation';
import { getUserDetails, profileComplitionCheck } from '@learner/utils/API/userService';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { TenantName } from '@learner/utils/app.constant';
import { logEvent } from '@learner/utils/googleAnalytics';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import AssessmentRequiredModal from '@learner/components/AssessmentRequiredModal/AssessmentRequiredModal';
import { Box, Typography } from '@mui/material';
import SignupSuccess from '@learner/components/SignupSuccess /SignupSuccess ';
import { ContentSearch } from '@learner/utils/API/contentService';
import { enrollUserTenant } from '@learner/utils/API/EnrollmentService';
import { useTranslation } from '@shared-lib';
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
const EnrollProfileCompletionInner = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [signupSuccessModal, setSignupSuccessModal] = useState(false);
  const [assessmentRequiredModal, setAssessmentRequiredModal] = useState(false);
  const [assessmentUnavailableModal, setAssessmentUnavailableModal] = useState(false);
  const [landingPage, setLandingPage] = useState<string>('');

  const handleAccessProgram = async () => {
    try {
      const storedUserId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      const enrolledProgramData = localStorage.getItem('enrolledProgramData');

      if (!storedUserId || !token || !enrolledProgramData) {
        console.error('Missing required data for program access');
        router.push('/programs');
        return;
      }

      const program = JSON.parse(enrolledProgramData);

      // Use program data directly (no enrollment needed)
      const tenantId = program.tenantId;
      const tenantName = program.name;
      const uiConfig = program.params?.uiConfig;
      const landingPage = program.params?.uiConfig?.landingPage;

      // Get user details for identity fields only
      const userResponse = await getUserDetails(storedUserId, true);
      localStorage.setItem('userId', storedUserId);
      localStorage.setItem('userIdName', userResponse?.result?.userData?.username);
      localStorage.setItem('firstName', userResponse?.result?.userData?.firstName || '');
      localStorage.setItem('lastName', userResponse?.result?.userData?.lastName || '');

      if (program.params?.templateId) {
        localStorage.setItem('templtateId', program.params.templateId);
      }
      if (program.params?.channelId) {
        localStorage.setItem('channelId', program.params.channelId);
      }
      if (program.params?.collectionFramework) {
        localStorage.setItem('collectionFramework', program.params.collectionFramework);
      }

      localStorage.setItem('landingPage', landingPage || '');
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

      // Set cookie
      document.cookie = `token=${token}; path=/; secure; SameSite=Strict`;

      // Log analytics event
      logEvent({
        action: 'access-program-after-enrollment',
        category: 'Enrollment Profile Completion',
        label: 'Profile Completed and Program Accessed',
      });

      // Clean up enrolled program data
      localStorage.removeItem('enrolledProgramData');
      localStorage.removeItem('previousTenantId');

      const finalLandingPage = landingPage || '/home';
      setLandingPage(finalLandingPage);

      const isRegisterationTestEnabled =
        uiConfig?.RegisterationTest === true || uiConfig?.RegisterationTest === 'true';
      console.log('isRegisterationTestEnabled', isRegisterationTestEnabled);

      if (isRegisterationTestEnabled) {
        try {
          const preferredLanguage = localStorage.getItem('preferred_language');
          const response = await ContentSearch({
            query: '',
            filters: {
              status: ['Live'],
              primaryCategory: ['Practice Question Set'],
              assessmentType: 'Zatpat Test',
              ...(preferredLanguage ? { contentLanguage: [preferredLanguage] } : {}),
              program: ['Second Chance'],
            },
            sort_by: {
              lastUpdatedOn: 'desc',
            },
            limit: 1,
            offset: 0,
          });
          const questionSetIdentifier = response?.result?.QuestionSet?.[0]?.identifier;
          console.log('questionSetIdentifier from API:', questionSetIdentifier);
          if (questionSetIdentifier) {
            localStorage.setItem('registerationTestQuestionSetIdentifier', questionSetIdentifier);
            localStorage.setItem('registerationTestGiven', 'No');
            setAssessmentRequiredModal(true);
          } else {
            setAssessmentUnavailableModal(true);
          }
        } catch (error) {
          console.error('ContentSearch failed:', error);
          setAssessmentUnavailableModal(true);
        }
      } else {
        // No assessment required — enroll directly then show success modal
        try {
          const storedUserId = localStorage.getItem('userId');
          const storedRoleId = localStorage.getItem('roleId');
          const enrollTenantId = localStorage.getItem('tenantId');
          const userTenantStatus = uiConfig?.isTenantPendingStatus;
          if (storedUserId && storedRoleId && enrollTenantId) {
            if (userTenantStatus) {
              await enrollUserTenant({ userId: storedUserId, tenantId: enrollTenantId, roleId: storedRoleId, userTenantStatus: 'pending' });
            } else {
              await enrollUserTenant({ userId: storedUserId, tenantId: enrollTenantId, roleId: storedRoleId });
            }
            console.log('Enrolled into tenant:', enrollTenantId);
          }
        } catch (enrollError) {
          console.error('Enrollment failed:', enrollError);
        }
        setSignupSuccessModal(true);
      }
    } catch (error) {
      console.error('Failed to access program:', error);
      router.push('/programs');
    }
  };

  const onCloseSignupSuccessModal = () => {
    setSignupSuccessModal(false);
  };

  const onSigin = () => {
    try {
      console.log('========== onSigin CALLED ==========');
      console.log('isAndroidApp:', localStorage.getItem('isAndroidApp'));
      console.log('tenantId:', localStorage.getItem('tenantId'));
      console.log('landingPage from state:', landingPage);
      console.log('landingPage from localStorage:', localStorage.getItem('landingPage'));
      
      const isAndroid = localStorage.getItem('isAndroidApp') === 'yes';
      console.log('isAndroid check:', isAndroid);
      
      if(isAndroid)
        {
         console.log('Android path - sending message to WebView');
         // Send message to React Native WebView

              //  const enrolledProgramData = localStorage.getItem('enrolledProgramData');

              //        const program = JSON.parse(enrolledProgramData || '{}');


            // Get refreshToken with fallback - check refreshTokenForAndroid first, then refreshToken
          let refreshToken = localStorage.getItem('refreshTokenForAndroid');
          // Fallback to refreshToken if refreshTokenForAndroid is null or empty
          if (!refreshToken || refreshToken === '') {
            refreshToken = localStorage.getItem('refreshToken');
          }
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ENROLL_PROGRAM_EVENT', // Event type identifier
              data: {
                userId: localStorage.getItem('userId'),
                tenantId: localStorage.getItem('tenantId'),
                token: localStorage.getItem('token'),
                refreshToken: refreshToken,

                // Add any data you want to send
              }
            }));
          }
         setSignupSuccessModal(false);
        }
        else{
          console.log('Web path - navigating to:', landingPage || '/home');
          localStorage.removeItem('enrollTenantId');
          localStorage.removeItem('temp_program_type');
          // Use window.location.href to avoid remounting EditProfile before navigation completes
          window.location.href = landingPage || '/home';
      }
    } catch (error) {
      console.error('Error in onSigin:', error);
    }
  };

  const onAssessmentUnavailableOk = () => {
    setAssessmentUnavailableModal(false);
    setTimeout(() => {
      window.location.href = '/programs';
    }, 100);
  };

  const handleStartAssessment = async () => {
     const questionSetIdentifier = localStorage.getItem('registerationTestQuestionSetIdentifier');

    // Step 1: Try to get identifier from API (non-blocking — failure won't prevent navigation)
  
    // Step 2: Fallback to previously stored identifier if API failed or returned nothing
    // if (!questionSetIdentifier) {
    //   questionSetIdentifier =
    //     localStorage.getItem('registerationTestQuestionSetIdentifier') || undefined;
    //   console.log('questionSetIdentifier from localStorage:', questionSetIdentifier);
    // }

    // if (!questionSetIdentifier) {
    //   console.error('No questionSetIdentifier found, cannot navigate to player');
    //   return;
    // }

    // // Step 3: Store and navigate
    // localStorage.setItem('registerationTestQuestionSetIdentifier', questionSetIdentifier);
    // setAssessmentRequiredModal(false);

    // Use window.location.href for guaranteed navigation (router.push can silently fail in modals)
     if(questionSetIdentifier){
      window.location.href = `/player/${questionSetIdentifier}?previousPage=${encodeURIComponent('/programs')}&exitLink=${encodeURIComponent('/reattempt-check')}`;

   
   }
  };

  return (
    <>
      {!signupSuccessModal && !assessmentRequiredModal && !assessmentUnavailableModal && (
        <EditProfile
          completeProfile={true}
          enrolledProgram={true}
          uponEnrollCompletion={handleAccessProgram}
        />
      )}

      <SimpleModal
        open={signupSuccessModal}
        onClose={onCloseSignupSuccessModal}
        showFooter={true}
        primaryText={'Start learning'}
        primaryActionHandler={onSigin}
      >
        <Box p="10px">
          <SignupSuccess withProgramName={true} />
        </Box>
      </SimpleModal>

      <AssessmentRequiredModal
        open={assessmentRequiredModal}
        onClose={() => {
          setAssessmentRequiredModal(false);
          setTimeout(() => {
            window.location.href = '/programs';
          }, 100);
        }}
        onStartAssessment={handleStartAssessment}
      />
      <SimpleModal
        open={assessmentUnavailableModal}
        onClose={onAssessmentUnavailableOk}
        showFooter={true}
        primaryText={t('COMMON.OK')}
        primaryActionHandler={onAssessmentUnavailableOk}
      >
        <Box p="10px">
          <Typography variant="body1">
            {t('LEARNER_APP.REGISTRATION_FLOW.ASSESSMENT_UNAVAILABLE_MESSAGE')}
          </Typography>
        </Box>
      </SimpleModal>
    </>
  );
};

const EnrollProfileCompletionPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EnrollProfileCompletionInner />
    </Suspense>
  );
};

export default EnrollProfileCompletionPage;
