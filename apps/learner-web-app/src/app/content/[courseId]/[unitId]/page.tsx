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
      <Box>
        <CourseUnitDetails
          isShowLayout={false}
          _config={{
            default_img: '/images/image_ver.png',
            _card: { isHideProgress: true },
            _infoCard: {
              _cardMedia: { maxHeight: '279px' },
              default_img: '/images/image_ver.png',
            },
          }}
        />
      </Box>
    </Layout>
  );
};

export default App;
