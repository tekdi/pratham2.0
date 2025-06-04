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
      sx={{
        minHeight: { xs: 'auto', sm: '100vh' },
      }}
    >
      <Image
        src={welcomeGIF}
        alt={t('LEARNER_APP.LOGIN.welcome_image_alt')}
        width={60}
        height={60}
        style={{ marginBottom: '16px' }}
      />

      <Typography
        variant="body9"
        component="h2"
        fontWeight={400}
        // fontSize="32px"
        // lineHeight="40px"
        // letterSpacing="0px"
        textAlign="center"
        sx={{ verticalAlign: 'middle' }}
      >
        {t('LEARNER_APP.LOGIN.welcome_title')}
      </Typography>
      <Typography
        variant="h1"
        fontWeight={400}
        // fontSize="22px"
        // lineHeight="28px"
        // letterSpacing="0px"
        textAlign="center"
        sx={{ verticalAlign: 'middle' }}
        mb={4}
      >
        {t('LEARNER_APP.LOGIN.welcome_subtitle')}
      </Typography>

      {/* App Download Section - Responsive Arrangement */}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        // spacing={2}
        maxWidth="700px"
        //  sx={{ mt: 2 }}
      >
        {/* QR Code Section */}
        <Grid item xs={12} sm={5} md={4}>
          <Box
            display="flex"
            flexDirection={{
              xs: 'column',
              sm: 'column',
              md: 'column',
              lg: 'row',
            }}
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <Image
              src={prathamQRCode}
              alt={t('LEARNER_APP.LOGIN.qr_image_alt')}
              width={70}
              height={70}
            />
            <Box textAlign="center">
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
            flexDirection={{
              xs: 'column',
              sm: 'column',
              md: 'column',
              lg: 'row',
            }}
            alignItems="center"
            justifyContent="center"
            gap={2}
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
            />
            <Box textAlign="center">
              <Typography
                fontSize="14px"
                color="textSecondary"
                sx={{
                  whiteSpace: 'normal',
                  wordBreak: 'keep-all', // prevents breaking within words
                  overflowWrap: 'break-word', // only break long words if needed
                  textAlign: 'center',
                }}
              >
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
