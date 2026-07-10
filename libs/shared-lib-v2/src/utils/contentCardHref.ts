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
  returnUrl?: string | null
): string | undefined {
  if (!item?.identifier) return undefined;

  const base = contentBaseUrl ?? '';
  const backUrl =
    returnUrl ??
    (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : null);

  let path: string;
  if (CONTENT_CARD_PLAYER_MIME_TYPES.includes(item.mimeType as any)) {
    path = `${base}/player/${item.identifier}`;
  } else {
    path = `${base}/content-details/${item.identifier}`;
  }

  return backUrl ? `${path}?returnUrl=${encodeURIComponent(backUrl)}` : path;
}

const UNIT_COLLECTION_MIME = 'application/vnd.ekstep.content-collection';

/** Matches unit/lesson navigation in CourseUnitDetails.handleItemClick */
export function getUnitCardHref(
  subItem: { identifier?: string; mimeType?: string; evaluationType?: string },
  {
    courseId,
    effectiveUnitId,
    contentBaseUrl = '/content',
    activeLink: returnUrl,
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
  const backUrl =
    returnUrl ??
    (typeof window !== 'undefined'
      ? window.location.pathname + window.location.search
      : null);

  const path =
    subItem.mimeType === UNIT_COLLECTION_MIME
      ? `${base}/${courseId}/${subItem.identifier}`
      : `${base}/${courseId}/${effectiveUnitId}/${subItem.identifier}`;

  return backUrl ? `${path}?returnUrl=${encodeURIComponent(backUrl)}` : path;
}
