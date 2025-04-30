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
import { CompleteProfileBanner } from '@learner/components/CompleteProfileBanner/CompleteProfileBanner';
import { profileComplitionCheck } from '@learner/utils/API/userService';
import { usePathname } from 'next/navigation';

const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [filter, setFilter] = useState<object | null>();
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [isShow, setIsShow] = useState(false);
  const [isProfileCard, setIsProfileCard] = useState(false);

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        if (checkAuth()) {
          setIsLogin(true);
          const result = await profileComplitionCheck();
          setIsProfileCard(!result);
        } else {
          setFilter({});
          setIsLogin(false);
        }
        const res = await getTenantInfo();
        const youthnetContentFilter = res?.result.find(
          (program: any) => program.name === 'YouthNet'
        );

        const storedChannelId = localStorage.getItem('channelId');
        if (!storedChannelId) {
          const channelId = youthnetContentFilter?.channelId;
          if (channelId) {
            localStorage.setItem('channelId', channelId);
          }
        }

        const storedTenantId = localStorage.getItem('tenantId');
        if (!storedTenantId) {
          const tenantId = youthnetContentFilter?.tenantId;
          if (tenantId) {
            localStorage.setItem('tenantId', tenantId);
          }
        }

        const storedCollectionFramework = localStorage.getItem(
          'collectionFramework'
        );
        if (!storedCollectionFramework) {
          const collectionFramework =
            youthnetContentFilter?.collectionFramework;
          if (collectionFramework) {
            localStorage.setItem('collectionFramework', collectionFramework);
          }
        }

        setFilter({ filters: youthnetContentFilter?.contentFilter });
        localStorage.setItem(
          'filter',
          JSON.stringify(youthnetContentFilter?.contentFilter)
        );
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };
    fetchTenantInfo();
  }, [pathname]);

  return (
    <Layout isLoadingChildren={isLogin === null} sx={gredientStyle}>
      {isProfileCard && <CompleteProfileBanner />}

      {isLogin && (
        <>
          <Grid
            container
            style={gredientStyle}
            {...(isShow ? {} : { sx: { display: 'none' } })}
          >
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
              <ContentComponent
                getContentData={(e: any) => setIsShow(e.count)}
              />
            </Grid>
          </Grid>

          <Grid container>
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
          {filter && <LearnerCourse _content={{ filters: filter }} />}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MyComponent;
