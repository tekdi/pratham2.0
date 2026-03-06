'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export type StatusVariant = 'total' | 'pending' | 'approved' | 'rejected';

export interface StatusCardProps {
  /** The count/number to display */
  count: number;
  /** The title/label for the status */
  title: string;
  /** Predefined status variant or custom color scheme */
  variant?: StatusVariant;
  /** Custom icon component (overrides default variant icon) */
  icon?: React.ElementType;
  /** Custom colors for the card */
  customColors?: {
    border: string;
    background: string;
    iconColor: string;
  };
  /** Click handler for the card */
  onClick?: () => void;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Additional styling */
  sx?: any;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

const StatusCard: React.FC<StatusCardProps> = ({
  count,
  title,
  variant = 'total',
  icon,
  customColors,
  onClick,
  size = 'medium',
  sx = {},
  loading = false,
  disabled = false,
}) => {
  const theme = useTheme();

  // Default icons for each variant
  const variantIcons = {
    total: PersonOutlineIcon,
    pending: AccessTimeIcon,
    approved: CheckCircleIcon,
    rejected: CancelIcon,
  };

  // Default color schemes for each variant
  const variantColors = {
    total: {
      border: '#FF9800', // Orange
      background: 'rgba(255, 152, 0, 0.08)',
      iconColor: '#FF9800',
    },
    pending: {
      border: '#FFC107', // Yellow/Amber
      background: 'rgba(255, 193, 7, 0.08)',
      iconColor: '#FFC107',
    },
    approved: {
      border: '#4CAF50', // Green
      background: 'rgba(76, 175, 80, 0.08)',
      iconColor: '#4CAF50',
    },
    rejected: {
      border: '#F44336', // Red
      background: 'rgba(244, 67, 54, 0.08)',
      iconColor: '#F44336',
    },
  };

  // Size configurations
  const sizeConfig = {
    small: {
      minHeight: 80,
      padding: '12px 16px',
      countSize: '1.5rem',
      titleSize: '0.75rem',
      iconSize: 20,
    },
    medium: {
      minHeight: 100,
      padding: '16px 20px',
      countSize: '2rem',
      titleSize: '0.875rem',
      iconSize: 24,
    },
    large: {
      minHeight: 120,
      padding: '20px 24px',
      countSize: '2.5rem',
      titleSize: '1rem',
      iconSize: 28,
    },
  };

  // Get colors (custom or variant-based)
  const colors = customColors || variantColors[variant];
  
  // Get icon component
  const IconComponent = icon || variantIcons[variant];
  
  // Get size config
  const config = sizeConfig[size];

  return (
    <Card
      onClick={disabled ? undefined : onClick}
      sx={{
        minHeight: config.minHeight,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.background,
        borderRadius: 2,
        cursor: onClick && !disabled ? 'pointer' : 'default',
        transition: 'all 0.2s ease-in-out',
        opacity: disabled ? 0.6 : 1,
        '&:hover': onClick && !disabled ? {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${colors.border}30`,
        } : {},
        ...sx,
      }}
    >
      <CardContent
        sx={{
          padding: config.padding,
          '&:last-child': { paddingBottom: config.padding },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        {/* Left Side: Title and Count */}
        <Box sx={{ flex: 1 }}>
          {/* Title */}
          <Typography
            variant="body2"
            sx={{
              fontSize: config.titleSize,
              fontWeight: 500,
              color: 'text.secondary',
              textTransform: 'capitalize',
              mb: 1,
            }}
          >
            {title}
          </Typography>

          {/* Count */}
          <Typography
            variant="h4"
            sx={{
              fontSize: config.countSize,
              fontWeight: 700,
              color: 'text.primary',
              lineHeight: 1.2,
            }}
          >
            {loading ? '...' : count.toLocaleString()}
          </Typography>
        </Box>

        {/* Right Side: Icon */}
        <Box>
          <IconComponent
            sx={{
              fontSize: config.iconSize,
              color: colors.iconColor,
              opacity: 0.8,
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatusCard;