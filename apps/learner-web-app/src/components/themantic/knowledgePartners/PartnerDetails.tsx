'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { scaledFontSize } from '@learner/utils/scaledFontSize';
import Layout from '../layout/Layout';
import SubHeader from '../subHeader/SubHeader';
import PartnerImage from './PartnerImage';
import { KnowledgePartner } from './partnersData';

const bodyTextSx = {
  fontSize: scaledFontSize(16),
  color: '#444',
  lineHeight: 1.7,
};

const PartnerDetails = ({ partner }: { partner: KnowledgePartner }) => (
  <Layout>
    <SubHeader showFilter={false} showSearch={false} />
    <Box
      sx={{
        backgroundImage: `url('/images/mainpagebig.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        py: '48px',
      }}
    >
      <Box className="bs-container bs-px-5">
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '6px',
            px: 2,
            py: 1.25,
            mb: 2,
          }}
        >
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
            sx={{ fontSize: scaledFontSize(14) }}
          >
            <Link
              component={NextLink}
              href="/themantic"
              underline="always"
              sx={{ color: 'secondary.main', fontSize: 'inherit' }}
            >
              <SpeakableText>Home</SpeakableText>
            </Link>
            <Typography sx={{ fontSize: 'inherit', color: '#555' }}>
              <SpeakableText>Knowledge Partners</SpeakableText>
            </Typography>
            <Typography
              sx={{ fontSize: 'inherit', color: '#000', fontWeight: 600 }}
            >
              <SpeakableText>{partner.name}</SpeakableText>
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '6px',
            p: { xs: 2.5, sm: 3.5, md: 5 },
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: scaledFontSize(30),
              fontWeight: 700,
              color: '#000',
              textTransform: 'uppercase',
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
          >
            <SpeakableText>{partner.name}</SpeakableText>
          </Typography>
          <Typography
            sx={{
              fontSize: scaledFontSize(15),
              fontWeight: 600,
              color: '#212529',
              mt: 0.75,
            }}
          >
            <SpeakableText>{partner.partnerType}</SpeakableText>
          </Typography>

          <Box sx={{ pt: 6 }}>
            <Grid container rowSpacing={3} columnSpacing={{ xs: 3, md: 5 }}>
              <Grid item xs={12} sm={5} md={3.5} lg={3}>
                <PartnerImage
                  partner={partner}
                  sx={{
                    height: { xs: 240, md: 310 },
                    border: '1px solid rgba(0, 0, 0, .125)',
                    borderRadius: '2px',
                  }}
                />
                {partner.website && (
                  <Button
                    fullWidth
                    variant="contained"
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      mt: 1.5,
                      py: 1.25,
                      backgroundColor: '#3A8DDB',
                      color: '#fff',
                      borderRadius: '4px',
                      boxShadow: 'none',
                      textTransform: 'none',
                      fontSize: scaledFontSize(15),
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'secondary.main',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Visit website ↗
                  </Button>
                )}
              </Grid>

              <Grid item xs={12} sm={7} md={8.5} lg={9}>
                {partner.descriptor && (
                  <Typography
                    sx={{
                      fontSize: scaledFontSize(15),
                      color: '#6c757d',
                      pb: 1.5,
                      mb: 2,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    <SpeakableText>{partner.descriptor}</SpeakableText>
                  </Typography>
                )}

                {partner.about.map((paragraph) => (
                  <Typography key={paragraph} sx={{ ...bodyTextSx, mb: 1.5 }}>
                    <SpeakableText>{paragraph}</SpeakableText>
                  </Typography>
                ))}

                {partner.contributions && (
                  <>
                    <Typography
                      component="h2"
                      sx={{
                        ...bodyTextSx,
                        fontWeight: 600,
                        color: '#212529',
                        mt: 2,
                      }}
                    >
                      <SpeakableText>
                        Contribution to the Education Sector:
                      </SpeakableText>
                    </Typography>
                    <Box component="ul" sx={{ pl: 3, my: 1 }}>
                      {partner.contributions.map((item) => (
                        <Typography component="li" key={item} sx={bodyTextSx}>
                          <SpeakableText>{item}</SpeakableText>
                        </Typography>
                      ))}
                    </Box>
                  </>
                )}

                {partner.summary && (
                  <Typography sx={{ ...bodyTextSx, mb: 1.5 }}>
                    <SpeakableText>{partner.summary}</SpeakableText>
                  </Typography>
                )}

                {partner.expertise.length > 0 && (
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}
                  >
                    {partner.expertise.map((area) => (
                      <Chip
                        key={area}
                        label={area}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderColor: '#A9CBEB',
                          color: '#1F6FB8',
                          fontSize: scaledFontSize(13),
                          fontWeight: 600,
                          height: 'auto',
                          py: 0.5,
                          '& .MuiChip-label': { whiteSpace: 'normal' },
                        }}
                      />
                    ))}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  </Layout>
);

export default PartnerDetails;
