'use client';
import React from 'react';
import Layout from '../../components/Layout';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';
import dynamic from 'next/dynamic';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const InProgress: React.FC = () => {
  const router = useRouter();

  const onBackClick = () => {
    router.back();
  };

  return (
    <Layout>
      <Grid container style={gredientStyle}>
        <Grid item xs={12} sx={{ p: 5, pb: 1 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBackClick}
            sx={{
              textTransform: 'none',
              color: '#1E1B16',
              fontSize: '16px',
            }}
          >
            <Typography fontSize={'22px'} fontWeight={400}>
              {'All In Progress Courses'}
            </Typography>
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ p: 5, pt: 0 }}>
          <Content
            isShowLayout={false}
            contentTabs={['Course']}
            showFilter={false}
            showSearch={false}
            showHelpDesk={false}
            filters={{
              limit: 8,
              filters: {
                identifier: [
                  'do_2142616245440921601283',
                  'do_2142600316330557441211',
                ],
              },
            }}
            _config={{
              default_img: '/images/image_ver.png',
              _card: { isHideProgress: true },
            }}
          />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default InProgress;
