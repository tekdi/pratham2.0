'use client';
import dynamic from 'next/dynamic';

const List = dynamic(() => import('@learner/app/pos/List'), {
  ssr: false,
});

export default function PosPage() {
  return <List pagename="Life" />;
}
