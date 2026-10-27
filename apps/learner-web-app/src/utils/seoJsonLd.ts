import { SITE_URL, absoluteUrl } from './seo';

// JSON-LD builders. Every builder emits only what the page genuinely qualifies for —
// a missing field means the property (or the whole node) is left out, never guessed.

const ORG_NAME = 'Pratham Open School';

// Taken from the live links in components/pos/Footer.tsx, not invented.
const SOCIAL_PROFILES = [
  'https://www.facebook.com/PrathamEducationFoundation',
  'https://x.com/Pratham_India',
  'https://www.instagram.com/prathameducation',
  'https://www.linkedin.com/company/pratham/',
  'https://www.youtube.com/@PrathamEducationFoundation',
];

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/x-youtube'];

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    sameAs: SOCIAL_PROFILES,
  };
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORG_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/pos/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function buildBreadcrumbJsonLd(
  crumbs: { name: string; href: string }[],
  currentName?: string
) {
  const trail = [...crumbs];
  if (currentName) trail.push({ name: currentName, href: '' });
  if (trail.length < 2) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      ...(crumb.href ? { item: absoluteUrl(crumb.href) } : {}),
    })),
  };
}

// Google requires name, thumbnailUrl, uploadDate and a description for VideoObject.
// Returns null unless all are present, per R11.
export function buildVideoJsonLd(item: any, canonicalPath: string) {
  if (!VIDEO_MIME_TYPES.includes(item?.mimeType)) return null;

  const thumbnailUrl = item?.posterImage || item?.appIcon;
  const uploadDate = item?.lastPublishedOn || item?.createdOn;
  if (!thumbnailUrl || !uploadDate || !item?.name) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: String(item.name).trim(),
    description: String(item.description || item.name).trim(),
    thumbnailUrl,
    uploadDate,
    ...(item?.artifactUrl ? { contentUrl: item.artifactUrl } : {}),
    ...(item?.contentLanguage ? { inLanguage: item.contentLanguage } : {}),
    url: absoluteUrl(canonicalPath),
  };
}

export function buildCourseJsonLd(item: any, canonicalPath: string) {
  if (item?.primaryCategory !== 'Course' || !item?.name) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: String(item.name).trim(),
    ...(item?.description
      ? { description: String(item.description).trim() }
      : {}),
    url: absoluteUrl(canonicalPath),
    ...(item?.contentLanguage ? { inLanguage: item.contentLanguage } : {}),
    provider: {
      '@type': 'Organization',
      name: ORG_NAME,
      sameAs: SITE_URL,
    },
  };
}
