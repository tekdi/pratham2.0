'use client';

import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'userProgram';

// Program switches (ProgramSwitchModal, etc.) frequently `router.push` to a
// landing page that is already the mounted route — e.g. Second Chance
// Program and Second Chance Program Pathways both land on /scp-dashboard —
// so Next.js does not remount the page and effects keyed only on `pathname`
// never re-run. Routing every write through `setUserProgram` notifies
// subscribers synchronously so program-scoped UI (Assessment Attempts, etc.)
// re-evaluates immediately, even without a route change.
const listeners = new Set<() => void>();

const getSnapshot = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEY);
};

const getServerSnapshot = (): string | null => null;

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
};

export const getUserProgram = (): string | null => getSnapshot();

export const setUserProgram = (value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, value);
  }
  listeners.forEach((listener) => listener());
};

// Reactive read of the currently selected program. Components gating or
// fetching program-specific dashboard data should use this instead of a raw
// `localStorage.getItem('userProgram')` so they re-render/re-fetch as soon as
// the user switches programs, regardless of whether the route changes.
export const useUserProgram = (): string | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
