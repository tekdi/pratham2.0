// 'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import Layout from '@learner/components/themantic/layout/Layout';

// Bare player route: the same content is also served under its course and
// unit, so this one is kept out of the index.
export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier, undefined, {
    path: `/themantic/player/${params.identifier}`,
    noindex: true,
  });
}

const Player = dynamic(
  () => import('@learner/components/themantic/content/Player'),
  {
    ssr: false,
  }
);

const HomePage: React.FC = () => {
  return (
    <div className="thematic-page">
      <Layout sx={{ backgroundImage: 'url(/images/energy-background.png)' }}>
        <Player
          contentBaseUrl="/themantic"
          _config={{
            player: {
              trackable: false,
            },
            default_img: '/images/image_ver.png',
          }}
        />
      </Layout>
    </div>
  );
};

export default HomePage;
