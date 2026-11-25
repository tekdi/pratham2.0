import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, siteFromHeaders } from '@learner/utils/seo';

// Note: "Disallow: /pos/search" is deliberately omitted until the search-page
// noindex (F10) has been live 2-4 weeks, so Google can still see that directive.
export default function robots(): MetadataRoute.Robots {
  const site = siteFromHeaders(headers());

  // Not one of our hosts at all (another tenant domain) - keep it uncrawlable.
  if (!site) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  // Test hosts are crawlable on purpose. Every response carries
  // X-Robots-Tag: noindex, and a crawler has to fetch the page to see it.
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml', site.origin),
  };
}
