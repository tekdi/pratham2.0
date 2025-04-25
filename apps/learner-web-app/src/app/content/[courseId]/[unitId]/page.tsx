// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = () => {
  return (
    <Layout>
      <Box sx={gredientStyle}>
        <CourseUnitDetails
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
