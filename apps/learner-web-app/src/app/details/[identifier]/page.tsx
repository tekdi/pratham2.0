// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '../../../components/Layout';
import dynamic from 'next/dynamic';

const ContentDetails = dynamic(() => import('@ContentDetails'), {
  ssr: false,
});
const App = () => {
  return (
    <Layout>
      <ContentDetails isShowLayout={false} />
    </Layout>
  );
};

export default App;
