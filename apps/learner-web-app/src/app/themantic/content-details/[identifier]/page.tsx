import React from 'react';

import ContentDetailsPage from '@learner/components/themantic/content/enrollment-details';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import SeoJsonLd from '@learner/components/seo/SeoJsonLd';
import { getCourseSeoData } from '@learner/utils/API/seoContent';
import { getMetadata } from '@learner/utils/API/metabaseService';

export async function generateMetadata({ params }: any) {
  // Same id serves the course page, which is the canonical URL for this content.
  return await getMetadata(
    params.identifier,
    undefined,
    `/themantic/${params.identifier}`
  );
}

const page = async ({ params }: any) => {
  const seoData = await getCourseSeoData(params.identifier);

  return (
    <div className="thematic-page">
      <SeoJsonLd items={seoData?.jsonLd} />
      <SeoSsrContent data={seoData} />
      <ContentDetailsPage />
    </div>
  );
};

export default page;
