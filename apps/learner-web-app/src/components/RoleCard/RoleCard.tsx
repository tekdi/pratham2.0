'use client';
import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';

interface RoleCardColorTheme {
  cardBackground: string;
  borderColor: string;
  iconBackground: string;
  iconColor: string;
}

export const ROLE_CARD_THEMES = {
  learn: {
    cardBackground: '#FFFBEA',
    borderColor: '#FDBE16',
    iconBackground: '#FDBE16',
    iconColor: '#7A4F00',
  } satisfies RoleCardColorTheme,
  volunteer: {
    cardBackground: '#FFF0EE',
    borderColor: '#FFAB9F',
    iconBackground: '#FFCBC5',
    iconColor: '#D32F2F',
  } satisfies RoleCardColorTheme,
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  theme?: RoleCardColorTheme;
  onClick?: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  icon,
  title,
  description,
  theme = ROLE_CARD_THEMES.learn,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        backgroundColor: theme.cardBackground,
        borderRadius: '16px',
        boxShadow: 'none',
        border: `1.5px solid ${theme.borderColor}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow 0.2s, border-color 0.2s',
        '&:hover': onClick
          ? { boxShadow: '0px 4px 16px rgba(0,0,0,0.12)' }
          : {},
      }}
    >
      <CardActionArea
        disableRipple={!onClick}
        sx={{
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: 1.5,
          '&:hover .MuiCardActionArea-focusHighlight': { opacity: 0 },
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: theme.iconBackground,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1,
            color: theme.iconColor,
            fontSize: 28,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '26px',
            color: '#1F1B13',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: '#5C5952',
          }}
        >
          {description}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

export default RoleCard;
