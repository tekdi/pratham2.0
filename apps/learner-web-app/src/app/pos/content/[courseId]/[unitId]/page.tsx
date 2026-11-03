// pages/content-details/[identifier].tsx

import React from 'react';
import Layout from '@learner/components/pos/Layout';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import { getContentTrail, childrenOf } from '@learner/utils/seo/contentData';
import { itemListJsonLd, breadcrumbJsonLd } from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.courseId, params.unitId, {
    path: `/pos/content/${params.courseId}/${params.unitId}`,
  });
}

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = async ({ params }: any) => {
  const { unit, crumbs, unitPath } = await getContentTrail({
    homePath: '/pos',
    homeName: 'Pratham Open School',
    coursePathBase: '/pos/content',
    courseId: params.courseId,
    unitId: params.unitId,
  });

  const items = childrenOf(unit).map((item: any) => ({
    name: item.name,
    path: `${unitPath}/${item.identifier}`,
  }));

  return (
    <Layout>
      {unit && (
        <JsonLd
          data={[itemListJsonLd(items), breadcrumbJsonLd(crumbs)]}
        />
      )}
      <SeoFallback>
        <SeoShell
          title={unit?.name}
          description={unit?.description}
          crumbs={crumbs}
          items={items}
          itemsLabel="In this unit"
        />
      </SeoFallback>
      <CourseUnitDetails
        isShowLayout={false}
        _config={{
          isEnrollmentRequired: false,
          userIdLocalstorageName: 'did',
          contentBaseUrl: '/pos/content',
          default_img: '/images/image_ver.png',
          _card: { isHideProgress: true, isHideProgressStatus: true },
          _infoCard: {
            _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
            default_img: '/images/image_ver.png',
          },
        }}
      />
    </Layout>
  );
};

export default App;
