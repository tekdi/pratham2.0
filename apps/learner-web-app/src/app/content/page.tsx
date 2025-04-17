'use client';
import dynamic from 'next/dynamic';
import React from 'react';
import Layout from '../../components/Layout';
import { Box, Stack } from '@mui/material';
import { FilterForm } from '@shared-lib';

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
    <Layout>
      <Stack direction="row" sx={{ p: 4, gap: 4 }}>
        <Box sx={{ flex: 3 }}>
          <Box sx={{ position: 'sticky', top: 0 }}>
            <FilterForm />
          </Box>
        </Box>
        <Box sx={{ flex: 9 }}>
          <Content
            isShowLayout={false}
            contentTabs={['courses']}
            showFilter={false}
          />
        </Box>
      </Stack>
    </Layout>
  );
};

export default MyComponent;
