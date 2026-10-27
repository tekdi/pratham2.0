import { ContentSearch, fetchContent, hierarchyAPI } from './contentService';

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
}

const MAX_LINKS = 50;

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
  description?: string
): Promise<SeoBlockData | null> {
  try {
    const res = await ContentSearch({
      filters: { se_domains: [`Learning for ${pillar}`], status: ['Live'] },
      fields: ['name', 'identifier', 'description'],
      limit: 20,
    });
    const items = res?.result?.content ?? [];
    const links = items
      .map((item: any) => ({
        name: clean(item?.name),
        href: `/pos/content/${item?.identifier}`,
      }))
      .filter((link: SeoLink) => link.name && link.href.length > 13);

    if (!links.length) return null;

    return {
      heading: `Learning for ${pillar}`,
      description: clean(description),
      links,
    };
  } catch {
    return null;
  }
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
