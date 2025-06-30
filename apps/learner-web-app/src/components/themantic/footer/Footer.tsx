'use client';

import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        px: 8,
        py: 5,
        backgroundColor: '#fff',
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ mx: '22px', my: '16px' }}>
          <Box mb={2}>
            <img src="/images/pradigi1.png" alt="PraDigi" height={40} />
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
              <Typography
                variant="body2"
                sx={{ fontSize: '14px', fontWeight: 400, color: '#000000' }}
              >
                Useful links:
              </Typography>
              {[
                { text: 'Pratham', href: '/https://www.pratham.org/' },
                {
                  text: 'Pratham Open School',
                  href: 'https://www.prathamopenschool.org/catalog/contents/1000001',
                },
                {
                  text: 'Experimento India',
                  href: 'https://www.siemens-stiftung.org/en/projects/experimento/stem-education-for-innovation-experimento-india/',
                },
                {
                  text: 'Siemens Stiftung Media Portal',
                  href: 'https://medienportal.siemens-stiftung.org/en/experimento-matrix',
                },
                {
                  text: 'CREA',
                  href: 'https://crea-portaldemedios.siemens-stiftung.org/experimento',
                },
                {
                  text: 'Hour of Engineering',
                  href: 'https://hourofengineering.com/',
                },
              ].map((link, index, arr) => (
                <React.Fragment key={link.text}>
                  <Link
                    href={link.href}
                    color="text.secondary"
                    underline="hover"
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: '12px', fontWeight: 400, color: '#000000' }}
                  >
                    {link.text}
                  </Link>
                  {index < arr.length - 1 && (
                    <Typography color="text.secondary">|</Typography>
                  )}
                </React.Fragment>
              ))}
            </Box>

            <Typography
              sx={{ fontSize: '12px', fontWeight: 400, color: '#000000' }}
            >
              All resources on the website are licensed under a CC-BY-NC-SA 4.0
              or CC-BY-SA 4.0 International License. Please refer to individual
              content to find more.
            </Typography>
          </Stack>
        </Box>

        <Box>
          <Box sx={{ mt: 3 }}>
            <Typography
              sx={{ fontSize: '16px', fontWeight: 400, color: '#000000' }}
            >
              Experimento India is a part of Project Jigyaasa.
            </Typography>
          </Box>
          <Box>
            <Box sx={{ mt: 8, display: 'flex', justifyContent: 'end' }}>
              <img
                src="/images/footer-icons.png"
                alt="footer-icons"
                height={50}
                width={144}
              />
            </Box>
            <Box
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                marginTop: '5px',
                color: '#000000',
                textAlign: 'right',
              }}
            >
              Privacy Guidelines
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 2,
        }}
      >
        <Box width="100%">
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              color: '#000000',
              textAlign: 'center',
            }}
          >
            © 2024 Pratham
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
