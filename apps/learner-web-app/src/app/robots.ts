import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, siteForHost } from '@learner/utils/seo';

// Note: "Disallow: /pos/search" is deliberately omitted until the search-page
// noindex (F10) has been live 2-4 weeks, so Google can still see that directive.
export default function robots(): MetadataRoute.Robots {
  const site = siteForHost(headers().get('host'));

  // Dev, QA and other tenant hosts serve this same app - keep them uncrawlable.
  if (!site) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

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
