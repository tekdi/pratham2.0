import React from 'react';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/material/styles';

interface TypographyProps {
  variant?: 'heading' | 'subtitle' | 'paragraph' | 'label' | 'link'; // Text types
  level?: 1 | 2 | 3 | 4 | 5 | 6; // For heading levels (h1, h2, etc.)
  text: string; // Text content
  href?: string; // For links
  sx?: SxProps; // Additional styles
  onClick?: () => void; // For clickable text
}

const CustomTypography: React.FC<TypographyProps> = ({
  variant = 'paragraph',
  level = 5,
  text,
  href,
  sx = {},
  onClick,
}) => {
  // Define base styles for each variant
  const styles: Record<string, SxProps> = {
    heading: {
      fontWeight: 600,
      lineHeight: 1.2,
      marginBottom: '16px',
      ...(level === 1 && { fontSize: '2.5rem' }), // h1
      ...(level === 2 && { fontSize: '2rem' }), // h2
      ...(level === 3 && { fontSize: '1.75rem' }), // h3
      ...(level === 4 && { fontSize: '1.5rem' }), // h4
      ...(level === 5 && { fontSize: '1.25rem' }), // h5
      ...(level === 6 && { fontSize: '1rem' }), // h6
    },
    subtitle: {
      fontWeight: 500,
      color: '#6A4FC4',
      lineHeight: 1.3,
      fontSize: '1rem',
    },
    paragraph: {
      fontWeight: 400,
      lineHeight: 1.5,
      color: '#333',
      fontSize: '1rem',
      marginBottom: '12px',
    },
    label: {
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      color: '#555',
    },
    link: {
      fontWeight: 400,
      color: '#6A4FC4',
      textDecoration: 'underline',
      cursor: 'pointer',
      '&:hover': {
        color: '#5A3FB3',
      },
    },
  };

  // Determine the HTML element to use
  const getElement = (): React.ElementType => {
    if (variant === 'heading') return `h${level}`;
    if (variant === 'link' && href) return 'a';
    return 'p'; // Default element
  };

  // Typography props
  const commonProps = {
    component: getElement(),
    sx: { ...styles[variant], ...sx },
    onClick,
    ...(variant === 'link' && href
      ? { href, target: '_blank', rel: 'noopener noreferrer' }
      : {}),
  };

  return <Typography {...commonProps}>{text}</Typography>;
};

export default CustomTypography;
