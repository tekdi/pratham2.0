import React from 'react';
import { Typography as MuiTypography, TypographyProps } from '@mui/material';

interface CustomTypographyProps extends TypographyProps {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'body1'
    | 'body2'
    | 'caption'
    | 'subtitle1'
    | 'subtitle2';
  fontSize?: string | number;
  fontWeight?: string | number;
  color?: string;
}

export const CustomTypography: React.FC<CustomTypographyProps> = ({
  variant,
  fontSize,
  fontWeight = 400,
  color = 'inherit',
  children,
  ...props
}) => {
  return (
    <MuiTypography
      variant={variant}
      sx={{
        fontSize,
        fontWeight,
        color,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};
