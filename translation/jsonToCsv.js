/**
 * jsonToCsv.js — Export translations to a CSV for the client.
 *
 * WHAT IT DOES
 *   For each configured app it reads the repo's `en.json` (the master list of
 *   keys + English text) and every language file, then writes ONE CSV where:
 *     - rows are in en.json order (new keys appear at their natural place),
 *     - the English column is always filled,
 *     - each language column is filled ONLY if the stored value is a *real*
 *       translation; otherwise the cell is left blank so the client knows it
 *       still needs translating.
 *
 *   "Real translation" = non-empty, not identical to the English text, and
 *   contains at least one character of that language's own script. This is how
 *   we keep the sheet honest even though csvToJson stores an English fallback
 *   for untranslated keys.
 *
 * NO EXTERNAL DEPENDENCIES — plain Node, so this file can be dropped into any
 * repo and run with `node jsonToCsv.js`. Edit the CONFIG block below per repo.
 */

const fs = require('fs');
const path = require('path');

/* ============================================================================
 * CONFIG — edit paths / languages per repo. Each entry produces one CSV.
 * ========================================================================== */

// Regex per script: a value is considered translated only if it contains at
// least one character in the target language's Unicode range.
const SCRIPT_RANGES = {
  devanagari: new RegExp('[\\u0900-\\u097F]'), // Hindi, Marathi
  gujarati:   new RegExp('[\\u0A80-\\u0AFF]'),
  odia:       new RegExp('[\\u0B00-\\u0B7F]'),
  tamil:      new RegExp('[\\u0B80-\\u0BFF]'),
  telugu:     new RegExp('[\\u0C00-\\u0C7F]'),
  kannada:    new RegExp('[\\u0C80-\\u0CFF]'),
  malayalam:  new RegExp('[\\u0D00-\\u0D7F]'),
  arabic:     new RegExp('[\\u0600-\\u06FF\\u0750-\\u077F\\uFB50-\\uFDFF\\uFE70-\\uFEFF]'), // Urdu
};

const REPO_ROOT = '/home/ttpl-rt-215/Documents/Git/React/pratham2.0';
const OUTPUT_DIR = path.join(REPO_ROOT, 'translation', 'Outputs');

const TARGETS = [
  {
    appName: 'learner_app',
    localesDir: path.join(REPO_ROOT, 'libs/shared-lib-v2/src/lib/context/locales'),
    layout: 'file',                         // 'file' => <localesDir>/<code>.json
    keyColumns: ['Module', 'Submodule', 'Key'],
    outputCsv: path.join(OUTPUT_DIR, 'learner_app.csv'),
    // column = CSV header, code = language filename, script = key in SCRIPT_RANGES
    // (script: null marks the master/source language — always taken as-is).
    languages: [
      { column: 'English',  code: 'en',  script: null },
      { column: 'Marathi',  code: 'mr',  script: 'devanagari' },
      { column: 'Hindi',    code: 'hi',  script: 'devanagari' },
      { column: 'Odiya',    code: 'odi', script: 'odia' },
      { column: 'Telugu',   code: 'tel', script: 'telugu' },
      { column: 'Kannada',  code: 'kan', script: 'kannada' },
      { column: 'Tamil',    code: 'tam', script: 'tamil' },
      { column: 'Gujarati', code: 'guj', script: 'gujarati' },
      { column: 'Urdu',     code: 'ur',  script: 'arabic' },
    ],
  },

  {
    appName: 'admin_app',
    localesDir: path.join(REPO_ROOT, 'apps/admin-app-repo/public/locales'),
    layout: 'dir',                          // 'dir' => <localesDir>/<code>/<namespace>
    namespace: 'common.json',
    keyColumns: ['Module', 'Submodule', 'Key'],
    outputCsv: path.join(OUTPUT_DIR, 'admin_app.csv'),
    // Repo has both `odi` and `or` (kept in sync); export reads Odiya from `odi`.
    languages: [
      { column: 'English',  code: 'en',  script: null },
      { column: 'Marathi',  code: 'mr',  script: 'devanagari' },
      { column: 'Hindi',    code: 'hi',  script: 'devanagari' },
      { column: 'Odiya',    code: 'odi', script: 'odia' },
      { column: 'Telugu',   code: 'tel', script: 'telugu' },
      { column: 'Kannada',  code: 'kan', script: 'kannada' },
      { column: 'Tamil',    code: 'tam', script: 'tamil' },
      { column: 'Gujarati', code: 'gu',  script: 'gujarati' },
      { column: 'Urdu',     code: 'ur',  script: 'arabic' },
    ],
  },

  {
    appName: 'scp_teacher',
    localesDir: path.join(REPO_ROOT, 'mfes/scp-teacher-repo/public/locales'),
    layout: 'dir',                          // 'dir' => <localesDir>/<code>/<namespace>
    namespace: 'common.json',
    keyColumns: ['Module', 'Submodule', 'Key'],
    outputCsv: path.join(OUTPUT_DIR, 'scp_teacher.csv'),
    // Repo has both `odi` and `or` (kept in sync); export reads Odiya from `odi`.
    // (`ml`/Malayalam exists but there is no Malayalam CSV column, so it's omitted.)
    languages: [
      { column: 'English',  code: 'en',  script: null },
      { column: 'Marathi',  code: 'mr',  script: 'devanagari' },
      { column: 'Hindi',    code: 'hi',  script: 'devanagari' },
      { column: 'Odiya',    code: 'odi', script: 'odia' },
      { column: 'Telugu',   code: 'tel', script: 'telugu' },
      { column: 'Kannada',  code: 'kan', script: 'kannada' },
      { column: 'Tamil',    code: 'tam', script: 'tamil' },
      { column: 'Gujarati', code: 'gu',  script: 'gujarati' },
      { column: 'Urdu',     code: 'ur',  script: 'arabic' },
    ],
  },

  {
    appName: 'youthnet',
    localesDir: path.join(REPO_ROOT, 'mfes/youthNet/public/locales'),
    layout: 'dir',                          // 'dir' => <localesDir>/<code>/<namespace>
    namespace: 'common.json',
    keyColumns: ['Module', 'Submodule', 'Key'],
    outputCsv: path.join(OUTPUT_DIR, 'youthnet.csv'),
    // youthNet has only en, hi, ml, mr, or, ur. Odiya -> `or` (no `odi` folder).
    // `ml` (Malayalam) is intentionally left out of the sheet.
    languages: [
      { column: 'English', code: 'en', script: null },
      { column: 'Marathi', code: 'mr', script: 'devanagari' },
      { column: 'Hindi',   code: 'hi', script: 'devanagari' },
      { column: 'Odiya',   code: 'or', script: 'odia' },
      { column: 'Urdu',    code: 'ur', script: 'arabic' },
    ],
  },
];

/* ============================================================================
 * Helpers
 * ========================================================================== */

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

// Walk a nested translation object, returning leaves in insertion (file) order.
function walkLeaves(node, prefix, out) {
  for (const key of Object.keys(node)) {
    const value = node[key];
    const p = prefix.concat(key);
    if (isPlainObject(value)) {
      walkLeaves(value, p, out);
    } else {
      out.push({ path: p, value });
    }
  }
  return out;
}

// Read value at a nested path; undefined if any segment is missing.
function getAtPath(obj, pathArr) {
  let cur = obj;
  for (const seg of pathArr) {
    if (!isPlainObject(cur) || !(seg in cur)) return undefined;
    cur = cur[seg];
  }
  return cur;
}

// Map a nested path -> { Module, Submodule, Key } (or { Module, Key }) columns.
// Last path segment is the Key; preceding segments fill the module columns.
// If a path is deeper than the configured columns, the overflow is folded into
// the Key with dots (best-effort; warned once).
let overflowWarned = false;
function mapPathToColumns(pathArr, keyColumns) {
  const cols = {};
  const keyCol = keyColumns[keyColumns.length - 1];
  const moduleCols = keyColumns.slice(0, -1);
  const ancestors = pathArr.slice(0, -1);
  const leafKey = pathArr[pathArr.length - 1];

  moduleCols.forEach((c, i) => { cols[c] = ancestors[i] || ''; });

  if (ancestors.length > moduleCols.length) {
    if (!overflowWarned) {
      console.warn(`  ! Some keys are nested deeper than [${keyColumns.join(', ')}] — folding extra levels into "${keyCol}".`);
      overflowWarned = true;
    }
    const overflow = ancestors.slice(moduleCols.length);
    cols[keyCol] = overflow.concat(leafKey).join('.');
  } else {
    cols[keyCol] = leafKey;
  }
  return cols;
}

// Is `value` a genuine translation (vs blank / English fallback / non-native)?
function isValidTranslation(value, englishValue, script) {
  if (value === undefined || value === null) return false;
  const v = String(value).trim();
  if (v === '') return false;
  if (v === String(englishValue).trim()) return false;      // equals English
  if (script) {
    const re = SCRIPT_RANGES[script];
    if (re && !re.test(v)) return false;                     // no native-script char
  }
  return true;
}

// Load a language file for a target, respecting its layout. Missing => {}.
function loadLanguageFile(target, code) {
  const filePath = target.layout === 'dir'
    ? path.join(target.localesDir, code, target.namespace)
    : path.join(target.localesDir, `${code}.json`);
  if (!fs.existsSync(filePath)) {
    return { data: {}, missing: true, filePath };
  }
  try {
    return { data: JSON.parse(fs.readFileSync(filePath, 'utf-8')), missing: false, filePath };
  } catch (err) {
    throw new Error(`Failed to parse ${filePath}: ${err.message}`);
  }
}

// Minimal RFC-4180 CSV field escaping.
function escapeCsvField(field) {
  const s = field === undefined || field === null ? '' : String(field);
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
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

  const englishLang = target.languages.find((l) => l.script === null);
  if (!englishLang) throw new Error(`${target.appName}: no master language (script: null) configured.`);

  // Master = en.json: defines the key set, order, and English text.
  const master = loadLanguageFile(target, englishLang.code);
  if (master.missing) {
    console.error(`  ✗ Master file not found: ${master.filePath} — skipping target.`);
    return;
  }
  warnWhitespaceKeys(master.data);
  const leaves = walkLeaves(master.data, [], []);

  // Load every language file once.
  const langData = {};
  for (const lang of target.languages) {
    const loaded = loadLanguageFile(target, lang.code);
    langData[lang.code] = loaded.data;
    if (loaded.missing && lang !== englishLang) {
      console.warn(`  ! ${lang.column} (${lang.code}) file not found — all cells will be blank.`);
    }
  }

  // Build rows in en.json order.
  const stats = {};
  target.languages.forEach((l) => { stats[l.code] = { filled: 0, blank: 0 }; });

  const rows = leaves.map(({ path: p, value: enValue }) => {
    const row = mapPathToColumns(p, target.keyColumns);
    for (const lang of target.languages) {
      if (lang === englishLang) {
        row[lang.column] = enValue;
        stats[lang.code].filled += 1;
        continue;
      }
      const stored = getAtPath(langData[lang.code], p);
      if (isValidTranslation(stored, enValue, lang.script)) {
        row[lang.column] = stored;
        stats[lang.code].filled += 1;
      } else {
        row[lang.column] = '';
        stats[lang.code].blank += 1;
      }
    }
    return row;
  });

  // Serialize CSV (UTF-8 BOM so Excel/Sheets render Indic + Urdu correctly).
  const headers = [...target.keyColumns, ...target.languages.map((l) => l.column)];
  const lines = [headers.map(escapeCsvField).join(',')];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvField(row[h])).join(','));
  }
  const BOM = String.fromCharCode(0xFEFF);
  const csvText = BOM + lines.join('\n') + '\n';

  fs.mkdirSync(path.dirname(target.outputCsv), { recursive: true });
  fs.writeFileSync(target.outputCsv, csvText, 'utf-8');

  console.log(`  ✓ Wrote ${rows.length} rows -> ${target.outputCsv}`);
  for (const lang of target.languages) {
    if (lang === englishLang) continue;
    const s = stats[lang.code];
    console.log(`      ${lang.column.padEnd(9)} translated: ${String(s.filled).padStart(4)}   needs translation (blank): ${s.blank}`);
  }
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
