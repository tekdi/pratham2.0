import { cache } from 'react';
import { ContentSearch, fetchContent, hierarchyAPI } from '../API/contentService';
import { siteConfig } from './siteConfig';

// React cache() dedupes within a single request, so generateMetadata and the
// page body share one API call instead of fetching twice.

// fetchContent returns the error object instead of throwing, and an AxiosError
// has a string `name` — so check for a real content shape, not just a name.
const asContent = (data: any) =>
  data && !(data instanceof Error) && typeof data.name === 'string' && data.identifier
    ? data
    : null;

export const getHierarchy = cache(async (id?: string) => {
  if (!id) return null;
  try {
    return asContent(await hierarchyAPI(id));
  } catch {
    return null;
  }
});

export const getContent = cache(async (id?: string) => {
  if (!id) return null;
  try {
    return asContent(await fetchContent(id, { mode: null }));
  } catch {
    return null;
  }
});

/** First page of live courses, for server-rendered listing pages. */
export const getCourseList = cache(async (limit = 48) => {
  try {
    const response: any = await ContentSearch({
      filters: {
        primaryCategory: ['Course'],
        status: ['Live'],
        ...(siteConfig.variant === 'thematic'
          ? { program: 'Experimento India' }
          : {}),
      },
      fields: ['identifier', 'name'],
      limit,
      offset: 0,
    });
    return response?.result?.content ?? [];
  } catch {
    return [];
  }
});

const COLLECTION_MIME = 'application/vnd.ekstep.content-collection';

export const isCollection = (node: any) => node?.mimeType === COLLECTION_MIME;

/** Depth-first lookup of a node by identifier inside a hierarchy tree. */
export const findNode = (root: any, id?: string): any => {
  if (!root || !id) return null;
  if (root.identifier === id) return root;
  for (const child of root.children ?? []) {
    const match = findNode(child, id);
    if (match) return match;
  }
  return null;
};

export const childrenOf = (node: any): any[] =>
  Array.isArray(node?.children) ? node.children : [];

type TrailInput = {
  /** Site home, e.g. "/pos" or "/themantic". */
  homePath: string;
  homeName: string;
  /** Where course ids hang off: "/pos/content" or "/themantic". */
  coursePathBase: string;
  courseId?: string;
  unitId?: string;
  identifier?: string;
};

/**
 * One hierarchy call gives the course, the unit and the content, plus the
 * breadcrumb trail down to whichever level the page is at.
 */
export async function getContentTrail({
  homePath,
  homeName,
  coursePathBase,
  courseId,
  unitId,
  identifier,
}: TrailInput) {
  const course = await getHierarchy(courseId);
  const unit = findNode(course, unitId);
  const content = findNode(course, identifier);

  const coursePath = `${coursePathBase}/${courseId}`;
  const unitPath = `${coursePath}/${unitId}`;

  const crumbs = [{ name: homeName, path: homePath }];
  if (course) crumbs.push({ name: course.name, path: coursePath });
  if (unit) crumbs.push({ name: unit.name, path: unitPath });
  if (content) {
    crumbs.push({ name: content.name, path: `${unitPath}/${identifier}` });
  }

  return { course, unit, content, crumbs, coursePath, unitPath };
}
