// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '../../../components/Layout';
// import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { gredientStyle } from '@learner/utils/style';
import { Box } from '@mui/material';

const ContentEnrollDetails = dynamic(() => import('@ContentEnrollDetails'), {
  ssr: false,
});
const App = () => {
  // const router = useRouter();

  return (
    <Layout sx={gredientStyle}>
      <Box>
        <ContentEnrollDetails
          isShowLayout={false}
          _config={{
            default_img: '/images/image_ver.png',
            _infoCard: { _cardMedia: { maxHeight: '280px' } },
          }}
        />
      </Box>
    </Layout>
  );
};

export default App;
