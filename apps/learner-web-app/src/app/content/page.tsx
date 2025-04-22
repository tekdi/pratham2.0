'use client';
import React from 'react';
import Layout from '../../components/Layout';
import LearnerCourse from './LearnerCourse';
import dynamic from 'next/dynamic';
import { Box, Button, Grid, Typography } from '@mui/material';
import LTwoCourse from './LTwoCourse';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});
const gredientStyle = {
  backgroundImage: 'linear-gradient(#FFFDF7, #F8EFDA)',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundSize: 'cover',
};

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
              <Button variant="contained" color="primary" href="/courses">
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
            filters={{ limit: 4 }}
            hasMoreData={false}
          />
        </Grid>
      </Grid>
      <Grid container sx={{ p: 4 }}>
        <Grid
          item
          xs={12}
          md={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <LTwoCourse />
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
