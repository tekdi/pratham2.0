import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import SeoJsonLd from '@learner/components/seo/SeoJsonLd';
import { getCourseListSeoData } from '@learner/utils/API/seoContent';
import { absoluteUrl } from '@learner/utils/seo';

const title = 'Experimento India — Science Courses & Experiments for Schools';
const description =
  'Hands-on science courses and experiments on energy, environment and health for schools and teachers. Free from Experimento India.';

export const metadata = {
  title,
  description,
  alternates: { canonical: absoluteUrl('/themantic') },
  openGraph: {
    title,
    description,
    url: absoluteUrl('/themantic'),
    images: [{ url: absoluteUrl('/images/image_ver.png'), width: 1200, height: 630 }],
  },
};

const Page = async () => {
  const seoData = await getCourseListSeoData('Experimento India', description);

  return (
    <div className="thematic-page">
      <SeoJsonLd items={seoData?.jsonLd} />
      <SeoSsrContent data={seoData} />
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </div>
  );
};

export default Page;
