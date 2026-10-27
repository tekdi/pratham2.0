import dynamic from 'next/dynamic';
import { absoluteUrl } from '@learner/utils/seo';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import SeoJsonLd from '@learner/components/seo/SeoJsonLd';
import { getPillarSeoData } from '@learner/utils/API/seoContent';

const title = 'Learning for Life';
const description = `Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.`;

export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  return {
    // Section 6: page 2+ is self-canonical, never canonical to page 1.
    alternates: {
      canonical: absoluteUrl(page > 1 ? `/pos/life?page=${page}` : '/pos/life'),
    },
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
        url: `/images/pos_life.jpg`,
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
    'Life',
    description,
    Number(searchParams?.page) || 1
  );

  return (
    <>
      <SeoJsonLd items={seoData?.jsonLd} />
      <SeoSsrContent data={seoData} />
      <List
      pagename="Life"
      _content={{ isOpenColapsed: ['contentLanguage', 'se_subDomains', 'se_subjects'] }}
      _infoCard={{
        item: {
          description:
            'Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.',
        },
      }}
      />
    </>
  );
}
