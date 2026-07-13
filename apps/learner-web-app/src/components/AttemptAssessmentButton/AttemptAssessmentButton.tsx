'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import { ContentSearch } from '@learner/utils/API/contentService';
import { getAssessmentStatus } from '@learner/utils/API/AssesmentService';
import { TenantName } from '@learner/utils/app.constant';
import SimpleModal from '@learner/components/SimpleModal/SimpleModal';

const AttemptAssessmentButton: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);
  const [questionSetIdentifier, setQuestionSetIdentifier] = useState<string | null>(null);
  const [isContentAvailable, setIsContentAvailable] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);

  const checkPendingAssessment = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const userProgram = localStorage.getItem('userProgram');
    if (userProgram !== TenantName.SECOND_CHANCE_PROGRAM) {
      setShowButton(false);
      return;
    }

    const uiConfig = JSON.parse(localStorage.getItem('uiConfig') || '{}');
    const isRegistrationTestEnabled =
      uiConfig?.RegisterationTest === true ||
      uiConfig?.RegisterationTest === 'true';

    if (!isRegistrationTestEnabled) {
      setShowButton(false);
      return;
    }

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setShowButton(false);
      return;
    }

    const cohortAssignedToAnyAcademicYearId = localStorage.getItem('cohortAssignedToAnyAcademicYearId');
    if (cohortAssignedToAnyAcademicYearId) {
      setShowButton(false);
      return;
    }

    const targetProgramName = userProgram;
    const programFilter =
      targetProgramName === TenantName.SECOND_CHANCE_PROGRAM
        ? [targetProgramName, 'Second Chance']
        : [targetProgramName];

    const preferredLanguage = localStorage.getItem('preferred_language');

    try {
      const response = await ContentSearch({
        query: '',
        filters: {
          status: ['Live'],
          primaryCategory: ['Practice Question Set'],
          assessmentType: 'Eligibility Test',
          program: programFilter,
          ...(preferredLanguage ? { contentLanguage: [preferredLanguage] } : {}),
        },
        sort_by: { lastUpdatedOn: 'desc' },
        limit: 1,
        offset: 0,
      });

      const identifier = response?.result?.QuestionSet?.[0]?.identifier;
      if (!identifier) {
        setIsContentAvailable(false);
        setQuestionSetIdentifier(null);
        setShowButton(true);
        return;
      }

      const result = await getAssessmentStatus({
        userId: storedUserId,
        courseId: identifier,
        unitId: identifier,
        contentId: identifier,
      });

      // Show the button while attempts remain, using the same allowance the
      // reattempt popup uses (uiConfig.registrationTestReattempt) so the two agree.
      const registrationTestReattempt = Number(
        uiConfig?.registrationTestReattempt ?? 0
      );

      if (Array.isArray(result) && result.length < registrationTestReattempt) {
        localStorage.setItem('registerationTestQuestionSetIdentifier', identifier);
        setQuestionSetIdentifier(identifier);
        setIsContentAvailable(true);
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      console.error('AttemptAssessmentButton: status check failed', error);
      setIsContentAvailable(false);
      setShowButton(true);
    }
  }, []);

  useEffect(() => {
    checkPendingAssessment();
  }, [checkPendingAssessment, pathname]);

  const handleClick = () => {
    if (isContentAvailable && questionSetIdentifier) {
      const previousPage = pathname || '/scp-dashboard';
      window.location.href = `/player/${questionSetIdentifier}?previousPage=${encodeURIComponent(previousPage)}&exitLink=${encodeURIComponent('/reattempt-check')}`;
    } else {
      setShowUnavailableModal(true);
    }
  };

  if (!showButton) {
    return null;
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        sx={{
          minWidth: { xs: 'auto', sm: '160px' },
          fontWeight: 500,
          fontSize: 14,
          lineHeight: '20px',
          letterSpacing: '0.1px',
          whiteSpace: 'nowrap',
          px: { xs: 2, sm: 3 },
          py: 1,
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
          flexShrink: 0,
        }}
      >
        {t('LEARNER_APP.REGISTRATION_FLOW.ATTEMPT_ASSESSMENT')}
      </Button>

      <SimpleModal
        open={showUnavailableModal}
        onClose={() => setShowUnavailableModal(false)}
        showFooter={true}
        primaryText={t('COMMON.OK')}
        primaryActionHandler={() => setShowUnavailableModal(false)}
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

export default AttemptAssessmentButton;
