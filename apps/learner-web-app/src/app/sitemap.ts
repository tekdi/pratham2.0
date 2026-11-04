import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, isIndexableHost } from '@learner/utils/seo';
import { collectSitemapEntries } from '@learner/utils/sitemapSources';

// Rebuilt daily rather than per request: this walks every course hierarchy.
export const revalidate = 86400;

// Google rejects a sitemap over 50,000 URLs.
const MAX_URLS = 50000;

// lastModified comes from content metadata, never from the build time, or every
// rebuild tells Google the whole site changed.
const safeDate = (value?: string) => {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Never advertise production URLs from a dev, QA or other tenant host.
  if (!isIndexableHost(headers().get('host'))) {
    return [];
  }

  const entries = await collectSitemapEntries();

  return entries.slice(0, MAX_URLS).map((entry) => ({
    url: absoluteUrl(entry.path),
    lastModified: safeDate(entry.lastModified),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
