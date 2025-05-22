// pages/content-details/[identifier].tsx

import React from 'react';
import Layout from '@learner/components/Layout';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';
import { getMetadata } from '@learner/utils/API/metabaseService';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.courseId);
}

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = () => {
  return (
    <Layout sx={gredientStyle}>
      <CourseUnitDetails
        isShowLayout={false}
        _config={{
          default_img: '/images/unit.png',
          _card: { isHideProgress: true },
          _infoCard: {
            _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
            default_img: '/images/image_ver.png',
          },
          _grid: { xs: 6, sm: 4, md: 3, lg: 2.5 },
        }}
      />
    </Layout>
  );
};

export default App;
