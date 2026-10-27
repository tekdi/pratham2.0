// Canonical origin for absolute SEO URLs (sitemap, robots, canonical, og:image).
// NEXT_PUBLIC_POS_DOMAIN is stored non-www with a trailing slash and is matched
// against tenant records elsewhere, so normalise here instead of changing it.

const FALLBACK_ORIGIN = 'https://www.prathamopenschool.org';

// Only these hosts may be crawled. This app also serves dev/QA and other tenant
// domains; those must stay out of the index or they compete with production.
const INDEXABLE_HOSTS = ['prathamopenschool.org', 'www.prathamopenschool.org'];

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

// The live site 301s non-www to www, so emit the www form to avoid a redirect hop.
const toCanonicalHost = (url: string) =>
  url.replace(/^(https?:\/\/)(?!www\.)/i, '$1www.');

const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const posDomain = process.env.NEXT_PUBLIC_POS_DOMAIN?.trim();

export const SITE_URL = stripTrailingSlash(
  explicitSiteUrl || toCanonicalHost(posDomain || FALLBACK_ORIGIN)
);

export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const isIndexableHost = (host?: string | null) =>
  !!host && INDEXABLE_HOSTS.includes(host.split(':')[0].trim().toLowerCase());
