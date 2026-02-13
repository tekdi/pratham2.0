'use client';

import React, { Suspense, useState } from 'react';
import EditProfile from '@learner/components/EditProfile/EditProfile';
import { useRouter } from 'next/navigation';
import { getUserDetails, profileComplitionCheck } from '@learner/utils/API/userService';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { TenantName } from '@learner/utils/app.constant';
import { logEvent } from '@learner/utils/googleAnalytics';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import { Box } from '@mui/material';
import SignupSuccess from '@learner/components/SignupSuccess /SignupSuccess ';
import { enrollUserTenant } from '@learner/utils/API/EnrollmentService';
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
const EnrollProfileCompletionInner = () => {
  const router = useRouter();
  const [signupSuccessModal, setSignupSuccessModal] = useState(false);
  const [landingPage, setLandingPage] = useState<string>('');

  const handleAccessProgram = async () => {
    try {
      const storedUserId = localStorage.getItem('userId');
      const storedRoleId = localStorage.getItem('roleId');
      const token = localStorage.getItem('token');
      const enrolledProgramData = localStorage.getItem('enrolledProgramData');

      if (!storedUserId || !storedRoleId || !token || !enrolledProgramData) {
        console.error('Missing required data for program access');
        router.push('/programs');
        return;
      }

      const program = JSON.parse(enrolledProgramData);
      const storedUiConfig = JSON.parse(localStorage.getItem('uiConfig') || '{}');
      const userTenantStatus = storedUiConfig?.isTenantPendingStatus;
      console.log('userTenantStatus', userTenantStatus);
      if(userTenantStatus){
        console.log('enrolling user to tenant');
        await enrollUserTenant({
          userId: storedUserId,
          tenantId: program.tenantId,
          roleId: storedRoleId,
          userTenantStatus: 'pending',
        });
      }
      else{
        // Enroll user to tenant
        await enrollUserTenant({
          userId: storedUserId,
          tenantId: program.tenantId,
          roleId: storedRoleId,
        });
      }
      // Get user details to find tenant data
      const userResponse = await getUserDetails(storedUserId, true);
      const tenantData = userResponse?.result?.userData?.tenantData?.find(
        (tenant: any) => tenant.tenantId === program.tenantId
      );

      if (!tenantData) {
        console.error('Tenant data not found for this program');
        router.push('/programs');
        return;
      }

      // Check if user has Learner role
      const roles = tenantData?.roles || [];
      const hasLearnerRole = roles.some((role: any) => role?.roleName === 'Learner');

      if (!hasLearnerRole && roles.length > 0) {
        console.error('User does not have Learner role for this program');
        router.push('/programs');
        return;
      } else {
        // Set localStorage values similar to callBackSwitchDialog
        localStorage.setItem('userId', storedUserId);
        localStorage.setItem('templtateId', tenantData?.templateId);
      localStorage.setItem('userIdName', userResponse?.result?.userData?.username);
      localStorage.setItem('firstName', userResponse?.result?.userData?.firstName || '');

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
          action: 'access-program-after-enrollment',
          category: 'Enrollment Profile Completion',
          label: 'Profile Completed and Program Accessed',
        });

        // Clean up enrolled program data
        localStorage.removeItem('enrolledProgramData');
        localStorage.removeItem('previousTenantId');

        // Store landing page for later navigation
    const finalLandingPage = landingPage || '/home';
    console.log('Setting landing page to:', finalLandingPage);
    setLandingPage(finalLandingPage);

    // Show success modal instead of redirecting immediately
    console.log('Opening signup success modal');
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
          // Close modal first, then navigate
          setSignupSuccessModal(false);
          // Use setTimeout to ensure modal closes before navigation
          setTimeout(() => {
            console.log('Executing router.push to:', landingPage || '/home');
            router.push(landingPage || '/home');
          }, 100);
      }
    } catch (error) {
      console.error('Error in onSigin:', error);
    }
  };

  return (
    <>
      {!signupSuccessModal && (
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
