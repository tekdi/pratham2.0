'use client';

import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';

import { Layout } from '@shared-lib';
import OurProgramCarousel from '@learner/components/OurProgramCarousel';

export default function Index() {
  const router = useRouter();
  const theme = useTheme();
  const [imgError, setImgError] = useState<boolean>(false);
  const programCarouselRef = useRef<HTMLDivElement>(null); // Reference for the carousel section

  const handleImageError = () => {
    setImgError(true);
  };

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Handles smooth scrolling to the program carousel section when
   * the user clicks the "Explore Programs" button.
   */
  /*******  f66c0108-7e2c-474f-beaa-522c3fd68dae  *******/

  const handleScrollToPrograms = () => {
    if (programCarouselRef.current) {
      programCarouselRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout onlyHideElements={['footer']}>
      <Box
        sx={{
          background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
          boxShadow: '0px 4px 8px 3px #00000026, 0px 1px 3px 0px #0000004D',
          pt: '20px',
        }}
      >
        <Container>
          <Box
            sx={{
              textAlign: 'center',
              my: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ width: 60, height: 60, position: 'relative' }}>
              <Image
                src="/images/welcome.gif"
                alt="welcome gif"
                width={60}
                height={60}
                onError={handleImageError}
              />
            </Box>
            <Typography
              sx={{
                fontSize: '32px',
                fontWeight: '400',
                color: '#1F1B13',
                textAlign: 'center',
              }}
            >
              Welcome to Pratham myLearning!
            </Typography>
            <Typography
              sx={{
                fontWeight: '400',
                fontSize: '22px',
                textAlign: 'center',
              }}
            >
              Your Learning Journey begins here
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                px: 4,
                py: 1,
                borderRadius: '100px',
                backgroundColor: '#FDBE16',
                color: '#1E1B16',
                fontWeight: '500',
                fontSize: '16px',
                '&:hover': {
                  backgroundColor: '#FDBE16',
                },
              }}
              onClick={handleScrollToPrograms} // Scroll to carousel section on click
            >
              Sign Up for Program Now!
            </Button>

            <Box sx={{ display: 'flex', gap: '5px' }}>
              <Typography variant="body2" color="#1F1B13" display="inline">
                Already signed up?
              </Typography>
              <Typography
                variant="body2"
                color="#0D599E"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: '500',
                }}
                display="inline"
                onClick={() => router.push('/login')}
              >
                Click here to login
              </Typography>
            </Box>
          </Box>
        </Container>
        <Box sx={{ background: '#fff', py: '4px', borderRadius: '24px' }}>
          <Container maxWidth="md">
            <Grid container spacing={2} sx={{ my: 4, alignItems: 'center' }}>
              <Grid item xs={12} sm={5}>
                <Box>
                  <Box
                    sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}
                  >
                    <Box>
                      <Image
                        src="/images/prathamQR.png"
                        alt="QR Code"
                        width={62}
                        height={61}
                        onError={handleImageError}
                      />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          textAlign: 'left',
                          color: '#1F1B13',
                          fontWeight: '500',
                          fontSize: '14px',
                        }}
                        fontWeight="bold"
                      >
                        Get the App
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Point your phone camera here
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} sm={2}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      width: '1px',
                      height: '20px',
                      backgroundColor: '#D9D9D9',
                    }}
                  />
                  <Typography
                    sx={{
                      my: 1,
                      color: '#1F1B13',
                      fontSize: '14px',
                      fontWeight: '400',
                    }}
                  >
                    OR
                  </Typography>
                  <Box
                    sx={{
                      width: '1px',
                      height: '20px',
                      backgroundColor: '#D9D9D9',
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} sm={5}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <img
                      src="/images/playstore.png"
                      alt="Play Store"
                      width="122"
                    />
                  </Box>

                  {/* Search Bar (placeholder) */}
                  <Box>
                    <Typography>
                      Search &quot;Pratham myLearning&quot; on Playstore
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* About Pratham Section */}
      <Container maxWidth="xl">
        <Box sx={{ my: 6, px: '20px' }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h5"
                component="h2"
                fontWeight="bold"
                sx={{
                  mb: 3,
                  fontWeight: 600,
                  fontSize: '32px',
                  color: '#1F1B13',
                }}
              >
                About Pratham
              </Typography>
              <Typography
                sx={{
                  mb: 3,
                  fontWeight: 400,
                  fontSize: '16px',
                  color: '#1F1B13',
                }}
                variant="body1"
                paragraph
              >
                Pratham creates innovative education solutions with thoughtful,
                impactful interventions that span the age spectrum. Working both
                directly and through government systems, these programs
                collectively reach millions of children and young people each
                year. The direct work follows two tracks: Pratham works with
                children either in the school or in the community, whereas the
                &ldquo;partnership&rdquo; model involves Pratham teams working
                closely with government teams at the state, district, or block
                level. Our unwavering commitment to developing, testing, and
                improving learning outcomes continues to serve as a model, both
                within India and beyond.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 278,
                  borderRadius: '24px',
                  overflow: 'hidden',
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/GHDXLXVgH-E?si=96TpyN_qbCfF2V4T"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  style={{ borderRadius: '24px' }}
                ></iframe>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Our Programs Section */}
      <Box
        ref={programCarouselRef} // Reference for scrolling
        sx={{
          background: 'linear-gradient(180deg, #FFFDF7 0%, #F8EFDA 100%)',
          padding: '20px',
        }}
      >
        <OurProgramCarousel />
      </Box>
    </Layout>
  );
}
