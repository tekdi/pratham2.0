import React from 'react';
import { Box, Card, CardContent, Skeleton } from '@mui/material';

const CardShimmer: React.FC = () => {
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: 'auto',
        borderRadius: '12px',
        bgcolor: '#FEF7FF',
        boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        '@media (max-width: 600px)': {
          flexDirection: 'column',
        },
      }}
    >
      {/* Image shimmer */}
      <Box sx={{ position: 'relative', width: '100%' }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={297}
          sx={{
            '@media (max-width: 600px)': {
              height: '200px',
            },
          }}
        />

        {/* Overlay bar shimmer */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '40px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            padding: '0px 5px',
          }}
        >
          <Skeleton
            variant="circular"
            width={18}
            height={18}
            sx={{ mr: 0.5, bgcolor: 'rgba(255, 255, 255, 0.3)' }}
          />
          <Skeleton
            variant="text"
            width="70%"
            height={20}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)' }}
          />
        </Box>
      </Box>

      {/* Content shimmer */}
      <CardContent
        sx={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        {/* Title shimmer */}
        <Box sx={{ flexGrow: 1, mb: 1, paddingLeft: '5px' }}>
          <Skeleton variant="text" width="80%" height={24} />
        </Box>

        {/* Description shimmer */}
        <Box sx={{ flexGrow: 2, mb: 2, paddingLeft: '5px' }}>
          <Skeleton variant="text" width="100%" height={20} />
          <Skeleton variant="text" width="60%" height={20} />
        </Box>

        {/* Button shimmer */}
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          sx={{ mt: 'auto', alignSelf: 'flex-start' }}
        />
      </CardContent>
    </Card>
  );
};

export default CardShimmer; 