import dynamic from 'next/dynamic';
import React from 'react';

interface MyComponentProps {
  title: string;
  description?: string;
  onClick: () => void;
}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const MyComponent: React.FC<MyComponentProps> = () => {
  return (
    <div>
      <Content isShowLayout={false} />
    </div>
  );
};

export default MyComponent;
