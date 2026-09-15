import { NextResponse } from 'next/server';

// Must match next-i18next.config.js `i18n.locales` — a locale-prefixed
// request (e.g. /hi/mfe_workspace) otherwise slips past the plain
// startsWith checks below and 404s instead of being rewritten.
const LOCALES = ['en', 'mr', 'hi', 'or', 'odi', 'tel', 'kan', 'tam', 'gu', 'ur'];
const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join('|')})(?=/|$)`);

export function middleware(request: { nextUrl: { clone: () => any } }) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname.replace(LOCALE_PREFIX, '') || '/';

  // Built as a plain URL, not a mutated NextURL clone — NextURL silently
  // re-prepends its own `.locale` onto `.pathname` when the rewrite target
  // is built off the clone, undoing the locale strip above.
  if (pathname.startsWith('/mfe_workspace')) {
    return NextResponse.rewrite(new URL(`http://localhost:4104${pathname}${url.search}`));
  }
  if (pathname.startsWith('/sbplayer')) {
    return NextResponse.rewrite(new URL(`http://localhost:4106${pathname}${url.search}`));
  }
  if (pathname.startsWith('/taxonomy-manager')) {
    return NextResponse.rewrite(new URL(`http://localhost:4105${pathname}${url.search}`));
  }

  return NextResponse.next();
}
