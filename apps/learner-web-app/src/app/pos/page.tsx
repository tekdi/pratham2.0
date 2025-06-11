'use client';
import React, { useState } from 'react';
import Layout from '@learner/components/pos/Layout';

import { Container, Typography, Grid, Box, useMediaQuery } from '@mui/material';
import WhatsNewCarousel from '@learner/components/WhatsNewCarousel';
import MoreWayCarousel from '@learner/components/MoreWayCarousel';
import KnwoledgeCarousel from '@learner/components/KnwoledgeCarousel';
import OtherWebsiteCarousel from '@learner/components/OtherWebsiteCarousel';
import Learning from '@learner/components/Learning';
import Image from 'next/image';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { SearchButton } from '@learner/components/pos/SearchButton';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const descriptions = [
  `
  Learning for School focuses on scholastic subjects, which include early years education and learning to read, write, and think. These skills are crucial for building children's confidence and dignity among their peers.
  `,
  'Learning for Work equips adolescents and youth with the skills and knowledge needed for employment and livelihoods.',
  'Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.',
];

const Page = () => {
  const [search, setSearch] = useState('');
  const router = useRouter();
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

  const mediaMD = useMediaQuery('(max-width: 900px)');

  return (
    <Layout onlyHideElements={['footer']} _topAppBar={{ _config: {} }}>
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
              variant={mediaMD ? 'body10' : 'body3'}
              component="h1"
              sx={{
                fontWeight: 800,
                // fontSize: '72px',
                lineHeight: '110%',
                letterSpacing: '0%',
                color: '#1F1B13',
                position: 'relative',
                zIndex: 1000,
                '@media (min-width: 900px)': {
                  marginLeft: '-120px',
                },
              }}
            >
              <SpeakableText>Pratham</SpeakableText>
            </Typography>
            <Typography
              variant={mediaMD ? 'body10' : 'body3'}
              component="h1"
              sx={{
                fontWeight: 800,
                // fontSize: '72px',
                lineHeight: '110%',
                letterSpacing: '0%',
                color: '#FDBE16',
                '@media (max-width: 900px)': {
                  marginLeft: '60px',
                },
              }}
            >
              <SpeakableText>Open School</SpeakableText>
            </Typography>

            <Typography
              variant={mediaMD ? 'body1' : 'body4'}
              component="h1"
              sx={{
                my: 2,
                fontFamily: 'Poppins',
                fontWeight: 400,
                lineHeight: '36px',
                letterSpacing: '0px',
                color: '#1F1B13',
                mt: 2,
              }}
            >
              <SpeakableText>
                Opening doors to knowledge and skills
              </SpeakableText>
            </Typography>

            <Typography
              variant={mediaMD ? 'body1' : 'h1'}
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
              }}
            >
              <SpeakableText>In 15 languages</SpeakableText>
            </Typography>

            <Typography
              variant={mediaMD ? 'body1' : 'body5'}
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
              }}
            >
              <SpeakableText>
                Pratham Open School offers free, downloadable videos, games,
                reading material and stories in 15 languages for ages 1 to 18+,
                designed to support self-led learning and group learning through
                activities and projects.
              </SpeakableText>
            </Typography>
            <SearchButton
              searchValue={search}
              onSearch={() => router.push('/pos/search?q=' + search)}
              handleSearch={setSearch}
              _box={{
                mx: 'auto',
                mt: 4,
                '@media (min-width: 900px)': {
                  mb: '100px',
                },
              }}
            />
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
          variant={mediaMD ? 'h1' : 'body6'}
          component="h3"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '36px',
            lineHeight: '64px',
            letterSpacing: '-0.25px',
            color: '#1F1B13',
            textAlign: 'center',
          }}
        >
          <SpeakableText>Our Learning Pillars</SpeakableText>
        </Typography>
        <Learning descriptions={descriptions} />
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
            variant={mediaMD ? 'body8' : 'body7'}
            component="h1"
            sx={{
              // fontFamily: 'Poppins',
              fontWeight: 700,
              // fontSize: '46px',
              // lineHeight: '100%',
              letterSpacing: '-0.25px',
              textAlign: 'center',
              color: '#1F1B13',
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
                  variant={mediaMD ? 'body8' : 'body6'}
                  component="h1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: '36px',
                    lineHeight: '44px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#F17B06',
                  }}
                >
                  <SpeakableText>{item.value}</SpeakableText>
                </Typography>
                <Typography
                  variant={mediaMD ? 'h2' : 'body8'}
                  component="h1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    // fontSize: '24px',
                    lineHeight: '32px',
                    letterSpacing: '0px',
                    textAlign: 'center',
                    color: '#1F1B13',
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
            mt: 4,
          }}
        >
          {/* <FeautureCarousel /> */}
          <Content
            isShowLayout={false}
            contentTabs={['Content']}
            showFilter={false}
            showSearch={false}
            filters={{ limit: 10 }}
            // showHelpDesk={false}
            hasMoreData={false}
            _config={{
              contentBaseUrl: '/pos',
              _carousel: {
                loop: true,
                autoplay: { delay: 2500, disableOnInteraction: false },
              },
              isHideNavigation: true,
              isShowInCarousel: true,
              default_img: '/images/image_ver.png',
            }}
          />
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
              variant={mediaMD ? 'h1' : 'body6'}
              component="h1"
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 700,
                // fontSize: '36px',
                // lineHeight: '44px',
                letterSpacing: '0px',
                color: '#1F1B13',
                '@media (max-width: 900px)': {
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
          variant={mediaMD ? 'h1' : 'body6'}
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
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
          variant={mediaMD ? 'h1' : 'body6'}
          component="h1"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '36px',
            // lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
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
          mb: 2,
          '@media (max-width: 900px)': {
            mx: '16px',
          },
        }}
      >
        <Typography
          variant={mediaMD ? 'h1' : 'body6'}
          component="h1"
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            // fontSize: '36px',
            // lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            color: '#1F1B13',
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

export default Page;
