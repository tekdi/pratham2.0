import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@learner/utils/seo/siteConfig';
import { collectSitemapEntries } from '@learner/utils/seo/sitemapSources';

// Rebuilt once a day, so a crawl never triggers the full hierarchy walk.
export const revalidate = 86400;

// A sitemap file may hold at most 50,000 URLs.
const MAX_URLS = 50000;

// An unparseable API date would otherwise render as "Invalid Date".
const safeDate = (value?: string) => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await collectSitemapEntries();

  if (entries.length > MAX_URLS) {
    console.warn(
      `[sitemap] ${entries.length} URLs exceeds the ${MAX_URLS} limit; split into a sitemap index.`
    );
  }

  return entries.slice(0, MAX_URLS).map((entry) => {
    const lastModified = safeDate(entry.lastModified);
    return {
      url: absoluteUrl(entry.path),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    };
  });
}
