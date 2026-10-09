import { fetchForm } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { filterSchema } from '../../utils/helper';
import { RETENTION_FORM_CONTEXT, RetentionMilestoneKey } from './retention.config';

export interface RetentionFormBundle {
  schema: any;
  uiSchema: any;
}

// Same fetchForm()+filterSchema() convention as PlacementFormService — two
// identical form/read calls (one without a tenantId header, one with), then
// filterSchema() strips any state/district/block/village fields that
// shouldn't appear on this form.
export const getRetentionForm = async (): Promise<RetentionFormBundle | null> => {
  const fetchUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${RETENTION_FORM_CONTEXT.context}&contextType=${RETENTION_FORM_CONTEXT.contextType}`;
  const responseForm: any = await fetchForm([
    { fetchUrl, header: {} },
    { fetchUrl, header: { tenantid: localStorage.getItem('tenantId') } },
  ]);
  if (!responseForm?.schema || !responseForm?.uiSchema) return null;

  const { newSchema } = filterSchema(responseForm);
  const schema = newSchema?.schema;
  const uiSchema = {
    ...newSchema?.uiSchema,
    'ui:submitButtonOptions': { norender: true },
  };

  // The backend form config sends callingDate as a plain CustomTextFieldWidget
  // text box. Swap in the project's real date-picker widget instead — same
  // fieldId/required/validation on the schema side stay untouched, only how
  // the value is entered changes. Same fix PlacementFormService already
  // applies to dateOfJoining; CustomDateWidget already reads/writes this
  // field's `string` schema type as a plain 'YYYY-MM-DD' string, so no
  // schema change is needed for it to work.
  if (uiSchema.callingDate) {
    uiSchema.callingDate = {
      ...uiSchema.callingDate,
      'ui:widget': 'CustomDateWidget',
    };
  }

  return { schema, uiSchema };
};

// A fresh (not-yet-completed) Retention Form opens with every field blank —
// nothing pre-selected — rather than the key being absent from formData
// altogether. That distinction matters for any field driving
// extra.skipAndHide (e.g. currentlyEmployed, which hides both
// monthlySalary and reasonForLeavingJob until answered): DynamicForm's own
// getSkipKeys only ever resolves a skipAndHide branch when `formData[key]`
// is *truthy* (see DynamicForm.tsx — unmodified; this is worked around at
// this layer instead, see applySkipAndHide below for the initial-render
// gap that leaves open regardless), so a genuinely missing key can never
// trigger the "" branch even though it's a valid skipAndHide entry. An
// empty array (not [''], see below) is truthy and stringifies to '' for
// that lookup, so it resolves correctly once the user's first interaction
// re-evaluates it.
//
// Deliberately [] and not [''] — AutoCompleteMultiSelectWidget disables
// every remaining option once `selectedValues.length >= maxSelection`
// (see its own getOptionDisabled). For a maxSelection:1 field like
// currentlyEmployed, a single placeholder element (even an empty string)
// already "fills" that one slot, so both Yes/No would render disabled
// before the Coordinator ever gets to pick one. A truly empty array keeps
// the count at 0 while still resolving the same '' skipAndHide branch.
export const getInitialRetentionFormData = (schema: any): Record<string, any> => {
  const initial: Record<string, any> = {};
  Object.entries(schema?.properties || {}).forEach(([key, property]: [string, any]) => {
    initial[key] = property?.type === 'array' ? [] : '';
  });
  return initial;
};

// --- skipAndHide resolution -------------------------------------------
//
// Generic, schema-driven re-implementation of DynamicForm's own
// getSkipKeys/hideFieldsInUISchema (see DynamicForm.tsx — left unmodified),
// applied once up front when building the uiSchema we hand to DynamicForm,
// rather than relying on its internal effect timing. DynamicForm's own
// version only recomputes hidden fields on user interaction (handleChange)
// or, for a prefilled form, inside an effect that (for this form's shape —
// domain has an 'initial' API field but nothing 'dependent' on it) never
// actually runs — see getInitialRetentionFormData's comment. Either way,
// the very first render is left showing every field, including ones that
// should start hidden. Precomputing the hidden set ourselves from the
// schema's own extra.skipAndHide (not hardcoded to any particular field —
// works for currentlyEmployed or any other controlling field a form
// defines) closes that gap; DynamicForm's own live handleChange logic
// takes over correctly for every interaction after that.
export const applySkipAndHide = (
  schema: any,
  uiSchema: any,
  formData: Record<string, any>
): any => {
  const updated = { ...uiSchema };
  Object.entries(schema?.properties || {}).forEach(([key, property]: [string, any]) => {
    const skipAndHide = property?.extra?.skipAndHide;
    if (!skipAndHide) return;

    // Same value normalization DynamicForm's own getSkipKeys relies on
    // implicitly (an array used as an object key coerces via
    // Array.prototype.toString, which is equivalent to .join(',')) — [] and
    // [''] both resolve to '', matching skipAndHide's own "" entry for "no
    // value selected", instead of silently finding no match.
    const rawValue = formData?.[key];
    const lookupValue = Array.isArray(rawValue) ? rawValue.join(',') : rawValue ?? '';
    const fieldsToHide: string[] = skipAndHide[lookupValue] || [];

    fieldsToHide.forEach((hiddenKey) => {
      if (updated[hiddenKey]) {
        updated[hiddenKey] = { ...updated[hiddenKey], 'ui:widget': 'hidden' };
      }
    });
  });
  return updated;
};

// A read-only view of a Retention Form (used for a Completed Follow-Up):
// every field gets `ui:disabled: true` added to its own uiSchema entry —
// same per-field disable convention DynamicForm's username field already
// uses (see DynamicForm.tsx's `ui:disabled` checks) — rather than adding a
// new prop to the shared DynamicForm component.
export const getReadOnlyUiSchema = (schema: any, uiSchema: any): any => {
  const disabled: any = { ...uiSchema };
  Object.keys(schema?.properties || {}).forEach((key) => {
    disabled[key] = { ...disabled[key], 'ui:disabled': true };
  });
  return disabled;
};

// --- Call Interval auto-select/lock ----------------------------------------
//
// The Retention Form's own callInterval field lets the Coordinator record
// which month this follow-up is for — but since that's already determined
// by which milestone box they clicked, it must be preset to the matching
// value and locked, not left for them to (mis)select.
const CALL_INTERVAL_FIELD_KEY = 'callInterval';

const RETENTION_MILESTONE_CALL_INTERVAL_VALUES: Record<RetentionMilestoneKey, string> = {
  '1m': '1-month',
  '2m': '2-months',
  '3m': '3-months',
  '6m': '6-months',
  '9m': '9-months',
  '12m': '12-months',
};

export const getCallIntervalValue = (milestoneKey: RetentionMilestoneKey): string[] => [
  RETENTION_MILESTONE_CALL_INTERVAL_VALUES[milestoneKey],
];

// Locks callInterval (ui:disabled) without touching any other field's
// editability — used for a fresh (not-yet-completed) submission, where
// every other field must stay editable. A Completed Follow-Up already
// disables every field via getReadOnlyUiSchema, callInterval included.
export const withCallIntervalLocked = (uiSchema: any): any => ({
  ...uiSchema,
  [CALL_INTERVAL_FIELD_KEY]: { ...uiSchema?.[CALL_INTERVAL_FIELD_KEY], 'ui:disabled': true },
});

// Initial formData for a brand-new (not-yet-completed) Follow-Up: every
// field blank (see getInitialRetentionFormData) except callInterval, preset
// to the milestone being filled (see the Call Interval section above).
export const getFreshRetentionFormData = (
  schema: any,
  milestoneKey: RetentionMilestoneKey
): Record<string, any> => ({
  ...getInitialRetentionFormData(schema),
  callInterval: getCallIntervalValue(milestoneKey),
});
