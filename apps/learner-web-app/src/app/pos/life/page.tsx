import dynamic from 'next/dynamic';
import { buildPageMetadata } from '@learner/utils/seoMeta';

const title = 'Learning for Life';
const description = `Learning for Life encompasses skills and knowledge that are a part of lifelong learning like transferable skills, interests, hobbies, and creativity. These also include life skills but are not limited to them.  It emphasises environmental awareness, physical and mental well-being, and extends learning beyond scholastic subjects.`;

export async function generateMetadata() {
  return await buildPageMetadata({
    title,
    description,
    image: '/images/pos_life.jpg',
    path: '/pos/life',
  });
}

const List = dynamic(() => import('@learner/components/pos/List'), {
  ssr: false,
});

export default function PosPage() {
  return (
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
  );
}
