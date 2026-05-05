'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface RadioFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const RadioField: React.FC<RadioFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const options = field.options || [];

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
      <RadioGroup
        name={field.fieldName}
        value={value ?? ''}
        onChange={(e) => onChange(field.fieldName, e.target.value)}
        row
      >
        {options.map((opt) => (
          <FormControlLabel
            key={String(opt.value)}
            value={opt.value}
            control={<Radio size="small" />}
            label={opt.label}
            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
          />
        ))}
      </RadioGroup>
      {(error || field.helpText) && (
        <FormHelperText id={`${field.fieldName}-error`}>
          {error || field.helpText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default RadioField;
