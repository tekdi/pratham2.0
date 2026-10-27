import dynamic from 'next/dynamic';
import { absoluteUrl } from '@learner/utils/seo';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import { getPillarSeoData } from '@learner/utils/API/seoContent';

const title = 'Learning for School';
const description = `Learning for School focuses on scholastic subjects, which include early years education and learning to read, write, and think. These skills are crucial for building children's confidence and dignity among their peers.`;

export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  return {
    // Section 6: page 2+ is self-canonical, never canonical to page 1.
    alternates: {
      canonical: absoluteUrl(page > 1 ? `/pos/school?page=${page}` : '/pos/school'),
    },
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
        url: `/images/pos_school.jpg`,
        width: 800,
        height: 600,
      },
    ],
      type: 'website',
    },
  };
}

const List = dynamic(() => import('@learner/components/pos/List'), {
  ssr: false,
});

export default async function PosPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const seoData = await getPillarSeoData(
    'School',
    description,
    Number(searchParams?.page) || 1
  );

  return (
    <>
      <SeoSsrContent data={seoData} />
      <List
        pagename="School"
        _content={{
          isOpenColapsed: ['contentLanguage', 'se_subDomains', 'se_subjects'],
        }}
        _infoCard={{
          item: {
            description,
          },
        }}
      />
    </>
  );
}
