# Black Box Testing — Backend-Driven Dynamic Form System

**Project:** Pratham 2.0 — Dynamic Form subsystem
**Branch analyzed:** `feat-sonar-issue`
**Date:** 2026-08-05
**Method:** Static source-code analysis (read-only), all findings verified by direct file inspection (not just tool/agent output).

---

## 1. What This Report Covers

This is a focused deep-dive on one specific subsystem flagged by the team as high-risk for black box testing: the **Dynamic Form**. Unlike a normal form, this form's fields, validation rules, widget types, and conditional logic are **not hardcoded in the frontend** — they are fetched at runtime as a JSON Schema + UI Schema from a backend API, and a shared component renders and validates the form purely from that JSON.

This pattern (schema-driven UI) introduces a category of black box testing risk that a normal hardcoded form doesn't have: **the frontend team does not control what "the form" looks like on any given day.** A backend/CMS change to the form definition can silently change validation, required fields, or widget behavior in production, with no frontend deployment involved. Black box testing of this feature therefore needs to test the *contract* between backend and frontend, not just the currently-deployed form's happy path.

This report gives:
- The architecture (Section 2), so testers know what's actually being tested
- The black box testing points that specifically matter for this pattern (Section 3)
- Concrete issues found in the current implementation, each with a reproduction step and severity (Section 4)
- A **non-breaking fix plan** — phased so that existing working forms are not affected while the risky paths are hardened (Section 5)
- A ready-to-run test checklist specific to this subsystem (Section 6)

---

## 2. Architecture (for context)

| Piece | Location |
|---|---|
| Canonical shared component | `libs/shared-lib-v2/src/DynamicForm/components/DynamicForm.tsx` (2,499 lines) — wraps `@rjsf/mui`'s `<Form>` with `@rjsf/validator-ajv8` as the validator |
| **Duplicate, independently-maintained copies** | `apps/admin-app-repo/src/components/DynamicForm/DynamicForm.tsx`, `apps/admin-app-repo/src/components/DynamicForm.tsx`, `mfes/scp-teacher-repo/src/components/DynamicForm/DynamicForm.tsx` |
| Schema fetch helper | `fetchForm()` in `libs/shared-lib-v2/src/DynamicForm/components/DynamicFormCallback.ts:21-50` — POSTs to a Next.js API route `/api/dynamic-form/get-rjsf-form` |
| Schema synthesis (backend→RJSF translation) | e.g. `apps/learner-web-app/src/app/api/dynamic-form/get-rjsf-form/route.js:71-368` — `generateSchemaAndUISchema()` maps raw backend field metadata (`type: radio/drop_down/date/file/...`) into RJSF `schema`/`uiSchema`, including **special-cased widget assignment by field ID** (e.g. `org_id → OrganizationSearchWidget`, `ptm_id → PTMNameWidget`, lines 150-205) |
| Custom widget registry | `DynamicForm.tsx:805-829` — a hardcoded JS object (`CustomFileUpload`, `OrganizationSearchWidget`, `PTMNameWidget`, `AutoCompleteMultiSelectWidget`, `CustomDateWidget`, `CustomRadioWidget`, `CustomCenterListWidget`, `CatchmentAreaWidget`, `WorkingLocationWidget`, and ~10 more) matched against `uiSchema[field]['ui:widget']` string values sent by the backend |
| Validation customization | `customValidate` (`DynamicForm.tsx:2055-2102`) and `transformErrors` (`DynamicForm.tsx:2129-2157`) — humanize `pattern` errors via an i18n map; `required`/`format` errors mostly pass through as ajv's generic English defaults |
| Consumers | ~50+ files across `apps/learner-web-app` (registration, profile edit), `apps/admin-app-repo` (centers, users, leaders), `mfes/scp-teacher-repo` (user/facilitator management), `mfes/youthNet` (mentor assignment, villages) |

**Key fact that shapes every finding below: `DynamicForm.tsx` begins with `//@ts-nocheck` (line 1) and the component's props are typed as `any` (line 45).** The entire schema/uiSchema contract between backend and frontend is untyped — TypeScript provides zero protection against a backend shape change here.

---

## 3. Black Box Testing Points Specific to Backend-Driven Schema Forms

Beyond the generic form-testing checklist (already covered in `Black_Box_Testing_Report.md` §5.1), a schema-driven form needs these **additional** categories of testing:

| # | Category | Why it matters here specifically |
|---|----------|-----------------------------------|
| A | **Schema contract validation** | The backend can send any JSON shape at any time. Test with an unknown `ui:widget` name, a missing `properties` key, a type mismatch (schema says `string`, data is a number), and a `uiSchema` referencing a field not present in `schema`. |
| B | **Widget-level functional testing (per widget)** | Each custom widget independently decides how it talks to RJSF's validation (`onChange`, `disabled`, `readonly`). A bug in one widget doesn't affect the others — every widget must be tested individually, not just "the form" as a whole. |
| C | **File upload edge cases** | Upload widgets do their own async network calls outside RJSF's validation cycle — a failed upload can still look "successful" to the schema validator if the widget's `onChange` wiring doesn't distinguish success from failure. |
| D | **Conditional/dependent field testing** | JSON Schema `dependencies`/`oneOf` combined with bespoke JS-level conditional logic (age-based required fields, guardian info) means two different conditional systems are layered on top of each other — testing needs to toggle driving fields back and forth, not just once. |
| E | **Schema fetch failure/loading testing, per consumer page** | There is no shared loading/error component for the schema fetch — each of the ~50 consumer pages reimplements this independently, so behavior on a failed/slow fetch must be tested **per page**, not once. |
| F | **Schema drift / stale-session testing** | The form is fetched once on page load and never re-validated against the backend's current schema before submit. A long-open tab, or a backend config change mid-session, can submit against an outdated contract. |
| G | **Cross-implementation regression testing** | Because 3-4 independently-maintained copies of `DynamicForm` exist, the same bug class (e.g. a widget wiring bug) may be present in one copy and already fixed in another — every fix and every test needs to be checked against all active copies. |
| H | **Submitted-value integrity vs. displayed value** | Async/searchable widgets (organization/center/PTM search) can display a placeholder label while a different real value is bound underneath — testers need to verify the *actual submitted payload*, not just what's shown on screen. |

---

## 4. Issues Found (Code-Verified)

Each issue below was directly confirmed by reading the cited lines, not inferred.

### 4.1 — Unregistered/mistyped widget name from backend crashes the entire page

**Severity: Critical**

`DynamicForm.tsx:805-829` builds a plain widget map and passes it to RJSF's `<Form widgets={widgets}>`. RJSF resolves `uiSchema[field]['ui:widget']` against this map (and its own builtin type-based fallbacks) in `node_modules/@rjsf/utils/dist/utils.esm.js:2573-2580`:

```js
if (!(type in widgetMap)) {
  throw new Error(`No widget for type '${type}'`);
}
...
throw new Error(`No widget '${widget}' for type '${type}'`);
```

If the backend sends a `ui:widget` string that doesn't match anything in the frontend's registry — a typo, a new widget the backend team enabled before the frontend deployed support for it, or simply a field type the frontend doesn't yet handle — **this throws, uncaught**. No `ErrorBoundary`/`componentDidCatch` wraps `<Form>` anywhere in the codebase (confirmed by search across the DynamicForm tree and all consumer pages). The result is a hard crash to Next.js's default error screen for that entire page, not just that field.

**How to reproduce as a black box test:** Ask the backend/CMS team to add a new form field with an unrecognized or misspelled `ui:widget` value (or simulate it by intercepting the `/api/dynamic-form/get-rjsf-form` response in devtools) and load the form. Expect the whole page to go blank/error, not just the one field.

### 4.2 — Silent required-field removal bug uses `Array.prototype.pop()` incorrectly

**Severity: High**

`apps/learner-web-app/src/app/registration/RegisterUser.tsx:151`:

```js
responseForm?.schema?.required.pop('batch');
```

`Array.prototype.pop()` **ignores any argument** — it always removes the *last* element of the array, regardless of what's passed to it. This code clearly intends to remove `'batch'` specifically from the `required` list, but instead removes whatever field happens to be last in the backend's `required` array that day. If the backend reorders its schema, a *different* field silently stops being required than the one the code intended to exempt — and `'batch'` may still incorrectly remain required.

**How to reproduce as a black box test:** Complete registration and observe which field is actually optional vs. required around the `batch`/`center` fields; compare against intended business rules. This is easiest to catch by comparing the `required` array in the actual API response (Network tab) against what the UI enforces.

### 4.3 — File upload can pass required-field validation on a failed upload

**Severity: High**

`libs/shared-lib-v2/src/DynamicForm/components/RJSFWidget/CustomFileUpload.tsx`:
- `uploadToServer()` (lines ~90-135) returns `''` when the S3 upload fails (`catch` block, line ~132), after alerting the user.
- `handleFileChange()` (lines 63-89) **unconditionally** does `newFiles.push(encodeURI(uploadedUrl))` (line 81) — even when `uploadedUrl === ''`.
- The resulting `fileList` is therefore non-empty and gets passed to `onChange(updatedList)`, which satisfies ajv's `required` check.

**Net effect:** a user sees an alert saying the upload failed, but the form's required-file validation is already satisfied by the bogus empty-string entry — the user can proceed to submit a form that appears to have an attached file but doesn't.

**How to reproduce as a black box test:** On any form with a required file upload widget, force the upload to fail (disconnect network right after selecting the file, or use devtools to block the presigned-URL/S3 request), dismiss the alert, and attempt to submit. Expect the form to accept the submission as if the file were present.

### 4.4 — Two widgets ignore the Form-level `disabled`/`readonly` prop

**Severity: Medium**

`CustomFileUpload.tsx:41` and `AutoCompleteMultiSelectWidget.tsx:36` both derive their disabled state only from `uiSchema?.['ui:disabled'] === true`, ignoring the `disabled`/`readonly` props RJSF passes down automatically when the whole `<Form>` is disabled (e.g., a read-only view, or "disable while submitting"). Other widgets in the same registry (`PTMNameWidget`, `OrganizationSearchWidget`) correctly destructure and respect `disabled`/`readonly` from `WidgetProps`.

**Net effect:** any consumer that disables the whole form (for a read-only detail view, or to prevent double-submission) will find the file-upload and multi-select-autocomplete fields remain editable while every other field locks — an inconsistency a QA pass will likely surface as "some fields stay clickable in read-only mode."

### 4.5 — No defensive handling for a null/malformed schema inside `DynamicForm.tsx` itself

**Severity: Medium**

Functions like `extractSkipAndHide` (lines ~890-903) and `extractApiProperties` (lines ~1069-1073) call `Object.entries(schema.properties)` with no null-check. If `schema` is `null`/`undefined` (a failed fetch) or lacks a `properties` key (a malformed backend response), this throws immediately inside `DynamicForm.tsx`'s own logic — before RJSF even gets a chance to render anything.

`fetchForm()` (`DynamicFormCallback.ts:37-48`) already swallows network errors and returns `null` — so a failed fetch reliably produces exactly the malformed input `DynamicForm.tsx` isn't guarded against. Whether this crashes visibly depends entirely on whether the *consumer* page happens to guard its render (some do, inconsistently — see 4.6); `DynamicForm.tsx` itself provides no protection.

### 4.6 — Schema fetch failure/loading handling is reimplemented ~50 times, inconsistently

**Severity: Medium**

There is no shared `<SchemaLoader>`/HOC — every consumer page fetches the schema and manages `loading`/error state independently. Example: `apps/learner-web-app/src/components/EditProfile/EditProfile.tsx` wraps its fetch in `try/catch/finally` (lines ~134, ~434-440) but on error **only** does `console.log('error', error)` (line 435) — no user-facing message. `addSchema` stays at its initial `null` (line 93); once `loading` flips to `false`, the component still attempts to render `<DynamicForm>` with a null schema — which then hits the guard-less code in 4.5.

**Net effect:** on a slow/failed backend, some pages will show a spinner forever, some will show a blank form, and some may crash — and which one happens depends on which specific page you're testing, not on one central behavior.

### 4.7 — No schema versioning or staleness check

**Severity: Low**

No `schemaVersion`/`formVersion` field, and no refetch-on-submit logic, was found anywhere in the fetch/submit path. The form schema is fetched once on mount and the submission is validated against whatever was loaded at that time — with no re-check against the backend's *current* schema. If the backend's validation rules change while a user has the form open (e.g., a field becomes required, or a widget's allowed values change), the client will validate — and let the user submit — against the stale rules, and any mismatch is discovered only when the backend rejects the request (or worse, doesn't).

### 4.8 — `allowedFormats`/`maxSelections` fail open on a malformed backend value

**Severity: Low**

`CustomFileUpload.tsx:31-35` destructures `allowedFormats = []` and `maxSelections = 5` from `uiSchema[field]['ui:options']`. The format check at line ~71 is `allowedFormats.length && !allowedFormats.includes(extension)`. If the backend sends a malformed value for `allowedFormats` that isn't an array (e.g. a string, or omits it) — `.length` is `undefined`, which is falsy, so the **entire format check is silently disabled** rather than failing closed to a safe default. Any file type becomes acceptable.

### 4.9 — Display value can diverge from submitted value in search widgets

**Severity: Low (testing-risk, not a validation bug)**

`OrganizationSearchWidget.tsx:558-588`: when a `value` is set but the matching organization isn't found in the currently-loaded/paginated/filtered list (e.g. pagination hasn't fetched that record yet), the widget falls back to displaying a placeholder label `{ label: 'Selected', value }` (lines ~566-568). The real ID is still correctly bound to `onChange` and validated by ajv — but the visible text says "Selected" instead of the actual organization name.

**Testing implication:** a tester visually comparing "what's shown" to "what should be submitted" may either (a) wrongly flag this as a data-binding bug when the underlying value is actually correct, or (b) fail to notice a genuinely wrong binding elsewhere because "Selected" looks like expected placeholder behavior. Test by cross-checking the actual network payload on submit, not just the visible label.

### 4.10 — Three to four independently-maintained copies of `DynamicForm` exist

**Severity: Medium (process/coverage risk, not a single bug)**

`libs/shared-lib-v2/.../DynamicForm.tsx`, `apps/admin-app-repo/src/components/DynamicForm/DynamicForm.tsx`, `apps/admin-app-repo/src/components/DynamicForm.tsx`, and `mfes/scp-teacher-repo/src/components/DynamicForm/DynamicForm.tsx` are separate files, not one shared component re-exported. Issues 4.1–4.9 were confirmed in the shared-lib-v2 copy; **each of the other copies must be independently checked**, since a fix applied to one will not automatically apply to the others, and a bug fixed in one may still be present in another.

---

## 5. Fix Plan — Staged to Avoid Impacting Existing Flows

The guiding principle: **every phase below is additive or strictly narrows an already-broken path.** None of them change behavior for a well-formed schema going through a widget that already works correctly today — they only change what happens on paths that are currently silently broken or currently crash.

### Phase 0 — Safety net (do first; zero behavior change for valid schemas)

1. **Wrap the `<Form>` render in each of the (up to 4) `DynamicForm` implementations with a local React error boundary.** This changes *only* the already-crashing path (issue 4.1): instead of a blank Next.js error page, the user sees a contained "This form couldn't be loaded" message and the rest of the page (header/nav) stays intact. No change to any form that currently renders successfully.
2. **Add a null/shape guard before `Object.entries(schema.properties)`** in `DynamicForm.tsx` (issue 4.5): `if (!schema?.properties) return <FormUnavailableFallback />;`. Again, this only changes the already-broken null-schema path — a valid schema is unaffected.

*Effort: small, isolated, no shared-flow risk. Ship this first regardless of anything else below.*

### Phase 1 — Type the contract (compile-time only, no runtime change)

3. **Introduce a `FormSchema`/`FormUiSchema` TypeScript interface** in `libs/shared-lib-v2/src/DynamicForm/utils/Interfaces.ts`, describing the minimum required shape (`properties`, `required`, `type`) and a string-literal union of the known `ui:widget` names (derived directly from the existing `widgets` map keys at `DynamicForm.tsx:805-829` — no new names invented). Apply this type to `fetchForm`'s return value and to `DynamicForm`'s props, removing `//@ts-nocheck` incrementally (file by file, not all at once). This is purely a compile-time/CI safety net — it does not alter what the app does at runtime, only surfaces a build warning the next time the backend's shape actually drifts from what the frontend expects.
4. **Add a non-blocking runtime shape check** (e.g., a lightweight ajv "meta-schema" validating the *shape of the schema itself*, not the form data) that only logs a warning to monitoring/telemetry when the fetched schema doesn't match the expected contract — it should not block rendering yet. This makes contract drift *observable* before deciding to enforce it, so there's a data-driven basis for tightening later without guessing.

*Effort: medium, no runtime behavior change, purely improves visibility.*

### Phase 2 — Fix the concrete widget/logic bugs (small, isolated diffs)

5. **Fix the `.pop('batch')` bug** (issue 4.2) in `RegisterUser.tsx:151`:
   ```js
   // before
   responseForm?.schema?.required.pop('batch');
   // after
   if (responseForm?.schema?.required) {
     responseForm.schema.required = responseForm.schema.required.filter(f => f !== 'batch');
   }
   ```
   This is a single-file, single-purpose fix that makes the code do what it always intended to do — removing `'batch'` specifically, regardless of array order. It cannot regress any other field's required status, since today's buggy version was already removing an unpredictable field.
6. **Fix the failed-upload-passes-validation bug** (issue 4.3) in `CustomFileUpload.tsx`'s `handleFileChange`: only push to `newFiles`/call `onChange` with a URL when `uploadedUrl` is truthy; on failure, skip that file (the existing alert already informs the user) rather than adding a bogus entry.
   ⚠️ **Note this is a deliberate, visible behavior change**: uploads that previously "succeeded" silently (bad URL, but validation passed) will now correctly block submission until a real file is attached. Flag this explicitly to QA/product before shipping, since it changes what black box testers will observe compared to before — it is fixing incorrect behavior, not preserving it.
7. **Make `CustomFileUpload` and `AutoCompleteMultiSelectWidget` respect the Form-level `disabled`/`readonly` props** (issue 4.4), additively: `const isDisabled = disabled || readonly || uiSchema?.['ui:disabled'] === true;`. Every place that currently disables a field via `ui:disabled` keeps working identically (the condition still evaluates `true` for them); this only changes behavior for the previously-broken case where a consumer disables the whole `<Form>`, which today doesn't work for these two widgets anyway — so nothing that currently works correctly can regress.
8. **Fail closed on malformed `allowedFormats`** (issue 4.8): validate that the backend-provided value is actually a non-empty array before trusting it to gate the format check; if it's malformed, fall back to a safe default allowlist instead of disabling the check entirely.

*Effort: small per item, each independently testable and shippable; do these as separate small PRs rather than one large change, so any regression is easy to isolate.*

### Phase 3 — Consolidate the duplicated implementations (larger effort — plan separately, don't bundle with the above)

9. Given issue 4.10, plan a follow-up migration where `apps/admin-app-repo` and `mfes/scp-teacher-repo` import the shared-lib-v2 `DynamicForm` instead of maintaining local forks. This is **not** part of the immediate non-breaking fix set — it's a larger refactor that itself needs full regression testing across every consumer of the two local copies, and should be scheduled as its own tracked effort once Phases 0–2 are stable.

### Phase 4 — Lock in the fixes with tests (do alongside Phase 2, not after)

10. The repo has Jest configured (`jest.config.ts`) but no existing tests for `DynamicForm`. Add component tests (React Testing Library) using fixture schemas that specifically cover: a valid schema (must keep passing — the regression guard for everything above), a schema with an unregistered widget name, a schema missing `properties`, a required file field with a simulated failed upload, and a form-level `disabled` state. These fixtures directly encode issues 4.1–4.5 and 4.7 as permanent regression tests.
11. There is currently no E2E/black-box automation at all in the repo (the only Cypress config found, in `mfes/scp-teacher-repo`, is empty boilerplate with no specs). Recommend the confirmed black box findings from Section 6 below be captured as the first real Cypress/Playwright specs for this feature, so future backend schema changes are caught automatically rather than requiring a manual re-test every time.

---

## 6. Test Checklist — Dynamic Form (Backend Schema-Driven)

| # | Test Case | Steps | Expected per current code |
|---|-----------|-------|----------------------------|
| 1 | Unknown widget name from backend | Intercept the `/api/dynamic-form/get-rjsf-form` response and set one field's `ui:widget` to a nonexistent name; load the form | ⚠️ Currently crashes the whole page (issue 4.1) — after Phase 0, should show a contained fallback message |
| 2 | Null/empty schema response | Simulate the schema API returning `null`/`{}`; load any DynamicForm-consuming page | ⚠️ Currently inconsistent per page — some blank, some may throw (issue 4.5/4.6) |
| 3 | Failed schema fetch (network error/500) | Block the `/api/dynamic-form/get-rjsf-form` request; load the form | ⚠️ Each consumer page behaves differently — test each page individually, don't assume one result generalizes |
| 4 | Required file upload with forced upload failure | Select a file for a required upload field, disconnect network before the S3 upload completes, dismiss the alert, attempt submit | ⚠️ Currently allowed to submit as if the file were attached (issue 4.3) |
| 5 | File format restriction bypass via malformed backend config | (Requires backend/QA collaboration) Send a non-array `allowedFormats` in `ui:options`; attempt to upload any file type | ⚠️ Currently accepted regardless of type (issue 4.8) |
| 6 | Read-only/disabled form mode | Open the form in any read-only/disabled context used by the app; attempt to edit a file-upload field and a multi-select autocomplete field | ⚠️ These two remain editable while other fields correctly lock (issue 4.4) |
| 7 | Registration `batch`/required-field exemption | Complete registration and inspect (via Network tab) the schema's `required` array vs. which fields the UI actually enforces as required around `batch`/adjacent fields | ⚠️ Wrong field may be exempted depending on backend field order (issue 4.2) |
| 8 | Organization/Center/PTM search — displayed vs. submitted value | Select a value in a search widget, then trigger a scenario where the record falls outside the currently loaded page (e.g. via a filter change); check the displayed label vs. the actual submitted payload in the Network tab | 🟡 Label may show a placeholder ("Selected") even though the correct value is bound (issue 4.9) — verify the underlying value, not just the label |
| 9 | Conditional field toggling (dependencies/oneOf) | On a form using conditional fields (e.g. education-level driven fields, or age-based guardian info), toggle the driving field back and forth multiple times | Verify dependent fields' values and required-state are correctly recalculated each time, not stuck from a previous toggle |
| 10 | Same scenario across all DynamicForm copies | Repeat tests 1–9 against a page using `apps/admin-app-repo`'s local `DynamicForm` copy and a page using `mfes/scp-teacher-repo`'s local copy, not just the shared-lib-v2 consumers | 🟡 Results may differ between copies — do not assume a fix/behavior in one applies to the others (issue 4.10) |
| 11 | Stale schema on long-open session | Open a form, wait/simulate a backend form-config change (or just note elapsed time in a long QA session), then submit | No re-validation against current backend schema occurs (issue 4.7) — confirm with the backend team what happens server-side on a mismatched submission |

---

*This report is based on static analysis of the branch `feat-sonar-issue` as of 2026-08-05. Re-verify line numbers against the current code before filing tickets, since the codebase may have changed since this analysis. See also `Black_Box_Testing_Report.md` and `Manual_Test_Case_Checklist.md` in this same folder for the application-wide black box testing baseline.*
