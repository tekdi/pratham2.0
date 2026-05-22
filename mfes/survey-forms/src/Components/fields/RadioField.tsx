'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface RadioFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
  disabled?: boolean;
}

const isOtherOption = (label: string) => label.toLowerCase() === 'other';

const RadioField: React.FC<RadioFieldProps> = ({
  field,
  value,
  error,
  onChange,
  disabled,
}) => {
  const options = field.options || [];
  const otherKey = `${field.fieldName}_other`;
  const selectedValue = typeof value === 'object' && value !== null ? value.selected : value;
  const otherText = typeof value === 'object' && value !== null ? (value.otherText ?? '') : '';

  const hasOtherOption = options.some((opt) => isOtherOption(String(opt.label)));
  const otherOptionValue = options.find((opt) => isOtherOption(String(opt.label)))?.value;
  const showOtherInput = hasOtherOption && selectedValue === otherOptionValue;

  const handleChange = (selected: string) => {
    if (hasOtherOption) {
      onChange(field.fieldName, { selected, otherText: selected === String(otherOptionValue) ? otherText : '' });
    } else {
      onChange(field.fieldName, selected);
    }
  };

  const handleOtherText = (text: string) => {
    onChange(field.fieldName, { selected: selectedValue, otherText: text });
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
      <RadioGroup
        name={field.fieldName}
        value={selectedValue ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        row
      >
        {options.map((opt) => (
          <FormControlLabel
            key={String(opt.value)}
            value={opt.value}
            control={<Radio size="small" disabled={disabled} />}
            label={opt.label}
            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
          />
        ))}
      </RadioGroup>
      {showOtherInput && (
        <TextField
          size="small"
          placeholder="Please specify"
          value={otherText}
          onChange={(e) => handleOtherText(e.target.value)}
          disabled={disabled}
          sx={{ mt: 1 }}
          fullWidth
        />
      )}
    </FormControl>
  );
};

export default RadioField;
