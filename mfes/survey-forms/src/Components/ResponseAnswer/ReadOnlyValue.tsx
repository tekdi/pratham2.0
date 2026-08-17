import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import type { SurveyField } from '../../types/survey';

const ReadOnlyValue: React.FC<{ field: SurveyField; value: any }> = ({ field, value }) => {
  // Unwrap { selected, otherText } shape produced when an "Other" option exists
  const isOtherShape = value !== null && typeof value === 'object' && !Array.isArray(value) && 'selected' in value;
  const selected = isOtherShape ? value.selected : value;
  const otherText: string = isOtherShape ? (value.otherText ?? '') : '';

  const isEmpty =
    selected === null ||
    selected === undefined ||
    selected === '' ||
    (Array.isArray(selected) && selected.length === 0);

  if (isEmpty) {
    return (
      <Typography variant="body2" sx={{ color: '#9E9E9E', fontStyle: 'italic' }}>
        No answer provided
      </Typography>
    );
  }

  // Resolve option label from field options/dataSource
  const resolveLabel = (val: string | number): string => {
    const options =
      field.options ??
      (field.dataSource?.type === 'static' ? field.dataSource.options : null) ??
      [];
    const found = options?.find((o) => String(o.value) === String(val));
    return found ? found.label : String(val);
  };

  const isOtherValue = (val: any) => resolveLabel(val).toLowerCase() === 'other';

  switch (field.fieldType) {
    case 'checkbox':
    case 'multi_select': {
      const vals: any[] = Array.isArray(selected) ? selected : [selected];
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'flex-start' }}>
          {vals.map((v, i) => (
            <Chip
              key={i}
              label={isOtherValue(v) && otherText ? `Other (${otherText})` : resolveLabel(v)}
              size="small"
              sx={{ backgroundColor: '#FFF8E1' }}
            />
          ))}
        </Box>
      );
    }
    case 'radio':
    case 'select':
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16' }}>
          {isOtherValue(selected) && otherText ? `Other (${otherText})` : resolveLabel(selected)}
        </Typography>
      );
    case 'rating': {
      const max = field.validations?.max ?? 5;
      const num = Number(value);
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {Array.from({ length: max }).map((_, i) => (
            <Typography
              key={i}
              sx={{ fontSize: 22, color: i < num ? '#FDBE16' : '#E0E0E0' }}
            >
              ★
            </Typography>
          ))}
          <Typography variant="body2" sx={{ color: '#7C766F', ml: 0.5 }}>
            {num}/{max}
          </Typography>
        </Box>
      );
    }
    case 'scale': {
      const min = field.validations?.min ?? 1;
      const max = field.validations?.max ?? 10;
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16' }}>
          {value} <Typography component="span" sx={{ color: '#7C766F', fontSize: 13 }}>/ {max} (range {min}–{max})</Typography>
        </Typography>
      );
    }
    case 'date':
    case 'time':
    case 'datetime':
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16' }}>
          {String(value)}
        </Typography>
      );
    case 'image_upload':
    case 'video_upload':
    case 'file_upload': {
      const urls: string[] = Array.isArray(value) ? value : [value];
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {urls.map((url, i) => (
            <Typography key={i} variant="body2" sx={{ color: '#0D599E', wordBreak: 'break-all' }}>
              <a href={url} target="_blank" rel="noreferrer">{url}</a>
            </Typography>
          ))}
        </Box>
      );
    }
    default:
      return (
        <Typography variant="body1" sx={{ color: '#1E1B16', whiteSpace: 'pre-wrap' }}>
          {String(value)}
        </Typography>
      );
  }
};

export default ReadOnlyValue;
