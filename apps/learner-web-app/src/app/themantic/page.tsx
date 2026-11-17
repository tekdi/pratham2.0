import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';
import { buildPageMetadata } from '@learner/utils/seoMeta';

const title = 'Experimento India';
const description =
  'Experimento India is a part of Project Jigyaasa.';

export async function generateMetadata() {
  return await buildPageMetadata({
    title,
    description,
    image: '/images/image_ver.png',
    path: '/themantic',
  });
}

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
