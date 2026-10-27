import { ContentSearch, fetchContent, hierarchyAPI } from './contentService';
import {
  buildBreadcrumbJsonLd,
  buildCourseJsonLd,
  buildOrganizationJsonLd,
  buildVideoJsonLd,
  buildWebSiteJsonLd,
} from '../seoJsonLd';

// Server-side data for the crawlable block rendered before the client app mounts.
// Every helper returns null on failure: SEO markup is additive and must never
// break a page that otherwise works.

export interface SeoLink {
  name: string;
  href: string;
}

export interface SeoBlockData {
  heading: string;
  description?: string;
  breadcrumbs?: SeoLink[];
  links?: SeoLink[];
  pagination?: {
    basePath: string;
    page: number;
    totalPages: number;
  };
  jsonLd?: (object | null)[];
}

const MAX_LINKS = 50;
export const PILLAR_PAGE_SIZE = 20;
// The search API serves deep offsets, but cap the crawlable range so a pillar
// cannot emit an unbounded number of paginated URLs.
const MAX_PILLAR_PAGES = 500;

const clean = (value?: string) =>
  (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// fetchContent/hierarchyAPI swallow errors and return the rejection, and an
// AxiosError has a `name`, so key off `identifier` to detect a real content item.
const isContent = (value: any) => Boolean(value?.identifier);

export async function getPillarSeoData(
  pillar: string,
  description?: string,
  page = 1
): Promise<SeoBlockData | null> {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  try {
    const res = await ContentSearch({
      // Mirrors the filters pos/List.tsx applies, so these links match the listing.
      filters: {
        se_domains: [`Learning for ${pillar}`],
        status: ['Live'],
        program: ['Open School'],
      },
      fields: ['name', 'identifier', 'description'],
      limit: PILLAR_PAGE_SIZE,
      offset: (safePage - 1) * PILLAR_PAGE_SIZE,
    });
    const items = res?.result?.content ?? [];
    const links = items
      .map((item: any) => ({
        name: clean(item?.name),
        href: `/pos/content/${item?.identifier}`,
      }))
      .filter((link: SeoLink) => link.name && link.href.length > 13);

    if (!links.length) return null;

    const total = Number(res?.result?.count) || links.length;
    const totalPages = Math.min(
      Math.ceil(total / PILLAR_PAGE_SIZE),
      MAX_PILLAR_PAGES
    );

    return {
      heading: `Learning for ${pillar}`,
      description: clean(description),
      links,
      jsonLd: [
        buildBreadcrumbJsonLd(
          [{ name: 'Home', href: '/pos' }],
          `Learning for ${pillar}`
        ),
      ],
      pagination: {
        basePath: `/pos/${pillar.toLowerCase()}`,
        page: safePage,
        totalPages,
      },
    };
  } catch {
    return null;
  }
}

// Static: the pillar set is fixed, so no API call is needed for the home block.
export function getHomeSeoData(heading: string, description?: string): SeoBlockData {
  return {
    heading,
    description: clean(description),
    links: [
      { name: 'Learning for School', href: '/pos/school' },
      { name: 'Learning for Work', href: '/pos/work' },
      { name: 'Learning for Life', href: '/pos/life' },
      { name: 'Programs', href: '/pos/program' },
      { name: 'About Us', href: '/pos/about-us' },
    ],
    jsonLd: [buildOrganizationJsonLd(), buildWebSiteJsonLd()],
  };
}

export async function getCourseSeoData(
  courseId: string
): Promise<SeoBlockData | null> {
  try {
    const course = await hierarchyAPI(courseId);
    if (!isContent(course)) return null;

    const links: SeoLink[] = [];
    for (const unit of course.children ?? []) {
      for (const resource of unit?.children ?? []) {
        if (!resource?.identifier) continue;
        links.push({
          name: clean(resource.name),
          href: `/pos/content/${courseId}/${unit.identifier}/${resource.identifier}`,
        });
      }
    }

    return {
      heading: clean(course.name),
      description: clean(course.description),
      breadcrumbs: buildBreadcrumbs(course),
      links: links.slice(0, MAX_LINKS),
      jsonLd: [
        buildBreadcrumbJsonLd(buildBreadcrumbs(course), clean(course.name)),
        buildCourseJsonLd(course, `/pos/content/${courseId}`),
      ],
    };
  } catch {
    return null;
  }
}

export async function getResourceSeoData(
  identifier: string
): Promise<SeoBlockData | null> {
  try {
    const resource = await fetchContent(identifier);
    if (!isContent(resource)) return null;

    return {
      heading: clean(resource.name),
      description: clean(resource.description),
      breadcrumbs: buildBreadcrumbs(resource),
      jsonLd: [
        buildBreadcrumbJsonLd(buildBreadcrumbs(resource), clean(resource.name)),
        buildVideoJsonLd(resource, `/pos/player/${identifier}`),
      ],
    };
  } catch {
    return null;
  }
}

// Home > Pillar > Subject, from the taxonomy fields the content API already returns.
function buildBreadcrumbs(item: any): SeoLink[] {
  const crumbs: SeoLink[] = [{ name: 'Home', href: '/pos' }];

  const domain = item?.se_domains?.[0];
  if (domain) {
    const pillar = String(domain).replace(/^Learning for\s*/i, '');
    crumbs.push({ name: clean(domain), href: `/pos/${pillar.toLowerCase()}` });
  }

  const subject = item?.se_subjects?.[0];
  if (subject) {
    crumbs.push({ name: clean(subject), href: `/pos/search?q=${encodeURIComponent(subject)}` });
  }

  return crumbs;
}
