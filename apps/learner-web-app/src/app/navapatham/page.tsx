'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Container, Typography } from '@mui/material';
import Header from '@learner/components/Header/Header';
import EnrolModal from '@learner/components/EnrolModal/EnrolModal';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import { TenantName } from '@learner/utils/app.constant';
import { useTranslation } from '@shared-lib';

const PROGRAM_NAME = TenantName.SECOND_CHANCE_PROGRAM;
const HERO_IMAGE = '/images/nava-patham.jpg';
const CONTACT_EMAIL = 'info@pratham.org';

/* Yellow uppercase section label used for the hero badge and section headings */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      display: 'inline-flex',
      backgroundColor: '#FDBE16',
      px: 2.5,
      py: 0.8,
      mb: 3,
    }}
  >
    <Typography
      sx={{
        fontFamily: 'Poppins',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '0.08em',
        color: '#1F1B13',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </Typography>
  </Box>
);

const Heading = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontFamily: 'Poppins',
      fontWeight: 700,
      fontSize: { xs: '14px', md: '15px' },
      lineHeight: 1.9,
      color: '#1F1B13',
    }}
  >
    {children}
  </Typography>
);

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Typography
    sx={{
      fontFamily: 'Poppins',
      fontSize: { xs: '14px', md: '15px' },
      lineHeight: 1.9,
      color: '#3D6B5E',
      whiteSpace: 'pre-line',
    }}
  >
    {children}
  </Typography>
);

export default function NavaPathamPage() {
  const router = useRouter();
  const { t, setLanguage } = useTranslation();
  const [tenantId, setTenantId] = useState('');
  const [enrolModalOpen, setEnrolModalOpen] = useState(false);

  // Set Telugu as default language for this page only
  useEffect(() => {
    // This runs immediately on mount to ensure language is set before Header renders
    if (typeof window !== 'undefined') {
      const currentLang = localStorage.getItem('lang');
      // Only set if not already Telugu to avoid unnecessary updates
      if (currentLang !== 'tel') {
        localStorage.setItem('lang', 'tel');
        localStorage.setItem('preferredLanguage', 'tel');
        setLanguage('tel');
      }
    }
  }, [setLanguage]);

  useEffect(() => {
    localStorage.setItem('isForNavaPatham', 'true');
    // Landing here starts a fresh registration, so drop any half-filled
    // form data left behind by an abandoned attempt.
    localStorage.removeItem('formData');

    const fetchTenantId = async () => {
      try {
        const res = await getTenantInfo();
        const found = (res?.result || []).find(
          (p: any) => p?.name?.toLowerCase() === PROGRAM_NAME.toLowerCase()
        );
        if (found?.tenantId) setTenantId(found.tenantId);
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };

    fetchTenantId();
  }, []);

  const handleLogin = () => {
    router.push(tenantId ? `/login?tenantId=${tenantId}` : '/login');
  };

  return (
    <>
      <Header />

      <Box sx={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        {/* ── Hero Banner ── */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            component="img"
            src={HERO_IMAGE}
            alt={PROGRAM_NAME}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = '/images/default.png';
            }}
            sx={{
              width: '100%',
              height: { xs: 260, md: 380 },
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Program name badge — bottom-left of hero */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
            <Box
              sx={{
                backgroundColor: '#FDBE16',
                px: 3,
                py: 1.2,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: { xs: '13px', md: '16px' },
                  letterSpacing: '0.08em',
                  color: '#1F1B13',
                  textTransform: 'uppercase',
                }}
              >
                {t('NAVAPATHAM.NAVAPATHAM')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Body ── */}
        <Box sx={{ backgroundColor: '#FFFDF7', py: { xs: 4, md: 6 } }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, md: 3 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {/* Enrol card — centred, fixed width */}
              <Box
                sx={{
                  mx: 'auto',
                  width: '100%',
                  maxWidth: 480,
                  border: '1px solid #E0E0E0',
                  borderRadius: '12px',
                  p: { xs: 3, md: 4 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  backgroundColor: '#fff',
                  boxShadow: '0px 4px 16px rgba(0,0,0,0.08)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: { xs: '16px', md: '18px' },
                    color: '#1F1B13',
                    textAlign: 'center',
                    lineHeight: 1.4,
                  }}
                >
                  {t('NAVAPATHAM.READY_TO_JOIN_NAVAPATHAM')}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setEnrolModalOpen(true)}
                  disableElevation
                  sx={{
                    backgroundColor: '#FDBE16',
                    color: '#1F1B13',
                    fontFamily: 'Poppins',
                    fontWeight: 700,
                    fontSize: '15px',
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 1.4,
                    '&:hover': { backgroundColor: '#f0b000' },
                  }}
                >
                  {t('NAVAPATHAM.ENROL_NOW')}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleLogin}
                  disableElevation
                  sx={{
                    borderColor: '#D0D0D0',
                    color: '#1F1B13',
                    fontFamily: 'Poppins',
                    fontWeight: 500,
                    fontSize: '14px',
                    textTransform: 'none',
                    borderRadius: '8px',
                    py: 1.2,
                    '&:hover': {
                      borderColor: '#FDBE16',
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  {t('NAVAPATHAM.ALREADY_ENROLLED_LOGIN')}
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'center',
                    color: '#888',
                    fontFamily: 'Poppins',
                    lineHeight: 1.5,
                    fontSize: '12px',
                  }}
                >
                  {t('NAVAPATHAM.ENROL_HINT')}
                </Typography>
              </Box>

              {/* About the Program */}
              <Box>
                <SectionLabel>{t('NAVAPATHAM.ABOUT_THE_PROGRAM')}</SectionLabel>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <Paragraph>{t('NAVAPATHAM.ABOUT_NAVAPATHAM_TEXT')}</Paragraph>
                 
                  <Box>
                    <Heading>{t('NAVAPATHAM.REGISTER_YOUR_INTEREST')}</Heading>
                    <Paragraph>
                      {t('NAVAPATHAM.REGISTER_YOUR_INTEREST_TEXT')}
                    </Paragraph>
                  </Box>

                  <Paragraph>
                    {t('NAVAPATHAM.NEVER_TOO_LATE_TO_LEARN')}
                  </Paragraph>
                </Box>
              </Box>

              {/* Contact */}
              <Box>
                <SectionLabel>{t('NAVAPATHAM.CONTACT')}</SectionLabel>

                <Paragraph>
                  {t('NAVAPATHAM.WRITE_TO_US_AT')}{' '}
                  <Box
                    component="a"
                    href={`mailto:${CONTACT_EMAIL}`}
                    sx={{ color: '#0D599E', textDecoration: 'underline' }}
                  >
                    {CONTACT_EMAIL}
                  </Box>
                </Paragraph>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      <EnrolModal
        open={enrolModalOpen}
        onClose={() => setEnrolModalOpen(false)}
        programName={PROGRAM_NAME}
        displayName={t('NAVAPATHAM.NAVAPATHAM')}
        tenantId={tenantId}
      />
    </>
  );
}
