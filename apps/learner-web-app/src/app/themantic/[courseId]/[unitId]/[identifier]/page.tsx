// 'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import Layout from '@learner/components/themantic/layout/Layout';
import SubHeader from '@learner/components/themantic/subHeader/SubHeader';
import { Box } from '@mui/material';
import { hierarchyAPI } from '@content-mfes/services/Hierarchy';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier);
}

const Player = dynamic(
  () => import('@learner/components/themantic/content/Player'),
  {
    ssr: false,
  }
);

const HomePage = async ({ params }: { params: { courseId: string; unitId: string; identifier: string } }) => {
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
    <Box className="thematic-page">
      <Layout sx={backgroundSx}>
        <SubHeader showFilter={false} />
        <Player
          contentBaseUrl="/themantic"
          _config={{
            player: {
              trackable: false,
            },
          }}
        />
      </Layout>
    </Box>
  );
};

export default HomePage;
