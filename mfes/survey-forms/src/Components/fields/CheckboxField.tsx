'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface CheckboxFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const options = field.options || [];
  const selected: (string | number)[] = Array.isArray(value) ? value : [];

  const handleToggle = (optValue: string | number) => {
    const newSelected = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];
    onChange(field.fieldName, newSelected);
  };

  return (
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
  );
};

export default CheckboxField;
