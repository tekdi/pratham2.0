import { ContentSearch, hierarchyAPI } from '../API/contentService';
import { siteConfig } from './siteConfig';
import { childrenOf, isCollection } from './contentData';

const PAGE_SIZE = 200;
const MAX_COURSES = 5000;
/** Hierarchy lookups run in parallel batches so a daily rebuild stays quick. */
const CONCURRENCY = 8;

export type SitemapEntry = {
  path: string;
  lastModified?: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
};

const STATIC_PATHS: Record<string, string[]> = {
  pos: [
    '/pos',
    '/pos/search',
    '/pos/about-us',
    '/pos/school',
    '/pos/work',
    '/pos/life',
    '/pos/program',
    '/pos/terms-and-conditions',
  ],
  thematic: ['/themantic', '/themantic/search'],
};

/** POS nests content under /pos/content; Experimento hangs it off the root. */
const coursePathBase = () =>
  siteConfig.variant === 'thematic' ? '/themantic' : '/pos/content';

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
        ...(siteConfig.variant === 'thematic'
          ? { program: 'Experimento India' }
          : {}),
      },
      fields: ['identifier', 'name', 'lastPublishedOn', 'lastUpdatedOn'],
      limit: PAGE_SIZE,
      offset,
    });

    const batch: any[] = response?.result?.content ?? [];
    const total: number = response?.result?.count ?? 0;
    courses.push(...batch);

    if (batch.length === 0 || courses.length >= total) break;
    offset += PAGE_SIZE;
  }

  return courses;
}

async function inBatches<T, R>(
  items: T[],
  worker: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const slice = items.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(slice.map(worker))));
  }
  return results;
}

/**
 * Every public URL for this deployment: static pages, courses, units and
 * content. Non-SEO deployments (PLP, LMP) get nothing.
 */
export async function collectSitemapEntries(): Promise<SitemapEntry[]> {
  if (!siteConfig.allowIndexing || !siteConfig.baseUrl) return [];

  const base = coursePathBase();

  const entries: SitemapEntry[] = (STATIC_PATHS[siteConfig.variant] ?? []).map(
    (path) => ({
      path,
      changeFrequency: 'weekly',
      priority: path.split('/').length <= 2 ? 1.0 : 0.9,
    })
  );

  let courses: any[] = [];
  try {
    courses = await fetchAllCourses();
  } catch {
    // Search unavailable: still publish the static pages rather than nothing.
    return entries;
  }

  const trees = await inBatches(courses, async (course: any) => {
    try {
      const tree: any = await hierarchyAPI(course.identifier);
      return typeof tree?.name === 'string' ? tree : null;
    } catch {
      return null;
    }
  });

  for (const course of trees) {
    if (!course) continue;

    const coursePath = `${base}/${course.identifier}`;
    entries.push({
      path: coursePath,
      lastModified: lastModifiedOf(course),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    for (const unit of childrenOf(course).filter(isCollection)) {
      const unitPath = `${coursePath}/${unit.identifier}`;
      entries.push({
        path: unitPath,
        lastModified: lastModifiedOf(unit),
        changeFrequency: 'weekly',
        priority: 0.7,
      });

      for (const item of childrenOf(unit)) {
        if (isCollection(item)) continue;
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
