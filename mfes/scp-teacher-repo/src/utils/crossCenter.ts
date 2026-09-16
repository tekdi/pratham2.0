import { toPascalCase } from './helper';

const toUpperString = (value: unknown) =>
  typeof value === 'string' ? value.toUpperCase() : '';

const asString = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'value' in (value as any)) {
    const v = (value as any).value;
    return typeof v === 'string' ? v : null;
  }
  return null;
};

/**
 * Reads a custom field's first value by label, case-insensitively, and
 * falling back to a plain `value` string when `selectedValues` is absent —
 * some cohort APIs use one shape, some the other (see `centers/index.tsx`'s
 * own `getCustomFieldValues`, which this mirrors). `getBMG` in `helper.ts`
 * only handles the `selectedValues` shape with an exact-case label match,
 * which silently returns `undefined` for cohorts using the other shape —
 * this is used instead wherever Board/Medium/Grade must be compared reliably
 * across arbitrary batches.
 */
export const getCustomFieldSingleValue = (
  customField: any[] | undefined,
  label: string
): string | null => {
  const target = label.toUpperCase();
  const entry = (customField || []).find(
    (item) => toUpperString(item?.label) === target
  );
  const selectedValues = Array.isArray(entry?.selectedValues)
    ? entry.selectedValues
    : [];
  if (selectedValues.length > 0) {
    return asString(selectedValues[0]) ?? null;
  }
  return entry?.value ? asString(entry.value) : null;
};

export interface BatchBMG {
  board: string | null;
  medium: string | null;
  grade: string | null;
}

export const getBatchBMG = (customField: any[] | undefined): BatchBMG => ({
  board: getCustomFieldSingleValue(customField, 'BOARD'),
  medium: getCustomFieldSingleValue(customField, 'MEDIUM'),
  grade: getCustomFieldSingleValue(customField, 'GRADE'),
});

export interface BatchInfo {
  batchId: string;
  batchName: string;
  centerId: string;
  centerName: string;
  bmg: BatchBMG;
}

// The facilitator's own cohort tree comes back center -> batch (or, for team
// leaders, block -> center -> batch). A leaf node (no childData) is always a
// batch; its immediate parent is the center it belongs to. Every batch node
// in this tree already carries its own `customField` (Board/Medium/Grade),
// so it's read here once — no per-batch API call is needed later to compare
// batches against each other.
export const flattenBatches = (
  nodes: any[],
  parent?: { id: string; name: string }
): BatchInfo[] => {
  let result: BatchInfo[] = [];
  for (const node of nodes || []) {
    const children = Array.isArray(node?.childData) ? node.childData : [];
    if (children.length > 0) {
      result = result.concat(
        flattenBatches(children, {
          id: node?.cohortId,
          name: node?.cohortName || node?.name,
        })
      );
    } else if (parent?.id && node?.cohortId) {
      result.push({
        batchId: node.cohortId,
        batchName: toPascalCase(node?.cohortName || node?.name || ''),
        centerId: parent.id,
        centerName: toPascalCase(parent.name || ''),
        bmg: getBatchBMG(node?.customField),
      });
    }
  }
  return result;
};
