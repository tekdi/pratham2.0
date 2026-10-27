// Title and description templates from audit section 4.
// Rules: brand suffix, titles <= 60 chars before the suffix (truncated on a word
// boundary), descriptions 140-160 chars, HTML stripped. A field the API does not
// return is left out rather than guessed - no "undefined" and no empty brackets.

const BRAND = 'Pratham Open School';
const TITLE_MAX = 60;
const DESC_MAX = 155;

const VIDEO_MIME_TYPES = ['video/mp4', 'video/webm', 'video/x-youtube'];

// BCP 47 codes for every contentLanguage value the content API actually returns.
// Khasi and Rabha have no ISO 639-1 code, so their 639-3 codes are used.
const LANGUAGE_CODES: Record<string, string> = {
  assamese: 'as',
  bengali: 'bn',
  english: 'en',
  gujarati: 'gu',
  hindi: 'hi',
  kannada: 'kn',
  khasi: 'kha',
  malayalam: 'ml',
  marathi: 'mr',
  odia: 'or',
  punjabi: 'pa',
  'rabha (rongdani)': 'rah',
  rabha: 'rah',
  tamil: 'ta',
  telugu: 'te',
  urdu: 'ur',
};

/** Returns undefined for an unrecognised language: better no lang than a wrong one. */
export const toIsoLanguage = (value?: unknown): string | undefined => {
  const key = String(Array.isArray(value) ? value[0] : value ?? '')
    .trim()
    .toLowerCase();
  return LANGUAGE_CODES[key];
};

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

export function buildSeoTitle(item: any): string {
  const name = clean(item?.name);
  if (!name) return BRAND;

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

  return `${truncate(head, budget)}${suffix} | ${BRAND}`;
}

export function buildSeoDescription(item: any): string {
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
      `Download the free ${name} PDF${forPart}${inPart}. Free learning resource from ${BRAND}.`,
      DESC_MAX
    );
  }

  const kind = isVideo ? 'Video' : clean(item?.primaryCategory) || 'Learning resource';
  const about = joinParts([subject && `on ${subject}`, language && `in ${language}`], ', ');
  return truncate(
    `${kind}: ${name}${about ? `, ${about}` : ''}. Free on ${BRAND}.`,
    DESC_MAX
  );
}
