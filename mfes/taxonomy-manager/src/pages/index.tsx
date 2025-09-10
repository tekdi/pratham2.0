import Head from 'next/head';
import * as React from 'react';
import PageLayout from '../components/layout/PageLayout';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import NextLink from 'next/link';
import LayersIcon from '@mui/icons-material/Layers';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useFrameworksStore } from '../store/frameworksStore';
import { useChannelStore } from '../store/channelStore';
import { getChannelCode } from '../services/channelService';
import {
  getChannelLastUpdatedOn,
  sortFrameworksByLastUpdated,
  sortChannelsByLastUpdated,
} from '../services/dashboardService';
import RecentList from '../components/dashboard/RecentList';
import StatCard from '../components/dashboard/StatCard';

// This component serves as the main dashboard for the application.
// It displays key statistics, recent frameworks, and channels.
const DashboardPage: React.FC = () => {
  const {
    frameworks,
    loading: fwLoading,
    error: fwError,
    fetchFrameworks,
  } = useFrameworksStore();
  const {
    channels,
    loading: chLoading,
    error: chError,
    fetchChannels,
  } = useChannelStore();

  React.useEffect(() => {
    fetchFrameworks();
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  // Calculate total categories from all frameworks
  const totalCategories = frameworks.reduce((total, framework) => {
    return total + (framework.categories ? framework.categories.length : 0);
  }, 0);

  // Calculate master categories (unique categories across frameworks)
  const allCategories = frameworks.flatMap((framework) =>
    framework.categories ? framework.categories.map((cat) => cat.name) : []
  );
  const masterCategories = new Set(allCategories).size;

  // Sort frameworks by lastUpdatedOn (descending)
  const sortedFrameworks = sortFrameworksByLastUpdated(frameworks);

  // Show up to 5 most recent
  const recentFrameworks = sortedFrameworks.slice(0, 5);

  // Sort channels by lastUpdatedOn (descending)
  const sortedChannels = sortChannelsByLastUpdated(channels);

  // Show up to 5 most recent
  const recentChannels = sortedChannels.slice(0, 5);

  return (
    <PageLayout>
      <Head>
        <title>Dashboard - Taxonomy Editor</title>
      </Head>
      <Box
        sx={{
          py: 1.5,
          px: { xs: 0, sm: 1 },
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent={{ xs: 'flex-start', sm: 'space-between' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          gap={2}
          mb={2}
        >
          <Typography
            variant="h1"
            fontWeight={600}
            color="primary.contrastText"
            sx={{ mb: { xs: 1, sm: 0 } }}
          >
            Dashboard
          </Typography>
          <Button
            component={NextLink}
            href="/frameworks/create"
            variant="contained"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            sx={{ width: { xs: '100%', sm: 'auto' }, fontWeight: 600 }}
          >
            Create Framework
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: 3,
            mb: 4,
          }}
        >
          <StatCard
            title="Total Channels"
            value={channels.length.toString()}
            IconComponent={DescriptionIcon}
          />
          <StatCard
            title="Total Frameworks"
            value={frameworks.length.toString()}
            IconComponent={LayersIcon}
          />
          <StatCard
            title="Master Categories"
            value={masterCategories.toString()}
            IconComponent={LayersIcon}
          />
          <StatCard
            title="Total Categories"
            value={totalCategories.toString()}
            IconComponent={DescriptionIcon}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            width: '100%',
          }}
        >
          <RecentList
            title="Recent Channels"
            loading={chLoading}
            error={chError ?? undefined}
            items={recentChannels}
            itemKey={(ch) => ch.identifier}
            itemToProps={(ch) => ({
              id: getChannelCode(ch),
              title: ch.name,
              time: getChannelLastUpdatedOn(ch)
                ? new Date(
                    getChannelLastUpdatedOn(ch) as string
                  ).toLocaleString()
                : 'Unknown',
              status:
                ch.status && ch.status.toLowerCase() === 'live'
                  ? 'Published'
                  : 'Draft',
              user: getChannelCode(ch),
            })}
            viewAllHref="/channels"
          />
          <RecentList
            title="Recent Frameworks"
            loading={fwLoading}
            error={fwError ?? undefined}
            items={recentFrameworks}
            itemKey={(fw) => fw.identifier}
            itemToProps={(fw) => ({
              id: fw.identifier,
              title: fw.name,
              time: fw.lastUpdatedOn
                ? new Date(fw.lastUpdatedOn).toLocaleString()
                : 'Unknown',
              status:
                fw.status && fw.status.toLowerCase() === 'live'
                  ? 'Published'
                  : 'Draft',
              user: fw.channel ?? 'Unknown',
            })}
            viewAllHref="/frameworks"
          />
        </Box>
      </Box>
    </PageLayout>
  );
};

export default DashboardPage;
