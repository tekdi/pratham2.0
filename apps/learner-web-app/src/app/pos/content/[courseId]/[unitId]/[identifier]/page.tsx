// 'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import Layout from '@learner/components/pos/Layout';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier);
}

const ContentDetails = dynamic(
  () => import('@learner/components/Content/Player'),
  {
    ssr: false,
  }
);

const App: React.FC = () => {
  return (
    <Layout>
      <ContentDetails
        userIdLocalstorageName={'did'}
        contentBaseUrl="/pos/content"
      />
    </Layout>
  );
};

export default App;
