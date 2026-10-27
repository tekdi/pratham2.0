import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, isIndexableHost } from '@learner/utils/seo';

// Static and pillar pages only. Course and resource URLs need a paged bulk-listing
// endpoint from the content API (composite search is capped at result-page sizes).
const STATIC_PATHS = [
  { path: '/', priority: 1 },
  { path: '/pos', priority: 0.9 },
  { path: '/pos/school', priority: 0.8 },
  { path: '/pos/work', priority: 0.8 },
  { path: '/pos/life', priority: 0.8 },
  { path: '/pos/program', priority: 0.8 },
  { path: '/pos/about-us', priority: 0.3 },
  { path: '/pos/terms-and-conditions', priority: 0.3 },
];

// lastModified is omitted on purpose: it must come from content metadata, never
// from the build time, or every rebuild tells Google the whole site changed.
export default function sitemap(): MetadataRoute.Sitemap {
  // Never advertise production URLs from a dev, QA or other tenant host.
  if (!isIndexableHost(headers().get('host'))) {
    return [];
  }

  return STATIC_PATHS.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: 'weekly' as const,
    priority,
  }));
}
