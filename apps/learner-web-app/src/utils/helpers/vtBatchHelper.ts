import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { getCohortList } from '@learner/utils/API/CohortService';

export interface VtBatchCustomField {
  label?: string;
  type?: string;
  selectedValues?: Array<string | { id?: string; label?: string }>;
}

export interface VtBatch {
  cohortId?: string;
  cohortName?: string;
  type?: string;
  cohortStatus?: string;
  cohortMemberStatus?: string;
  customField?: VtBatchCustomField[];
  [key: string]: unknown;
}

// Vocational Training learners sit at `in_training` for as long as they are
// enrolled, where Second Chance learners sit at `active`. Both count as an
// active batch member — same rule as the mobile app's
// `useActiveBatchEligibility` (learner-app/src/utils/Helper/useActiveBatchEligibility.js).
const ACTIVE_MEMBER_STATUSES = ['active', 'in_training'];

const isActiveBatch = (cohort: VtBatch | undefined | null): boolean =>
  cohort?.type === 'BATCH' &&
  cohort?.cohortStatus === 'active' &&
  ACTIVE_MEMBER_STATUSES.includes(cohort?.cohortMemberStatus ?? '');

const findActiveBatch = (response: any): VtBatch | null => {
  if (!Array.isArray(response?.result)) return null;
  // Several active batches → first match, same as mobile's `cohort.find(...)`.
  return (response.result as VtBatch[]).find(isActiveBatch) ?? null;
};

interface CachedLookup {
  key: string;
  at: number;
  pending: boolean;
  promise: Promise<VtBatch | null>;
}

let cachedLookup: CachedLookup | null = null;

/**
 * Resolve the learner's active VT batch, or null.
 *
 * Deliberately NOT `checkUserHasActiveBatch` from cohortAssignmentHelper: that
 * one returns a bare boolean, ignores member status (so it would never see a VT
 * learner's `in_training`), and caches for the whole page load. It is used by the
 * SCP Assessment Attempts card and must keep behaving exactly as it does.
 *
 * The academic-year header is set by the axios interceptor from
 * `localStorage.academicYearId`, so covering other years means temporarily
 * rewriting that key. Because this runs on a 3-second poll, the currently
 * selected year is tried *first* without touching localStorage — the common case
 * therefore costs one request and mutates nothing. Only a miss falls back to
 * sweeping the remaining years, and the original value is always restored.
 *
 * @param maxAgeMs reuse a result younger than this (0 = always refetch). In-flight
 *                 requests are shared regardless, so a poll tick and a page mount
 *                 firing together never produce two calls.
 */
export const getActiveVtBatch = (
  userId: string,
  { maxAgeMs = 0, programKey = '' }: { maxAgeMs?: number; programKey?: string } = {}
): Promise<VtBatch | null> => {
  const key = `${userId}:${programKey}`;

  // A still-pending request is always shared, whatever maxAgeMs says: both the
  // nav item and the page body run this hook, so two pollers would otherwise
  // issue two /cohort/mycohorts calls per tick.
  if (
    cachedLookup?.key === key &&
    (cachedLookup.pending || Date.now() - cachedLookup.at <= maxAgeMs)
  ) {
    return cachedLookup.promise;
  }

  const promise = fetchActiveVtBatch(userId);
  const entry: CachedLookup = { key, at: Date.now(), pending: true, promise };
  cachedLookup = entry;
  promise.finally(() => {
    entry.pending = false;
    entry.at = Date.now();
  });
  return promise;
};

/** Drop the memoised batch — call after anything that can change enrolment. */
export const clearActiveVtBatchCache = () => {
  cachedLookup = null;
};

const fetchActiveVtBatch = async (userId: string): Promise<VtBatch | null> => {
  if (!userId || typeof window === 'undefined') return null;

  const currentAcademicYearId = localStorage.getItem('academicYearId');

  try {
    if (currentAcademicYearId) {
      const batch = findActiveBatch(await getCohortList(userId, true, true));
      if (batch) return batch;
    }

    const academicYearList = await getAcademicYear();
    const otherYearIds = (Array.isArray(academicYearList) ? academicYearList : [])
      .map((year: { id?: string }) => year?.id)
      .filter((id): id is string => Boolean(id) && id !== currentAcademicYearId);

    for (const yearId of otherYearIds) {
      localStorage.setItem('academicYearId', yearId);
      const batch = findActiveBatch(await getCohortList(userId, true, true));
      if (batch) return batch;
    }

    return null;
  } catch (error) {
    console.error('getActiveVtBatch: failed to resolve active batch', error);
    return null;
  } finally {
    if (currentAcademicYearId) {
      localStorage.setItem('academicYearId', currentAcademicYearId);
    } else {
      localStorage.removeItem('academicYearId');
    }
  }
};

/**
 * Question-set ids attached to the batch via its ASSESSMENTS custom field.
 * These are the only assessments a VT learner may see.
 */
export const extractAssessmentIds = (batch: VtBatch | null | undefined): string[] => {
  const field = batch?.customField?.find((item) => item?.label === 'ASSESSMENTS');
  const values = Array.isArray(field?.selectedValues) ? field?.selectedValues : [];
  return (values ?? [])
    .map((value) => (typeof value === 'string' ? value : value?.id))
    .filter((id): id is string => Boolean(id));
};
