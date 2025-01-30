import React from 'react';
import TextField from '@mui/material/TextField';
import { SxProps } from '@mui/material/styles';

interface CustomTextFieldProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  multiline?: boolean;
  rows?: number; // For multiline fields
  placeholder?: string;
  disabled?: boolean;
  sx?: SxProps;
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder = '',
  disabled = false,
  sx = {},
}) => {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      placeholder={placeholder}
      disabled={disabled}
      fullWidth
      sx={sx}
    />
  );
};

export default CustomTextField;
