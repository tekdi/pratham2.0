'use client';

import React from 'react';
import {
  TextField as MuiTextField,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface TextFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const inputType =
    field.fieldType === 'email'
      ? 'email'
      : field.fieldType === 'phone'
      ? 'tel'
      : 'text';

  return (
    <FormControl fullWidth error={!!error}>
      <MuiTextField
        label={field.fieldLabel}
        value={value ?? ''}
        onChange={(e) => onChange(field.fieldName, e.target.value)}
        type={inputType}
        placeholder={field.placeholder || ''}
        required={field.isRequired}
        error={!!error}
        size="small"
        inputProps={{
          maxLength: field.validations?.maxLength,
        }}
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
      />
      {(error || field.helpText) && (
        <FormHelperText>{error || field.helpText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default TextField;
