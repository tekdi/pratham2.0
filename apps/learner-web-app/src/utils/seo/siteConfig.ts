// 'other' covers every deployment of this app that is not an SEO target (PLP, LMP).
export type SiteVariant = 'pos' | 'thematic' | 'other';

// One build serves several products; this env var decides which one this
// deployment is. Unknown values must not fall back to a real site.
const raw = process.env.NEXT_PUBLIC_SITE_VARIANT;
const variant: SiteVariant =
  raw === 'pos' || raw === 'thematic' ? raw : 'other';

// Domain env vars carry a trailing slash; canonical URLs must not.
const stripSlash = (url = '') => url.replace(/\/+$/, '');

const DOMAIN: Record<SiteVariant, string> = {
  pos: stripSlash(process.env.NEXT_PUBLIC_POS_DOMAIN),
  thematic: stripSlash(process.env.NEXT_PUBLIC_THEMATIC_DOMAIN),
  other: '',
};

const SITE_DETAILS = {
  pos: {
    name: 'Pratham Open School',
    pathPrefix: '/pos',
    foreignPrefix: '/themantic',
    ogLocale: 'en_IN',
    defaultDescription:
      'Pratham Open School offers free learning videos, games, stories and reading material in 15 Indian languages for ages 1 to 18+.',
    defaultImage: '/images/home-page-banner.png',
  },
  thematic: {
    name: 'Experimento India',
    pathPrefix: '/themantic',
    foreignPrefix: '/pos',
    ogLocale: 'en_IN',
    defaultDescription:
      'Experimento India offers free hands-on science experiments and courses on energy, environment and health for schools and teachers.',
    defaultImage: '/images/image_ver.png',
  },
  other: {
    name: 'Pratham',
    pathPrefix: '/',
    foreignPrefix: '',
    ogLocale: 'en_IN',
    defaultDescription:
      'A platform for learners to learn and grow through educational content.',
    defaultImage: '/logo.png',
  },
} as const;

export const siteConfig = {
  variant,
  baseUrl: DOMAIN[variant],
  // Only the two SEO sites can ever be indexed, and only when switched on.
  allowIndexing:
    variant !== 'other' && process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'true',
};

export const SITE = SITE_DETAILS[variant];

// Absolute URL for canonical tags, OG tags and sitemap entries.
export const absoluteUrl = (path = '/') =>
  `${siteConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
