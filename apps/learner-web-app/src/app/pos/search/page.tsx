import { buildMetadata } from '@learner/utils/seo/buildMetadata';
import SearchClient from './SearchClient';
import { getCourseList } from '@learner/utils/seo/contentData';
import SeoShell from '@learner/components/seo/SeoShell';
import SeoFallback from '@learner/components/seo/SeoFallback';

// Cache the rendered page for an hour instead of re-fetching per request.
export const revalidate = 3600;

// Canonical ignores the ?q= and filter params so every search combination
// does not become its own indexable URL.
export const metadata = buildMetadata({
  title: 'Free Online Courses & Learning Resources',
  description:
    'Browse free courses, videos, games, stories and reading material from Pratham Open School. Filter by language, subject and age group.',
  path: '/pos/search',
});

export default async function PosSearchPage() {
  const courses = await getCourseList();

  return (
    <>
      <SeoFallback>
        <SeoShell
          title="Free Online Courses & Learning Resources"
          description="Browse free courses, videos, games, stories and reading material from Pratham Open School."
          crumbs={[
            { name: 'Pratham Open School', path: '/pos' },
            { name: 'Courses', path: '/pos/search' },
          ]}
          items={courses.map((course: any) => ({
            name: course.name,
            path: `/pos/content/${course.identifier}`,
          }))}
          itemsLabel="Courses"
        />
      </SeoFallback>
      <SearchClient />
    </>
  );
}
