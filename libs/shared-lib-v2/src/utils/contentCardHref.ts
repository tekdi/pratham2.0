// Builds card href for native link navigation (Ctrl/Cmd+click, middle-click open in new tab).
// URL rules mirror mfes/content List.tsx handleCardClickLocal.
export const CONTENT_CARD_PLAYER_MIME_TYPES = [
  'application/vnd.ekstep.ecml-archive',
  'application/vnd.ekstep.html-archive',
  'application/vnd.ekstep.h5p-archive',
  'application/pdf',
  'video/mp4',
  'video/webm',
  'application/epub',
  'video/x-youtube',
  'application/vnd.sunbird.questionset',
] as const;

/** Matches default card navigation in mfes/content List.tsx handleCardClickLocal */
export function getContentCardHref(
  item: { identifier?: string; mimeType?: string },
  contentBaseUrl = '',
  activeLink?: string
): string | undefined {
  if (!item?.identifier) return undefined;

  const base = contentBaseUrl ?? '';
  const link =
    activeLink ??
    (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : '');
  const query = link
    ? `?activeLink=${encodeURIComponent(link)}`
    : '';

  if (CONTENT_CARD_PLAYER_MIME_TYPES.includes(item.mimeType as any)) {
    return `${base}/player/${item.identifier}${query}`;
  }

  return `${base}/content-details/${item.identifier}${query}`;
}

const UNIT_COLLECTION_MIME = 'application/vnd.ekstep.content-collection';

/** Matches unit/lesson navigation in CourseUnitDetails.handleItemClick */
export function getUnitCardHref(
  subItem: { identifier?: string; mimeType?: string; evaluationType?: string },
  {
    courseId,
    effectiveUnitId,
    contentBaseUrl = '/content',
    activeLink,
  }: {
    courseId?: string;
    effectiveUnitId?: string;
    contentBaseUrl?: string;
    activeLink?: string | null;
  }
): string | undefined {
  if (!subItem?.identifier || !courseId) return undefined;
  if (subItem.evaluationType === 'offline') return undefined;

  const base = contentBaseUrl ?? '/content';
  const query = activeLink
    ? `?activeLink=${encodeURIComponent(activeLink)}`
    : '';

  const path =
    subItem.mimeType === UNIT_COLLECTION_MIME
      ? `${base}/${courseId}/${subItem.identifier}`
      : `${base}/${courseId}/${effectiveUnitId}/${subItem.identifier}`;

  return `${path}${query}`;
}
