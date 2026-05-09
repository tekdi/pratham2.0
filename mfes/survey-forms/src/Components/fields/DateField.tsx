'use client';

import React from 'react';
import {
  TextField as MuiTextField,
  FormControl,
  
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface DateFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const DateField: React.FC<DateFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const inputType =
    field.fieldType === 'time'
      ? 'time'
      : field.fieldType === 'datetime'
      ? 'datetime-local'
      : 'date';

  const todayStr = new Date().toISOString().split('T')[0];
  const maxDate = inputType === 'date' ? todayStr : inputType === 'datetime-local' ? new Date().toISOString().slice(0, 16) : undefined;

  return (
    <FormControl fullWidth error={!!error}>
      <MuiTextField
        label={field.fieldLabel}
        value={value ?? ''}
        onChange={(e) => onChange(field.fieldName, e.target.value)}
        type={inputType}
        required={field.isRequired}
        error={!!error}
        size="small"
        InputLabelProps={{ shrink: true }}
        inputProps={{ max: maxDate }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
    </FormControl>
  );
};

export default DateField;
