'use client';

import React, { Suspense, useState } from 'react';
import EditProfile from '@learner/components/EditProfile/EditProfile';
import { useRouter } from 'next/navigation';
import { getUserDetails, profileComplitionCheck, updateUser } from '@learner/utils/API/userService';
import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { TenantName } from '@learner/utils/app.constant';
import { logEvent } from '@learner/utils/googleAnalytics';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import AssessmentRequiredModal from '@learner/components/AssessmentRequiredModal/AssessmentRequiredModal';
import { Box, Typography } from '@mui/material';
import SignupSuccess from '@learner/components/SignupSuccess /SignupSuccess ';
import { ContentSearch } from '@learner/utils/API/contentService';
import { enrollUserTenant, reactivateUserTenant } from '@learner/utils/API/EnrollmentService';
import { getCohortList } from '@learner/utils/API/CohortService';
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

  // FIX (PS-7093): Enroll a user into a tenant, covering the admin-deleted case.
  //
  // When an admin deletes a learner from a program the user-tenant mapping is kept and
  // its tenantStatus set to 'archived'. POST /user-tenant only CREATES mappings, so it
  // cannot re-enroll such a user — that requires PATCH /user-tenant/status.
  //
  // Rather than relying on POST throwing (it may return success without actually
  // re-activating, leaving the learner archived), we read the mapping's current status
  // from tenantData and call the right endpoint first, keeping the other as a fallback.
  const enrollOrReactivateTenant = async (
    userId: string,
    tenantId: string,
    roleId: string,
    isPendingStatus: boolean,
    tenantData: any[]
  ) => {
    const targetStatus = isPendingStatus ? 'pending' : 'active';
    const isArchived = (tenantData || []).some(
      (tenant: any) =>
        tenant?.tenantId === tenantId && tenant?.tenantStatus === 'archived'
    );

    const doEnroll = () =>
      isPendingStatus
        ? enrollUserTenant({ userId, tenantId, roleId, userTenantStatus: 'pending' })
        : enrollUserTenant({ userId, tenantId, roleId });
    const doReactivate = () => reactivateUserTenant(userId, tenantId, targetStatus);

    const [primary, fallback] = isArchived
      ? [doReactivate, doEnroll]
      : [doEnroll, doReactivate];

    try {
      await primary();
    } catch (primaryError) {
      console.error(
        `Enrollment call failed (archived=${isArchived}), trying fallback:`,
        primaryError
      );
      try {
        await fallback();
      } catch (fallbackError) {
        console.error('Enrollment fallback also failed:', fallbackError);
      }
    }
  };

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

      // FIX (PS-7093): Guarantee a roleId before the enrollment blocks below.
      //
      // Both enrollment paths are guarded by `if (userId && roleId && tenantId)`. When
      // roleId is missing the guard fails silently — no POST, no PATCH fallback, no error
      // logged — so the learner reaches the dashboard un-enrolled and the ClientLayout
      // archived-tenant guard bounces them to /login.
      //
      // This happens for a learner deleted from every program: the login path has no
      // active tenant to read a roleId from. Derive it from tenantData here (preferring
      // the target tenant's own Learner role) so re-enrollment works from any entry point.
      if (!localStorage.getItem('roleId')) {
        const allTenantData = userResponse?.result?.userData?.tenantData || [];
        const learnerRoleId =
          allTenantData
            .find((tenant: any) => tenant?.tenantId === tenantId)
            ?.roles?.find((role: any) => role?.roleName === 'Learner')?.roleId ||
          allTenantData
            .flatMap((tenant: any) => tenant?.roles || [])
            .find((role: any) => role?.roleName === 'Learner')?.roleId;
        if (learnerRoleId) {
          localStorage.setItem('roleId', learnerRoleId);
        } else {
          console.error(
            'No Learner roleId could be resolved — tenant enrollment will be skipped'
          );
        }
      }

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
        // Enroll the user into the tenant immediately on Finish Enroll (parity with
        // non-test programs). The eligibility test flow below still runs afterwards.
        try {
          const enrollUserId = localStorage.getItem('userId');
          const enrollRoleId = localStorage.getItem('roleId');
          const enrollTenantId = localStorage.getItem('tenantId');
          const userTenantStatus = uiConfig?.isTenantPendingStatus;
          if (enrollUserId && enrollRoleId && enrollTenantId) {
            await enrollOrReactivateTenant(
              enrollUserId,
              enrollTenantId,
              enrollRoleId,
              Boolean(userTenantStatus),
              userResponse?.result?.userData?.tenantData || []
            );
            console.log('Enrolled into tenant:', enrollTenantId);
            if (userTenantStatus) {
              try {
                await updateUser(enrollUserId, {
                  userData: {},
                  customFields: [{
                    fieldId: 'f8dc1d5f-9b2b-412e-a22a-351bd8f14963',
                    value: 'pending',
                  }],
                });
              } catch (updateError) {
                console.error('Failed to update pending custom field:', updateError);
              }
            }
          }
        } catch (enrollError) {
          console.error('Enrollment failed:', enrollError);
        }

        // Check if user already has an active batch across all academic years
        try {
          const academicYearList = await getAcademicYear();
          const allAcademicYearIds = Array.isArray(academicYearList)
            ? academicYearList
                .map((year: { id?: string; isActive?: boolean }) => year?.id)
                .filter(Boolean)
            : [];
          const activeAcademicYear = Array.isArray(academicYearList)
            ? academicYearList.find((year: { id?: string; isActive?: boolean }) => year?.isActive)
            : undefined;

          let userHasActiveBatch = false;
          for (const yearId of allAcademicYearIds) {
            localStorage.setItem('academicYearId', yearId as string);
            const cohortResponse = await getCohortList(storedUserId!, true, true);
            const hasBatch = Array.isArray(cohortResponse?.result)
              ? cohortResponse.result.some(
                  (cohort: { type?: string; cohortStatus?: string; cohortMemberStatus?: string }) =>
                    cohort?.type === 'BATCH' &&
                    cohort?.cohortStatus === 'active'
                )
              : false;
            if (hasBatch) {
              userHasActiveBatch = true;
                            localStorage.setItem('cohortAssignedToAnyAcademicYearId', 'yes');

              break;
            }
            
          }

          if (activeAcademicYear?.id) {
            localStorage.setItem('academicYearId', activeAcademicYear.id);
          }

          if (userHasActiveBatch) {
            setSignupSuccessModal(true);
            return;
          }
        } catch (error) {
          console.error('Batch check failed in enroll-profile-completion:', error);
        }

        try {
          const preferredLanguage = localStorage.getItem('preferred_language');
          const response = await ContentSearch({
            query: '',
            filters: {
              status: ['Live'],
              primaryCategory: ['Practice Question Set'],
              assessmentType: 'Eligibility Test',
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
            // Same archived-aware enrollment as the registration-test branch above, so a
            // previously-deleted learner can also re-enroll into non-test programs.
            await enrollOrReactivateTenant(
              storedUserId,
              enrollTenantId,
              storedRoleId,
              Boolean(userTenantStatus),
              userResponse?.result?.userData?.tenantData || []
            );
            console.log('Enrolled into tenant:', enrollTenantId);
            // Always update user with pending custom field after enrollment
            try {
              if (userTenantStatus) {
              await updateUser(storedUserId, {
                userData: {},
                customFields: [{
                  fieldId: 'f8dc1d5f-9b2b-412e-a22a-351bd8f14963',
                  value: 'pending',
                }],
              });
            }
            } catch (updateError) {
              console.error('Failed to update pending custom field:', updateError);
            }
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
          localStorage.removeItem('onboardTenantId');
          // Use window.location.href to avoid remounting EditProfile before navigation completes
          window.location.href = landingPage || '/home';
      }
    } catch (error) {
      console.error('Error in onSigin:', error);
    }
  };

  const handleAssessmentModalClose = async () => {
    setAssessmentRequiredModal(false);
    // Enrollment already happened on Finish Enroll (handleAccessProgram), including
    // the POST -> PATCH re-activation fallback for previously-deleted users; here we
    // only mark the registration test as given and continue.
    localStorage.setItem('registerationTestGiven', 'Yes');
     const isAndroid = localStorage.getItem('isAndroidApp') === 'yes';
      console.log('isAndroid check:', isAndroid);
                localStorage.setItem('registerationTestGiven', 'Yes');

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
        // setSignupSuccessModal(false);
        }
        else{
    localStorage.removeItem('onboardTenantId');
    localStorage.removeItem('enrollTenantId');
    const finalLandingPage = localStorage.getItem('landingPage') || '/home';
    window.location.href = finalLandingPage;
        }
  };

  const onAssessmentUnavailableOk = async () => {
    setAssessmentUnavailableModal(false);
    localStorage.removeItem('enrollTenantId');
    localStorage.removeItem('onboardTenantId');
    // Enrollment already happened on Finish Enroll (handleAccessProgram), including
    // the POST -> PATCH re-activation fallback for previously-deleted users.
    console.log('========== onAssessmentUnavailableOk CALLED ==========');
    const isAndroid = localStorage.getItem('isAndroidApp') === 'yes';
    console.log('isAndroid check:', isAndroid);

    if (isAndroid) {
      console.log('Android path - sending message to WebView');
      if (window.ReactNativeWebView) {
        let refreshToken = localStorage.getItem('refreshTokenForAndroid');
        if (!refreshToken || refreshToken === '') {
          refreshToken = localStorage.getItem('refreshToken');
        }
        console.log('Posting ENROLL_PROGRAM_EVENT to ReactNativeWebView');
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'ENROLL_PROGRAM_EVENT', // Event type identifier
          data: {
            userId: localStorage.getItem('userId'),
            tenantId: localStorage.getItem('tenantId'),
            token: localStorage.getItem('token'),
            refreshToken: refreshToken,
          }
        }));
      } else {
        console.log('isAndroidApp is yes but window.ReactNativeWebView is missing');
      }
    } else {
      console.log('Web path - navigating to /scp-dashboard');
      window.location.href = '/scp-dashboard';
    }
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
      // Mark the registration test as addressed (parity with Close) so the
      // ClientLayout route guard doesn't lock the user out of programs if they
      // start the test and then abort it.
      localStorage.setItem('registerationTestGiven', 'Yes');
      window.location.href = `/player/${questionSetIdentifier}?previousPage=${encodeURIComponent('/scp-dashboard')}&exitLink=${encodeURIComponent('/reattempt-check')}`;


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
        onClose={handleAssessmentModalClose}
        onStartAssessment={handleStartAssessment}
      />
      <SimpleModal
        open={assessmentUnavailableModal}
        onClose={onAssessmentUnavailableOk}
        showFooter={true}
        primaryText={t('COMMON.OK')}
        primaryActionHandler={onAssessmentUnavailableOk}
        modalTitle={t('LEARNER_APP.REGISTRATION_FLOW.COME_BACK_LATER')}
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
