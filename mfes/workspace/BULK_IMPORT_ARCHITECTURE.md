# Bulk Import Module — Architecture & Implementation Guide
**Pratham 2.0 | Workspace MFE**

---

## Table of Contents
1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Frontend Flow (6-Step UI)](#frontend-flow)
4. [Excel Schema](#excel-schema)
5. [Framework Logic](#framework-logic)
6. [Processing Architecture](#processing-architecture)
7. [Dependency Resolution](#dependency-resolution)
8. [API Mapping](#api-mapping)
9. [Validation Layer](#validation-layer)
10. [Retry & Rollback Strategy](#retry--rollback-strategy)
11. [Error Reporting](#error-reporting)
12. [Google Drive Integration](#google-drive-integration)
13. [Sidebar Integration](#sidebar-integration)
14. [Dependencies to Install](#dependencies-to-install)

---

## Overview

The Bulk Import module allows platform admins and content creators to import **Content**, **Question Sets**, **Questions**, and **Courses** in bulk via a structured Excel (.xlsx) file.

### What it supports:
- Bulk content creation with Google Drive file upload
- Bulk question set + question creation (MCQ, Arrange, Match, Subjective)
- Bulk course creation with unit/section structure
- Mapping courses to new OR existing content/question sets
- Cross-sheet temp ID referencing (TEMP_CONTENT_1 → do_xxxxx after creation)
- Dependency-aware processing (children created before parents)
- Retry with exponential backoff
- Partial success handling
- Downloadable error & success reports

---

## File Structure

```
mfes/workspace/src/
├── types/
│   └── bulkImport.types.ts          # All TypeScript types/interfaces
│
├── services/
│   └── BulkImportService.ts         # API layer (content/QS/course/drive APIs)
│
├── utils/
│   ├── bulkImportParser.ts          # Excel → ParsedImportData parser
│   ├── bulkImportValidator.ts       # Client-side validation engine
│   └── bulkImportQueue.ts           # Processing queue with dependency resolution
│
├── components/bulk-import/
│   ├── BulkImportStepper.tsx        # Main orchestrator (6 steps)
│   ├── TemplateDownload.tsx         # Step 1: Download template
│   ├── FileUpload.tsx               # Step 2: Upload Excel
│   ├── DataPreview.tsx              # Step 3: Preview parsed data
│   ├── ValidationResults.tsx        # Step 4: Validation errors + warnings
│   ├── ImportProgress.tsx           # Step 5: Live job progress
│   └── ImportSummary.tsx            # Step 6: Results + download reports
│
├── pages/
│   ├── workspace/content/bulk-import/
│   │   └── index.tsx                # Route: /workspace/content/bulk-import
│   └── api/bulk-import/
│       ├── template.ts              # GET /api/bulk-import/template → .xlsx download
│       └── download-drive-file.ts   # POST /api/bulk-import/download-drive-file
│
└── public/
    └── Bulk_Import_Template.xlsx    # Pre-built sample template
```

---

## Frontend Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        6-Step Stepper UI                            │
│                                                                     │
│  [1] Download  →  [2] Upload  →  [3] Preview  →  [4] Validate  →  │
│                                                                     │
│                         [5] Import  →  [6] Summary                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Step 1 — Download Template
- Shows template overview (7 sheets, purpose of each)
- Download button → `GET /api/bulk-import/template`
- Instructions panel with filling guidelines

### Step 2 — Upload Excel
- Drag & drop or click-to-browse file picker
- Accepts `.xlsx` / `.xls`, max 50 MB
- Calls `parseImportExcel(file)` on the client (no upload to server needed)
- Shows parsing spinner during `FileReader` + XLSX processing

### Step 3 — Preview Data
- Tabbed view: Content | Question Sets | Questions | Courses | Mappings
- Shows row counts and a scrollable table per tab
- User verifies data before triggering validation

### Step 4 — Validate
- Runs `validateImportData()` synchronously on parsed data
- Shows grouped error accordion by sheet name
- Error/Warning filter chips
- Download validation error report (Excel) button
- **Start Import** button only enabled when `isValid === true`

### Step 5 — Import Progress
- Initialises `BulkImportQueue`, calls `queue.buildJobs()` + `queue.run()`
- Live job table: status icon, job type, temp ID, result/error, retry count
- Overall progress bar with % complete
- Stop Import button (calls `queue.abort()`)

### Step 6 — Summary
- Phase banner: Completed / Partially Completed / Failed
- Stat cards: Total / Succeeded / Failed / Skipped
- Resolved ID table (Temp ID → Platform Identifier) with View links
- Failed job table with error messages
- Download Created IDs report
- Download Failure report
- Start New Import button

---

## Excel Schema

### Sheet 1: Content

| Column | Required | Type | Example | Notes |
|---|---|---|---|---|
| Temp ID | ✅ | String | TEMP_CONTENT_1 | Must be TEMP_CONTENT_N format |
| Name | ✅ | String | Introduction to Algebra | Max 250 chars |
| Description | ❌ | String | Basic algebra... | |
| Primary Category | ✅ | Dropdown | Learning Resource | From LookupData sheet |
| Framework | ✅ | Dropdown | pos-framework | pos-framework OR scp-framework |
| Subject | ❌ | String | Mathematics | |
| Medium | ❌ | String | English | |
| Grade Level | ❌ | String | Grade 8 | |
| Audience | ❌ | Dropdown | Student | |
| Language | ❌ | Dropdown | English | |
| Keywords | ❌ | String | algebra, math | Comma-separated |
| License | ❌ | String | CC BY 4.0 | |
| Copyright | ❌ | String | Pratham | |
| Copyright Year | ❌ | String | 2024 | |
| Author | ❌ | String | John Doe | |
| **Google Drive URL** | ✅ | URL | https://drive.google.com/file/d/... | Public share link |
| **File Type** | ✅ | Dropdown | pdf | pdf / zip / mp4 / h5p |

### Sheet 2: QuestionSets

| Column | Required | Example | Notes |
|---|---|---|---|
| Temp ID | ✅ | TEMP_QS_1 | Must be TEMP_QS_N format |
| Name | ✅ | Chapter 1 Test | |
| Primary Category | ✅ | Practice Question Set | |
| Framework | ✅ | pos-framework | |
| Subject | ❌ | Mathematics | |
| Max Attempts | ❌ | 3 | Positive integer |
| Show Feedback | ❌ | true | true / false |
| Show Solutions | ❌ | true | true / false |

### Sheet 3: Questions

| Column | Required | Example | Notes |
|---|---|---|---|
| QuestionSet Temp ID | ✅ | TEMP_QS_1 | Must match a row in QuestionSets sheet |
| Section Name | ❌ | Section 1 | Groups questions under sections |
| Question Type | ✅ | MCQ | MCQ / Arrange / Match / Subjective |
| Question Text | ✅ | What is 2+2? | |
| Options | ❌ (req for MCQ/Arrange/Match) | 3\|4\|5\|6 | Pipe-separated; Match uses Key:Value\|Key:Value |
| Correct Answer | ❌ | 4 | |
| Max Score | ❌ | 1 | Positive number |
| Blooms Level | ❌ | Remember | |
| Difficulty | ❌ | Easy | |
| Hint | ❌ | Think about... | |
| Solution | ❌ | 2+2=4 | |

**Question Type formats:**
- **MCQ**: Options = `OptionA|OptionB|OptionC|OptionD`, Correct Answer = `OptionB`
- **Arrange**: Options = `5|2|8|1`, Correct Answer = `1|2|5|8`
- **Match**: Options = `Term1:Def1|Term2:Def2`, Correct Answer = same pairs
- **Subjective**: Options and Correct Answer are optional

### Sheet 4: Courses

| Column | Required | Example |
|---|---|---|
| Temp ID | ✅ | TEMP_COURSE_1 |
| Name | ✅ | Algebra Fundamentals |
| Description | ❌ | Complete course... |
| Framework | ✅ | pos-framework |
| Subject, Medium, Grade Level, Audience, Language, Keywords, License, Copyright, Author | ❌ | (same as Content) |

### Sheet 5: CourseChildrenMapping

| Column | Required | Example | Notes |
|---|---|---|---|
| Course Temp ID | ✅ | TEMP_COURSE_1 | Must match Courses sheet |
| Unit Name | ✅ | Unit 1: Introduction | Groups children under units |
| Child Ref | ✅ | TEMP_CONTENT_1 | Temp ID OR real do_xxxx identifier |
| Child Type | ✅ | content | content / questionset |
| Sequence | ✅ | 1 | Positive integer, ordering within unit |

### Sheet 6: ExistingContentMapping

| Column | Required | Example | Notes |
|---|---|---|---|
| Temp ID | ✅ | TEMP_EXISTING_1 | Use this ID in CourseChildrenMapping |
| Existing Identifier | ✅ | do_abc123 | Real platform identifier |
| Entity Type | ✅ | content | content / questionset |

### Sheet 7: LookupData
Reference-only sheet. Lists all valid values for dropdown columns.

---

## Framework Logic

```typescript
// Content: ALWAYS pos-framework (hardcoded)
const contentFramework = 'pos-framework';

// QuestionSet / Course: read from localStorage
const collectionFramework = localStorage.getItem('collectionFramework');
const qsAndCourseFramework = collectionFramework === 'scp-framework'
  ? 'scp-framework'
  : 'pos-framework';
```

Users can also override framework per-row in the Excel (Framework column).

---

## Processing Architecture

```
ParsedImportData
       │
       ▼
BulkImportQueue.buildJobs()
  ├─ Content jobs:
  │   ├─ create_content (no deps)
  │   ├─ upload_content_file (deps: create_content)
  │   └─ review_content (deps: upload_content_file)
  │
  ├─ QuestionSet jobs:
  │   ├─ create_questionset (no deps)
  │   ├─ create_question × N (deps: create_questionset)
  │   └─ update_questionset_hierarchy (deps: all create_question)
  │
  └─ Course jobs:
      ├─ create_course (deps: all child terminal jobs)
      └─ update_course_hierarchy (deps: create_course)
           │
           └── Resolves child identifiers from resolvedIds map
                before calling hierarchy update API
       │
       ▼
BulkImportQueue.run()
  ├─ Topological sort of all jobs
  ├─ Tick loop (200ms interval)
  ├─ Launch up to MAX_CONCURRENCY=3 jobs at a time
  ├─ Each job: executeJob() → runJobWithRetry() → dispatchJob()
  ├─ On success: store resolvedId (tempId → platformId)
  ├─ On failure: mark failed, propagate skip to dependents
  └─ onProgress() emits live progress to React state
```

### Concurrency Model

```
Time →
  [create_content_1]  ────────────────────►
  [create_content_2]  ────────────────►
  [create_qs_1]       ──────────►
                                  ↓
  [upload_content_1]              ──────────────────►
  [create_question_0]             ──────►
  [create_question_1]             ──────────►
                                              ↓
  [review_content_1]                          ──────►
  [update_qs_hierarchy]                       ──────────►
                                                          ↓
  [create_course_1]    (waits for all above)              ──────►
  [update_course_hierarchy]                                       ──────►
```

---

## Dependency Resolution

```
Example Excel:
  Content:         TEMP_CONTENT_1
  QuestionSets:    TEMP_QS_1
  Courses:         TEMP_COURSE_1
  Mappings:        TEMP_COURSE_1 → TEMP_CONTENT_1, TEMP_QS_1

Generated Dependency Graph:
  TEMP_CONTENT_1 (no deps)
  TEMP_QS_1      (no deps)
  TEMP_COURSE_1  (depends on: review_content_TEMP_CONTENT_1, 
                              hierarchy_qs_TEMP_QS_1)

Processing Order (topological sort):
  1. create_content_TEMP_CONTENT_1
  2. create_qs_TEMP_QS_1
  3. upload_content_file_TEMP_CONTENT_1
  4. create_question_TEMP_QS_1_0, _1, _2...
  5. review_content_TEMP_CONTENT_1
  6. update_questionset_hierarchy_TEMP_QS_1
  7. create_course_TEMP_COURSE_1  ← waits for steps 5 & 6
  8. update_course_hierarchy_TEMP_COURSE_1

resolvedIds Map (built during processing):
  {
    "TEMP_CONTENT_1": "do_content_abc123",
    "TEMP_QS_1":      "do_qs_xyz789",
    "TEMP_COURSE_1":  "do_course_ghi456"
  }
```

---

## API Mapping

| Operation | Method | Endpoint | Notes |
|---|---|---|---|
| Create Content | POST | `/action/content/v3/create` | Returns `identifier` |
| Get Upload URL | POST | `/action/content/v3/upload/url/{contentId}` | Returns `pre_signed_url` |
| Upload to S3 | PUT | `{pre_signed_url}` | Direct PUT with file buffer |
| Associate File | POST | `/action/content/v3/update/{contentId}` | Sets `artifactUrl` |
| Review Content | POST | `/action/content/v3/review/{contentId}` | Submit for review |
| Read Content | GET | `/action/content/v3/read/{contentId}` | Verify status |
| Create QuestionSet | POST | `/action/questionset/v2/create` | Returns `identifier` |
| Create Question | POST | `/action/question/v2/create` | Returns `identifier` |
| Update QS Hierarchy | PATCH | `/action/questionset/v2/hierarchy/update` | Attach sections + questions |
| Create Course | POST | `/action/content/v3/create` | mimeType = `application/vnd.ekstep.content-collection` |
| Update Course Hierarchy | PATCH | `/action/content/v3/hierarchy/update` | Attach units + children |
| Read Form Fields | POST | `/action/data/v1/form/read` | For form metadata |
| Read QS Definition | POST | `/action/object/category/definition/v1/read` | QS form definition |
| Download Drive File | POST | `/api/bulk-import/download-drive-file` | Internal proxy |
| Get Template | GET | `/api/bulk-import/template` | Returns .xlsx file |

---

## Validation Layer

### Client-side (sync, instant):
- Mandatory field checks per sheet
- Temp ID format validation (`TEMP_CONTENT_N`, `TEMP_QS_N`, etc.)
- Duplicate temp ID detection within a sheet
- File type validation (pdf/zip/mp4/h5p)
- Framework validation (pos-framework/scp-framework)
- Google Drive URL format validation (must contain `drive.google.com`)
- Drive file ID extraction check
- Cross-sheet reference validation (Course's children must exist in other sheets)
- Question type enum validation
- MCQ/Match options format check
- Sequence field type check

### Async validation (optional enhancement):
```typescript
// Can be added as a pre-import step:
// - HEAD request to drive URL to verify accessibility
// - GET /action/content/v3/read/{existingId} to verify existing identifiers
```

### Error severity levels:
- **Error** → blocks import, must be fixed
- **Warning** → shown but does not block import

---

## Retry & Rollback Strategy

### Retry:
- Max retries: 3 per job
- Delay: exponential backoff (2s, 4s, 8s)
- 4xx errors are NOT retried (client error — fix data)
- 5xx / network errors ARE retried

### Rollback:
- The queue maintains a `rollbackRegistry[]` of all successfully created entities
- If the user clicks "Stop Import", the queue aborts further processing
- **Note:** The platform does not support transactional rollback of already-created entities. The failure report (downloadable) lists all entities that were created before abort, allowing manual cleanup if needed.
- For production, consider adding a "Rollback Created Entities" button that calls the retire/delete APIs for each item in the rollback registry.

### Partial Success:
- Failed jobs do NOT block unrelated jobs from completing
- A course job is skipped only if its direct child jobs failed
- The summary page clearly shows: created / failed / skipped counts

---

## Error Reporting

### Validation Error Report (`Bulk_Import_Validation_Errors.xlsx`):
Downloaded from Step 4. Contains:
- Sheet, Row, Temp ID, Field, Error message, Severity

### Import Failure Report (`Bulk_Import_Failures.xlsx`):
Downloaded from Step 6. Contains:
- Temp ID, Job Type, Error message

### Created IDs Report (`Bulk_Import_Created_IDs.xlsx`):
Downloaded from Step 6. Contains:
- Temp ID → Platform Identifier mapping for all successfully created entities

---

## Google Drive Integration

### Flow:
```
User provides:  https://drive.google.com/file/d/FILE_ID/view?usp=sharing
                         │
                         ▼
Client calls:   POST /api/bulk-import/download-drive-file { driveUrl }
                         │
                         ▼
Server converts: https://drive.google.com/uc?export=download&id=FILE_ID&confirm=t
                         │
                         ▼
Server downloads: axios.get(directUrl, { responseType: 'arraybuffer' })
                         │
                         ▼
Server returns: Buffer with Content-Type + x-file-name headers
                         │
                         ▼
Client receives: ArrayBuffer → PUT to pre-signed S3 URL
```

### Requirements for Drive URLs:
- The file must be shared as "Anyone with the link can view"
- Supported URL formats:
  - `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
  - `https://drive.google.com/open?id=FILE_ID`

### Large file handling:
- Files > 25 MB may trigger Google's virus scan interstitial
- The `&confirm=t` parameter bypasses this for programmatic access
- Max allowed file size: 100 MB (configurable in API route)

---

## Sidebar Integration

The "Bulk Import" menu item has been added to `SideBar.tsx`:

```typescript
{
  text: 'Bulk Import',
  key: 'bulk-import',
  icon: <UploadFileOutlinedIcon />,
}
```

Route: `/workspace/content/bulk-import`

Access: Available to all user roles (SCTA, CCTA, Central Admin). Add role-based filtering in `menuItems` array if needed.

---

## Dependencies to Install

```bash
npm install xlsx uuid axios
npm install --save-dev @types/uuid
```

The `xlsx` library is used for:
1. Parsing uploaded Excel files (client-side via FileReader)
2. Generating the template Excel (server-side in the API route)
3. Generating error/success report downloads

---

## Environment Variables

No new env vars required. The module uses existing:
- `NEXT_PUBLIC_MIDDLEWARE_URL` — already defined
- API calls use the existing Interceptor/RestClient setup

---

## Performance Considerations

| Scenario | Impact | Mitigation |
|---|---|---|
| 100 content rows | ~300 API calls | MAX_CONCURRENCY=3 limits parallel requests |
| Large video files (>50 MB) | Slow Google Drive download | 90s server timeout, streaming response |
| Deep course hierarchies | Many hierarchy updates | Batch all children per unit in one PATCH |
| Network failures | Jobs fail | Exponential backoff up to 3 retries |
| Browser tab close mid-import | Progress lost | Future: persist queue to IndexedDB |

---

## Future Enhancements

1. **Server-side queue** — Move processing to a background job queue (Bull/BullMQ) so browser tab close doesn't interrupt
2. **Import history** — Store past import sessions in a database
3. **Async Drive validation** — Pre-validate all Drive URLs before starting import
4. **S3 multipart upload** — For files > 5 MB use the existing multipart upload API routes
5. **Resume interrupted imports** — Persist `resolvedIds` to localStorage to resume
6. **Role-based access** — Restrict Bulk Import to only Content Creator role
7. **Excel dropdown validation** — Add Excel data validation dropdowns in the template (requires `xlsx-populate` library)
