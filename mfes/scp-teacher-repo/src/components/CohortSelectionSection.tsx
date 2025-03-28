import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { getCohortList } from '@/services/CohortServices';
import { getUserDetails } from '@/services/ProfileService';
import manageUserStore from '@/store/manageUserStore';
import useStore from '@/store/store';
import { toPascalCase } from '@/utils/Helper';
import { CustomField, ICohort } from '@/utils/Interfaces';
import {
  CenterType,
  cohortHierarchy,
  QueryKeys,
  Status,
  Telemetry,
} from '@/utils/app.constant';
import { telemetryFactory } from '@/utils/telemetry';
import { useTheme } from '@mui/material/styles';
import { ArrowDropDownIcon } from '@mui/x-date-pickers/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import ReactGA from 'react-ga4';
import Loader from './Loader';
import { showToastMessage } from './Toastify';

interface CohortSelectionSectionProps {
  classId: string;
  setClassId: React.Dispatch<React.SetStateAction<string>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated?: boolean;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  cohortsData: Array<ICohort>;
  setCohortsData: React.Dispatch<React.SetStateAction<Array<ICohort>>>;
  manipulatedCohortData?: Array<ICohort>;
  setManipulatedCohortData?: React.Dispatch<
    React.SetStateAction<Array<ICohort>>
  >;
  blockName?: string;
  isManipulationRequired?: boolean;
  setBlockName?: React.Dispatch<React.SetStateAction<string>>;
  handleSaveHasRun?: boolean;
  setHandleSaveHasRun?: React.Dispatch<React.SetStateAction<boolean>>;
  isCustomFieldRequired?: boolean;
  showFloatingLabel?: boolean;
  showDisabledDropDown?: boolean;
}

interface ChildData {
  cohortId: string;
  name: string;
  parentId: string;
  type: string;
  customField: any[];
  childData: ChildData[];
  status?: string;
}
interface NameTypePair {
  cohortId: string;
  name: string;
  cohortType: string;
  status?: string;
}

const CohortSelectionSection: React.FC<CohortSelectionSectionProps> = ({
  classId,
  setClassId,
  userId,
  setUserId,
  isAuthenticated,
  setIsAuthenticated,
  loading,
  setLoading,
  cohortsData,
  setCohortsData,
  manipulatedCohortData,
  setManipulatedCohortData,
  isManipulationRequired = true,
  blockName,
  setBlockName,
  handleSaveHasRun,
  setHandleSaveHasRun,
  isCustomFieldRequired = true,
  showFloatingLabel = false,
  showDisabledDropDown = false,
}) => {
  const router = useRouter();
  const theme = useTheme<any>();
  const queryClient = useQueryClient();

  const pathname = usePathname(); // Get the current pathname
  const { t } = useTranslation();
  const setCohorts = useStore((state) => state.setCohorts);
  const setBlock = useStore((state) => state.setBlock);
  const [filteredCohortData, setFilteredCohortData] = React.useState<any>();
  const [filteredManipulatedCohortData, setFilteredManipulatedCohortData] =
    React.useState<any>();

  const store = manageUserStore();

  const setDistrictCode = manageUserStore(
    (state: { setDistrictCode: any }) => state.setDistrictCode
  );
  const setDistrictId = manageUserStore(
    (state: { setDistrictId: any }) => state.setDistrictId
  );
  const setStateCode = manageUserStore(
    (state: { setStateCode: any }) => state.setStateCode
  );
  const setStateId = manageUserStore(
    (state: { setStateId: any }) => state.setStateId
  );
  const setBlockCode = manageUserStore(
    (state: { setBlockCode: any }) => state.setBlockCode
  );
  const setBlockId = manageUserStore(
    (state: { setBlockId: any }) => state.setBlockId
  );

  //center add fix
  const [centerId, setCenterId] = useState("");
  const [filteredBatchData, setFilteredBatchData] = React.useState<any>();
  const [filteredManipulatedBatchData, setFilteredManipulatedBatchData] =
    React.useState<any>();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');
      setCenterId(localStorage.getItem('centerId') || '');
      setClassId(localStorage.getItem('classId') || '');
      if (token) {
        setIsAuthenticated?.(true);
      } else {
        router.push('/login');
      }
      setUserId(storedUserId);
    }
  }, [router, setClassId, setIsAuthenticated, setUserId]);
  useEffect(() => {
    const filteredData = cohortsData
      ?.filter((cohort: any) => cohort?.status?.toLowerCase() === Status.ACTIVE)
      ?.sort((a: any, b: any) => a.name.localeCompare(b.name));

    const filteredManipulatedData = manipulatedCohortData
      ?.filter((cohort: any) => cohort?.status?.toLowerCase() === Status.ACTIVE)
      ?.sort((a: any, b: any) => a.name.localeCompare(b.name));

    setFilteredCohortData(filteredData);

    setFilteredManipulatedCohortData(filteredManipulatedData);

  }, [manipulatedCohortData, cohortsData]);

  useEffect(() => {
    if (centerId != "") {
      fetchBatch(centerId);
    }
  }, [centerId]);
  const fetchBatch = async (centerId: any) => {
    if (userId) {
      let filteredChildData = await getBatchFilteredData(centerId);
      setFilteredBatchData(filteredChildData);
      setFilteredManipulatedBatchData(filteredChildData);
    }
  }
  const getBatchFilteredData = async (centerId: any) => {
    if (userId) {
      const response = await queryClient.fetchQuery({
        queryKey: [QueryKeys.MY_COHORTS, userId],
        queryFn: () => getCohortList(userId, { customField: 'true' }),
      });
      // Find the cohort where cohortId matches centerId
      const targetCohort = response.find((item: any) => item.cohortId === centerId);
      let filteredChildData = [];
      // Check if the cohort is found
      if (targetCohort) {
        // Filter childData to only keep active children
        filteredChildData = targetCohort.childData.filter((child: any) => child.status === "active");
      }
      console.log("###### batch add filteredChildData", filteredChildData);
      return filteredChildData;
    }
  }
  useEffect(() => {
    if (userId) {
      if (!loading) {
        setLoading(true);
      }
      const fetchCohorts = async () => {
        try {
          const response = await queryClient.fetchQuery({
            queryKey: [QueryKeys.MY_COHORTS, userId],
            queryFn: () => getCohortList(userId, { customField: 'true' }),
          });

          const cohortData = response[0];
          let userDetailsResponse;
          if (userId) {
            userDetailsResponse = await getUserDetails(userId, true);
          }
          const blockObject =
            userDetailsResponse?.result?.userData?.customFields.find(
              (item: any) => item?.label === 'BLOCKS'
            );

          if (cohortData?.customField?.length) {
            const district = cohortData?.customField?.find(
              (item: CustomField) => item?.label === 'DISTRICTS'
            );

            if (district) {
              setDistrictCode(district?.code);
              setDistrictId(district?.fieldId);
            }

            const state = cohortData?.customField?.find(
              (item: CustomField) => item?.label === 'STATES'
            );

            if (state) {
              setStateCode(state?.code);
              setStateId(state?.fieldId);
            }

            const blockField = cohortData?.customField?.find(
              (field: any) => field?.label === 'BLOCKS'
            );

            if (blockObject) {
              setBlockCode(blockObject?.code);
              setBlockId(blockObject?.fieldId);
            }
          }

          if (response && response?.length > 0) {
            const extractNamesAndCohortTypes = (
              data: ChildData[]
            ): NameTypePair[] => {
              const nameTypePairs: NameTypePair[] = [];
              const recursiveExtract = (items: ChildData[]) => {
                items.forEach((item) => {
                  const cohortType =
                    item?.customField?.find(
                      (field) => field?.label === 'TYPE_OF_COHORT'
                    )?.value || 'Unknown';
                  if (item?.cohortId && item?.name) {
                    nameTypePairs.push({
                      cohortId: item?.cohortId,
                      name: item?.name,
                      status: item?.status,
                      cohortType,
                    });
                  }
                  if (item?.childData && item?.childData?.length > 0) {
                    recursiveExtract(item?.childData);
                  }
                });
              };
              recursiveExtract(data);
              return nameTypePairs;
            };

            if (response?.length > 0) {
              const nameTypePairs = extractNamesAndCohortTypes(response);
              setCohorts(nameTypePairs);
            }
          }
          if (response && response.length > 0) {
            if (response[0].type === cohortHierarchy.COHORT) {
              const filteredData = response
                ?.map((item: any) => ({
                  cohortId: item?.cohortId,
                  parentId: item?.parentId,
                  name: item?.cohortName || item?.name,
                  status: item?.cohortStatus,
                  customField: item?.customField,
                }))
                ?.filter(Boolean);
                

              setCohorts(filteredData);
              if (filteredData.length > 0) {
                if (typeof window !== 'undefined' && window.localStorage) {
                  let filteredChildData = await getBatchFilteredData(filteredData?.[0]?.cohortId);
                  setCohortsData([...filteredChildData]);
                  const cohort = localStorage.getItem('classId') || '';
                  if (cohort !== '') {
                    console.log("###### batch add cohort test", cohort);
                    setClassId(localStorage.getItem('classId') || '');
                  } else {
                    //add batch child data
                    // console.log("###### batch add filteredChildData",filteredChildData);
                    // console.log("###### batch add filteredChildData?.[0]?.cohortId",filteredChildData?.[0]?.cohortId);
                    localStorage.setItem(
                      'centerId',
                      filteredData?.[0]?.cohortId
                    );
                    setCenterId(filteredData?.[0]?.cohortId);
                    localStorage.setItem(
                      'classId',
                      filteredChildData?.[0]?.cohortId
                    );
                    localStorage.setItem('cohortId', filteredChildData?.[0]?.cohortId);
                    setClassId(filteredChildData?.[0]?.cohortId);
                  }
                }
                if (isManipulationRequired) {
                  setManipulatedCohortData?.(
                    filteredData.concat({
                      cohortId: 'all',
                      name: 'All Centers',
                    })
                  );
                } else {
                  setManipulatedCohortData?.(filteredData);
                }
              }
            } else if (response[0].type === cohortHierarchy.BLOCK) {
              if (setBlockName) {
                setBlockName(
                  response?.[0]?.name || response?.[0]?.cohortName || ''
                );
              }
              setBlock(response[0].name || response[0].cohortName);
              const filteredData = response[0].childData
                ?.filter((item: any) => item?.status !== Status.ARCHIVED)
                .map((item: any) => {
                  const typeOfCohort = item?.customField?.find(
                    (field: any) => field?.label === 'TYPE_OF_COHORT'
                  )?.value;

                  return {
                    cohortId: item?.cohortId,
                    parentId: item?.parentId,
                    name: item?.cohortName || item?.name,
                    typeOfCohort: typeOfCohort || t('ATTENDANCE.UNKNOWN'),
                    status: item?.status,
                    customField: item?.customField,
                  };
                })
                ?.filter(Boolean);


              let filteredChildData = await getBatchFilteredData(filteredData?.[0]?.cohortId);
              setCohortsData(filteredChildData);
              if (response[0].childData.length === 0) {
                setLoading(false);
              }
              if (filteredData.length > 0) {
                if (typeof window !== 'undefined' && window.localStorage) {
                  const cohort = localStorage.getItem('classId') || '';
                  if (cohort !== '') {
                    setClassId(localStorage.getItem('classId') || '');
                  } else {
                    localStorage.setItem(
                      'centerId',
                      filteredData?.[0]?.cohortId
                    );

                    setCenterId(filteredData?.[0]?.cohortId);
                    localStorage.setItem(
                      'classId',
                      filteredChildData?.[0]?.cohortId
                    );

                    localStorage.setItem('cohortId', filteredChildData?.[0]?.cohortId);
                    setClassId(filteredChildData?.[0]?.cohortId);
                  }
                }
              }
              setManipulatedCohortData?.(filteredData);
            }
          }
          // setLoading(false);
        } catch (error) {
          console.error('Error fetching cohort list', error);
          // setLoading(false);
          showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        }
      };

      fetchCohorts();
    }
  }, [
    userId,
    setCohortsData,
    setLoading,
    setClassId,
    setManipulatedCohortData,
    setBlockName,
    isCustomFieldRequired,
  ]);

  const handleCohortSelection = async (event: SelectChangeEvent<string>) => {
    let filteredChildData = await getBatchFilteredData(event.target.value);
    localStorage.setItem(
      'classId',
      filteredChildData?.[0]?.cohortId
    );
    localStorage.setItem('cohortId', filteredChildData?.[0]?.cohortId);
    setClassId(filteredChildData?.[0]?.cohortId);
    setCenterId(event.target.value);
    localStorage.setItem('centerId', event.target.value);
  };

  const handleBatchSelection = (event: SelectChangeEvent<string>) => {
    setClassId(event.target.value);
    ReactGA.event('cohort-selection-dashboard', {
      selectedCohortID: event.target.value,
    });
    const telemetryInteract = {
      context: {
        env: 'dashboard',
        cdata: [],
      },
      edata: {
        id: 'cohort-selection-dashboard',
        type: Telemetry.SEARCH,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
    localStorage.setItem('classId', event.target.value);
    setHandleSaveHasRun?.(!handleSaveHasRun);

    // ---------- set cohortId and stateName-----------
    const cohort_id = event.target.value;
    localStorage.setItem('cohortId', cohort_id);
  };

  const teacher: string | null =
    typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem('role')
      : null;

  const isAttendanceOverview = pathname === '/attendance-overview';
  const isAssessment = pathname === '/assessments';
  const dashboard = pathname === '/dashboard';
  const isCoursePlanner = pathname === '/curriculum-planner';

  return (
    <Box
      className={
        isAttendanceOverview || isAssessment || isCoursePlanner
          ? 'w-100'
          : 'w-md-40'
      }
    >
      {/* {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )} */}
      {filteredCohortData && filteredBatchData && (
        <Box
          sx={{
            '@media (min-width: 900px)': {
              marginTop: dashboard
                ? teacher === 'Teacher'
                  ? '0px'
                  : '-25px'
                : 'unset',
              marginRight: dashboard ? '15px' : 'unset',
            },
          }}
        >
          {classId && filteredCohortData && filteredBatchData && (
            <Box>
              {blockName ? (
                <Box>
                  <Typography
                    color={theme.palette.warning['300']}
                    textAlign={'left'}
                    sx={{ fontSize: '12px', color: '#777' }}
                  >
                    {toPascalCase(blockName)} {t('DASHBOARD.BLOCK')}
                  </Typography>
                  <Box className="mt-md-16">
                    <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
                      {filteredCohortData?.length > 1 ? (
                        <FormControl
                          className="drawer-select"
                          sx={{
                            m: 0,
                            width: '100%',
                            // '@media (max-width: 700px)': {
                            //   width: '50%',
                            // },
                          }}
                        >
                          {showFloatingLabel && (
                            <InputLabel id="center-select-label">
                              {t('COMMON.CENTER')}
                            </InputLabel>
                          )}
                          <Select
                            value={centerId || filteredCohortData?.[0]?.cohortId}
                            labelId="center-select-label"
                            onChange={handleCohortSelection}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="select-languages capitalize fs-14 fw-500 bg-white"
                            sx={{
                              borderRadius: '0.5rem',
                              color: theme.palette.warning['200'],
                              width: '100%',
                              marginBottom: '0rem',
                              '@media (max-width: 900px)': {
                                width: isAttendanceOverview ? '100%' : '62%',
                              },
                              // '& .MuiSelect-icon': {
                              //   right: isRTL ? 'unset' : '7px',
                              //   left: isRTL ? '7px' : 'unset',
                              // },
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            IconComponent={(props) => (
                              <ArrowDropDownIcon
                                {...props}
                                style={{ color: 'black' }}
                              />
                            )}
                          >
                            {filteredCohortData?.length !== 0 ? (
                              filteredManipulatedCohortData?.map(
                                (cohort: any) => (
                                  <MenuItem
                                    key={cohort.cohortId}
                                    value={cohort.cohortId}
                                    style={{
                                      fontWeight: '500',
                                      fontSize: '14px',
                                      color: theme.palette.warning['A200'],
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {toPascalCase(cohort.name)}{' '}
                                    {cohort?.typeOfCohort ===
                                      CenterType.REGULAR ||
                                      (CenterType.UNKNOWN &&
                                        `(${cohort?.typeOfCohort?.toLowerCase()})`)}
                                  </MenuItem>
                                )
                              )
                            ) : (
                              <Typography
                                style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: theme.palette.warning['A200'],
                                  padding: '0 15px',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography color={theme.palette.warning['300']}>
                          {toPascalCase(filteredCohortData[0]?.name)}
                        </Typography>
                      )}
                      {filteredBatchData?.length > 1 ? (
                        <FormControl
                          className="drawer-select"
                          sx={{
                            m: 0,
                            width: '100%',
                            // '@media (max-width: 700px)': {
                            //   width: '50%',
                            // },
                          }}
                        >
                          {showFloatingLabel && (
                            <InputLabel id="batch-select-label">
                              {t('COMMON.BATCH')}
                            </InputLabel>
                          )}
                          <Select
                            value={classId || filteredBatchData?.[0]?.cohortId}
                            labelId="batch-select-label"
                            onChange={handleBatchSelection}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className="select-languages capitalize fs-14 fw-500 bg-white"
                            sx={{
                              borderRadius: '0.5rem',
                              color: theme.palette.warning['200'],
                              width: '100%',
                              marginBottom: '0rem',
                              '@media (max-width: 900px)': {
                                width: isAttendanceOverview ? '100%' : '62%',
                              },
                              // '& .MuiSelect-icon': {
                              //   right: isRTL ? 'unset' : '7px',
                              //   left: isRTL ? '7px' : 'unset',
                              // },
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            IconComponent={(props) => (
                              <ArrowDropDownIcon
                                {...props}
                                style={{ color: 'black' }}
                              />
                            )}
                          >
                            {filteredBatchData?.length !== 0 ? (
                              filteredManipulatedBatchData?.map(
                                (cohort: any) => (
                                  <MenuItem
                                    key={cohort.cohortId}
                                    value={cohort.cohortId}
                                    style={{
                                      fontWeight: '500',
                                      fontSize: '14px',
                                      color: theme.palette.warning['A200'],
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {toPascalCase(cohort.name)}
                                  </MenuItem>
                                )
                              )
                            ) : (
                              <Typography
                                style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: theme.palette.warning['A200'],
                                  padding: '0 15px',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <Typography color={theme.palette.warning['300']}>
                          {toPascalCase(filteredBatchData[0]?.name)}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Box className="mt-md-16">
                    <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
                      {filteredCohortData?.length > 1 ? (
                        <FormControl
                          className={showFloatingLabel ? '' : 'drawer-select'}
                          sx={{ m: 0, width: '100%' }}
                        >
                          {showFloatingLabel && (
                            <InputLabel id="center-select-label">
                              {t('COMMON.CENTER')}
                            </InputLabel>
                          )}
                          <Select
                            labelId="center-select-label"
                            label={showFloatingLabel ? t('COMMON.CENTER') : ''}
                            value={
                              centerId
                                ? centerId
                                : filteredCohortData[0]?.cohortId
                            }
                            onChange={handleCohortSelection}
                            // displayEmpty
                            // style={{ borderRadius: '4px' }}

                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            className={
                              showFloatingLabel
                                ? ''
                                : 'select-languages fs-14 fw-500 bg-white'
                            }
                            sx={
                              showFloatingLabel
                                ? { borderRadius: '4px' }
                                : {
                                  borderRadius: '0.5rem',
                                  color: theme.palette.warning['200'],
                                  width: '100%',
                                  marginBottom: '0rem',
                                  marginRight: '10px',
                                  '@media (max-width: 902px)': {
                                    width: isAttendanceOverview
                                      ? '100%'
                                      : '62%',
                                  },
                                  '@media (max-width: 702px)': {
                                    width: isAttendanceOverview
                                      ? '100%'
                                      : '65%',
                                  }
                                }
                            }
                          >
                            {filteredCohortData?.length !== 0 ? (
                              filteredManipulatedCohortData?.map(
                                (cohort: any) => (
                                  <MenuItem
                                    key={cohort.cohortId}
                                    value={cohort.cohortId}
                                    style={{
                                      fontWeight: '500',
                                      fontSize: '14px',
                                      color: theme.palette.warning['A200'],
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {toPascalCase(cohort?.name)}
                                  </MenuItem>
                                )
                              )
                            ) : (
                              <Typography
                                style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: theme.palette.warning['A200'],
                                  padding: '0 15px',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <>
                          {showDisabledDropDown &&
                            filteredCohortData?.length === 1 ? (
                            <FormControl
                              disabled={true}
                              className={
                                showFloatingLabel ? '' : 'drawer-select'
                              }
                              sx={{ m: 0, width: '100%' }}
                            >
                              {showFloatingLabel && (
                                <InputLabel id="center-select-label">
                                  {t('COMMON.CENTER')}
                                </InputLabel>
                              )}
                              <Select
                                labelId="center-select-label"
                                label={
                                  showFloatingLabel ? t('COMMON.CENTER') : ''
                                }
                                value={filteredCohortData[0]?.cohortId}
                              >
                                <MenuItem
                                  key={filteredCohortData[0]?.cohortId}
                                  value={filteredCohortData[0]?.cohortId}
                                  style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: theme.palette.warning['A200'],
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {filteredCohortData[0]?.name}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <Typography color={theme.palette.warning['300']}>
                              {toPascalCase(filteredCohortData[0]?.name)}
                            </Typography>
                          )}
                        </>
                      )}
                      {filteredBatchData?.length > 1 ? (
                        <FormControl
                          className={showFloatingLabel ? '' : 'drawer-select'}
                          sx={{ m: 0, width: '100%' }}
                        >
                          {showFloatingLabel && (
                            <InputLabel id="batch-select-label">
                              {t('COMMON.BATCH')}
                            </InputLabel>
                          )}
                          <Select
                            labelId="batch-select-label"
                            label={showFloatingLabel ? t('COMMON.BATCH') : ''}
                            value={
                              classId
                                ? classId
                                : filteredBatchData[0]?.cohortId
                            }
                            onChange={handleBatchSelection}
                            // displayEmpty
                            // style={{ borderRadius: '4px' }}

                            inputProps={{ 'aria-label': 'Without label' }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250,
                                },
                              },
                            }}
                            className={
                              showFloatingLabel
                                ? ''
                                : 'select-languages fs-14 fw-500 bg-white'
                            }
                            sx={
                              showFloatingLabel
                                ? { borderRadius: '4px' }
                                : {
                                  borderRadius: '0.5rem',
                                  color: theme.palette.warning['200'],
                                  width: '100%',
                                  marginBottom: '0rem',
                                  marginRight: '10px',
                                  '@media (max-width: 902px)': {
                                    width: isAttendanceOverview
                                      ? '100%'
                                      : '62%',
                                  },
                                  '@media (max-width: 702px)': {
                                    width: isAttendanceOverview
                                      ? '100%'
                                      : '65%',
                                  }
                                }
                            }
                          >
                            {filteredBatchData?.length !== 0 ? (
                              filteredManipulatedBatchData?.map(
                                (cohort: any) => (
                                  <MenuItem
                                    key={cohort.cohortId}
                                    value={cohort.cohortId}
                                    style={{
                                      fontWeight: '500',
                                      fontSize: '14px',
                                      color: theme.palette.warning['A200'],
                                      textTransform: 'capitalize',
                                    }}
                                  >
                                    {toPascalCase(cohort?.name)}
                                  </MenuItem>
                                )
                              )
                            ) : (
                              <Typography
                                style={{
                                  fontWeight: '500',
                                  fontSize: '14px',
                                  color: theme.palette.warning['A200'],
                                  padding: '0 15px',
                                }}
                              >
                                {t('COMMON.NO_DATA_FOUND')}
                              </Typography>
                            )}
                          </Select>
                        </FormControl>
                      ) : (
                        <>
                          {showDisabledDropDown &&
                            filteredBatchData?.length === 1 ? (
                            <FormControl
                              disabled={true}
                              className={
                                showFloatingLabel ? '' : 'drawer-select'
                              }
                              sx={{ m: 0, width: '100%' }}
                            >
                              {showFloatingLabel && (
                                <InputLabel id="batch-select-label">
                                  {t('COMMON.CENTER')}
                                </InputLabel>
                              )}
                              <Select
                                labelId="batch-select-label"
                                label={
                                  showFloatingLabel ? t('COMMON.CENTER') : ''
                                }
                                value={filteredBatchData[0]?.cohortId}
                              >
                                <MenuItem
                                  key={filteredBatchData[0]?.cohortId}
                                  value={filteredBatchData[0]?.cohortId}
                                  style={{
                                    fontWeight: '500',
                                    fontSize: '14px',
                                    color: theme.palette.warning['A200'],
                                    textTransform: 'capitalize',
                                  }}
                                >
                                  {filteredBatchData[0]?.name}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          ) : (
                            <Typography color={theme.palette.warning['300']}>
                              {toPascalCase(filteredBatchData[0]?.name)}
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default CohortSelectionSection;
