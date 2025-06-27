'use client';

import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        padding: (theme) => theme.spacing(2.5),
        backgroundColor: '#fff',
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box sx={{ mx: '22px', my: '16px' }}>
        <Box mb={2}>
          <img src="/logo.png" alt="PraDigi" height={40} />
        </Box>

        <Stack spacing={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Useful links:
            </Typography>
            {[
              { text: 'Pratham', href: '#' },
              { text: 'Pratham Open School', href: '#' },
              { text: 'Experimento India', href: '#' },
              { text: 'Siemens Stiftung Media Portal', href: '#' },
              { text: 'CREA', href: '#' },
              { text: 'Hour of Engineering', href: '#' },
            ].map((link, index, arr) => (
              <React.Fragment key={link.text}>
                <Link href={link.href} color="text.secondary" underline="hover">
                  {link.text}
                </Link>
                {index < arr.length - 1 && (
                  <Typography color="text.secondary">|</Typography>
                )}
              </React.Fragment>
            ))}
          </Box>

          <Typography variant="body2" color="text.secondary">
            All resources on the website are licensed under a CC-BY-NC-SA 4.0 or
            CC-BY-SA 4.0 International License. Please refer to individual
            content to find more.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                © 2024 Pratham
              </Typography>
              <Link href="/privacy" color="text.secondary" underline="hover">
                Privacy Guidelines
              </Link>
            </Box>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="right"
            >
              Experimento India is a part of Project Jigyaasa.
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
