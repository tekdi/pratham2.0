import dynamic from 'next/dynamic';
import SeoSsrContent from '@learner/components/seo/SeoSsrContent';
import { getPillarSeoData } from '@learner/utils/API/seoContent';

const title = 'Learning for Life';
const description = `Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.`;

export const metadata = {
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

const List = dynamic(() => import('@learner/components/pos/List'), {
  ssr: false,
});

export default async function PosPage() {
  const seoData = await getPillarSeoData('Life', description);

  return (
    <>
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
