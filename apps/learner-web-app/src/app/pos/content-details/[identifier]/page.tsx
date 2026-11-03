// pages/content-details/[identifier].tsx

import React from 'react';
import Layout from '@learner/components/pos/Layout';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { getMetadata } from '@learner/utils/API/metabaseService';
import { getContent } from '@learner/utils/seo/contentData';
import { contentJsonLd, breadcrumbJsonLd } from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.identifier, undefined, {
    path: `/pos/content-details/${params.identifier}`,
    type: 'article',
    // Duplicate of the nested course/unit/content URL, which is the canonical
    // one. The parent course is not resolvable from a bare content id, so this
    // route cannot redirect or point a canonical at it.
    noindex: true,
  });
}
const ContentEnrollDetails = dynamic(() => import('@ContentEnrollDetails'), {
  ssr: false,
});
const App = async ({ params }: any) => {
  const content = await getContent(params.identifier);
  const path = `/pos/content-details/${params.identifier}`;
  const crumbs = [
    { name: 'Pratham Open School', path: '/pos' },
    { name: content?.name, path },
  ];

  return (
    <Layout>
      {content && (
        <JsonLd
          data={[
            contentJsonLd({
              name: content.name,
              description: content.description,
              path,
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
      <Box sx={{ paddingBottom: '32px' }}>
        <ContentEnrollDetails
          isShowLayout={false}
          _config={{
            isEnrollmentRequired: false,
            userIdLocalstorageName: 'did',
            contentBaseUrl: '/pos/content',
            default_img: '/images/image_ver.png',
            _infoCard: {
              default_img: '/images/image_ver.png',
              _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
            },
          }}
        />
      </Box>
    </Layout>
  );
};

export default App;
