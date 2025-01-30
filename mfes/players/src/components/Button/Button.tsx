import React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { SxProps } from '@mui/material/styles';

interface CustomButtonProps {
  title?: string; // The text inside the button (optional for icon buttons)
  onClick: () => void; // Function to call on click
  variant?: 'primary' | 'secondary' | 'outlined' | 'icon'; // Type of button
  icon?: React.ReactNode; // For icon buttons
  disabled?: boolean; // Disabled state
  sx?: SxProps; // Additional styles (optional)
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onClick,
  variant = 'primary',
  icon,
  disabled = false,
  sx = {},
}) => {
  // Define styles for each variant
  const styles: Record<string, SxProps> = {
    primary: {
      backgroundColor: '#6750A4',
      color: '#fff',
      borderRadius: '20px',
      padding: '8px 20px',
      textTransform: 'capitalize',
      '&:hover': {
        backgroundColor: '#5A3FB3',
      },
    },
    secondary: {
      backgroundColor: '#fff',
      color: '#6750A4',
      border: '1px solid #79747E',
      borderRadius: '20px',
      padding: '8px 20px',
      textTransform: 'capitalize',
      '&:hover': {
        backgroundColor: '#f3f1fc',
      },
    },
    outlined: {
      backgroundColor: 'transparent',
      color: '#6750A4',
      border: '1px solid #79747E',
      borderRadius: '20px',
      padding: '8px 20px',
      textTransform: 'capitalize',
      '&:hover': {
        backgroundColor: '#f3f1fc',
      },
    },
    icon: {
      backgroundColor: 'transparent',
      color: '#6750A4',
      padding: '8px',
      '&:hover': {
        backgroundColor: '#f3f1fc',
      },
    },
  };

  // Render IconButton for the "icon" variant
  if (variant === 'icon' && icon) {
    return (
      <IconButton onClick={onClick} disabled={disabled} sx={{ ...styles.icon }}>
        {icon}
      </IconButton>
    );
  }

  // Render standard Button for other variants
  return (
    <Button onClick={onClick} disabled={disabled} sx={{ ...styles[variant] }}>
      {title}
    </Button>
  );
};

export default CustomButton;
