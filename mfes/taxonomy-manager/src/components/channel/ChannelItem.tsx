import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { green, grey } from '@mui/material/colors';
import { formatDate } from '../../utils/HelperService';
import { Channel } from '../../interfaces/ChannelInterface';

// This component renders a single channel item in a list.
// It displays the channel name, status, code, last updated date, and provides a structure for potential view/edit links in the future.
const ChannelItem: React.FC<{ channel: Channel }> = ({ channel }) => (
  <Box
    sx={{
      p: 2,
      borderBottom: 1,
      borderColor: 'divider',
      ':last-child': { borderBottom: 0 },
    }}
  >
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ sm: 'center' }}
      justifyContent="space-between"
    >
      <Box>
        <Box display="flex" alignItems="center">
          <Typography variant="h2" fontWeight={600} color="text.primary">
            {channel.name}
          </Typography>
          <Chip
            label={
              channel.status?.toLowerCase() === 'live' ? 'Published' : 'Draft'
            }
            size="small"
            sx={{
              ml: 2,
              bgcolor:
                channel.status?.toLowerCase() === 'live'
                  ? green[100]
                  : grey[200],
              color:
                channel.status?.toLowerCase() === 'live'
                  ? green[800]
                  : grey[700],
              fontWeight: 600,
            }}
          />
        </Box>
        <Typography variant="body2" color="text.primary" mt={0.5}>
          Code: {channel.code} • Last updated:{' '}
          {channel.lastUpdatedOn ? formatDate(channel.lastUpdatedOn) : '-'}
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }}>
        {/* Add view/edit links if needed */}
      </Box>
    </Box>
  </Box>
);

export default ChannelItem;
