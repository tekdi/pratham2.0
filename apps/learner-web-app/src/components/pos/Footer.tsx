'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
  Collapse,
  ButtonBase,
} from '@mui/material';
import {
  Facebook,
  Instagram,
  LinkedIn,
  YouTube,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { useColorInversion } from '../../context/ColorInversionContext';

const FOOTER_STRIP_HEIGHT = 48;

export const Footer: React.FC = () => {
  const { t } = useTranslation('footer');
  const { isColorInverted } = useColorInversion();
  const [isExpanded, setIsExpanded] = useState(false);

  const termsAndConditionsUrl =
    'https://www.prathamopenschool.org/pos/terms-and-conditions';

  const usefulLinks = [
    {
      label: t('Pratham'),
      href: 'https://www.pratham.org/',
    },
    {
      label: t('Pradigi'),
      href: 'https://pradigi.org/',
    },
    {
      label: t('ASER'),
      href: 'https://asercentre.org/',
    },
  ];

  const toggleFooter = () => setIsExpanded((prev) => !prev);

  const copyrightNotice = (
    <Typography
      variant="body2"
      component="div"
      sx={{ color: '#7C766F', fontWeight: 500 }}
    >
      <SpeakableText
        text={`${t('All resources on the website are licensed under a CC BY-NC-ND 4.0 International License © Pratham Open School |')} ${t('Terms and Conditions')}`}
      >
        {t(
          'All resources on the website are licensed under a CC BY-NC-ND 4.0 International License © Pratham Open School |'
        )}
      </SpeakableText>{' '}
      <Link
        href={termsAndConditionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'inherit',
          textDecoration: 'underline',
          fontWeight: 500,
        }}
      >
        {t('Terms and Conditions')}
      </Link>
    </Typography>
  );

  return (
    <>
      <Box sx={{ height: FOOTER_STRIP_HEIGHT, flexShrink: 0 }} aria-hidden />

      <Box
        component="footer"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          backgroundColor: '#f3f3f3',
          boxShadow: isExpanded ? '0 -2px 8px rgba(0, 0, 0, 0.08)' : 'none',
          // iOS Safari caches touch hit-test areas for fixed elements and doesn't
          // update them after internal layout changes (e.g. Collapse animation).
          // Forcing a GPU compositing layer causes iOS to correctly re-map touch
          // targets after the Collapse opens/closes, fixing the "Hide footer"
          // button being untappable until a scroll occurs.
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
        }}
      >
        <Collapse in={isExpanded}>
          <Box
            id="pos-footer-content"
            sx={{
              backgroundColor: '#F3F3F3',
              color: 'primary.contrastText',
              py: 4,
              px: '56px',
              maxHeight: 'calc(100vh - 112px)',
              overflowY: 'auto',
              '@media (max-width: 600px)': {
                px: '16px',
              },
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12} md={6} lg={6}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Link href="/" passHref legacyBehavior>
                      <Image
                        src={
                          isColorInverted
                            ? '/images/pradigi-white.png'
                            : '/images/pradigi.png'
                        }
                        alt="Pratham"
                        width={97}
                        height={32}
                        style={{ height: '32px' }}
                      />
                    </Link>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 400,
                        color: '#1F1B13',
                        textAlign: 'justify',
                      }}
                    >
                      <SpeakableText>
                        {t(`
  Over the past 30 years, Pratham Education Foundation has worked across India on diverse educational initiatives. 
  The Pratham-Shah PraDigi Innovation Centre, also known as PraDigi Centre (India), was established to develop an open learning model designed to foster lifelong learning and equip children and youth with essential skills for school, life, and work. The centre aims to leverage technology to transform educational experiences and to create engaging, supportive, contextual, and relevant learning environments.
`)}
                      </SpeakableText>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography
                      variant="h1"
                      component="h3"
                      sx={{ fontWeight: 600, color: '#1F1B13' }}
                    >
                      <SpeakableText>{t('Useful Links')}</SpeakableText>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column" spacing={1}>
                      {usefulLinks.map(({ label, href }) => (
                        <Grid item key={href}>
                          <Link
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              textDecoration: 'none',
                              color: 'inherit',
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: 400,
                                color: '#1F1B13',
                                cursor: 'pointer',
                              }}
                            >
                              {label}
                            </Typography>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography
                      variant="h1"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        color: '#1F1B13',
                      }}
                    >
                      <SpeakableText>{t('Follow Us')}</SpeakableText>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1}>
                      <Grid item>
                        <IconButton
                          aria-label="Facebook"
                          component={Link}
                          href="https://www.facebook.com/PrathamEducationFoundation"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#3b5998' }}
                        >
                          <Facebook />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          aria-label="Twitter"
                          component={Link}
                          href="https://x.com/Pratham_India"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#1DA1F2', padding: '8px' }}
                        >
                          <Image
                            src="/images/twiteer.png"
                            alt="Twitter"
                            width={24}
                            height={24}
                          />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          aria-label="Instagram"
                          component={Link}
                          href="https://www.instagram.com/prathameducation?igsh=MWM3aXJoeTZoYzNxNg%3D%3D&utm_source=qr"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#E4405F' }}
                        >
                          <Instagram />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          aria-label="LinkedIn"
                          component={Link}
                          href="https://www.linkedin.com/company/pratham/"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#0077B5' }}
                        >
                          <LinkedIn />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton
                          aria-label="YouTube"
                          component={Link}
                          href="https://www.youtube.com/@PrathamEducationFoundation"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{ color: '#FF0000' }}
                        >
                          <YouTube />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: { xs: 'block', md: 'none' } }}>
              <Divider />
            </Box>
            <Grid
              container
              justifyContent="center"
              sx={{ mt: 3, display: { xs: 'flex', md: 'none' } }}
            >
              <Grid item xs={12}>
                <Box>{copyrightNotice}</Box>
              </Grid>
            </Grid>
          </Box>
        </Collapse>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: FOOTER_STRIP_HEIGHT,
            px: { xs: 2, md: '56px' },
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#f3f3f3',
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              pr: 2,
              display: { xs: 'none', md: 'block' },
            }}
          >
            {copyrightNotice}
          </Box>

          <ButtonBase
            onClick={toggleFooter}
            aria-expanded={isExpanded}
            aria-controls="pos-footer-content"
            aria-label={isExpanded ? t('Hide footer') : t('Show footer')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
              ml: { xs: 'auto', md: 0 },
              borderRadius: 1,
              px: 1,
              py: 0.5,
              color: '#1F1B13',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {isExpanded ? t('Hide footer') : t('Show footer')}
            </Typography>
            {isExpanded ? (
              <KeyboardArrowUp fontSize="small" />
            ) : (
              <KeyboardArrowDown fontSize="small" />
            )}
          </ButtonBase>
        </Box>
      </Box>
    </>
  );
};
