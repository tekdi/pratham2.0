import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { SxProps, Theme } from '@mui/material/styles';

interface CommonCircularProgressProps {
  variant?: 'determinate' | 'indeterminate';
  value?: number;
  size?: number;
  thickness?: number;
  color?: string;
  sx?: SxProps<Theme>;
}

export const Progress: React.FC<CommonCircularProgressProps> = ({
  variant = 'determinate',
  value = 0,
  size = 40,
  thickness = 3.6,
  color = 'primary',
  sx = {},
}) => {
  return (
    <CircularProgress
      variant={variant}
      value={value}
      size={size}
      thickness={thickness}
      sx={{
        color,
        ...sx,
      }}
    />
  );
};
