import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { hostFromHeaders, isIndexableHost } from '@learner/utils/seo';

// Paths from the old site that Google still holds. No old-id -> do_-id mapping
// exists, so they return 410 Gone, which drops them from the index faster than 404.
const GONE_PREFIXES = ['/catalog/'];
const GONE_PATHS = ['/readingcamp'];

// The V1 content player serves its own HTML from this domain (preview.html and
// youtube.html). Those are live app files, not old-site pages, so the extension
// rule below must not 404 them.
const LIVE_HTML_PREFIXES = ['/content/preview/'];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/sbplayer')) {
    url.hostname = 'localhost';
    url.port = '4108';
    return NextResponse.rewrite(url);
  }
  //forget-password
  if (url.pathname.startsWith('/forget-password')) {
    url.hostname = 'localhost';
    url.port = '4109';
    return NextResponse.rewrite(url);
  }

  const lowerPath = url.pathname.toLowerCase();

  // Duplicate of the homepage.
  if (lowerPath === '/index.html') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }

  const isGone =
    GONE_PATHS.includes(lowerPath) ||
    GONE_PREFIXES.some((prefix) => lowerPath.startsWith(prefix));
  if (isGone) {
    return new NextResponse(null, { status: 410 });
  }

  // Old-site page extensions. Deliberately narrow: a broad "has a dot" rule would
  // swallow real root files such as robots.txt, sitemap.xml, favicon.ico and sw.js.
  const isLiveHtml = LIVE_HTML_PREFIXES.some((prefix) =>
    lowerPath.startsWith(prefix)
  );
  if (!isLiveHtml && /\.(html?|php|aspx?|jsp)$/.test(lowerPath)) {
    return new NextResponse(null, { status: 404 });
  }

  const response = NextResponse.next();

  // Dev, QA and other tenant hosts share this app. robots.txt already disallows
  // them; this also drops anything Google has indexed from those hosts already.
  if (!isIndexableHost(hostFromHeaders(request.headers))) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}
