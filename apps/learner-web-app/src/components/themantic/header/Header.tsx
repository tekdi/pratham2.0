'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="space-between"
      flexWrap="wrap"
      sx={{ width: '100%', background: '#fff' }}
    >
      {/* Left Logo */}
      <Grid
        item
        xs={12}
        sm={3}
        md={3}
        lg={2}
        xl={2}
        display="flex"
        justifyContent="flex-start"
        alignItems="flex-end"
      >
        <Box
          sx={{
            width: {
              xs: '50%', // col-6
              sm: '100%', // col-sm-12
              md: '100%', // col-md-12
              lg: '100%', // col-lg-12
              xl: '91.6667%', // col-xl-11
            },
            mx: { xs: 'auto', sm: 0 }, // offset-3 on xs only
          }}
        >
          <Image
            src="/images/siemens-stiftung-logo_updated.png"
            alt="Siemens Stiftung Logo"
            width={280}
            height={97}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </Grid>

      {/* Middle Logo */}
      <Grid
        item
        xs={12}
        sm={1}
        md={1}
        lg={1}
        xl={1}
        display="flex"
        justifyContent="center"
        alignItems="flex-end"
        sx={{
          ml: {
            xs: 0,
            sm: '16.6667%', // offset-sm-2
            md: '25%',      // offset-md-3
            lg: '25%',      // offset-lg-3
            xl: '25%',      // offset-xl-3
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: '16.6667%', // col-2
              sm: '83.3333%', // col-sm-10
              md: '75%',      // col-md-9
              lg: '58.3333%', // col-lg-7
              xl: '58.3333%', // col-xl-7
            },
            mx: {
              xs: '41.6667%', // offset-5 on xs
              sm: '16.6667%', // offset-sm-2
              md: 0,          // offset-md-0
              lg: '16.6667%', // offset-lg-2
              xl: '16.6667%', // offset-xl-2
            },
            cursor: 'pointer'
          }}
          onClick={() => router.push('/themantic')}

        >
          <Image
            src="/images/pratham-left1.png"
            alt="Pratham Logo"
            width={150}
            height={60}
            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </Grid>

      {/* Right Logo */}
      <Grid
        item
        xs={12}
        sm={2}
        md={3}
        lg={2}
        xl={2}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
        sx={{
          ml: {
            xs: 0,
            sm: '33.3333%', // offset-sm-4
            md: '16.6667%', // offset-md-2
            lg: '25%',      // offset-lg-3
            xl: '25%',      // offset-xl-3
          },
        }}
      >
        <Box
          sx={{
            width: {
              xs: '33.3333%', // col-4
              sm: '83.3333%', // col-sm-10
              md: '66.6667%', // col-md-8
              lg: '66.6667%', // col-lg-8
              xl: '58.3333%', // col-xl-7
            },
            mx: {
              xs: '33.3333%', // offset-4
              sm: '16.6667%', // offset-sm-2
              md: '33.3333%', // offset-md-4
              lg: '33.3333%', // offset-lg-4
              xl: '41.6667%', // offset-xl-5
            },
          }}
        >
          <img
            src="/images/siemens-logo_updated.png"
            alt="SIEMENS Logo"

            style={{
              width: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
};

export default Header;
