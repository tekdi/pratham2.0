import { getAcademicYear } from '@learner/utils/API/AcademicYearService';
import { getCohortList } from '@learner/utils/API/CohortService';

interface CohortRecord {
  type?: string;
  cohortStatus?: string;
  cohortMemberStatus?: string;
}

interface AcademicYearRecord {
  id?: string;
  isActive?: boolean;
}

// Module-scoped cache so the batch-assignment API check runs once per
// user+program combination per full page load/reload, not on every
// client-side route change within the SPA. Keyed by program too (not just
// userId) because a learner enrolled in multiple programs at once shares a
// single userId — caching by userId alone would leak one program's batch
// status into another's dashboard after an in-app program switch. A full
// reload re-executes this module and clears the cache; a route/program
// change that keeps the module alive reuses the in-flight/resolved promise
// only when the key still matches.
let cachedCheck: { key: string; promise: Promise<boolean> } | null = null;

export const checkUserHasActiveBatch = (
  userId: string,
  programKey: string
): Promise<boolean> => {
  const key = `${userId}:${programKey}`;
  if (cachedCheck?.key === key) {
    return cachedCheck.promise;
  }

  const promise = fetchUserHasActiveBatch(userId);
  cachedCheck = { key, promise };
  return promise;
};

const fetchUserHasActiveBatch = async (userId: string): Promise<boolean> => {
  const previousAcademicYearId = localStorage.getItem('academicYearId');

  try {
    const academicYearList = await getAcademicYear();
    const allAcademicYearIds = Array.isArray(academicYearList)
      ? academicYearList
          .map((year: AcademicYearRecord) => year?.id)
          .filter(Boolean)
      : [];

    for (const yearId of allAcademicYearIds) {
      localStorage.setItem('academicYearId', yearId as string);
      const cohortResponse = await getCohortList(userId, true, true);
      const hasBatch = Array.isArray(cohortResponse?.result)
        ? cohortResponse.result.some(
            (cohort: CohortRecord) =>
              cohort?.type === 'BATCH' && cohort?.cohortStatus === 'active'
          )
        : false;

      if (hasBatch) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('checkUserHasActiveBatch: failed to verify batch assignment', error);
    return false;
  } finally {
    if (previousAcademicYearId) {
      localStorage.setItem('academicYearId', previousAcademicYearId);
    } else {
      localStorage.removeItem('academicYearId');
    }
  }
};
