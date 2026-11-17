// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { buildPageMetadata } from '@learner/utils/seoMeta';

const title = 'Pratham Open School Home';
const description = `Pratham Open School offers free, downloadable videos, games, reading material and stories in 15 languages for ages 1 to 18+, designed to support self-led learning and group learning through activities and projects.`;

export async function generateMetadata() {
  return await buildPageMetadata({
    title,
    description,
    image: '/images/home-page-banner.png',
    path: '/pos',
  });
}

const Home = dynamic(() => import('@learner/components/pos/Home'), {
  ssr: false,
});
const App = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default App;
