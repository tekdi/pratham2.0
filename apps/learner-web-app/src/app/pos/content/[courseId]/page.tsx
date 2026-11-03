// pages/content-details/[identifier].tsx
import React from 'react';
import Layout from '@learner/components/pos/Layout';
import dynamic from 'next/dynamic';
import { getMetadata } from '@learner/utils/API/metabaseService';
import {
  getContentTrail,
  childrenOf,
  isCollection,
} from '@learner/utils/seo/contentData';
import { courseJsonLd, breadcrumbJsonLd } from '@learner/utils/seo/jsonLd';
import JsonLd from '@learner/components/seo/JsonLd';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

export async function generateMetadata({ params }: any) {
  return await getMetadata(params.courseId, undefined, {
    path: `/pos/content/${params.courseId}`,
  });
}

const CourseUnitDetails = dynamic(() => import('@CourseUnitDetails'), {
  ssr: false,
});
const App = async ({ params }: any) => {
  const { course, crumbs, coursePath } = await getContentTrail({
    homePath: '/pos',
    homeName: 'Pratham Open School',
    coursePathBase: '/pos/content',
    courseId: params.courseId,
  });

  const units = childrenOf(course)
    .filter(isCollection)
    .map((unit: any) => ({
      name: unit.name,
      path: `${coursePath}/${unit.identifier}`,
    }));

  return (
    <Layout>
      {course && (
        <JsonLd
          data={[
            courseJsonLd({
              name: course.name,
              description: course.description,
              path: coursePath,
              image: course.posterImage || course.appIcon,
              language: course.contentLanguage,
              parts: units,
            }),
            breadcrumbJsonLd(crumbs),
          ]}
        />
      )}
      <SeoFallback>
        <SeoShell
          title={course?.name}
          description={course?.description}
          crumbs={crumbs}
          items={units}
          itemsLabel="Units in this course"
        />
      </SeoFallback>
      <CourseUnitDetails
        isShowLayout={false}
        _config={{
          isEnrollmentRequired: false,
          userIdLocalstorageName: 'did',
          contentBaseUrl: '/pos/content',
          default_img: '/images/unit.png',
          _card: { isHideProgress: true, isHideProgressStatus: true },
          _infoCard: {
            _cardMedia: { maxHeight: { xs: '200px', sm: '280px' } },
            default_img: '/images/image_ver.png',
          },
          _grid: { xs: 6, sm: 4, md: 3, lg: 2.5 },
        }}
      />
    </Layout>
  );
};

export default App;
