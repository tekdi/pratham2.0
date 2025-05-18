'use client';
import dynamic from 'next/dynamic';

const List = dynamic(() => import('@learner/app/pos/List'), {
  ssr: false,
});

export default function PosPage() {
  return (
    <List
      pagename="Work"
      _infoCard={{
        item: {
          description:
            'Learning for Work equips adolescents and youth with the skills and knowledge needed for employment and livelihoods',
        },
      }}
    />
  );
}
