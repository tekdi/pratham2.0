'use client';

import React from 'react';
import { Box, Container, Typography, Link, Stack } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      className='bs-px-5 bs-pt-3 bs-pb-3'
      sx={{
        backgroundColor: '#fff',
        borderTop: '1px solid',
        borderColor: (theme) => theme.palette.divider,
      }}
    >
      <Box>
        <Box>
          <Box
            mb={1}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <img
              height={'34px'}
              width={'104px'}
              src="/images/pradigi1.png"
              alt="PraDigi"
            // height={40}
            />
            <Box
              sx={{
                mt: { xs: 2, md: 0 },
                textAlign: { xs: 'center', md: 'right' },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', sm: '15px', md: '16px' },
                    fontWeight: 400,
                    color: '#000000',
                    lineHeight: 1.3,
                  }}
                >
                  Experimento India is a part of Project Jigyaasa.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: '13px', sm: '14px' },
                fontWeight: 400,
                color: '#000000',
                textAlign: { xs: 'center', sm: 'left' },
                mb: { xs: 1, sm: 0 },
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Useful links:
            </Typography>
            <Box
              sx={{
                display: 'flex',

                flexWrap: 'wrap',
                gap: { xs: 0.5, sm: 1 },
                alignItems: { xs: 'flex-start', sm: 'center' },
              }}
            >
              {[
                { text: 'Pratham', href: 'https://www.pratham.org/' },
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
                    sx={{
                      fontSize: { xs: '11px', sm: '12px' },
                      fontWeight: 400,
                      color: '#000000',
                      lineHeight: { xs: 1.4, sm: 1.2 },
                    }}
                  >
                    {link.text}
                  </Link>
                  {index < arr.length - 1 && (
                    <Typography color="text.secondary">|</Typography>
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Box
              sx={{
                fontSize: { xs: '11px', sm: '12px' },
                fontWeight: 400,
                color: '#000000',
                marginTop: '10px !important',
              }}
            >
              All resources on the website are licensed under a CC-BY-NC-SA 4.0
              or CC-BY-SA 4.0 International License. Please refer to individual
              content to find more.
            </Box>
            <Box>
              <Box
                sx={{
                  mt: { xs: 2, sm: 0, md: 0 },
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'end' },
                }}
              >
                <img
                  src="/images/footer-icons.png"
                  alt="footer-icons"
                  width={104}
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </Box>
              <Box
                sx={{
                  fontSize: { xs: '10px', sm: '10px', md: '10px' },
                  fontWeight: 400,
                  marginTop: '5px',
                  color: '#000000',
                  textAlign: { xs: 'center', md: 'right' },
                }}
              >
                Privacy Guidelines
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: { xs: 1, md: 1 },
        }}
      >
        <Box width="100%">
          <Typography
            sx={{
              fontSize: { xs: '12px', sm: '12px', md: '12px' },
              fontWeight: 400,
              color: '#000000',
              textAlign: 'center',
            }}
          >
            © 2025 Pratham
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
