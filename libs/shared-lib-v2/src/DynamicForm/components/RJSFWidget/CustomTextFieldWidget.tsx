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

  // Get note/helper text from options (RJSF merges ui:options into options prop)
  // Also check uiSchema directly as fallback
  const note = options?.note || options?.helperText || uiSchema?.['ui:options']?.note || uiSchema?.['ui:options']?.helperText || '';
  
  // Debug: log to see if note is being received
  if (id && id.includes('lastName')) {
    console.log('CustomTextFieldWidget - lastName:', {
      id,
      note,
      options,
      uiSchema,
      'options.note': options?.note,
      'uiSchema[ui:options]': uiSchema?.['ui:options']
    });
  }

  // Combine error and note in helperText
  // Show error if exists, otherwise show note
  // If both exist, prioritize error but could show both
  const helperText = displayErrors.length > 0 
    ? displayErrors[0] 
    : (note || '');

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
