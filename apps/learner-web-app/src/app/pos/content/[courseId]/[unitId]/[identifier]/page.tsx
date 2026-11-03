// 'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import { getContentTrail } from '@learner/utils/seo/contentData';
import { contentJsonLd, breadcrumbJsonLd } from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';
import Layout from '@learner/components/pos/Layout';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier, undefined, {
    path: `/pos/content/${params.courseId}/${params.unitId}/${params.identifier}`,
    type: 'article',
  });
}

const Player = dynamic(() => import('@learner/components/Content/Player'), {
  ssr: false,
});

const App = async ({ params }: any) => {
  const { content, crumbs, unitPath } = await getContentTrail({
    homePath: '/pos',
    homeName: 'Pratham Open School',
    coursePathBase: '/pos/content',
    courseId: params.courseId,
    unitId: params.unitId,
    identifier: params.identifier,
  });

  return (
    <Layout>
      {content && (
        <JsonLd
          data={[
            contentJsonLd({
              name: content.name,
              description: content.description,
              path: `${unitPath}/${params.identifier}`,
              image: content.posterImage || content.appIcon,
              mimeType: content.mimeType,
              language: content.contentLanguage,
              contentUrl: content.artifactUrl,
            }),
            breadcrumbJsonLd(crumbs),
          ]}
        />
      )}
      <SeoFallback>
        <SeoShell
          title={content?.name}
          description={content?.description}
          crumbs={crumbs}
        />
      </SeoFallback>
      <Player
        userIdLocalstorageName={'did'}
        contentBaseUrl="/pos/content"
        _config={{
          player: {
            trackable: false,
          },
          courseUnitDetails: {
            contentBaseUrl: '/pos/content',
            isEnrollmentRequired: false,
            _card: {
              isHideProgressStatus: true,
            },
          },
        }}
      />
    </Layout>
  );
};

export default App;
