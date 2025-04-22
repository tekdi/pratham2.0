'use client';
import React from 'react';
import Layout from '../../components/Layout';
import LearnerCourse from './LearnerCourse';
import dynamic from 'next/dynamic';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const MyComponent: React.FC = () => {
  return (
    <Layout>
      <Grid container style={gredientStyle}>
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: '#06A816' }}>
              In Progress
            </Typography>
            <Typography variant="body1" gutterBottom>
              You have 4 Ongoing Courses
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" href="/in-progress">
                View All
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <Content
            isShowLayout={false}
            contentTabs={['Course']}
            showFilter={false}
            showSearch={false}
            showHelpDesk={false}
            filters={{
              limit: 4,
              filters: {
                identifier: [
                  'do_2142616245440921601283',
                  'do_2142600316330557441211',
                ],
              },
            }}
            hasMoreData={false}
            _config={{
              default_img: '/images/image_ver.png',
              _card: { isHideProgress: true },
            }}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ p: 4 }}>
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: '#06A816' }}>
              Level 2 Course
            </Typography>
            <Typography variant="body1" gutterBottom>
              You can boost your skills and unlock new job opportunities with
              our L2 course.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" href="/courses">
                I’m interested
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container style={gredientStyle}>
        <Grid item xs={12}>
          <LearnerCourse />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MyComponent;
