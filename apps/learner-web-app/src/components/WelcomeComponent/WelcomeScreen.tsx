'use client';

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import welcomeGIF from '../../../public/images/welcome.gif';
import playstoreIcon from '../../../public/images/playstore.png';
import prathamQRCode from '../../../public/images/prathamQR.png';
import { useTranslation } from '@shared-lib';
import { useRouter } from 'next/navigation';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      textAlign="center"
    >
      <Image
        src={welcomeGIF}
        alt={t('LEARNER_APP.LOGIN.welcome_image_alt')}
        width={60}
        height={60}
        style={{ marginBottom: '16px' }}
      />

      <Typography
        fontWeight={400}
        fontSize="32px"
        lineHeight="40px"
        letterSpacing="0px"
        textAlign="center"
        sx={{ verticalAlign: 'middle' }}
      >
        {t('LEARNER_APP.LOGIN.welcome_title')}
      </Typography>

      <Typography
        fontWeight={400}
        fontSize="22px"
        lineHeight="28px"
        letterSpacing="0px"
        textAlign="center"
        sx={{ verticalAlign: 'middle' }}
        mb={4}
      >
        {t('LEARNER_APP.LOGIN.welcome_subtitle')}
      </Typography>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={4}
        maxWidth="600px"
      >
        <Grid item xs={12} sm={4}>
          <Image
            src={prathamQRCode}
            alt={t('LEARNER_APP.LOGIN.qr_image_alt')}
            width={100}
            height={100}
            style={{ margin: '0 auto' }}
          />
          <Typography
            fontFamily="Poppins"
            fontSize="14px"
            fontWeight={500}
            mt={1}
          >
            {t('LEARNER_APP.LOGIN.qr_get_app')}
          </Typography>
          <Typography fontSize="12px" color="textSecondary">
            {t('LEARNER_APP.LOGIN.qr_instruction')}
          </Typography>
        </Grid>

        <Grid
          item
          xs={12}
          sm={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography fontWeight={500}>{t('LEARNER_APP.LOGIN.or')}</Typography>
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              router.push(
                'https://play.google.com/store/apps/details?id=com.pratham.learning'
              );
            }}
          >
            <Image
              src={playstoreIcon}
              alt={t('LEARNER_APP.LOGIN.playstore_image_alt')}
              width={160}
              height={50}
            />
            <Typography fontSize="12px" color="textSecondary" mt={1}>
              {t('LEARNER_APP.LOGIN.playstore_instruction')}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeScreen;
