'use client';
import React from 'react';
import Layout from '@learner/components/Layout';
// import LearnerCourse from '@learner/components/Content/LearnerCourse';
import {
  Box,
  Button,
  Grid,
  Typography,
  Link,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { gredientStyle } from '@learner/utils/style';
import LTwoCourse from '@learner/components/Content/LTwoCourse';
import { useEffect, useState } from 'react';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import ContentComponent from '@learner/components/Content/CommonInprogressContent';
import { useTranslation } from '@shared-lib';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import { CompleteProfileBanner } from '@learner/components/CompleteProfileBanner/CompleteProfileBanner';
import { profileComplitionCheck } from '@learner/utils/API/userService';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InfoIcon from '@mui/icons-material/Info';
import { TenantName } from '../../utils/app.constant';
import CommonLearnerCourse from './CommonLearnerCourse';

interface CommonL1ContentListProps {
  notab?: boolean;
}

const MyComponent: React.FC<CommonL1ContentListProps> = ({ notab = false }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab'); // '1', '2', etc. as a string
  const { t } = useTranslation();
  const [filter, setFilter] = useState<Record<string, any> | null>(null);
  const [isLogin, setIsLogin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileCard, setIsProfileCard] = useState(false);
  const storedConfig =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
      : {};

  useEffect(() => {
    const fetchTenantInfo = async () => {
      try {
        if (checkAuth()) {
          setIsLogin(true);
          const result = await profileComplitionCheck();
          console.log('Profile completion check result:', result);
          setIsProfileCard(!result);
        } else {
          setIsLogin(false);
        }
        const res = await getTenantInfo();
        const youthnetContentFilter = res?.result.find(
          // (program: any) => program.name === TenantName.YOUTHNET
          (program: any) => program.name === localStorage.getItem('userProgram')
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

  return (
    <Layout
      _children={{
        _childrenBox: {
          id: 'l1-content-list-home',
        },
      }}
      isLoadingChildren={isLoading}
      sx={gredientStyle}
    >
      {isProfileCard && storedConfig.isCompleteProfile && (
        <CompleteProfileBanner />
      )}
      {isLogin && (
        <>
          {typeof window !== 'undefined' &&
            localStorage.getItem('userProgram') ===
              TenantName.SECOND_CHANCE_PROGRAM && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F5F6FA',
                  p: { xs: 2, md: 4 },
                  mb: 3,
                  borderRadius: 2,
                  gap: 1,
                }}
              >
                <InfoIcon
                  sx={{
                    fontSize: { xs: '28px', md: '36px' },
                    color: '#FDBE16',
                    flexShrink: 0,
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    maxWidth: '650px',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      textAlign: 'center',
                      color: '#1F1B13',
                      fontWeight: 600,
                      fontSize: { xs: '12px', md: '16px' },
                      lineHeight: { xs: '18px', md: '24px' },
                    }}
                  >
                    {t('LEARNER_APP.COURSE.SECOND_CHANCE_REGISTRATION_MESSAGE')}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: 'center',
                      color: '#1F1B13',
                      fontWeight: 400,
                      fontSize: { xs: '11px', md: '14px' },
                      lineHeight: { xs: '16px', md: '20px' },
                    }}
                  >
                    {t('LEARNER_APP.COURSE.PLAYSTORE_DOWNLOAD_MESSAGE')
                      .split('{playStoreLink}')
                      .map((part, index, array) => {
                        if (index === array.length - 1) {
                          return (
                            <React.Fragment key={index}>{part}</React.Fragment>
                          );
                        }
                        return (
                          <React.Fragment key={index}>
                            {part}
                            <Link
                              href="https://play.google.com/store/apps/details?id=com.pratham.learning"
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: '#FDBE16',
                                textDecoration: 'underline',
                                fontWeight: 500,
                                '&:hover': {
                                  color: '#fdbe16',
                                  textDecoration: 'underline',
                                },
                              }}
                            >
                              Play Store
                            </Link>
                          </React.Fragment>
                        );
                      })}
                  </Typography>
                </Box>
              </Box>
            )}
          {!notab && (
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
                variant="body1"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 500,
                  color: '#1F1B13',
                  textTransform: 'capitalize',
                }}
              >
                <span role="img" aria-label="wave">
                  👋{' '}
                </span>
                {t('COMMON.WELCOME')}, {localStorage.getItem('firstName')}!
              </Typography>
            </Box>
          )}
          {!notab && <InProgressContent />}

          {localStorage.getItem('userProgram') === TenantName.YOUTHNET && (
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
          )}
        </>
      )}

      <Grid container style={gredientStyle}>
        <Grid item xs={12}>
          {filter && (
            <CommonLearnerCourse
              title={
                notab
                  ? 'LEARNER_APP.COURSE.EXPLORE_ADDITIONAL_RESOURCES'
                  : 'LEARNER_APP.COURSE.EXPLORE_MORE_COURSES'
              }
              _content={{
                pageName: 'L1_Content',
                // onlyFields: [
                //   'contentLanguage',
                //   ...(filter.filters?.domain ? [] : ['se_domains']),
                //   'se_subDomains',
                //   'se_subjects'
                // ],
                // isOpenColapsed: [
                //   'contentLanguage',
                //   ...(filter.filters?.domain ? [] : ['se_domains']),
                //   'se_subDomains',
                //   'se_subjects',
                // ],
                filters: {
                  ...(filter.filters?.domain
                    ? {}
                    : {
                        se_domains:
                          typeof filter.filters?.domain === 'string'
                            ? [filter.filters?.domain]
                            : filter.filters?.domain,
                      }),
                },
                // 🎯 Dynamic content tabs based on stored configuration
                ...(() => {
                  // If notab prop is true, hide all tabs
                  if (notab) {
                    return {
                      contentTabs: ['no-tabs-please'], // Pass non-existent tab label to result in empty tabs array
                    };
                  }

                  if (
                    !Array.isArray(storedConfig.showContent) ||
                    storedConfig.showContent.length === 0
                  ) {
                    return {}; // No configuration, show all tabs
                  }

                  // Pass the full objects with label and filterKey
                  const configTabs = storedConfig.showContent;
                  console.log('🎯 Setting contentTabs to:', configTabs);
                  return { contentTabs: configTabs };
                })(),

                staticFilter: {
                  program:
                    typeof filter.filters?.program === 'string'
                      ? [filter.filters?.program]
                      : filter.filters?.program,
                  ...(filter.filters?.domain
                    ? {
                        se_domains:
                          typeof filter.filters?.domain === 'string'
                            ? [filter.filters?.domain]
                            : filter.filters?.domain,
                      }
                    : {}),
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

const InProgressContent: React.FC = () => {
  const { t } = useTranslation();
  const [isShow, setIsShow] = useState(false);
  const theme = useTheme();
  // Detect if the screen size is medium or larger
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <Grid
      container
      style={gredientStyle}
      sx={{
        px: { xs: 0, sm: 0, md: 4 },
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        mb: 2,
      }}
      {...(isShow ? {} : { sx: { display: 'none' } })}
    >
      <Grid item xs={12} md={2.7}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { md: 'column' },
            justifyContent: {
              xs: 'space-between',
              sm: 'space-between',
              md: 'flex-start',
            },
            px: { xs: '16px' },
            py: { xs: '24px' },
            pb: { xs: 0, sm: 0 },
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 0, sm: 0, md: 1 },
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: { md: '22px', sm: '16px', xs: '16px' },
                lineHeight: { md: '28px', sm: '24px', xs: '24px' },
                letterSpacing: '0px',
                verticalAlign: 'middle',
                color: '#06A816',
                mb: 0,
              }}
            >
              {t('LEARNER_APP.L_ONE_COURSE.IN_PROGRESS_TITLE')}
            </Typography>
            <Typography
              variant="body1"
              gutterBottom
              sx={{
                color: '#7C766F',
                fontSize: { xs: '12px', sm: '12px', md: '16px' },
              }}
            >
              {t('LEARNER_APP.L_ONE_COURSE.ONGOING_COURSES').replace(
                '{count}',
                isShow?.toString()
              )}
            </Typography>
          </Box>
          <Box
            sx={{
              display: { md: 'flex' },
              justifyContent: { md: 'flex-start' },
            }}
          >
            <Button
              variant={isMdUp ? 'contained' : 'text'}
              sx={
                !isMdUp
                  ? {
                      color: theme.palette.secondary.main,
                      minWidth: '100px',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.1px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                    }
                  : {}
              }
              endIcon={<ArrowForwardIcon />}
              color="primary"
              href="/in-progress"
            >
              {t('LEARNER_APP.L_ONE_COURSE.VIEW_ALL_BUTTON')}
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={9.3}>
        <ContentComponent
          getContentData={(e: any) => setIsShow(e.count)}
          _config={{
            isShowInCarousel: true,
            isHideNavigation: true,
            _subBox: { px: { xs: 2, sm: 2, md: 0 } },
            _carousel: { spaceBetween: isMdUp ? 16 : 8 },
          }}
          //  pageName="Inprogress"
        />
      </Grid>
    </Grid>
  );
};
