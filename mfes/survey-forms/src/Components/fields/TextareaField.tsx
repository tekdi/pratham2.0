'use client';

import React from 'react';
import {
  TextField as MuiTextField,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface TextareaFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
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
        onChange={(e) => onChange(field.fieldName, e.target.value)}
        multiline
        rows={3}
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

export default TextareaField;
