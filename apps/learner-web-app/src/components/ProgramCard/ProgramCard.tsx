'use client';
import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';

interface ProgramCardProps {
  image: string;
  title: string;
  description?: string;
  buttonColor: string;
  buttonLabel?: string;
  onExplore?: () => void;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  image,
  title,
  description,
  buttonColor,
  buttonLabel = 'Explore & Register',
  onExplore,
}) => {
  return (
    <Card
      sx={{
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0px 4px 16px rgba(0,0,0,0.10)',
        backgroundColor: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.14)',
        },
      }}
    >
      {/* Program Image */}
      <Box
        component="img"
        src={image}
        alt={title}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = '/images/default.png';
        }}
        sx={{
          width: '100%',
          height: 220,
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Card Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: 2.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#1F1B13',
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '13px',
              lineHeight: '20px',
              color: '#5C5952',
              flexGrow: 1,
            }}
          >
            {description}
          </Typography>
        )}

        <Button
          onClick={onExplore}
             variant="contained"
                  color="primary"
          disableElevation
          sx={{
            mt: 1,
           
         //   color: '#fff',
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '20px',
            textTransform: 'none',
            borderRadius: '8px',
            py: 1.2,
            // '&:hover': {
            //   backgroundColor: buttonColor,
            //   filter: 'brightness(0.9)',
            // },
          }}
        >
          {buttonLabel}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProgramCard;
