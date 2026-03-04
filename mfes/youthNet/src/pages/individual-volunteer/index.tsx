import React from 'react';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import { PTMDashboard } from '../../components/PtmComponents';
import Header from '../../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { DASHBOARD_TYPE } from '../../utils/app.config';

const IndividualVolunteerPage: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();

  // Handle breadcrumb navigation
  const handleBreadcrumbClick = (path: string) => {
    router.push(path);
  };

  // Handle back navigation
  const handleBackClick = () => {
    router.back();
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: theme.palette.background.default,
          paddingTop: 2,
        }}
      >
        <Container maxWidth="xl">
          {/* Page Header */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{
                fontWeight: 600, 
                color: theme.palette.text.primary,
                mb: 1 
              }}
            >
              Individual Volunteers
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: theme.palette.text.secondary 
              }}
              >
              Overview and management of registrations
            </Typography>
          </Box>

          {/* PTM Dashboard with Volunteer Type */}
          <PTMDashboard dashboardType="volunteer" />
         
        </Container>
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default IndividualVolunteerPage;