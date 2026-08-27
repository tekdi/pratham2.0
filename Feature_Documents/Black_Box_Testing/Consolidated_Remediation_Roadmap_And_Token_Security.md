# Consolidated Remediation Roadmap & Token Storage Security

**Project:** Pratham 2.0
**Branch analyzed:** `feat-sonar-issue`
**Date:** 2026-08-05
**Companion documents:** `Black_Box_Testing_Report.md`, `Manual_Test_Case_Checklist.md`, `Dynamic_Form_Backend_Schema_Testing_Report.md` (this file merges the first and third's issue lists into one roadmap and adds a new deep-dive on token storage)

---

## 1. Executive Answer

### How many steps to fix everything found so far?

**31 discrete, independently-fixable issues**, merged from the two prior analysis reports plus 4 new token-security action items introduced in this document:

| Source | Issues |
|---|---|
| `Black_Box_Testing_Report.md` §6 (app-wide risk register) | 17 |
| `Dynamic_Form_Backend_Schema_Testing_Report.md` §4 (Dynamic Form) | 10 |
| This document §3 (token storage security) | 4 |
| **Total** | **31** |

("Steps" here means distinct fixes/tickets, not lines of code — several, like the 13 duplicated `Interceptor.ts` files, each expand into multiple per-file edits once actually implemented; that's called out where relevant.)

### Is this solvable, and does it need backend dependencies?

**Yes, almost all of it is solvable by the frontend team alone.** Of the 31 items:

| Dependency | Count | Notes |
|---|---|---|
| **Frontend-only** | 24 | Fixable entirely within this repo, no other team needed |
| **Needs backend coordination/confirmation** | 5 | Backend must confirm or change server-side behavior (server-side RBAC re-validation, OTP rate-limiting, password policy enforcement, schema contract stability, refresh-token cookie issuance if going the backend-cookie route instead of the BFF route) |
| **Needs infra/DevOps** | 1 | Content-Security-Policy header rollout needs Nginx/deployment config, not just app code |
| **Needs product decision** | 1 | Whether the 11 untranslated mfes should get full localization, or are intentionally English-only |

The one item that looked hardest going in — **securing the token stored in `localStorage`** — turns out to be **solvable without any backend dependency**, because of a specific architectural fact confirmed below: every app/mfe is already served from one shared domain via Nginx path-prefixing in production. That means the frontend can build its own same-origin cookie-issuing proxy (a "BFF" — Backend-For-Frontend pattern) without needing the actual identity/middleware backend to change anything. See §3 for the full plan; §3.4 also documents the alternative (smaller effort, but requires the backend team) if that's ever preferred.

---

## 2. Consolidated Fix List (all 27 prior issues, one table)

Legend — **Dependency**: 🟢 Frontend-only · 🟡 Needs Backend · 🟠 Needs Infra · 🔵 Needs Product decision. **Effort**: S (hours) · M (1-3 days) · L (multi-day/multi-file).

### 2.1 — From `Black_Box_Testing_Report.md` §6

| # | Issue | Severity | Location | Dependency | Effort |
|---|---|---|---|---|---|
| 1 | OAuth `client_secret` shipped in client bundle | Critical | `apps/teachers/src/Services/Login/LoginService.tsx:9-10` | 🟢 | M |
| 2 | Static bearer token/cookie shipped in client bundle | Critical | `mfes/taxonomy-manager/src/utils/ApiUtilityService.ts:4-5` | 🟢 | M |
| 3 | Plaintext username/password logged to console | Critical | `RegisterationFlow.tsx:663-676`, `RegisterUser.tsx:463-476` | 🟢 | S |
| 4 | Login password field never validated (`passwordError` dead state) | Critical | `mfes/authentication/src/pages/login.tsx:44-45,100` | 🟢 | S |
| 5 | 13 of 14 `dangerouslySetInnerHTML` sites unsanitized | High | See report §5.6.1 | 🟢 | M |
| 6 | `RouteGuard` (role/tenant enforcement) disabled | High | `apps/admin-app-repo/src/pages/_app.tsx:159` | 🟢 (re-enable) / 🟡 (if rules need backend confirmation first) | M |
| 7 | No React error boundary / custom 500 page anywhere | Medium | Report §5.2.4-5 | 🟢 | M |
| 8 | Password policy is length ≥ 4 only | Medium | `ResetPasswordForm.tsx` (both copies) | 🟡 (must match backend's actual policy) | S |
| 9 | Client-side-only auth guard; RBAC read from editable `localStorage` | Medium | Report §5.3.2-3 | 🟡 (backend must already re-validate server-side — confirm, don't assume) | M |
| 10 | File upload type/size checks inconsistent | Medium | `FileUploadDialog.tsx`, `FileUploadField.tsx` | 🟢 | M |
| 11 | Empty `catch` blocks / errors swallowed silently | Medium | `user-instructor.tsx:642-644`, `UserService.ts:8-14` | 🟢 | M |
| 12 | 11 of ~16 mfes have zero translation files | Low | Report §5.4.1 | 🔵 (product must decide scope) | L |
| 13 | `PaginatedTable` has no empty-state message | Low | `apps/admin-app-repo/src/components/PaginatedTable/PaginatedTable.tsx` | 🟢 | S |
| 14 | No default axios timeout / retry / offline messaging | Low | Report §5.2.6 | 🟢 | M |
| 15 | Duplicate-submission guard missing on some forms | Low | `AddNewCenters.tsx:333-347` | 🟢 | S |
| 16 | Clickable `<div onClick>` without keyboard support | Low | Report §5.4.4 (7+ instances) | 🟢 | M |
| 17 | No automated E2E/black-box regression suite | Low | `mfes/scp-teacher-repo/cypress.config.ts` (empty) | 🟢 | L |

### 2.2 — From `Dynamic_Form_Backend_Schema_Testing_Report.md` §4

| # | Issue | Severity | Location | Dependency | Effort |
|---|---|---|---|---|---|
| 18 | Unregistered widget name from backend crashes the page | Critical | `DynamicForm.tsx` widget resolution (§4.1) | 🟢 (error boundary) + 🟡 (backend/frontend must agree on a widget-name contract going forward) | M |
| 19 | `.pop('batch')` bug removes the wrong required field | High | `RegisterUser.tsx:151` | 🟢 | S |
| 20 | Failed file upload still passes required-field validation | High | `CustomFileUpload.tsx` (§4.3) | 🟢 | S |
| 21 | Two widgets ignore Form-level `disabled`/`readonly` | Medium | `CustomFileUpload.tsx:41`, `AutoCompleteMultiSelectWidget.tsx:36` | 🟢 | S |
| 22 | No defensive null-check on malformed schema | Medium | `DynamicForm.tsx` (§4.5) | 🟢 | S |
| 23 | Schema fetch failure/loading reimplemented ~50×, inconsistently | Medium | Report §4.6 | 🟢 | L |
| 24 | No schema versioning/staleness check | Low | Report §4.7 | 🟡 (backend needs to confirm what it does on a schema/version mismatch, if it does anything) | M |
| 25 | `allowedFormats`/`maxSelections` fail open on malformed config | Low | `CustomFileUpload.tsx:31-35` | 🟢 | S |
| 26 | Display value can diverge from submitted value (search widgets) | Low | `OrganizationSearchWidget.tsx:558-588` | 🟢 | S |
| 27 | 3-4 duplicated `DynamicForm` copies must be independently checked/fixed | Medium (process risk) | `apps/admin-app-repo`, `mfes/scp-teacher-repo` copies | 🟢 | L |

---

## 3. Securing the `localStorage` Token Pattern (new deep-dive)

### 3.1 Current state (verified against the code)

- Access/refresh tokens are read/written via `localStorage` **344 times** across every one of the 16 apps/mfes in this repo — this is not a localized issue, it's the standard pattern everywhere.
- **20 distinct files actually write the token**: the 13 per-app/mfe `Interceptor.ts` files (each does its own login-response storage + 401-refresh-and-retry logic) plus 7 login/SSO/registration pages (`apps/admin-app-repo/src/pages/login.tsx`, `apps/admin-app-repo/src/pages/sso/index.tsx`, `apps/learner-web-app/src/app/login/page.tsx`, `apps/learner-web-app/src/app/sso/page.tsx`, `mfes/youthNet/src/pages/sso/index.tsx`, `mfes/scp-teacher-repo/src/pages/login.tsx`, `mfes/authentication/src/pages/login.tsx`).
- **Why this matters (ties directly to issue #5 above)**: 13 of 14 places in the codebase that inject raw HTML skip sanitization. That XSS risk is not abstract — a successful injection at any of those 13 sites can run `localStorage.getItem('token')` and exfiltrate the session. The token-storage issue and the unsanitized-HTML issue are the same risk viewed from two ends; fixing the sanitization (issue #5) without also reducing what an XSS can steal (this section) leaves a single point of failure.
- **Production topology — the fact that makes a real fix feasible without backend help**: every mfe's `next.config.js` sets a `basePath` with the comment *"This should match the path set in Nginx"* (`mfes/workspace/next.config.js:28` → `/mfe_workspace`, `mfes/taxonomy-manager/next.config.js:15` → `/taxonomy-manager`, `mfes/survey-forms/next.config.js:21` → `/plp-surveys`, `mfes/players/next.config.js:29` → `/sbplayer`, `mfes/content/next.config.js:7,29` → `/mfe_content`). This confirms all apps/mfes share **one domain** in production, reverse-proxied by path prefix — not separate domains or ports. A cookie set with `path=/` on that shared domain is automatically visible to every mfe. No cross-domain CORS/cookie complexity to solve.
- **Login calls the real backend directly from the browser today** — e.g. `apps/admin-app-repo/src/pages/login.tsx` → axios directly to the middleware's `user/v1/auth/login`. There is currently **no server-side proxy (BFF)** in the auth path anywhere in the repo.
- Each app already runs as a real Next.js server (PM2 via `ecosystem.*.config.js`, Docker via `Dockerfile.*`) with its own `pages/api/*` routes already in production use for other things (`multipart-upload`, `telemetry`, `content-upload`) — so server-side request handling is already a normal, proven part of this stack, not a new capability that needs to be introduced.
- Cookie tooling is already used in the repo for non-auth data (`apps/admin-app-repo/src/services/TenantService.ts` uses `Cookies.get/set('tenantId')`), and the `cookie` npm package is already a root dependency — so adding cookie-based auth doesn't require a new dependency, just new usage of one already present.

### 3.2 What this means for feasibility

Because login already goes browser → backend directly (no BFF), there are two paths to remove the token from `localStorage`:

| Path | What changes | Backend dependency |
|---|---|---|
| **A — BFF proxy (recommended)** | Each app adds its own `pages/api/auth/login`, `/refresh`, `/logout` routes. The browser calls these (same-origin) instead of the backend directly. The API route forwards the request to the existing backend exactly as today, receives the token in the JSON response exactly as today, and — instead of returning it to the browser to store — sets it as an `httpOnly`, `Secure`, `SameSite=Lax` cookie in its own response. | **None.** The actual identity/middleware backend's API contract doesn't change at all — it still returns a JSON token like it does now; only the *frontend's own* server, not the backend, ever sees and stores it differently. |
| **B — Backend sets the cookie directly** | The identity/middleware backend itself returns `Set-Cookie: token=...; HttpOnly` on its login/refresh response instead of a JSON body field. | **Yes.** Requires the backend team to implement this, confirm the cookie's `Domain`/`SameSite` settings work through the Nginx proxy, and coordinate a rollout since it changes the actual API contract every existing client of that backend relies on. |

**Recommendation: Path A.** It achieves the same security outcome (token never touches page-readable JS storage) with zero backend involvement, using infrastructure (Next.js API routes) that's already proven in this codebase for other purposes.

### 3.3 Tier 1 — Frontend-only mitigations, ship immediately (no architecture change)

These reduce the blast radius of a token leak *before* the bigger migration in §3.4 is done. Each is small and independently shippable:

1. **Remove console-logging of tokens/credentials** (already flagged as issue #3 in §2.1 above — listed again here because it is a direct prerequisite: there is no point hardening storage while the token is separately being printed to the console in plaintext). Files: `RegisterationFlow.tsx`, `RegisterUser.tsx`, `LocalStorageService.ts` (×2), `pages/api/fileUpload.ts`, `pages/api/proxy.ts`, `apps/teachers/src/pages/login.tsx`.
2. **Sanitize the 13 unsanitized `dangerouslySetInnerHTML` sites** (issue #5 above) — this is the actual delivery mechanism for any theft of the `localStorage` token, so it's listed here as the highest-leverage single fix for token security specifically, not just for XSS in general.
3. **Audit every logout/error path for consistent token clearing** — confirm the `preserveLocalStorage()` allowlist logic in `apps/admin-app-repo/src/utils/Helper.ts` (and its equivalents in other apps) always removes the token key on every exit path, including the ones where the server-side logout call itself fails (currently only `console.log`'d — see the original report §5.3.5).
4. **Add a `Content-Security-Policy` response header** restricting allowed script sources, via Nginx (🟠 needs infra/DevOps, since it's set at the reverse-proxy layer that already terminates all these apps) — this doesn't stop a targeted injection at one of the 13 sites in #2, but meaningfully raises the bar for any *other* injection vector (compromised third-party script, browser extension, etc.) that isn't yet identified.

### 3.4 Tier 2 — BFF-based httpOnly cookie migration (the real fix)

This removes the token from `localStorage` entirely. Recommended as a phased, app-by-app rollout — not a single big-bang change — so each app can be validated independently before moving to the next.

**Step-by-step:**

1. **Pilot on one app first** — `apps/admin-app-repo` (smallest surface among the three host apps, has its own `services/Interceptor.ts` and `login.tsx` already well understood from the earlier report).
2. **Add three new API routes** in that app: `pages/api/auth/login.ts`, `pages/api/auth/refresh.ts`, `pages/api/auth/logout.ts`. Each does exactly what the browser does today (call the real backend with the same payload/headers) but runs server-side, and on success sets the token(s) via `Set-Cookie` (`httpOnly`, `Secure`, `SameSite=Lax`, `path=/`) instead of returning them in the JSON body.
3. **Update `apps/admin-app-repo/src/pages/login.tsx`** to POST to the new `/api/auth/login` route instead of the backend directly, and stop calling `localStorage.setItem('token', ...)` / `localStorage.setItem('refreshToken', ...)` on success — the cookie is already set by step 2.
4. **Update `apps/admin-app-repo/src/services/Interceptor.ts`**: the request interceptor stops reading `localStorage.getItem('token')` to set the `Authorization` header manually — with an `httpOnly` cookie, the browser attaches it automatically on same-origin requests, so *if* outbound API calls are also routed through a same-origin proxy (see step 6), no `Authorization` header needs to be set by JS at all. The 401-response interceptor calls `/api/auth/refresh` (same-origin, cookie sent automatically) instead of the current direct-to-backend refresh call.
5. **Update `apps/admin-app-repo/src/pages/logout.tsx`** to call `/api/auth/logout` (clears the cookie server-side) instead of/in addition to clearing `localStorage`.
6. **The bigger sub-decision — how outbound API calls reach the backend:**
   - **Option 6a (larger, most secure): full proxy.** Every service call in `apps/admin-app-repo/src/services/*.ts` is re-pointed from the backend's URL to a same-origin `/api/proxy/...` route, which reads the `httpOnly` cookie server-side and forwards the request with the `Authorization` header attached server-side. The browser's JS never has the token in any form, ever. Cost: every service file needs its base URL changed, and the app takes on proxy latency/load for every API call, not just auth. Sized **Large**.
   - **Option 6b (smaller, still a real improvement): cookie-protect only the refresh token.** Keep the short-lived access token returned to the browser (in memory/a JS variable, not `localStorage`) for direct-to-backend calls exactly as today, but move only the **refresh token** into the `httpOnly` cookie via steps 2-5. An XSS can still steal the short-lived access token while it's live, but can no longer silently mint new tokens forever once it expires — capping the damage window to the access token's lifetime instead of indefinite. Sized **Medium**, and a reasonable first milestone before committing to 6a.
7. **Repeat steps 2-6 for `apps/learner-web-app` and `apps/teachers`**, then for each mfe that has its own login/SSO page and `Interceptor.ts` (the same 13 files identified in §3.1) — each is a bounded, independently-testable change once the admin-app-repo pattern is proven.
8. **Regression-test against the existing black box test cases** in `Manual_Test_Case_Checklist.md` §A (Login & Authentication) after each app's migration, since login/session/logout behavior is exactly what that section already covers.

**Total scope: 13 `Interceptor.ts` files + ~7 login/SSO pages + new API routes per app (≈3-4 routes × up to ~13-16 modules if rolled out everywhere) = Large, multi-week effort if done as full Option 6a everywhere.** Recommend scoping the initial rollout to the 3 host apps + Option 6b first (Medium effort, meaningfully reduces risk), and treating full proxying (6a) or extending to every mfe as a separate follow-up tracked independently — consistent with how the Dynamic Form report staged its own larger consolidation work.

### 3.5 Tier 3 — Alternative: backend sets the cookie (Path B from §3.2)

If the backend team is available and prefers to own this instead: the identity/middleware backend adds `Set-Cookie` to its login/refresh responses directly, with `httpOnly`/`Secure`/`SameSite` attributes, scoped to the shared domain confirmed in §3.1. This is a **smaller frontend diff** (just stop storing the JSON token field, everything else about the request stays the same) but is **not frontend-solvable alone** — it requires the backend team to change the actual API contract, and needs confirmation that the cookie's `Domain` setting works correctly through the Nginx path-prefix proxy for every mfe. Presented here as the alternative; §3.4 (Tier 2) remains the recommended path specifically because it needs no backend dependency.

### 3.6 Step list for this section (feeds into §2's dependency table)

| # | Step | Dependency | Effort |
|---|---|---|---|
| 28 | Remove console-logging of tokens/credentials (Tier 1.1) | 🟢 | S |
| 29 | Sanitize the 13 unsanitized `dangerouslySetInnerHTML` sites (Tier 1.2) | 🟢 | M |
| 30 | Audit logout/error paths for consistent token clearing (Tier 1.3) | 🟢 | S |
| 31 | Pilot BFF cookie migration on `apps/admin-app-repo` (Tier 2, steps 1-6b) | 🟢 | L |

(The CSP header in Tier 1.4 and the full-proxy/backend-cookie alternatives in Tiers 1.4/2.6a/3 are called out as optional extensions above rather than counted in the 31, since they depend on a scope decision — infra access for CSP, and how far the migration is taken — that should be made once #28-31 are underway.)

---

## 4. Phased Rollout Plan (all 31 items, one order)

| Phase | Contents | Why this order |
|---|---|---|
| **Phase 0 — Safety net** (ship first, no behavior change for working paths) | #7 (error boundary), #18 (error boundary for DynamicForm), #22 (null-guard on malformed schema) | Purely additive; only changes already-broken/crashing paths, zero risk to anything currently working |
| **Phase 1 — Quick, isolated Critical/High fixes** | #1, #2, #3, #4, #5, #6, #19, #20, #28, #29, #30 | Each is a small, single-area diff (S/M effort) closing the highest-severity gaps, including the token-security prerequisites (#28-30) that must land before the bigger migration in Phase 3 has full value |
| **Phase 2 — Medium-severity consistency fixes** | #9, #10, #11, #13, #14, #15, #16, #21, #23, #25, #26 | Improves consistency across the ~50 Dynamic Form consumers and the app-wide UI-state gaps; no architecture change, module-by-module |
| **Phase 3 — Larger, coordinated efforts** | #8, #17, #24, #27, #31 (BFF pilot) | Needs either backend confirmation (#8, #24), sustained effort across duplicated code (#27), new test infrastructure (#17), or a multi-step migration (#31) |
| **Phase 4 — Scope/product decisions, then execute** | #12 (localization scope), Tier 1.4 CSP (infra), Tier 2 full-proxy/mfe-wide rollout, Tier 3 (if backend opts in) | These need a decision from product/infra/backend before sizing further work, so they're sequenced last rather than blocking the rest of the roadmap |

---

*This report consolidates and extends `Black_Box_Testing_Report.md` and `Dynamic_Form_Backend_Schema_Testing_Report.md` (both dated 2026-08-05, branch `feat-sonar-issue`). Token-storage evidence (§3.1) was freshly verified via direct source inspection on 2026-08-05. Re-verify file:line references against the current code before filing tickets, since the codebase may have changed since this analysis.*
