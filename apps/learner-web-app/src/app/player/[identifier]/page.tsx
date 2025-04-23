// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '../../../components/Layout';
import dynamic from 'next/dynamic';
import { Grid } from '@mui/material';
import { useParams } from 'next/navigation';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const App = () => {
  const params = useParams();
  const identifier = params?.identifier; // string | string[] | undefined
  if (!identifier) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Grid container spacing={4} sx={{ p: { xs: 1, md: 4 } }}>
        <Grid item xs={12} md={8}>
          <iframe
            src={`${process.env.NEXT_PUBLIC_LEARNER_SBPLAYER}?identifier=${
              identifier as string
            }`}
            style={{
              // display: 'block',
              // padding: 0,
              border: 'none',
            }}
            width="100%"
            height="100%"
            title="Embedded Localhost"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Content
            isShowLayout={false}
            contentTabs={['content']}
            showFilter={false}
            showSearch={false}
            showHelpDesk={false}
            filters={{ limit: 4 }}
            _config={{
              _grid: {
                xs: 6,
                sm: 6,
                md: 6,
                lg: 6,
              },
              default_img: '/images/image_ver.png',
            }}
            hasMoreData={false}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default App;
