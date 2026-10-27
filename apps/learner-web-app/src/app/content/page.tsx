// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { absoluteImage } from '@learner/utils/seo';

const title = 'Welcome to Pratham Learning Platform';
const description = `Explore and resume your in-progress L1 courses, update your profile, and find new L1 courses using filters and search.`;

export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: absoluteImage('/logo.png'),
        width: 800,
        height: 600,
      },
    ],
    type: 'website',
  },
};

const L1ContentList = dynamic(
  () => import('@learner/components/Content/L1ContentList'),
  {
    ssr: false,
  }
);
const App = () => {
  return <L1ContentList />;
};

export default App;
