// @ts-nocheck
import React from 'react';
import { TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';

// Fields for which spaces should be stripped entirely
const NO_SPACE_FIELDS = ['firstName', 'lastName', 'middleName', 'username'];

const CustomTextFieldWidget = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  onBlur,
  onFocus,
  rawErrors = [],
  placeholder,
  options = {},
  uiSchema = {},
}: WidgetProps) => {
  // Derive the field name from the RJSF id (e.g. "root_firstName" -> "firstName")
  const fieldName = id ? id.replace(/^root[_.]/, '') : '';
  const isNoSpaceField = NO_SPACE_FIELDS.includes(fieldName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    if (isNoSpaceField) {
      val = val.replace(/\s/g, ''); // Remove all whitespace characters
    }
    onChange(val === '' ? undefined : val);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    let val = event.target.value;
    if (isNoSpaceField) {
      val = val.replace(/\s/g, '');
    }
    onBlur(id, val);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, event.target.value);

  // Reflect stripped value in the displayed input for no-space fields
  const displayValue = isNoSpaceField
    ? (value ?? '').replace(/\s/g, '')
    : (value ?? '');

  // Filter out 'is a required property' messages
  const displayErrors = rawErrors.filter(
    (error) => !error.toLowerCase().includes('required')
  );

  // Get helper text from options (RJSF merges ui:options into options prop)
  // Also check uiSchema directly as fallback
  const helperTextFromOptions =
    options?.helperText ||
    options?.note ||
    uiSchema?.['ui:options']?.helperText ||
    uiSchema?.['ui:options']?.note ||
    '';

  // Combine error and helper text - show error if exists, otherwise show helper text
  const helperText =
    displayErrors.length > 0 ? displayErrors[0] : helperTextFromOptions;

  return (
    <TextField
      fullWidth
      id={id}
      label={label}
      value={displayValue}
      required={required}
      disabled={disabled || readonly}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder}
      error={displayErrors.length > 0}
      helperText={helperText}
      variant="outlined"
      //   margin="normal"
    />
  );
};

export default CustomTextFieldWidget;
