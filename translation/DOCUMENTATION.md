# Translation Scripts — Full Documentation

This folder contains two Node scripts that move translation data between the app's
**JSON locale files** (used by the app) and a **CSV spreadsheet** (filled in by the
client/translators):

| Script | Direction | Purpose |
|--------|-----------|---------|
| `jsonToCsv.js` | JSON → CSV | Build the sheet we send to the client for translation. |
| `csvToJson.js` | CSV → JSON | Merge the client's returned translations back into per-language JSON. |

Both scripts are **dependency-free** (plain Node, no `npm install`) and **config-driven**,
so the same file can be dropped into any repo — you only edit the `CONFIG`/`TARGETS`
block at the top.

---

## Table of Contents

1. [The translation workflow](#1-the-translation-workflow)
2. [Why the scripts were rewritten — problems with the old versions](#2-why-the-scripts-were-rewritten)
3. [What we improved (summary)](#3-what-we-improved-summary)
4. [Core concepts](#4-core-concepts)
5. [`jsonToCsv.js` — export (JSON → CSV)](#5-jsontocsvjs--export-json--csv)
6. [`csvToJson.js` — import (CSV → JSON)](#6-csvtojsonjs--import-csv--json)
7. [Configuration reference](#7-configuration-reference)
8. [Adding a new repo / app](#8-adding-a-new-repo--app)
9. [Language codes & script ranges](#9-language-codes--script-ranges)
10. [Known limitations](#10-known-limitations)

---

## 1. The translation workflow

```
                         (developers add new keys here, in English only)
                                            │
                                            ▼
  App locale JSON  ──[ jsonToCsv.js ]──►  CSV sheet  ──►  Sent to client
  (en.json is the                         (English filled,        │
   master key list)                        others blank/           │  client fills
                                            needs-translation)      ▼  translations
                                                            Returned CSV sheet
                                                                    │
  App locale JSON  ◄──[ csvToJson.js ]────────────────────────────┘
  (Outputs/<app>/<code>.json —
   every key present, translated
   or English fallback)
```

**The order that matters:**

1. Developers add new UI strings — **only to `en.json`** of the repo. Other language
   files do not get the key yet.
2. Run `jsonToCsv.js` → produces a CSV with every `en.json` key. English is filled;
   each language column is filled only where a *real* translation already exists,
   otherwise **blank**.
3. Send the CSV to the client. The client fills the blank cells. (This can take a
   week or more, during which development continues and more keys are added to `en.json`.)
4. When the sheet comes back, run `csvToJson.js` → it merges the translations back
   into per-language JSON files under `Outputs/<app>/`. Every key from `en.json` is
   present in every language file.
5. Copy the generated files into the repo's locale folder.

---

## 2. Why the scripts were rewritten

The original scripts worked for a single one-off conversion but broke down in the real,
repeated workflow. The concrete problems:

### 2.1 Data loss — the main problem (import)

The old `csvToJson.js` **rebuilt each language file from scratch** using only the CSV
contents:

```js
// OLD behaviour (simplified)
languages.forEach(code => {
  fs.writeFileSync(`${code}.json`, JSON.stringify(languageData[code], null, 2));
});
```

Because a CSV is exported at time **T** and returned a week+ later, any key a developer
added to `en.json` **after T** was **not in the CSV**. When you overwrote the app's
`en.json` (and every other language file) with the freshly generated ones, **all those
newly added keys were silently deleted.** This is the core issue the rewrite fixes.

### 2.2 New keys landed at the bottom of the sheet (export)

The old `jsonToCsv.js` sorted rows into three buckets before writing — *fully translated*,
*partially translated*, *English-only* — and concatenated them in that order:

```js
csvWriter.writeRecords([...completeRecords, ...incompleteRecords, ...onlyEnglishRecords])
```

So a newly added key (English only, no translations yet) was pushed to the **end** of
the CSV instead of sitting next to its sibling keys. Hard for the client to locate in
context.

### 2.3 Hardcoded, machine-specific, wrong paths

Both scripts hardcoded an absolute path belonging to a *different developer's machine*:

```js
'/home/ttpl-rt-132/Downloads/translation/...'   // not this machine → ENOENT
```

The scripts could not run as-is on anyone else's checkout.

### 2.4 External dependencies that weren't installed

- `jsonToCsv.js` required `csv-writer`.
- `csvToJson.js` required `csv-parser`.

Neither package was installed in this folder, so the scripts would crash on
`require()` — and they added an install step to "reuse this in another repo."

### 2.5 Output filename mismatch

The old `csvToJson.js` wrote `gu.json` for Gujarati, but the shared-lib locale folder
actually uses **`guj.json`**. The generated file was an orphan that never matched the
real file.

### 2.6 No English fallback / incomplete language files

If a language column was blank, the old importer just skipped the key for that language.
Result: language files were missing keys entirely, and the app could render a raw key
string at runtime.

### 2.7 Other robustness gaps

- **No error handling** — a missing/locked file produced a cryptic stack trace.
- **No BOM handling** — a CSV exported from Excel/Sheets often starts with a UTF-8 BOM,
  which turns the first header `Module` into `﻿Module` and silently breaks every
  lookup.
- **Inconsistent trimming** — the empty check trimmed values, but the *stored* value was
  untrimmed, so whitespace leaked into keys and values.
- **No summary** — you couldn't tell how many keys were translated, filled, or dropped.

---

## 3. What we improved (summary)

| Area | Old | New |
|------|-----|-----|
| **Data loss on import** | Full regenerate → new keys dropped | **Merge**: `en.json` is the master; every key preserved |
| **New-key placement (export)** | Sorted to bottom | Rows in **`en.json` order** — natural place |
| **Untranslated visibility** | English-only rows / skipped | **Native-script validity check** → blank cell so client re-translates |
| **Missing keys in a language** | Key skipped → file incomplete | **English fallback** → every key present in every file |
| **Paths** | Hardcoded, wrong machine | Config block at top, edit per repo/run |
| **Dependencies** | `csv-parser`, `csv-writer` | **None** — built-in CSV parser + writer |
| **Filenames** | `gu.json` (wrong) | Configurable code per language (`guj`, `gu`, `or`, …) |
| **Repo layouts** | One layout only | Supports `file` (`<code>.json`) and `dir` (`<code>/common.json`) |
| **Output location** | Current working dir | `Outputs/<app>/…` (import) / `Outputs/<app>.csv` (export) |
| **Robustness** | No error handling / BOM / trim | Error handling, BOM strip, consistent trim, RFC-4180 parser |
| **Feedback** | `console.log('done')` | Per-language summary (translated / needs-translation / fromCSV / kept / fallback / stale) |

---

## 4. Core concepts

### 4.1 `en.json` is the master

`en.json` defines **which keys exist** and **their order**. Developers only ever add new
keys to `en.json`. Both scripts walk `en.json` and treat every other file as data to fill
in against that master. Keys that exist in a CSV or old language file but **not** in
`en.json` are considered **stale** and dropped (the count is logged).

### 4.2 Merge precedence (import)

For each key, per language, `csvToJson.js` resolves the value in this order:

1. **CSV translation** — what the client just filled in (**wins**).
2. **Existing translation** — a value already present in that language file.
3. **English fallback** — the `en.json` value, so no key is ever missing at runtime.

The **English** output file is `en.json` itself, unchanged (code English is authoritative
— the CSV's English column is ignored on import).

### 4.3 The "valid translation" check (export)

Because import writes an English fallback for untranslated keys, a naive export would show
that English in the language column and make the key look "done." To keep the sheet honest,
`jsonToCsv.js` treats a stored value as a **real translation only if** it is:

- non-empty, **and**
- not identical to the English text, **and**
- contains at least one character of that language's **own script** (e.g. Devanagari for
  Hindi/Marathi, Gujarati for Gujarati, Arabic for Urdu).

If it fails any of these, the cell is exported **blank**, so the client is prompted to
translate it. This catches three cases automatically: missing keys, English placeholders,
and values pasted in the **wrong script**.

### 4.4 Two folder layouts

Different repos store locales differently. Both scripts support:

- **`file`** — one file per language: `<localesDir>/<code>.json`
  (e.g. `libs/shared-lib-v2/src/lib/context/locales/hi.json`).
- **`dir`** — a folder per language with a namespace file: `<localesDir>/<code>/<namespace>`
  (e.g. `apps/admin-app-repo/public/locales/hi/common.json`).

### 4.5 Key ↔ CSV column mapping

The CSV has `Module`, (`Submodule`), `Key` columns. A nested JSON path maps to them by
depth — the last segment is the `Key`, the preceding segments fill the module columns:

| JSON path | Module | Submodule | Key |
|-----------|--------|-----------|-----|
| `WELCOME` | | | `WELCOME` |
| `LEARNER_APP.other_filters` | `LEARNER_APP` | | `other_filters` |
| `LEARNER_APP.COMMON.L1_COURSES` | `LEARNER_APP` | `COMMON` | `L1_COURSES` |

Repos whose CSV has no `Submodule` column use `keyColumns: ['Module', 'Key']`.

---

## 5. `jsonToCsv.js` — export (JSON → CSV)

### What it does

For each configured app it reads `en.json` (keys + order + English text) and every
language file, then writes one CSV where:

- rows are in **`en.json` order**,
- the **English** column is always filled,
- each **language** column is filled **only if the stored value passes the validity
  check** (§4.3); otherwise the cell is blank.

The output CSV is written with a **UTF-8 BOM** so Excel/Google Sheets render Indic and
Urdu text correctly.

### How to run

```bash
node jsonToCsv.js
```

### Output

`translation/Outputs/<appName>.csv` and a per-language summary in the console:

```
=== learner_app ===
  ✓ Wrote 1020 rows -> .../Outputs/learner_app.csv
      Hindi     translated:  932   needs translation (blank): 88
      Gujarati  translated:  880   needs translation (blank): 140
      ...
```

### How it works (step by step)

1. Load `en.json` (the master) and every language file listed in `languages`.
2. Walk `en.json` recursively, producing leaf keys **in file order**.
3. For each key, build the `Module/Submodule/Key` columns (§4.5).
4. For each language column: English → the `en.json` value; other languages → the stored
   value if `isValidTranslation()` passes (§4.3), else blank.
5. Serialize to CSV (fields containing `,`, `"`, or newlines are quoted per RFC-4180),
   prepend the BOM, and write the file.

---

## 6. `csvToJson.js` — import (CSV → JSON)

### What it does

For each configured app it reads `en.json` (the master key set) and the client's returned
CSV, then writes one JSON file per language into `Outputs/<appName>/<code>.json`. Every
output file contains **all** of `en.json`'s keys, in `en.json` order, with each value
resolved by the merge precedence (§4.2).

### How to run

```bash
node csvToJson.js
```

### Output

`translation/Outputs/<appName>/<code>.json` (one per language, plus `en.json`) and a
per-language summary:

```
=== learner_app ===
  ✓ Wrote 9 files -> .../Outputs/learner_app  (1020 keys each)
      Hindi     fromCSV:  969   kept:    3   english-fallback:   48
      Gujarati  fromCSV:  969   kept:    2   english-fallback:   49
      ...
  ! 17 key(s) in the CSV are not in en.json (stale) — dropped.
```

- **fromCSV** — value taken from the client's sheet.
- **kept** — CSV was blank; kept the translation already in the language file.
- **english-fallback** — no translation anywhere; used the English text.
- **stale** — keys in the CSV that don't exist in `en.json`; dropped.

### How it works (step by step)

1. Parse the CSV with the built-in RFC-4180 parser (handles quoted fields, escaped `""`,
   embedded commas/newlines) and strip any BOM.
2. Build a lookup: `csvLookup[code][Module\0Submodule\0Key] = trimmed value`
   (only non-empty values; the `\0` delimiter avoids collisions with keys that contain
   spaces).
3. Load `en.json` (master) and each existing language file.
4. Walk `en.json` recursively; for each key rebuild the value per the merge precedence
   (§4.2). Nested structure and order are preserved from the master.
5. Write `Outputs/<app>/<code>.json` for every language (2-space indent, trailing newline),
   and report stale keys.

> **Note on data quality:** the importer trusts the client's cells. If a sheet contains
> messy values (e.g. a stray `" en"` suffix, or text in the wrong language), those are
> stored as-is. The *next* export's validity check (§4.3) will catch wrong-script values
> and re-flag them as blank.

---

## 7. Configuration reference

Both scripts have a `TARGETS` array near the top. Each entry describes one app:

| Field | Applies to | Meaning |
|-------|-----------|---------|
| `appName` | both | Label used for the output path (`Outputs/<appName>` or `<appName>.csv`). |
| `localesDir` | both | Absolute path to the repo's locale folder (input). |
| `layout` | both | `'file'` → `<code>.json`; `'dir'` → `<code>/<namespace>`. |
| `namespace` | both (`dir` only) | Namespace filename, e.g. `'common.json'`. |
| `keyColumns` | both | `['Module','Submodule','Key']` or `['Module','Key']`. |
| `languages` | both | Array of `{ column, code[, script] }` (see below). |
| `csvPath` | import | Absolute path to the client's returned CSV. |
| `outputDir` | import | Where the per-language JSON files are written. |
| `sourceCode` | import | The master language code (`'en'`). |
| `outputCsv` | export | Path of the CSV to write. |

`languages[]` entries:

| Field | Applies to | Meaning |
|-------|-----------|---------|
| `column` | both | The CSV column header, e.g. `'Gujarati'`. |
| `code` | both | The language filename/code, e.g. `'guj'`. Must match the repo. |
| `script` | export | Key into `SCRIPT_RANGES` for the validity check; `null` marks the master/source language (English), which is taken as-is. |

> Paths are intentionally hardcoded in the config block — edit them per repo/run. There
> is no CLI parsing; keeping it simple makes the file easy to copy into another repo.

---

## 8. Adding a new repo / app

1. Copy `jsonToCsv.js` and `csvToJson.js` into the repo (or keep them here and point
   `localesDir` at the other repo).
2. Add a new entry to `TARGETS` in **both** scripts:
   - Set `appName`, `localesDir`, `layout` (`file` vs `dir`, + `namespace`).
   - Set `keyColumns` to match the CSV (`['Module','Key']` if there's no Submodule).
   - List the `languages` with the **exact CSV column headers** and the **exact
     filename codes used in that repo**.
   - For import, set `csvPath` and `outputDir`; for export, set `outputCsv`.
3. Run each script and check the summary counts.

> ⚠️ **`odi` vs `or`:** the admin, scp-teacher, and youthNet repos contain **both**
> `odi` and `or` language folders. Confirm which one the app actually loads and set
> `code` accordingly before running against those repos.

---

## 9. Language codes & script ranges

Codes differ per repo — always match what the target repo actually uses.

| Language | shared-lib-v2 | admin / scp / youthNet | Script (for validity check) |
|----------|---------------|------------------------|-----------------------------|
| English | `en` | `en` | — (master) |
| Hindi | `hi` | `hi` | Devanagari `U+0900–097F` |
| Marathi | `mr` | `mr` | Devanagari `U+0900–097F` |
| Gujarati | `guj` | `gu` | Gujarati `U+0A80–0AFF` |
| Odiya | `odi` | `odi` / `or` | Odia `U+0B00–0B7F` |
| Telugu | `tel` | `tel` | Telugu `U+0C00–0C7F` |
| Kannada | `kan` | `kan` | Kannada `U+0C80–0CFF` |
| Tamil | `tam` | `tam` | Tamil `U+0B80–0BFF` |
| Malayalam | — | `ml` | Malayalam `U+0D00–0D7F` |
| Urdu | `ur` | `ur` | Arabic `U+0600–06FF` (+ supplements) |

---

## 10. Known limitations

- **Same-script wrong language.** The validity check is script-based, so it cannot detect
  a value that is in the *wrong Indic language but the right script* — e.g. Hindi text in
  a Marathi cell (both Devanagari). These will not be re-flagged.
- **Legitimately Latin values.** Proper nouns / acronyms whose correct translation is
  identical to English (e.g. `SMS`, `PDF`, `OK`, brand names) will keep being flagged as
  "needs translation" every cycle. A small per-key allowlist could suppress this — left
  as future scope.
- **Manual copy step.** Import writes to `Outputs/<app>/` on purpose; copying the files
  into the repo is a manual step so you can review with `git diff` first.
- **Stale keys are dropped silently from the output** (but their count is logged). If a
  key was renamed in `en.json`, its old translations won't carry over automatically.
- **Deep nesting** beyond the configured `keyColumns` is folded into the `Key` with dots
  (best-effort), and a one-time warning is printed.
