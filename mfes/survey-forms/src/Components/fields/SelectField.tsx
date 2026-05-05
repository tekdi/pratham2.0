'use client';

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Box,
  OutlinedInput,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface SelectFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const isMulti = field.fieldType === 'multi_select';
  const options = field.options || [];

  return (
    <FormControl fullWidth error={!!error} size="small">
      <InputLabel required={field.isRequired}>{field.fieldLabel}</InputLabel>
      <Select
        multiple={isMulti}
        value={value ?? (isMulti ? [] : '')}
        onChange={(e) => onChange(field.fieldName, e.target.value)}
        input={<OutlinedInput label={field.fieldLabel} />}
        sx={{ borderRadius: '8px' }}
        renderValue={(selected) => {
          if (isMulti && Array.isArray(selected)) {
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((val) => {
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
          const opt = options.find((o) => o.value === selected);
          return opt?.label || String(selected);
        }}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {(error || field.helpText) && (
        <FormHelperText>{error || field.helpText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SelectField;
