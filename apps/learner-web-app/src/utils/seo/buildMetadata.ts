import type { Metadata } from 'next';
import { siteConfig, SITE, absoluteUrl } from './siteConfig';

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

const stripHtml = (value = '') =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;

// "Course Name | Pratham Open School", trimming the course name so the
// site name always survives.
const withSiteName = (pageTitle: string) => {
  // Avoid "Pratham Open School Home | Pratham Open School".
  if (pageTitle.toLowerCase().includes(SITE.name.toLowerCase())) {
    return truncate(pageTitle, TITLE_MAX);
  }
  const suffix = ` | ${SITE.name}`;
  const available = TITLE_MAX - suffix.length;
  if (available < 10) return truncate(pageTitle, TITLE_MAX);
  return `${truncate(pageTitle, available)}${suffix}`;
};

export type BuildMetadataInput = {
  title?: string;
  description?: string;
  image?: string;
  /** Path on this site, e.g. "/pos/content/do_123". */
  path?: string;
  type?: 'website' | 'article' | 'video.other';
  noindex?: boolean;
};

export function buildMetadata({
  title,
  description,
  image,
  path = '/',
  type = 'website',
  noindex = false,
}: BuildMetadataInput = {}): Metadata {
  const pageTitle = stripHtml(title);
  const fullTitle = pageTitle ? withSiteName(pageTitle) : SITE.name;

  const cleanDescription = truncate(
    stripHtml(description) || SITE.defaultDescription,
    DESCRIPTION_MAX
  );

  const ogImage = image || SITE.defaultImage;
  // Non-SEO deployments have no base URL, so they get no canonical.
  const canonical = siteConfig.baseUrl ? absoluteUrl(path) : undefined;
  const indexable = siteConfig.allowIndexing && !noindex;

  return {
    title: fullTitle,
    description: cleanDescription,
    ...(canonical ? { alternates: { canonical } } : {}),
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      title: fullTitle,
      description: cleanDescription,
      url: canonical,
      siteName: SITE.name,
      locale: SITE.ogLocale,
      type,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle || SITE.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: cleanDescription,
      images: [ogImage],
    },
  };
}
