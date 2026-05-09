'use client';

import React from 'react';
import {
  FormControl,
  FormLabel,
  Rating,
  
  Box,
  Typography,
} from '@mui/material';
import { SurveyField } from '../../types/survey';

interface RatingFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const RatingField: React.FC<RatingFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const max = field.validations?.max || 5;

  return (
    <FormControl error={!!error}>
      <FormLabel required={field.isRequired} sx={{ color: '#1E1B16', fontSize: '14px', mb: 0.5 }}>
        {field.fieldLabel}
      </FormLabel>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Rating
          value={value ?? 0}
          onChange={(_, newValue) => onChange(field.fieldName, newValue)}
          max={max}
          size="large"
        />
        {value != null && (
          <Typography variant="body2" sx={{ color: '#7C766F', mb: 0 }}>
            {value}/{max}
          </Typography>
        )}
      </Box>
    </FormControl>
  );
};

export default RatingField;
