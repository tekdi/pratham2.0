'use client';

import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { SurveySection as SurveySectionType } from '../../types/survey';
import { isFieldVisible } from '../../utils/conditionalLogic';
import FieldRenderer from '../fields/FieldRenderer';

interface SurveySectionProps {
  section: SurveySectionType;
  formValues: Record<string, any>;
  errors: Record<string, string>;
  onChange: (fieldName: string, value: any) => void;
  fieldNumberMap?: Record<string, number>;
}

const SurveySection: React.FC<SurveySectionProps> = ({
  section,
  formValues,
  errors,
  onChange,
  fieldNumberMap,
}) => {
  const sortedFields = [...section.fields].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const visibleFields = sortedFields.filter((field) =>
    isFieldVisible(field, formValues)
  );

  if (visibleFields.length === 0) return null;

  return (
    <Box
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: '#fff',
        borderRadius: '12px',
        border: '1px solid #E0E0E0',
      }}
    >
      {section.sectionDescription && (
        <Typography variant="body2" sx={{ color: '#7C766F', mb: 1 }}>
          {section.sectionDescription}
        </Typography>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {visibleFields.map((field) => (
          <FieldRenderer
            key={field.fieldId}
            field={field}
            value={formValues[field.fieldName]}
            error={errors[field.fieldName]}
            onChange={onChange}
            questionNumber={fieldNumberMap?.[field.fieldId]}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SurveySection;
