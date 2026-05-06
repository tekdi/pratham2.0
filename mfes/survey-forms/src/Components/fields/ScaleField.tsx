'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  Slider,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface ScaleFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const ScaleField: React.FC<ScaleFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const min = field.validations?.min ?? 0;
  const max = field.validations?.max ?? 10;

  return (
    <FormControl fullWidth error={!!error}>
      <FormLabel required={field.isRequired} sx={{ color: '#1E1B16', fontSize: '14px', mb: 1 }}>
        {field.fieldLabel}
      </FormLabel>
      <Box sx={{ px: 1 }}>
        <Slider
          value={value ?? min}
          onChange={(_, newValue) => onChange(field.fieldName, newValue)}
          min={min}
          max={max}
          valueLabelDisplay="auto"
          sx={{ color: '#FDBE16' }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#999' }}>
            {min}
          </Typography>
          <Typography variant="caption" sx={{ color: '#999' }}>
            {max}
          </Typography>
        </Box>
      </Box>
      {(error || field.helpText) && (
        <FormHelperText>{error || field.helpText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default ScaleField;
