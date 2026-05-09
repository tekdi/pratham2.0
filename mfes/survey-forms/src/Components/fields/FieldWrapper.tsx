'use client';

import React from 'react';
import { FormHelperText } from '@mui/material';
import { SurveyField } from '../../types/survey';

interface FieldWrapperProps {
  field: SurveyField;
  error?: string;
  children: React.ReactNode;
}

const FieldWrapper: React.FC<FieldWrapperProps> = ({ field, error, children }) => (
  <>
    {children}
    {field.helpText && !error && (
      <FormHelperText sx={{ mx: '14px' }}>{field.helpText}</FormHelperText>
    )}
  </>
);

export default FieldWrapper;
