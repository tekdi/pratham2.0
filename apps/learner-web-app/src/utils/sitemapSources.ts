import { ContentSearch, hierarchyAPI } from './API/contentService';
import type { SiteConfig } from './seo';

// Every public course, unit and content URL. Composite search does paginate, so
// the full course list is reachable; hierarchy lookups then supply the children.

const PAGE_SIZE = 200;
const MAX_COURSES = 5000;
/** Hierarchy lookups run in parallel batches so a rebuild stays quick. */
const CONCURRENCY = 8;

const COLLECTION_MIME = 'application/vnd.ekstep.content-collection';

export interface SitemapEntry {
  path: string;
  lastModified?: string;
  changeFrequency: 'weekly' | 'monthly';
  priority: number;
}

const lastModifiedOf = (node: any): string | undefined =>
  node?.lastPublishedOn || node?.lastUpdatedOn || undefined;

// hierarchyAPI swallows errors and returns { error }, so check for a real node.
const isContent = (value: any) => Boolean(value?.identifier);

async function fetchAllCourses(site: SiteConfig) {
  const courses: any[] = [];
  let offset = 0;

  while (offset < MAX_COURSES) {
    const response: any = await ContentSearch({
      filters: {
        primaryCategory: ['Course'],
        status: ['Live'],
        ...(site.programFilter ? { program: [site.programFilter] } : {}),
      },
      fields: ['identifier', 'name', 'lastPublishedOn', 'lastUpdatedOn'],
      limit: PAGE_SIZE,
      offset,
    });

    const batch: any[] = response?.result?.content ?? [];
    const total = Number(response?.result?.count) || 0;
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

export async function collectContentEntries(
  site: SiteConfig
): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];

  let courses: any[] = [];
  try {
    courses = await fetchAllCourses(site);
  } catch {
    // Search unavailable: the caller still publishes the static pages.
    return entries;
  }

  const trees = await inBatches(courses, async (course: any) => {
    try {
      const tree = await hierarchyAPI(course.identifier);
      return isContent(tree) ? tree : null;
    } catch {
      return null;
    }
  });

  for (const course of trees) {
    if (!course) continue;

    const coursePath = `${site.coursePathBase}/${course.identifier}`;
    entries.push({
      path: coursePath,
      lastModified: lastModifiedOf(course),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const unit of course.children ?? []) {
      if (unit?.mimeType !== COLLECTION_MIME) continue;

      const unitPath = `${coursePath}/${unit.identifier}`;
      entries.push({
        path: unitPath,
        lastModified: lastModifiedOf(unit),
        changeFrequency: 'weekly',
        priority: 0.7,
      });

      for (const item of unit.children ?? []) {
        if (!item?.identifier || item.mimeType === COLLECTION_MIME) continue;
        entries.push({
          path: `${unitPath}/${item.identifier}`,
          lastModified: lastModifiedOf(item),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  }

  return entries;
}
