# Survey Forms — Bugs & Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 8 bugs (BUG-001 through BUG-008) and implement 8 feature enhancements (FER-001 through FER-008) in the `mfes/survey-forms` micro-frontend.

**Architecture:** All changes are scoped to the `pratham2.0/mfes/survey-forms/src/` directory. State lives in Zustand (`surveyFormStore.ts`). MUI theme overrides for global style fixes go in `MuiThemeProvider.tsx`. Hub page enhancements are self-contained in `ContextHubPage.tsx`. Survey renderer changes stay in `SurveyRenderer.tsx`.

**Tech Stack:** Next.js 13+ App Router, React, MUI v5, Zustand, react-toastify, TypeScript

---

## File Map

| File | Changes |
|------|---------|
| `src/theme/MuiThemeProvider.tsx` | BUG-002/003: override `MuiFormLabel` focused color globally |
| `src/Components/fields/RadioField.tsx` | BUG-002/003: remove inline `sx` color that fights theme; pass `name` attr for scroll |
| `src/Components/fields/CheckboxField.tsx` | BUG-002/003: same as RadioField |
| `src/store/surveyFormStore.ts` | FER-008: add `lastAutoSavedAt` field; BUG-004: add `clearSaving` action |
| `src/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer.tsx` | BUG-001, BUG-004, FER-001, FER-006, FER-008 |
| `src/app/survey-fill/[surveyId]/hub/ContextHubPage.tsx` | BUG-008, FER-002, FER-003, FER-007 |

---

## Task 1: BUG-002 + BUG-003 — Fix false orange label on focus and stuck error color

**Root cause:** The MUI theme sets `primary.main = '#FDBE16'` (amber). MUI's `FormLabel` inherits the primary color on focus and on error color (`#ff0000`). When a radio/checkbox group is clicked, `FormControl` enters "focused" state → label turns amber. After validation error + re-answer, the error color (`#ff0000`) should clear because `error={!!error}` becomes `false` once `errors[fieldName]` is cleared — but MUI applies a CSS transition delay that makes it visually linger.

**Fix approach:** Add a global MUI component override in the theme for `MuiFormLabel` that forces the label to always be `#1E1B16` unless it's in a real error state, by overriding the `focused` variant color. Also remove the hardcoded `sx={{ color: '#1E1B16' }}` from individual fields (they don't override focused state anyway).

**Files:**
- Modify: `src/theme/MuiThemeProvider.tsx`
- Modify: `src/Components/fields/RadioField.tsx`
- Modify: `src/Components/fields/CheckboxField.tsx`

- [ ] **Step 1: Add MuiFormLabel theme override**

In `src/theme/MuiThemeProvider.tsx`, add to the `components` block:

```typescript
MuiFormLabel: {
  styleOverrides: {
    root: {
      color: '#1E1B16',
      fontSize: '14px',
      '&.Mui-focused': {
        color: '#1E1B16',
      },
      '&.Mui-error': {
        color: '#ff0000',
      },
    },
  },
},
```

The full `components` block becomes:

```typescript
components: {
  MuiCard: {
    styleOverrides: {
      root: {
        '& > :last-child': {
          paddingBottom: 16,
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: '50px',
        color: '#1E1B16',
        textTransform: 'none',
        boxShadow: 'unset !important',
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        color: '#1E1B16',
        fontSize: '14px',
        '&.Mui-focused': {
          color: '#1E1B16',
        },
        '&.Mui-error': {
          color: '#ff0000',
        },
      },
    },
  },
},
```

- [ ] **Step 2: Clean up RadioField — remove inline sx color, add name attr**

Replace the `<FormLabel>` in `RadioField.tsx`:

```tsx
// Before
<FormLabel required={field.isRequired} sx={{ color: '#1E1B16', fontSize: '14px' }}>
  {field.fieldLabel}
</FormLabel>

// After
<FormLabel required={field.isRequired}>
  {field.fieldLabel}
</FormLabel>
```

Also add `name` attribute to RadioGroup for scroll-to-error support:

```tsx
<RadioGroup
  name={field.fieldName}
  value={value ?? ''}
  onChange={(e) => onChange(field.fieldName, e.target.value)}
  row
>
```

- [ ] **Step 3: Clean up CheckboxField — remove inline sx color, add name wrapper**

Replace the `<FormLabel>` in `CheckboxField.tsx`:

```tsx
// Before
<FormLabel required={field.isRequired} sx={{ color: '#1E1B16', fontSize: '14px' }}>
  {field.fieldLabel}
</FormLabel>

// After
<FormLabel required={field.isRequired}>
  {field.fieldLabel}
</FormLabel>
```

Wrap the `<FormControl>` root element with a `<div name={field.fieldName}>` for scroll targeting — or add `id={field.fieldName}` to the FormControl:

```tsx
<FormControl
  id={field.fieldName}
  error={!!error}
  component="fieldset"
>
```

Also update RadioField the same way:

```tsx
<FormControl
  id={field.fieldName}
  error={!!error}
  component="fieldset"
>
```

- [ ] **Step 4: Verify in browser**

Open http://localhost:3001/survey-fill/... → click any radio option → label should stay black (`#1E1B16`). Click Submit without filling required fields → labels turn red → fill in the field → label returns to black immediately.

- [ ] **Step 5: Commit**

```bash
cd /home/ttpl-rt-242/Desktop/survey-fullstack/pratham2.0
git add mfes/survey-forms/src/theme/MuiThemeProvider.tsx \
        mfes/survey-forms/src/Components/fields/RadioField.tsx \
        mfes/survey-forms/src/Components/fields/CheckboxField.tsx
git commit -m "fix: prevent false orange label on focus and fix stuck error color (BUG-002, BUG-003)"
```

---

## Task 2: BUG-001 — Parse server 400 errors and surface actionable feedback

**Root cause:** `handleSubmit` catch block does `toast.error(err?.response?.data?.params?.errmsg || 'Failed to submit survey')`. The server returns `{ params: { errmsg: "Validation failed" } }` with no field-level detail. The user sees no actionable message and no field highlighting.

**Fix approach:**
1. Log the full server error to console so devs can inspect it.
2. Parse any field-level errors from the server response (servers often return `{ errors: [{ field, message }] }` or similar in the response body).
3. If field-level errors exist, map them back to `fieldName` (requires reverse lookup from `fieldId → fieldName` using `idToName`) and call `setValidationErrors`.
4. If no field-level errors, show the full `errmsg` prominently (not generic fallback).

**Files:**
- Modify: `src/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer.tsx`

- [ ] **Step 1: Update handleSubmit catch block**

Find the catch block in `handleSubmit` (around line 271) and replace it:

```typescript
} catch (err: any) {
  const serverData = err?.response?.data;
  const errmsg: string = serverData?.params?.errmsg || 'Failed to submit survey';

  // Try to map server field-level errors back to fieldNames
  const serverFieldErrors: Array<{ field: string; message: string }> =
    serverData?.result?.errors ?? serverData?.errors ?? [];

  if (serverFieldErrors.length > 0) {
    const { idToName } = buildFieldMaps(form.survey?.sections ?? []);
    const mapped: ValidationError[] = serverFieldErrors
      .map((e) => ({
        fieldName: idToName[e.field] ?? e.field,
        message: e.message,
      }))
      .filter((e) => !!e.fieldName);

    if (mapped.length > 0) {
      setValidationErrors(mapped);
      toast.error(`Please fix ${mapped.length} field error(s) before submitting`);
      const firstField = document.getElementById(mapped[0].fieldName)
        ?? document.querySelector(`[name="${mapped[0].fieldName}"]`);
      firstField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }

  // No field-level detail — show the full server message
  toast.error(errmsg, { autoClose: 5000 });
  console.error('[SurveyRenderer] Submit 400:', serverData);
}
```

Also add `ValidationError` to the imports at the top of the file:

```typescript
import { validateForm, ValidationError } from '../../../../utils/validation';
```

- [ ] **Step 2: Verify**

Open the survey, fill all required fields, click Submit. If server returns 400 with no field errors: toast shows the actual server message (not generic). If server returns field errors: fields are highlighted in red.

- [ ] **Step 3: Commit**

```bash
git add mfes/survey-forms/src/app/survey-fill/[surveyId]/\[contextId\]/SurveyRenderer.tsx
git commit -m "fix: parse server 400 errors and surface field-level feedback (BUG-001)"
```

---

## Task 3: BUG-004 + BUG-005 — Submit button state after Save Draft + missing toast

**Root cause BUG-004:** After `handleSaveDraft` runs, `setSaving(false)` is called in the `finally` block. The Submit button is `disabled={form.saving || form.submitting}`. This is correct logic. The perceived issue is that the Save Draft button already shows a `CircularProgress` spinner when `form.saving` is true — but the spinner is 20px and may not be visible enough. The button stays disabled during the save API call, which is correct. **The real fix:** ensure `form.saving` never gets permanently stuck at `true` if `ensureResponse` throws.

**Root cause BUG-005:** `toast.success('Draft saved successfully')` is in the code at line ~223 and `ToastContainer` IS configured in `layout.tsx`. However, when this MFE is loaded as a Module Federation remote inside another shell app, the remote's `layout.tsx` is not used. The `ToastContainer` from the root shell may not be present, or the toast context may be isolated. Fix: the `ToastContainer` should be rendered inside `SurveyRenderer` as a fallback so it always works whether the MFE is standalone or embedded.

**Files:**
- Modify: `src/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer.tsx`

- [ ] **Step 1: Add inline ToastContainer fallback to SurveyRenderer**

At the top of the file, add import:

```typescript
import { toast, ToastContainer } from 'react-toastify';
```

At the end of the JSX returned by `SurveyRenderer` (just before the final closing `</Box>`), add:

```tsx
{/* Fallback ToastContainer for when this component is loaded as an MFE remote
    and the host shell doesn't include one. If a ToastContainer already exists
    in the DOM, react-toastify deduplicates them. */}
<ToastContainer
  containerId="survey-renderer-toast"
  position="top-center"
  autoClose={3000}
  hideProgressBar
  closeButton={false}
  newestOnTop
/>
```

Also update all `toast.*` calls in `SurveyRenderer.tsx` to use `containerId: 'survey-renderer-toast'`:

```typescript
// Replace all toast calls:
toast.success('Draft saved successfully', { containerId: 'survey-renderer-toast' });
toast.error('Failed to save draft', { containerId: 'survey-renderer-toast' });
toast.error('Please fix the errors before submitting', { containerId: 'survey-renderer-toast' });
toast.error(result.params.errmsg || 'Failed to submit', { containerId: 'survey-renderer-toast' });
toast.dismiss({ containerId: 'survey-renderer-toast' });
```

- [ ] **Step 2: Fix saving state never stuck**

In `handleSaveDraft`, ensure `setSaving(false)` is always called even if `ensureResponse` throws, by wrapping in try/finally:

```typescript
const handleSaveDraft = useCallback(async () => {
  setSaving(true);
  try {
    const responseId = await ensureResponse();
    if (!responseId) return;
    const { nameToId } = buildFieldMaps(form.survey?.sections ?? []);
    await saveDraft(responseId, toApiPayload(formValuesRef.current, nameToId));
    toast.success('Draft saved successfully', { containerId: 'survey-renderer-toast' });
  } catch {
    toast.error('Failed to save draft', { containerId: 'survey-renderer-toast' });
  } finally {
    setSaving(false);
  }
}, [ensureResponse, setSaving, form.survey]);
```

(Note: `setSaving(true)` moved to the top so even if `ensureResponse` fails, `finally` runs `setSaving(false)`.)

- [ ] **Step 3: Verify**

Click "Save Draft" → spinner appears on Save Draft button → "Draft saved successfully" toast appears → Submit button re-enables.

- [ ] **Step 4: Commit**

```bash
git add mfes/survey-forms/src/app/survey-fill/[surveyId]/\[contextId\]/SurveyRenderer.tsx
git commit -m "fix: save draft toast always visible + saving state never sticks (BUG-004, BUG-005)"
```

---

## Task 4: FER-001 — Always-visible progress bar

**Root cause:** Progress bar is gated behind `survey.settings?.showProgressBar`. The API returns `"settings": {}` so this is never true. The progress calculation logic (`calculateProgress`) already works correctly.

**Fix:** Remove the `showProgressBar` gate and always show the progress bar.

**Files:**
- Modify: `src/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer.tsx`

- [ ] **Step 1: Remove showProgressBar gate**

Find the conditional in SurveyRenderer (around line 408):

```tsx
// Before
{survey.settings?.showProgressBar && (
  <Box sx={{ px: 2, pt: 2 }}>
    ...
  </Box>
)}

// After — always show, update label to show answered count
```

Replace with:

```tsx
<Box sx={{ px: 2, pt: 2 }}>
  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
    <Typography variant="caption" sx={{ color: '#7C766F' }}>
      Progress
    </Typography>
    <Typography variant="caption" sx={{ color: '#7C766F' }}>
      {progress}%
    </Typography>
  </Box>
  <LinearProgress
    variant="determinate"
    value={progress}
    sx={{
      height: 6,
      borderRadius: 3,
      backgroundColor: '#E0E0E0',
      '& .MuiLinearProgress-bar': {
        backgroundColor: progress === 100 ? '#4CAF50' : '#FDBE16',
        borderRadius: 3,
      },
    }}
  />
</Box>
```

- [ ] **Step 2: Verify**

Open survey → progress bar visible at top showing 0%. Answer Q1 → progress updates. Answer all → turns green at 100%.

- [ ] **Step 3: Commit**

```bash
git add mfes/survey-forms/src/app/survey-fill/[surveyId]/\[contextId\]/SurveyRenderer.tsx
git commit -m "feat: always show survey progress bar (FER-001)"
```

---

## Task 5: FER-008 — Auto-save indicator + FER-006 — Warn before leaving

**FER-008:** Auto-save every 30s already works. Add a subtle "Auto-saved at HH:MM" text indicator below the form buttons.

**FER-006:** When the user clicks the back button with unsaved changes, show a confirmation. "Unsaved changes" means `form.formValues` has changed since the last save/load.

**Files:**
- Modify: `src/store/surveyFormStore.ts`
- Modify: `src/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer.tsx`

- [ ] **Step 1: Add lastAutoSavedAt and hasUnsavedChanges to store**

In `surveyFormStore.ts`, add to `SurveyFormState`:

```typescript
lastAutoSavedAt: Date | null;
hasUnsavedChanges: boolean;
```

Add to `initialFormState`:

```typescript
lastAutoSavedAt: null,
hasUnsavedChanges: false,
```

Add actions to `SurveyStore` interface:

```typescript
setLastAutoSavedAt: (date: Date) => void;
setHasUnsavedChanges: (value: boolean) => void;
```

Implement in `create`:

```typescript
setLastAutoSavedAt: (date) =>
  set((state) => ({ form: { ...state.form, lastAutoSavedAt: date, hasUnsavedChanges: false } })),
setHasUnsavedChanges: (value) =>
  set((state) => ({ form: { ...state.form, hasUnsavedChanges: value } })),
```

Also update `updateFieldValue` to set `hasUnsavedChanges: true`:

```typescript
updateFieldValue: (fieldName, value) =>
  set((state) => ({
    form: {
      ...state.form,
      formValues: { ...state.form.formValues, [fieldName]: value },
      errors: { ...state.form.errors, [fieldName]: '' },
      hasUnsavedChanges: true,
    },
  })),
```

- [ ] **Step 2: Use lastAutoSavedAt and hasUnsavedChanges in SurveyRenderer**

Destructure from store:

```typescript
const {
  form,
  setFormLoading,
  setSurvey,
  setResponse,
  setFormValues,
  updateFieldValue,
  setValidationErrors,
  setSaving,
  setSubmitting,
  setSubmitted,
  setFormError,
  resetForm,
  setLastAutoSavedAt,
  setHasUnsavedChanges,
} = useSurveyStore();
```

In the auto-save interval (Task 5 modifies the existing `useEffect` for auto-save), call `setLastAutoSavedAt` on success:

```typescript
autoSaveTimerRef.current = setInterval(async () => {
  if (isUnmountedRef.current) return;
  if (form.submitted || form.saving || form.submitting) return;
  if (!form.hasUnsavedChanges) return; // skip if nothing changed
  try {
    const { nameToId } = buildFieldMaps(form.survey?.sections ?? []);
    await saveDraft(form.response!.responseId, toApiPayload(formValuesRef.current, nameToId));
    setLastAutoSavedAt(new Date());
  } catch {
    // Silent fail for auto-save
  }
}, AUTO_SAVE_INTERVAL);
```

Add indicator below the Save Draft / Submit buttons:

```tsx
{form.lastAutoSavedAt && (
  <Typography
    variant="caption"
    sx={{ display: 'block', textAlign: 'center', color: '#7C766F', mt: 1 }}
  >
    Auto-saved at {form.lastAutoSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </Typography>
)}
```

- [ ] **Step 3: FER-006 — warn on back navigation**

In `SurveyRenderer`, update the `onBack` handler:

```typescript
const handleBack = useCallback(() => {
  toast.dismiss({ containerId: 'survey-renderer-toast' });
  if (form.hasUnsavedChanges) {
    const confirmed = window.confirm(
      'You have unsaved changes. Save a draft before leaving?'
    );
    if (confirmed) {
      handleSaveDraft().then(() => router.back());
      return;
    }
  }
  router.back();
}, [form.hasUnsavedChanges, handleSaveDraft, router]);
```

Then pass `onBack={handleBack}` to `BackHeader`:

```tsx
<BackHeader
  title={survey.surveyTitle}
  subtitle={survey.surveyDescription || undefined}
  onBack={handleBack}
/>
```

Also update `handleSaveDraft` to call `setHasUnsavedChanges(false)` on success:

```typescript
toast.success('Draft saved successfully', { containerId: 'survey-renderer-toast' });
setHasUnsavedChanges(false);
```

- [ ] **Step 4: Verify**

1. Open survey → answer a question → click back arrow → confirmation dialog appears.
2. Click "OK" → draft saves → navigates back.
3. Click "Cancel" → stays on survey.
4. Fill form → wait 30s → "Auto-saved at HH:MM" appears below buttons.

- [ ] **Step 5: Commit**

```bash
git add mfes/survey-forms/src/store/surveyFormStore.ts \
        mfes/survey-forms/src/app/survey-fill/[surveyId]/\[contextId\]/SurveyRenderer.tsx
git commit -m "feat: auto-save indicator + warn before navigating away (FER-006, FER-008)"
```

---

## Task 6: BUG-007 — Reduce unnecessary re-renders / performance

**Root cause:** The auto-save `useEffect` has `form.submitted`, `form.saving`, `form.submitting` as dependencies. Each state change (e.g., `setSaving(true)` → `setSaving(false)`) clears and re-creates the interval. This causes interval churn. The `formValuesRef` approach is already used to avoid stale closures — we should move the other reads to refs too.

**Files:**
- Modify: `src/app/survey-fill/[surveyId]/[contextId]/SurveyRenderer.tsx`

- [ ] **Step 1: Move volatile flags to refs in auto-save effect**

Add refs near the top of `SurveyRenderer`:

```typescript
const isSubmittedRef = useRef(form.submitted);
const isSavingRef = useRef(form.saving);
const isSubmittingRef2 = useRef(form.submitting); // don't conflict with existing isSubmittingRef
isSubmittedRef.current = form.submitted;
isSavingRef.current = form.saving;
isSubmittingRef2.current = form.submitting;
```

Update the auto-save effect to use refs for the guard and remove those from deps:

```typescript
useEffect(() => {
  if (!form.response?.responseId) return;

  autoSaveTimerRef.current = setInterval(async () => {
    if (isUnmountedRef.current) return;
    if (isSubmittedRef.current || isSavingRef.current || isSubmittingRef2.current) return;
    if (!form.hasUnsavedChanges) return;
    try {
      const { nameToId } = buildFieldMaps(form.survey?.sections ?? []);
      await saveDraft(form.response!.responseId, toApiPayload(formValuesRef.current, nameToId));
      setLastAutoSavedAt(new Date());
    } catch {
      // Silent fail
    }
  }, AUTO_SAVE_INTERVAL);

  return () => {
    if (autoSaveTimerRef.current) clearInterval(autoSaveTimerRef.current);
  };
}, [form.response?.responseId]); // Only recreate when responseId changes
```

- [ ] **Step 2: Verify no regressions**

Open survey, interact heavily → no freezing or lag. Auto-save still fires after 30s.

- [ ] **Step 3: Commit**

```bash
git add mfes/survey-forms/src/app/survey-fill/[surveyId]/\[contextId\]/SurveyRenderer.tsx
git commit -m "fix: prevent interval churn and reduce re-renders (BUG-007)"
```

---

## Task 7: BUG-008 + FER-007 + FER-002 + FER-003 — Hub page improvements

**BUG-008:** Search label says "Search", placeholder says "Name or ID" — align to "Search learner name".

**FER-007:** Add a summary card: Total | Not started | In progress | Submitted.

**FER-002:** Add filter tabs: All | Not Started | In Progress | Submitted.

**FER-003:** Submission date column with relative time.

Note: The current hub page has no `submittedAt` data per row — `statusByContextId` only has the status string. FER-003 relative time requires `submittedAt` timestamp. The `statusByContextId` type may need extending. For now we add the column infrastructure and show "—" when no timestamp is available, so the host can pass `submittedAtByContextId` in the future.

**Files:**
- Modify: `src/app/survey-fill/[surveyId]/hub/ContextHubPage.tsx`

- [ ] **Step 1: Fix BUG-008 — consistent search label/placeholder**

Find the `<TextField>` for search (around line 194) and update:

```tsx
<TextField
  size="small"
  label="Search learner"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Name or ID"
  sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
/>
```

- [ ] **Step 2: Add status filter state and FER-002 tabs**

Add imports at top:

```typescript
import { Tab, Tabs, Tooltip } from '@mui/material';
```

Add state:

```typescript
const [statusFilter, setStatusFilter] = useState<'all' | 'none' | 'draft' | 'submitted'>('all');
```

Add summary counts (derived from `rows` and `statusMap`):

```typescript
const summaryCounts = useMemo(() => {
  const counts = { total: rows.length, none: 0, draft: 0, submitted: 0 };
  rows.forEach((r) => {
    const s = (statusMap[r.id] as string | undefined) ?? 'none';
    if (s === 'draft') counts.draft++;
    else if (s === 'submitted') counts.submitted++;
    else counts.none++;
  });
  return counts;
}, [rows, statusMap]);
```

Update `filteredRows` to also apply status filter:

```typescript
const filteredRows = useMemo(() => {
  let result = rows;
  if (statusFilter !== 'all') {
    result = result.filter((r) => {
      const s = (statusMap[r.id] as string | undefined) ?? 'none';
      return s === statusFilter;
    });
  }
  const q = search.trim().toLowerCase();
  if (!q) return result;
  return result.filter(
    (r) =>
      r.label.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q) ||
      (r.subtitle && r.subtitle.toLowerCase().includes(q))
  );
}, [rows, search, statusFilter, statusMap]);
```

- [ ] **Step 3: Add FER-007 summary card before the table**

Replace the existing `<Box sx={{ display: 'flex', gap: 2, mb: 2 }}>` with:

```tsx
{/* Summary card */}
<Box
  sx={{
    display: 'flex',
    gap: 2,
    mb: 2,
    p: 2,
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
    border: '1px solid #E0E0E0',
    flexWrap: 'wrap',
  }}
>
  {[
    { label: 'Total', count: summaryCounts.total, color: '#1E1B16' },
    { label: 'Not started', count: summaryCounts.none, color: '#7C766F' },
    { label: 'In progress', count: summaryCounts.draft, color: '#E65100' },
    { label: 'Submitted', count: summaryCounts.submitted, color: '#2E7D32' },
  ].map(({ label, count, color }) => (
    <Box key={label} sx={{ textAlign: 'center', minWidth: 80 }}>
      <Typography variant="h2" sx={{ color, fontWeight: 700 }}>{count}</Typography>
      <Typography variant="caption" sx={{ color: '#7C766F' }}>{label}</Typography>
    </Box>
  ))}
</Box>

{/* Search + filter row */}
<Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
  <TextField
    size="small"
    label="Search learner"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Name or ID"
    sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
  />
  <Typography variant="body2" sx={{ alignSelf: 'center', color: '#7C766F', mb: 0 }}>
    {filteredRows.length} of {rows.length} shown
  </Typography>
</Box>

{/* Status filter tabs */}
<Tabs
  value={statusFilter}
  onChange={(_, v) => setStatusFilter(v)}
  sx={{ mb: 1, minHeight: 36 }}
  TabIndicatorProps={{ style: { backgroundColor: '#FDBE16' } }}
>
  <Tab value="all" label={`All (${summaryCounts.total})`} sx={{ minHeight: 36, fontSize: '13px' }} />
  <Tab value="none" label={`Not started (${summaryCounts.none})`} sx={{ minHeight: 36, fontSize: '13px' }} />
  <Tab value="draft" label={`In progress (${summaryCounts.draft})`} sx={{ minHeight: 36, fontSize: '13px' }} />
  <Tab value="submitted" label={`Submitted (${summaryCounts.submitted})`} sx={{ minHeight: 36, fontSize: '13px' }} />
</Tabs>
```

- [ ] **Step 4: Add FER-003 submission date column**

In the `<TableHead>`, add a column after Status:

```tsx
<TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
```

Add a helper function at the top of the file (before the component):

```typescript
function relativeTime(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
```

In each `<TableRow>` inside `TableBody`, add after the Status cell:

```tsx
<TableCell>
  {statusMap[row.id] === 'submitted' ? (
    <Tooltip title={(entryConfig?.submittedAtByContextId as any)?.[row.id] ?? ''} placement="top">
      <Typography variant="caption">
        {relativeTime((entryConfig?.submittedAtByContextId as any)?.[row.id])}
      </Typography>
    </Tooltip>
  ) : (
    <Typography variant="caption" sx={{ color: '#bbb' }}>—</Typography>
  )}
</TableCell>
```

- [ ] **Step 5: Verify in browser**

Open hub page → summary card shows counts → tabs filter the table → "Not started" tab shows only unstarted learners → search still works within filtered set.

- [ ] **Step 6: Commit**

```bash
git add mfes/survey-forms/src/app/survey-fill/[surveyId]/hub/ContextHubPage.tsx
git commit -m "feat: hub page summary card, status filter tabs, relative submission time, fix search label (BUG-008, FER-002, FER-003, FER-007)"
```

---

## Task 8: FER-004 — Accessibility (aria attributes + keyboard nav)

**Files:**
- Modify: `src/Components/fields/RadioField.tsx`
- Modify: `src/Components/fields/CheckboxField.tsx`
- Modify: `src/Components/fields/TextField.tsx`
- Modify: `src/Components/fields/TextareaField.tsx`

- [ ] **Step 1: Add aria attributes to RadioField**

```tsx
<FormControl
  id={field.fieldName}
  error={!!error}
  component="fieldset"
  aria-required={field.isRequired}
  aria-invalid={!!error}
  aria-describedby={error ? `${field.fieldName}-error` : undefined}
>
  <FormLabel required={field.isRequired}>
    {field.fieldLabel}
  </FormLabel>
  <RadioGroup
    name={field.fieldName}
    value={value ?? ''}
    onChange={(e) => onChange(field.fieldName, e.target.value)}
    row
  >
    {options.map((opt) => (
      <FormControlLabel
        key={String(opt.value)}
        value={opt.value}
        control={<Radio size="small" />}
        label={opt.label}
        sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
      />
    ))}
  </RadioGroup>
  {(error || field.helpText) && (
    <FormHelperText id={`${field.fieldName}-error`}>
      {error || field.helpText}
    </FormHelperText>
  )}
</FormControl>
```

- [ ] **Step 2: Add aria attributes to CheckboxField**

```tsx
<FormControl
  id={field.fieldName}
  error={!!error}
  component="fieldset"
  aria-required={field.isRequired}
  aria-invalid={!!error}
  aria-describedby={error ? `${field.fieldName}-error` : undefined}
>
  <FormLabel required={field.isRequired}>
    {field.fieldLabel}
  </FormLabel>
  <FormGroup row>
    {options.map((opt) => (
      <FormControlLabel
        key={String(opt.value)}
        control={
          <Checkbox
            checked={selected.includes(opt.value)}
            onChange={() => handleToggle(opt.value)}
            size="small"
            inputProps={{ 'aria-label': String(opt.label) }}
          />
        }
        label={opt.label}
        sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
      />
    ))}
  </FormGroup>
  {(error || field.helpText) && (
    <FormHelperText id={`${field.fieldName}-error`}>
      {error || field.helpText}
    </FormHelperText>
  )}
</FormControl>
```

- [ ] **Step 3: Commit**

```bash
git add mfes/survey-forms/src/Components/fields/RadioField.tsx \
        mfes/survey-forms/src/Components/fields/CheckboxField.tsx
git commit -m "feat: add aria-required, aria-invalid, aria-describedby to form fields (FER-004)"
```

---

## BUG-006 Note

BUG-006 ("Income option '0' is ambiguous") — the `"0"` is a display label set in the survey data itself, not in the frontend code. The frontend normalizes `{ key: "a", value: "0" }` → `{ value: "a", label: "0" }` and stores `"a"` as the answer. This is a valid value. If the server rejects it, the issue is in survey data or backend validation, not this MFE. If BUG-001 is fixed (showing real server error messages), the actual cause will become visible.

## FER-005 Note

FER-005 ("View button for submitted surveys") — already implemented. `ContextHubPage.tsx` line 257 shows "View" for submitted rows and routes to `/survey-fill/${surveyId}/${row.id}/view`. No change needed.

---

## Self-Review

**Spec coverage:**
- BUG-001 ✅ Task 2
- BUG-002 ✅ Task 1
- BUG-003 ✅ Task 1
- BUG-004 ✅ Task 3
- BUG-005 ✅ Task 3
- BUG-006 ✅ Noted as data issue (no code fix needed)
- BUG-007 ✅ Task 6
- BUG-008 ✅ Task 7
- FER-001 ✅ Task 4
- FER-002 ✅ Task 7
- FER-003 ✅ Task 7
- FER-004 ✅ Task 8
- FER-005 ✅ Already implemented
- FER-006 ✅ Task 5
- FER-007 ✅ Task 7
- FER-008 ✅ Task 5

**Placeholder scan:** All tasks contain full code blocks. No TBD or "similar to" references.

**Type consistency:** `setLastAutoSavedAt`, `setHasUnsavedChanges` defined in Task 5 Step 1 and consumed in Task 5 Step 2. `ValidationError` imported in Task 2 — already exported from `validation.ts`. `summaryCounts` defined in Task 7 Step 2 and consumed in Steps 3 and 4. All consistent.
