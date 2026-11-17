// Title and description templates from audit section 4.
// Rules: brand suffix, titles <= 60 chars before the suffix (truncated on a word
// boundary), descriptions 140-160 chars, HTML stripped. A field the API does not
// return is left out rather than guessed - no "undefined" and no empty brackets.

// Default brand. Experimento pages pass their own, so one helper serves both sites.
export const DEFAULT_BRAND = 'Pratham Open School';
const TITLE_MAX = 60;
const DESC_MAX = 155;

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/x-youtube'];

const clean = (value?: unknown) =>
  String(value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const truncate = (text: string, max: number) => {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const boundary = cut.lastIndexOf(' ');
  return `${(boundary > max * 0.6 ? cut.slice(0, boundary) : cut).trim()}…`;
};

const first = (value: unknown) =>
  clean(Array.isArray(value) ? value[0] : value) || '';

/** Joins the parts that exist, so a missing field never leaves a stray separator. */
const joinParts = (parts: (string | undefined)[], separator: string) =>
  parts.map((p) => clean(p)).filter(Boolean).join(separator);

export function buildSeoTitle(item: any, brand = DEFAULT_BRAND): string {
  const name = clean(item?.name);
  if (!name) return brand;

  const englishName = clean(item?.englishName);
  const subject = first(item?.se_subjects);
  const language = clean(item?.contentLanguage);
  const isVideo = VIDEO_MIME_TYPES.includes(item?.mimeType);
  const isPdf = item?.mimeType === 'application/pdf';

  // Native-script name kept, English name added only when it differs.
  let head = name;
  if (englishName && englishName.toLowerCase() !== name.toLowerCase()) {
    head = `${name} (${englishName})`;
  }

  const qualifiers = joinParts([subject, language], ', ');
  const suffix = `${isVideo ? ' (Video)' : ''}${
    qualifiers ? ` – ${qualifiers}` : ''
  }${isPdf ? ' (PDF)' : ''}`;

  // Trim the name, never the qualifiers: subject and language are the part that
  // distinguishes otherwise-identical titles such as "Maths - Workbook".
  const budget = Math.max(24, TITLE_MAX - suffix.length);

  return `${truncate(head, budget)}${suffix} | ${brand}`;
}

export function buildSeoDescription(item: any, brand = DEFAULT_BRAND): string {
  const name = clean(item?.name);
  const description = clean(item?.description);

  // Section 4: use the real description unless it is empty or just repeats the title.
  if (description && description.toLowerCase() !== name.toLowerCase()) {
    return truncate(description, DESC_MAX);
  }

  const subject = first(item?.se_subjects);
  const language = clean(item?.contentLanguage);
  const count = Number(item?.leafNodesCount) || 0;
  const isCourse = item?.primaryCategory === 'Course';
  const isPdf = item?.mimeType === 'application/pdf';
  const isVideo = VIDEO_MIME_TYPES.includes(item?.mimeType);

  if (isCourse) {
    const lead = joinParts(['Free', language, subject, 'course from Pratham'], ' ');
    const tail = count
      ? `: ${count} videos and activities on ${name}.`
      : ` on ${name}.`;
    return truncate(`${lead}${tail}`, DESC_MAX);
  }

  if (isPdf) {
    const forPart = subject ? ` for ${subject}` : '';
    const inPart = language ? ` in ${language}` : '';
    return truncate(
      `Download the free ${name} PDF${forPart}${inPart}. Free learning resource from ${brand}.`,
      DESC_MAX
    );
  }

  const kind = isVideo ? 'Video' : clean(item?.primaryCategory) || 'Learning resource';
  const about = joinParts([subject && `on ${subject}`, language && `in ${language}`], ', ');
  return truncate(
    `${kind}: ${name}${about ? `, ${about}` : ''}. Free on ${brand}.`,
    DESC_MAX
  );
}

/**
 * Metadata for a fixed page (home, pillar, about). Social previews need absolute
 * URLs on every platform, and the correct domain per site, so the origin comes
 * from the request host with the path prefix as a fallback for dev and QA.
 */
export async function buildPageMetadata({
  title,
  description,
  image,
  path,
  type = 'website',
}: {
  title: string;
  description: string;
  image?: string;
  path: string;
  type?: 'website' | 'article';
}) {
  const { headers } = await import('next/headers');
  const { siteForHost, absoluteUrl } = await import('./seo');

  const isExperimento = path.startsWith('/themantic');
  const site = siteForHost(headers().get('host'));
  const origin =
    site?.origin ??
    (isExperimento
      ? 'https://experimentoindia.prathamopenschool.org'
      : 'https://www.prathamopenschool.org');

  const siteName = isExperimento ? 'Experimento India' : DEFAULT_BRAND;
  const url = absoluteUrl(path, origin);
  const ogImage =
    image && /^https?:\/\//i.test(image)
      ? image
      : absoluteUrl(image || '/images/home-page-banner.png', origin);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type,
      locale: 'en_IN',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    // Set explicitly rather than relying on Next deriving them from openGraph,
    // so X/Twitter previews are guaranteed.
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [ogImage],
    },
  };
}
