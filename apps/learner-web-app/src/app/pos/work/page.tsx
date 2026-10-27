import dynamic from 'next/dynamic';
import { absoluteUrl } from '@learner/utils/seo';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import { getPillarSeoData } from '@learner/utils/API/seoContent';

const title = 'Learning for Work';
const description = `Learning for Work equips adolescents and youth with the skills and knowledge needed for employment and livelihoods`;

export function generateMetadata({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams?.page) || 1;
  return {
    // Section 6: page 2+ is self-canonical, never canonical to page 1.
    alternates: {
      canonical: absoluteUrl(page > 1 ? `/pos/work?page=${page}` : '/pos/work'),
    },
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
        url: `/images/pos_work.jpg`,
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
    'Work',
    description,
    Number(searchParams?.page) || 1
  );

  return (
    <>
      <SeoSsrContent data={seoData} />
      <List
      pagename="Work"
      _content={{ isOpenColapsed: ['contentLanguage', 'se_subDomains', 'se_subjects'] }}
      _infoCard={{
        item: {
          description:
            'Learning for Work equips adolescents and youth with the skills and knowledge needed for employment and livelihoods',
        },
      }}
      />
    </>
  );
}
