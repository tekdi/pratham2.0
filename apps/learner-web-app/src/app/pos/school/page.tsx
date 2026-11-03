import dynamic from 'next/dynamic';
import { buildMetadata } from '@learner/utils/seo/buildMetadata';

const title = 'Learning for School';
const description = `Learning for School focuses on scholastic subjects, which include early years education and learning to read, write, and think. These skills are crucial for building children's confidence and dignity among their peers.`;

export const metadata = buildMetadata({
  title,
  description,
  image: '/images/pos_school.jpg',
  path: '/pos/school',
});

const List = dynamic(() => import('@learner/components/pos/List'), {
  ssr: false,
});

export default function PosPage() {
  return (
    <List
      pagename="School"
      _content={{ isOpenColapsed: ['contentLanguage', 'se_subDomains', 'se_subjects'] }}
      _infoCard={{
        item: {
          description:
            "Learning for School focuses on scholastic subjects, which include early years education and learning to read, write, and think. These skills are crucial for building children's confidence and dignity among their peers.",
        },
      }}
    />
  );
}
