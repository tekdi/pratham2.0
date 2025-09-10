import React from 'react';
import { useFrameworkFormStore } from '../../../store/frameworkFormStore';
import { useFrameworksStore } from '../../../store/frameworksStore';
import Dropdown from '../../Dropdown';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useRouter } from 'next/router';

// This component renders a step in the taxonomy management process where the user selects a framework.
// It fetches available frameworks from the store, filters them based on the selected channel, and displays them in a dropdown. The selected framework is stored in the framework form state.
const StepFramework: React.FC = () => {
  const framework = useFrameworkFormStore((state) => state.framework);
  const setFramework = useFrameworkFormStore((state) => state.setFramework);
  const channel = useFrameworkFormStore((state) => state.channel);
  const { frameworks, loading, error, fetchFrameworks } = useFrameworksStore();
  const router = useRouter();

  // Filter frameworks to only those belonging to the selected channel
  const filteredFrameworks = React.useMemo(() => {
    if (!channel) return [];
    return frameworks.filter(
      (fw) => fw.channel === channel.code || fw.channel === channel.identifier
    );
  }, [frameworks, channel]);

  const dropdownOptions = [
    ...filteredFrameworks.map((fw) => ({
      label: `${fw.name} (${fw.code})`,
      value: fw.code,
    })),
    { label: 'Create New Framework', value: '__create__' },
  ];

  React.useEffect(() => {
    fetchFrameworks();
    // eslint-disable-next-line
  }, []);

  const handleFrameworkChange = (value: string) => {
    if (value === '__create__') {
      if (channel) {
        const params = new URLSearchParams({
          fromStepper: '1',
          channelId: channel.identifier,
          channelName: channel.name,
          channelCode: channel.code || '',
        });
        router.push(`/frameworks/create?${params.toString()}`);
      } else {
        router.push('/frameworks/create?fromStepper=1');
      }
      return;
    }
    const selected = filteredFrameworks.find((fw) => fw.code === value);
    if (selected) setFramework(selected);
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
          Select Framework
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Choose the framework you want to manage or edit.
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
            label="Select Framework"
            value={framework?.code || ''}
            onChange={handleFrameworkChange}
            options={dropdownOptions}
            required
          />
        </Box>
      )}
    </Box>
  );
};

export default StepFramework;
