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
 *
 * Pass `skip: true` for routes that must always render in the default
 * locale regardless of what's stored (e.g. a login page with no language
 * switcher of its own).
 */
export function useLanguageFromStorage(options?: { skip?: boolean }) {
  const { i18n } = useTranslation();
  const { basePath } = useRouter();
  const skip = options?.skip ?? false;

  useEffect(() => {
    if (skip) return;
    const stored = getStoredLanguage();
    if (stored) applyLanguage(i18n, stored, basePath);

    // Navigating to another app (e.g. workspace) and back can restore this
    // page from the browser's back-forward cache instead of remounting it,
    // which skips the effect above and leaves whatever language was active
    // at the moment the user left — 'pageshow' with `persisted: true` is
    // the one signal that fires on a bfcache restore, so re-apply here too.
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;
      const current = getStoredLanguage();
      if (current) applyLanguage(i18n, current, basePath);
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [i18n, basePath, skip]);
}
