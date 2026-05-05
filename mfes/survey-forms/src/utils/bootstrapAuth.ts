'use client';

/**
 * When survey-forms is opened via a redirect from scp-teacher, the parent app
 * appends auth data as query params so localStorage (which is per-origin) can
 * be seeded on this port.  Call this once at the entry page before any API
 * requests fire.
 *
 * Params bootstrapped: token, refreshToken, userId, tenantId, tenantName,
 * academicYearId, preferredLanguage.
 *
 * After seeding the params are stripped from the URL so they don't linger in
 * browser history.
 */
const BOOTSTRAP_KEYS = [
  'token',
  'refreshToken',
  'userId',
  'tenantId',
  'tenantName',
  'academicYearId',
  'preferredLanguage',
] as const;

export function bootstrapAuthFromUrl(): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  let seeded = false;

  BOOTSTRAP_KEYS.forEach((key) => {
    const value = params.get(key);
    if (value) {
      localStorage.setItem(key, value);
      params.delete(key);
      seeded = true;
    }
  });

  if (seeded) {
    const clean =
      params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
    window.history.replaceState({}, '', clean);
  }
}
