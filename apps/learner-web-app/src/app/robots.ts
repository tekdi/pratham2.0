import type { MetadataRoute } from 'next';
import { siteConfig, SITE } from '@learner/utils/seo/siteConfig';

// Googlebot needs these to render the page; blocking them breaks indexing.
const ASSET_PATHS = [
  '/_next/static/',
  '/images/',
  '/files/',
  '/knowledge/',
  '/assets/',
];

export default function robots(): MetadataRoute.Robots {
  // Non-SEO deployments (PLP, LMP) and every non-production build.
  if (!siteConfig.allowIndexing || !siteConfig.baseUrl) {
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      {
        userAgent: '*',
        // Allowlist, because one build also serves PLP and the other site:
        // anything outside this site's own tree belongs to another product.
        // '/$' is the domain root, which the proxy maps to this site's home.
        allow: ['/$', SITE.pathPrefix, ...ASSET_PATHS],
        disallow: '/',
      },
    ],
    sitemap: `${siteConfig.baseUrl}/sitemap.xml`,
    host: siteConfig.baseUrl,
  };
}
