import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';
import GoogleAnalyticsTracker from '@learner/components/GoogleAnalyticsTracker/GoogleAnalyticsTracker';

const Page = () => {
  return (
    <>
      <GoogleAnalyticsTracker />
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </>
  );
};

export default Page;
