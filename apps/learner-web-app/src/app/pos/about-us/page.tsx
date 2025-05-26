'use client';
import React from 'react';
import Layout from '@learner/components/pos/Layout';
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/material';
import Learning from '@learner/components/Learning';
import Image from 'next/image';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';

const AboutUsPage = () => {
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
    [
      {
        cardDesc:
          'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
      },
      'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
      'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
    ],
    [
      {
        cardDesc:
          'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
      },
      'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
      ' Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
    ],
    [
      {
        cardDesc:
          'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
      },
      'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
      'Lorem ipsum dolor sit amet, consectetur dipiscing elit. Ut elit tellus, luctus nec llamcorper mattis, pulvinar dapibus leo. ullamcorper mattis, pulvinar dapibus leo.',
    ],
  ];
  return (
    <Layout>
      <Box sx={{ background: '#F3F3F3' }}>
        <Box
          sx={{
            width: '100%',
            height: '400px',
            backgroundImage: 'url(/images/about-banner.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              variant="body8"
              component="h1"
              sx={{
                fontWeight: 700,
                // fontSize: { xs: '16px', md: '24px' },
                // lineHeight: { xs: '24px', md: '44px' },
                letterSpacing: '0px',
                textAlign: 'center',
                color: '#FFF',
              }}
            >
              <SpeakableText>About Us</SpeakableText>
            </Typography>
            <Typography
              variant="body6"
              component="h1"
              sx={{
                fontWeight: 700,
                // fontSize: { xs: '22px' }, //md: '36px'
                letterSpacing: '-0.25px',
                textAlign: 'center',
                color: '#FDBE16',
              }}
            >
              <SpeakableText>
                One liner - Highlight POS as a Pradigi Product
              </SpeakableText>
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            background: 'url(/images/bg-img.png) no-repeat center center',
            padding: { xs: '60px 16px 10px', md: '60px 40px 10px' },
            backgroundSize: 'cover',
          }}
        >
          <Grid container spacing={3} sx={{ alignItems: 'center' }}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="body9"
                component="h1"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 600,
                  // fontSize: { xs: '22px', md: '32px' },
                  // lineHeight: { xs: '28px', md: '100%' },
                  letterSpacing: '0px',
                  color: '#1F1B13',
                }}
              >
                <SpeakableText>
                  Some more information about POS as a Pradigi Product
                </SpeakableText>
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  // fontSize: { xs: '14px', md: '16px' },
                  // lineHeight: { xs: '20px', md: '24px' },
                  letterSpacing: '0.5px',
                  color: '#1F1B13',
                  mt: 2,
                }}
              >
                <SpeakableText>
                  Pratham undertook an exploratory study for children to
                  understand the problem of plastic waste management in rural
                  India. This study is a part of Pratham's Learning for Life
                  curriculum. In this study, we covered 8400 households, in 700
                  villages across 70 districts, in 15 states. Findings to be
                  released in July 2022.
                </SpeakableText>
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  // fontSize: { xs: '14px', md: '16px' },
                  // lineHeight: { xs: '20px', md: '24px' },
                  letterSpacing: '0.5px',
                  color: '#1F1B13',
                  mt: 2,
                }}
              >
                <SpeakableText>
                  Pratham undertook an exploratory study for children to
                  understand the problem of plastic waste management in rural
                  India. This study is a part of Pratham's Learning for Life
                  curriculum.
                </SpeakableText>
              </Typography>
              <Typography
                variant="h2"
                component="h2"
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  // fontSize: { xs: '14px', md: '16px' },
                  // lineHeight: { xs: '20px', md: '24px' },
                  letterSpacing: '0.5px',
                  color: '#1F1B13',
                  mt: 2,
                }}
              >
                <SpeakableText>
                  Pratham undertook an exploratory study for children to
                  understand the problem of plastic waste management in rural
                  India. This study is a part of Pratham's Learning for Life
                  curriculum.
                </SpeakableText>
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                }}
              >
                <img
                  style={{ width: '100%', height: '410px' }}
                  src="/images/about-second-banner.png"
                  alt="About Us"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* Title Here About 3 Pillars */}
        <Box
          sx={{
            background: '#ffff',
            padding: { xs: '30px 16px', md: '30px 40px' },
            mx: { xs: '16px', md: 7 },
            mt: 8,
          }}
        >
          <Box
            sx={{
              background: '#FDBE16',
              padding: '4px 8px',
              borderRadius: '10px',
              margin: '22px auto 0',
              width: 'fit-content',
            }}
          >
            <Typography
              variant="body9"
              component="h2"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                // fontSize: { xs: '22px', md: '32px' },
                // lineHeight: { xs: '28px', md: '40px' },
                letterSpacing: '0px',
                textAlign: 'center',
                color: '#1F1B13',
              }}
            >
              <SpeakableText>Title Here About 3 Pillars</SpeakableText>
            </Typography>
          </Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              // fontSize: { xs: '14px', md: '22px' },
              // lineHeight: { xs: '20px', md: '28px' },
              letterSpacing: '0px',
              textAlign: 'center',
              color: '#635E57',
              mt: 2,
            }}
          >
            <SpeakableText>
              Any subtext, if required can be displayed to give more information
            </SpeakableText>
          </Typography>

          <Box sx={{ mt: 6 }}>
            <Learning
              data={keyThemesList}
              descriptions={descriptions}
              aboutDescriptionStyle={true}
            />
          </Box>
        </Box>

        <Box
          sx={{
            background: '#fff',
            padding: '30px 40px',
            mx: { xs: '16px', md: 7 },
            mt: 12,
          }}
        >
          <Box
            sx={{
              background: '#FDBE16',
              padding: '4px 8px',
              borderRadius: '10px',
              margin: '22px auto 0',
              width: 'fit-content',
            }}
          >
            <Typography
              variant="body9"
              component="h2"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 600,
                // fontSize: '32px',
                // lineHeight: '40px',
                letterSpacing: '0px',
                textAlign: 'center',
                color: '#1F1B13',
              }}
            >
              <SpeakableText>Pratham Education Foundation</SpeakableText>
            </Typography>
          </Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              // fontSize: '22px',
              // lineHeight: '32px',
              letterSpacing: '0px',
              textAlign: 'center',
              color: '#635E57',
              mt: 2,
            }}
          >
            <SpeakableText>
              Pratham Education Foundation (Pratham) is one of the largest NGOs
              in India, with a record of innovative, rigorously evaluated
              programs. With a history spanning 30 years, Pratham's journey
              began with pre-school initiatives in the urban slums of Mumbai.
              Today, Pratham offers tailored programs for preschool and
              elementary school age groups, women and older women, and youth.
              Working directly with communities as well as through large-scale
              collaborations with government systems, Pratham reaches millions
              of lives every year.
            </SpeakableText>
          </Typography>
          <Box
            sx={{
              mt: 3,
            }}
          >
            {[
              {
                icon: '/images/edu-icon-one.png',
                title: 'Dedicated To Large-Scale Change',
                description:
                  'The mission to improve the quality of education in India and ensure that all children not only attend but also thrive in school is being accomplished by working in collaboration with the government, local communities, parents, teachers, volunteers, and civil society members. Our programs aim to supplement rather than replace governmental efforts. They are implemented on a large scale to not only reach as many children as possible, but also to create an adoptable demonstration model for state governments.',
              },
              {
                icon: '/images/edu-icon-two.png',
                title: 'A Focus on Innovation',
                description:
                  "Pratham's strategies reconfigure teaching methodologies, break down traditional tactics, and challenge the current rote learning mechanisms in our schools. Our programs are innovative and outcome-driven. In its early years Pratham developed innovative teaching-learning approaches, materials, and measurement methods. In 2005, we pioneered a nationwide survey of schooling and learning that has had a major impact on national and international policy discussions.",
              },
              {
                icon: '/images/edu-icon-three.png',
                title: 'Low-Cost, Replicable Models',
                description:
                  'Pratham has worked to develop low-cost, replicable models that can easily spread and be adopted by other organizations. Thousands of volunteers work with Pratham to implement learning interventions at the grassroots level. These volunteers are mobilized, trained, and monitored by the Pratham team. They are also provided with teaching-learning material and books developed by Pratham. Not only does this ensure more effective implementation of the programs, but it also helps to build an infrastructure focused on providing quality education to children.',
              },
              {
                icon: '/images/edu-icon-four.png',
                title: 'Programs Results and Accountability',
                description:
                  'All programs are designed to ensure that learning levels in schools and communities increase, education reaches all children who are in school or unable to use school facilities, and youth get well trained for job opportunities. Testing tools are also developed by the Pratham team to check the learning levels of children so as to determine the course of action best suited to each child and to assess impact of our programs.',
              },
              {
                icon: '/images/edu-icon-five.png',
                title: 'A Powerful Voice in the Education Sector',
                description:
                  "Over the years, Pratham's advocacy in the education sector has become well recognized and regarded. The Annual Status of Education Report (ASER) has become an important input in the education policies of both the central and state governments with several state governments using",
              },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.title}>
                <Grid
                  container
                  spacing={2}
                  alignItems="flex-start"
                  sx={{ py: 4 }}
                >
                  <Grid
                    item
                    xs={12}
                    md={4}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      pt: 0.5,
                      gap: 2,
                    }}
                  >
                    <Box
                      component="img"
                      src={item.icon}
                      alt={item.title}
                      sx={{ width: 48, height: 48, objectFit: 'contain' }}
                    />
                    <Typography
                      variant="body4"
                      component="h2"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        // fontSize: '28px',
                        // lineHeight: '36px',
                        letterSpacing: '0px',
                        color: '#1F1B13',
                      }}
                    >
                      <SpeakableText>{item.title}</SpeakableText>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography
                      variant="h2"
                      component="h2"
                      sx={{
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        // fontSize: '16px',
                        // lineHeight: '24px',
                        letterSpacing: '0.5px',
                        color: '#7C766F',
                      }}
                    >
                      <SpeakableText>{item.description}</SpeakableText>
                    </Typography>
                  </Grid>
                </Grid>
                {idx < arr.length - 1 && (
                  <Box sx={{ borderBottom: '1px solid #E0E0E0', mx: 1 }} />
                )}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default AboutUsPage;
