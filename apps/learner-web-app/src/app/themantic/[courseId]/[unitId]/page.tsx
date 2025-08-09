// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import Layout from '@learner/components/themantic/layout/Layout';
import { CardComponent } from '@learner/components/themantic/content/List';
import { Box, Container } from '@mui/material';
import SubHeader from '@learner/components/themantic/subHeader/SubHeader';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.courseId);
}

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = ({ params }: { params: { unitId: string } }) => {
  // Check if this is the "Basics of Energy" unit
  const isBasicsOfEnergyUnit = params.unitId === 'do_21434524858639155211476';

  return (
    <div className="thematic-page">
      <Layout
        sx={{
          backgroundImage: 'url(/images/energy-background.png)',
        }}
      >
        <SubHeader showFilter={false} />
        <Box className='bs-container bs-px-5'>
          <Box
            sx={{
              '& .css-17kujh3': {
                overflowY: 'unset !important',
              },
            }}
          >
            <CourseUnitDetails
              isShowLayout={false}
              isHideInfoCard={true}
              showBreadCrumbs={{
                prefix: [{ label: 'Home', link: '/themantic' }],
              }}
              _box={{ px: { xs: 0, sm: 0, md: 0 } }}
              _config={{
                contentBaseUrl: '/themantic',
                _grid: {
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: 4,
                  xl: 4,
                },
                _containerGrid: {
                  spacing: { xs: 5, sm: 5, md: 5 },
                },
                default_img: '/images/image_ver.png',
                _card: {
                  cardComponent: CardComponent,
                  titleFontSize: '14px',
                  fontWeight: 600,
                  titleColor: 'black',
                },
                _infoCard: {
                  _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
                  default_img: '/images/unit.png',
                },
              }}
            />
          </Box>
        </Box>
      </Layout>
    </div>
  );
};

export default App;
