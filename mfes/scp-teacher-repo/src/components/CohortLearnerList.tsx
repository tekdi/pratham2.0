import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortMemberList, getMyCohortMemberListLearner } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Role, Status, limit } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import NoDataFound from './common/NoDataFound';
import Loader from './Loader';
import SearchBar from './Searchbar';
import { showToastMessage } from './Toastify';
import axios from 'axios';

interface UserDataProps {
  name: string;
  userId: string;
  memberStatus: string;
  cohortMembershipId: string;
  enrollmentNumber: string;
}
interface CohortLearnerListProp {
  cohortId: any;
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  isLearnerAdded: boolean;
  isLearnerReassigned?: boolean;
}

const CohortLearnerList: React.FC<CohortLearnerListProp> = ({
  cohortId,
  reloadState,
  setReloadState,
  isLearnerAdded,
  isLearnerReassigned,
}) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [userData, setUserData] = React.useState<UserDataProps[]>();
  const [filteredData, setFilteredData] = useState(userData);

  const setCohortLearnerCount = useStore(
    (state) => state.setCohortLearnerCount
  );

  const [isLearnerDeleted, setIsLearnerDeleted] =
    React.useState<boolean>(false);

  const { t } = useTranslation();

  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      try {
        if (cohortId) {
          const page = 0;
          const filters = { cohortId: cohortId };
          const response = await getMyCohortMemberListLearner({
            limit,
            page,
            filters,
          });
          const resp = response?.result?.userDetails;

          if (resp) {
            // Filter out reassigned users
            const filteredResp = resp.filter((user: any) => user.status !== "reassigned");
            const userDetails = filteredResp.map((user: any) => {
              const ageField = user.customField.find(
                (field: { label: string }) => field.label === 'AGE'
              );
              return {
                name:
                  toPascalCase(user?.firstName || '') +
                  ' ' +
                  (user?.lastName ? toPascalCase(user.lastName) : ''),
                userId: user?.userId,
                memberStatus: user?.status,
                statusReason: user?.statusReason,
                cohortMembershipId: user?.cohortMembershipId,
                enrollmentNumber: user?.username,
                age: ageField ? ageField.value : null, // Extract age for the specific user
                customField: user?.customField,
              };
            });
            setCohortLearnerCount(userDetails.length);
            setUserData(userDetails);
            setFilteredData(userDetails);
          } else {
            setUserData([]);
            setCohortLearnerCount(0);
            setFilteredData([]);
          }
        }
      } catch (error) {
        setUserData([]);
        setFilteredData([]);

        console.error('Error fetching cohort list:', error);
        //showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getCohortMemberList();
  }, [
    cohortId,
    reloadState,
    isLearnerAdded,
    isLearnerDeleted,
    isLearnerReassigned,
  ]);

  // Reapply search filter when userData changes
  useEffect(() => {
    if (userData) {
      const query = searchTerm.toLowerCase().trim();
      if (!query) {
        setFilteredData(userData);
      } else {
        const filtered = userData.filter(
          (data) =>
            data?.name?.toLowerCase()?.includes(query) ||
            data?.enrollmentNumber?.toLowerCase()?.includes(query)
        );
        setFilteredData(filtered);
      }
    }
  }, [userData, searchTerm]);

  const handleLearnerDelete = () => {
    setIsLearnerDeleted(true);
  };
    const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      // If search is empty, show all data
      setFilteredData(userData);
      return;
    }

    const filtered = userData?.filter(
      (data) =>
        data?.name?.toLowerCase()?.includes(query) ||
        data?.enrollmentNumber?.toLowerCase()?.includes(query)
    );
    setFilteredData(filtered);
  };
  const theme = useTheme<any>();

  const [myCenterList, setMyCenterList] = useState<any[]>([]);
  const [myCenterIds, setMyCenterIds] = useState<any>([]);

  // Fetch centers on mount using mycohorts API
  const [temp_variable, setTemp_variable] = useState([]);
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('UserId not found in localStorage');
          setLoading(false);
          return;
        }
        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          tenantId: localStorage.getItem('tenantId') || '',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          academicyearid: localStorage.getItem('academicYearId') || '',
        };

        const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/mycohorts/${userId}?customField=true&children=true`;

        const response = await axios.get(apiUrl, { headers });


        // Extract centers from response
        // Response structure: response.data.result is an array of cohorts
        const cohortsData = response?.data?.result || [];


        // Filter for active centers (type COHORT, status active, cohortMemberStatus active)
        const filteredCohorts = cohortsData.filter((cohort: any) => {
          const isActiveCohort =
            cohort?.type === 'COHORT' &&
            cohort?.cohortStatus === 'active' &&
            cohort?.cohortMemberStatus === 'active';
          return isActiveCohort;
        });


        // Helper function to extract custom field value by label
        const getCustomFieldValue = (
          customField: any[],
          label: string,
          property: 'value' | 'id' = 'value'
        ): any => {
          const field = customField?.find((f: any) => f?.label === label);
          if (
            !field ||
            !field.selectedValues ||
            field.selectedValues.length === 0
          ) {
            return property === 'id' ? null : '';
          }
          const selectedValue = field.selectedValues[0];
          if (typeof selectedValue === 'object' && selectedValue !== null) {
            return selectedValue[property] ?? (property === 'id' ? null : '');
          }
          return property === 'id' ? null : selectedValue;
        };

        // Extract center IDs
        const centerIds = filteredCohorts.map(
          (cohort: any) => cohort.cohortId || cohort.id
        );
        setMyCenterIds(centerIds);

        // Map to the required structure
        const centersList = filteredCohorts.map((cohort: any) => {
          const customField = cohort.customField || [];
          return {
            value: cohort.cohortId || cohort.id,
            label: cohort.cohortName || cohort.name || '',
            state: getCustomFieldValue(customField, 'STATE', 'value'),
            district: getCustomFieldValue(customField, 'DISTRICT', 'value'),
            block: getCustomFieldValue(customField, 'BLOCK', 'value'),
            village: getCustomFieldValue(customField, 'VILLAGE', 'value'),
            stateId: getCustomFieldValue(customField, 'STATE', 'id'),
            districtId: getCustomFieldValue(customField, 'DISTRICT', 'id'),
            blockId: getCustomFieldValue(customField, 'BLOCK', 'id'),
            villageId: getCustomFieldValue(customField, 'VILLAGE', 'id'),
            childData: cohort.childData || [],
          };
        });
        setMyCenterList(centersList);
      } catch (error) {
        console.error('Error fetching centers:', error);
        setMyCenterIds([]);
        setMyCenterList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [temp_variable]);

  return (
    <div>
      {loading ? (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      ) : (
        <>
          {userData?.length ? (
            <SearchBar
              onSearch={handleSearch}
              value={searchTerm}
              placeholder={t('COMMON.SEARCH_STUDENT')}
            />
          ) : null}

          <Box
            sx={{
              '@media (min-width: 900px)': {
                background: theme.palette.action.selected,
                margin: '24px 18px 18px 18px',
                paddingBottom: '20px',
                paddingTop: '10px',
                borderRadius: '12px',
              },
            }}
          >
            <Grid container>
              {filteredData?.map((data: any) => {
                return (
                  <Grid xs={12} sm={12} md={6} lg={4} key={data.userId}>
                    <LearnersListItem
                      type={Role.STUDENT}
                      userId={data.userId}
                      learnerName={data.name}
                      enrollmentId={data.enrollmentNumber}
                      age={data.age}
                      cohortMembershipId={data.cohortMembershipId}
                      isDropout={data.memberStatus === Status.DROPOUT}
                      statusReason={data.statusReason}
                      reloadState={reloadState}
                      setReloadState={setReloadState}
                      showMiniProfile={true}
                      onLearnerDelete={handleLearnerDelete}
                      customFields={data.customField}
                      myCenterList={myCenterList}
                      myCenterIds={myCenterIds}
                    />
                  </Grid>
                );
              })}
              {!filteredData?.length && <NoDataFound />}
            </Grid>
          </Box>
        </>
      )}
    </div>
  );
};

export default CohortLearnerList;
