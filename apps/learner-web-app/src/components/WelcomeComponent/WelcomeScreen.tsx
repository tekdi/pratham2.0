'use client';

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import welcomeGIF from '../../../public/images/welcome.gif';
import playstoreIcon from '../../../public/images/playstore.png';
import prathamQRCode from '../../../public/images/prathamQR.png';

const WelcomeScreen = () => {
  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      px={2}
      textAlign="center"
      // bgcolor="#fffef5"
    >
      {/* Smiley image */}
      <Image
        src={welcomeGIF}
        alt="Smiley face"
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
        Welcome to Pratham myLearning!
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
        Your Learning Journey Begins here
      </Typography>

      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={4}
        maxWidth="600px"
      >
        {/* QR code section */}
        <Grid item xs={12} sm={4}>
          <Image
            src={prathamQRCode}
            alt="QR Code"
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
            Get the App
          </Typography>
          <Typography fontSize="12px" color="textSecondary">
            Point your phone <br /> camera here
          </Typography>
        </Grid>

        {/* OR divider */}
        <Grid
          item
          xs={12}
          sm={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography fontWeight={500}>OR</Typography>
        </Grid>

        {/* Playstore section */}
        <Grid item xs={12} sm={5}>
          <Image
            src={playstoreIcon}
            alt="Get it on Google Play"
            width={160}
            height={50}
          />
          <Typography fontSize="12px" color="textSecondary" mt={1}>
            Search <strong>“Pratham myLearning”</strong> on Playstore
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WelcomeScreen;
