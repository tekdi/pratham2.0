'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import StatusCard, { StatusCardProps, StatusVariant } from './StatusCard';

export interface StatusCardData {
  id: string;
  count: number;
  title: string;
  variant?: StatusVariant;
  icon?: React.ElementType;
  customColors?: {
    border: string;
    background: string;
    iconColor: string;
  };
  onClick?: () => void;
}

export interface StatusCardsRowProps {
  /** Array of status card data */
  cards: StatusCardData[];
  /** Size for all cards */
  size?: 'small' | 'medium' | 'large';
  /** Loading state for all cards */
  loading?: boolean;
  /** Spacing between cards */
  spacing?: number;
  /** Custom container styles */
  sx?: any;
  /** Responsive breakpoints */
  responsive?: {
    xs?: number; // cards per row on extra small screens
    sm?: number; // cards per row on small screens  
    md?: number; // cards per row on medium screens
    lg?: number; // cards per row on large screens
    xl?: number; // cards per row on extra large screens
  };
}

const StatusCardsRow: React.FC<StatusCardsRowProps> = ({
  cards,
  size = 'medium',
  loading = false,
  spacing = 2,
  sx = {},
  responsive = {
    xs: 1, // 1 card per row on mobile
    sm: 2, // 2 cards per row on small tablets
    md: 4, // 4 cards per row on desktop (default for 4 status cards)
    lg: 4,
    xl: 4,
  },
}) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  // Calculate grid columns based on responsive settings
  const getGridCols = () => {
    return {
      xs: 12 / (responsive.xs || 1),
      sm: 12 / (responsive.sm || 2), 
      md: 12 / (responsive.md || 4),
      lg: 12 / (responsive.lg || 4),
      xl: 12 / (responsive.xl || 4),
    };
  };

  const gridCols = getGridCols();

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Grid container spacing={spacing}>
        {cards.map((card) => (
          <Grid
            key={card.id}
            item
            xs={gridCols.xs}
            sm={gridCols.sm}
            md={gridCols.md}
            lg={gridCols.lg}
            xl={gridCols.xl}
          >
            <StatusCard
              count={card.count}
              title={card.title}
              variant={card.variant}
              icon={card.icon}
              customColors={card.customColors}
              onClick={card.onClick}
              size={size}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatusCardsRow;