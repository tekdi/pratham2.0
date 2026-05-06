import { SurveyField, SurveySection } from '../types/survey';
import { isFieldVisible, isSectionVisible } from './conditionalLogic';

export interface ValidationError {
  fieldName: string;
  message: string;
}

export function validateField(
  field: SurveyField,
  value: any
): string | null {
  if (field.isRequired) {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return `${field.fieldLabel} is required`;
    }
  }

  if (value === null || value === undefined || value === '') {
    return null;
  }

  const { validations } = field;

  if (validations.minLength !== undefined && String(value).length < validations.minLength) {
    return `${field.fieldLabel} must be at least ${validations.minLength} characters`;
  }

  if (validations.maxLength !== undefined && String(value).length > validations.maxLength) {
    return `${field.fieldLabel} must be at most ${validations.maxLength} characters`;
  }

  if (validations.min !== undefined && Number(value) < validations.min) {
    return `${field.fieldLabel} must be at least ${validations.min}`;
  }

  if (validations.max !== undefined && Number(value) > validations.max) {
    return `${field.fieldLabel} must be at most ${validations.max}`;
  }

  if (validations.pattern) {
    const regex = new RegExp(validations.pattern);
    if (!regex.test(String(value))) {
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
