import React from 'react';
import dynamic from 'next/dynamic';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import { getResourceSeoData } from '@learner/utils/API/seoContent';
import { getMetadata } from '@learner/utils/API/metabaseService';

export async function generateMetadata({ params }: any) {
  return await getMetadata(
    params.identifier,
    undefined,
    `/pos/player/${params.identifier}`
  );
}

const Player = dynamic(() => import('@learner/components/Content/Player'), {
  ssr: false,
});

const App = async ({ params }: any) => {
  const seoData = await getResourceSeoData(params.identifier);
  return (
    <>
      <SeoSsrContent data={seoData} />
      <Player
      userIdLocalstorageName="did"
      contentBaseUrl="/pos/content"
      _config={{
        player: {
          trackable: false,
        },
      }}
    />
    </>
  );
};

export default App;
