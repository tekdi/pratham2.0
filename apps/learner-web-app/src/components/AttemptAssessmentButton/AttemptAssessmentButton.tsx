'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import { ContentSearch } from '@learner/utils/API/contentService';
import { getAssessmentStatus } from '@learner/utils/API/AssesmentService';
import { TenantName } from '@learner/utils/app.constant';

const AttemptAssessmentButton: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);
  const [questionSetIdentifier, setQuestionSetIdentifier] = useState<
    string | null
  >(null);

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
        setShowButton(false);
        return;
      }

      const result = await getAssessmentStatus({
        userId: storedUserId,
        courseId: identifier,
        unitId: identifier,
        contentId: identifier,
      });

      if (Array.isArray(result) && result.length === 0) {
        localStorage.setItem(
          'registerationTestQuestionSetIdentifier',
          identifier
        );
        setQuestionSetIdentifier(identifier);
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    } catch (error) {
      console.error('AttemptAssessmentButton: status check failed', error);
      setShowButton(false);
    }
  }, []);

  useEffect(() => {
    checkPendingAssessment();
  }, [checkPendingAssessment, pathname]);

  const handleClick = () => {
    if (!questionSetIdentifier) return;

    const previousPage = pathname || '/scp-dashboard';
    window.location.href = `/player/${questionSetIdentifier}?previousPage=${encodeURIComponent(previousPage)}&exitLink=${encodeURIComponent('/reattempt-check')}`;
  };

  if (!showButton) {
    return null;
  }

  return (
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
  );
};

export default AttemptAssessmentButton;
