import { SITE, absoluteUrl } from './siteConfig';

const PROVIDER = {
  '@type': 'Organization',
  name: 'Pratham Education Foundation',
  url: 'https://www.pratham.org',
};

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: absoluteUrl(SITE.pathPrefix),
  logo: absoluteUrl('/logo.png'),
  parentOrganization: PROVIDER,
});

export const webSiteJsonLd = (searchPath?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE.name,
  url: absoluteUrl(SITE.pathPrefix),
  ...(searchPath
    ? {
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${absoluteUrl(searchPath)}?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }
    : {}),
});

export type Crumb = { name: string; path: string };

export const breadcrumbJsonLd = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export type ListEntry = { name: string; path: string };

export const itemListJsonLd = (entries: ListEntry[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  numberOfItems: entries.length,
  itemListElement: entries.map((entry, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: entry.name,
    url: absoluteUrl(entry.path),
  })),
});

type CourseInput = {
  name: string;
  description?: string;
  path: string;
  image?: string;
  language?: string | string[];
  parts?: ListEntry[];
};

export const courseJsonLd = ({
  name,
  description,
  path,
  image,
  language,
  parts = [],
}: CourseInput) => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  ...(description ? { description } : {}),
  url: absoluteUrl(path),
  ...(image ? { image } : {}),
  provider: PROVIDER,
  isAccessibleForFree: true,
  ...(language ? { inLanguage: language } : {}),
  // Required by Google for Course results; this content is self-paced.
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: 'PT1H',
  },
  ...(parts.length
    ? {
        hasPart: parts.map((part) => ({
          '@type': 'Course',
          name: part.name,
          url: absoluteUrl(part.path),
          provider: PROVIDER,
          isAccessibleForFree: true,
        })),
      }
    : {}),
});

type ResourceInput = {
  name: string;
  description?: string;
  path: string;
  image?: string;
  mimeType?: string;
  language?: string | string[];
  contentUrl?: string;
};

// Video content earns a richer result as VideoObject; everything else is a
// generic LearningResource.
export const contentJsonLd = ({
  name,
  description,
  path,
  image,
  mimeType = '',
  language,
  contentUrl,
}: ResourceInput) => {
  const isVideo = mimeType.startsWith('video/') || mimeType.includes('youtube');

  return {
    '@context': 'https://schema.org',
    '@type': isVideo ? 'VideoObject' : 'LearningResource',
    name,
    ...(description ? { description } : {}),
    url: absoluteUrl(path),
    ...(image ? { thumbnailUrl: image, image } : {}),
    ...(isVideo && contentUrl ? { contentUrl } : {}),
    ...(language ? { inLanguage: language } : {}),
    isAccessibleForFree: true,
    learningResourceType: isVideo ? 'Video' : 'Learning activity',
    provider: PROVIDER,
  };
};
