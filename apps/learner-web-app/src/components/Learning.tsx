'use client';

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@mui/material';
import { Box } from '@mui/material';
import { Grid } from '@mui/material';
import React, { useState } from 'react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Learning = ({
  data,
  descriptions,
  aboutDescriptionStyle = false,
}: {
  data: any;
  descriptions: any;
  aboutDescriptionStyle?: boolean;
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Grid container spacing={4}>
      {['School', 'Work', 'Life'].map((pillar, index) => (
        <Grid
          item
          xs={12}
          md={4}
          key={pillar}
          sx={{ position: 'relative', minHeight: 350 }}
        >
          <Box
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            sx={{
              height: '100%',
              marginTop: '20px',
              position: 'relative',
            }}
          >
            {/* Default Card Content */}
            <Box
              sx={{
                background: `url(/images/pillar-${
                  index + 1
                }.png) no-repeat center center`,
                backgroundSize: 'cover',
                height: '273px',
                '@media (min-width: 900px)': {
                  display: hovered === index ? 'none' : 'flex',
                },
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                borderRadius: '12px',
                transition: 'all 0.3s',
              }}
            >
              <Box
                sx={{
                  mt: 2,
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: '28px',
                  lineHeight: '36px',
                  letterSpacing: '0px',
                  textAlign: 'center',
                  color: '#fff',
                  '@media (max-width: 900px)': {
                    fontSize: '19px',
                  },
                }}
              >
                Learning for
              </Box>
              <Box
                sx={{
                  mt: 1,
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: '45px',
                  lineHeight: '52px',
                  letterSpacing: '0px',
                  textAlign: 'center',
                  color: '#FDBE16',
                  '@media (max-width: 900px)': {
                    fontSize: '31px',
                  },
                }}
              >
                {pillar}
              </Box>
            </Box>

            {/* Hover Card Overlay */}
            {hovered === index && (
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  bgcolor: '#fff',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  borderRadius: '12px',
                  zIndex: 10,
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  '@media (max-width: 900px)': {
                    display: 'none',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '14px',
                    color: '#7C766F',
                    mb: 2,
                    letterSpacing: '1px',
                  }}
                >
                  KEY THEMES
                </Typography>
                {data[index].map((theme: any) => (
                  <Box key={theme.title} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '18px',
                        lineHeight: '24px',
                        letterSpacing: '0.15px',
                        color: '#F17B06',
                      }}
                    >
                      {theme.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        letterSpacing: '0.25px',
                        color: '#635E57',
                      }}
                    >
                      {theme.desc}
                    </Typography>
                  </Box>
                ))}
                <Box
                  sx={{
                    mt: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Poppins',
                      fontWeight: 500,
                      fontSize: '18px',
                      lineHeight: '24px',
                      letterSpacing: '0.15px',
                      color: '#0D599E',
                      cursor: 'pointer',
                    }}
                  >
                    View All
                  </Typography>
                  <ArrowForwardIcon
                    sx={{ fontSize: '25px', color: '#0D599E' }}
                  />
                </Box>
              </Box>
            )}

            {/* Description below the card */}
            {aboutDescriptionStyle ? (
              <Box sx={{ mt: '20px', textAlign: 'left' }}>
                {Array.isArray(descriptions[index]) ? (
                  <>
                    {/* First line - normal text */}
                    <Box
                      sx={{
                        fontWeight: 400,
                        fontSize: '16px',
                        color: '#7C766F',
                        fontFamily: 'Poppins',
                        mb: '8px',
                      }}
                    >
                      {typeof descriptions[index][0] === 'object'
                        ? descriptions[index][0].cardDesc
                        : descriptions[index][0]}
                    </Box>
                    {/* All three description lines with their headings */}
                    {descriptions[index]
                      .slice(1)
                      .map((desc: string, i: number) => (
                        <Box key={i}>
                          {/* Heading for each description */}
                          <Box
                            sx={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#1F1B13',
                              fontFamily: 'Poppins',
                              mb: '2px',
                              mt: i > 0 ? '16px' : '0',
                            }}
                          >
                            Heading
                          </Box>
                          {/* Description text */}
                          <Box
                            sx={{
                              fontWeight: 400,
                              fontSize: '16px',
                              color: '#7C766F',
                              fontFamily: 'Poppins',
                            }}
                          >
                            {desc}
                          </Box>
                        </Box>
                      ))}
                  </>
                ) : (
                  <Box
                    sx={{
                      fontWeight: 400,
                      fontSize: '16px',
                      color: '#7C766F',
                      fontFamily: 'Poppins',
                    }}
                  >
                    {descriptions[index]}
                  </Box>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.5px',
                  color: '#7C766F',
                  marginTop: '20px',
                  '@media (max-width: 900px)': {
                    fontSize: '11px',
                  },
                }}
              >
                {descriptions[index]}
              </Box>
            )}

            <Box
              sx={{
                '@media (min-width: 900px)': {
                  display: 'none',
                },
                boxShadow: '0px 3.89px 7.78px 2.92px #00000026',
                borderRadius: '12px',
                mt: 2,
                backgroundColor: '#fff',
              }}
            >
              <Accordion
                // defaultExpanded
                sx={{
                  boxShadow: 'none',
                  bgcolor: 'transparent',
                  borderRadius: '8px',
                  '&:before': { display: 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDownIcon />}
                  aria-controls="key-themes-content"
                  id="key-themes-header"
                  sx={{
                    minHeight: 48,
                    borderRadius: '8px',
                    px: 2.5,
                    py: 1.5,
                    bgcolor: '#fff',
                    fontFamily: 'Poppins',
                    fontWeight: 600,
                    fontSize: '16px',
                    color: '#7C766F',
                    letterSpacing: '1px',
                  }}
                >
                  KEY THEMES
                </AccordionSummary>
                <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2 }}>
                  {data[0].map((theme: any) => (
                    <Box key={theme.title} sx={{ mb: 2 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 600,
                          fontSize: '17px',
                          color: '#F17B06',
                          mb: 0.2,
                        }}
                      >
                        {theme.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '14px',
                          color: '#7C766F',
                        }}
                      >
                        {theme.desc}
                      </Typography>
                    </Box>
                  ))}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1,
                      cursor: 'pointer',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#0D599E',
                        mr: 1,
                      }}
                    >
                      View All
                    </Typography>
                    <ArrowForwardIcon
                      sx={{ fontSize: '20px', color: '#0D599E' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Learning;
