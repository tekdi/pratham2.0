// Canonical origins for absolute SEO URLs (sitemap, robots, canonical, og:image).
// One build serves POS, Experimento India and other tenant domains, so the site is
// resolved from the request host rather than a per-deployment environment variable.

const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export interface SiteConfig {
  key: 'pos' | 'experimento';
  /** Hosts allowed to be crawled for this site. Anything else stays unindexed. */
  hosts: string[];
  /** Absolute origin used in canonical and sitemap URLs. */
  origin: string;
  /** Where course ids hang off: POS nests under /pos/content, Experimento does not. */
  coursePathBase: string;
  staticPaths: { path: string; priority: number }[];
  /**
   * Search filter selecting only this site's courses. POS has none on purpose:
   * most courses carry no `program` value, so filtering would drop almost all of them.
   */
  programFilter?: string;
}

// Production origins only. Dev and QA hosts are deliberately absent, so they never
// match and never serve a crawlable robots.txt or a populated sitemap.
const SITES: SiteConfig[] = [
  {
    key: 'pos',
    hosts: ['prathamopenschool.org', 'www.prathamopenschool.org'],
    origin: stripTrailingSlash(
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
        'https://www.prathamopenschool.org'
    ),
    coursePathBase: '/pos/content',
    staticPaths: [
      { path: '/', priority: 1 },
      { path: '/pos', priority: 0.9 },
      { path: '/pos/school', priority: 0.8 },
      { path: '/pos/work', priority: 0.8 },
      { path: '/pos/life', priority: 0.8 },
      { path: '/pos/program', priority: 0.8 },
      { path: '/pos/about-us', priority: 0.3 },
      { path: '/pos/terms-and-conditions', priority: 0.3 },
    ],
  },
  {
    key: 'experimento',
    hosts: ['experimentoindia.prathamopenschool.org'],
    origin: 'https://experimentoindia.prathamopenschool.org',
    coursePathBase: '/themantic',
    staticPaths: [
      { path: '/', priority: 1 },
      { path: '/themantic', priority: 0.9 },
    ],
    programFilter: 'Experimento India',
  },
];

const normaliseHost = (host?: string | null) =>
  (host ?? '').split(':')[0].trim().toLowerCase();

/** The site this request belongs to, or null when the host must not be indexed. */
export const siteForHost = (host?: string | null): SiteConfig | null => {
  const needle = normaliseHost(host);
  if (!needle) return null;
  return SITES.find((site) => site.hosts.includes(needle)) ?? null;
};

export const isIndexableHost = (host?: string | null) => !!siteForHost(host);

export const absoluteUrl = (path = '/', origin = SITES[0].origin) =>
  `${origin}${path.startsWith('/') ? path : `/${path}`}`;

/** POS origin. Kept for callers that run outside a request and cannot read the host. */
export const SITE_URL = SITES[0].origin;
