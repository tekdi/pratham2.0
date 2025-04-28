// 'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier);
}

const ContentDetails = dynamic(
  () => import('@learner/components/Content/Player'),
  {
    ssr: false,
  }
);

const HomePage: React.FC = () => {
  return <ContentDetails />;
};

export default HomePage;
