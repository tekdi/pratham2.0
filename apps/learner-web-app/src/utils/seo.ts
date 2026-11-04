// Canonical origin for absolute SEO URLs (sitemap, robots, canonical, og:image).
// One build is deployed to POS, Experimento India and PLP/LMP, so everything here
// is resolved per deployment from NEXT_PUBLIC_SITE_VARIANT.

const FALLBACK_ORIGIN = 'https://www.prathamopenschool.org';

/** 'other' covers every deployment that is not an SEO target (PLP, LMP). */
export type SiteVariant = 'pos' | 'thematic' | 'other';

// 'themantic' is accepted too: the routes are /themantic, so that spelling is the
// natural guess. Getting it wrong would silently fall through to 'other' and leave
// the site with no sitemap and no canonicals.
const VARIANT_ALIASES: Record<string, SiteVariant> = {
  pos: 'pos',
  thematic: 'thematic',
  themantic: 'thematic',
};

const rawVariant = process.env.NEXT_PUBLIC_SITE_VARIANT?.trim().toLowerCase();
export const SITE_VARIANT: SiteVariant = VARIANT_ALIASES[rawVariant ?? ''] ?? 'other';

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

// The live site 301s non-www to www, so emit the www form to avoid a redirect hop.
// Only the production apex gets this: prepending www to a QA or dev subdomain
// invents a host that does not resolve (e.g. www.qa-pos.prathamdigital.org).
const PROD_APEX = 'prathamopenschool.org';
const toCanonicalHost = (url: string) =>
  url.replace(
    new RegExp(`^(https?://)${PROD_APEX}(/|$)`, 'i'),
    `$1www.${PROD_APEX}$2`
  );

const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const posDomain = process.env.NEXT_PUBLIC_POS_DOMAIN?.trim();
const thematicDomain = process.env.NEXT_PUBLIC_THEMATIC_DOMAIN?.trim();

const ORIGIN: Record<SiteVariant, string> = {
  pos: stripTrailingSlash(toCanonicalHost(posDomain || FALLBACK_ORIGIN)),
  thematic: stripTrailingSlash(thematicDomain || ''),
  // No origin for non-SEO deployments, so they cannot emit canonicals or a sitemap.
  other: '',
};

export const SITE_URL = stripTrailingSlash(explicitSiteUrl || ORIGIN[SITE_VARIANT]);

interface SiteDetails {
  name: string;
  /** Where this site's pages live, e.g. '/pos'. */
  pathPrefix: string;
  /** Where course ids hang off: POS nests under /pos/content, Experimento does not. */
  coursePathBase: string;
  /** The other site's prefix, which must never be indexed on this domain. */
  foreignPrefix: string;
  /** Hosts allowed to be crawled for this variant. */
  indexableHosts: string[];
  /**
   * Search filter that selects only this site's content. POS has none on purpose:
   * only 29 of 289 QA courses carry a `program` value, so filtering POS by
   * 'Open School' would drop roughly 260 courses from its sitemap.
   */
  programFilter?: string;
}

const DETAILS: Record<SiteVariant, SiteDetails> = {
  pos: {
    name: 'Pratham Open School',
    pathPrefix: '/pos',
    coursePathBase: '/pos/content',
    foreignPrefix: '/themantic',
    indexableHosts: ['prathamopenschool.org', 'www.prathamopenschool.org'],
  },
  thematic: {
    name: 'Experimento India',
    pathPrefix: '/themantic',
    coursePathBase: '/themantic',
    foreignPrefix: '/pos',
    indexableHosts: ['experimentoindia.prathamopenschool.org'],
    programFilter: 'Experimento India',
  },
  other: {
    name: 'Pratham',
    pathPrefix: '/',
    coursePathBase: '/content',
    foreignPrefix: '',
    indexableHosts: [],
  },
};

export const SITE = DETAILS[SITE_VARIANT];

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

// og:image/twitter:image must be absolute. metadataBase does not resolve these in
// this app, so build them here instead. Already-absolute CDN URLs pass through.
export const absoluteImage = (url?: string) => {
  const trimmed = (url || '').trim();
  if (!trimmed) return absoluteUrl('/logo.png');
  return /^https?:\/\//i.test(trimmed) ? trimmed : absoluteUrl(trimmed);
};

// This app also serves dev/QA and other tenant domains; those must stay out of the
// index or they compete with production. A variant with no hosts is never indexable.
export const isIndexableHost = (host?: string | null) =>
  !!host &&
  !!SITE_URL &&
  SITE.indexableHosts.includes(host.split(':')[0].trim().toLowerCase());

/** Path helpers so page code never hardcodes one site's prefix. */
export const coursePath = (courseId: string) =>
  `${SITE.coursePathBase}/${courseId}`;

export const unitPath = (courseId: string, unitId: string) =>
  `${coursePath(courseId)}/${unitId}`;

export const resourcePath = (
  courseId: string,
  unitId: string,
  identifier: string
) => `${unitPath(courseId, unitId)}/${identifier}`;
