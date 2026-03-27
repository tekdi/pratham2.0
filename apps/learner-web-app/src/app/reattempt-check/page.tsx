'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { getAssessmentStatus } from '@learner/utils/API/AssesmentService';
import Loader from '@learner/components/Loader/Loader';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';
import { useTranslation } from '@shared-lib';

type ReattemptState = 'loading' | true | false;

const checkReattemptStatus = async (): Promise<boolean> => {
  const storedUserId = localStorage.getItem('userId');
  const questionSetIdentifier = localStorage.getItem(
    'registerationTestQuestionSetIdentifier'
  );

  if (!storedUserId || !questionSetIdentifier) {
    return false;
  }

  const uiConfig = JSON.parse(localStorage.getItem('uiConfig') || '{}');
  const registrationTestReattempt = Number(
    uiConfig?.registrationTestReattempt ?? 0
  );

  const result = await getAssessmentStatus({
    userId: storedUserId,
    courseId: questionSetIdentifier,
    unitId: questionSetIdentifier,
    contentId: questionSetIdentifier,
  });

  return (
    Array.isArray(result) && result.length < registrationTestReattempt
  );
};

const ReattemptCheckPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [reattempt, setReattempt] = useState<ReattemptState>('loading');

  useEffect(() => {
    const init = async () => {
      try {
        const canReattempt = await checkReattemptStatus();
        if (canReattempt) {
          setReattempt(true);
        } else {
          setReattempt(false);
            const isAndroid = localStorage.getItem('isAndroidApp') === 'yes';
      const landingPage = localStorage.getItem('landingPage') || '/home';

      // If exitLink matches the landingPage AND running inside Android WebView
      // → fire the native ENROLL_PROGRAM_EVENT instead of web redirect
      if (isAndroid ) {
        let refreshToken = localStorage.getItem('refreshTokenForAndroid');
        if (!refreshToken || refreshToken === '') {
          refreshToken = localStorage.getItem('refreshToken');
        }
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'ENROLL_PROGRAM_EVENT',
              data: {
                userId: localStorage.getItem('userId'),
                tenantId: localStorage.getItem('tenantId'),
                token: localStorage.getItem('token'),
                refreshToken: refreshToken,
              },
            })
          );
        }
      } else {
    
          router.replace(landingPage);
        }
        }
      } catch (error) {
        console.error('ReattemptCheckPage: checkReattemptStatus failed', error);
        const landingPage = localStorage.getItem('landingPage') || '/home';
        router.replace(landingPage);
      }
    };

    init();
  }, [router]);

  const handleContinue = () => {
    const landingPage = localStorage.getItem('landingPage') || '/home';
    router.replace(landingPage);
  };

  const handleReattempt = () => {
    const questionSetIdentifier = localStorage.getItem(
      'registerationTestQuestionSetIdentifier'
    );
    if (questionSetIdentifier) {
      const rettempt="/reattempt-check"
      window.location.href = `/player/${questionSetIdentifier}?previousPage=${encodeURIComponent('/programs')}&exitLink=${encodeURIComponent(rettempt)}`;
    } else {
      const landingPage = localStorage.getItem('landingPage') || '/home';
      router.replace(landingPage);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ background: 'linear-gradient(135deg, #FFFDF6, #F8EFDA)' }}
    >
      {/* Loader while status is being determined */}
      {reattempt === 'loading' && (
        <Loader showBackdrop={true} loadingText={t('REATTEMPT_CHECK.PLEASE_WAIT')} />
      )}

      {/* Reattempt popup shown only when reattempt === true */}
      {reattempt === true && (
        <SimpleModal
          open={true}
          onClose={handleContinue}
          showFooter={true}
          modalTitle={t('REATTEMPT_CHECK.MODAL_TITLE')}
          primaryText={t('REATTEMPT_CHECK.REATTEMPT_BUTTON')}
          primaryActionHandler={handleReattempt}
          secondaryText={t('REATTEMPT_CHECK.CONTINUE_BUTTON')}
          secondaryActionHandler={handleContinue}
        >
          <Box p="10px" textAlign="center">
            <Typography variant="body1" fontWeight={500} mb={1}>
              {t('REATTEMPT_CHECK.MAIN_MESSAGE')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('REATTEMPT_CHECK.SUB_MESSAGE')}
            </Typography>
          </Box>
        </SimpleModal>
      )}
    </Box>
  );
};

export default ReattemptCheckPage;
