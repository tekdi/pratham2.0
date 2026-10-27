import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { absoluteUrl, isIndexableHost } from '@learner/utils/seo';

// Note: "Disallow: /pos/search" is deliberately omitted until the search-page
// noindex (F10) has been live 2-4 weeks, so Google can still see that directive.
export default function robots(): MetadataRoute.Robots {
  // Dev, QA and other tenant hosts serve this same app - keep them uncrawlable.
  if (!isIndexableHost(headers().get('host'))) {
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
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
