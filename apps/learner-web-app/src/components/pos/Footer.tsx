import Link from 'next/link';
import { Box, Typography, IconButton } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from '@mui/icons-material';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const { t } = useTranslation('footer');

  const usefulLinks = [
    {
      label: t('pratham'),
      href: 'https://www.pratham.org/',
    },
    {
      label: t('ourInterns'),
      href: 'https://prathamopenschool.org/Team/Interns',
    },
    {
      label: t('pradigiCreativityClub'),
      href: 'https://www.pradigi.org/creative-club/',
    },
    {
      label: t('communityProjects'),
      href: 'https://prathamopenschool.org/CommunityProjects/Contents/Pradigicp',
    },
    {
      label: t('covid19Resources'),
      href: 'https://prathamopenschool.org/Covid19Resources',
    },
    {
      label: t('mohallaLearningCamp'),
      href: 'https://prathamopenschool.org/MohallaLearningCamp/Contents/mohallalc',
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#F3F3F3',
        color: 'primary.contrastText',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <Box
        component="footer"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },

          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flex: { xs: 12, sm: 7, md: 7, lg: 7, xl: 3 },
          }}
        >
          <Link href="/" passHref legacyBehavior>
            <Image
              src="/images/appLogo.svg"
              alt="Pratham"
              width={146}
              height={32}
              style={{ height: '32px' }}
            />
          </Link>
          <Typography variant="body1" gutterBottom sx={{ pr: 6 }}>
            {t(
              'Pratham Digital aims to create an open learning mechanism to help children and youth prepare for school, work and life.We strive to create content that can encourage and support self-learning, project based learning and experiential learning for groups and individuals. We create videos, games and learning applications in 11 regional languages for learners across the age group of 3-18+.'
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flex: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '24px',
              letterSpacing: '0.15px',
            }}
          >
            {t('Useful Links')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {usefulLinks.map(({ label, href }) => (
              <Link key={href} href={href} passHref legacyBehavior>
                <Typography variant="body1" gutterBottom>
                  <a target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                </Typography>
              </Link>
            ))}
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            flex: { xs: 12, sm: 6, md: 3, lg: 3, xl: 3 },
          }}
        >
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 600,
              fontSize: 16,
              lineHeight: '24px',
              letterSpacing: '0.15px',
            }}
          >
            {t('Follow Us')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              aria-label="Facebook"
              component={Link}
              href="https://www.facebook.com/PrathamEducationFoundation"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#3b5998' }} // Facebook color
            >
              <Facebook />
            </IconButton>
            <IconButton
              aria-label="Twitter"
              component={Link}
              href="https://x.com/Pratham_India"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#1DA1F2' }} // Twitter color
            >
              <Twitter />
            </IconButton>
            <IconButton
              aria-label="Instagram"
              component={Link}
              href="https://www.instagram.com/prathameducation?igsh=MWM3aXJoeTZoYzNxNg%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#E4405F' }} // Instagram color
            >
              <Instagram />
            </IconButton>
            <IconButton
              aria-label="LinkedIn"
              component={Link}
              href="https://www.linkedin.com/company/pratham/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#0077B5' }} // LinkedIn color
            >
              <LinkedIn />
            </IconButton>
            <IconButton
              aria-label="YouTube"
              component={Link}
              href="https://www.youtube.com/@PrathamEducationFoundation"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: '#FF0000' }} // YouTube color
            >
              <YouTube />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ backgroundColor: 'white' }}>
        <Typography variant="body1" gutterBottom>
          {t(
            'All resources on the website are licensed under a CC BY-NC-ND 4.0 International License © Pratham Open School | Terms and Conditions'
          )}
        </Typography>
      </Box>
    </Box>
  );
};
