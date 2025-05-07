import React from 'react';
import { Layout, useTranslation } from '@shared-lib';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FeautureCarousel from '@learner/components/FeautureCarousel';
import WhatsNewCarousel from '@learner/components/WhatsNewCarousel';
const page = () => {
  return (
    <Layout onlyHideElements={['footer']}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src="/images/home-page-banner.png"
            alt="Happy children learning together"
            style={{ width: '100%', height: 'auto' }}
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
          marginTop: '-100px',
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
            <Grid item xs={12} md={4} key={pillar}>
              <Box
                sx={{
                  height: '100%',
                  marginTop: '20px',
                }}
              >
                <Box
                  sx={{
                    background: `url(/images/pillar-${
                      index + 1
                    }.png) no-repeat center center`,
                    backgroundSize: 'cover',
                    height: '273px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
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

      {/* What’s New */}
      <Box>
        <Typography
          sx={{
            fontFamily: 'Poppins',
            fontWeight: 700,
            fontSize: '36px',
            lineHeight: '44px',
            letterSpacing: '0px',
            textAlign: 'center',
            mt: 5,
          }}
        >
          What’s New
        </Typography>

        <Box>
          <WhatsNewCarousel />
        </Box>
      </Box>
    </Layout>
  );
};

export default page;
