#!/usr/bin/env node
/**
 * Sitemap coverage check (SEO Action 4.3).
 *
 * Independently rebuilds the expected URL list from the content APIs and
 * compares it against the deployed sitemap.xml, so a silent API failure
 * cannot quietly shrink the sitemap without the build noticing.
 *
 * Usage:
 *   node apps/learner-web-app/scripts/verify-sitemap.mjs \
 *     --site https://www.prathamopenschool.org \
 *     --middleware https://qa-interface.prathamdigital.org/interface/v1 \
 *     --variant pos
 *
 * Exits 1 when a URL is missing or an excluded URL is present.
 */

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith('--')) pairs.push([arg.slice(2), all[i + 1]]);
    return pairs;
  }, [])
);

const SITE = (args.site || process.env.SITE_URL || '').replace(/\/+$/, '');
const MIDDLEWARE = (
  args.middleware ||
  process.env.NEXT_PUBLIC_MIDDLEWARE_URL ||
  ''
).replace(/\/+$/, '');
const VARIANT = args.variant || process.env.NEXT_PUBLIC_SITE_VARIANT || 'pos';

if (!SITE || !MIDDLEWARE) {
  console.error('Missing --site or --middleware. See usage in this file.');
  process.exit(2);
}

const COLLECTION_MIME = 'application/vnd.ekstep.content-collection';
const PAGE_SIZE = 200;
const CONCURRENCY = 8;

const coursePathBase = VARIANT === 'thematic' ? '/themantic' : '/pos/content';

const STATIC_PATHS = {
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

/** URLs that must never appear: duplicates and the other site's tree. */
const EXCLUDED_PATTERNS = [
  '/player/',
  '/content-details/',
  VARIANT === 'thematic' ? '/pos' : '/themantic',
  '/login',
  '/profile',
  '/registration',
];

async function fetchSitemapUrls() {
  const response = await fetch(`${SITE}/sitemap.xml`);
  if (!response.ok) {
    throw new Error(`sitemap.xml returned HTTP ${response.status}`);
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('xml')) {
    throw new Error(`sitemap.xml served as "${contentType}", expected XML`);
  }
  const body = await response.text();
  return [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function searchCourses() {
  const courses = [];
  let offset = 0;

  for (;;) {
    const response = await fetch(`${MIDDLEWARE}/action/composite/v3/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        request: {
          filters: {
            primaryCategory: ['Course'],
            status: ['Live'],
            ...(VARIANT === 'thematic' ? { program: 'Experimento India' } : {}),
          },
          fields: ['identifier', 'name'],
          limit: PAGE_SIZE,
          offset,
        },
      }),
    });
    if (!response.ok) throw new Error(`search returned HTTP ${response.status}`);

    const json = await response.json();
    const batch = json?.result?.content ?? [];
    const total = json?.result?.count ?? 0;
    courses.push(...batch);

    if (batch.length === 0 || courses.length >= total) break;
    offset += PAGE_SIZE;
  }

  return courses;
}

async function fetchHierarchy(id) {
  const response = await fetch(`${MIDDLEWARE}/api/course/v1/hierarchy/${id}`);
  if (!response.ok) return null;
  const json = await response.json();
  return json?.result?.content ?? null;
}

async function inBatches(items, worker) {
  const results = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const slice = items.slice(i, i + CONCURRENCY);
    results.push(...(await Promise.all(slice.map(worker))));
  }
  return results;
}

function expectedPathsFrom(course) {
  const paths = [];
  const coursePath = `${coursePathBase}/${course.identifier}`;
  paths.push(coursePath);

  for (const unit of course.children ?? []) {
    if (unit.mimeType !== COLLECTION_MIME) continue;
    const unitPath = `${coursePath}/${unit.identifier}`;
    paths.push(unitPath);

    for (const item of unit.children ?? []) {
      if (item.mimeType === COLLECTION_MIME) continue;
      paths.push(`${unitPath}/${item.identifier}`);
    }
  }
  return paths;
}

async function main() {
  console.log(`Site      : ${SITE}`);
  console.log(`Variant   : ${VARIANT}\n`);

  const sitemapUrls = await fetchSitemapUrls();
  const sitemapPaths = new Set(
    sitemapUrls.map((url) => new URL(url).pathname.replace(/\/$/, '') || '/')
  );

  const courses = await searchCourses();
  const trees = await inBatches(courses, (c) => fetchHierarchy(c.identifier));

  const expected = new Set(STATIC_PATHS[VARIANT] ?? []);
  for (const tree of trees) {
    if (!tree) continue;
    for (const path of expectedPathsFrom(tree)) expected.add(path);
  }

  const missing = [...expected].filter((p) => !sitemapPaths.has(p));
  const excluded = [...sitemapPaths].filter((p) =>
    EXCLUDED_PATTERNS.some((bad) => p.startsWith(bad))
  );
  const offDomain = sitemapUrls.filter((url) => !url.startsWith(SITE));

  console.log(`Courses found      : ${courses.length}`);
  console.log(`Expected URLs      : ${expected.size}`);
  console.log(`Sitemap URLs       : ${sitemapPaths.size}`);
  console.log(`Missing from map   : ${missing.length}`);
  console.log(`Excluded present   : ${excluded.length}`);
  console.log(`Wrong domain       : ${offDomain.length}`);

  if (sitemapPaths.size > 50000) {
    console.warn(
      `\nWARNING: ${sitemapPaths.size} URLs exceeds the 50,000 per-file limit — split into a sitemap index.`
    );
  }

  const show = (label, list) => {
    if (!list.length) return;
    console.error(`\n${label}:`);
    list.slice(0, 20).forEach((p) => console.error(`  ${p}`));
    if (list.length > 20) console.error(`  ...and ${list.length - 20} more`);
  };

  show('MISSING from sitemap', missing);
  show('EXCLUDED but present', excluded);
  show('WRONG DOMAIN', offDomain);

  if (missing.length || excluded.length || offDomain.length) {
    console.error('\nSitemap coverage check FAILED.');
    process.exit(1);
  }
  console.log('\nSitemap coverage check passed.');
}

main().catch((error) => {
  console.error(`Sitemap coverage check errored: ${error.message}`);
  process.exit(1);
});
