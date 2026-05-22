import { SurveyField, SurveySection } from '../types/survey';
import { isFieldVisible, isSectionVisible } from './conditionalLogic';

export interface ValidationError {
  fieldName: string;
  message: string;
}

function unwrapOtherValue(value: any): any {
  if (value !== null && typeof value === 'object' && !Array.isArray(value) && 'selected' in value) {
    return value.selected;
  }
  return value;
}

export function validateField(
  field: SurveyField,
  value: any
): string | null {
  const raw = unwrapOtherValue(value);

  if (field.isRequired) {
    if (
      raw === null ||
      raw === undefined ||
      raw === '' ||
      (Array.isArray(raw) && raw.length === 0)
    ) {
      return 'This field is required';
    }
  }

  if (raw === null || raw === undefined || raw === '') {
    return null;
  }

  const { validations } = field;

  if (validations.minLength !== undefined && String(raw).length < validations.minLength) {
    return `${field.fieldLabel} must be at least ${validations.minLength} characters`;
  }

  if (validations.maxLength !== undefined && String(raw).length > validations.maxLength) {
    return `${field.fieldLabel} must be at most ${validations.maxLength} characters`;
  }

  if (validations.min !== undefined && Number(raw) < validations.min) {
    return `${field.fieldLabel} must be at least ${validations.min}`;
  }

  if (validations.max !== undefined && Number(raw) > validations.max) {
    return `${field.fieldLabel} must be at most ${validations.max}`;
  }

  if (validations.pattern) {
    const regex = new RegExp(validations.pattern);
    if (!regex.test(String(raw))) {
      return `${field.fieldLabel} format is invalid`;
    }
  }

  return null;
}

export function validateForm(
  sections: SurveySection[],
  formValues: Record<string, any>
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const section of sections) {
    if (!isSectionVisible(section, formValues)) continue;

    for (const field of section.fields) {
      if (!isFieldVisible(field, formValues)) continue;

      const error = validateField(field, formValues[field.fieldName]);
      if (error) {
        errors.push({ fieldName: field.fieldName, message: error });
      }
    }
  }

  return errors;
}
