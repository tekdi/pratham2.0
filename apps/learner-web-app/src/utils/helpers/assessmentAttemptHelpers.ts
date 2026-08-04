import { AssessmentRecord } from '@learner/utils/API/AssesmentService';

export const TOTAL_ATTEMPT_SLOTS = 2;

export interface AssessmentAttemptCardData {
  attemptNumber: number;
  isAttempted: boolean;
  score: number | null;
  totalMaxScore: number | null;
  percentage: number | null;
  date: string | null;
  isBestScore: boolean;
  isLatest: boolean;
  isLocked: boolean;
}

const getAttemptDateValue = (attempt: AssessmentRecord): number => {
  const dateStr = attempt?.lastAttemptedOn || attempt?.createdOn;
  const time = dateStr ? new Date(dateStr).getTime() : NaN;
  return Number.isNaN(time) ? 0 : time;
};

export const sortAttemptsByDate = (
  attempts: AssessmentRecord[]
): AssessmentRecord[] => {
  if (!Array.isArray(attempts)) {
    return [];
  }
  return [...attempts].sort(
    (a, b) => getAttemptDateValue(a) - getAttemptDateValue(b)
  );
};

export const getBestAttempt = (
  attempts: AssessmentRecord[]
): AssessmentRecord | null => {
  if (!Array.isArray(attempts) || attempts.length === 0) {
    return null;
  }
  return attempts.reduce((best, current) => {
    const bestScore = Number(best?.totalScore ?? -Infinity);
    const currentScore = Number(current?.totalScore ?? -Infinity);
    if (currentScore > bestScore) {
      return current;
    }
    if (
      currentScore === bestScore &&
      getAttemptDateValue(current) >= getAttemptDateValue(best)
    ) {
      return current;
    }
    return best;
  }, attempts[0]);
};

export const getLatestAttempt = (
  attempts: AssessmentRecord[]
): AssessmentRecord | null => {
  if (!Array.isArray(attempts) || attempts.length === 0) {
    return null;
  }
  return attempts.reduce((latest, current) =>
    getAttemptDateValue(current) >= getAttemptDateValue(latest)
      ? current
      : latest
  );
};

export const calculatePercentage = (
  score?: number | null,
  maxScore?: number | null
): number | null => {
  if (
    score === undefined ||
    score === null ||
    !maxScore ||
    Number.isNaN(Number(score)) ||
    Number.isNaN(Number(maxScore))
  ) {
    return null;
  }
  return Math.round((Number(score) / Number(maxScore)) * 100);
};

export const formatAttemptDate = (date?: string | null): string | null => {
  if (!date) {
    return null;
  }
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const mapAttemptCards = (
  attempts: AssessmentRecord[]
): AssessmentAttemptCardData[] => {
  const sortedAttempts = sortAttemptsByDate(attempts);
  const bestAttempt = getBestAttempt(sortedAttempts);
  const latestAttempt = getLatestAttempt(sortedAttempts);
  const allAttemptsCompleted = sortedAttempts.length === TOTAL_ATTEMPT_SLOTS;
  const hasNonZeroScore = sortedAttempts.some(
    (attempt) => Number(attempt.totalScore) > 0
  );
  const canShowBestScore = allAttemptsCompleted && hasNonZeroScore;

  return Array.from({ length: TOTAL_ATTEMPT_SLOTS }, (_, index) => {
    const attempt = sortedAttempts[index];
    if (!attempt) {
      return {
        attemptNumber: index + 1,
        isAttempted: false,
        score: null,
        totalMaxScore: null,
        percentage: null,
        date: null,
        isBestScore: false,
        isLatest: false,
        isLocked: index > 0 && !sortedAttempts[index - 1],
      };
    }

    return {
      attemptNumber: index + 1,
      isAttempted: true,
      score: attempt.totalScore ?? null,
      totalMaxScore: attempt.totalMaxScore ?? null,
      percentage: calculatePercentage(attempt.totalScore, attempt.totalMaxScore),
      date: formatAttemptDate(attempt.lastAttemptedOn || attempt.createdOn),
      isBestScore: canShowBestScore && !!bestAttempt && attempt === bestAttempt,
      isLatest: !!latestAttempt && attempt === latestAttempt,
      isLocked: false,
    };
  });
};

export const getCompletedAttemptsCount = (
  attempts: AssessmentRecord[]
): number => (Array.isArray(attempts) ? attempts.length : 0);
