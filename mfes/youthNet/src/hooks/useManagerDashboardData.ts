// Shared Manager Dashboard data layer — Users, Courses, and the Course Learning Summary are
// fetched once and reused by every Manager Dashboard page (Overview/Team/Courses tabs and the
// Employee Detail Page) instead of each page re-fetching independently. A module-level cache
// (rather than React Context) is enough here since Next.js pages remount fully on navigation —
// the cache simply survives across that remount for the lifetime of the tab/session, and resets
// naturally on a hard refresh (by design: the Employee Detail Page must fail safely, not silently
// show stale/incorrect zero data, when opened directly without the dashboard having loaded first).
import { useEffect, useState } from 'react';
import { fetchCourses } from '../services/PlayerService';
import { fetchUserList } from '../services/ManageUser';
import { getCourseLearningSummary } from '@shared-lib-v2/utils/CourseLearningSummaryService/courseLearningSummary';
import { Course, CourseLearningSummaryResult, ManagerTeamUser } from '../utils/Interface';
import { COURSE_CATALOGUE_FILTERS } from '../utils/app.config';

export interface ManagerDashboardData {
  users: ManagerTeamUser[];
  usersLoading: boolean;
  usersError: boolean;
  courses: Course[];
  coursesLoading: boolean;
  coursesError: boolean;
  courseLearningSummary: CourseLearningSummaryResult;
  summaryLoading: boolean;
  summaryError: boolean;
  // True once the initial load has settled (success or failure) — lets consumers distinguish
  // "still loading" from "never even started loading" (e.g. a direct URL hit on a page that
  // doesn't trigger its own fetch).
  hasLoaded: boolean;
}

const INITIAL_STATE: ManagerDashboardData = {
  users: [],
  usersLoading: true,
  usersError: false,
  courses: [],
  coursesLoading: true,
  coursesError: false,
  courseLearningSummary: {},
  summaryLoading: true,
  summaryError: false,
  hasLoaded: false,
};

let cache: ManagerDashboardData | null = null;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

const publish = (patch: Partial<ManagerDashboardData>) => {
  cache = { ...(cache ?? INITIAL_STATE), ...patch };
  listeners.forEach((listener) => listener());
};

const loadManagerDashboardData = (): Promise<void> => {
  if (inFlight) return inFlight;

  inFlight = (async () => {
    let fetchedUsers: ManagerTeamUser[] = [];
    try {
      const managerUserId = typeof window !== 'undefined' ? localStorage.getItem('managrUserId') : null;
      if (managerUserId) {
        const response = await fetchUserList({ filters: { emp_manager: managerUserId, role: 'Learner' } });
        fetchedUsers = response?.getUserDetails || [];
      }
      publish({ users: fetchedUsers, usersLoading: false, usersError: false });
    } catch (error) {
      console.error('Error fetching users:', error);
      publish({ usersLoading: false, usersError: true });
    }

    let fetchedCourses: Course[] = [];
    try {
      fetchedCourses = await fetchCourses({ filters: COURSE_CATALOGUE_FILTERS });
      publish({ courses: fetchedCourses, coursesLoading: false, coursesError: false });
    } catch (error) {
      console.error('Error fetching courses:', error);
      publish({ coursesLoading: false, coursesError: true });
    }

    const userIds = fetchedUsers.map((user) => user.userId).filter(Boolean);
    const courseIds = fetchedCourses.map((course) => course.identifier).filter(Boolean);
    if (userIds.length === 0 || courseIds.length === 0) {
      publish({ summaryLoading: false, hasLoaded: true });
      return;
    }

    try {
      const response = await getCourseLearningSummary({ courseId: courseIds, userId: userIds });
      publish({ courseLearningSummary: response.result, summaryLoading: false, summaryError: false, hasLoaded: true });
    } catch (error) {
      console.error('Error fetching course learning summary:', error);
      publish({ summaryLoading: false, summaryError: true, hasLoaded: true });
    }
  })();

  return inFlight;
};

/**
 * Reads the shared Manager Dashboard data cache. Pass `fetchIfMissing: false` (the Employee
 * Detail Page's usage) to only ever read the existing cache and never trigger a fetch of its own —
 * per the "no API calls from the Employee Detail Page" requirement, it relies entirely on the
 * Overview/Team/Courses tabs (or a prior visit) having populated the cache already.
 */
export const useManagerDashboardData = (options?: { fetchIfMissing?: boolean }): ManagerDashboardData => {
  const fetchIfMissing = options?.fetchIfMissing ?? true;
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((tick) => tick + 1);
    listeners.add(listener);
    if (fetchIfMissing && !cache && !inFlight) {
      loadManagerDashboardData();
    }
    return () => {
      listeners.delete(listener);
    };
  }, [fetchIfMissing]);

  return cache ?? INITIAL_STATE;
};
