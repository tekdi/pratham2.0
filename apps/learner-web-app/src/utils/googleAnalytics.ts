import ReactGA from 'react-ga4';
import { fetchContentMeta } from './API/contentService';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const CACHE_PREFIX = 'ga_meta_';
const memoryCache = new Map<string, any>();

export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

export const hasDoId = (pathname: string) => /do_\d+/.test(pathname);

// The course landing page (/content/do_X) carries a single id, but it is a
// course and must not be reported as a content item.
const resolveIds = (
  pathname: string
): { contentId?: string; courseId?: string; unitId?: string } => {
  const ids = Array.from(pathname.matchAll(/do_\d+/g)).map((m) => m[0]);

  if (ids.length >= 3) {
    return { courseId: ids[0], unitId: ids[1], contentId: ids[2] };
  }
  if (ids.length === 2) {
    return { courseId: ids[0], unitId: ids[1] };
  }
  if (ids.length === 1) {
    return /\/content\/do_\d+/.test(pathname)
      ? { courseId: ids[0] }
      : { contentId: ids[0] };
  }
  return {};
};

// Cache resolved names so one failed lookup cannot blank the field later on.
const getMeta = async (identifier: string) => {
  if (memoryCache.has(identifier)) return memoryCache.get(identifier);

  try {
    const stored = sessionStorage.getItem(`${CACHE_PREFIX}${identifier}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      memoryCache.set(identifier, parsed);
      return parsed;
    }
  } catch (e) {
    // sessionStorage unavailable - fall through to the network call
  }

  const data = await fetchContentMeta(identifier);
  console.log('Fetched details for GA:', identifier, data);
  if (!data?.name) return null;

  const meta = {
    name: data.name,
    mimeType: data.mimeType,
    contentLanguage: data.contentLanguage,
    program: data.program,
  };
  memoryCache.set(identifier, meta);
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${identifier}`, JSON.stringify(meta));
  } catch (e) {
    // ignore quota / private-mode errors
  }
  return meta;
};

const buildIdParams = async (pathname: string) => {
  const params: Record<string, any> = {};
  const { contentId, courseId, unitId } = resolveIds(pathname);

  if (contentId) params.content_id = contentId;
  if (courseId) params.course_id = courseId;
  if (unitId) params.unit_id = unitId;

  const [content, course] = await Promise.all([
    contentId ? getMeta(contentId) : Promise.resolve(null),
    courseId ? getMeta(courseId) : Promise.resolve(null),
  ]);

  if (content?.name) params.content_name = content.name;
  if (content?.mimeType) params.content_type = content.mimeType;
  if (content?.contentLanguage) params.content_language = content.contentLanguage;
  if (course?.name) params.course_name = course.name;

  const program = content?.program ?? course?.program;
  if (program) params.program = program;

  console.log('[GA] resolved ids/names for', pathname, params);
  return params;
};

export const logPageView = async (url: string) => {
  if (typeof window === 'undefined') return;

  const additionalParams: Record<string, any> = {
    origin: window.location.pathname.includes('/pos')
      ? 'pos web'
      : 'learner plp web app',
    ...(await buildIdParams(window.location.pathname)),
  };

  const userProgram = localStorage.getItem('userProgram');
  const pageViewData: Record<string, any> = {
    hitType: 'pageview',
    page: url,
    ...(userProgram ? { userProgram } : {}),
    ...additionalParams,
  };

  console.log('[GA logPageView] pageViewData:', pageViewData);
  ReactGA.send(pageViewData);
};

export const logEvent = async ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window === 'undefined') return;

  const eventParams: Record<string, any> = {
    event_category: category,
  };

  if (label) eventParams.event_label = label;
  if (value !== undefined) eventParams.value = value;

  const userProgram = localStorage.getItem('userProgram');
  if (userProgram) {
    console.log('userProgram', userProgram);
    eventParams.userProgram = userProgram;
  }

  Object.assign(eventParams, await buildIdParams(window.location.pathname));

  console.log('[GA logEvent] eventParams:', eventParams);

  if (window.gtag && typeof window.gtag === 'function') {
    window.gtag('event', action, eventParams);
  } else {
    // Fallback: use ReactGA send so eventParams are still included
    ReactGA.send({ hitType: 'event', event_action: action, ...eventParams });
  }
};
