'use client';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import LearnerCourse from './LearnerCourse';
import dynamic from 'next/dynamic';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';
import LTwoCourse from './LTwoCourse';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import ContentComponent from '@learner/components/Content/Content';
import { useTranslation } from '@shared-lib';

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        const res = await getTenantInfo();
        console.log('Tenant Info:', res);
        const youthnetContentFilter = res?.result.find(
          (program: any) => program.name === 'YouthNet'
        )?.contentFilter;

        console.log(youthnetContentFilter);
        setFilter(youthnetContentFilter);
        localStorage.setItem('filter', JSON.stringify(youthnetContentFilter));
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };

    fetchTenantInfo();
  }, []);
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
              {t('LEARNER_APP.L_ONE_COURSE.IN_PROGRESS_TITLE')}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {t('LEARNER_APP.L_ONE_COURSE.ONGOING_COURSES')}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="contained" color="primary" href="/in-progress">
                {t('LEARNER_APP.L_ONE_COURSE.VIEW_ALL_BUTTON')}
              </Button>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={9}>
          <ContentComponent limit={4} />
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
          <LearnerCourse _content={{ filter: filter }} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MyComponent;
