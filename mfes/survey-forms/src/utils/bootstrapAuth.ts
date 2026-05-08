'use client';

const HANDOFF_KEY = '__survey_mfe_auth_handoff__';
const COOKIE_PREFIX = 'survey_auth_';
const AUTH_KEYS = ['token', 'refreshToken', 'userId', 'tenantId', 'tenantName', 'academicYearId', 'preferredLanguage'] as const;

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function clearCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0`;
}

/**
 * Seeds localStorage with auth data from scp-teacher-repo.
 *
 * Two mechanisms (tried in order):
 * 1. Cookies prefixed `survey_auth_*` — works cross-port on same hostname
 *    (local dev). Cookies do not include port in their scope, so localhost:4102
 *    and localhost:4115 share the same cookie jar. Cookies are cleared after reading.
 * 2. localStorage key `__survey_mfe_auth_handoff__` — fallback for same-origin
 *    production (both apps behind Nginx on same origin).
 */
export function bootstrapAuthFromUrl(): void {
  if (typeof window === 'undefined') return;

  // 1. Cookie-based handoff (cross-port local dev)
  const found: Array<string> = [];
  AUTH_KEYS.forEach((key) => {
    const val = getCookie(`${COOKIE_PREFIX}${key}`);
    if (val) {
      localStorage.setItem(key, val);
      found.push(`${COOKIE_PREFIX}${key}`);
    }
  });
  if (found.length > 0) {
    found.forEach(clearCookie);
    return;
  }

  // 2. localStorage key handoff (same-origin production)
  const raw = localStorage.getItem(HANDOFF_KEY);
  if (!raw) return;
  localStorage.removeItem(HANDOFF_KEY);
  try {
    const payload: Record<string, string> = JSON.parse(raw);
    Object.entries(payload).forEach(([key, value]) => {
      if (value) localStorage.setItem(key, value);
    });
  } catch {
    // Malformed payload — ignore
  }
}
