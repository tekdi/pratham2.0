'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@shared-lib';
import { ContentSearch } from '@learner/utils/API/contentService';
import { searchAssessment } from '@learner/utils/API/AssesmentService';
import { TenantName } from '@learner/utils/app.constant';
import {
  AssessmentAttemptCardData,
  mapAttemptCards,
  TOTAL_ATTEMPT_SLOTS,
} from '@learner/utils/helpers/assessmentAttemptHelpers';
import { checkUserHasActiveBatch } from '@learner/utils/helpers/cohortAssignmentHelper';
import { useSharedAccordionState } from '@learner/utils/hooks/useSharedAccordionState';
import AttemptAssessmentButton from '@learner/components/AttemptAssessmentButton/AttemptAssessmentButton';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error' | 'notApplicable';

type PillVariant = 'completed' | 'notAttempted';

interface AssessmentAttemptsProps {
  onVisibilityChange?: (isVisible: boolean) => void;
}

const AssessmentAttempts: React.FC<AssessmentAttemptsProps> = ({
  onVisibilityChange,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { customColors } = theme.palette;
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useSharedAccordionState();
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [attemptCards, setAttemptCards] = useState(mapAttemptCards([]));
  const [completedCount, setCompletedCount] = useState(0);
  const [isBatchAssigned, setIsBatchAssigned] = useState(false);

  const loadAssessmentAttempts = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const userProgram = localStorage.getItem('userProgram');
    if (userProgram !== TenantName.SECOND_CHANCE_PROGRAM) {
      setLoadState('notApplicable');
      return;
    }

    const uiConfig = JSON.parse(localStorage.getItem('uiConfig') || '{}');
    const isRegistrationTestEnabled =
      uiConfig?.RegisterationTest === true ||
      uiConfig?.RegisterationTest === 'true';

    if (!isRegistrationTestEnabled) {
      setLoadState('notApplicable');
      return;
    }

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      setLoadState('notApplicable');
      return;
    }

    setLoadState('loading');

    try {
      const programFilter = [userProgram, 'Second Chance'];
      const preferredLanguage = localStorage.getItem('preferred_language');

      const [response, hasActiveBatch] = await Promise.all([
        ContentSearch({
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
        }),
        checkUserHasActiveBatch(storedUserId),
      ]);

      const identifier = response?.result?.QuestionSet?.[0]?.identifier;
      if (!identifier) {
        setLoadState('notApplicable');
        return;
      }

      const result = await searchAssessment({
        userId: storedUserId,
        courseId: identifier,
        unitId: identifier,
        contentId: identifier,
      });

      const attempts = Array.isArray(result) ? result : [];

      // A batch-assigned learner with no completed attempts has nothing to show —
      // hide the section entirely rather than a section with only locked/empty pills.
      if (hasActiveBatch && attempts.length === 0) {
        setLoadState('notApplicable');
        return;
      }

      setIsBatchAssigned(hasActiveBatch);
      setAttemptCards(mapAttemptCards(attempts));
      setCompletedCount(Math.min(attempts.length, TOTAL_ATTEMPT_SLOTS));
      setLoadState('loaded');
    } catch (error) {
      console.error('AssessmentAttempts: failed to load attempts', error);
      setLoadState('error');
    }
  }, []);

  useEffect(() => {
    loadAssessmentAttempts();
  }, [loadAssessmentAttempts, pathname]);

  useEffect(() => {
    if (loadState === 'idle') return;
    onVisibilityChange?.(loadState !== 'notApplicable');
  }, [loadState, onVisibilityChange]);

  if (loadState === 'idle' || loadState === 'notApplicable') {
    return null;
  }

  const accordionSx = {
    bgcolor: customColors.assessmentContainerBackground,
    border: `1px solid ${customColors.assessmentContainerBorder}`,
    borderRadius: '12px !important',
    width: '100%',
    flexGrow: 1,
    boxSizing: 'border-box',
    '&:before': { display: 'none' },
  };

  // Once batch-assigned, a partial (1/2) count is meaningless — the batch
  // already decided the learner's path, so only show the count once both
  // attempts are completed.
  const showCompletionCount =
    loadState === 'loaded' && (!isBatchAssigned || completedCount === attemptCards.length);

  const summary = (
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      sx={{
        px: { xs: 2, md: 2.5 },
        minHeight: 'auto',
        '& .MuiAccordionSummary-content': {
          my: 1,
          alignItems: 'baseline',
          gap: 1,
          flexWrap: 'wrap',
        },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '14px' }}>
        {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.TITLE')}
      </Typography>
      {showCompletionCount && (
        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '12px' }}>
          {completedCount} {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.OF')}{' '}
          {attemptCards.length}{' '}
          {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.COMPLETED_LOWERCASE')}
        </Typography>
      )}
    </AccordionSummary>
  );

  if (loadState === 'loading') {
    return (
      <Accordion
        expanded={isOpen}
        onChange={(_event, expanded) => setIsOpen(expanded)}
        disableGutters
        elevation={0}
        sx={accordionSx}
      >
        {summary}
        <AccordionDetails sx={{ px: { xs: 2, md: 2.5 }, pt: 0 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Skeleton variant="rounded" width={160} height={32} />
            <Skeleton variant="rounded" width={160} height={32} />
          </Stack>
        </AccordionDetails>
      </Accordion>
    );
  }

  if (loadState === 'error') {
    return (
      <Accordion
        expanded={isOpen}
        onChange={(_event, expanded) => setIsOpen(expanded)}
        disableGutters
        elevation={0}
        sx={accordionSx}
      >
        {summary}
        <AccordionDetails sx={{ px: { xs: 2, md: 2.5 }, pt: 0 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.LOAD_ERROR')}
          </Typography>
        </AccordionDetails>
      </Accordion>
    );
  }

  const pillStyles: Record<PillVariant, { bg: string; text: string }> = {
    completed: {
      bg: customColors.assessmentCompletedBadgeBg,
      text: customColors.assessmentCompletedBadgeText,
    },
    notAttempted: {
      bg: customColors.assessmentNotAttemptedBadgeBg,
      text: customColors.assessmentNotAttemptedBadgeText,
    },
  };

  // Trophy goes to the completed attempt with the highest score; ties break to
  // the latest completed attempt; no trophy at all if every completed score is 0.
  const completedAttempts = attemptCards.filter((attempt) => attempt.isAttempted);
  const highestScore = completedAttempts.reduce(
    (max, attempt) => Math.max(max, attempt.score ?? 0),
    0
  );
  const trophyAttemptNumber =
    highestScore > 0
      ? completedAttempts
          .filter((attempt) => (attempt.score ?? 0) === highestScore)
          .reduce((latest, attempt) =>
            attempt.attemptNumber > latest.attemptNumber ? attempt : latest
          ).attemptNumber
      : null;

  const renderAttemptPill = (attempt: AssessmentAttemptCardData) => {
    const variant: PillVariant = attempt.isAttempted ? 'completed' : 'notAttempted';
    const style = pillStyles[variant];

    const statusLabel = attempt.isAttempted
      ? t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.COMPLETED')
      : t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.NOT_ATTEMPTED');

    const StatusIcon = attempt.isAttempted ? CheckCircleIcon : VpnKeyIcon;

    return (
      <Stack
        key={attempt.attemptNumber}
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{
          bgcolor: style.bg,
          color: style.text,
          borderRadius: 5,
          px: 1.5,
          py: 0.75,
          flexWrap: 'wrap',
        }}
      >
        <StatusIcon sx={{ fontSize: '14px' }} />
        <Typography
          variant="body2"
          sx={{ fontWeight: 700, whiteSpace: 'nowrap', fontSize: '11px' }}
        >
          {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.ATTEMPT_LABEL')}{' '}
          {attempt.attemptNumber}
        </Typography>
        <Box
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            bgcolor: 'currentColor',
            opacity: 0.6,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, whiteSpace: 'nowrap', fontSize: '11px' }}
        >
          {statusLabel}
        </Typography>
        {attempt.isAttempted &&
          attempt.score !== null &&
          attempt.totalMaxScore !== null && (
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, whiteSpace: 'nowrap', fontSize: '11px' }}
            >
              {attempt.score}/{attempt.totalMaxScore}
            </Typography>
          )}
        {attempt.isAttempted &&
          attempt.attemptNumber === trophyAttemptNumber && (
            <EmojiEventsOutlinedIcon
              sx={{
                fontSize: '16px',
                color: style.text,
              }}
            />
          )}
      </Stack>
    );
  };

  const hasNextAttempt =
    !isBatchAssigned && completedCount < attemptCards.length;

  // Batch-assigned learners only ever see the attempts they've actually
  // completed — no locked/not-attempted chips, since those slots are moot
  // once a batch decides the learner's path forward.
  const visibleAttempts = isBatchAssigned
    ? attemptCards.filter((attempt) => attempt.isAttempted)
    : attemptCards;

  return (
    <Accordion
      expanded={isOpen}
      onChange={(_event, expanded) => setIsOpen(expanded)}
      disableGutters
      elevation={0}
      sx={accordionSx}
    >
      {summary}
      <AccordionDetails sx={{ px: { xs: 2, md: 2.5 }, pt: 0, pb: { xs: 2, md: 2.5 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          flexWrap="wrap"
          gap={1.25}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            flexWrap="wrap"
            gap={1}
          >
            {visibleAttempts.map((attempt) => renderAttemptPill(attempt))}
          </Stack>

          {hasNextAttempt && <AttemptAssessmentButton />}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default AssessmentAttempts;
