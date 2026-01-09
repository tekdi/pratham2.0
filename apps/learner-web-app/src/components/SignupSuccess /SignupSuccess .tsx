'use client';

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Image from 'next/image';
import tada from '../../../public/images/tada.gif';
import { useTranslation } from '@shared-lib';

const SignupSuccess = ({
  withProgramName = false,
}: {
  withProgramName?: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={'column'}
    >
      <Image
        src={tada}
        alt="Smiley face"
        width={30}
        height={30}
        style={{ marginBottom: '16px' }}
      />

      <Typography
        variant="h1"
        sx={{
          fontWeight: 400,
          // fontSize: '22px',
          // lineHeight: '28px',
          // letterSpacing: '0px',
          textAlign: 'center',
          verticalAlign: 'middle',
          mb: 3,
        }}
      >
        {t('NAVAPATHAM.HURRAY')}
      </Typography>
      {typeof window !== 'undefined' && window.localStorage && (
        <Typography
          sx={{
            fontWeight: 200,
            fontSize: '22px',
            lineHeight: '28px',
            letterSpacing: '0px',
            textAlign: 'center',
            verticalAlign: 'middle',
            mb: 3,
          }}
        >
          {withProgramName
            ? `${t(
                'LEARNER_APP.REGISTRATION_FLOW.YOU_HAVE_SUCCESSFULLY_SIGNED_UP_FOR'
              )} ${
                localStorage.getItem('isForNavaPatham') === 'true'
                  ? t('NAVAPATHAM.NAVAPATHAM')
                  : localStorage.getItem('userProgram')
              }.`
            : t('LEARNER_APP.REGISTRATION_FLOW.LEARNING_JOURNEY_FIRST_STEP')}
        </Typography>
      )}
    </Box>
  );
};

export default SignupSuccess;
