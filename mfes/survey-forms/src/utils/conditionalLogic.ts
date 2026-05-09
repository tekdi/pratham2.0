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
  if (!logic) return true;

  // Handle legacy format: { show_if: string[], depends_on: string }
  const legacyLogic = logic as any;
  if (legacyLogic.depends_on !== undefined) {
    const dependValue = formValues[legacyLogic.depends_on];
    const allowedValues: string[] = legacyLogic.show_if ?? [];
    const currentValues = Array.isArray(dependValue) ? dependValue : [dependValue];
    return allowedValues.some((v) => currentValues.includes(v));
  }

  const { action, conditions } = logic;
  if (!conditions) return true;

  const allMatch = conditions.every((cond) => {
    const currentValue = formValues[cond.fieldName];
    return evaluateCondition(currentValue, cond.operator, cond.value);
  });

  return action === 'show' ? allMatch : !allMatch;
}

export function isFieldVisible(
  field: SurveyField,
  formValues: Record<string, any>
): boolean {
  return evaluateLogic(field.conditionalLogic, formValues);
}

export function isSectionVisible(
  section: SurveySection,
  formValues: Record<string, any>
): boolean {
  if (!section.isVisible) return false;
  return evaluateLogic(section.conditionalLogic, formValues);
}
