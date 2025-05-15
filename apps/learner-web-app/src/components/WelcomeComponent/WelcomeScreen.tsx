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

      {/* App Download Section - Horizontal Arrangement */}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        maxWidth="700px"
        sx={{ mt: 2 }}
      >
        {/* QR Code Section */}
        <Grid item xs={12} sm={5} md={4}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
          >
            <Image
              src={prathamQRCode}
              alt={t('LEARNER_APP.LOGIN.qr_image_alt')}
              width={70}
              height={70}
              style={{ marginRight: 12 }}
            />
            <Box textAlign="left">
              <Typography fontWeight={600} fontSize="16px">
                Get the App
              </Typography>
              <Typography fontSize="14px" color="textSecondary">
                Point your phone
                <br />
                camera here
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* OR Divider */}
        <Grid
          item
          xs={12}
          sm={2}
          md={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography fontWeight={500} fontSize="18px">
            OR
          </Typography>
        </Grid>

        {/* Play Store Section */}
        <Grid item xs={12} sm={5} md={5}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
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
              width={140}
              height={44}
              style={{ marginRight: 12 }}
            />
            <Box textAlign="left">
              <Typography fontSize="14px" color="textSecondary">
                Search <b>"Pratham myLearning"</b>
                <br />
                on Playstore
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeScreen;
