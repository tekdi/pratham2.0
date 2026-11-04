// 'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import SeoJsonLd from '@learner/components/seo/SeoJsonLd';
import { getResourceSeoData } from '@learner/utils/API/seoContent';
import { getMetadata } from '@learner/utils/API/metabaseService';
import Layout from '@learner/components/themantic/layout/Layout';

export async function generateMetadata({ params }: any) {
  return await getMetadata(
    params.identifier,
    undefined,
    `/themantic/player/${params.identifier}`
  );
}

const Player = dynamic(
  () => import('@learner/components/themantic/content/Player'),
  {
    ssr: false,
  }
);

const HomePage = async ({ params }: any) => {
  const seoData = await getResourceSeoData(params.identifier);

  return (
    <div className="thematic-page">
      <SeoJsonLd items={seoData?.jsonLd} />
      <SeoSsrContent data={seoData} />
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
