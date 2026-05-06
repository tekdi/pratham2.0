'use client';

import React, { useRef } from 'react';
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { SurveyField } from '../../types/survey';

interface FileUploadFieldProps {
  field: SurveyField;
  value: any;
  error?: string;
  onChange: (fieldName: string, value: any) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  field,
  value,
  error,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept =
    field.fieldType === 'image_upload'
      ? 'image/*'
      : field.fieldType === 'video_upload'
      ? 'video/*'
      : field.uploadConfig?.allowedMimeTypes?.join(',') || '*/*';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(field.fieldName, file.name);
    }
  };

  return (
    <FormControl fullWidth error={!!error}>
      <FormLabel required={field.isRequired} sx={{ color: '#1E1B16', fontSize: '14px', mb: 1 }}>
        {field.fieldLabel}
      </FormLabel>
      <Box
        sx={{
          border: '1px dashed #ccc',
          borderRadius: '8px',
          p: 2,
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': { borderColor: '#FDBE16' },
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          hidden
        />
        <CloudUploadIcon sx={{ fontSize: 32, color: '#999', mb: 1 }} />
        <Typography variant="body2" sx={{ color: '#999', mb: 0 }}>
          Click to upload
        </Typography>
        {field.uploadConfig?.maxSizeMb && (
          <Typography variant="caption" sx={{ color: '#bbb' }}>
            Max size: {field.uploadConfig.maxSizeMb}MB
          </Typography>
        )}
      </Box>
      {value && (
        <Box sx={{ mt: 1 }}>
          <Chip label={String(value)} onDelete={() => onChange(field.fieldName, null)} size="small" />
        </Box>
      )}
      {(error || field.helpText) && (
        <FormHelperText>{error || field.helpText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default FileUploadField;
