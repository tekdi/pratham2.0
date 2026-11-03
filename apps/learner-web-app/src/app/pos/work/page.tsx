import dynamic from 'next/dynamic';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

const title = 'Learning for Work';
const description = `Learning for Work equips adolescents and youth with the skills and knowledge needed for employment and livelihoods`;

export const metadata = buildMetadata({
  title,
  description,
  image: '/images/pos_work.jpg',
  path: '/pos/work',
});

const List = dynamic(() => import('@learner/components/pos/List'), {
  ssr: false,
});

export default function PosPage() {
  return (
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
  );
}
