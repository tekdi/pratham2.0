// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

const title = 'About Us';
const description = `Pratham undertook an exploratory study for children to understand the problem of plastic waste management in rural India. This study is a part of Pratham's Learning for Life curriculum. In this study, we covered 8400 households, in 700 villages across 70 districts, in 15 states. Findings to be released in July 2022.`;

export const metadata = buildMetadata({
  title,
  description,
  image: '/images/about-banner.png',
  path: '/pos/about-us',
});

const AboutUs = dynamic(() => import('@learner/components/pos/AboutUs'), {
  ssr: false,
});
const App = () => {
  return <AboutUs />;
};

export default App;
