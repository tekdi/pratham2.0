# Program Catalog

> Scope: programs (tenants) as represented in the frontend codebase — role/feature visibility,
> tenant-specific config, and which apps/MFEs serve each program. Business-purpose narrative
> beyond what the code and existing requirements doc capture, and program-level business
> metrics/ownership, are outside what this repo can tell you and are omitted.

Programs are implemented as **tenants** in the frontend (`TenantName` enum, `app.constant.ts`).
Tenant ID drives form schemas, role visibility, and business-rule constants (e.g. certificate
pass thresholds) throughout the codebase.

```typescript
enum TenantName {
  SECOND_CHANCE_PROGRAM = "Second Chance Program",
  YOUTHNET = "Vocational Training",
  POS = "Open School",
  PRAGYANPATH = "Pragyanpath",
  CAMP_TO_CLUB = "Camp to Club",
}
```

---

## Second Chance Program (SCP)

| Field | Detail |
|---|---|
| Target Audience | School dropouts (remedial education) |
| Portals Used | Admin App, Teacher shell → **SCP Teacher MFE** (primary UI), Learner App |
| Repos/MFEs Used | `apps/admin-app-repo`, `apps/teachers`, `mfes/scp-teacher-repo`, `apps/learner-web-app`, `mfes/workspace`, `mfes/taxonomy-manager`, `mfes/players`, `mfes/survey-observations` |
| PLP Features Used | Center/Batch management, Attendance, Digital/Manual/AI Assessments, Board Enrollment, Course Planner, Content Management, Certificates, Observations |
| Special Configuration | Batches carry SCP-specific fields: Board / Medium / Grade. Framework taxonomy example: Board → Medium → Grade → Subject. |
| Admin Sidebar Visibility (SCP tenant) | Team Leaders, Facilitators, Learners, Centers, Certificate Issuance, Master Data, Course Planner, Workspace |
| Known Limitations | `module.config.js` in `scp-teacher-repo` can build-time-disable features (`skippedFeatures`) — a feature reported as "missing" for SCP users may simply be flagged out at build time; check the current array in that file, and remember a rebuild is required to change it (see [05-environments.md](05-environments.md)). |

## YouthNet (Vocational Training)

| Field | Detail |
|---|---|
| Target Audience | Youth (skill/vocational training) |
| Portals Used | Teacher shell → **YouthNet MFE**, Admin App |
| Repos/MFEs Used | `apps/teachers`, `mfes/youthNet`, `apps/admin-app-repo`, `mfes/survey-observations` |
| PLP Features Used | Mentor/Manager dashboards, Village management, Volunteer management, Surveys (village/camp/village-camp), Course assignment & completion tracking, Observations |
| Special Configuration | Distinct role set: Mentor, Mentor Leader / Central Head, Mobilizer. Uses the same `module.config.js` feature-flag mechanism as SCP but as an independent MFE build. |
| Admin Sidebar Visibility (YouthNet tenant) | Mentor, Mentor Leader (Central Head), Mobilizer, Certificate Issuance, Master Data |
| Known Limitations | Same build-time feature-flag caveat as SCP — flags are per-MFE-build, not shared with `scp-teacher-repo`'s flags even though the config file shape is identical in both. |

## Pratham Open School (POS)

| Field | Detail |
|---|---|
| Target Audience | Open-access learners (school / life / work tracks), no login required |
| Portals Used | Learner App only (`/pos/*`) |
| Repos/MFEs Used | `apps/learner-web-app`, `mfes/content`, `mfes/players` |
| PLP Features Used | Content browsing (School / Life / Work tracks), content player, content search, program listing — all without authentication |
| Special Configuration | No auth required for browsing; distinguishes this tenant's routes from all other authenticated flows in the learner app. |
| Known Limitations | None specific to POS beyond the general content-player caveats in [04-capabilities.md](04-capabilities.md). |

## Pragyanpath

| Field | Detail |
|---|---|
| Target Audience | Alternative program variant (per `TenantName` enum; no further business detail is present in this repo) |
| Portals Used | Same portal set as other tenants (Admin / Teacher / Learner), scoped by tenant ID |
| Repos/MFEs Used | Shared with SCP/general tenants — no Pragyanpath-specific MFE exists |
| PLP Features Used | Not independently documented in this repo — inherits the standard tenant-driven feature set |
| Known Limitations | Business context beyond the tenant name is not present in the frontend code; consult program/product owners for scope. |

## Camp to Club

| Field | Detail |
|---|---|
| Target Audience | Camp-based program (per `TenantName` enum) |
| Portals Used | Same portal set as other tenants, scoped by tenant ID |
| Repos/MFEs Used | Shared with SCP/general tenants — no Camp to Club-specific MFE exists |
| PLP Features Used | Not independently documented in this repo — inherits the standard tenant-driven feature set |
| Known Limitations | Business context beyond the tenant name is not present in the frontend code; consult program/product owners for scope. |

---

## Cross-Program Notes

- **Form schemas are always tenant-aware and API-served** (`GET /form/read?context=&contextType=`)
  — never hardcoded per tenant in the frontend. A "wrong field showing for tenant X" bug is a
  form-schema/backend config issue, not a frontend logic bug, in the vast majority of cases.
- **Certificate pass threshold differs by tenant**: default tenants require 40% assessment pass
  rate; tenant `914ca990-...` requires 80%. If a certificate-issuance bug report is tenant-
  specific, check which threshold applies before assuming a shared bug.
- Content Creator (SCTA) sidebar: Course Planner, Workspace, Support Request (SCP only).
  Content Reviewer (CCTA) sidebar: Workspace only. These are role-based, not tenant-based,
  overlays on top of the tenant-specific menus above.
