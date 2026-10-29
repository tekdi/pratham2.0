/**
 * Absolute session lifetime, counted from the moment the user logs in.
 *
 * Token refreshes do NOT extend it: once SESSION_TIMEOUT_MINUTES have passed since login the
 * user is sent back to the login screen, even if the access/refresh tokens are still valid.
 * Enforced by secureAuthInterceptor (on page load, every 30s, on tab focus and before every
 * token refresh).
 *
 * Only sessions started with `startSessionTimer()` are timed, so apps that never call it at
 * login are unaffected.
 */

/** Session lifetime in minutes: 3 days = 3 * 24 * 60 = 4320. */
export const SESSION_TIMEOUT_MINUTES = 2;

export const SESSION_START_KEY = 'sessionStartedAt';

const isBrowser = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

/** Call right after a successful login to (re)start the session clock. */
export const startSessionTimer = (): void => {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_START_KEY, String(Date.now()));
};

export const clearSessionTimer = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_START_KEY);
};

/** True when a timed session exists and has outlived SESSION_TIMEOUT_MINUTES. */
export const isSessionExpired = (): boolean => {
  if (!isBrowser()) return false;
  const startedAt = Number(localStorage.getItem(SESSION_START_KEY));
  if (!startedAt) return false;
  return Date.now() - startedAt >= SESSION_TIMEOUT_MINUTES * 60_000;
};
