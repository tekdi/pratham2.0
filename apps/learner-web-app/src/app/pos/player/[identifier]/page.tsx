import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';

// Bare player route: the same content is also served under its course and
// unit, so this one is kept out of the index.
export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier, undefined, {
    path: `/pos/player/${params.identifier}`,
    noindex: true,
  });
}

const Player = dynamic(() => import('@learner/components/Content/Player'), {
  ssr: false,
});

const App: React.FC = () => {
  return (
    <Player
      userIdLocalstorageName="did"
      contentBaseUrl="/pos/content"
      _config={{
        player: {
          trackable: false,
        },
      }}
    />
  );
};

export default App;
