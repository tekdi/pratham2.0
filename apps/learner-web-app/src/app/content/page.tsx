'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
import LearnerCourse from '@learner/components/Content/LearnerCourse';
import { Box, Button, Grid, Typography } from '@mui/material';
import { gredientStyle } from '@learner/utils/style';
import LTwoCourse from '@learner/components/Content/LTwoCourse';
import { useEffect, useState } from 'react';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import ContentComponent from '@learner/components/Content/Content';
import { useTranslation } from '@shared-lib';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';

const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});
  const [isLogin, setIsLogin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchTenantInfo = async () => {
      if (checkAuth()) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
      try {
        const res = await getTenantInfo();
        const youthnetContentFilter = res?.result.find(
          (program: any) => program.name === 'YouthNet'
        )?.contentFilter;
        setFilter({ filters: youthnetContentFilter });
        localStorage.setItem('filter', JSON.stringify(youthnetContentFilter));
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };
    fetchTenantInfo();
  }, []);

  return (
    <Layout isLoadingChildren={isLogin === null}>
      {isLogin && (
        <>
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
                  <Button
                    variant="contained"
                    color="primary"
                    href="/in-progress"
                  >
                    {t('LEARNER_APP.L_ONE_COURSE.VIEW_ALL_BUTTON')}
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <ContentComponent />
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
        </>
      )}

      <Grid container style={gredientStyle}>
        <Grid item xs={12}>
          <LearnerCourse _content={{ filters: filter }} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MyComponent;
