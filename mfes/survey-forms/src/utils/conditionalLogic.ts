import {
  SurveyField,
  SurveySection,
  ConditionalLogic,
} from '../types/survey';

function evaluateCondition(
  currentValue: any,
  operator: string,
  targetValue?: string
): boolean {
  switch (operator) {
    case 'equals':
      return String(currentValue) === String(targetValue);
    case 'not_equals':
      return String(currentValue) !== String(targetValue);
    case 'contains':
      return String(currentValue || '')
        .toLowerCase()
        .includes(String(targetValue || '').toLowerCase());
    case 'greater_than':
      return parseFloat(currentValue) > parseFloat(targetValue || '0');
    case 'less_than':
      return parseFloat(currentValue) < parseFloat(targetValue || '0');
    case 'greater_than_or_equal':
      return parseFloat(currentValue) >= parseFloat(targetValue || '0');
    case 'less_than_or_equal':
      return parseFloat(currentValue) <= parseFloat(targetValue || '0');
    case 'is_empty':
      return (
        currentValue === null ||
        currentValue === undefined ||
        currentValue === ''
      );
    case 'is_not_empty':
      return (
        currentValue !== null &&
        currentValue !== undefined &&
        currentValue !== ''
      );
    default:
      return true;
  }
}

function evaluateLogic(
  logic: ConditionalLogic | null,
  formValues: Record<string, any>
): boolean {
  if (!logic || !logic.conditions) return true;

  const { action, conditions } = logic;

  const allMatch = conditions.every((cond) => {
    const currentValue = formValues[cond.fieldName];
    return evaluateCondition(currentValue, cond.operator, cond.value);
  });

  return action === 'hide' ? !allMatch : allMatch;
}

/**
 * Handles the legacy { show_if, depends_on } format.
 *
 * Examples:
 *   { "depends_on": "Q1", "show_if": ["val1", "val2"] }
 *   { "depends_on": "Q1", "show_if": "val1" }
 *
 * Returns:
 *   - true  → field should be shown
 *   - false → field should be hidden
 *   - null  → not a legacy format, skip this check
 */
function evaluateShowIf(
  logic: any,
  formValues: Record<string, any>
): boolean | null {
  if (!logic || !logic.depends_on) return null;

  const dependsOn: string = logic.depends_on;
  const showIf: string[] = Array.isArray(logic.show_if)
    ? logic.show_if
    : logic.show_if
      ? [logic.show_if]
      : [];

  // Extract plain value from radio responses stored as { selected: 'value' }
  let currentValue = formValues[dependsOn];
  if (
    currentValue !== null &&
    typeof currentValue === 'object' &&
    !Array.isArray(currentValue) &&
    'selected' in currentValue
  ) {
    currentValue = currentValue.selected;
  }

  return showIf.length === 0 ? true : showIf.includes(String(currentValue));
}

export function isFieldVisible(
  field: SurveyField,
  formValues: Record<string, any>
): boolean {
  // Handle legacy { show_if, depends_on } format first
  const legacyResult = evaluateShowIf(field.conditionalLogic, formValues);
  if (legacyResult !== null) return legacyResult;

  // Fall through to the existing canonical-format evaluator
  return evaluateLogic(field.conditionalLogic, formValues);
}

export function isSectionVisible(
  section: SurveySection,
  formValues: Record<string, any>
): boolean {
  if (!section.isVisible) return false;

  // Handle legacy { show_if, depends_on } format first
  const legacyResult = evaluateShowIf(section.conditionalLogic, formValues);
  if (legacyResult !== null) return legacyResult;

  // Fall through to the existing canonical-format evaluator
  return evaluateLogic(section.conditionalLogic, formValues);
}
