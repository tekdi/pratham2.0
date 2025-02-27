'use-client';

import withRole from '../../components/withRole';
import React, { useEffect } from 'react';
import { TENANT_DATA } from '../../utils/app.config';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import Header from '../../components/Header';
import BackHeader from '../../components/youthNet/BackHeader';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';
import { VILLAGE_DATA } from '../../components/youthNet/tempConfigs';
import VillageDetailCard from '../../components/youthNet/VillageDetailCard';
import Frame2 from '../../assets/images/SurveyFrame2.png';
import Profile from '../../components/youthNet/Profile';
import { getAge } from '../../utils/Helper';
import { useRouter } from 'next/router';
import { getUserDetails } from '../../services/youthNet/Dashboard/UserServices';

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
    dob?:string|null;
    state?:string|null;
    district?:string| null;
    block?:string|null;
    village?:string|null;
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
    block:null,
    village: null
  });

  useEffect(() => {
    const fetchData=async()=>{
    if (typeof window !== 'undefined' && window.localStorage) {
      const role = localStorage.getItem('role');
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
         if(userId===localStorage.getItem("userId"))
         {
          setUser({
            firstName: userData?.firstName || '',
            lastName: userData?.lastName || '',
            email: userData?.email || '',
            userID: userData?.userId || '',
            phone: userData?.mobile || '',
            gender: userData?.gender || '',
            userRole: role || '',
            dob:userData?.dob || ''
          });
         }
         else if(userId){
          const data = await getUserDetails(userId, true)
          console.log(data)
          setUser({ ...data?.userData, userRole: data?.userData?.tenantData[0]?.roleName });
        }
    
    }
  }
  fetchData()
  }, []);
  return (
    <Box minHeight="100vh">
      {' '}
      <Box>
        <Header />
      </Box>
     {(userId===localStorage.getItem("userId")) &&(<Box ml={2}>
        <BackHeader headingOne={t('YOUTHNET_PROFILE.MY_PROFILE')} />
      </Box>)
      }
      {/* <Box ml={2}>
        {' '}
        <Typography
          sx={{
            fontSize: '14px',
            fontWeight: 500,
            color: theme.palette.info.black,
          }}
        >
          {t('YOUTHNET_PROFILE.ACTIVITIES_CONDUCTED')}
        </Typography>
      </Box> */}
      {/* <Box>
        <VillageDetailCard
          imageSrc={Frame2}
          title={VILLAGE_DATA.THREE}
          subtitle={VILLAGE_DATA.SURVEYS_CONDUCTED}
        />
      </Box> */}
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
          {t('YOUTHNET_PROFILE.PROFILE_DETAILS')}
        </Typography>
        <Profile
          fullName={`${user.firstName} ${user.lastName}` || ''}
          emailId={user.email || '-'}
          designation={user.userRole || '-'}
          mentorId={user.userID || ''}
          phoneNumber={user.phone || '-'}
          gender={user.gender || ''}
          state="Maharashtra"
          district="Pune"
          block="Bhor"
          dob={user.dob || '-'}
          age={getAge(user?.dob)}
        />
      </Box>
    </Box>
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

export default withRole(TENANT_DATA.YOUTHNET)(UserId);
