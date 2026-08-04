'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Chip,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockIcon from '@mui/icons-material/Lock';
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
import AttemptAssessmentButton from '@learner/components/AttemptAssessmentButton/AttemptAssessmentButton';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error' | 'notApplicable';

type BadgeVariant = 'completed' | 'bestScore' | 'latest' | 'notAttempted' | 'locked';

const AssessmentAttempts: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { customColors } = theme.palette;
  const pathname = usePathname();
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [attemptCards, setAttemptCards] = useState(mapAttemptCards([]));
  const [completedCount, setCompletedCount] = useState(0);

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

  if (loadState === 'idle' || loadState === 'notApplicable') {
    return null;
  }

  const containerSx = {
    bgcolor: customColors.assessmentContainerBackground,
    border: `1px solid ${customColors.assessmentContainerBorder}`,
    borderRadius: 3,
    mb: 2,
    overflow: 'hidden',
  };

  if (loadState === 'loading') {
    return (
      <Box sx={{ ...containerSx, p: { xs: 2, md: 2.5 } }}>
        <Skeleton variant="text" width={180} height={28} />
        <Stack spacing={1.5} mt={1.5}>
          <Skeleton variant="rounded" width="100%" height={48} />
          <Skeleton variant="rounded" width="100%" height={48} />
        </Stack>
      </Box>
    );
  }

  if (loadState === 'error') {
    return (
      <Box sx={{ ...containerSx, p: { xs: 2, md: 2.5 } }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.LOAD_ERROR')}
        </Typography>
      </Box>
    );
  }

  const renderBadge = (variant: BadgeVariant, label: string) => {
    const variantStyles: Record<
      BadgeVariant,
      { bg: string; text: string; icon: React.ReactElement }
    > = {
      completed: {
        bg: customColors.assessmentCompletedBadgeBg,
        text: customColors.assessmentCompletedBadgeText,
        icon: <CheckCircleIcon sx={{ fontSize: '14px !important' }} />,
      },
      bestScore: {
        bg: customColors.assessmentBestScoreBadgeBg,
        text: customColors.assessmentBestScoreBadgeText,
        icon: <EmojiEventsIcon sx={{ fontSize: '14px !important' }} />,
      },
      latest: {
        bg: customColors.assessmentLatestBadgeBg,
        text: customColors.assessmentLatestBadgeText,
        icon: <AutorenewIcon sx={{ fontSize: '14px !important' }} />,
      },
      notAttempted: {
        bg: customColors.assessmentNotAttemptedBadgeBg,
        text: customColors.assessmentNotAttemptedBadgeText,
        icon: <VpnKeyIcon sx={{ fontSize: '14px !important' }} />,
      },
      locked: {
        bg: customColors.assessmentLockedBadgeBg,
        text: customColors.assessmentLockedBadgeText,
        icon: <LockIcon sx={{ fontSize: '14px !important' }} />,
      },
    };
    const style = variantStyles[variant];

    return (
      <Chip
        label={label}
        icon={style.icon}
        size="small"
        sx={{
          bgcolor: style.bg,
          color: style.text,
          fontWeight: 600,
          fontSize: '12px',
          height: '24px',
          '& .MuiChip-icon': { color: style.text },
        }}
      />
    );
  };

  const renderAttemptRow = (attempt: AssessmentAttemptCardData, index: number) => {
    const isNextAttempt =
      !attempt.isAttempted && !attempt.isLocked && index === completedCount;

    const scoreDisplay =
      attempt.isAttempted && attempt.score !== null && attempt.totalMaxScore !== null
        ? `${attempt.score}/${attempt.totalMaxScore}`
        : '--';

    return (
      <Box
        key={attempt.attemptNumber}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1.5,
          py: 1.5,
          px: { xs: 2, md: 2.5 },
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems="center"
          flexWrap="wrap"
          rowGap={0.5}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 700, color: theme.palette.text.primary, whiteSpace: 'nowrap' }}
          >
            {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.ATTEMPT_LABEL')}{' '}
            {attempt.attemptNumber}
          </Typography>

          {attempt.isAttempted &&
            renderBadge('completed', t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.COMPLETED'))}
          {!attempt.isAttempted &&
            attempt.isLocked &&
            renderBadge('locked', t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.LOCKED'))}
          {!attempt.isAttempted &&
            !attempt.isLocked &&
            renderBadge(
              'notAttempted',
              t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.NOT_ATTEMPTED')
            )}

          {attempt.isAttempted && attempt.date && (
            <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
              {attempt.date}
            </Typography>
          )}

          {attempt.isAttempted && (attempt.isBestScore || attempt.isLatest) && (
            <Stack direction="row" spacing={0.75} flexWrap="wrap" rowGap={0.5}>
              {attempt.isBestScore &&
                renderBadge('bestScore', t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.BEST_SCORE'))}
              {attempt.isLatest &&
                renderBadge('latest', t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.LATEST'))}
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 700,
              minWidth: '48px',
              whiteSpace: 'nowrap',
              textAlign: 'right',
              color: attempt.isAttempted
                ? customColors.assessmentScoreText
                : customColors.assessmentNotAttemptedText,
            }}
          >
            {scoreDisplay}
          </Typography>

          {isNextAttempt && <AttemptAssessmentButton />}
          {!isNextAttempt && attempt.isLocked && (
            <Typography
              variant="caption"
              sx={{ color: customColors.assessmentNotAttemptedText, whiteSpace: 'nowrap' }}
            >
              {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.AFTER_ATTEMPT_PREFIX')}{' '}
              {attempt.attemptNumber - 1}
            </Typography>
          )}
        </Stack>
      </Box>
    );
  };

  return (
    <Box sx={containerSx}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          px: { xs: 2, md: 2.5 },
          py: 1.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '16px' }}>
          {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.TITLE')}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {completedCount} {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.OF')}{' '}
          {attemptCards.length}{' '}
          {t('LEARNER_APP.COURSE.ASSESSMENT_ATTEMPTS.COMPLETED_LOWERCASE')}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: customColors.assessmentRowDivider }} />
      {attemptCards.map((attempt, index) => (
        <React.Fragment key={attempt.attemptNumber}>
          {index > 0 && <Divider sx={{ borderColor: customColors.assessmentRowDivider }} />}
          {renderAttemptRow(attempt, index)}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default AssessmentAttempts;
