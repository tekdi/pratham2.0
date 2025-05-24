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
import Learning from '@learner/components/Learning';
import Image from 'next/image';
import AccessibilityOptions from '@learner/components/AccessibilityOptions/AccessibilityOptions';
import SpeechAwareTooltip from '@learner/components/textToSpeech/SpeechAwareTooltip';
import SpeakableText from '@learner/components/textToSpeech/SpeakableText';

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
const descriptions = [
  `
  Learning for School focuses on scholastic subjects, which include early years education and learning to read, write, and think. These skills are crucial for building children's confidence and dignity among their peers.
  `,
  'Learning for Work equips adolescents and youth with the skills and knowledge needed for employment and livelihoods.',
  'Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.',
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
    { src: '/images/website-1.png', alt: 'UBS' },
    { src: '/images/Websites-2.png', alt: 'Education Above All' },
    { src: '/images/website-3.png', alt: 'Sulzer' },
    { src: '/images/website-4.png', alt: 'Schmidt Futures' },
  ];

  return (
    <Layout onlyHideElements={['footer']}>
      <AccessibilityOptions />
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
              variant="body3"
              component="h1"
              sx={{
                fontWeight: 800,
                // fontSize: '72px',
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
              <SpeakableText>Pratham</SpeakableText>
            </Typography>
            <Typography
              variant="body3"
              component="h1"
              sx={{
                fontWeight: 800,
                // fontSize: '72px',
                lineHeight: '110%',
                letterSpacing: '0%',
                color: '#FDBE16',
                '@media (max-width: 900px)': {
                  fontSize: '40px',
                  marginLeft: '60px',
                },
              }}
            >
              <SpeakableText>Open School</SpeakableText>
            </Typography>

            <Typography
              variant="body4"
              component="h1"
              sx={{
                my: 2,
                fontFamily: 'Poppins',
                fontWeight: 400,
                lineHeight: '36px',
                letterSpacing: '0px',
                color: '#1F1B13',
                mt: 2,
                '@media (max-width: 900px)': {
                  fontSize: '16px',
                },
              }}
            >
              <SpeakableText>
                Opening doors to knowledge and skills
              </SpeakableText>
            </Typography>

            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 400,
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
              <SpeakableText>In 15 languages</SpeakableText>
            </Typography>

            <Typography
              variant="body5"
              component="h1"
              sx={{
                mb: 3,
                fontFamily: 'Poppins',
                fontWeight: 400,
                // fontSize: '18px',
                // lineHeight: '24px',
                letterSpacing: '0.5px',
                color: '#1F1B13',
                mt: 3,
                '@media (max-width: 900px)': {
                  fontSize: '16px',
                },
              }}
            >
              <SpeakableText>
                Pratham Open School offers free, downloadable videos, games,
                reading material and stories in 15 languages for ages 1 to 18+,
                designed to support self-led learning and group learning through
                activities and projects.
              </SpeakableText>
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
                <SpeakableText>Search</SpeakableText>
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
          variant="body6"
          component="h3"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '36px',
            lineHeight: '64px',
            letterSpacing: '-0.25px',
            color: '#1F1B13',
            textAlign: 'center',
            '@media (max-width: 900px)': {
              fontSize: '22px',
            },
          }}
        >
          <SpeakableText>Our Learning Pillars</SpeakableText>
        </Typography>
        <Learning data={keyThemesList} descriptions={descriptions} />
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
          <Typography
            variant="body7"
            component="h1"
            sx={{
              // fontFamily: 'Poppins',
              fontWeight: 700,
              // fontSize: '46px',
              // lineHeight: '100%',
              letterSpacing: '-0.25px',
              textAlign: 'center',
              color: '#1F1B13',
              '@media (max-width: 900px)': {
                fontSize: '24px',
              },
            }}
          >
            <SpeakableText>3524</SpeakableText>
          </Typography>
          <Typography
            variant="body8"
            component="h1"
            sx={{
              fontWeight: 400,
              // fontSize: '24px',
              // lineHeight: '32px',
              letterSpacing: '0px',
              textAlign: 'center',
              color: '#1F1B13',
              mt: 1.5,
              '@media (max-width: 900px)': {
                mt: 0,
              },
            }}
          >
            <SpeakableText>Total Resources</SpeakableText>
          </Typography>
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
                  variant="body6"
                  component="h1"
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
                  <SpeakableText>{item.value}</SpeakableText>
                </Typography>
                <Typography
                  variant="body8"
                  component="h1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    // fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#1F1B13',
                    '@media (max-width: 900px)': {
                      fontSize: '16px',
                    },
                  }}
                >
                  <SpeakableText>{item.label}</SpeakableText>
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      {/* Featured Gallery section  */}

      <Box>
        <Typography
          variant="body7"
          component="h1"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '46px',
            lineHeight: '100%',
            letterSpacing: '-0.25px',
            textAlign: 'center',
            mt: 5,
          }}
        >
          <SpeakableText>Featured Gallery</SpeakableText>
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
          variant="body6"
          component="h1"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '36px',
            // lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            mt: 4,
          }}
        >
          <SpeakableText>What's New</SpeakableText>
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
        <Grid container spacing={3} sx={{ alignItems: 'center' }}>
          <Grid item xs={12} md={5}>
            <Typography
              variant="body6"
              component="h1"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                // fontSize: '36px',
                // lineHeight: '44px',
                letterSpacing: '0px',
                color: '#1F1B13',
                '@media (max-width: 900px)': {
                  fontSize: '22px',
                  lineHeight: '30px',
                  textAlign: 'center',
                },
              }}
            >
              <SpeakableText>
                More Ways to Learn – Check Out Our Products!
              </SpeakableText>
            </Typography>
          </Grid>
          <Grid item xs={12} md={7}>
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
          variant="body6"
          component="h1"
          sx={{
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
          <SpeakableText>Knowledge Partners</SpeakableText>
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
          variant="body6"
          component="h1"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
            '@media (max-width: 900px)': {
              fontSize: '22px',
            },
          }}
        >
          <SpeakableText>Our Partners</SpeakableText>
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
          <SpeakableText>Other Websites</SpeakableText>
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
