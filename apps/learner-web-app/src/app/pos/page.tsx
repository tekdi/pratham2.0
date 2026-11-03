// pages/content-details/[identifier].tsx

import React from 'react';
import dynamic from 'next/dynamic';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';
import { getCourseList } from '@learner/utils/seo/contentData';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Pratham Open School — Free Learning Videos, Games & Stories',
  description: `Pratham Open School offers free, downloadable videos, games, reading material and stories in 15 languages for ages 1 to 18+, designed to support self-led learning and group learning through activities and projects.`,
  image: '/images/home-page-banner.png',
  path: '/pos',
});

const Home = dynamic(() => import('@learner/components/pos/Home'), {
  ssr: false,
});
const App = async () => {
  const courses = await getCourseList();

  return (
    <>
      <SeoFallback>
        <SeoShell
          title="Pratham Open School"
          description="Free learning videos, games, stories and reading material in 15 Indian languages for ages 1 to 18+."
          items={courses.map((course: any) => ({
            name: course.name,
            path: `/pos/content/${course.identifier}`,
          }))}
          itemsLabel="Courses"
        />
      </SeoFallback>
      <Home />
    </>
  );
};

export default App;
