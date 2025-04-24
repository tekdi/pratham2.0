// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';

const ContentDetails = dynamic(() => import('@ContentDetails'), {
  ssr: false,
});
const App = () => {
  return (
    <Layout>
      <Box sx={gredientStyle}>
        <ContentDetails
          isShowLayout={false}
          _config={{
            default_img: '/images/image_ver.png',
            _card: { isHideProgress: true },
            _infoCard: { _cardMedia: { maxHeight: '280px' } },
          }}
        />
      </Box>
    </Layout>
  );
};

export default App;
