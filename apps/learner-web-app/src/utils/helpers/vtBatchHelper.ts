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

let cachedLookup: { key: string; promise: Promise<VtBatch | null> } | null = null;

// Survives reloads so the lookup runs when the learner enters VT, not every
// page load. ProgramSwitchModal clears it, so re-entering VT re-checks.
export const VT_BATCH_STORAGE_KEY = 'vtActiveBatch';

const readStoredBatch = (key: string): { batch: VtBatch | null } | null => {
  try {
    const raw = localStorage.getItem(VT_BATCH_STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw);
    return stored?.key === key ? { batch: stored.batch ?? null } : null;
  } catch {
    return null;
  }
};

/**
 * Resolve the learner's active VT batch, or null.
 *
 * Deliberately NOT `checkUserHasActiveBatch` from cohortAssignmentHelper: that one
 * returns a bare boolean and ignores member status, so it would never see a VT
 * learner's `in_training`. It backs the SCP Assessment Attempts card, unchanged.
 */
export const getActiveVtBatch = (
  userId: string,
  {
    programKey = '',
    forceRefresh = false,
  }: { programKey?: string; forceRefresh?: boolean } = {}
): Promise<VtBatch | null> => {
  const key = `${userId}:${programKey}`;
  if (!forceRefresh && cachedLookup?.key === key) {
    return cachedLookup.promise;
  }

  const stored = forceRefresh ? null : readStoredBatch(key);
  if (stored) {
    const promise = Promise.resolve(stored.batch);
    cachedLookup = { key, promise };
    return promise;
  }

  const promise = fetchActiveVtBatch(userId).then((batch) => {
    try {
      localStorage.setItem(VT_BATCH_STORAGE_KEY, JSON.stringify({ key, batch }));
    } catch {
      // Storage unavailable (private mode / quota) — fall back to memory only.
    }
    return batch;
  });
  cachedLookup = { key, promise };
  return promise;
};

/** Drop the batch so the next VT visit re-checks. */
export const clearActiveVtBatchCache = () => {
  cachedLookup = null;
  try {
    localStorage.removeItem(VT_BATCH_STORAGE_KEY);
  } catch {
    // Ignore: nothing to clear if storage is unavailable.
  }
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
 * Read one custom field off the batch as a list of plain strings.
 * `selectedValues` entries are either bare strings or `{ id, label }` objects,
 * and which one arrives varies by field, so both are handled.
 */
const extractCustomFieldValues = (
  batch: VtBatch | null | undefined,
  label: string,
  prefer: 'label' | 'id' = 'label'
): string[] => {
  const field = batch?.customField?.find((item) => item?.label === label);
  const values = Array.isArray(field?.selectedValues) ? field?.selectedValues : [];
  return (values ?? [])
    .map((value) => {
      if (typeof value === 'string') return value;
      return prefer === 'id' ? value?.id ?? value?.label : value?.label ?? value?.id;
    })
    .filter((value): value is string => Boolean(value));
};

/**
 * The batch's SKILLS custom field (e.g. ["Sewing Machine Operator (SMO)"]).
 *
 * `skills` is the deepest level of the pos-framework taxonomy
 * (domain > subDomain > subject > skills) and courses expose it as `se_skills`,
 * so these values filter the L2 course catalogue directly.
 */
export const extractBatchSkills = (batch: VtBatch | null | undefined): string[] =>
  extractCustomFieldValues(batch, 'SKILLS');

/**
 * Question-set ids attached to the batch via its ASSESSMENTS custom field.
 * These are the only assessments a VT learner may see.
 */
export const extractAssessmentIds = (batch: VtBatch | null | undefined): string[] =>
  extractCustomFieldValues(batch, 'ASSESSMENTS', 'id');

/**
 * The batch's END_DATE custom field as `YYYY-MM-DD`, or null when unset.
 * Same label the admin Batch list reads (BatchFlow.tsx) and the same
 * `YYYY-MM-DD` string youthNet's batch form writes.
 */
export const extractBatchEndDate = (
  batch: VtBatch | null | undefined
): string | null => {
  const [value] = extractCustomFieldValues(batch, 'END_DATE');
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)
    ? value.slice(0, 10)
    : null;
};

const getTodayKey = (): string => {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

/**
 * True once the batch's end date has passed. The end date itself still counts
 * as in-batch, and a batch with no end date never ends. String comparison on
 * the date key, like CreateBatchModal's own past-date check — no timezone shift.
 */
export const isBatchEnded = (batch: VtBatch | null | undefined): boolean => {
  const endDate = extractBatchEndDate(batch);
  return Boolean(endDate && endDate < getTodayKey());
};
