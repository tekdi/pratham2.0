/**
 * csvToJson.js — Import client translations back into per-language JSON files.
 *
 * WHAT IT DOES
 *   For each configured app it reads the repo's `en.json` (the MASTER key set)
 *   and the client's returned CSV, then writes one JSON file per language into
 *   Outputs/<appName>/<code>.json. Every output file contains ALL of en.json's
 *   keys, in en.json order. For each key + language the value is resolved as:
 *
 *       1. CSV translation        (what the client just filled in — wins)
 *       2. else existing value    (a translation already in that language file)
 *       3. else English fallback  (so no key is ever missing at runtime)
 *
 *   The English output file is just en.json itself (code English is authoritative).
 *   Keys present in the CSV/old files but NOT in en.json are treated as stale
 *   and dropped (their count is logged).
 *
 * NO EXTERNAL DEPENDENCIES — plain Node with a built-in RFC-4180 CSV parser, so
 * this file can be dropped into any repo and run with `node csvToJson.js`.
 * Edit the CONFIG block below per repo/run.
 */

const fs = require('fs');
const path = require('path');

/* ============================================================================
 * CONFIG — edit paths / languages per repo. Each entry writes one app's files.
 * ========================================================================== */

const REPO_ROOT = '/home/ttpl-rt-215/Documents/Git/React/pratham2.0';
const OUTPUT_DIR = path.join(REPO_ROOT, 'translation', 'Outputs');

const TARGETS = [
  {
    appName: 'learner_app',
    csvPath: path.join(REPO_ROOT, 'translation/Pratham_ Translations - 22th July 2026 - Learner Web App (PLP).csv'),
    localesDir: path.join(REPO_ROOT, 'libs/shared-lib-v2/src/lib/context/locales'),
    layout: 'file',                         // 'file' => <localesDir>/<code>.json
    keyColumns: ['Module', 'Submodule', 'Key'],
    sourceCode: 'en',                       // the master language (kept as-is)
    outputDir: path.join(OUTPUT_DIR, 'learner_app'),
    // column = CSV header, code = language filename
    languages: [
      { column: 'English',  code: 'en' },
      { column: 'Marathi',  code: 'mr' },
      { column: 'Hindi',    code: 'hi' },
      { column: 'Odiya',    code: 'odi' },
      { column: 'Telugu',   code: 'tel' },
      { column: 'Kannada',  code: 'kan' },
      { column: 'Tamil',    code: 'tam' },
      { column: 'Gujarati', code: 'guj' },
      { column: 'Urdu',     code: 'ur' },
    ],
  },

  {
    appName: 'scp_teacher',
    csvPath: path.join(REPO_ROOT, 'translation/Pratham_ Translations - 20th July 2026 - Facilitator.csv'),
    localesDir: path.join(REPO_ROOT, 'mfes/scp-teacher-repo/public/locales'),
    layout: 'dir',                          // 'dir' => <localesDir>/<code>/<namespace>
    namespace: 'common.json',
    keyColumns: ['Module', 'Submodule', 'Key'],
    sourceCode: 'en',
    outputDir: path.join(OUTPUT_DIR, 'scp_teacher'),
    // Odiya is written to BOTH `odi` and `or` (this repo has both folders).
    languages: [
      { column: 'English',  code: 'en' },
      { column: 'Marathi',  code: 'mr' },
      { column: 'Hindi',    code: 'hi' },
      { column: 'Odiya',    code: 'odi' },
      { column: 'Odiya',    code: 'or' },
      { column: 'Telugu',   code: 'tel' },
      { column: 'Kannada',  code: 'kan' },
      { column: 'Tamil',    code: 'tam' },
      { column: 'Gujarati', code: 'gu' },
      { column: 'Urdu',     code: 'ur' },
    ],
  },

  {
    appName: 'admin_app',
    csvPath: path.join(REPO_ROOT, 'translation/Pratham_ Translations - 20th July 2026 - Admin App.csv'),
    localesDir: path.join(REPO_ROOT, 'apps/admin-app-repo/public/locales'),
    layout: 'dir',                          // 'dir' => <localesDir>/<code>/<namespace>
    namespace: 'common.json',
    keyColumns: ['Module', 'Submodule', 'Key'],
    sourceCode: 'en',
    outputDir: path.join(OUTPUT_DIR, 'admin_app'),
    // Odiya is written to BOTH `odi` and `or` (this repo has both folders).
    languages: [
      { column: 'English',  code: 'en' },
      { column: 'Marathi',  code: 'mr' },
      { column: 'Hindi',    code: 'hi' },
      { column: 'Odiya',    code: 'odi' },
      { column: 'Odiya',    code: 'or' },
      { column: 'Telugu',   code: 'tel' },
      { column: 'Kannada',  code: 'kan' },
      { column: 'Tamil',    code: 'tam' },
      { column: 'Gujarati', code: 'gu' },
      { column: 'Urdu',     code: 'ur' },
    ],
  },

  {
    appName: 'youthnet',
    csvPath: path.join(REPO_ROOT, 'translation/Pratham_ Translations - 20th July 2026 - Mentor.csv'),
    localesDir: path.join(REPO_ROOT, 'mfes/youthNet/public/locales'),
    layout: 'dir',                          // 'dir' => <localesDir>/<code>/<namespace>
    namespace: 'common.json',
    keyColumns: ['Module', 'Submodule', 'Key'],
    sourceCode: 'en',
    outputDir: path.join(OUTPUT_DIR, 'youthnet'),
    // All languages from the Mentor CSV. Odiya -> `or` (youthNet's folder).
    // `ml` (Malayalam) is left untouched — the CSV has no Malayalam column.
    languages: [
      { column: 'English',  code: 'en' },
      { column: 'Marathi',  code: 'mr' },
      { column: 'Hindi',    code: 'hi' },
      { column: 'Odiya',    code: 'or' },
      { column: 'Telugu',   code: 'tel' },
      { column: 'Kannada',  code: 'kan' },
      { column: 'Tamil',    code: 'tam' },
      { column: 'Gujarati', code: 'gu' },
      { column: 'Urdu',     code: 'ur' },
    ],
  },
];

/* ============================================================================
 * Built-in RFC-4180 CSV parser (handles quotes, escaped "", embedded , and \n)
 * ========================================================================== */

function parseCsv(text) {
  if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1); // strip BOM
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\r') {
      // ignore; handled by \n
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else {
      field += c;
    }
  }
  if (field !== '' || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// Turn parsed rows into objects keyed by (trimmed) header names.
function rowsToObjects(rows) {
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    if (cells.every((c) => c.trim() === '')) continue; // skip blank lines
    const obj = {};
    headers.forEach((h, idx) => { if (h) obj[h] = cells[idx] !== undefined ? cells[idx] : ''; });
    out.push(obj);
  }
  return out;
}

/* ============================================================================
 * Helpers
 * ========================================================================== */

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function getAtPath(obj, pathArr) {
  let cur = obj;
  for (const seg of pathArr) {
    if (!isPlainObject(cur) || !(seg in cur)) return undefined;
    cur = cur[seg];
  }
  return cur;
}

// Map a nested path -> normalized (Module, Submodule, Key) triple, mirroring
// jsonToCsv. Last segment is the Key; preceding segments fill module columns.
function pathToTriple(pathArr, keyColumns) {
  const moduleCols = keyColumns.slice(0, -1); // e.g. ['Module','Submodule'] or ['Module']
  const ancestors = pathArr.slice(0, -1);
  const leafKey = pathArr[pathArr.length - 1];

  let module = '';
  let submodule = '';
  if (moduleCols.length >= 1) module = ancestors[0] || '';
  if (moduleCols.length >= 2) submodule = ancestors[1] || '';

  let key = leafKey;
  if (ancestors.length > moduleCols.length) {
    key = ancestors.slice(moduleCols.length).concat(leafKey).join('.');
  }
  return [module, submodule, key];
}

// Stable, collision-free lookup key for a (module, submodule, key) triple.
// JSON.stringify escapes any commas/quotes/spaces inside the parts, so two
// different triples can never produce the same string.
function tripleKey(module, submodule, key) {
  return JSON.stringify([module, submodule, key]);
}

function loadLanguageFile(target, code) {
  const filePath = target.layout === 'dir'
    ? path.join(target.localesDir, code, target.namespace)
    : path.join(target.localesDir, `${code}.json`);
  if (!fs.existsSync(filePath)) return { data: {}, missing: true, filePath };
  try {
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf-8')), missing: false, filePath };
  } catch (err) {
    throw new Error(`Failed to parse ${filePath}: ${err.message}`);
  }
}

// Find keys with leading/trailing whitespace (e.g. a stray space or U+2009),
// which are invisible in editors and silently break CSV matching.
function findWhitespaceKeys(node, prefix, out) {
  for (const k of Object.keys(node)) {
    const p = prefix.concat(k);
    if (k !== k.trim()) out.push(`${p.join(' > ')}   (raw: ${JSON.stringify(k)})`);
    if (isPlainObject(node[k])) findWhitespaceKeys(node[k], p, out);
  }
  return out;
}

function warnWhitespaceKeys(masterData) {
  const bad = findWhitespaceKeys(masterData, [], []);
  if (bad.length) {
    console.warn(`  ! ${bad.length} key(s) in en.json have leading/trailing whitespace — fix the source, they won't match the CSV:`);
    bad.forEach((b) => console.warn(`      ${b}`));
  }
}

/* ============================================================================
 * Main
 * ========================================================================== */

function processTarget(target) {
  console.log(`\n=== ${target.appName} ===`);

  if (!fs.existsSync(target.csvPath)) {
    console.error(`  ✗ CSV not found: ${target.csvPath} — skipping target.`);
    return;
  }

  // Master = en.json: key set, order, English text (and English fallback).
  const master = loadLanguageFile(target, target.sourceCode);
  if (master.missing) {
    console.error(`  ✗ Master file not found: ${master.filePath} — skipping target.`);
    return;
  }
  warnWhitespaceKeys(master.data);

  // Build CSV lookup: csvLookup[code][tripleKey] = trimmed value (non-empty only).
  const csvRows = rowsToObjects(parseCsv(fs.readFileSync(target.csvPath, 'utf-8')));
  const csvLookup = {};
  const csvKeysSeen = new Set();
  target.languages.forEach((l) => { csvLookup[l.code] = {}; });

  for (const r of csvRows) {
    const module = (r['Module'] || '').trim();
    const submodule = (r['Submodule'] || '').trim();
    const key = (r['Key'] || '').trim();
    if (!key) continue;
    const tk = tripleKey(module, submodule, key);
    csvKeysSeen.add(tk);
    for (const lang of target.languages) {
      if (lang.code === target.sourceCode) continue; // English kept from code
      const val = (r[lang.column] || '').trim();
      if (val) csvLookup[lang.code][tk] = val;
    }
  }

  // Pre-load existing language files (for the "existing translation" fallback).
  const existing = {};
  for (const lang of target.languages) {
    existing[lang.code] = loadLanguageFile(target, lang.code).data;
  }

  // Rebuild each language file by walking the master (preserves order/structure).
  const stats = {};
  target.languages.forEach((l) => { stats[l.code] = { fromCsv: 0, kept: 0, english: 0, total: 0 }; });
  const masterTriples = new Set();

  function build(masterNode, prefix, code) {
    const out = {};
    for (const k of Object.keys(masterNode)) {
      const v = masterNode[k];
      const p = prefix.concat(k);
      if (isPlainObject(v)) {
        out[k] = build(v, p, code);
      } else {
        const s = stats[code];
        s.total += 1;
        if (code === target.sourceCode) { out[k] = v; continue; }
        const [m, sub, key] = pathToTriple(p, target.keyColumns);
        const tk = tripleKey(m, sub, key);
        masterTriples.add(tk);
        const csvVal = csvLookup[code][tk];
        if (csvVal !== undefined) { out[k] = csvVal; s.fromCsv += 1; continue; }
        const ex = getAtPath(existing[code], p);
        if (ex !== undefined && !isPlainObject(ex) && String(ex).trim() !== '') {
          out[k] = ex; s.kept += 1; continue;
        }
        out[k] = v; s.english += 1; // English fallback
      }
    }
    return out;
  }

  fs.mkdirSync(target.outputDir, { recursive: true });
  for (const lang of target.languages) {
    const obj = build(master.data, [], lang.code);
    const outPath = path.join(target.outputDir, `${lang.code}.json`);
    fs.writeFileSync(outPath, JSON.stringify(obj, null, 2) + '\n', 'utf-8');
  }

  // Stale CSV keys = present in CSV but not in the master key set.
  let stale = 0;
  for (const tk of csvKeysSeen) if (!masterTriples.has(tk)) stale += 1;

  const totalKeys = stats[target.sourceCode].total;
  console.log(`  ✓ Wrote ${target.languages.length} files -> ${target.outputDir}  (${totalKeys} keys each)`);
  for (const lang of target.languages) {
    if (lang.code === target.sourceCode) continue;
    const s = stats[lang.code];
    console.log(`      ${lang.column.padEnd(9)} fromCSV: ${String(s.fromCsv).padStart(4)}   kept: ${String(s.kept).padStart(4)}   english-fallback: ${String(s.english).padStart(4)}`);
  }
  if (stale > 0) console.log(`  ! ${stale} key(s) in the CSV are not in en.json (stale) — dropped.`);
}

try {
  if (TARGETS.length === 0) {
    console.log('No active targets in CONFIG — uncomment one and set its paths.');
  }
  TARGETS.forEach(processTarget);
  console.log('\nDone.');
} catch (err) {
  console.error(`\n✗ ${err.message}`);
  process.exit(1);
}
