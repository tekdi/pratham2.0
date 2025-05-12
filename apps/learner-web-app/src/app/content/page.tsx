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
  const [filter, setFilter] = useState<Record<string, any> | null>(null);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
        setTimeout(() => {
          setFilter({ filters: youthnetContentFilter?.contentFilter });
          localStorage.setItem(
            'filter',
            JSON.stringify(youthnetContentFilter?.contentFilter)
          );
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Failed to fetch tenant info:', error);
      }
    };
    fetchTenantInfo();
  }, [pathname]);
  console.log(filter?.filters?.domain, 'sagar');
  return (
    <Layout isLoadingChildren={isLoading} sx={gredientStyle}>
      {isProfileCard && <CompleteProfileBanner />}
      {isLogin && (
        <>
          <Box
            sx={{
              height: 24,
              display: 'flex',
              alignItems: 'center',
              py: '36px',
              px: '34px',
              bgcolor: '#fff',
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: 16,
                lineHeight: '24px',
                letterSpacing: '0.15px',
                verticalAlign: 'middle',
                color: '#1F1B13',
              }}
            >
              <span role="img" aria-label="wave">
                👋
              </span>
              Welcome, {localStorage.getItem('firstName')}!
            </Typography>
          </Box>
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
                px: '48px',
                py: '32px',
                gap: 3,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{
                    fontFamily: 'Poppins',
                    fontWeight: 400,
                    fontSize: '22px',
                    lineHeight: '28px',
                    letterSpacing: '0px',
                    verticalAlign: 'middle',
                    color: '#06A816',
                  }}
                >
                  {t('LEARNER_APP.L_ONE_COURSE.IN_PROGRESS_TITLE')}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  sx={{
                    fontSize: 16,
                  }}
                >
                  {t('LEARNER_APP.L_ONE_COURSE.ONGOING_COURSES').replace(
                    '{count}',
                    isShow?.toString()
                  )}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                <Button variant="contained" color="primary" href="/in-progress">
                  {t('LEARNER_APP.L_ONE_COURSE.VIEW_ALL_BUTTON')}
                </Button>
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
          {filter && (
            <LearnerCourse
              title={'LEARNER_APP.COURSE.GET_STARTED'}
              _content={{
                staticFilter: {
                  se_domains:
                    typeof filter.filters?.domain === 'string'
                      ? [filter.filters?.domain]
                      : filter.filters?.domain,
                  program:
                    typeof filter.filters?.program === 'string'
                      ? [filter.filters?.program]
                      : filter.filters?.program,
                },
              }}
            />
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default MyComponent;
