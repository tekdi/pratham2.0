import React, { useEffect, useState } from 'react';
import withRole from '../components/withRole';
import { Box, Grid } from '@mui/material';
import Header from '../components/Header';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TENANT_DATA } from '../utils/app.config';
import BackHeader from '../components/youthNet/BackHeader';
import { SURVEY_DATA, volunteerData } from '../components/youthNet/tempConfigs';
import { useRouter } from 'next/router';
import VolunteerListCard from '../components/youthNet/VolunteerListCard';
import NoDataFound from '../components/common/NoDataFound';
import { Role, Status } from '../utils/app.constant';
import { fetchUserList } from '../services/youthNet/Dashboard/UserServices';

const volunteerList = () => {
  const router = useRouter();
 const [villageList, setVillageList] = useState<any>();

  const { surveyName } = router.query;
  const villageNameStringNew = Array.isArray(surveyName)
    ? surveyName[0]
    : surveyName || '';

  console.log(villageNameStringNew);

  const handleBack = () => {
    router.back();
  };
 useEffect(() => {
  const getVillageVolunteerData = async () => {
    const villagedatalist=localStorage.getItem('villageData')
    if(villagedatalist)
    {
      const ids = JSON.parse(villagedatalist)?.map((item: any) => item.Id);

      let transformedData = JSON.parse(villagedatalist).map(({ Id, name }: any) => ({
        Id,
        name,
        entries: 0,
        volunteerCount: 0,
        actionLabel: "Add or Update Volunteers"
      }));
      const filters = {
              village: ids,
              role: Role.LEARNER,
              status: [Status.ACTIVE],
               is_volunteer:"yes"
            };
      
            const result = await fetchUserList({ filters });
            if(result?.getUserDetails)
            {
              const villageVolunteerCount: any = {};
result.getUserDetails.forEach((user : any)=> {
  const villageField = user?.customFields?.find((field: any) => field?.label === "VILLAGE");
  if (villageField) {
    const villageId = villageField?.selectedValues[0]?.id;
    if (!villageVolunteerCount?.[villageId]) {
      villageVolunteerCount[villageId] = 0;
    }
    villageVolunteerCount[villageId] += 1;
  }
});

transformedData = transformedData.map((village: any) => {
  const volunteerCount = villageVolunteerCount[village.Id] || 0;
  return { ...village, volunteerCount };
});

            }
    console.log(transformedData)
    setVillageList(transformedData)
  }
  }
  getVillageVolunteerData()
}, []);
console.log(villageList)
  const handleCardAction = (villageNameStringNew: string, title: string, volunteerCount?: any) => {
    router.push({
      pathname: `/village-camp-survyey/${title}`,
      query: {
        volunteerCount: volunteerCount
       
      },
    });  };
const handleAddVolunteer=(id: any) => {
  console.log("yes")
  router.push({
    pathname: `/villages`,
    query: {
      villageId: id,
      tab: 3
    },
  });  };

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <BackHeader
        headingOne={SURVEY_DATA.CREATIVITY_MAHOTSAV}
        headingTwo={SURVEY_DATA.TWELVE}
        showBackButton={true}
        onBackClick={handleBack}
      />
      <Box sx={{ mt: 4, p: 2, background: '#FBF4E4' }}>
        <Grid container spacing={2}>
          {villageList?.length > 0 ? (
            villageList?.map((data: any) => (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <VolunteerListCard
                  key={data?.Id}
                  title={data?.name}
                  entries={data?.entries}
                  volunteerCount={data?.volunteerCount}
                  actionLabel={data?.actionLabel}
                  onActionClick={() =>
                    handleCardAction(villageNameStringNew,data?.name, data?.volunteerCount)
                  }
                  onAssignVolunteerClick={() =>
                    handleAddVolunteer(data?.Id)
                  }
                />
              </Grid>
            ))
          ) : (
            <NoDataFound />
          )}
        </Grid>
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

export default withRole(TENANT_DATA.YOUTHNET)(volunteerList);
