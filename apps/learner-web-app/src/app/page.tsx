// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';

const Home = dynamic(() => import('@learner/app/landing/page'), {
  ssr: false,
});
const App = () => {
  return <Home />;
};

export default App;
