# Manager Dashboard — Execution Document

This document records the work executed on the **Manager Dashboard** feature (`mfes/youthNet`) across three merged pull requests on the `feat-sonar-issue` branch.

| PR | Title | Merged | Merge Commit |
|----|-------|--------|--------------|
| [#3275](https://github.com/tekdi/pratham2.0/pull/3275) | FE : Manager Dashboard Revamp | 2026-07-14 | `597ec908` |
| [#3308](https://github.com/tekdi/pratham2.0/pull/3308) | fix: update status normalization map to include alternative status strings | — | `e045eedf` |
| [#3314](https://github.com/tekdi/pratham2.0/pull/3314) | feat: enhance course filtering by adding contentLanguage and improving language display | — | `aaa872f3` |

---

## 1. Overview

The Manager Dashboard lets a manager review their team's learning activity: course status, individual learner progress, course-level breakdowns, quiz attempt outliers, and top performers. It lives at:

- Route: `mfes/youthNet/src/pages/manager-dashboard/index.tsx`
- Employee drill-down route: `mfes/youthNet/src/pages/manager-dashboard/team/[userId].tsx`
- Components: `mfes/youthNet/src/components/ManagerDashboard/`

PR #3275 is the foundational rebuild; #3308 and #3314 are follow-up fixes/enhancements on top of it.

---

## 2. PR #3275 — Manager Dashboard Revamp

**Scope:** 51 files changed, +5,531 / -1,442 lines. Replaced a single 618-line monolithic `IndividualProgress.tsx` with a tabbed, modular dashboard.

### 2.1 Page & Tab Structure

`pages/manager-dashboard/index.tsx` now drives a tabbed layout via a `?tab=` query param (`ManagerDashboardTabKey`, default `DEFAULT_MANAGER_DASHBOARD_TAB`), routed through `DashboardHeader`. Tabs:

- **Courses** — course list with filtering and per-course status breakdown
- **Individual Progress** — per-learner progress table
- **Course Breakdown** — per-course learner progress/status detail
- **High Quiz Attempts** — learners with elevated quiz attempt counts
- **Top Performers** — top 5 learners by learning summary

### 2.2 New Component Modules

| Module | Purpose |
|--------|---------|
| `CoursesList/` (`CourseList`, `CourseRow`, `CoursesFilterBar`, `FilterPill`, `MultiFilterPill`, `CourseStatusChip`, `CourseStatusModal`) | Course listing, filter bar (type/language/name), and the 5-way status chip + modal per course |
| `CourseBreakdown/` (`CourseBreakdownList`, `CourseProgressCard`, `CourseLearnersModal`) | Per-course progress cards and a modal listing learners at a given status |
| `IndividualProgressTable.tsx` | Slimmed-down successor to the old `IndividualProgress.tsx` |
| `EmployeeDetail/` (`EmployeeProfileCard`, `EmployeeSummaryCards`/`EmployeeSummaryCard`, `EmployeeCourseGroup`, `EmployeeCourseRow`, `EmployeeCourseBreakdown`) | Rendered on the new `team/[userId].tsx` employee drill-down page |
| `HighQuizAttemptSection.tsx` | High quiz attempt count table with sort/filter |
| `TopPerformersSection.tsx` | Top performers list |
| `DashboardHeader.tsx`, `StatusLegend.tsx`, `SegmentedProgressBar.tsx`, `EmployeeFlags.tsx`, `UserCourseProgress.tsx` | Supporting header/legend/progress-bar/flag UI pieces |
| `common/SearchableMultiSelectDropdown.tsx`, `common/Modal.tsx` | New reusable, dashboard-agnostic UI primitives |
| `libs/shared-lib-v2` → `Pagination/CommonPagination.tsx` | Shared pagination component exported from `shared-lib-v2` for reuse beyond this dashboard |

### 2.3 Data & State Plumbing

- **`hooks/useManagerDashboardData.ts`** — single hook that loads users, courses, and the course learning summary once, shared by every tab and by the Employee Detail page (avoids duplicate fetches on tab switch).
- **`hooks/useManagerDashboardUIState.ts`** — holds filters/pagination/sort as module-level state (not plain `useState`) so navigating to the Employee Detail page and back doesn't reset the dashboard to its defaults.
- **`utils/managerDashboardHelpers.ts`** (567 new lines) — pure functions for building lookup maps (`buildUserById`, `buildCourseById`), filtering/scoping the learning summary, computing top performers and high-quiz-attempt users, and course status/language helpers.
- **`utils/app.config.ts`** (145 new lines) — single source of truth for default filters, course language options, and the `STATUS_NORMALIZATION_MAP` (backend status strings → 4 UI statuses: `notStarted` / `inProgress` / `completed` / `certificateIssued`).
- **`utils/Interface.ts`** (466 new lines) — typed contracts for courses, users, filters, and dashboard-wide props.
- **`services/PlayerService.ts`** — course-fetch service used by the data hook.

### 2.4 i18n

New `MANAGER_OVERVIEW.*` translation keys added to `public/locales/{en,hi,mr,ur}/common.json` (~99 keys each) covering filters, statuses, and section labels across all four supported languages.

---

## 3. PR #3308 — Status Normalization Fix

**File changed:** `mfes/youthNet/src/utils/app.config.ts` (+6/-2)

**Problem:** `STATUS_NORMALIZATION_MAP` (introduced in #3275) mapped `in_progress` (underscored), but the real `/tracking/content/course/status` endpoint returns `inprogress` (no underscore) — so those learners were silently falling back to `notStarted` instead of showing as in-progress.

**Fix:** Added `inprogress: 'inProgress'` alongside the existing `in_progress` entry, so both spellings normalize correctly. The map now documents (via comment) that the endpoint's actual strings are `not_started` / `inprogress` / `completed` / `viewCertificate`, and that both the guessed and real spellings are kept mapped as a single source of truth:

```ts
export const STATUS_NORMALIZATION_MAP: Record<string, NormalizedStatus> = {
  not_started: 'notStarted',
  in_progress: 'inProgress',
  inprogress: 'inProgress',
  completed: 'completed',
  certificate_issued: 'certificateIssued',
  viewCertificate: 'certificateIssued',
};
```

---

## 4. PR #3314 — Content Language Filtering

**Files changed:** `CoursesFilterBar.tsx`, `HighQuizAttemptSection.tsx`, `PlayerService.ts`, `Interface.ts`, `app.config.ts`, `managerDashboardHelpers.ts` (+32/-6)

**Problem:** The course language filter only ever offered a fixed EN/HI pair, and course rows displayed languages as 2-letter codes rather than readable names — courses in Marathi, Tamil, etc. had no way to be filtered or clearly labeled.

**Changes:**

- **`Course` interface** (`utils/Interface.ts`) — added `contentLanguage?: string`, documented as preferred over the existing `language` array for filtering/display.
- **`PlayerService.ts`** (`fetchCourses`) — added `contentLanguage` to the list of fields requested from the composite search API.
- **`managerDashboardHelpers.ts`**:
  - `getCourseLanguageLabel` now prefers `course.contentLanguage` over `course.language[0]`.
  - New `getCourseLanguageName` returns the full human-readable name (e.g. "Marathi"), falling back to the raw `language` value, then `"English"`.
- **`app.config.ts`** — `COURSE_LANGUAGE_OPTIONS` labels changed from `'EN'`/`'HI'` to `'English'`/`'Hindi'`.
- **`CoursesFilterBar.tsx`** — language filter options are now built dynamically: the fixed English/Hindi options are always present, and any other language found among the currently loaded courses is appended using its real name as the label, so the dropdown never hides an available language.
- **`HighQuizAttemptSection.tsx`** — minor UI fix, added `minWidth: '120px'` to the sort button so its label doesn't reflow when toggling sort direction.

---

## 5. Files Changed Summary

### PR #3275 (selected — 51 files total)
New: `CoursesList/*`, `CourseBreakdown/*`, `EmployeeDetail/*`, `DashboardHeader.tsx`, `HighQuizAttemptSection.tsx`, `TopPerformersSection.tsx`, `StatusLegend.tsx`, `SegmentedProgressBar.tsx`, `EmployeeFlags.tsx`, `UserCourseProgress.tsx`, `IndividualProgressTable.tsx`, `common/Modal.tsx`, `common/SearchableMultiSelectDropdown.tsx`, `hooks/useManagerDashboardData.ts`, `hooks/useManagerDashboardUIState.ts`, `utils/managerDashboardHelpers.ts`, `utils/app.config.ts`, `utils/Interface.ts`, `utils/scrollbarSx.ts`, `pages/manager-dashboard/team/[userId].tsx`, `libs/shared-lib-v2/.../CommonPagination.tsx`, `courseLearningSummary.ts`
Heavily modified: `pages/manager-dashboard/index.tsx` (1108 → largely restructured), `components/MenuDrawer.tsx`, all 4 locale `common.json` files
Removed: legacy `components/ManagerDashboard/types.ts`

### PR #3308
- `mfes/youthNet/src/utils/app.config.ts` — +6/-2

### PR #3314
- `mfes/youthNet/src/components/ManagerDashboard/CoursesList/CoursesFilterBar.tsx` — +19/-2
- `mfes/youthNet/src/components/ManagerDashboard/HighQuizAttemptSection.tsx` — +1/-1
- `mfes/youthNet/src/services/PlayerService.ts` — +1
- `mfes/youthNet/src/utils/Interface.ts` — +3
- `mfes/youthNet/src/utils/app.config.ts` — +2/-2
- `mfes/youthNet/src/utils/managerDashboardHelpers.ts` — +6/-1

---

## 6. PR Links

- Revamp: https://github.com/tekdi/pratham2.0/pull/3275
- Status normalization fix: https://github.com/tekdi/pratham2.0/pull/3308
- Content language filtering: https://github.com/tekdi/pratham2.0/pull/3314
