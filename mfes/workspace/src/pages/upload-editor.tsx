import dynamic from 'next/dynamic';

const GenericEditor = dynamic(() => import('../components/GenericEditor'), {
  ssr: false,
});

const UploadEditor = () => {
  return <GenericEditor />;
};

export default UploadEditor;
