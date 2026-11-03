import React, { Suspense } from 'react';

import List from '@learner/components/themantic/content/List';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';
import { getCourseList } from '@learner/utils/seo/contentData';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

export const metadata = buildMetadata({
  title: 'Experimento India — Science Courses & Experiments for Schools',
  description:
    'Hands-on science courses and experiments on energy, environment and health for schools, free from Experimento India.',
  path: '/themantic',
});

const Page = async () => {
  const courses = await getCourseList();

  return (
    <div className="thematic-page">
      <SeoFallback>
        <SeoShell
          title="Experimento India"
          description="Hands-on science courses and experiments on energy, environment and health for schools and teachers."
          items={courses.map((course: any) => ({
            name: course.name,
            path: `/themantic/${course.identifier}`,
          }))}
          itemsLabel="Courses"
        />
      </SeoFallback>
      <Suspense fallback={<div>Loading...</div>}>
        <List />
      </Suspense>
    </div>
  );
};

export default Page;
