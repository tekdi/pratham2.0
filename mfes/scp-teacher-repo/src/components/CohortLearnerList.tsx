import LearnersListItem from '@/components/LearnersListItem';
import { getMyCohortMemberList, getMyCohortMemberListLearner } from '@/services/MyClassDetailsService';
import useStore from '@/store/store';
import { Role, Status, pagesLimit } from '@/utils/app.constant';
import { toPascalCase } from '@/utils/Helper';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';
import NoDataFound from './common/NoDataFound';
import Loader from './Loader';
import SearchBar from './Searchbar';
import { showToastMessage } from './Toastify';
import axios from 'axios';
import CustomPagination from './CustomPagination';

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
  const theme = useTheme<any>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [userData, setUserData] = React.useState<UserDataProps[]>();
  const [filteredData, setFilteredData] = useState(userData);

  const setCohortLearnerCount = useStore(
    (state) => state.setCohortLearnerCount
  );

  const [isLearnerDeleted, setIsLearnerDeleted] =
    React.useState<boolean>(false);

  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [infinitePage, setInfinitePage] = useState(1);
  const [infiniteData, setInfiniteData] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const PAGINATION_CONFIG = {
    ITEMS_PER_PAGE: pagesLimit,
    INFINITE_SCROLL_INCREMENT: pagesLimit,
  };

  const { t } = useTranslation();

  useEffect(() => {
    const getCohortMemberList = async () => {
      if (!isMobile) {
        setLoading(true);
      }
      try {
        if (cohortId) {
          const limit = pagesLimit;
          const page = offset;
          const filters: { cohortId: string; status: string[]; name?: string } = {
            cohortId: cohortId,
            status: [Status.ACTIVE, Status.DROPOUT],
          };
          if (searchTerm.trim()) {
            filters.name = searchTerm.trim();
          }
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

            if (isMobile) {
              setInfiniteData([...infiniteData, ...userDetails]);
              setFilteredData([...infiniteData, ...userDetails]);
              setUserData([...infiniteData, ...userDetails]);
            } else {
              setUserData(userDetails);
              setFilteredData(userDetails);
              setInfiniteData(userDetails);
            }

            setTotalCount(response?.result?.totalCount || 0);
            setCohortLearnerCount(response?.result?.totalCount || 0);
          } else {
            setUserData([]);
            setFilteredData([]);
            setInfiniteData([]);
            setTotalCount(0);
            setCohortLearnerCount(0);
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
    page,
    infinitePage,
    searchTerm,
  ]);

  const fetchMoreData = () => {
    if (infiniteData && totalCount && infiniteData.length >= totalCount) {
      setHasMore(false);
      return;
    }
    setOffset((prev) => {
      if (totalCount && prev + PAGINATION_CONFIG.ITEMS_PER_PAGE <= totalCount) {
        return prev + PAGINATION_CONFIG.ITEMS_PER_PAGE;
      }
      return prev;
    });
    setInfinitePage((prev) => prev + 1);
  };

  const handlePageChange = (newPage: number) => {
    if (!isMobile) {
      setPage(newPage);
    }
    setOffset((newPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE);
  };

  const handleLearnerDelete = () => {
    setIsLearnerDeleted(true);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
    setOffset(0);
    setInfinitePage(1);
    setInfiniteData([]);
    setHasMore(true);
  };

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
          {userData?.length || searchTerm ? (
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
              {(isMobile ? infiniteData : filteredData)?.map((data: any) => {
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
              {(isMobile ? !infiniteData.length : !filteredData?.length) && (
                <NoDataFound />
              )}
            </Grid>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              <CustomPagination
                count={Math.ceil(totalCount / PAGINATION_CONFIG.ITEMS_PER_PAGE)}
                page={page}
                onPageChange={handlePageChange}
                fetchMoreData={fetchMoreData}
                hasMore={hasMore}
                TotalCount={totalCount}
                items={infiniteData.map((user) => (
                  <Box key={user.userId}></Box>
                ))}
              />
            </Box>
          </Box>
        </>
      )}
    </div>
  );
};

export default CohortLearnerList;
