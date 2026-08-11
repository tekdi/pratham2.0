# Environment Configuration

> Scope: branch mapping and build-time feature-flag mechanics, which are the parts of
> "environment configuration" actually encoded in this repo. Database, Redis, storage
> provisioning, current release version, and a running log of recent fixes are operational
> state that lives outside the repo (and would go stale immediately if hand-copied here) —
> they are omitted. See [02-deployments.md](02-deployments.md) for the CI/CD mechanics behind
> this branch mapping.

## Branch → Environment Mapping

| Stack | Dev Branch | QA Branch | Prod Branch |
|---|---|---|---|
| Admin | `main-admin` | `main-admin-qa` | `main-admin-prod` |
| Teacher | `main-teacher` | `main-teacher-qa` | `main-teacher-prod` |
| Learner | `main-learner` | `main-learner-qa` | `main-learner-prod` |

Each branch push triggers its own GitHub Actions workflow (see
[02-deployments.md](02-deployments.md)). There is also a separate Jenkins pipeline for QA
Teacher that clones `main-teacher` (not `main-teacher-qa`) — worth confirming with the
deploying team which one is authoritative for QA Teacher if the two ever appear to disagree.

## Environment Variables (reference)

All variables live in a single root `.env`, injected per environment via GitHub Secrets
(`DEV_LAP_ENV`, `QA_LAP_ENV`, `PROD_LAP_ENV`, and the `_LMP_`/`_PLP_` equivalents for
teacher/learner). The variable *names* are static across environments; only their *values*
change per environment/secret. Key groups (see
`Project_Tech_Arch_UI_UX/TECH_ARCHITECTURE.md` §16 for the full list):

- API endpoints: `NEXT_PUBLIC_MIDDLEWARE_URL`, `NEXT_PUBLIC_BASE_URL`,
  `NEXT_PUBLIC_WORKSPACE_BASE_URL`, `NEXT_PUBLIC_TELEMETRY_URL`,
  `NEXT_PUBLIC_COURSE_PLANNER_API_URL`, `NEXT_PUBLIC_SURVEY_URL`
- Auth/tenant: `AUTH_API_TOKEN`, `NEXT_PUBLIC_TENANT_ID`, `NEXT_PUBLIC_FRAMEWORK_ID`,
  `NEXT_PUBLIC_CHANNEL_ID`
- Cross-MFE URLs: `NEXT_PUBLIC_SCP_PROJECT`, `NEXT_PUBLIC_YOUTHNET_PROJECT`,
  `NEXT_PUBLIC_LOGIN_URL`, `NEXT_PUBLIC_ADMIN_LOGIN_URL`, `NEXT_PUBLIC_ADMIN_SBPLAYER`,
  `NEXT_PUBLIC_TEACHER_SBPLAYER`, `NEXT_PUBLIC_LEARNER_SBPLAYER`, `NEXT_PUBLIC_WORKSPACE`
- Firebase/FCM: `NEXT_PUBLIC_FCM_*` (8 variables)
- AWS: `AWS_ACCESS_KEY_ID`, `AWS_ACCESS_SECRET_KEY`, `AWS_BUCKET_NAME` (`knowlg-public`),
  `AWS_REGION` (`ap-south-1`)
- JotForm: `NEXT_PUBLIC_JOTFORM_ID`, `NEXT_PUBLIC_JOTFORM_URL`,
  `NEXT_PUBLIC_CONTENT_DOWNLOAD_JOTFORM_ID`

If a bug report smells like "works in one environment, not another," the first thing to check
is whether one of these values differs between the two environments' secrets — the frontend
code path is identical across environments by design.

## Feature Flags (build-time only)

`scp-teacher-repo` and `youthNet` each ship a `module.config.js` with the same shape:

```js
module.exports = {
  skippedFeatures: [...],   // feature names to exclude at build time
  features: { ... },        // feature → pages/components map, used to compute skippedComponents
}
```

- Flags are **evaluated at build time**, not runtime — toggling a flag requires a rebuild and
  redeploy of that specific MFE. There is no admin UI or runtime config for this.
- The two files are independent per MFE — a flag set in `scp-teacher-repo/module.config.js`
  has no effect on `youthNet`, even though the config shape is identical.
- To check what's currently disabled in a given environment, read
  `mfes/scp-teacher-repo/module.config.js` / `mfes/youthNet/module.config.js` **on the branch
  that environment deploys from** (see branch mapping above) — the flag state can differ
  between Dev/QA/Prod if a flag change hasn't been merged/promoted across all three branches
  yet.

## Cross-Environment Architecture Notes Worth Checking First

(Full list in `Project_Tech_Arch_UI_UX/TECH_ARCHITECTURE.md` §19.)

1. Three stacks are fully independent Docker images — a fix merged to one branch/stack is not
   present in the others until separately merged and deployed.
2. `players` MFE is built once per stack (3 total) — check whether a player fix landed in the
   specific stack's build, not just "the players code."
3. No Redux — all new global state should be Zustand; server-state caching is React Query.
4. `workspace` MFE (port 4104) must be running and reachable for any Sunbird content call from
   admin/teacher stacks to succeed.
5. Auth interceptor logic is duplicated per app — a header/token bug may be isolated to one
   copy.
6. Service worker (learner app) cannot read `localStorage` — config arrives via `postMessage`
   every 60 seconds; a stale SW config is a timing/lifecycle issue, not a data issue.

## Not Available in This Repository

- Current release version per environment
- Database engine/instance details
- Redis configuration
- A maintained "known issues / recent fixes" log — this changes too fast to keep accurate as a
  static document; check the issue tracker and recent commits on the relevant branch instead.
