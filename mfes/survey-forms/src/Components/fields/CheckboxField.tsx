'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface CheckboxFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
  disabled?: boolean;
}

const isOtherOption = (label: string) => label.toLowerCase() === 'other';

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  error,
  onChange,
  disabled,
}) => {
  const options = field.options || [];
  const selected: (string | number)[] = Array.isArray(value?.selected) ? value.selected : Array.isArray(value) ? value : [];
  const otherText: string = value?.otherText ?? '';

  const hasOtherOption = options.some((opt) => isOtherOption(String(opt.label)));
  const otherOptionValue = options.find((opt) => isOtherOption(String(opt.label)))?.value;
  const showOtherInput = hasOtherOption && otherOptionValue !== undefined && selected.includes(otherOptionValue);

  const handleToggle = (optValue: string | number) => {
    const newSelected = selected.includes(optValue)
      ? selected.filter((v) => v !== optValue)
      : [...selected, optValue];

    if (hasOtherOption) {
      const stillHasOther = newSelected.includes(otherOptionValue as string | number);
      onChange(field.fieldName, { selected: newSelected, otherText: stillHasOther ? otherText : '' });
    } else {
      onChange(field.fieldName, newSelected);
    }
  };

  const handleOtherText = (text: string) => {
    onChange(field.fieldName, { selected, otherText: text });
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
                disabled={disabled}
                size="small"
                inputProps={{ 'aria-label': String(opt.label) }}
              />
            }
            label={opt.label}
            sx={{ '& .MuiTypography-root': { fontSize: '14px' } }}
          />
        ))}
      </FormGroup>
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

export default CheckboxField;
