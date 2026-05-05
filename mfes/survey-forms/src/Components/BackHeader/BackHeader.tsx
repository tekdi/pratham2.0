'use client';

import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

const BackHeader: React.FC<BackHeaderProps> = ({ title, subtitle, onBack }) => {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 2,
        backgroundColor: '#fff',
        borderBottom: '1px solid #eee',
      }}
    >
      <IconButton onClick={handleBack} size="small">
        <ArrowBackIcon sx={{ color: '#1E1B16' }} />
      </IconButton>
      <Box>
        <Typography
          variant="h2"
          sx={{ color: '#1E1B16', fontWeight: 500, fontSize: '16px' }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="h5" sx={{ color: '#7C766F' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default BackHeader;
