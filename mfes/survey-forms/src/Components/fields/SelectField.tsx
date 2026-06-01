'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  OutlinedInput,
  TextField,
  FormHelperText,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface SelectFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
  disabled?: boolean;
}

const isOtherOption = (label: string) => label.toLowerCase() === 'other';

const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  error,
  onChange,
  disabled,
}) => {
  const isMulti = field.fieldType === 'multi_select';
  const options = field.options || [];

  const hasOtherOption = options.some((opt) => isOtherOption(String(opt.label)));
  const otherOptionValue = options.find((opt) => isOtherOption(String(opt.label)))?.value;

  const selectedValue = value?.selected ?? value ?? (isMulti ? [] : '');
  const otherText: string = value?.otherText ?? '';

  const showOtherInput = hasOtherOption && otherOptionValue !== undefined && (
    isMulti
      ? Array.isArray(selectedValue) && selectedValue.includes(otherOptionValue)
      : selectedValue === otherOptionValue
  );

  const handleChange = (newVal: any) => {
    if (hasOtherOption) {
      const stillHasOther = isMulti
        ? Array.isArray(newVal) && newVal.includes(otherOptionValue)
        : newVal === otherOptionValue;
      onChange(field.fieldName, { selected: newVal, otherText: stillHasOther ? otherText : '' });
    } else {
      onChange(field.fieldName, newVal);
    }
  };

  const handleOtherText = (text: string) => {
    onChange(field.fieldName, { selected: selectedValue, otherText: text });
  };

  return (
    <FormControl error={!!error} component="fieldset" sx={{ alignSelf: 'flex-start', minWidth: 120 }}>
      <FormLabel required={field.isRequired} sx={{ mb: 0.5, fontSize: '14px' }}>
        {field.fieldLabel}
      </FormLabel>
      <Select
        multiple={isMulti}
        value={selectedValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        size="small"
        input={<OutlinedInput />}
        displayEmpty
        fullWidth
        sx={{ borderRadius: '8px' }}
        renderValue={(sel) => {
          if (isMulti && Array.isArray(sel)) {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {sel.map((val) => {
                  const opt = options.find((o) => o.value === val);
                  return (
                    <Chip
                      key={String(val)}
                      label={opt?.label || val}
                      size="small"
                    />
                  );
                })}
              </Box>
            );
          }
          const opt = options.find((o) => o.value === sel);
          return opt?.label || String(sel);
        }}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
      {showOtherInput && (
        <TextField
          multiline
          minRows={3}
          placeholder="Please specify"
          value={otherText}
          onChange={(e) => handleOtherText(e.target.value)}
          disabled={disabled}
          error={!!error && !otherText.trim()}
          helperText={!!error && !otherText.trim() ? 'Please specify the other option' : undefined}
          sx={{ mt: 1 }}
        />
      )}
    </FormControl>
  );
};

export default SelectField;
