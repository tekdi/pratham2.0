# Translation Scripts Documentation

## What This Project Does

This project handles **app translation data** for the Pratham Learner Android app.
It converts translation data between two formats: **JSON files** (used by the app) and a **CSV spreadsheet** (used by translators).

---

## Files in This Project

| File | Purpose |
|------|---------|
| `en.json`, `hi.json`, `mr.json`, etc. | Translation files, one per language |
| `Pratham_ Translations - Learner Android (1).csv` | Master spreadsheet with all translations |
| `output.csv` | Generated CSV combining all language JSON files |
| `jsonToCsv.js` | Script: converts JSON files → one combined CSV |
| `csvToJson.js` | Script: converts CSV → individual JSON files |

---

## Supported Languages

| Short Code | Language |
|------------|----------|
| `en` | English |
| `hi` | Hindi |
| `mr` | Marathi |
| `odi` | Odiya |
| `tel` | Telugu |
| `kan` | Kannada |
| `tam` | Tamil |
| `gu` | Gujarati |
| `ur` | Urdu |

---

## Script 1: `jsonToCsv.js` — JSON to CSV

### What it does
Reads all the individual language JSON files and combines them into a single CSV file (`output.csv`).

### How it works (step by step)

1. **Reads each language JSON file** (e.g., `en.json`, `hi.json`, etc.)
2. **Loops through every translation key** in each file. The JSON can have up to 3 levels:
   - `Module` → `Submodule` → `Key` (e.g., `LEARNER_APP` → `COMMON` → `L1_COURSES`)
   - `Module` → `Key` (e.g., `LEARNER_APP` → `other_filters`)
   - Just a `Key` at the root level (e.g., `welcome`)
3. **Combines all languages** into one big table — each row is one translation key with all its language values side by side.
4. **Sorts the rows** before writing:
   - First: rows that have **all languages** translated (complete rows)
   - Then: rows that are **partially translated** (some languages missing)
   - Last: rows that have **only English** (need translation)
5. **Writes `output.csv`** with columns: Module, Submodule, Key, English, Marathi, Hindi, Odiya, Telugu, Kannada, Tamil, Gujarati, Urdu

### How to run
```bash
node jsonToCsv.js
```

### Output
A file called `output.csv` is created in the same folder.

---

## Script 2: `csvToJson.js` — CSV to JSON

### What it does
Reads the master CSV spreadsheet (filled in by translators) and splits it back into individual JSON files, one per language.

### How it works (step by step)

1. **Reads the CSV file** (`Pratham_ Translations - Learner Android (1).csv`)
2. **Loops through each row** in the CSV. Each row has: Module, Submodule, Key, and translation columns for each language.
3. **Skips rows** where the `Key` column is empty.
4. **Skips empty translation values** — if a language column is blank for a row, it is not added to that language's JSON.
5. **Builds the correct JSON structure** based on whether the row has a Module/Submodule:
   - Module + Submodule + Key → `{ MODULE: { SUBMODULE: { key: "value" } } }`
   - Module + Key only → `{ MODULE: { key: "value" } }`
   - Key only → `{ key: "value" }`
6. **Writes one JSON file per language** (e.g., `en.json`, `hi.json`, etc.) in the current folder.

### How to run
```bash
node csvToJson.js
```

### Output
Individual JSON files are created/updated: `en.json`, `hi.json`, `mr.json`, `odi.json`, `tel.json`, `kan.json`, `tam.json`, `gu.json`, `ur.json`

---

## Typical Workflow

```
App JSON files  ──[jsonToCsv.js]──►  output.csv  ──► Send to translators
                                                              │
                                                              ▼
App JSON files  ◄──[csvToJson.js]──  Filled CSV  ◄── Translators fill it
```

1. Run `jsonToCsv.js` to export all translations into a single spreadsheet.
2. Share the CSV with translators to fill in missing language columns.
3. Once translations are added, run `csvToJson.js` to convert the updated CSV back into JSON files.
4. Use the updated JSON files in the app.

---

## JSON File Structure Example

```json
{
  "welcome": "Welcome",
  "LEARNER_APP": {
    "other_filters": "Other Filters",
    "COMMON": {
      "L1_COURSES": "Courses"
    }
  }
}
```

- **Root level key**: just `"welcome": "Welcome"`
- **Module level key**: `LEARNER_APP.other_filters`
- **Module + Submodule key**: `LEARNER_APP.COMMON.L1_COURSES`
