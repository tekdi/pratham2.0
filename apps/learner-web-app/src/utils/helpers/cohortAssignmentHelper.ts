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

// Module-scoped cache so the batch-assignment API check runs once per full
// page load/reload, not on every client-side route change within the SPA.
// A full reload re-executes this module and clears the cache; a route change
// (which keeps the module alive) reuses the in-flight/resolved promise.
let cachedCheck: { userId: string; promise: Promise<boolean> } | null = null;

export const checkUserHasActiveBatch = (userId: string): Promise<boolean> => {
  if (cachedCheck?.userId === userId) {
    return cachedCheck.promise;
  }

  const promise = fetchUserHasActiveBatch(userId);
  cachedCheck = { userId, promise };
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
