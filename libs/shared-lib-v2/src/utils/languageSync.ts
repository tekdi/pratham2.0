// Keeps the active next-i18next language in sync with localStorage instead
// of the URL locale segment.
//
// Why: several routes (scp-teacher-repo, youthnet, mfe_workspace, ...) are
// served through a same-origin reverse proxy (see apps/*/src/middleware.ts)
// as a *separate* Next.js app with its own next-i18next instance. The proxy
// forwards the bare, locale-less path, so URL-based locale routing can never
// reach these apps — the only thing that survives the hop is localStorage.

const LANGUAGE_STORAGE_KEY = 'lang';
const LEGACY_LANGUAGE_STORAGE_KEY = 'preferredLanguage';
const NAMESPACE = 'common';

export function getStoredLanguage(): string | null {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function storeLanguage(lang: string) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    localStorage.setItem(LEGACY_LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // localStorage unavailable (e.g. private mode) — nothing to persist
  }
}

/**
 * Switches the given i18next instance to `lang`, fetching that language's
 * translation bundle from this app's own `/public/locales` first if it
 * hasn't been loaded yet (e.g. because SSR only ever loads the default
 * locale once URL-based locale switching is no longer in use).
 *
 * `basePath` must be the app's configured Next.js `basePath` (from
 * `router.basePath`) — several proxied apps (scp-teacher-repo, youthnet,
 * mfe_workspace) serve every asset, including `/public`, under that prefix,
 * so a bare `/locales/...` fetch 404s inside them.
 */
export async function applyLanguage(
  i18n: any,
  lang: string,
  basePath = ''
): Promise<void> {
  if (!lang || !i18n || lang === i18n.language) return;

  if (!i18n.hasResourceBundle(lang, NAMESPACE)) {
    try {
      const res = await fetch(`${basePath}/locales/${lang}/${NAMESPACE}.json`);
      if (!res.ok) return;
      const data = await res.json();
      i18n.addResourceBundle(lang, NAMESPACE, data, true, true);
    } catch {
      return;
    }
  }

  await i18n.changeLanguage(lang);
}
