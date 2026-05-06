# Frontend Development Prompt — Survey Module (React)

## Overview

Build two React screens for a **Survey Service** backend:
1. **Survey List** — Facilitator sees published surveys assigned to them
2. **Survey Renderer / Fill & Submit** — Facilitator opens a survey and fills it for each learner in their batch

The backend is a NestJS service. All APIs are REST. Authentication is via Keycloak JWT + tenant header.

---

## Authentication & Headers

Every API call requires these headers:

```
Authorization: Bearer <keycloak_jwt_token>
tenantid: <tenant-uuid>
Content-Type: application/json
```

The `tenantid` is a UUID identifying the current tenant (e.g., SCP). The JWT token comes from Keycloak login.

---

## API Base

```
{{BASE_URL}}/api/v1
```

---

## Screen 1: Survey List

### Purpose
Facilitator sees all published surveys targeted to their role. They can pick a survey and start filling it.

### API

**`POST /api/v1/surveys/list`**

Request:
```json
{
  "page": 1,
  "limit": 20,
  "sortBy": "createdAt",
  "sortOrder": "DESC"
}
```

Response:
```json
{
  "id": "SURVEY_LIST",
  "ver": "1.0",
  "ts": "2026-03-31T10:00:00.000Z",
  "params": {
    "resmsgid": "uuid",
    "status": "successful",
    "err": null,
    "errmsg": null,
    "successmessage": "Surveys fetched successfully"
  },
  "responseCode": 200,
  "result": {
    "data": {
      "data": [
        {
          "surveyId": "uuid",
          "tenantId": "uuid",
          "surveyTitle": "Learner Performance & Attendance Survey",
          "surveyDescription": "Facilitators fill this survey...",
          "status": "published",
          "surveyType": "assessment",
          "contextType": "learner",
          "targetRoles": ["facilitator"],
          "settings": {
            "allowMultipleSubmissions": false,
            "showProgressBar": true
          },
          "theme": {},
          "version": 1,
          "createdBy": "uuid",
          "createdAt": "2026-03-31T10:00:00.000Z",
          "updatedAt": "2026-03-31T10:00:00.000Z",
          "publishedAt": "2026-03-31T10:05:00.000Z",
          "closedAt": null
        }
      ],
      "meta": {
        "total": 5,
        "page": 1,
        "limit": 20,
        "totalPages": 1,
        "hasNextPage": false,
        "hasPreviousPage": false
      }
    }
  }
}
```

### UI Requirements
- Card grid or list view showing: title, description, type, context, status badge, published date
- Only `published` surveys are actionable — show a "Fill Survey" button
- `contextType` tells the facilitator what entity they'll fill it for (e.g., `"learner"` means one submission per learner)
- Pagination controls at the bottom

### Important: Role-Based Visibility
The backend already filters surveys by the user's roles (from JWT). The frontend does NOT need to filter — just display what the API returns.

---

## Screen 2: Survey Renderer — Fill & Submit

### Flow
1. Facilitator clicks "Fill Survey" from the list
2. Frontend fetches the full survey structure
3. Frontend renders all sections and fields as a form
4. Facilitator fills the form for a specific learner (contextId)
5. Can save as draft (update) or submit (final)

### APIs Used (in order)

#### 2a. Fetch Survey Structure

**`GET /api/v1/surveys/read/{surveyId}`**

Response — full survey with sections and fields:
```json
{
  "id": "SURVEY_READ",
  "ver": "1.0",
  "ts": "...",
  "params": { "status": "successful", "..." : "..." },
  "responseCode": 200,
  "result": {
    "data": {
      "surveyId": "uuid",
      "surveyTitle": "Learner Performance & Attendance Survey",
      "surveyDescription": "...",
      "status": "published",
      "surveyType": "assessment",
      "contextType": "learner",
      "targetRoles": ["facilitator"],
      "settings": {
        "allowMultipleSubmissions": false,
        "showProgressBar": true
      },
      "theme": {},
      "sections": [
        {
          "sectionId": "uuid",
          "sectionTitle": "Attendance",
          "sectionDescription": "Attendance details for the learner",
          "displayOrder": 1,
          "isVisible": true,
          "conditionalLogic": null,
          "fields": [
            {
              "fieldId": "uuid",
              "fieldName": "attendance_percentage",
              "fieldLabel": "Attendance Percentage",
              "fieldType": "number",
              "isRequired": true,
              "displayOrder": 0,
              "placeholder": null,
              "helpText": "Auto-fetched from attendance service",
              "defaultValue": null,
              "validations": {},
              "dataSource": {
                "type": "api",
                "api": {
                  "url": "http://attendance-service:3001/api/v1/attendance/percentage",
                  "method": "POST",
                  "headers": { "Content-Type": "application/json" },
                  "body": { "learnerId": "{{contextId}}" },
                  "mapping": {
                    "valueField": "percentage",
                    "labelField": "percentage",
                    "dataPath": "result.data"
                  }
                },
                "cache": { "enabled": true, "ttl": 300 }
              },
              "uploadConfig": null,
              "uiConfig": {},
              "conditionalLogic": null,
              "options": null
            },
            {
              "fieldId": "uuid",
              "fieldName": "is_attendance_satisfactory",
              "fieldLabel": "Is attendance satisfactory?",
              "fieldType": "radio",
              "isRequired": true,
              "displayOrder": 1,
              "dataSource": {
                "type": "static",
                "options": [
                  { "value": "yes", "label": "Yes" },
                  { "value": "no", "label": "No" }
                ]
              },
              "options": [
                { "value": "yes", "label": "Yes" },
                { "value": "no", "label": "No" }
              ],
              "conditionalLogic": null
            },
            {
              "fieldId": "uuid",
              "fieldName": "reason_low_attendance",
              "fieldLabel": "Reason for low attendance",
              "fieldType": "textarea",
              "isRequired": true,
              "displayOrder": 2,
              "placeholder": "Describe the reasons...",
              "conditionalLogic": {
                "action": "show",
                "conditions": [
                  {
                    "fieldName": "is_attendance_satisfactory",
                    "operator": "equals",
                    "value": "no"
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
}
```

#### 2b. Create Response (start filling)

**`POST /api/v1/responses/create/{surveyId}`**

Request:
```json
{
  "contextId": "learner-uuid-here",
  "responseData": {},
  "responseMetadata": {
    "deviceType": "desktop",
    "userAgent": "Mozilla/5.0..."
  }
}
```

Response:
```json
{
  "id": "RESPONSE_CREATE",
  "ver": "1.0",
  "ts": "...",
  "params": { "status": "successful" },
  "responseCode": 201,
  "result": {
    "data": {
      "responseId": "uuid",
      "surveyId": "uuid",
      "tenantId": "uuid",
      "respondentId": "uuid",
      "contextType": "learner",
      "contextId": "learner-uuid-here",
      "status": "in_progress",
      "responseData": {},
      "responseMetadata": {
        "startedAt": "2026-03-31T10:10:00.000Z",
        "deviceType": "desktop"
      },
      "fileUploadIds": {},
      "submissionVersion": 1,
      "createdAt": "2026-03-31T10:10:00.000Z",
      "updatedAt": "2026-03-31T10:10:00.000Z",
      "submittedAt": null
    }
  }
}
```

> **Note**: `contextId` is required when `survey.contextType !== "none"` and `!== "self"`. For `learner` context, pass the learner's UUID. The backend prevents duplicate submissions per contextId (if `allowMultipleSubmissions` is false).

#### 2c. Save Draft (auto-save / manual save)

**`PUT /api/v1/responses/update/{responseId}`**

Request:
```json
{
  "responseData": {
    "learner_name": "Rahul Sharma",
    "batch_name": "Batch A - 2026",
    "attendance_percentage": 72,
    "is_attendance_satisfactory": "no",
    "reason_low_attendance": "Health issues"
  }
}
```

> **Important**: `responseData` is a flat key-value map where keys are `fieldName` (not fieldId). Values depend on the field type (see Field Type → Value Mapping below).

#### 2d. Submit Response (final)

**`POST /api/v1/responses/submit/{responseId}`**

Request:
```json
{
  "responseData": {
    "learner_name": "Rahul Sharma",
    "batch_name": "Batch A - 2026",
    "attendance_percentage": 72,
    "is_attendance_satisfactory": "no",
    "reason_low_attendance": "Health issues",
    "steps_to_improve_attendance": "Regular follow-ups",
    "overall_performance_rating": 3,
    "performance_level": "average",
    "key_strengths": ["teamwork", "communication"],
    "areas_of_improvement": ["punctuality"],
    "detailed_remarks": null,
    "recommend_advanced_batch": null
  }
}
```

Response:
```json
{
  "result": {
    "data": {
      "responseId": "uuid",
      "status": "submitted",
      "submittedAt": "2026-03-31T10:15:00.000Z",
      "responseMetadata": {
        "startedAt": "2026-03-31T10:10:00.000Z",
        "completedAt": "2026-03-31T10:15:00.000Z",
        "timeSpentSeconds": 300
      }
    }
  }
}
```

> After submit, the response is immutable. Show a success screen.

---

## Field Type Reference

Every field has a `fieldType`. The frontend must render the correct input component for each type and store the value in the correct format.

### Field Type → Component → Value Format

| fieldType | Render As | Value in responseData |
|-----------|-----------|----------------------|
| `text` | `<input type="text">` | `"string"` |
| `textarea` | `<textarea>` | `"string"` |
| `number` | `<input type="number">` | `number` |
| `email` | `<input type="email">` | `"string"` |
| `phone` | `<input type="tel">` | `"string"` |
| `date` | Date picker | `"YYYY-MM-DD"` |
| `time` | Time picker | `"HH:mm"` |
| `datetime` | DateTime picker | `"ISO 8601 string"` |
| `select` | `<select>` dropdown | `"selected_value"` (single string) |
| `multi_select` | Multi-select dropdown | `["val1", "val2"]` (array) |
| `radio` | Radio button group | `"selected_value"` (single string) |
| `checkbox` | Checkbox group | `["val1", "val2"]` (array) |
| `rating` | Star rating (1-5) | `number` (e.g., `4`) |
| `scale` | Slider / range | `number` |
| `image_upload` | File upload (images) | Handled via file upload API, store fileId |
| `video_upload` | File upload (video) | Handled via file upload API, store fileId |
| `file_upload` | File upload (any) | Handled via file upload API, store fileId |
| `signature` | Signature pad canvas | `"base64_data_url"` |
| `location` | GPS / map picker | `{ "lat": number, "lng": number }` |
| `matrix` | Grid/table of questions | `{ "rowKey": "colValue", ... }` |

### Where Options Come From

For `select`, `multi_select`, `radio`, `checkbox` fields:
- **Static options**: Available in `field.options` array (populated by backend from `field.dataSource.options`)
- **API options**: Backend fetches from the configured API and populates `field.options` at read time
- Always use `field.options` to render — the backend handles resolution

```typescript
// Each option:
interface FieldOption {
  value: string | number;
  label: string;
}
```

### Field Properties to Use

```typescript
interface SurveyField {
  fieldId: string;           // UUID
  fieldName: string;         // key for responseData (e.g., "learner_name")
  fieldLabel: string;        // display label
  fieldType: string;         // see table above
  isRequired: boolean;       // show required indicator, validate before submit
  displayOrder: number;      // sort fields by this
  placeholder: string | null;
  helpText: string | null;   // show below the input
  defaultValue: any | null;  // pre-fill on render
  validations: {
    min?: number;            // min value (for number, rating, scale)
    max?: number;            // max value
    minLength?: number;      // min text length
    maxLength?: number;      // max text length
    pattern?: string;        // regex pattern
  };
  options: FieldOption[] | null;       // for select/radio/checkbox
  uploadConfig: {
    maxSizeMb?: number;
    allowedExtensions?: string[];
    allowedMimeTypes?: string[];
  } | null;
  conditionalLogic: ConditionalLogic | null;
}
```

---

## Conditional Logic (CRITICAL)

Fields and sections can have `conditionalLogic`. The frontend MUST evaluate this client-side to show/hide fields dynamically as the user fills the form.

### Structure

```typescript
interface ConditionalLogic {
  action: "show" | "hide";
  conditions: Condition[];
}

interface Condition {
  fieldName: string;      // the fieldName of the source field to watch
  operator: string;       // comparison operator
  value?: string;         // the value to compare against (absent for is_empty/is_not_empty)
}
```

### Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `equals` | Exact match (string comparison) | `"no"` equals `"no"` |
| `not_equals` | Not equal | |
| `contains` | String contains (case-insensitive) | |
| `greater_than` | Numeric > | rating > 3 |
| `less_than` | Numeric < | |
| `greater_than_or_equal` | Numeric >= | rating >= 4 |
| `less_than_or_equal` | Numeric <= | rating <= 2 |
| `is_empty` | Value is null/empty | no value field needed |
| `is_not_empty` | Value is not null/empty | no value field needed |

### Evaluation Rules

1. **ALL conditions must be true** (AND logic) for the condition set to match
2. If `action === "show"`: field is **hidden by default**, shown when all conditions match
3. If `action === "hide"`: field is **shown by default**, hidden when all conditions match
4. If `conditionalLogic` is `null`: field is always visible
5. **When a field is hidden, exclude its value from responseData** on submit (or send null)
6. Compare values as strings for `equals`/`not_equals`/`contains`, as numbers for `greater_than`/`less_than`/etc.

### Example: This Survey's Conditional Fields

```
"reason_low_attendance" → SHOW when is_attendance_satisfactory EQUALS "no"
"steps_to_improve_attendance" → SHOW when is_attendance_satisfactory EQUALS "no"
"detailed_remarks" → SHOW when overall_performance_rating <= 2
"recommend_advanced_batch" → SHOW when overall_performance_rating >= 4
```

### Implementation Suggestion

```typescript
// Maintain a formValues state: Record<string, any>
// On every field change, re-evaluate all conditional logic

function isFieldVisible(field: SurveyField, formValues: Record<string, any>): boolean {
  if (!field.conditionalLogic) return true;

  const { action, conditions } = field.conditionalLogic;
  const allMatch = conditions.every(cond => {
    const currentValue = formValues[cond.fieldName];
    return evaluateCondition(currentValue, cond.operator, cond.value);
  });

  return action === 'show' ? allMatch : !allMatch;
}

function evaluateCondition(currentValue: any, operator: string, targetValue?: string): boolean {
  switch (operator) {
    case 'equals': return String(currentValue) === String(targetValue);
    case 'not_equals': return String(currentValue) !== String(targetValue);
    case 'contains': return String(currentValue || '').toLowerCase().includes(String(targetValue || '').toLowerCase());
    case 'greater_than': return parseFloat(currentValue) > parseFloat(targetValue);
    case 'less_than': return parseFloat(currentValue) < parseFloat(targetValue);
    case 'greater_than_or_equal': return parseFloat(currentValue) >= parseFloat(targetValue);
    case 'less_than_or_equal': return parseFloat(currentValue) <= parseFloat(targetValue);
    case 'is_empty': return !currentValue || currentValue === '';
    case 'is_not_empty': return currentValue && currentValue !== '';
    default: return true;
  }
}
```

---

## Section Rendering

Sections are containers for fields. Render them in `displayOrder`.

```typescript
interface SurveySection {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string | null;
  displayOrder: number;
  isVisible: boolean;              // if false, skip rendering entirely
  conditionalLogic: ConditionalLogic | null;  // same logic as fields
  fields: SurveyField[];
}
```

- Sort sections by `displayOrder`
- Sort fields within each section by `displayOrder`
- If `section.isVisible === false`, don't render it
- If `section.conditionalLogic` exists, evaluate it the same way as field conditional logic
- Render section title and description as a card/group header

---

## Validation Rules

Before submitting, validate:

1. **Required fields**: All visible fields with `isRequired: true` must have a non-empty value
2. **Hidden fields**: Skip validation for conditionally hidden fields
3. **Field-level validations** (from `field.validations`):
   - `min` / `max`: for number, rating, scale
   - `minLength` / `maxLength`: for text, textarea
   - `pattern`: regex for text fields
4. Show inline error messages per field
5. Scroll to the first error on submit attempt

---

## Context: What is `contextId`?

This survey has `contextType: "learner"`. This means the facilitator must fill one survey per learner.

**Before rendering the form**, the frontend needs to know which learner the facilitator is filling it for. This could be:
- A learner picker/dropdown screen before the form
- A route param like `/survey/:surveyId/fill/:learnerId`
- A list of learners in the facilitator's batch from another service

The `contextId` (learner UUID) is passed when creating the response. The backend enforces one submission per `(surveyId, respondentId, contextId)` combination.

---

## Suggested Component Architecture (React)

```
src/
  components/
    survey/
      SurveyList.tsx              — Screen 1: list of surveys
      SurveyRenderer.tsx          — Screen 2: main form container
      SurveySection.tsx           — Renders one section (title + fields)
      fields/
        TextField.tsx             — text, email, phone
        TextareaField.tsx         — textarea
        NumberField.tsx           — number
        DateField.tsx             — date, time, datetime
        SelectField.tsx           — select, multi_select
        RadioField.tsx            — radio
        CheckboxField.tsx         — checkbox
        RatingField.tsx           — rating (stars)
        ScaleField.tsx            — scale (slider)
        FileUploadField.tsx       — image_upload, video_upload, file_upload
        SignatureField.tsx        — signature
        LocationField.tsx         — location
        MatrixField.tsx           — matrix
        FieldRenderer.tsx         — Switch component that picks the right field
      hooks/
        useSurveyForm.ts          — Form state, conditional logic evaluation
        useSurveyApi.ts           — API calls (list, read, create response, save, submit)
      utils/
        conditionalLogic.ts       — isFieldVisible(), evaluateCondition()
        validation.ts             — validateField(), validateForm()
    types/
      survey.ts                   — TypeScript interfaces
```

---

## TypeScript Interfaces

```typescript
// ---- API Response Wrapper ----
interface ApiResponse<T> {
  id: string;
  ver: string;
  ts: string;
  params: {
    resmsgid: string;
    status: 'successful' | 'failed';
    err: string | null;
    errmsg: string | null;
    successmessage?: string;
  };
  responseCode: number;
  result: T;
}

// ---- Survey ----
interface Survey {
  surveyId: string;
  tenantId: string;
  surveyTitle: string;
  surveyDescription: string | null;
  status: 'draft' | 'published' | 'closed' | 'archived';
  surveyType: string | null;
  contextType: 'learner' | 'center' | 'teacher' | 'self' | 'none';
  targetRoles: string[] | null;
  settings: SurveySettings;
  theme: Record<string, any>;
  version: number;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  closedAt: string | null;
  sections: SurveySection[];
}

interface SurveySettings {
  allowMultipleSubmissions?: boolean;
  showProgressBar?: boolean;
  [key: string]: any;
}

interface SurveySection {
  sectionId: string;
  sectionTitle: string;
  sectionDescription: string | null;
  displayOrder: number;
  isVisible: boolean;
  conditionalLogic: ConditionalLogic | null;
  fields: SurveyField[];
}

interface SurveyField {
  fieldId: string;
  fieldName: string;
  fieldLabel: string;
  fieldType: FieldType;
  isRequired: boolean;
  displayOrder: number;
  placeholder: string | null;
  helpText: string | null;
  defaultValue: any | null;
  validations: FieldValidations;
  dataSource: DataSource | null;
  uploadConfig: UploadConfig | null;
  uiConfig: Record<string, any>;
  conditionalLogic: ConditionalLogic | null;
  options: FieldOption[] | null;
}

type FieldType =
  | 'text' | 'textarea' | 'number' | 'email' | 'phone'
  | 'date' | 'time' | 'datetime'
  | 'select' | 'multi_select' | 'radio' | 'checkbox'
  | 'rating' | 'scale'
  | 'image_upload' | 'video_upload' | 'file_upload'
  | 'signature' | 'location' | 'matrix';

interface FieldOption {
  value: string | number;
  label: string;
}

interface FieldValidations {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

interface UploadConfig {
  maxSizeMb?: number;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

interface DataSource {
  type: 'static' | 'api' | 'internal_api';
  options?: FieldOption[];
  api?: {
    url: string;
    method?: 'GET' | 'POST';
    headers?: Record<string, string>;
    body?: any;
    mapping?: {
      valueField: string;
      labelField: string;
      dataPath?: string;
    };
  };
  cache?: { enabled: boolean; ttl: number };
  fallback?: FieldOption[];
}

// ---- Conditional Logic ----
interface ConditionalLogic {
  action: 'show' | 'hide';
  conditions: Condition[];
}

interface Condition {
  fieldName: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than'
    | 'greater_than_or_equal' | 'less_than_or_equal' | 'is_empty' | 'is_not_empty';
  value?: string;
}

// ---- Response ----
interface SurveyResponse {
  responseId: string;
  tenantId: string;
  surveyId: string;
  respondentId: string | null;
  contextType: string | null;
  contextId: string | null;
  status: 'in_progress' | 'submitted' | 'reviewed';
  responseData: Record<string, any>;
  responseMetadata: ResponseMetadata;
  fileUploadIds: Record<string, string[]>;
  submissionVersion: number;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
}

interface ResponseMetadata {
  userAgent?: string;
  ipAddress?: string;
  startedAt?: string;
  completedAt?: string;
  timeSpentSeconds?: number;
  deviceType?: string;
}

// ---- Pagination ----
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

---

## Error Handling

All errors follow this shape:

```json
{
  "id": "SURVEY_READ",
  "ver": "1.0",
  "ts": "...",
  "params": {
    "resmsgid": "uuid",
    "status": "failed",
    "err": "BAD_REQUEST",
    "errmsg": "Survey must have at least one section"
  },
  "responseCode": 400,
  "result": {}
}
```

Common error codes:
- `400` — Validation error, bad request
- `401` — Unauthorized (token expired/invalid)
- `403` — Forbidden (wrong tenant, wrong role)
- `404` — Survey/Response not found
- `409` — Conflict (duplicate submission for same contextId)

Handle `409` specifically — show message: "You have already submitted a response for this learner."

---

## Summary of APIs for Frontend

| # | Method | Endpoint | Purpose |
|---|--------|----------|---------|
| 1 | POST | `/api/v1/surveys/list` | List published surveys |
| 2 | GET | `/api/v1/surveys/read/{surveyId}` | Get full survey with sections & fields |
| 3 | POST | `/api/v1/responses/create/{surveyId}` | Start a new response |
| 4 | PUT | `/api/v1/responses/update/{responseId}` | Save draft |
| 5 | POST | `/api/v1/responses/submit/{responseId}` | Final submit |

That's it — 5 API calls for the complete facilitator flow.
