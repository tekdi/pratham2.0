import React from 'react';
import dynamic from 'next/dynamic';

const CollectionEditor = dynamic(() => import('@collection'), {
  ssr: false,
});

export const Collection = () => {
  return <CollectionEditor />;
};

export default Collection;
