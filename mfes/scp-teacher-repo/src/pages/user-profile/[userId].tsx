'use-client';
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Header from '../../components/Header';
import { useRouter } from 'next/router';
import { getUserDetails } from '../../services/ProfileService';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Profile from '@/components/Profile';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { toPascalCase } from '@/utils/Helper';

const UserId = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const { userId } = router.query;

  const [user, setUser] = React.useState<{
    userRole: string | null;
    userID: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
    gender: string | null;
    dob?: string | null;
    state?: string | null;
    district?: string | null;
    block?: string | null;
    middleName?: string | null;
    village?: string | null;
    userName?: string | null;
    joinedOn?: string | null;
    subjectsITeach?: any[];
    myMainSubjects?: any[];
  }>({
    userRole: null,
    userID: null,
    firstName: null,
    lastName: null,
    email: null,
    phone: null,
    gender: null,
    dob: null,
    state: null,
    district: null,
    block: null,
    village: null,
    middleName: null,
    userName: null,
    joinedOn: null,
    subjectsITeach: [],
    myMainSubjects: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window === 'undefined' || !window.localStorage) return;

      const storedUserId = localStorage.getItem('userId');
      let userData: any = {};

      if (userId === storedUserId) {
        userData = JSON.parse(localStorage.getItem('userData') || '{}');
      } else if (userId) {
        const data = await getUserDetails(userId, true);
        userData = data?.result.userData || {};
      }

      if (userData) {
        const getFieldValue = (label: string) =>
          userData?.customFields?.find((item: any) => item.label === label)
            ?.selectedValues || [];

        setUser({
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          middleName: userData?.middleName || '',
          userName: userData?.username || '',
          joinedOn: userData?.createdOn || '',
          email: userData?.email || '',
          userID: userData?.userId || '',
          phone: userData?.mobile || '',
          gender: userData?.gender || '',
          userRole: userData?.tenantData?.[0]?.roleName || '',
          dob: userData?.dob || '',
          district: getFieldValue('DISTRICT')[0]?.value || '',
          block: getFieldValue('BLOCK')[0]?.value || '',
          state: getFieldValue('STATE')[0]?.value || '',
          village: getFieldValue('VILLAGE')[0]?.value || '',
          subjectsITeach: getFieldValue('SUBJECTS_I_TEACH'),
          myMainSubjects: getFieldValue('MY_MAIN_SUBJECTS'),
        });
      }
    };

    fetchData();
  }, [userId]);

  return (
    <>
      <Box minHeight="100vh">
        <Box>
          <Header />
        </Box>
        <Box ml={2}>
          <Box
            onClick={() => router.back()}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              my: '25px',
              gap: '5px',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: '25px', color: '#4D4639' }} />
            <Box>
              <Box
                sx={{
                  fontWeight: 400,
                  fontSize: '22px',
                  lineHeight: '28px',
                  letterSpacing: '0px',
                  color: '#4D4639',
                }}
              >
                {toPascalCase(`${user.firstName} ${user.lastName}` || '')}
                
              </Box>
                {(user.village || user.block || user.district || user.state) && (
                <Box
                  sx={{
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  letterSpacing: '0.5px',
                  }}
                >
                  {user.state && `${user.state}, `}
                  {user.district && `${user.district}, `}
                  {user.block && `${user.block}, `}
                  {user.village && `${user.village} `}
                </Box>
                )}
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            background: theme.palette.info.gradient,
            padding: '24px 16px 24px 16px',
          }}
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: '14px',
              fontWeight: 500,
              color: theme.palette.info.black,
            }}
          >
            {t('SCP_PROFILE.PROFILE_DETAILS')}
          </Typography>
          <Profile
            fullName={`${user.firstName} ${user.lastName}` || ''}
            emailId={user.email || '-'}
            designation={user.userRole || '-'}
            mentorId={user.userID || ''}
            phoneNumber={user.phone || '-'}
            gender={user.gender || '-'}
            state={user.state || '-'}
            district={user.district || '-'}
            block={user.block || '-'}
            dob={user.dob || '-'}
            village={user.village || null}
            middleName={user.middleName || '-'}
            userName={user.userName || null}
            joinedOn={user.joinedOn || '-'}
            firstName={user.firstName || ''}
            lastName={user.lastName || ''}
            subjectsITeach={user.subjectsITeach}
            myMainSubjects={user.myMainSubjects}
          />
        </Box>
      </Box>
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      // Will be passed to the page component as props
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default UserId;
