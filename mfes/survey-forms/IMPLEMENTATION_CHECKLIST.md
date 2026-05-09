# Survey Forms MFE - Implementation Checklist

Last verified: `2026-04-21 16:28:11 IST`

## Why this change set exists

We split learner and teacher entry flows so host MFEs can call role-specific routes:

- Learner-like flow continues via `survey-list`.
- Teacher-like flow now uses dedicated routes with a contextual filter hub.
- Self-context surveys still open directly into fill pages.

This keeps integration simple for other MFEs: they choose the route by role and let survey-forms handle the right UI.

## What is done

### 1) Role-specific routes are present

- Teacher list route: `src/app/teacher-survey-list/page.tsx`
- Teacher list component: `src/app/teacher-survey-list/TeacherSurveyListPage.tsx`
- Teacher hub route: `src/app/teacher-survey-fill/[surveyId]/hub/page.tsx`
- Teacher hub component: `src/app/teacher-survey-fill/[surveyId]/hub/TeacherContextHubPage.tsx`

### 2) Route resolution logic is implemented

- Shared resolver includes teacher-specific path selection:
  - File: `src/utils/resolveSurveyFillRoute.ts`
  - `resolveTeacherPostListRoute()`:
    - `self` / `none` -> `/survey-fill/{surveyId}/self`
    - contextual (`learner`/`center`/etc.) -> `/teacher-survey-fill/{surveyId}/hub`

### 3) Teacher hub filter UI is implemented

- Search + optional cohort selector:
  - `src/Components/teacher/TeacherFilterBar.tsx`
- Data table + action CTA:
  - `src/Components/teacher/TeacherContextTable.tsx`
- Status chips:
  - `src/Components/teacher/TeacherStatusChip.tsx`
- Empty state:
  - `src/Components/teacher/TeacherEmptyState.tsx`

### 4) Teacher API integration is implemented in survey-forms

- Middleware endpoints configured:
  - `src/utils/API/EndUrls.ts`
  - `NEXT_PUBLIC_MIDDLEWARE_URL` used for teacher cohort APIs
- Teacher data fetchers:
  - `fetchTeacherCenters(userId)`
  - `fetchTeacherCohortLearners(cohortId)`
  - in `src/utils/API/surveyService.ts`

### 5) Survey status in teacher hub is now wired

- Added responses list endpoint path:
  - `API_ENDPOINTS.RESPONSE_LIST(surveyId)`
- Added service mapper:
  - `fetchResponseStatusByContext(surveyId, contextIds, respondentId?)`
  - maps to `none | draft | submitted`
- Teacher hub now passes status to table:
  - `statusByContextId={statusByContextId}`

### 6) List paging typing bug is fixed

- Updated both list pages to pass correct paginated shape into store:
  - `setSurveys(result.result.data.data, result.result.data.meta)`
- Files:
  - `src/app/survey-list/SurveyListPage.tsx`
  - `src/app/teacher-survey-list/TeacherSurveyListPage.tsx`

### 7) Config typing issue fixed

- Corrected JSDoc annotation placement in:
  - `next.config.js`

## Validation run

### TypeScript

- Command:
  - `npx tsc --noEmit -p mfes/survey-forms/tsconfig.json`
- Result:
  - Pass

### Lint diagnostics (edited files)

- Tool-based lint diagnostics checked for edited files.
- Result:
  - No linter errors.

## Integration notes for other MFEs

- Teacher hosts should call:
  - `/teacher-survey-list`
- Learner/default hosts should call:
  - `/survey-list`
- Environment required for teacher routes:
  - `NEXT_PUBLIC_MIDDLEWARE_URL` in `mfes/survey-forms/.env.example`

## Known follow-ups (not blockers for this change set)

- Current status source uses `responses/list/:surveyId` and client-side filtering by `respondentId`.
  - If backend later provides a dedicated context-summary endpoint, switch to that for efficiency.
- Teacher hub currently supports context types:
  - `learner`, `center`
  - Other context types show an explicit unsupported message.
