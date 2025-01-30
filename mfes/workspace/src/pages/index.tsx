import React from 'react';
import { useState } from 'react';
import CreatePage from './workspace/content/create';

function IndexPage() {
  const [selectedKey, setSelectedKey] = useState('create');
  return (
    <>
      <CreatePage />
    </>
  );
}

export default IndexPage;
