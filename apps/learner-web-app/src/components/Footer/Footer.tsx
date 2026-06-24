'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  Collapse,
  ButtonBase,
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@shared-lib';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';
import { getTenantInfo } from '@learner/utils/API/ProgramService';

const FOOTER_STRIP_HEIGHT = 48;

const PRIVACY_GUIDELINES_URL = 'https://www.pratham.org/privacy-guidelines/';
const COOKIE_GUIDELINES_URL = 'https://www.pratham.org/cookie-guidelines/';

interface SsoProgram {
  name: string;
  tenantId: string;
  params?: {
    uiConfig?: {
      sso?: Array<{ url?: string; enable_domain?: string[] }>;
      landingPage?: string;
    };
  };
}

interface FooterLink {
  label: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [ssoPrograms, setSsoPrograms] = useState<SsoProgram[]>([]);
  const [pragyanpathUrl, setPragyanpathUrl] = useState<string | undefined>(undefined);

  const copyrightYear = new Date().getFullYear();

  useEffect(() => {
    const fetchSsoPrograms = async () => {
      try {
        const res = await getTenantInfo();
        const programsData = res?.result || [];
        const ssoProgramsData = programsData.filter(
          (program: SsoProgram) => program?.params?.uiConfig?.sso?.length
        );
        setSsoPrograms(ssoProgramsData);

        const currentDomain =
          typeof window !== 'undefined' ? window.location.origin : '';
        const pragyanpathProgram = programsData.find((p: SsoProgram) =>
          p.name.toLowerCase().includes('pragyanpath')
        );
        if (pragyanpathProgram?.params?.uiConfig?.sso?.length) {
          const ssoOption = pragyanpathProgram.params.uiConfig.sso.find(
            (opt: { url?: string; enable_domain?: string[] }) =>
              opt?.enable_domain?.includes(currentDomain)
          );
          if (ssoOption?.url) {
            const callbackUrl = `${currentDomain}/sso?env=newton&tenantid=${pragyanpathProgram.tenantId}`;
            setPragyanpathUrl(`${ssoOption.url}?callbackurl=${callbackUrl}`);
          }
        }
      } catch (error) {
        console.error('Failed to fetch SSO programs for footer:', error);
      }
    };

    fetchSsoPrograms();
  }, []);

  const toggleFooter = () => setIsExpanded((prev) => !prev);

  const handlePragyanpath = () => {
    const program = ssoPrograms.find((p) =>
      p.name.toLowerCase().includes('pragyanpath')
    );

    if (!program?.params?.uiConfig) {
      return;
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(
        'landingPage',
        program.params.uiConfig.landingPage || ''
      );
      localStorage.setItem('userProgram', program.name);
      localStorage.setItem(
        'uiConfig',
        JSON.stringify(program.params.uiConfig || {})
      );
    }
  };

  const usefulLinks: FooterLink[] = [
    {
      label: t('LEARNER_APP.FOOTER.PRIVACY_GUIDELINES'),
      href: PRIVACY_GUIDELINES_URL,
    },
    {
      label: t('LEARNER_APP.FOOTER.COOKIE_GUIDELINES'),
      href: COOKIE_GUIDELINES_URL,
    },
    {
      label: t('LEARNER_APP.FOOTER.PRAGYANPATH'),
      href: pragyanpathUrl,
      target: '_blank',
      onClick: handlePragyanpath,
    },
  ];



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
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            height: FOOTER_STRIP_HEIGHT,
            px: { xs: 2, md: '56px' },
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: '#f3f3f3',
          }}
        >
          <ButtonBase
            onClick={toggleFooter}
            aria-expanded={isExpanded}
            aria-controls="learner-footer-content"
            aria-label={
              isExpanded
                ? t('LEARNER_APP.FOOTER.HIDE_FOOTER')
                : t('LEARNER_APP.FOOTER.SHOW_FOOTER')
            }
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexShrink: 0,
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
              {isExpanded
                ? t('LEARNER_APP.FOOTER.HIDE_FOOTER')
                : t('LEARNER_APP.FOOTER.SHOW_FOOTER')}
            </Typography>
            {isExpanded ? (
              <KeyboardArrowUp fontSize="small" />
            ) : (
              <KeyboardArrowDown fontSize="small" />
            )}
          </ButtonBase>
        </Box>

        <Collapse in={isExpanded}>
          <Box
            id="learner-footer-content"
            sx={{
              backgroundColor: '#F3F3F3',
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
                        src="/images/appLogo.svg"
                        alt="Pratham"
                        width={120}
                        height={32}
                        style={{ height: '32px', width: 'auto' }}
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
                        {t('LEARNER_APP.FOOTER.DESCRIPTION')}
                      </SpeakableText>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Grid container direction="column" spacing={4}>
                  <Grid item>
                    <Typography
                      component="p"
                      sx={{
                        fontWeight: 600,
                        color: '#1F1B13',
                        fontSize: '22px',
                        lineHeight: 1.27,
                        margin: 0,
                      }}
                    >
                      <SpeakableText>
                        {t('LEARNER_APP.FOOTER.USEFUL_LINKS')}
                      </SpeakableText>
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Grid container direction="column" spacing={1}>
                      {usefulLinks.map(({ label, href, target, onClick }) => (
                        <Grid item key={label}>
                          {href ? (
                            <Link
                              href={href}
                              target={target ?? '_blank'}
                              rel="noopener noreferrer"
                              onClick={onClick}
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
                          ) : (
                            <Typography
                              component="button"
                              type="button"
                              onClick={onClick}
                              variant="body1"
                              sx={{
                                fontWeight: 400,
                                color: '#1F1B13',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                textAlign: 'left',
                                font: 'inherit',
                              }}
                            >
                              {label}
                            </Typography>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            
          </Box>
        </Collapse>
      </Box>
    </>
  );
};
