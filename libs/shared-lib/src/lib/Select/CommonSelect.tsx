import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

interface DropdownProps {
  label: string;
  value: string | number;
  onChange: (event: SelectChangeEvent) => void;
  options: { label: string; value: string | number }[];
  fullWidth?: boolean;
  minWidth?: number;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const CommonSelect: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  minWidth = 120,
  width = '100%',
  height = '40px',
  borderRadius = '4px',
}) => {
  return (
    <Box sx={{ minWidth }}>
      <FormControl fullWidth={fullWidth} sx={{ width }}>
        <InputLabel id={`${label}-label`}>{label}</InputLabel>
        <Select
          labelId={`${label}-label`}
          value={value === null || value === undefined ? '' : String(value)}
          label={label}
          onChange={onChange}
          sx={{
            height,
            borderRadius,
            '& .MuiOutlinedInput-root': {
              borderRadius, // Apply custom border radius to the outlined input
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
