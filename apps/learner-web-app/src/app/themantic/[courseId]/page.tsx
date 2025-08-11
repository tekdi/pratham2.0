// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import Layout from '@learner/components/themantic/layout/Layout';
import { CardComponent } from '@learner/components/themantic/content/List';
import { Box, Container } from '@mui/material';
import SubHeader from '@learner/components/themantic/subHeader/SubHeader';
import { cookies } from 'next/headers';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.courseId);
}



const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});

const App = async ({ params }: any) => {
  const courseId = params?.courseId;
  let backgroundSx: any = { backgroundImage: "url(/images/energy-background.png)" };

  if (courseId) {
    try {
      const data = await hierarchyAPI(courseId, { mode: 'edit' });
      const name = data?.name?.trim();
      if (name === 'Energy') {
        backgroundSx = { backgroundImage: "url(/images/energy-background.png)" };
      } else if (name === 'Environment') {
        backgroundSx = { backgroundImage: "url(/images/environment-background.png)" };
      } else if (name === 'Health') {
        backgroundSx = { backgroundImage: "url(/images/healthbackground.png)" };
      }
      console.log('backgroundSx', backgroundSx);
      console.log('name', name);
    } catch (e) {
      // fallback to default background
    }
  }

  return (
    <div className="thematic-page">
      <Layout sx={backgroundSx}>
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
                default_img: '/images/image_ver.png',
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
                isEnrollmentRequired: false,
                _card: {
                  cardComponent: CardComponent,
                  titleFontSize: '14px',
                  fontWeight: 700,
                  titleColor: 'black',
                },
                _infoCard: {
                  _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
                  default_img: '/images/image_ver.png',
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
