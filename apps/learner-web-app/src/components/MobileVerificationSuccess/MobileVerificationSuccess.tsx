'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useTranslation } from '@shared-lib';

const MobileVerificationSuccess = () => {
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={'column'}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 48, color: 'green', mb: 2 }} />
      <Typography
        variant="h1"
        sx={{
          fontWeight: 400,
          // fontSize: '22px',
          // lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
          verticalAlign: 'middle',
          mb: 3,
        }}
      >
        {t('LANDING.ENROL_MODAL.AWESOME')}
      </Typography>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 200,
          // fontSize: '22px',
          // lineHeight: '28px',
          letterSpacing: '0px',
          textAlign: 'center',
          verticalAlign: 'middle',
          mb: 3,
        }}
      >
        {t('LANDING.ENROL_MODAL.PHONE_VERIFIED_SUCCESS')}
      </Typography>
    </Box>
  );
};

export default MobileVerificationSuccess;
