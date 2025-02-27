import React, { useEffect, useState } from 'react';
import withRole from '../components/withRole';
import { Box, Grid, Modal, Typography } from '@mui/material';
import Header from '../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TENANT_DATA } from '../utils/app.config';
import { fetchSurveyData } from '../services/youthNet/SurveyYouthService';
import SimpleModal from '../components/SimpleModal';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  locations,
  SURVEY_DATA,
  YOUTHNET_USER_ROLE,
  users,
} from '../components/youthNet/tempConfigs';
import BackHeader from '../components/youthNet/BackHeader';
import MonthlyRegistrationsChart from '../components/youthNet/MonthlyRegistrationsChart';
import RegistrationStatistics from '../components/youthNet/RegistrationStatistics';
import YouthAndVolunteers from '../components/youthNet/YouthAndVolunteers';
import VillageNewRegistration from '../components/youthNet/VillageNewRegistration';
import { UserList } from '../components/youthNet/UserCard';
import Dropdown from '../components/youthNet/DropDown';
import { fetchUserData,  getUserDetails, getYouthDataByDate } from '../services/youthNet/Dashboard/UserServices';
import Loader from '../components/Loader';
import { filterUsersByAge, getLoggedInUserRole } from '../utils/Helper';


const Index = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isSurveyAvailable, setIsSurveyAvailable] = useState<boolean>(false);
  const [villageCount, setVillageCount] = useState<number>(0);
  const [registeredVillages, setRegisteredVillages] = useState<any>([]);
  const [todaysRegistrationCount, setTodaysRegistrationCount] = useState<number>(0);
  const [aboveEighteenUsers, setAboveEighteenUsers] = useState<any>([]);
  const [belowEighteenUsers, setBelowEighteenUsers] = useState<any>([]);
  const [surveymodalOpen, setSurveyModalOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [abvmodalOpen, setAbvModalOpen] = useState<boolean>(false);
  const [belmodalOpen, setBelModalOpen] = useState<boolean>(false);
  const [vilmodalOpen, setVilModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const getSurveyData = async () => {
      const surveyAvailable = await fetchSurveyData();
      setIsSurveyAvailable(surveyAvailable);
      setModalOpen(surveyAvailable);
    };

    getSurveyData();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchUserData();
      setUserData(data);
    };

    getData();
  }, []);
  useEffect(() => {
    const getVillageData = async () => {
      const userId = localStorage.getItem('userId');
      if (userId) {
        const data = await getUserDetails(userId, true);
        const userDataString = localStorage.getItem('userData')
        if(userDataString)
        {
          const userData = JSON.parse(userDataString);
          userData.customFields = data?.userData?.customFields;
          localStorage.setItem('userData', JSON.stringify(userData));

        }
        console.log(data);
        const result = data?.userData?.customFields?.find(
          (item: any) => item.label === 'VILLAGE'
        );
        localStorage.setItem(
          'villageData',
          JSON.stringify(result?.selectedValues)
        );
        setVillageCount(result?.selectedValues?.length);
      }
      // setUserData(data);
    };

    getVillageData();
  }, []);
  useEffect(() => {
    const getYouthData = async () => {
      try {
        const response = await getYouthDataByDate(new Date(), new Date());
        if(response?.totalCount)
        setTodaysRegistrationCount(response?.totalCount);
        //  const youthData=response.getUserDetails.find((item:any)=>{
        //    return item.role==="Content creator"
        //  })
        const youthData = filterUsersByAge(response.getUserDetails);
        console.log(response.getUserDetails);
        setAboveEighteenUsers(youthData?.above18);
        setBelowEighteenUsers(youthData?.below18);
        console.log(youthData?.below18);
        //  console.log(users)
        let users = response.getUserDetails;
        const villageSet = new Set();

        const villageMap = new Map<number, string>();

        users.forEach((user: any) => {
          if (user.customFields) {
            user.customFields.forEach((field: any) => {
              if (field.label === 'VILLAGE') {
                field.selectedValues.forEach((value: any) => {
                  villageMap.set(value.id, value.value); // Ensures unique villages by ID
                });
              }
            });
          }
        });

        const uniqueVillages = Array.from(villageMap, ([id, value]) => ({
          id,
          value,
        }));
        console.log(uniqueVillages);
        setRegisteredVillages(uniqueVillages);
      } catch (error) {
        console.log(error);
      }
      // setUserData(data);
    };

    getYouthData();
  }, []);
  const handleModalClose = () => {
    setModalOpen(false),
      setBelModalOpen(false),
      setAbvModalOpen(false),
      setVilModalOpen(false);
  };

  const handleAddVolunteers = () => {
    router.push('/volunteerList');
  };

  const handleClick = (type: string) => {
    switch (type) {
      case 'above':
        setAbvModalOpen(true);
        break;
      case 'below':
        setBelModalOpen(true);
        break;
      case 'village':
        setVilModalOpen(true);
        break;
      default:
        console.log('Unknown action');
    }
  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader headingOne={t('DASHBOARD.DASHBOARD')} />
      </Box>
      {YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && (
        <Box
          sx={{
            px: '20px',
            mt: '15px',
          }}
        >
          {userData ? (
            <Dropdown
              name={userData?.MENTOR_NAME}
              values={userData?.MENTOR_OPTIONS}
              defaultValue={userData?.MENTOR_OPTIONS[0]}
              onSelect={(value) => console.log('Selected:', value)}
            />
          ) : (
            <Loader showBackdrop={true} />
          )}
        </Box>
      )}
      <Box ml={2}>
        {YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() ? (
          <Box mt={2}>
            <Typography>
              {t(`YOUTHNET_DASHBOARD.MANAGES`)} {SURVEY_DATA.FIFTY_TWO}{' '}
              {t(`YOUTHNET_DASHBOARD.VILLAGES`)}
            </Typography>
          </Box>
        ) : (
          <Typography>
            {t('YOUTHNET_DASHBOARD.VILLAGES_MANAGED_BY_YOU', {
              totalVillageCount: villageCount,
            })}
          </Typography>
        )}
      </Box>

      <Box pl={2} pr={2} mt={2}>
        <RegistrationStatistics title= { t('YOUTHNET_DASHBOARD.TODAYS_NEW_REGISTRATION', {totalCount: todaysRegistrationCount,})} 
            />
      </Box>
      <Box p={2}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <RegistrationStatistics
              onPrimaryClick={() => handleClick('above')}
              cardTitle={'Above 18 y/o'}
              statistic={aboveEighteenUsers.length}
            />
          </Grid>
          <Grid item xs={4}>
            <RegistrationStatistics
              onPrimaryClick={() => handleClick('below')}
              cardTitle={'Below 18 y/o'}
              statistic={belowEighteenUsers.length}
            />
          </Grid>
          <Grid item xs={4}>
            <RegistrationStatistics
              onPrimaryClick={() => handleClick('village')}
              cardTitle={'From'}
              statistic={registeredVillages.length +" villages"} 
            />
          </Grid>
        </Grid>
      </Box>
      <Box>
        <MonthlyRegistrationsChart />
      </Box>
      <Box>
        <YouthAndVolunteers
          selectOptions={[
            { label:t('YOUTHNET_DASHBOARD.AS_OF_TODAY'), value: 'today' },
            { label:t('YOUTHNET_DASHBOARD.AS_OF_LAST_SIX_MONTH'), value: 'month' },
            { label: t('YOUTHNET_DASHBOARD.AS_OF_LAST_YEAR'), value: 'year' },

          ]}
          data="577 Youth & Volunteers"
        />
        
      </Box>
      <SimpleModal
        modalTitle={t('YOUTHNET_SURVEY.NEW_SURVEY')}
        primaryText={t('YOUTHNET_SURVEY.ASSIGN_VOLUNTEERS_NOW')}
        secondaryText={t('YOUTHNET_SURVEY.REMIND_ME_LATER')}
        secondaryActionHandler={handleModalClose}
        primaryActionHandler={handleAddVolunteers}
        open={modalOpen}
        onClose={handleModalClose}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <Typography
            sx={{
              color: 'black',
              fontWeight: 500,
              textAlign: 'center',
              mb: 1,
            }}
          >
            {t('YOUTHNET_SURVEY.NEW_SURVEY_HAS_BEEN_ADDED', {
              surveyName: SURVEY_DATA.CREATIVITY_MAHOTSAV,
              villageCount: SURVEY_DATA.TWELVE,
            })}
          </Typography>
          <Typography
            sx={{
              color: 'black',
              textAlign: 'center',
            }}
          >
            {t('YOUTHNET_SURVEY.ASSIGN_VOLUNTEERS_TO_ENSURE')}
          </Typography>
        </Box>
      </SimpleModal>
      <SimpleModal
        modalTitle={t('YOUTHNET_DASHBOARD.ABOVE_18')}
        open={abvmodalOpen}
        onClose={handleModalClose}
      >
        {' '}
        <UserList users={aboveEighteenUsers} layout="list" />
      </SimpleModal>

      <SimpleModal
        modalTitle={t('YOUTHNET_DASHBOARD.BELOW_18')}
        open={belmodalOpen}
        onClose={handleModalClose}
      >
        {' '}
        <UserList users={belowEighteenUsers} layout="list" />
      </SimpleModal>
      <SimpleModal
        modalTitle={t('YOUTHNET_DASHBOARD.VLLAGE_18')}
        open={vilmodalOpen}
        onClose={handleModalClose}
      >
        {' '}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <VillageNewRegistration locations={registeredVillages} />
        </Box>
      </SimpleModal>
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

export default withRole(TENANT_DATA.YOUTHNET)(Index);
