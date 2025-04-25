// pages/content-details/[identifier].tsx

'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';
import { useParams } from 'next/navigation';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const App = () => {
  const params = useParams();
  const { identifier, courseId, unitId } = params; // string | string[] | undefined
  if (!identifier) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          p: { xs: 1, md: 4 },
        }}
      >
        <Box
          sx={{
            flex: { xs: 1, sm: 1, md: 8 },
          }}
        >
          <iframe
            src={`${
              process.env.NEXT_PUBLIC_LEARNER_SBPLAYER
            }?identifier=${identifier}${
              courseId && unitId ? `&courseId=${courseId}&unitId=${unitId}` : ''
            }`}
            style={{
              // display: 'block',
              // padding: 0,
              border: 'none',
              height: 'calc(100vh - 20px)',
            }}
            width="100%"
            height="100%"
            title="Embedded Localhost"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: { xs: 1, sm: 1, md: 4 },
          }}
        >
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
        </Box>
      </Box>
    </Layout>
  );
};

export default App;
