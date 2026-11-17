import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, siteForHost } from '@learner/utils/seo';
import { collectContentEntries } from '@learner/utils/sitemapSources';

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
  const site = siteForHost(headers().get('host'));

  // Never advertise production URLs from a dev, QA or other tenant host.
  if (!site) {
    return [];
  }

  const staticEntries = site.staticPaths.map(({ path, priority }) => ({
    url: absoluteUrl(path, site.origin),
    changeFrequency: 'weekly' as const,
    priority,
  }));

  const contentEntries = (await collectContentEntries(site))
    .slice(0, MAX_URLS - staticEntries.length)
    .map((entry) => ({
      url: absoluteUrl(entry.path, site.origin),
      lastModified: safeDate(entry.lastModified),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    }));

  return [...staticEntries, ...contentEntries];
}
