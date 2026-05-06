'use client';

import React from 'react';
import { SurveyField } from '../../types/survey';
import TextField from './TextField';
import TextareaField from './TextareaField';
import NumberField from './NumberField';
import SelectField from './SelectField';
import RadioField from './RadioField';
import CheckboxField from './CheckboxField';
import RatingField from './RatingField';
import ScaleField from './ScaleField';
import DateField from './DateField';
import FileUploadField from './FileUploadField';

interface FieldRendererProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
  questionNumber?: number;
}

const FieldRenderer: React.FC<FieldRendererProps> = ({
  field,
  value,
  error,
  onChange,
  questionNumber,
}) => {
  const f = questionNumber != null
    ? { ...field, fieldLabel: `${questionNumber}. ${field.fieldLabel}` }
    : field;

  switch (f.fieldType) {
    case 'text':
    case 'email':
    case 'phone':
      return <TextField field={f} value={value} error={error} onChange={onChange} />;

    case 'textarea':
      return <TextareaField field={f} value={value} error={error} onChange={onChange} />;

    case 'number':
      return <NumberField field={f} value={value} error={error} onChange={onChange} />;

    case 'select':
    case 'multi_select':
      return <SelectField field={f} value={value} error={error} onChange={onChange} />;

    case 'radio':
      return <RadioField field={f} value={value} error={error} onChange={onChange} />;

    case 'checkbox':
      return <CheckboxField field={f} value={value} error={error} onChange={onChange} />;

    case 'rating':
      return <RatingField field={f} value={value} error={error} onChange={onChange} />;

    case 'scale':
      return <ScaleField field={f} value={value} error={error} onChange={onChange} />;

    case 'date':
    case 'time':
    case 'datetime':
      return <DateField field={f} value={value} error={error} onChange={onChange} />;

    case 'image_upload':
    case 'video_upload':
    case 'file_upload':
      return <FileUploadField field={f} value={value} error={error} onChange={onChange} />;

    default:
      return <TextField field={f} value={value} error={error} onChange={onChange} />;
  }
};

export default FieldRenderer;
