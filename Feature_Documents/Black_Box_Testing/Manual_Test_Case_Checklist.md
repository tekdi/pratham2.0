# Manual Black Box Test Case Checklist

Companion checklist to [`Black_Box_Testing_Report.md`](./Black_Box_Testing_Report.md). Each row is a concrete, executable test case derived from the code analysis — use this to structure the client's manual testing pass. "Expected per code" reflects what the current implementation will actually do (per the linked evidence in the main report); it is **not** a statement of correct/desired behavior.

Legend: ⚠️ = predicted to fail or behave inconsistently based on code analysis. ✅ = predicted to pass.

## A. Login & Authentication

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| A1 | Login with malformed/empty password | Go to the main authentication login (`mfes/authentication`), enter a valid username, leave password empty or enter only whitespace, submit | ⚠️ Client does not block submission (password error state is never set) |
| A2 | Login with malformed/empty password — secondary login form | Repeat A1 against `mfes/login`'s login component | ⚠️ No client-side validation exists at all on this form |
| A3 | Session expiry mid-use | Log in, wait for the access token to expire (or manually expire it), then perform an action | ✅ Should transparently refresh and retry, or redirect to login |
| A4 | Logout then back-button | Log in, log out, press browser Back | ✅ Should not show cached authenticated content |
| A5 | Role tampering via devtools | Log in as a low-privilege role, edit the stored role/tenant value in localStorage, reload, attempt to access a higher-privilege admin route directly by URL | ⚠️ `RouteGuard` enforcement is disabled — likely reachable |
| A6 | Idle/duplicate login submit | Rapidly double-click the login submit button | ✅ (admin login) guarded; check other login forms individually |

## B. Registration & Password Reset

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| B1 | Weak password on reset | Go through forget-password → reset password, enter a 4-character password like `abcd` | ⚠️ Accepted client-side (length ≥ 4 is the only rule) |
| B2 | OTP resend spam | Trigger OTP send, then attempt to trigger it again faster than the 120s cooldown by refreshing/reopening the flow | ⚠️ Client-side timer only; verify with backend team whether a server-side rate limit exists |
| B3 | Console inspection during registration | Open devtools console, go through the registration/login flow on `apps/learner-web-app` and `apps/teachers`, watch console output | ⚠️ Plaintext username/password will appear in console logs |

## C. Forms & Data Entry

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| C1 | Email field with invalid format | Enter `notanemail` into any email field across different modules | 🟡 Mixed — enforced in some places (e.g. `EmailSearchUser`), not enforced elsewhere |
| C2 | Phone field boundary | Enter a phone number outside the Indian mobile pattern (`[6-9]xxxxxxxxx`), e.g. starting with 0-5, or fewer/more than 10 digits | 🟡 Enforced on Enrol Modal; check other phone fields individually |
| C3 | Script injection into free-text fields (question text, notification templates) | Enter `<img src=x onerror=alert(1)>` or `<script>alert(1)</script>` into a notification template, assessment question, or any field later rendered via `dangerouslySetInnerHTML` (see report §5.6.1 for exact locations) | ⚠️ Likely executes — only 1 of 14 render sites sanitizes input |
| C4 | Duplicate submission via double-click | Rapidly double-click "Add Center" and similar creation forms in the admin app | ⚠️ `AddNewCenters.tsx` has no guard — check for duplicate records created |
| C5 | Rendering with an uncaught error | Force any component into an error state (e.g. malformed API response) and observe the page | ⚠️ No error boundary anywhere — expect a blank/white page, not a fallback UI |

## D. File Upload

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| D1 | Wrong file type via "All Files" bypass | On the admin CSV import dialog, change the file picker filter to "All Files" and select a non-CSV file (e.g. renamed `.exe`) | ⚠️ Accepted client-side — no size/type enforcement in JS |
| D2 | Oversized file on bulk import | Upload a file larger than 50MB to `mfes/workspace` bulk import | ✅ Should be rejected with a size error |
| D3 | Oversized file on survey attachment | Upload a large file to a survey-forms file field | ⚠️ UI shows a size hint but no enforcement was found in code |

## E. Lists, Search & Pagination

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| E1 | Empty result set on admin list pages | Filter village/district/block lists in `apps/admin-app-repo` down to zero results | ⚠️ `PaginatedTable` shows a blank table, no "no results" message |
| E2 | Empty result set on Manager Dashboard / other `NoDataFound`-covered lists | Filter Manager Dashboard course/employee lists to zero results | ✅ Should show a clear "no data" message |
| E3 | Pagination at boundaries | Navigate to the first page and last page of any list using `CommonPagination` | ✅ Prev/Next should correctly disable at the edges |
| E4 | Pagination at boundaries — admin `PaginatedTable` | Same test against admin list pages using MUI `TablePagination` | 🟡 Separate implementation — verify independently, behavior may differ subtly from `CommonPagination` |
| E5 | Slow network on a dropdown/list load | Throttle network (e.g. Chrome devtools "Slow 3G") and open a dropdown/list that loads from an API (e.g. Center Selection) | ⚠️ May briefly show "No centers found" before real data loads |
| E6 | Large dataset beyond hardcoded caps | If feasible, seed a dataset larger than the hardcoded limits (200 for map-user widgets, 12/6 for marks/top-performer cards) | ⚠️ Excess items likely silently dropped rather than paginated |
| E7 | Rapid typing in a debounced search box | Type quickly into a search box (e.g. village/district search) | ✅ Should not fire one API call per keystroke |

## F. Localization

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| F1 | Switch language, visit an untranslated mfe | Switch app language away from English, then navigate to content, editors, forget-password, login, notification, players, profile-manage, survey-forms, survey-observations, taxonomy-manager, or workspace | ⚠️ These 11 mfes ship no translation files — expect English text regardless of selected language |
| F2 | Switch language, open Accessibility Options | Switch language, open the Accessibility Options panel in `apps/learner-web-app` | ⚠️ Labels ("Text to Speech", "Invert Colours", "Underline Links") are hardcoded in English |
| F3 | Urdu completeness spot-check | Switch to Urdu specifically in `apps/admin-app-repo` and browse broadly | 🟡 Urdu translation file has the largest key-count gap (~84% of English) among translated languages |

## G. Accessibility (Keyboard-Only Pass)

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| G1 | Tab through a page with no mouse | Using only Tab/Shift+Tab/Enter/Space, try to operate every interactive element on a given page | ⚠️ Several clickable `<div>` elements (autocomplete multi-select, KaTable sort controls, question-mark update UI) have no keyboard handler |
| G2 | Screen reader pass on placeholder-only fields | With a screen reader active, tab into fields like the batch/organization/center search widgets | ⚠️ These use placeholder text with no real label — may not announce correctly |
| G3 | Modal/dropdown focus handling | Open a modal or custom dropdown, try Escape / Tab-cycling within it | ⚠️ No focus-trap or Escape handling found in code |

## H. Error & Network Resilience

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| H1 | Backend unreachable | Point the admin app at an unreachable API endpoint (or block the request) and perform any action | ⚠️ `apps/admin-app-repo`'s interceptor will throw internally on a response with no `error.response` (missing optional chaining) |
| H2 | Slow/hanging request | Simulate a request that never resolves | ⚠️ No default timeout on most axios instances — expect an indefinite spinner rather than a timeout error |
| H3 | Non-existent route | Visit a random unmapped URL under `apps/teachers` or any of the 11 mfes without a custom 404 | ⚠️ Falls back to the generic Next.js error screen, not a branded 404 |
| H4 | Silent failure check | Trigger the geographical-hierarchy lookup failure path in `apps/admin-app-repo/src/pages/user-instructor.tsx` (e.g. by making the underlying API fail) | ⚠️ Error is silently swallowed (`catch(e){}`) — nothing is shown to the user |

## I. Client-Side Security Spot Checks

| # | Test Case | Steps | Expected per code |
|---|-----------|-------|--------------------|
| I1 | Inspect bundle for exposed secrets | Open devtools → Sources/Network while using `apps/teachers` login and `mfes/taxonomy-manager` | ⚠️ OAuth client secret and a static bearer token/cookie are visible in plain text |
| I2 | XSS via question/template content | See C3 above | ⚠️ Likely to succeed on 13 of 14 identified render sites |
| I3 | Open redirect attempt | Try appending a `redirect=`/`next=`/`returnUrl=`-style query param pointing to an external URL to any page and see if it's followed after an action | ✅ No code path found that would honor this |

---

*Derived from static code analysis in `Black_Box_Testing_Report.md`, dated 2026-08-05, branch `feat-sonar-issue`. Re-verify against the current state of the code before executing, since the codebase may have changed since this analysis.*
