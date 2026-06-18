import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';

const title = 'Experimento India';
export const metadata = {
  title,
};

const Page = () => {
  return (
    <div className="thematic-page">
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </div>
  );
};

export default Page;
