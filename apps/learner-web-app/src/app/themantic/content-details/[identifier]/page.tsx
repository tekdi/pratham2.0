import React from 'react';

import List from '@learner/components/themantic/content/List';
import ContentDetailsPage from '@learner/components/themantic/content/enrollment-details';
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
    path: `/themantic/content-details/${params.identifier}`,
    type: 'article',
    // Duplicate of the nested course/unit/content URL, which is the canonical
    // one. The parent course is not resolvable from a bare content id, so this
    // route cannot redirect or point a canonical at it.
    noindex: true,
  });
}

const page = async ({ params }: any) => {
  const content = await getContent(params?.identifier);
  const path = `/themantic/content-details/${params?.identifier}`;
  const crumbs = [
    { name: 'Experimento India', path: '/themantic' },
    { name: content?.name, path },
  ];

  return (
    <div className="thematic-page">
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
      <ContentDetailsPage />
    </div>
  );
};

export default page;
