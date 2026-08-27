// Manager Dashboard UI state (filters, pagination, sort) — kept in a module-level singleton,
// same pattern as `useManagerDashboardData`'s cache, so it survives the full page
// remount that happens when navigating to the Employee Detail Page and back. Without this, every
// tab's filters/pagination reset to default on return because Next.js unmounts `ManagerDashboard`
// entirely on route change — plain `useState` inside that component doesn't survive that.
//
// Also mirrored into sessionStorage so a hard refresh doesn't clear the filters either — a plain
// in-memory singleton only survives client-side navigation, not a full reload. sessionStorage
// (not localStorage) is used deliberately: it clears when the tab closes, so filters don't leak
// into a different manager's session on the same browser.
//
// The module's initial `state` is always `INITIAL_STATE` (never read from sessionStorage at
// import time) so the very first client render matches the server-rendered HTML exactly — reading
// storage during module init would make the client's first paint reflect a persisted filter the
// server couldn't have known about, causing a hydration mismatch. Persisted state is instead
// applied after mount, inside `useEffect` (client-only, runs after hydration), guarded by
// `hasHydrated` so it only happens once regardless of how many components use this hook.
import { useEffect, useState } from 'react';
import { AttemptSortOrder, CourseListFilters, HighAttemptFilter } from '../utils/Interface';
import { DEFAULT_COURSE_LIST_FILTERS } from '../utils/app.config';

export interface ManagerDashboardUIState {
  courseFilters: CourseListFilters;
  currentCoursePage: number;
  selectedAttemptFilter: HighAttemptFilter;
  attemptSortOrder: AttemptSortOrder;
  teamFilters: CourseListFilters;
  teamCurrentPage: number;
  // My Team's "search by employee name" box, next to the Course Name filter — same persistence
  // needs as teamFilters/teamCurrentPage (survive the Employee Detail Page round-trip).
  teamSearchTerm: string;
  courseBreakdownFilters: CourseListFilters;
  courseBreakdownPage: number;
  // The JOB_FAMILY/PSU/EMP_GROUP filter row at the top of the page — same persistence needs as
  // every other filter here (survive the Employee Detail Page round-trip and a hard refresh).
  userFilterFamily: Record<string, string[]>;
}

const INITIAL_STATE: ManagerDashboardUIState = {
  courseFilters: { ...DEFAULT_COURSE_LIST_FILTERS },
  currentCoursePage: 1,
  selectedAttemptFilter: '3',
  attemptSortOrder: 'desc',
  teamFilters: { ...DEFAULT_COURSE_LIST_FILTERS },
  teamCurrentPage: 1,
  teamSearchTerm: '',
  courseBreakdownFilters: { ...DEFAULT_COURSE_LIST_FILTERS },
  courseBreakdownPage: 1,
  userFilterFamily: {},
};

const STORAGE_KEY = 'managerDashboardUIState';

const readPersistedState = (): ManagerDashboardUIState | null => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Spread over INITIAL_STATE (not the raw parsed value) so a shape change (a field added/
    // removed since the value was stored) can't leave a required field undefined.
    return { ...INITIAL_STATE, ...JSON.parse(raw) };
  } catch {
    return null;
  }
};

let state: ManagerDashboardUIState = INITIAL_STATE;
let hasHydrated = false;
const listeners = new Set<() => void>();

const publish = (patch: Partial<ManagerDashboardUIState>) => {
  state = { ...state, ...patch };
  if (typeof window !== 'undefined') {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage can fail (quota, private-browsing restrictions) — persistence is a nice-to-have
      // here, not a correctness requirement, so a failed write is silently ignored.
    }
  }
  listeners.forEach((listener) => listener());
};

/** Returns the current UI state plus a setter — same shape as `useState`, but backed by the
 * module-level singleton above instead of component-local state. */
export const useManagerDashboardUIState = (): [ManagerDashboardUIState, (patch: Partial<ManagerDashboardUIState>) => void] => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const listener = () => setTick((tick) => tick + 1);
    listeners.add(listener);

    if (!hasHydrated) {
      hasHydrated = true;
      const persisted = readPersistedState();
      if (persisted) publish(persisted);
    }

    return () => {
      listeners.delete(listener);
    };
  }, []);

  return [state, publish];
};
