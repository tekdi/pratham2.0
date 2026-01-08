// @ts-nocheck
import React from 'react';
import { TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    onChange(val === '' ? undefined : val);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, event.target.value);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, event.target.value);

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
      value={value ?? ''}
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
