'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface NoDataFoundProps {
  message?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  message = 'No surveys found',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        gap: 2,
      }}
    >
      <InboxIcon sx={{ fontSize: 60, color: '#ccc' }} />
      <Typography variant="body1" sx={{ color: '#999' }}>
        {message}
      </Typography>
    </Box>
  );
};

export default NoDataFound;
