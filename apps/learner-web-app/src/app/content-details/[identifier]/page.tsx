// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '../../../components/Layout';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const ContentEnrollDetails = dynamic(() => import('@ContentEnrollDetails'), {
  ssr: false,
});
const App = () => {
  const router = useRouter();

  return (
    <Layout>
      <ContentEnrollDetails isShowLayout={false} />
    </Layout>
  );
};

export default App;
