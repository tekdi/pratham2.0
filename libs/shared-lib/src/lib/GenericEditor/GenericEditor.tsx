import React from 'react';
import dynamic from 'next/dynamic';

const UploadEditor = dynamic(() => import('@generic-editor'), {
  ssr: false,
});

export const GenericEditor = () => {
  return <UploadEditor />;
};

export default GenericEditor;