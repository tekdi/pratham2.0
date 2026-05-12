'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material';
import Header from '@learner/components/Header/Header';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import { useTranslation } from '@shared-lib';
import EnrolModal from '@learner/components/EnrolModal/EnrolModal';

interface Program {
  tenantId: string;
  name: string;
  description?: string;
  type?: string;
  params?: {
    uiConfig?: { [key: string]: any };
    [key: string]: any;
  } | null;
  programImages?: (
    | string
    | { label?: string; description?: string; [key: string]: any }
  )[];
}

function getFirstImage(program: Program): string {
  const item = program.programImages?.[0];
  if (!item) return '/images/default.png';
  return typeof item === 'string'
    ? item
    : (item as any).description || '/images/default.png';
}

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const tenantId = params?.tenantId as string;

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [enrolModalOpen, setEnrolModalOpen] = useState(false);

  useEffect(() => {
    if (!tenantId) return;
    const fetchProgram = async () => {
      try {
        const res = await getTenantInfo();
        const all: Program[] = res?.result || [];
        const found = all.find((p) => p.tenantId === tenantId);
        if (found) {
          setProgram(found);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [tenantId]);

  const handleEnrolNow = () => {
    setEnrolModalOpen(true);
  };

  const handleLogin = () => {
    router.push(`/login?tenantId=${tenantId}`);
  };

  if (loading) {
    return (
      <>
        <Header isLogin />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '60vh',
          }}
        >
          <CircularProgress sx={{ color: '#FDBE16' }} />
        </Box>
      </>
    );
  }

  if (notFound || !program) {
    return (
      <>
        <Header isLogin />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>
            {t('LANDING.PROGRAM_NOT_FOUND') || 'Program not found'}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => router.push('/landing')}
            sx={{ textTransform: 'none', borderColor: '#FDBE16', color: '#1F1B13' }}
          >
            {t('LANDING.GO_BACK') || 'Go Back'}
          </Button>
        </Box>
      </>
    );
  }

  const heroImage = getFirstImage(program);

  return (
    <>
      <Header  />

      <Box sx={{ backgroundColor: '#fff', minHeight: '100vh' }}>
        {/* ── Hero Banner ── */}
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Box
            component="img"
            src={heroImage}
            alt={program.name}
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
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
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
              {program.name}
            </Typography>
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
                  {`${t('LANDING.READY_TO_JOIN') || 'Ready to join'} ${program.name}?`}
                </Typography>

                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleEnrolNow}
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
                  {t('LANDING.ENROL_NOW') || 'Enrol Now'}
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
                    '&:hover': { borderColor: '#FDBE16', backgroundColor: 'transparent' },
                  }}
                >
                  {t('LANDING.ALREADY_ENROLLED_LOGIN') || 'Already enrolled? Log in'}
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
                  {t('LANDING.ENROL_HINT') ||
                    "New or already enrolled — just enter your phone number. We'll guide you through."}
                </Typography>
              </Box>

              {/* About the Program */}
              <Box>
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
                    {t('LANDING.ABOUT_THE_PROGRAM') || 'About the Program'}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: { xs: '14px', md: '15px' },
                    lineHeight: 1.9,
                    color: '#3D6B5E',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {program.description || ''}
                </Typography>
              </Box>

              {/* Contact */}
              <Box>
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
                    {t('LANDING.CONTACT') || 'Contact'}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: { xs: '14px', md: '15px' },
                    color: '#3D6B5E',
                    lineHeight: 1.9,
                  }}
                >
                  {t('LANDING.WRITE_TO_US') || 'Write to us at'}{' '}
                  <Box
                    component="a"
                    href={`mailto:${program.params?.uiConfig?.contactEmail || program.params?.uiConfig?.contact || 'info@pratham.org'}`}
                    sx={{ color: '#0D599E', textDecoration: 'underline' }}
                  >
                    {program.params?.uiConfig?.contactEmail || program.params?.uiConfig?.contact || 'info@pratham.org'}
                  </Box>
                </Typography>
              </Box>

            </Box>
          </Container>
        </Box>
      </Box>

      <EnrolModal
        open={enrolModalOpen}
        onClose={() => setEnrolModalOpen(false)}
        programName={program.name}
        tenantId={tenantId}
      />
    </>
  );
}
