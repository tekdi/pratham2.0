'use client';

/**
 * Seeds localStorage from the auth handoff written by scp-teacher before
 * navigating here (cross-origin dev only). The key is deleted immediately
 * after reading so tokens are never left lingering.
 *
 * In production both apps share the same origin behind Nginx, so localStorage
 * is already shared and no handoff is needed.
 */
const HANDOFF_KEY = '__survey_mfe_auth_handoff__';

export function bootstrapAuthFromUrl(): void {
  if (typeof window === 'undefined') return;

  const raw = localStorage.getItem(HANDOFF_KEY);
  if (!raw) return;

  // Remove immediately — treat it as a one-time-use token
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
