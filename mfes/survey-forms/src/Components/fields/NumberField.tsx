'use client';

import React from 'react';
import {
  TextField as MuiTextField,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface NumberFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const NumberField: React.FC<NumberFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  return (
    <FormControl fullWidth error={!!error}>
      <MuiTextField
        label={field.fieldLabel}
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          onChange(field.fieldName, val === '' ? '' : Number(val));
        }}
        type="number"
        placeholder={field.placeholder || ''}
        required={field.isRequired}
        error={!!error}
        size="small"
        inputProps={{
          min: field.validations?.min,
          max: field.validations?.max,
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
      {(error || field.helpText) && (
        <FormHelperText>{error || field.helpText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default NumberField;
