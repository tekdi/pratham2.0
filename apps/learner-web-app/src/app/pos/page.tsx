'use client';
import React, { useState } from 'react';
import Layout from '@learner/components/pos/Layout';

import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FeautureCarousel from '@learner/components/FeautureCarousel';
import WhatsNewCarousel from '@learner/components/WhatsNewCarousel';
import MoreWayCarousel from '@learner/components/MoreWayCarousel';
import KnwoledgeCarousel from '@learner/components/KnwoledgeCarousel';
import OtherWebsiteCarousel from '@learner/components/OtherWebsiteCarousel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Image from 'next/image';

const keyThemesList = [
  [
    {
      title: 'Academics',

      desc: 'Math, Science, English...',
    },
    {
      title: 'Growth & Learning',

      desc: 'Activity Videos, Stories, Riddles...',
    },
    {
      title: 'Media Moments',

      desc: 'TV Episodes, Podcasts...',
    },
    {
      title: 'Inclusive Education',

      desc: 'Innovative Strategies, Subject-specific...',
    },
  ],
  [
    {
      title: 'Career Skills',

      desc: 'Resume, Interview, Communication...',
    },
    {
      title: 'Entrepreneurship',

      desc: 'Startups, Business Ideas, Finance...',
    },
    {
      title: 'Digital Literacy',

      desc: 'Computers, Internet, Safety...',
    },
    {
      title: 'Professional Growth',

      desc: 'Leadership, Teamwork, Projects...',
    },
  ],
  [
    {
      title: 'Life Skills',

      desc: 'Critical Thinking, Problem Solving...',
    },
    {
      title: 'Health & Wellness',

      desc: 'Nutrition, Exercise, Mindfulness...',
    },
    {
      title: 'Civic Awareness',
      desc: 'Rights, Responsibilities, Community...',
    },
    {
      title: 'Creativity',

      desc: 'Art, Music, Innovation...',
    },
  ],
];

const page = () => {
  const partners = [
    { src: '/images/knowledge-one.png', alt: 'UBS' },
    { src: '/images/knowdlege-two.png', alt: 'Education Above All' },
    { src: '/images/knowledge-three.png', alt: 'Sulzer' },
    { src: '/images/knowledge-four.png', alt: 'Schmidt Futures' },
    { src: '/images/knowledge-five.png', alt: 'Western Digital' },
    { src: '/images/knowledge-one.png', alt: 'UBS' },
    { src: '/images/knowdlege-two.png', alt: 'Education Above All' },
    { src: '/images/knowledge-three.png', alt: 'Sulzer' },
    { src: '/images/knowledge-four.png', alt: 'Schmidt Futures' },
    { src: '/images/knowledge-five.png', alt: 'Western Digital' },
  ];
  const ourPartners = [
    { src: '/images/knowdlege-two.png', alt: 'Education Above All' },
    { src: '/images/knowledge-one.png', alt: 'UBS' },
    { src: '/images/knowledge-four.png', alt: 'Schmidt Futures' },
    { src: '/images/knowledge-three.png', alt: 'Sulzer' },
    { src: '/images/knowledge-one.png', alt: 'UBS' },
    { src: '/images/knowdlege-two.png', alt: 'Education Above All' },
    { src: '/images/knowledge-five.png', alt: 'Western Digital' },
    { src: '/images/knowledge-four.png', alt: 'Schmidt Futures' },
    { src: '/images/knowledge-five.png', alt: 'Western Digital' },
    { src: '/images/knowledge-three.png', alt: 'Sulzer' },
  ];
  const otherWebsites = [
    { src: '/images/knowledge-one.png', alt: 'UBS' },
    { src: '/images/knowdlege-two.png', alt: 'Education Above All' },
    { src: '/images/knowledge-three.png', alt: 'Sulzer' },
    { src: '/images/knowledge-four.png', alt: 'Schmidt Futures' },
  ];

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Layout onlyHideElements={['footer']}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Image
            src="/images/home-page-banner.png"
            alt="Happy children learning together"
            layout="responsive"
            width={1000}
            height={568}
            style={{ width: '100%', height: '568px' }}
          />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            '@media (max-width: 900px)': {
              marginTop: '-90px',
            },
          }}
        >
          <Box sx={{ p: 3, '@media (max-width: 900px)': { px: '16px' } }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: '72px',
                lineHeight: '110%',
                letterSpacing: '0%',
                color: '#1F1B13',
                '@media (min-width: 900px)': {
                  marginLeft: '-120px',
                },
                '@media (max-width: 900px)': {
                  fontSize: '40px',
                },
              }}
            >
              Pratham
            </Typography>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: '72px',
                lineHeight: '110%',
                letterSpacing: '0%',
                color: '#FDBE16',
                '@media (max-width: 900px)': {
                  fontSize: '40px',
                  marginLeft: '60px',
                },
              }}
            >
              Open School
            </Typography>

            <Typography
              variant="h5"
              component="h2"
              sx={{
                my: 2,
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '28px',
                lineHeight: '36px',
                letterSpacing: '0px',
                color: '#1F1B13',
                mt: 2,
                '@media (max-width: 900px)': {
                  fontSize: '16px',
                },
              }}
            >
              Opening doors to knowledge and skills
            </Typography>

            <Box
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '22px',
                lineHeight: '28px',
                letterSpacing: '0px',
                color: '#1F1B13',
                background:
                  'linear-gradient(87.94deg, #E9A416 -32.81%, #FBCC4C 22.95%, #FDE6AA 77.57%)',
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '8px',
                mt: 1,
                '@media (max-width: 900px)': {
                  fontSize: '16px',
                },
              }}
            >
              In 15 languages
            </Box>

            <Typography
              variant="body1"
              sx={{
                mb: 3,
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '18px',
                lineHeight: '24px',
                letterSpacing: '0.5px',
                color: '#1F1B13',
                mt: 3,
                '@media (max-width: 900px)': {
                  fontSize: '16px',
                },
              }}
            >
              Description about Open School here. A place where learning has no
              limits. Whether you're here to explore new subjects, revisit past
              lessons.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#F5F5F5',
                borderRadius: '8px',
                boxShadow: '0px 1px 2px 0px #0000004D',
                mx: 'auto',
                mt: 4,
              }}
            >
              <SearchIcon sx={{ color: '#757575', ml: 2, mr: 1 }} />
              <TextField
                variant="standard"
                placeholder="Search.."
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontFamily: 'Poppins',
                    fontSize: '18px',
                    pl: 1,
                    bgcolor: 'transparent',
                  },
                }}
                sx={{ flexGrow: 1, bgcolor: 'transparent' }}
              />
              <Button
                variant="contained"
                sx={{
                  bgcolor: '#FDBE16',
                  color: '#1F1B13',
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px',
                  boxShadow: 'none',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  fontSize: '16px',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#e9a416' },
                  '@media (max-width: 900px)': {
                    fontSize: '14px',
                  },
                }}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          mx: 7,
          boxShadow: '1px 0px 16px 0px #00000026',
          backgroundColor: '#F1F2F2',
          p: '32px',
          marginTop: '-60px',
          zIndex: 1000,
          position: 'relative',
          '@media (max-width: 900px)': {
            mx: '16px',
            marginTop: '20px',
          },
        }}
      >
        <Typography
          variant="h4"
          component="h3"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '64px',
            letterSpacing: '-0.25px',
            color: '#1F1B13',
            textAlign: 'center',
            '@media (max-width: 900px)': {
              fontSize: '22px',
            },
          }}
        >
          Our Learning Pillars
        </Typography>
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
                      top: 0,
                      left: 0,
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
                    {keyThemesList[index].map((theme) => (
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
                  Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut
                  elit tellus, luctus nec llamcorper mattis, pulvinar dapibus
                  leo. ullamcorper mattis, pulvinar dapibus leo.
                </Box>

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
                    defaultExpanded
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
                      {keyThemesList[0].map((theme) => (
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
      </Box>

      {/* Total Resources section  */}

      <Box sx={{ marginTop: '50px' }}>
        <Box
          sx={{
            '@media (max-width: 900px)': {
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              justifyContent: 'center',
            },
          }}
        >
          <Box
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: '46px',
              lineHeight: '100%',
              letterSpacing: '-0.25px',
              textAlign: 'center',
              color: '#1F1B13',
              '@media (max-width: 900px)': {
                fontSize: '24px',
              },
            }}
          >
            3524
          </Box>
          <Box
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '24px',
              lineHeight: '32px',
              letterSpacing: '0px',
              textAlign: 'center',
              color: '#1F1B13',
              mt: 1.5,
              '@media (max-width: 900px)': {
                mt: 0,
              },
            }}
          >
            Total Resources
          </Box>
        </Box>

        {/* Resource Stats Section */}
        <Container>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 2, mb: 2 }}
          >
            {[
              { value: 230, label: 'Videos' },
              { value: 1700, label: 'Stories' },
              { value: 512, label: 'Games' },
              { value: 781, label: 'Audios' },
              { value: 562, label: 'Other Formats' },
              { value: 15, label: 'Languages' },
            ].map((item, idx) => (
              <Grid
                item
                xs={6}
                sm={6}
                md={4}
                lg={2}
                key={item.label}
                sx={{ textAlign: 'center' }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: '44px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#F17B06',
                    '@media (max-width: 900px)': {
                      fontSize: '24px',
                    },
                  }}
                >
                  {item.value}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#1F1B13',
                    '@media (max-width: 900px)': {
                      fontSize: '16px',
                    },
                  }}
                >
                  {item.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Featured Gallery section  */}

      <Box>
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '46px',
            lineHeight: '100%',
            letterSpacing: '-0.25px',
            textAlign: 'center',
            mt: 5,
          }}
        >
          Featured Gallery
        </Typography>

        <Box
          sx={{
            mt: 1,
          }}
        >
          <FeautureCarousel />
        </Box>
      </Box>

      {/* What's New */}
      <Box>
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            mt: 4,
          }}
        >
          What's New
        </Typography>

        <Box>
          <WhatsNewCarousel />
        </Box>

        {/* More way to Learn */}
      </Box>
      <Box
        sx={{
          mt: 8,
          mx: 7,
          '@media (max-width: 900px)': {
            mx: '16px',
          },
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                fontSize: '36px',
                lineHeight: '44px',
                letterSpacing: '0px',
                color: '#1F1B13',
                '@media (max-width: 900px)': {
                  fontSize: '22px',
                  lineHeight: '30px',
                  textAlign: 'center',
                },
              }}
            >
              More Ways to Learn – Check Out Our Products!
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <MoreWayCarousel />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          mt: 7,
          mx: 7,
          '@media (max-width: 900px)': {
            mx: '16px',
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
            '@media (max-width: 900px)': {
              fontSize: '22px',
            },
          }}
        >
          Knowledge Partners
        </Typography>

        <Container maxWidth="xl">
          <Box sx={{ mt: 3 }}>
            <KnwoledgeCarousel images={partners} />
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          mt: 7,
          mx: 7,
          '@media (max-width: 900px)': {
            mx: '16px',
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
            '@media (max-width: 900px)': {
              fontSize: '22px',
            },
          }}
        >
          Our Partners
        </Typography>

        <Container maxWidth="xl">
          <Box sx={{ mt: 3 }}>
            <KnwoledgeCarousel images={ourPartners} />
          </Box>
        </Container>
      </Box>

      <Box
        sx={{
          mt: 7,
          mx: 7,
          '@media (max-width: 900px)': {
            mx: '16px',
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
            '@media (max-width: 900px)': {
              fontSize: '22px',
            },
          }}
        >
          Other Websites
        </Typography>

        <Container maxWidth="xl">
          <Box sx={{ mt: 3 }}>
            <OtherWebsiteCarousel images={otherWebsites} />
          </Box>
        </Container>
      </Box>
    </Layout>
  );
};

export default page;
