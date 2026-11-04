import { ContentSearch, hierarchyAPI } from './API/contentService';
import { SITE, SITE_VARIANT, coursePath, resourcePath, unitPath } from './seo';

// Every public URL for this deployment. Composite search does paginate, so the
// full course list is reachable; hierarchy lookups then supply units and resources.

const PAGE_SIZE = 200;
const MAX_COURSES = 5000;
/** Hierarchy lookups run in parallel batches so a daily rebuild stays quick. */
const CONCURRENCY = 8;

export interface SitemapEntry {
  path: string;
  lastModified?: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

const STATIC_PATHS: Record<string, { path: string; priority: number }[]> = {
  pos: [
    { path: '/', priority: 1 },
    { path: '/pos', priority: 0.9 },
    { path: '/pos/school', priority: 0.8 },
    { path: '/pos/work', priority: 0.8 },
    { path: '/pos/life', priority: 0.8 },
    { path: '/pos/program', priority: 0.8 },
    { path: '/pos/about-us', priority: 0.3 },
    { path: '/pos/terms-and-conditions', priority: 0.3 },
  ],
  thematic: [
    { path: '/', priority: 1 },
    { path: '/themantic', priority: 0.9 },
  ],
};

const COLLECTION_MIME = 'application/vnd.ekstep.content-collection';

const lastModifiedOf = (node: any): string | undefined =>
  node?.lastPublishedOn || node?.lastUpdatedOn || undefined;

async function fetchAllCourses() {
  const courses: any[] = [];
  let offset = 0;

  while (offset < MAX_COURSES) {
    const response: any = await ContentSearch({
      filters: {
        primaryCategory: ['Course'],
        status: ['Live'],
        ...(SITE.programFilter ? { program: [SITE.programFilter] } : {}),
      },
      fields: ['identifier', 'name', 'lastPublishedOn', 'lastUpdatedOn'],
      limit: PAGE_SIZE,
      offset,
    });

    const batch: any[] = response?.result?.content ?? [];
    const total: number = Number(response?.result?.count) || 0;
    courses.push(...batch);

    if (batch.length === 0 || courses.length >= total) break;
    offset += PAGE_SIZE;
  }

  return courses;
}

async function inBatches<T, R>(items: T[], worker: (item: T) => Promise<R>) {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const slice = items.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(slice.map(worker))));
  }
  return results;
}

export async function collectSitemapEntries(): Promise<SitemapEntry[]> {
  // PLP, LMP and any other deployment are not SEO targets.
  if (SITE_VARIANT === 'other') return [];

  const entries: SitemapEntry[] = (STATIC_PATHS[SITE_VARIANT] ?? []).map(
    ({ path, priority }) => ({ path, changeFrequency: 'weekly', priority })
  );

  let courses: any[] = [];
  try {
    courses = await fetchAllCourses();
  } catch {
    // Search unavailable: publish the static pages rather than an empty sitemap.
    return entries;
  }

  const trees = await inBatches(courses, async (course: any) => {
    try {
      const tree: any = await hierarchyAPI(course.identifier);
      return tree?.identifier ? tree : null;
    } catch {
      return null;
    }
  });

  for (const course of trees) {
    if (!course) continue;

    entries.push({
      path: coursePath(course.identifier),
      lastModified: lastModifiedOf(course),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const unit of course.children ?? []) {
      if (unit?.mimeType !== COLLECTION_MIME) continue;

      entries.push({
        path: unitPath(course.identifier, unit.identifier),
        lastModified: lastModifiedOf(unit),
        changeFrequency: 'weekly',
        priority: 0.7,
      });

      for (const item of unit.children ?? []) {
        if (!item?.identifier || item.mimeType === COLLECTION_MIME) continue;
        entries.push({
          path: resourcePath(course.identifier, unit.identifier, item.identifier),
          lastModified: lastModifiedOf(item),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
