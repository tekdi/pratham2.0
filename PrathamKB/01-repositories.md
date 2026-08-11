# Repository Catalog

> Only one repository is visible from this working directory: `pratham2.0`, a single NX
> monorepo. There is no local copy of the backend/interface, Sunbird/Knowlg content platform,
> or Keycloak repos, so they are not cataloged here — fields like Repository Owner and
> per-service failure points for those systems are out of scope for this document rather than
> guessed. This catalog instead breaks the one repo down into its deployable units (host apps,
> MFEs, shared libs), which is the level of granularity an issue actually maps to.

## Repository: `pratham2.0`

| Property | Value |
|---|---|
| Repo type | NX Monorepo |
| Package name | `@shikshav2.0/source` |
| NX version | 20.2.2 |
| Node (Docker) | 20 |
| React | 18.3.1 |
| Next.js | 14.2.16 |
| TypeScript | ~5.6.2 |
| CI | GitHub Actions (9 workflows) + Jenkins (QA teacher SSH deploy) |

### Top-level layout

```
pratham2.0/
├── apps/            3 host shell applications
├── mfes/            13 micro-frontend applications
├── libs/            2 shared component libraries
```

---

## Host Applications (`apps/`)

| App | Path | Port | Router | Purpose |
|---|---|---|---|---|
| Admin App | `apps/admin-app-repo` | 3002 | Pages Router | Admin portal — manage users, centers, content, programs, taxonomy, notification templates, certificates |
| Teachers (shell) | `apps/teachers` | 3001 | Pages Router | Thin shell — auth entry point, redirects to SCP Teacher / YouthNet MFEs |
| Learner Web App | `apps/learner-web-app` | 3003 | App Router | Learner portal — registration, courses, content player, POS |

## Micro-Frontends (`mfes/`)

| MFE | Path | Base Path | Port | Purpose |
|---|---|---|---|---|
| Authentication | `mfes/authentication` | `/authentication` | 4101 | Login/logout pages |
| SCP Teacher | `mfes/scp-teacher-repo` | `/scp-teacher-repo` | 4102 | Primary teacher/facilitator UI — dashboard, attendance, assessments, board enrollment, curriculum planner, observations |
| YouthNet | `mfes/youthNet` | `/youthnet` | 4103 | Vocational-training program module — mentor/manager dashboards, village & volunteer management, surveys |
| Workspace | `mfes/workspace` | `/mfe_workspace` | 4104 | Content-creation workspace **and API proxy** for all Sunbird content calls; bulk import |
| Notification | `mfes/notification` | — | 4105 | Push notification module |
| Players | `mfes/players` | `/sbplayer` | 4106 (admin) / 4107 (teachers) / 4108 (learner) | Sunbird content player; built 3× — once per stack |
| Forget Password | `mfes/forget-password` | `/forget-password` | 4109 | Forgot/reset password flow |
| Login | `mfes/login` | — | 4110 | Login component module |
| Profile Manage | `mfes/profile-manage` | — | 4111 | Profile management module |
| Survey Observations | `mfes/survey-observations` | — | 4112 | Observation forms (center/facilitator/learner) |
| Content | `mfes/content` | `/mfe_content` | 4113 | Content browsing components (imported by learner app via path alias) |
| Taxonomy Manager | `mfes/taxonomy-manager` | `/taxonomy-manager` | 4114 | Content classification framework (Board/Medium/Grade/Subject) management |
| Survey Forms | `mfes/survey-forms` | `/plp-surveys` | 4115 | Generic survey fill/list flows (learner + teacher role-specific routes) |
| Editors | `mfes/editors` | — | — | Sunbird collection/question-set/generic content editors |

## Shared Libraries (`libs/`)

| Library | Alias | Purpose |
|---|---|---|
| `libs/shared-lib` | `@shared-lib` | V1 — UI primitives, Sunbird player/editor wrappers, services. **Legacy** — prefer v2 for new work. |
| `libs/shared-lib-v2` | `@shared-lib-v2/*` | V2 — DynamicForm (RJSF) engine, MapUser widgets, AuthService, IndexedDB tracking queue, TTS |

---

## Micro-Frontend Integration Patterns

Three patterns are used simultaneously across the monorepo:

**A — Next.js middleware URL rewriting (primary).** Each host app's `middleware.ts`
transparently rewrites URL prefixes to the target MFE's port; the browser only ever sees one
origin.

```
Admin (apps/admin-app-repo/src/middleware.ts):
  /mfe_workspace/*     → http://localhost:4104
  /sbplayer/*          → http://localhost:4106
  /taxonomy-manager/*  → http://localhost:4105

Teachers (apps/teachers/src/middleware.ts):
  /scp-teacher-repo/*  → http://localhost:4102
  /youthnet/*          → http://localhost:4103
  /sbplayer/*          → http://localhost:4107

Learner (apps/learner-web-app/src/middleware.ts):
  /sbplayer/*          → http://localhost:4108
  /forget-password/*   → http://localhost:4109
```

**B — Webpack Module Federation.** Only `mfes/scp-teacher-repo` uses this, consuming the
`editor` remote exposed by `mfes/workspace` via `@module-federation/nextjs-mf`.

**C — Static build-time path aliases.** `apps/learner-web-app` imports `mfes/content` and
`mfes/players` components directly at build time via `tsconfig.json` aliases (`@Content`,
`@ContentPlayer`, `@players/*`, `@content-mfes/*`) — not a runtime integration at all.

## Common Failure Points (cross-cutting, from architecture notes)

- **`workspace` (port 4104) is the API proxy for all Sunbird content calls** from admin and
  teacher apps. If workspace is down or misconfigured, content fails to load in *every* other
  stack that depends on it, not just the workspace UI itself.
  See `Project_Tech_Arch_UI_UX/TECH_ARCHITECTURE.md` §9, §19.
- **`players` is built three separate times** (once per stack, different ports). A player bug
  fixed in one stack is not automatically fixed in the others — check all three
  (`Players.tsx` in each build) when a content-playback issue is reported.
- **Auth interceptor logic (`Interceptor.ts` / `RestClient.ts`) is duplicated independently in
  7+ places** (admin, teachers, scp-teacher-repo, workspace, editors, shared-lib,
  shared-lib-v2). An auth-header bug may be present in only one copy — check which app/MFE the
  failing request originates from before assuming a global fix.
- **Feature flags (`module.config.js` in `scp-teacher-repo` and `youthNet`) are build-time
  only.** A feature that "won't turn off" or "won't turn on" via config likely needs a rebuild,
  not a runtime config change.
- Full list: `Project_Tech_Arch_UI_UX/TECH_ARCHITECTURE.md` §19 ("Known Architecture Notes").

## Out of Scope (not in this repository)

The following are referenced by this repo (via env vars/API calls) but have no code present
here — do not attempt to diagnose their internals from this repo, and don't guess at their
ownership or infrastructure:

- Interface API gateway / middleware backend (`NEXT_PUBLIC_MIDDLEWARE_URL`)
- Sunbird / Knowlg content platform backend (`NEXT_PUBLIC_BASE_URL`)
- Keycloak identity provider (`pratham` realm)
- Course Planner backend service (`NEXT_PUBLIC_COURSE_PLANNER_API_URL`)
- Shikshalokam / MentorEd observation-solution service
