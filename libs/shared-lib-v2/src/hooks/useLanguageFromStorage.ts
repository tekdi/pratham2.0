import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { applyLanguage, getStoredLanguage } from '../utils/languageSync';

/**
 * Makes this app's active i18next language follow localStorage('lang')
 * instead of the URL locale segment. Call once from `_app.tsx`.
 *
 * Needed for MFE routes proxied at the middleware level (scp-teacher-repo,
 * youthnet, mfe_workspace, ...): each is its own Next.js app with its own
 * i18next instance, reached via a fresh page load with no locale in the
 * forwarded URL, so localStorage is the only signal it can read.
 */
export function useLanguageFromStorage() {
  const { i18n } = useTranslation();
  const { basePath } = useRouter();

  useEffect(() => {
    const stored = getStoredLanguage();
    if (stored) applyLanguage(i18n, stored, basePath);
  }, [i18n, basePath]);
}
