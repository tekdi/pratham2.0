import { ContentSearch, hierarchyAPI } from './API/contentService';
import type { SiteConfig } from './seo';

// Every public course, unit and content URL. Composite search does paginate, so
// the full course list is reachable; hierarchy lookups then supply the children.

const PAGE_SIZE = 200;
const MAX_COURSES = 5000;
/** Hierarchy lookups run in parallel batches so a rebuild stays quick. */
const CONCURRENCY = 8;

// The route reads headers(), which makes it dynamic, so `export const revalidate`
// never applies and every request would walk every course (~2,000 upstream calls
// on production). Cache the result here instead, per site, and stop walking once
// the budget is spent so a crawler can never hold the request open indefinitely.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const TIME_BUDGET_MS = 20_000;

const cache = new Map<string, { at: number; entries: SitemapEntry[] }>();

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

async function inBatches<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>,
  deadline: number
) {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    // Partial coverage beats a timed-out response: Google keeps the URLs it
    // already has and picks up the rest on the next fetch.
    if (Date.now() > deadline) break;
    const slice = items.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(slice.map(worker))));
  }
  return results;
}

export async function collectContentEntries(
  site: SiteConfig
): Promise<SitemapEntry[]> {
  const cached = cache.get(site.key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.entries;
  }

  const deadline = Date.now() + TIME_BUDGET_MS;
  const entries: SitemapEntry[] = [];

  let courses: any[] = [];
  try {
    courses = await fetchAllCourses(site);
  } catch {
    // Search unavailable: the caller still publishes the static pages. Not cached,
    // so the next request retries instead of serving an empty sitemap all day.
    return entries;
  }

  const trees = await inBatches(courses, async (course: any) => {
    try {
      const tree = await hierarchyAPI(course.identifier);
      return isContent(tree) ? tree : null;
    } catch {
      return null;
    }
  }, deadline);

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

  // Only cache a real result: an empty list means search failed or the budget ran
  // out before the first batch, and we should retry on the next request.
  if (entries.length) {
    cache.set(site.key, { at: Date.now(), entries });
  }

  return entries;
}
