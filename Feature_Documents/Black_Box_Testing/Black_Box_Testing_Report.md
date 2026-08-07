# Black Box Testing — Code-Based Readiness Report

**Project:** Pratham 2.0 (`@shikshav2.0/source`)
**Branch analyzed:** `feat-sonar-issue`
**Date:** 2026-08-05
**Prepared for:** Client black box testing engagement
**Method:** Static source-code analysis (read-only) mapped against standard black box testing checkpoints. No application was run; no runtime/browser testing was performed as part of this report.

---

## 1. Purpose & Scope

The client intends to run black box testing on this application. Black box testing exercises the system from the outside — through the UI/API — without knowledge of internal code. This report does the reverse: it uses knowledge of the internal code to **predict where black box testing will find problems**, so the QA effort can be prioritized and scoped before testing begins.

For each generally-accepted black box testing checkpoint, this report states:
- Whether the underlying code **supports** that checkpoint being testable and passable (**Pass**),
- Whether it is **inconsistently implemented** across the codebase (**Partial**),
- Or whether the checkpoint is **not implemented / likely to fail** (**Fail / Missing**),

backed by concrete `file:line` evidence from the repository.

**In scope:** all Next.js apps in `apps/` (admin-app-repo, learner-web-app, teachers) and all micro-frontends in `mfes/` (authentication, content, editors, forget-password, login, notification, players, profile-manage, scp-teacher-repo, survey-forms, survey-observations, taxonomy-manager, workspace, youthNet), plus shared libraries `libs/shared-lib` and `libs/shared-lib-v2`.

**Out of scope:** backend/API server behavior (not in this repo), actual runtime/browser execution, load/performance testing, visual/design QA. Section 7 lists what must still be verified manually.

---

## 2. What Black Box Testing Generally Covers

Standard black box testing practice evaluates a web application against these checkpoint categories. This report is organized around them:

| # | Category | What it checks |
|---|----------|-----------------|
| 1 | **Functional / Input Validation** | Do forms accept only valid data? Are required fields, formats (email, phone), lengths, and ranges enforced? What happens with negative/boundary/special-character input? |
| 2 | **Error Handling & Recovery** | Do API failures, network errors, and unexpected states produce a clear message instead of a crash or silent failure? |
| 3 | **Authentication, Session & Access Control** | Can a user reach pages/data they shouldn't? Does the session expire/refresh correctly? Is logout complete? |
| 4 | **Usability, Accessibility & Localization** | Can the app be used with a keyboard/screen reader? Is every supported language fully translated? |
| 5 | **UI State Handling** | Loading states, empty-result states, pagination edges (first/last page, zero results), and duplicate-submission protection. |
| 6 | **Security (black-box-observable)** | Anything discoverable from the client bundle or rendered HTML: exposed secrets, unsanitized HTML injection, sensitive data in logs, open redirects. |
| 7 | **Compatibility** | Cross-browser/device rendering — cannot be assessed from source; manual only. |
| 8 | **Performance/Load** | Response times under load — cannot be assessed from source; manual/tool-based only. |

Sections 5.1–5.6 cover categories 1–6 with code evidence. Category 7–8 are addressed in Section 7.

---

## 3. Application Under Test

| Area | Apps / MFEs | Purpose |
|------|-------------|---------|
| Host apps | `apps/admin-app-repo`, `apps/learner-web-app`, `apps/teachers` | Admin console, learner-facing portal, teacher portal |
| Auth & account | `mfes/authentication`, `mfes/login`, `mfes/forget-password`, `mfes/profile-manage` | Login, password reset, profile management |
| Content | `mfes/content`, `mfes/players`, `mfes/editors` | Content browsing, Sunbird content player, content authoring |
| Workspace/teacher tools | `mfes/workspace`, `mfes/scp-teacher-repo`, `mfes/taxonomy-manager` | Bulk import, AI assessments, attendance, taxonomy management |
| Survey | `mfes/survey-forms`, `mfes/survey-observations` | Dynamic survey rendering and observation capture |
| Cross-cutting | `mfes/youthNet`, `mfes/notification`, `libs/shared-lib`, `libs/shared-lib-v2` | Manager dashboard, notifications, shared UI/data components |

There is **no existing automated black-box/E2E test suite**: `mfes/scp-teacher-repo/cypress.config.ts` exists but contains only default boilerplate with zero test specs, and no Playwright/Cypress spec files were found anywhere in the repo. Black box testing here will be the **first regression safety net** for this application — findings should be captured as reusable test cases (see the companion checklist) rather than one-off bug reports.

---

## 4. Executive Summary

Across 36 checkpoints evaluated (6 per category, Sections 5.1–5.6):

| Verdict | Count | Meaning |
|---------|-------|---------|
| ✅ Pass / robust | 8 | Implemented consistently, code supports the black box test passing |
| 🟡 Partial / inconsistent | 20 | Implemented in some apps/mfes but not others — expect *inconsistent* black box results depending on which module is tested |
| 🔴 Fail / Missing / Notable risk | 8 | Not implemented, or implemented in a way likely to fail / expose risk |

**Top 5 issues to prioritize before or during black box testing** (full detail in Section 6):

1. **OAuth `client_secret` and a static bearer token/cookie are shipped in the browser bundle** (`apps/teachers`, `mfes/taxonomy-manager`) — extractable by anyone via browser devtools.
2. **Real usernames/passwords are logged to the browser console** during registration/login (`apps/learner-web-app`, `apps/teachers`).
3. **Client-side password validation is broken** on the primary login form — the password error state is declared but never set, so it can never block a bad password format from being submitted (`mfes/authentication/src/pages/login.tsx`).
4. **Role/tenant-based route restriction (`RouteGuard`) is disabled** via a code comment in the admin app, so its access-control logic is not actually enforced (`apps/admin-app-repo/src/pages/_app.tsx:159`).
5. **13 of 14 places that inject raw HTML into the page (`dangerouslySetInnerHTML`) skip sanitization** — a stored-XSS risk if that content (question text, notification templates, document previews) can be influenced by any lower-trust actor.

---

## 5. Category-by-Category Findings

### 5.1 Input Validation & Negative Testing

| # | Test Point | Verdict | Evidence | Notes |
|---|------------|---------|----------|-------|
| 1 | Structured validation library used consistently (react-hook-form + yup/zod, Formik) | 🟡 Partial | Only `apps/admin-app-repo/src/components/notification-templates/AddTemplateForm.tsx:9,188` uses `yupResolver`. Everything else uses hand-rolled `useState` + `if` checks, e.g. `mfes/authentication/src/pages/login.tsx`, `mfes/forget-password/src/Components/ResetPasswordForm/ResetPasswordForm.tsx`. Dynamic JSON-schema forms (`apps/admin-app-repo/src/components/DynamicForm.tsx:226-344`) validate via schema `required`/`minLength`/`maxLength` instead. | Expect inconsistent validation behavior between forms — a rule enforced on one screen may not exist on a visually similar screen elsewhere. |
| 2 | Field-format rules (email, phone, password) enforced | 🟡 Partial | Email regex only in `libs/shared-lib-v2/src/MapUser/EmailSearchUser.tsx:74-75`; an equivalent check is **commented out (dead code)** in `apps/learner-web-app/src/components/Content/LTwoCourse.tsx:83-86`. Phone format enforced in `apps/learner-web-app/src/components/EnrolModal/EnrolModal.tsx:83-84` (`/^[6-9]\d{9}$/`). **Password strength check is `value.length >= 4`** with no complexity rule — `mfes/forget-password/src/Components/ResetPasswordForm/ResetPasswordForm.tsx:58-60` and the duplicate `apps/learner-web-app/src/components/ResetPasswordForm/ResetPasswordForm.tsx:49`. | A black box tester should be able to set a password reset to a 4-character password like `"aaaa"` and have it accepted. |
| 3 | File upload type/size validation before submit | 🟡 Partial | Enforced in `mfes/workspace/src/components/bulk-import/FileUpload.tsx:25,43-45` (50MB cap + `.xlsx/.xls`) and `libs/shared-lib-v2/src/DynamicForm/components/RJSFWidget/CustomFileUpload.tsx:73-74,95`. **Not enforced** in `apps/admin-app-repo/src/components/FileUploadDialog.tsx:89,106` (relies only on the `accept` attribute, which any user can bypass by choosing "All Files") and `mfes/survey-forms/src/Components/fields/FileUploadField.tsx:66,75-77` (shows a size hint with no code enforcing it). No MIME-type check found anywhere (only extension/`accept`). | Try uploading a renamed `.exe` as `.csv` in the admin CSV import dialog — expect it to be accepted client-side. |
| 4 | Special-character / injection-style input handled safely | 🟡 Partial | `DOMPurify` is used before rendering user content in exactly one place (`apps/learner-web-app/src/app/[programName]/page.tsx:17,351-352`). Eight+ other `dangerouslySetInnerHTML` sites render content unsanitized (cross-referenced in 5.6 #1). Search inputs trim/no-op cleanly on empty strings (`apps/learner-web-app/src/components/Content/SearchComponent.tsx:21-22,40-48`). | Typing `<script>alert(1)</script>` into any field whose value later flows into one of the unsanitized `dangerouslySetInnerHTML` sinks is worth testing explicitly. |
| 5 | Login / OTP / password-reset field validation | 🔴 Fail (login form) | `mfes/authentication/src/pages/login.tsx:44-45` declares both `usernameError` and `passwordError` state; the submit gate at line 100 (`if (!usernameError && !passwordError)`) requires both to be false — but `setPasswordError` is **never called anywhere in the file**, so `passwordError` is permanently `false` and password is effectively unvalidated on the client. OTP digit inputs only restrict character type per-digit (`/^[0-9]?$/`), not full-length/format before submit. | This is a concrete, reproducible black box test: submit the login form with an empty or malformed password and confirm the client lets the request through regardless. |
| 6 | Forms with no validation at all | 🔴 Fail | `mfes/login/src/Components/LoginComponent/LoginComponent.tsx:36-114` — plain `useState` + generic `handleChange`, no error state, no pre-submit check. `apps/admin-app-repo/src/components/FileUploadDialog.tsx` — accepts any file with a `.csv`-like name, zero JS-side verification. | Note: `mfes/login` and `mfes/authentication` are two **separate, duplicate login implementations** with different (and differently broken) validation — worth flagging to the client as a maintenance/consistency risk beyond just testing. |

### 5.2 Error Handling & Recovery

| # | Test Point | Verdict | Evidence | Notes |
|---|------------|---------|----------|-------|
| 1 | Centralized HTTP error interceptor | ✅ Pass (with a gap) | Every app/mfe has its own axios `create()` + request/response interceptor pair (not shared, but consistently repeated): `apps/learner-web-app/src/utils/API/Interceptor.ts:29,52`, `apps/admin-app-repo/src/services/Interceptor.ts:26,46`, plus copies in `libs/shared-lib(-v2)`, `mfes/workspace`, `mfes/editors`, `mfes/scp-teacher-repo`, `mfes/taxonomy-manager`, `mfes/survey-forms`, `mfes/survey-observations`, `mfes/forget-password`. **Gap:** `apps/admin-app-repo/src/services/Interceptor.ts:57` reads `error.response.data.responseCode` without optional chaining — a pure network failure (no `error.response`, e.g. server unreachable) will throw inside the interceptor itself rather than being handled. The learner-web-app copy already fixed this (`error?.response?.data?.responseCode`). | Test with the backend/network unreachable specifically against admin-app-repo — expect an unhandled exception rather than a graceful message. |
| 2 | Service-layer calls handle errors without silent failure | 🟡 Partial | `apps/admin-app-repo/src/pages/user-instructor.tsx:642-644` — a genuinely **empty `catch(e){}` block**, error silently discarded, no log, no user feedback. `apps/admin-app-repo/src/services/UserService.ts:8-14` catches but `return error;` instead of throwing/rejecting — callers can't reliably distinguish success from failure. `apps/teachers/src/Services/Login/LoginService.tsx:14-28` catches but only `console.log`s. | Black box testing will likely surface these as "nothing happens" bugs — an action that silently does nothing on failure, with no error toast, rather than a crash. |
| 3 | User-facing error messages are specific and actionable | 🟡 Partial | Good: `mfes/survey-forms/.../SurveyRenderer.tsx:159,218,226,258,285,322,343,352` gives specific messages ("Failed to save draft", "Please fill all required fields"). Generic/vague: `apps/admin-app-repo/src/pages/importCsv.tsx:487,549` and `mfes/workspace/src/pages/ai-assessment-creator.tsx:321,405,411` fall back to "Something went wrong... Please try again" with no detail. | Expect QA feedback that error messages don't help users self-diagnose (e.g., "which field is invalid?" isn't always answered). |
| 4 | Application-level crash containment (React error boundary) | 🔴 Missing | No `ErrorBoundary`, `componentDidCatch`, `getDerivedStateFromError`, or Next.js `error.tsx`/`global-error.tsx` found anywhere in first-party source (only a false-positive match inside a bundled third-party file under `mfes/players/public/...`). | A single uncaught render-time error anywhere in the tree will blank the entire page (white screen) rather than showing a fallback UI. This is a straightforward, high-value black box test to run against every module. |
| 5 | Custom error pages (404/500) | 🟡 Partial | Custom 404 exists in only 4 of ~16 apps/mfes: `apps/admin-app-repo/src/pages/404.tsx`, `apps/learner-web-app/src/app/not-found.tsx`, `mfes/youthNet/src/pages/404.tsx`, `mfes/scp-teacher-repo/src/pages/404.tsx`. **No custom 500/`_error.tsx` page exists anywhere** in the repo. `apps/teachers` and the remaining ~11 mfes fall back to Next.js's default error screen. | Visiting a non-existent route or forcing a 500 on any of the un-covered apps will show the generic Next.js error screen, not branded UX. |
| 6 | Offline detection / retry / timeout on network calls | 🔴 Missing | `navigator.onLine` is only used inside the service worker for cache strategy (`apps/learner-web-app/public/sw.js`), never surfaced as an in-app "you're offline" message. No `axios-retry` or generic retry wrapper anywhere. Axios `timeout` is set in exactly one place (`mfes/workspace/src/services/BulkImportService.ts:398,417`) — every other axios instance has no default timeout, so a hung request can spin indefinitely. | Test on a throttled/interrupted connection: expect requests to hang with a spinner rather than time out with a message. |

### 5.3 Authentication, Session Management & Access Control

| # | Test Point | Verdict | Evidence | Notes |
|---|------------|---------|----------|-------|
| 1 | Tokens stored securely (not accessible to injected scripts) | 🟡 Partial (insecure pattern) | Access + refresh tokens are stored in `localStorage` everywhere, e.g. `apps/admin-app-repo/src/services/Interceptor.ts:8,16`, `apps/learner-web-app/src/utils/API/Interceptor.ts:7,15`, `apps/admin-app-repo/src/components/RouteGuard.tsx:9`. No `httpOnly` cookie usage found anywhere in client code. | Not directly black-box-testable via UI, but relevant context for any XSS finding: a successful injection anywhere would be able to read these tokens. |
| 2 | Protected pages redirect unauthenticated users | 🟡 Partial | Guarding happens client-side in `useEffect`, after the page has already rendered/hydrated — e.g. `apps/admin-app-repo/src/pages/_app.tsx:47-53` checks `localStorage.getItem('token')` and redirects if missing. `middleware.ts` in all three host apps only rewrites MFE URLs — it does **not** check auth. **`RouteGuard` (the component that enforces role/tenant-specific route restrictions) is commented out**: `apps/admin-app-repo/src/pages/_app.tsx:159` (`{/* <RouteGuard>{renderComponent()}</RouteGuard> */}`), confirmed by direct inspection. `ProtectedRoute.js` exists but is adopted inconsistently. | Expect a brief flash of protected content before redirect on slow connections (client-side-only guard), and expect role-restricted routes/pages to be reachable directly by URL despite the intended restriction, since the enforcing component is disabled. |
| 3 | Role-based UI/route restrictions | 🟡 Partial | Present widely (188+ matches of `role ===`/`Role.` patterns), e.g. `apps/admin-app-repo/src/pages/edit-password.tsx:54,70,73,76-77`, `apps/admin-app-repo/src/pages/team-leader.tsx:290`. But role data is read from `localStorage`, which is user-editable via devtools, and the one component meant to centrally enforce it (`RouteGuard`) is disabled (see #2). | A black box tester with devtools access could edit their stored role and probe for UI elements that should not be visible to their real role. |
| 4 | Session/token expiry triggers refresh or logout | ✅ Pass | `apps/learner-web-app/src/utils/API/Interceptor.ts:52-81` and `apps/admin-app-repo/src/services/Interceptor.ts:46-71` both detect a 401, attempt a token refresh, retry the original request, and force a redirect to `/logout` if refresh fails. | Test: let a session sit idle past token expiry, then perform an action — should either succeed transparently (refreshed) or cleanly redirect to login. |
| 5 | Logout clears session state completely | ✅ Pass | `apps/admin-app-repo/src/pages/logout.tsx` and `apps/learner-web-app/src/app/logout/page.tsx` call a server logout API, clear `localStorage` (via an allowlist-based `preserveLocalStorage()` in `apps/admin-app-repo/src/utils/Helper.ts`), clear the React Query cache, and redirect to `/login`. Minor caveat: the server-side logout call failure is only `console.log`'d, so a failed server invalidation wouldn't block the client-side cleanup. | Test: log out, then use the browser back button — confirm no cached authenticated view is shown. |
| 6 | Password reset / OTP flow enforces expiry and rate limits | 🟡 Partial | Flow: `mfes/forget-password/src/app/forget-password/ForgotPassword.tsx` → send/verify OTP → reset password. The resend cooldown is a **client-side 120s timer only** (`mfes/forget-password/.../OtpVerificationComponent.tsx:18`) — this is a UI courtesy, not an enforced limit; nothing in client code confirms a server-side rate limit or OTP TTL. Combined with the length-4 password policy noted in 5.1 #2. | Test whether the OTP send endpoint can be called repeatedly by bypassing the UI timer (e.g., via repeated page reload or direct request replay) — this is a backend concern but is worth flagging since the client offers no real protection. |

### 5.4 Usability, Accessibility & Localization

| # | Test Point | Verdict | Evidence | Notes |
|---|------------|---------|----------|-------|
| 1 | All supported languages are fully translated | 🟡 Partial | Only 5 of ~16 apps/mfes ship locale files at all (`apps/admin-app-repo`, `apps/teachers`, `mfes/scp-teacher-repo`, `mfes/youthNet`, `mfes/authentication`, plus shared strings in `libs/shared-lib-v2`). **11 mfes ship zero translation files**: content, editors, forget-password, login, notification, players, profile-manage, survey-forms, survey-observations, taxonomy-manager, workspace. Where locales do exist, coverage is reasonably close (e.g. `apps/admin-app-repo`: en 858 keys vs. hi 831, mr 833, ur 719 — Urdu is the most behind at ~84%). | Switching the app language and navigating into any of the 11 untranslated mfes will show English text regardless of the selected language — a very likely black box finding. |
| 2 | No hardcoded UI text bypassing translation | 🟡 Partial | 440 of ~1067 component files use `useTranslation`. Notable example: `apps/learner-web-app/src/components/AccessibilityOptions/AccessibilityOptions.tsx:332,364,398` hardcodes "Text to Speech", "Invert Colours", "Underline Links" with **no `useTranslation` import** — ironic, since this is the accessibility settings panel itself. | Directly testable: switch language, open Accessibility Options, confirm these labels stay in English. |
| 3 | Images have alt text | ✅ Pass | Sampling across `<img>` (144 raw hits) and Next `<Image>` (80 files) found essentially universal `alt=` usage, e.g. `libs/shared-lib-v2/src/lib/Header/TopAppBar.tsx:567`, `apps/learner-web-app/src/components/themantic/content/List.tsx:372,377`. No genuine missing-alt instance found in sampling. | — |
| 4 | Interactive elements are keyboard/screen-reader accessible | 🟡 Partial | `aria-label` used 290 times, but 7+ confirmed clickable `<div onClick=...>` elements have no `role`, `tabIndex`, or `onKeyDown` — e.g. `libs/shared-lib-v2/src/DynamicForm/components/RJSFWidget/AutoCompleteMultiSelectWidget.tsx:223`, `apps/learner-web-app/src/components/assessment/QuestionMarksManualUpdate.tsx:835`, and duplicated copies in `mfes/youthNet`/`mfes/scp-teacher-repo`/`mfes/workspace/src/components/KaTableComponent.tsx:284`. | A keyboard-only pass (Tab + Enter/Space, no mouse) through these specific components will fail — worth a dedicated accessibility test pass. |
| 5 | Form fields have real labels (not placeholder-only) | 🟡 Partial | ~23% of sampled `<TextField>` usages (38 of 164) use `placeholder=` with no `label=`/`aria-label`, e.g. `libs/shared-lib-v2/src/DynamicForm/components/CohortSelections.tsx:143-150`, `OrganizationSearchWidget.tsx:1031/1117`, `PTMNameWidget.tsx:1134/1194`. | Placeholder text disappears once the user starts typing and is not reliably read by all screen readers — flag for accessibility testing. |
| 6 | Custom widgets support keyboard navigation | 🟡 Partial | Only 14 files use `onKeyDown` (mostly OTP digit inputs) and 21 use `tabIndex`; none of the clickable-div hotspots from #4 have keyboard handling. No focus-trap/Escape-key handling found for modals/dropdowns in sampling. | — |

### 5.5 UI State Handling (Loading / Empty / Pagination / Duplicate Submission)

| # | Test Point | Verdict | Evidence | Notes |
|---|------------|---------|----------|-------|
| 1 | Loading state shown while data fetches | 🟡 Partial | Broad coverage (125 files use `Skeleton`/`CircularProgress`, 201 use `isLoading`/`loading &&`), e.g. `mfes/youthNet/src/components/ManagerDashboard/CoursesList/CourseList.tsx:69-72`. Counter-example: `apps/admin-app-repo/src/components/CenterSelection.tsx:50-51` shows "No centers found" the instant the array is empty/undefined, with no separate loading state — so a still-loading list briefly looks like a genuinely empty one. | Test any dropdown/list that loads from an API on a throttled connection — check for a false "no data" flash before real data arrives. |
| 2 | "No results" message shown for empty lists/tables | 🟡 Partial | A reusable `NoDataFound` component is used in 40+ places, e.g. `mfes/youthNet/.../CourseList.tsx:76`. **Missing** in `apps/admin-app-repo/src/components/PaginatedTable/PaginatedTable.tsx:179-238` — an empty `data` array renders zero `<TableRow>`s with no message, just a blank body under the header. This component is reused by `village.tsx`, `district.tsx`, and similar admin list pages. | Filter any admin list page (village/district/block) down to zero results and confirm whether a blank table or a clear message is shown. |
| 3 | Pagination edges (first/last page, zero/uneven totals) | ✅ Pass (shared component); mixed elsewhere | `libs/shared-lib-v2/src/lib/Pagination/CommonPagination.tsx:64` returns `null` for `totalPages <= 1`; disables First/Prev at page 1 and Next/Last at the last page (lines 67-68/101/110/152/161); guards out-of-range navigation (`goTo`, lines 70-73). Used correctly across `mfes/youthNet`. Separately, `apps/admin-app-repo/src/components/PaginatedTable/PaginatedTable.tsx:241-249` uses MUI's own `TablePagination` instead — a second, independent pagination implementation, which is fine functionally but inconsistent to test against (different behavior/styling by module). | — |
| 4 | Search inputs are debounced (no per-keystroke API flooding) | ✅ Pass | Debounce (300ms–2s) confirmed in `apps/admin-app-repo/src/pages/village.tsx:87`, `district.tsx:80`, `state.tsx:73`, `block.tsx:87`, `mfes/scp-teacher-repo/src/pages/attendance-overview.tsx:449`, `apps/learner-web-app/src/components/Content/SearchComponent.tsx:20`. Other searches fire on Enter/keypress rather than continuously (`mfes/content/src/components/Content/List.tsx:717`). No flooding pattern found. | — |
| 5 | Large lists handle scale (virtualization or true pagination) | 🔴 Missing | No `react-window`/`react-virtualized` anywhere in the repo. Several places use hardcoded truncation instead of pagination or virtualization: `libs/shared-lib-v2/.../MapUser/*.tsx` (`limit: 200`), `mfes/scp-teacher-repo/src/components/MarksObtainedCard.tsx:53` (`.slice(0, 12)`), `mfes/youthNet/.../TopPerformers.tsx:199` (`.slice(0,6)`). | If a dataset legitimately exceeds these caps, the excess is silently dropped from view rather than paginated — worth testing with a large seeded dataset. |
| 6 | Submit buttons prevent duplicate/rapid submission | 🟡 Partial | Guarded: `apps/admin-app-repo/src/pages/login.tsx:909`, `apps/admin-app-repo/src/pages/user-leader.tsx:1037`, `libs/shared-lib-v2/src/VolunteerOnboard/VolunteerOnboard.tsx:650` (all disable the button while a request is in flight). Unguarded: `apps/admin-app-repo/src/components/AddNewCenters.tsx:333-347` has no `disabled` tied to a submitting flag. | Rapid double-click testing on "Add Center" and similar creation forms across the admin app is a good, cheap black box test to run broadly. |

### 5.6 Security Surface (Black-Box-Observable)

| # | Test Point | Verdict | Evidence | Notes |
|---|------------|---------|----------|-------|
| 1 | Raw HTML injection points (`dangerouslySetInnerHTML`) are sanitized | 🔴 Notable risk | 14 occurrences found; **only one is sanitized** (`apps/learner-web-app/src/app/[programName]/page.tsx:352`, via `DOMPurify.sanitize`). Unsanitized: `libs/shared-lib-v2/.../DocumentViewer.tsx:436` (parsed document content), `apps/admin-app-repo/src/components/notification-templates/TemplatePreview.tsx:22` (admin-authored template), and question content rendering duplicated across three mfes — `apps/learner-web-app/src/components/assessment/QuestionMarksManualUpdate.tsx:849,909`, `mfes/youthNet/.../QuestionMarksManualUpdate.tsx:937,997`, `mfes/scp-teacher-repo/src/components/assessment/QuestionMarksManualUpdate.tsx:920,980`, plus `mfes/scp-teacher-repo` assessment-attempt pages (`.../attempt/.../index.tsx:271,304`, `.../subject/[subjectId]/index.tsx:176,192`). `dompurify` is already a project dependency but is used in only 1 of 14 sites. | This is the highest-value security black box test in the repo: attempt to inject `<img src=x onerror=alert(1)>` or similar into a question/notification-template field and see if it executes when rendered to another user. |
| 2 | No hardcoded credentials in source | ✅ Pass | No `apiKey=`/`secret=`/`password=` literals, AWS key patterns, or hardcoded `Bearer` tokens found in `.ts/.tsx/.js` source. | — |
| 3 | No confidential values shipped via `NEXT_PUBLIC_*` env vars | 🔴 Notable risk | `NEXT_PUBLIC_CLIENT_SECRET` and `NEXT_PUBLIC_GRANT_TYPE` are read at `apps/teachers/src/Services/Login/LoginService.tsx:9-10` — an OAuth client secret is compiled directly into the browser bundle. `NEXT_PUBLIC_AUTH_TOKEN` and `NEXT_PUBLIC_COOKIE` are read at `mfes/taxonomy-manager/src/utils/ApiUtilityService.ts:4-5` — a static bearer token/cookie shipped client-side. (Firebase `NEXT_PUBLIC_FCM_*` keys are excluded from this finding — Firebase web config is designed to be public.) | Directly verifiable by any tester: open browser devtools → Sources/Network on the Teachers app login flow and the Taxonomy Manager, and the secret/token will be visible in plain text in the JS bundle or request headers. |
| 4 | No unsafe dynamic code execution (`eval`, raw `innerHTML`) | 🟡 Minor concern | No `eval(`/`new Function(` found. One direct assignment: `libs/shared-lib-v2/src/lib/Text/ExpandableText.tsx:59` (`tempElement.innerHTML = text`), on a detached measurement element — low risk but still parses unsanitized text as HTML. | — |
| 5 | Sensitive values are not logged to the console | 🔴 Notable risk | Plaintext credentials logged at `apps/learner-web-app/src/app/registration/RegisterationFlow.tsx:663,667,676` (`console.log(username, password)`, confirmed by direct read) and `RegisterUser.tsx:463,467,476`. Tokens logged at `mfes/workspace/src/services/LocalStorageService.ts:48`, `mfes/editors/src/services/LocalStorageService.ts:48`, `mfes/workspace/src/pages/api/fileUpload.ts:89`, `mfes/players/src/pages/api/proxy.ts:34`, and `apps/teachers/src/pages/login.tsx:101`. | Any of these are visible to anyone with devtools open, and may be captured by browser extensions, crash/error-reporting tools, or shared-machine browser history. Should be removed before any external testing/pentest. |
| 6 | No open-redirect via unvalidated query params | ✅ Pass | No `router.push`/`window.location` assignment found driven directly by a `redirect`/`next`/`returnUrl` query parameter. | — |

---

## 6. Consolidated Risk Register

| Severity | Issue | Location | Recommendation |
|----------|-------|----------|-----------------|
| 🔴 Critical | OAuth `client_secret` shipped in client bundle | `apps/teachers/src/Services/Login/LoginService.tsx:9-10` | Move the OAuth client-credentials exchange to a server-side route/API; never prefix a secret with `NEXT_PUBLIC_`. |
| 🔴 Critical | Static bearer token/cookie shipped in client bundle | `mfes/taxonomy-manager/src/utils/ApiUtilityService.ts:4-5` | Same as above — proxy this call through a server-side endpoint that holds the credential. |
| 🔴 Critical | Plaintext username/password logged to browser console | `apps/learner-web-app/src/app/registration/RegisterationFlow.tsx:663-676`, `RegisterUser.tsx:463-476` | Remove these `console.log` statements before any client demo or external testing. |
| 🔴 Critical | Password field on primary login form is never validated (`passwordError` never set) | `mfes/authentication/src/pages/login.tsx:44-45,100` | Wire up `setPasswordError` with an actual rule, or remove the dead state and rely on the backend response — currently gives a false impression of client-side protection. |
| 🔴 High | 13 of 14 `dangerouslySetInnerHTML` sites render unsanitized HTML | See Section 5.6 #1 | Route all of them through the `DOMPurify` sanitizer that's already a project dependency and already used correctly in one place. |
| 🔴 High | Role/tenant route enforcement (`RouteGuard`) is disabled | `apps/admin-app-repo/src/pages/_app.tsx:159` | Re-enable and verify against current role/tenant rules, or explicitly document why it's disabled if intentional. |
| 🟠 Medium | No React error boundary / custom 500 page anywhere | Section 5.2 #4-5 | Add a root-level error boundary (or Next.js `error.tsx`) per app so a single component crash doesn't blank the whole page. |
| 🟠 Medium | Password policy is length ≥ 4 only | `ResetPasswordForm.tsx` (both copies) | Add complexity requirements (mixed case, digit, minimum 8) consistent with the backend's actual policy. |
| 🟠 Medium | Client-side-only auth guard; RBAC read from editable `localStorage` | Section 5.3 #2-3 | Ensure backend re-validates every privileged action/route server-side regardless of what the client sends — the client-side checks are UX convenience only, not real security boundaries (backend not in this repo's scope, but this should be confirmed with the backend team). |
| 🟠 Medium | File upload type/size checks inconsistent, some rely only on `accept` | `apps/admin-app-repo/src/components/FileUploadDialog.tsx`, `mfes/survey-forms/.../FileUploadField.tsx` | Add explicit extension/size checks in JS (as already done correctly in `mfes/workspace/.../FileUpload.tsx`) to all upload components. |
| 🟠 Medium | Empty `catch` blocks / errors swallowed without user feedback | `apps/admin-app-repo/src/pages/user-instructor.tsx:642-644`, `UserService.ts:8-14` | Surface a user-facing error (toast) on every catch; never leave a catch block empty. |
| 🟡 Low | 11 of ~16 mfes have zero translation files | Section 5.4 #1 | Decide whether these mfes are intentionally English-only, or backfill locale files for consistency. |
| 🟡 Low | `PaginatedTable` has no empty-state message | `apps/admin-app-repo/src/components/PaginatedTable/PaginatedTable.tsx` | Add a "no results" row/message matching the `NoDataFound` pattern already used elsewhere. |
| 🟡 Low | No default axios timeout / retry / offline messaging | Section 5.2 #6 | Set a sensible default timeout on all axios instances; surface `navigator.onLine` state to the user in-app, not just in the service worker. |
| 🟡 Low | Duplicate-submission guard missing on some forms (e.g. Add Center) | `apps/admin-app-repo/src/components/AddNewCenters.tsx:333-347` | Disable submit buttons while a request is in flight, consistent with the pattern already used on the login page. |
| 🟡 Low | Clickable `<div onClick>` without keyboard support (7+ instances) | Section 5.4 #4 | Add `role="button"`, `tabIndex={0}`, and `onKeyDown` (Enter/Space), or use a real `<button>`. |
| 🟡 Low | No automated E2E/black-box regression suite exists | `mfes/scp-teacher-repo/cypress.config.ts` (empty boilerplate) | Capture the black box test cases from this engagement as automated Cypress/Playwright specs so they don't need to be re-run manually every release. |

---

## 7. What This Code Analysis Cannot Verify — Requires Manual/Runtime Testing

Static analysis cannot observe runtime behavior. The client's manual black box testing should specifically cover:

- **Cross-browser / cross-device rendering** (Chrome, Firefox, Safari, mobile viewports) — layout, responsiveness, and touch interactions.
- **Actual network conditions**: real latency, packet loss, and connection drops (the interceptor/timeout gaps in Section 5.2 predict *how* it will fail, but only live testing shows the actual user experience).
- **Server-side enforcement**: every client-side check identified above (validation, RBAC, rate limits) must be re-verified against the actual backend response, since a determined user can bypass any client-side-only control by calling the API directly.
- **Screen reader behavior in practice** (NVDA/VoiceOver) — the ARIA/label gaps in Section 5.4 identify likely trouble spots, but only a real screen reader pass confirms actual impact.
- **Load/performance** under concurrent users — entirely outside this report's scope.
- **Actual OTP delivery and expiry timing**, and whether the backend enforces rate limits the client only suggests via a UI timer.

---

## 8. Recommended Next Steps

1. Fix the 4 Critical items in Section 6 before any external/client-facing black box testing round, since they are trivially discoverable (open devtools, view page source, or try the login form) and would likely be the first things a black box tester or auditor reports.
2. Use Section 5's per-checkpoint table as the basis for structuring test cases — a ready-to-execute checklist derived from it is provided in the companion document [`Manual_Test_Case_Checklist.md`](./Manual_Test_Case_Checklist.md).
3. Treat every "Partial / inconsistent" verdict as **"test per-module, don't assume one module's behavior generalizes"** — this codebase repeats similar UI patterns across many mfes with independently-implemented (and sometimes independently-broken) logic, e.g. two separate login forms with two different validation bugs, three separate copies of the question-rendering component all with the same missing sanitization.
4. Since no automated regression suite exists, recommend the client (or the dev team) convert confirmed black box findings into Cypress/Playwright specs as they're found, using the existing (currently empty) `mfes/scp-teacher-repo/cypress.config.ts` as a starting point, to avoid re-discovering the same regressions every release.
