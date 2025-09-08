import React from 'react';
import { useFrameworkFormStore } from '../../../store/frameworkFormStore';
import { useChannelStore } from '../../../store/channelStore';
import { normalizeChannels } from '../../../services/channelService';
import Dropdown from '../../Dropdown';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

// This component renders a step in the taxonomy management process where the user selects a channel.
// It fetches available channels from the store, displays them in a dropdown,
// and allows the user to select one. The selected channel is stored in the framework form state.
const StepChannel: React.FC = () => {
  const channel = useFrameworkFormStore((state) => state.channel);
  const setChannel = useFrameworkFormStore((state) => state.setChannel);
  const { channels, loading, error, fetchChannels } = useChannelStore();
  const router = useRouter();

  // Use normalizeChannels to ensure code property exists for selection
  const mappedChannels = normalizeChannels(channels);
  const dropdownOptions = [
    ...mappedChannels.map((ch) => ({
      label: `${ch.name} (${ch.code})`,
      value: ch.code ?? ch.identifier,
    })),
    { label: 'Create New Channel', value: '__create__' },
  ];

  React.useEffect(() => {
    fetchChannels();
    // eslint-disable-next-line
  }, []);

  const handleChannelChange = (value: string) => {
    if (value === '__create__') {
      router.push('/channels/create?fromStepper=1');
      return;
    }
    const selected = mappedChannels.find((ch) => ch.code === value);
    if (selected) setChannel(selected);
  };

  return (
    <Box sx={{ p: { xs: 0, md: 1 }, mb: 0 }}>
      <Box mb={3}>
        <Typography
          variant="subtitle1"
          fontWeight={700}
          gutterBottom
          sx={{
            textTransform: 'uppercase',
            color: 'text.secondary',
            fontSize: 15,
          }}
        >
          Select Channel
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Choose the channel for which you want to create the framework.
        </Typography>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box textAlign="center" py={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Alert severity="error" sx={{ textAlign: 'center', py: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success state */}
      {!loading && !error && (
        <Box maxWidth={400}>
          <Dropdown
            label="Select Channel"
            value={channel?.code || ''}
            onChange={handleChannelChange}
            options={dropdownOptions}
            required
          />
        </Box>
      )}
    </Box>
  );
};

export default StepChannel;
