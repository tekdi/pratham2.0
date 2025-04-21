// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '../../../components/Layout';
import dynamic from 'next/dynamic';
import { Box, Grid, Stack } from '@mui/material';

const Player = dynamic(() => import('@ContentPlayer'), {
  ssr: false,
});

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const App = () => {
  return (
    <Layout>
      <Grid container spacing={4} sx={{ p: { xs: 1, md: 4 } }}>
        <Grid item xs={12} md={8}>
          <Player />
        </Grid>
        <Grid item xs={12} md={4}>
          <Content
            isShowLayout={false}
            contentTabs={['content']}
            showFilter={false}
            showSearch={false}
            showHelpDesk={false}
            filters={{ limit: 4 }}
            _grid={{ xs: 6, sm: 6, md: 6, lg: 6 }}
            hasMoreData={false}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default App;
