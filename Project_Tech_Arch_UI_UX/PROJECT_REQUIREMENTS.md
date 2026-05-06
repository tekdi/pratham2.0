# Pratham 2.0 — Project Requirements & Feature Documentation

> Complete reference for product features, user flows, business rules, and module specifications.
> Use this document to scope new features, write bug reports, plan sprints, and understand existing behavior.

---

## 1. Product Overview

**Pratham 2.0** is a large-scale educational platform serving multiple learning programs under the Pratham organization. It provides end-to-end digital infrastructure for learner enrollment, content delivery, attendance tracking, assessments, and program administration.

### Programs Supported

| Program | Short Name | Target Group |
|---------|------------|-------------|
| Second Chance Program | SCP | School dropouts (remedial education) |
| Vocational Training / YouthNet | YOUTHNET | Youth (skill/vocational training) |
| Pratham Open School | POS | Open access learners (school/life/work) |
| Pragyanpath | — | Alternative program variant |
| Camp to Club | — | Camp-based program |

### Three Application Portals

| Portal | Users | URL |
|--------|-------|-----|
| **Admin App** | Admins, State Leads, Content Creators/Reviewers | Port 3002 |
| **Teacher App / SCP** | Facilitators, Team Leaders, Mentors, Mobilizers | Port 3001 + MFEs |
| **Learner App** | Students / Learners | Port 3003 |

---

## 2. User Roles & Permissions

### Role Definitions

| Role ID | Display Name | Description |
|---------|-------------|-------------|
| `STUDENT` / `LEARNERS` | Learner | End-user receiving education |
| `TEACHER` | Facilitator / Instructor | Conducts sessions, marks attendance |
| `TEAM_LEADER` | Team Leader (Lead) | Manages facilitators, reviews performance |
| `ADMIN` | State Lead | State-level administration |
| `CENTRAL_ADMIN` | Central Lead / Central Head | National-level administration |
| `SCTA` / `CONTENT_CREATOR` | State Content Creator | Creates content for review |
| `CCTA` / `CONTENT_REVIEWER` | Central Content Reviewer | Reviews and publishes content |
| `MOBILIZER` | Mobilizer / Mentor | Field outreach, volunteer registration |

### Role-Based Feature Access

| Feature | Learner | Teacher | Team Leader | Admin | Central Admin | Content Creator | Content Reviewer |
|---------|---------|---------|-------------|-------|---------------|-----------------|-----------------|
| Dashboard | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Manage Centers | — | View | ✓ | ✓ | ✓ | — | — |
| Mark Attendance | — | ✓ | View | — | — | — | — |
| Manage Learners | — | View | ✓ | ✓ | ✓ | — | — |
| Manage Facilitators | — | — | ✓ | ✓ | ✓ | — | — |
| Assessments | — | ✓ | ✓ | View | View | — | — |
| Board Enrollment | — | ✓ | ✓ | View | View | — | — |
| Course Planner | — | View | ✓ | ✓ | ✓ | ✓ | ✓ |
| Workspace (Create Content) | — | — | — | — | — | ✓ | — |
| Content Review/Publish | — | — | — | — | — | — | ✓ |
| Taxonomy Manager | — | — | — | ✓ | ✓ | — | — |
| Notification Templates | — | — | — | ✓ | ✓ | — | — |
| Certificate Issuance | — | — | ✓ | ✓ | ✓ | — | — |
| Browse Content | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

### Tenant-Specific Role Visibility (Admin Sidebar)

**SCP tenant:** Team Leaders, Facilitators, Learners, Centers, Certificate Issuance, Master Data, Course Planner, Workspace

**YouthNet tenant:** Mentor, Mentor Leader (Central Head), Mobilizer, Certificate Issuance, Master Data

**Content Creator (SCTA):** Course Planner, Workspace, Support Request (SCP only)

**Content Reviewer (CCTA):** Workspace only

---

## 3. Authentication & Registration

### 3.1 Standard Login

**Flow:**
1. User enters username + password
2. API: `POST /account/login`
3. Response: `access_token`, `refresh_token`
4. Store in `localStorage`: `token`, `refreshToken`, `userId`, `tenantId`, `role`
5. Route user to correct portal based on role + tenant:
   - Learner → Learner App
   - Facilitator/Teacher/Team Leader → SCP Teacher MFE
   - Admin/State Lead → Admin App
   - Central Admin → Admin App
   - Content Creator → Workspace MFE
   - YouthNet roles → YouthNet MFE

**Business Rules:**
- On 401 → auto-refresh token silently
- On refresh failure → force logout + redirect to `/logout`
- Language preference persisted to `localStorage.preferredLanguage`

---

### 3.2 Learner Registration

**Entry point:** `/registration` in Learner App

**Steps:**
1. **Mobile number entry** — user enters mobile number
2. **OTP verification** — 6-digit OTP sent to mobile; 120-second countdown timer; resend available
3. **Account check** — system checks if mobile is linked to an existing account
   - If yes → show `AccountExistsCard` with login option
   - If no → proceed to registration
4. **Profile form** — dynamic RJSF form (fields vary by tenant/program)
5. **Username suggestion** — system auto-generates username options based on name
6. **Password creation** — user sets password
7. **Registration success** — auto-login
8. **Program enrollment** — `EnrollProgramCarousel` shows available programs

**Business Rules:**
- Mobile number must be unique per account
- Username must be unique in the system
- Password minimum complexity rules apply (as configured in form schema)

---

### 3.3 Forgot Password / Reset Flow

**Entry points:** `/forget-password` (learner), `/forgot-password` (teacher), `/account/forget-password` (admin)

**Steps:**
1. Enter username or mobile (`ForgotPasswordComponent`)
2. OTP sent to registered mobile — 4-digit input (`OtpVerificationComponent`)
   - 120-second timer with resend option
   - Shows masked mobile number for confirmation
3. Enter new password + confirm (`ResetPasswordForm`)
4. Success confirmation (`PasswordResetSuccess`)

---

### 3.4 SSO (Single Sign-On) Ingestion

**Entry point:** `/sso` available on all three portals

**Query parameters accepted:**
- `accessToken` — JWT from external provider
- `userId` — user ID
- `tenantId` — tenant for this session
- `roleId` — user role
- `ssoProvider` — provider identifier

**Flow:**
1. Validate token with middleware
2. Fetch user details
3. Route to appropriate dashboard by role/tenant
4. If multi-account scenario → show `SwitchAccountDialog`

**Business Rules:**
- Token must pass validation before any data is stored
- Admin app SSO `/sso` supports routing by role — content roles go to workspace, other roles to main admin
- Android app integration uses `refreshTokenForAndroid` in localStorage for native webview bridging

---

### 3.5 Password Management

**Change Password:** `/change-password` (learner), `/edit-password` (teacher/admin)
**Change Username:** `/change-username` (learner)
**Create Password:** `/create-password` (first-time login for teacher/facilitator)

---

## 4. Center & Cohort Management

### 4.1 Centers

**Definition:** A center is the primary physical or virtual learning location. Stored as a `COHORT` type object.

**Fields:**
- Name, type (regular / remote)
- Geographic location: State → District → Block → Village
- Google Maps link
- Image upload
- Assigned facilitators
- Assigned batches (child cohorts)

**CRUD Operations:**
- Search by name, district, block, type, status
- Create with dynamic RJSF form
- Edit existing center
- Archive (soft delete with reason)
- View center detail — batches, learners, facilitators

**Pages:** `/centers` (admin), `/centers/[cohortId]` (admin + SCP teacher)

---

### 4.2 Batches

**Definition:** A batch is a child cohort under a center. Stored as `BATCH` type.

**SCP-specific fields:** Board, Medium, Grade (e.g., "State Board / Marathi / Grade 9")

**CRUD Operations:**
- Create batch under a center
- Assign learners to batch
- Manage batch metadata (board/medium/grade for SCP)

**Cohort Type Hierarchy:**
```
STATE → DISTRICT → BLOCK → COHORT (center) → BATCH
```

---

### 4.3 Geographic Master Data (Admin)

Managed in Admin App:
- **State** (`/state`)
- **District** (`/district`)
- **Block** (`/block`)
- **Village** (`/village`)

Used to assign users and centers to geographic hierarchy. Stored as custom fields on cohort/user objects with `fieldId` references.

---

## 5. User Management

### 5.1 Create User

All user creation uses the **DynamicForm** system with schemas served from API. Fields differ per role and tenant.

**Common fields:** Name, DOB, Gender, Mobile, Email, Geographic location (state/district/block/village)

**Role-specific fields:**
- Learner: Center/Batch assignment, Board/Medium/Grade (SCP)
- Facilitator: Assigned centers, subject expertise
- Team Leader: Assigned blocks/districts

**API:** `POST /user/create` with dynamic payload

---

### 5.2 Edit / Archive User

- All role-specific pages support inline edit
- Archive = soft delete with mandatory reason
- Archived users are excluded from active lists but remain in system
- Restore archived users available

---

### 5.3 Bulk Operations (CSV Import)

- **Import CSV:** Upload learners/facilitators via CSV template
- **Export CSV:** Download user list with all fields
- Import validation with error reporting per row

---

### 5.4 Reassign Learner

`reassignLearnerStore` tracks reassignment state. Learners can be moved between centers/batches.

**Notification triggered:** `LEARNER_REASSIGNMENT_NOTIFICATION` sent on reassignment

---

### 5.5 MapUser Widgets

These RJSF custom widgets handle user-to-cohort assignment inside dynamic forms:

| Widget | Purpose |
|--------|---------|
| `CenterListWidget` | Select center for user assignment |
| `BatchListWidget` | Select batch within a center |
| `MultipleBatchListWidget` | Select multiple batches |
| `LMPMultipleBatchListWidget` | LMP-specific multi-batch |
| `WorkingVillageAssignmentWidget` | Assign working villages (YouthNet) |
| `EditSearchUser` | Search and edit existing user |
| `EmailSearchUser` | Search user by email |

---

## 6. Attendance Management

### 6.1 Feature Overview (SCP Teacher MFE)

| Feature | Description |
|---------|-------------|
| Daily attendance | Mark individual or bulk attendance per session date |
| Session-level attendance | Mark at event/session level (not just batch) |
| Week calendar navigation | Browse sessions by week; click date to mark |
| Attendance overview | % per learner for date range; identify low-attendance learners |
| Attendance history | Historical records per learner |
| Attendance comparison | Compare across time periods |
| Bulk delete | Remove attendance records for a date/context |
| Dashboard visualization | Circular progress bars showing attendance % |

### 6.2 Attendance API Data Model

```typescript
interface AttendanceParams {
  userId: string;
  attendanceDate: string;    // "YYYY-MM-DD"
  attendance: string;        // "Present" | "Absent"
  contextId: string;         // cohortId or eventRepetitionId
}

interface BulkAttendanceParams {
  attendanceDate: string;
  contextId: string;
  userAttendance: { userId: string; attendance: string; }[];
  context?: 'cohort' | 'event';
}
```

### 6.3 Business Rules

- Attendance is context-aware: can be at cohort (batch) level or event (session) level
- Low attendance threshold is configurable (set as admin config)
- Dashboard shows week calendar — red/green indicators per date
- Circular progress bars show % for each active cohort
- `classesMissedAttendancePercentList` API returns per-learner absence ranking

---

## 7. Assessment System

### 7.1 Digital Assessments (SCP)

**Types:** Pre-assessment, Post-assessment (one per course)

**Status values:** `NOT_STARTED` | `IN_PROGRESS` | `COMPLETED`

**Features:**
- View learner list with completion status per assessment
- Drill down to per-learner results
- Subject-level score breakdown

**Page:** `/assessments` → `/assessments/user/[userId]/subject/[subjectId]`

---

### 7.2 Manual / Offline Assessments

Used when digital delivery isn't possible (e.g., paper-based exams).

**Flow:**
1. Facilitator navigates to `/manual-assessments`
2. Selects assessment → sees learner list
3. For each learner → opens assessment detail
4. Options:
   - Enter marks per question (`QuestionMarksManualUpdate`)
   - Capture answer sheet via camera (`Camera.tsx`, `AnswerSheet.tsx`)
   - View captured images (`ImageViewer`)
5. Generate PDF result report (`ManualAssessmentResultPDF`)

---

### 7.3 AI Assessments

AI-generated question sets from existing content.

**Creation Flow (Workspace MFE):**
1. `SelectContent` — choose source content item
2. `SetParameters` — question count, difficulty, language
3. `AIGenerationDialog` — shows AI generation progress
4. `ConfirmationDialog` — review and save to question set

**Grading Flow (SCP Teacher MFE):**
1. Navigate to `/ai-assessments`
2. Select assessment
3. Upload answer sheet files (`/ai-assessments/[id]/[userId]/upload-files`)
4. System processes via AI → results populated

---

### 7.4 Board Enrollment (SCP-specific)

Tracks learner enrollment stages for board exams.

**Features:**
- Configurable enrollment stages (defined via `FormContext`)
- Per-learner stage assignment
- Pie chart showing stage distribution
- `HorizontalLinearStepper` showing learner's stage progression
- Search and sort learner list

**Page:** `/board-enrollment` → `/board-enrollment/student-detail/[userId]`

---

## 8. Content Management System

### 8.1 Content Types

| Type | MIME Type | Player |
|------|-----------|--------|
| PDF Document | `application/pdf` | SunbirdPdfPlayer |
| Video | `video/mp4`, `video/webm` | SunbirdVideoPlayer |
| Audio | `audio/mp3`, `audio/wav` | SunbirdVideoPlayer |
| ePub Book | `application/epub` | SunbirdEpubPlayer |
| YouTube Video | `video/x-youtube` | V1Player |
| Interactive (ECML) | `application/vnd.ekstep.ecml-archive` | V1Player |
| HTML Archive | `application/vnd.ekstep.html-archive` | V1Player |
| Question Set / Quiz | `application/vnd.sunbird.question` | SunbirdQuMLPlayer |
| Course (collection) | — | CollectionEditor |

### 8.2 Content Hierarchy

```
Course (collection)
  └── Unit (chapter/section)
        └── Content Item (leaf — video/pdf/quiz/epub/etc.)
```

### 8.3 Content Workflow

```
Create (Draft)
    ↓
Submit for Review
    ↓
Under Review (CCTA reviewing)
    ↓
Published ← ─ ─ ─ Rejected (returns to Draft with notes)
```

**Status values:** `draft` | `submitted` | `under_review` | `up_for_review` | `published` | `rejected`

### 8.4 Content Organization Models

| Model | Description | Used By |
|-------|-------------|---------|
| Framework-based | Board → Medium → Grade → Subject | SCP |
| Knowledge Bank | Free-browse L1 content, no course context | All |
| Thematic | Browse by topic/theme | Learner App |
| POS (Open School) | School / Life / Work categories | Open learners |
| Course Planner | Monthly plan per subject | Admin/Teacher |

### 8.5 Content Creation (Workspace MFE)

**Entry:** `/workspace/content/create`

**Editor types:**
- **CollectionEditor** — Sunbird collection editor for courses (add units, add resources to units)
- **GenericEditor** — jQuery-based Sunbird editor (`ecEditor`) for resource creation; supports large file uploads
- **QuestionSetEditor** — Sunbird question set editor for creating quizzes/assessments
- **UploadEditor** — File-based content upload (PDF, video, audio)

**File Upload:** S3 multipart upload; signed URL generated via `/api/multipart-upload/*`; stored in `knowlg-public` bucket (`ap-south-1`)

---

## 9. Course Planner

### 9.1 Overview

Monthly curriculum plan that links subjects to specific content resources, organized by state/board/medium/grade/subject.

### 9.2 Admin Flow

1. Navigate to `/course-planner`
2. Select state → board → medium → grade → subject
3. Download CSV template (`/importCsv`)
4. Fill monthly plan: topics per week, linked resources
5. Upload completed CSV → plan saved

### 9.3 Teacher/Facilitator Flow

1. Navigate to `/curriculum-planner` in SCP MFE
2. Select center from dropdown
3. View course plan for assigned grade/subject
4. Navigate `/curriculum-planner/center/[cohortId]` for center-specific view
5. Expand accordion to see weekly topics and resources
6. Navigate to `/topic-detail-view` for detailed lesson view

### 9.4 Data Dependencies

- Requires active academic year (`isActiveYearSelected` in Zustand store)
- Framework taxonomy (Board/Medium/Grade/Subject) must exist in Taxonomy Manager
- Content linked in planner must be published in the system

---

## 10. Progress Tracking & Certificates

### 10.1 Progress Tracking

**Mechanism:** Sunbird telemetry events (IMPRESSION, INTERACT, ASSESS, END) emitted by the player → collected by telemetry service → processed by tracking service.

**API endpoints:**
- `POST /tracking/content/create` — record content start
- `POST /tracking/content/course/status` — update course completion %
- `POST /tracking/content/course/inprogress` — save in-progress state

**Offline tracking:** Service worker queues tracking calls during offline sessions and syncs when back online.

### 10.2 Certificate Issuance

**Trigger:** 100% course completion + assessment pass threshold met

**Pass thresholds:**
- Default tenants: **40%** assessment pass rate
- Tenant `914ca990-...` (specific): **80%** assessment pass rate

**Certificate flow (inside Service Worker):**
1. Course status reaches 100%
2. Check assessment status: `GET /tracking/assessment/search/status`
3. If pass threshold met → `POST /tracking/certificate/issue`
4. Certificate render: `/tracking/certificate/render` or `/tracking/certificate/render-PDF`

**Admin view:** `/certificate-issuance` — view and manage certificate status per learner

**Learner view:** Profile page → certificates tab → `CertificateModal` with preview

---

## 11. Notification System

### 11.1 Notification Templates (Admin)

**Page:** `/notification-templates`

**Features:**
- List all templates with search by keyword
- Filter by context type (USER, COURSE, etc.)
- Create new template: title, context, template body with variables
- Edit existing templates
- Templates support variable placeholders (e.g., `{{userName}}`, `{{courseName}}`)

### 11.2 Triggered Notifications

| Event | Notification Key | Recipients |
|-------|-----------------|------------|
| Learner created | `onLearnerCreated` | Learner (with credentials) |
| Content submitted for review | `onContentReview` | CCTA reviewers |
| Learner reassigned | `LEARNER_REASSIGNMENT_NOTIFICATION` | Affected facilitator |
| Learner profile updated | `LEARNER_PROFILE_UPDATE_ALERT` | Admin |
| Block reassignment | `BLOCK_REASSIGNMENT_NOTIFICATION` | Team Leader |

### 11.3 Push Notifications (FCM)

- Firebase Cloud Messaging integration in teacher app
- `AllowNotification` component requests browser push permission
- Managed via `NEXT_PUBLIC_FCM_*` environment variables

---

## 12. Survey & Observations

### 12.1 Observations

**What it is:** Structured observation forms used to evaluate centers, facilitators, or learners.

**Entity types observable:**
- Center
- Facilitator / Teacher
- Learner

**Role-based visibility:**
- Team Leader: can observe Centers + Facilitators
- Facilitator: can observe Facilitators + Learners
- Learner: can observe themselves (self-assessment)

**Flow:**
1. Navigate to `/observation` (SCP teacher) or `/observations` (learner)
2. Select entity type and specific entity
3. Select observation form (fetched from Shikshalokam/MentorEd API — `targetSolution`)
4. Fill questionnaire (`ObservationQuestions`)
5. Submit observation

**Available in:** SCP Teacher MFE, YouthNet MFE, Learner App, Survey-Observations MFE

---

### 12.2 Surveys (YouthNet)

**Types:**
- Village-level surveys
- Camp surveys
- Village camp surveys

**Features:**
- Survey list per village/camp
- Participant list view
- Pie chart visualization of survey responses
- Survey response tracking per entry

**Pages (YouthNet MFE):** `/surveys` → `/survey/[surveyName]`, `/youthboard/surveys`

---

## 13. YouthNet Module

### 13.1 YouthNet Roles

| Role | Description |
|------|-------------|
| Mentor | Field-level facilitator (equivalent of Teacher in SCP) |
| Mentor Leader / Central Head | Senior mentor managing field mentors |
| Mobilizer | Outreach worker for volunteer/youth registration |

### 13.2 YouthNet Dashboard Features

**Mentor Dashboard (default):**
- Village count
- Today's registrations count
- Youth stats: age-split (18+ vs <18)
- Volunteer stats
- Monthly registration chart (bar/line)
- Survey modal shortcut
- Center/village dropdown selector

**Manager Dashboard:**
- Course completion statistics
- Course allocation pie chart
- Course achievement breakdown
- Top performers list
- Individual employee progress tracking
- `AssignCourseModal` — assign courses to employees

### 13.3 Village Management

- Village list with search
- Village detail: registered youth, volunteers, survey status
- Village camp survey tracking
- Camp details per village

### 13.4 Volunteer Management

- Volunteer list (`/volunteerList`)
- Volunteer profile (`/volunteer-profile/[id]`)
- Registration status tracking (pending/approved/rejected)
- Pie chart of registration status distribution

---

## 14. Taxonomy & Framework Management

### 14.1 Overview

The Taxonomy Manager MFE manages the content classification framework used across all programs.

**Framework structure (example for SCP):**
```
Framework
  └── Category: Board (e.g., "Maharashtra State Board")
        └── Category: Medium (e.g., "Marathi")
              └── Category: Grade (e.g., "Grade 9")
                    └── Category: Subject (e.g., "Mathematics")
                          └── Terms: Algebra, Geometry, etc.
```

### 14.2 Framework Management

**Pages:** `/frameworks` → `/frameworks/create` → `/frameworks/[id]`

**Creation Wizard (4 steps):**
1. `StepChannel` — Select or create a channel (tenant namespace)
2. `StepFramework` — Define framework name and code
3. `StepCategory` — Add categories (Board, Medium, Grade, Subject)
4. `StepAssociation` — Define parent-child associations between terms

**Key Features:**
- Full CRUD on frameworks, categories, terms
- Association management between taxonomy levels
- Batch creation operations (`BatchCreationModal`)
- Pending categories review section

### 14.3 Channels

Channels are tenant namespaces for content. Each program has its own channel.

**Pages:** `/channels` → `/channels/create`

---

## 15. Pratham Open School (POS)

**What it is:** Open-access educational content with no login required, organized in three tracks.

**Entry:** `/pos` in Learner App

**Content Tracks:**
| Track | Route | Description |
|-------|-------|-------------|
| Learning for School | `/pos/school` | School curriculum content |
| Learning for Life | `/pos/life` | Life skills content |
| Learning for Work | `/pos/work` | Vocational/work skills content |

**Features:**
- No authentication required for browsing
- Full content player (`/pos/player/[identifier]`)
- Content search (`/pos/search`)
- Content details (`/pos/content-details/[identifier]`)
- About Us and Terms & Conditions pages
- Program listing (`/pos/program`)

---

## 16. Learner App Specific Features

### 16.1 Home Screen

**Components:**
- Welcome banner with user name
- Program carousel (enrolled programs)
- Navigation to courses, in-progress content, knowledge bank
- Quick access to support and FAQs

### 16.2 Program Enrollment

**Page:** `/programs`

Features:
- Browse all available programs
- View program details
- Enroll with one-click
- Filter by location/type
- View enrollment status

### 16.3 Content Browsing Modes

| Mode | Route | Description |
|------|-------|-------------|
| Enrolled courses | `/home-courses` | Courses for enrolled program |
| In-progress | `/in-progress` | Resume started content |
| Knowledge Bank | `/knowledge-bank` | Free-browse L1 content |
| Thematic | `/themantic/*` | Browse by topic/theme |
| POS | `/pos/*` | Open School content |
| SCP Dashboard | `/scp-dashboard` | SCP-specific content list |
| Navapatham | `/navapatham` | Special program with carousel |

### 16.4 Skill Center

**Page:** `/skill-center`

Browse and access vocational/skill training centers. Linked to geographic data for location-based discovery.

### 16.5 Explore / Nearby Centers

**Page:** `/explore`

Shows learning centers near the learner based on geographic cohort data. Includes skill center discovery.

### 16.6 Accessibility Features

All features toggle-able from the Accessibility component:

| Feature | Implementation |
|---------|---------------|
| Font size scaling | 80%–140% in 10% steps; `--font-size-scale` CSS variable; saved in `localStorage.app_font_size` |
| Color inversion | CSS `filter: invert(1) hue-rotate(180deg)` on document root; media elements counter-apply |
| Underline links | CSS class `.underline-links-enabled` forces `text-decoration: underline` |
| Text-to-speech | `SpeakableText` component; `useSpeech` hook; `SpeechContext` |
| RTL layout | Auto-detected for Urdu; `useDirection` hook; `stylis-plugin-rtl` |

---

## 17. Support & Help

### JotForm Integration

Both Admin and Teacher apps embed JotForm for support ticket submission.

**Pages:** `/support-request` (all portals)

**Environment variables:**
- `NEXT_PUBLIC_JOTFORM_ID` — main support form
- `NEXT_PUBLIC_JOTFORM_URL` — JotForm base URL
- `NEXT_PUBLIC_CONTENT_DOWNLOAD_JOTFORM_ID` — content download form

### FAQ Pages

Static FAQ pages available in Admin (`/faqs`), SCP Teacher (`/faqs`), and Learner (`/faqs`).

---

## 18. Localisation

### Supported Languages

| Code | Language | RTL |
|------|---------|-----|
| `en` | English | No |
| `hi` | Hindi | No |
| `mr` | Marathi | No |
| `gu` | Gujarati | No |
| `or` / `odi` | Odia | No |
| `ur` | Urdu | **Yes** |
| `ml` | Malayalam | No |
| `kan` | Kannada | No |
| `tam` | Tamil | No |
| `tel` | Telugu | No |

**Implementation:**
- Translation files: `public/locales/{lang}/common.json`
- Language selector on login page (dropdown)
- Language persisted in `localStorage.preferredLanguage`
- RTL: `useDirection` hook sets `dir="rtl"` on `<html>` for Urdu

---

## 19. Key User Workflows

### Admin: Set Up a New Center

1. Login as Admin → Admin App
2. Navigate to Centers
3. Click "Add New" → fill dynamic RJSF form:
   - Center name, type, geographic location
   - For SCP: Board, Medium, Grade
4. Save → center created
5. Navigate to center detail → "Add Batch" → create batch(es)
6. Add facilitators to center
7. Add learners to batch

---

### Admin: Add a New Learner

1. Navigate to Learners
2. Click "Add New" → fill dynamic RJSF form
3. Assign to center/batch
4. System auto-generates username, sends credentials via notification (`onLearnerCreated`)

---

### Teacher/Facilitator: Mark Attendance

1. Login → redirected to SCP Teacher MFE `/dashboard`
2. Select cohort from `CohortSelectionSection`
3. View week calendar → click today
4. Click "Mark Attendance" → `MarkBulkAttendance` modal
5. Mark each learner Present/Absent or use bulk action
6. Submit → saved at cohort or session level

---

### Teacher: View and Manage Assessment Results

1. Navigate to `/assessments`
2. Select cohort and type (pre/post)
3. View learner list with statuses (NOT_STARTED / IN_PROGRESS / COMPLETED)
4. Click learner → see detailed results per subject
5. For manual assessments → `/manual-assessments` → select → enter marks
6. For AI assessments → `/ai-assessments` → upload answer sheets

---

### Learner: Register and Start Learning

1. Visit Learner App → `/registration`
2. Enter mobile → OTP verification
3. Fill profile form → create username/password
4. Auto-login → `/programs` → enroll
5. Redirected to `/home-courses`
6. Open course → select unit → select content item
7. Player loads → content plays → progress tracked
8. Complete all content → certificate issued

---

### Content Creator: Publish a Course

1. Login as Content Creator → Workspace MFE
2. `/workspace/content/create` → select "Course"
3. `CollectionEditor` opens → name the course
4. Add units → add content items to each unit
5. Configure metadata (board/medium/grade/subject/language)
6. Submit for review → status: "submitted"
7. Content Reviewer reviews → clicks Publish → status: "published"
8. Course visible to learners

---

### Admin: Manage Course Planner

1. Navigate to `/course-planner`
2. Select state → board → medium → grade
3. View framework → drill to subjects
4. Navigate to `/importCsv` → download template
5. Fill monthly plan (topics, weeks, resource links)
6. Upload CSV → plan saved
7. Facilitators see plan in SCP MFE `/curriculum-planner`

---

## 20. Data Models

### Key TypeScript Interfaces

```typescript
// Cohort (Center / Batch)
interface ICohort {
  cohortId: string;
  name: string;
  type: CohortTypes;  // 'BATCH' | 'COHORT' | 'BLOCK' | 'DISTRICT' | 'STATE'
  parentId?: string;
  status: string;
}

// Attendance
interface AttendanceParams {
  userId: string;
  attendanceDate: string;    // "YYYY-MM-DD"
  attendance: string;        // "Present" | "Absent"
  contextId: string;
}

// Cohort Member List Request
interface CohortMemberList {
  limit?: number;
  page?: number;
  offset?: number;
  filters: {
    cohortId: string;
    role?: string;
    tenantStatus?: string[];
    name?: string;
  };
  includeArchived?: boolean;
}

// User (simplified)
interface user {
  memberStatus: string;
  userId: string;
  name: string;
  attendance?: string;
}

// Session/Event Card
interface SessionsCardProps {
  data: any;
  showCenterName?: boolean;
  isEventDeleted?: () => void;
  isEventUpdated?: () => void;
  StateName?: string;
  board?: string;
  medium?: string;
  grade?: string;
}
```

### Role Enum Values (from `app.constant.ts`)
```typescript
enum RoleId {
  STUDENT = 'Student',
  TEACHER = 'Teacher',
  TEAM_LEADER = 'Team Leader',
  ADMIN = 'State Lead',
  CENTRAL_ADMIN = 'Central Lead',
  CONTENT_CREATOR = 'Content Creator',
  CONTENT_REVIEWER = 'Content Reviewer',
  MOBILIZER = 'Mobilizer',
}
```

### Tenant Names
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

## 21. Business Rules Summary

| Rule | Detail |
|------|--------|
| Certificate threshold (default) | 40% assessment pass rate required |
| Certificate threshold (tenant `914ca990-...`) | 80% assessment pass rate required |
| OTP expiry | 120 seconds |
| OTP digits | 4-digit (teacher/forgot-password), 6-digit (learner registration) |
| Token refresh | Automatic on 401; 3 retry attempts max |
| Attendance context | Can be cohort-level or event/session-level |
| Form schemas | Always fetched from API — never hardcoded per tenant |
| Username | Auto-generated by system; must be unique |
| Archive vs delete | All user/cohort deletions are soft-delete (archive) with reason |
| Content pass-through proxy | All Sunbird content API calls must route through workspace MFE (port 4104) |
| Feature flags | Build-time only (`module.config.js`) — requires rebuild to change |
| Academic year | Course planner is academic-year-aware; must select active year |
| Multi-tenant | Form schemas, role visibility, and certificate thresholds differ per tenant |

---

## 22. Key Files for Feature Development

| Feature | Key Files |
|---------|----------|
| Role/tenant constants | `apps/admin-app-repo/src/utils/app.constant.ts` |
| Admin navigation | `apps/admin-app-repo/src/components/layouts/sidebar/MenuItems.js` |
| Teacher dashboard | `mfes/scp-teacher-repo/src/pages/dashboard.tsx` |
| Attendance marking | `mfes/scp-teacher-repo/src/components/MarkBulkAttendance.tsx` |
| Learner registration | `apps/learner-web-app/src/app/registration/RegisterationFlow.tsx` |
| Content player routing | `mfes/players/src/components/players/Players.tsx` |
| Dynamic form engine | `libs/shared-lib-v2/src/DynamicForm/DynamicForm.tsx` |
| Certificate logic | `apps/learner-web-app/public/sw.js` (inside service worker) |
| API endpoints list | `apps/admin-app-repo/src/utils/APIEndpoints.ts` |
| Workspace create page | `mfes/workspace/src/pages/workspace/content/create/index.tsx` |
| Board enrollment | `mfes/scp-teacher-repo/src/pages/board-enrollment/index.tsx` |
| Notification templates | `apps/admin-app-repo/src/pages/notification-templates/` |
| Taxonomy dashboard | `mfes/taxonomy-manager/src/pages/index.tsx` |
| YouthNet manager dash | `mfes/youthNet/src/pages/manager-dashboard/index.tsx` |
| Observation forms | `mfes/survey-observations/src/components/ObservationComponent.tsx` |
| Program listing | `apps/learner-web-app/src/app/programs/` |
| POS sub-app | `apps/learner-web-app/src/app/pos/` |
