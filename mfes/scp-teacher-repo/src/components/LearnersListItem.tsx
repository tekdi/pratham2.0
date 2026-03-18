//@ts-nocheck
import { Role, Status, Telemetry } from '@/utils/app.constant';
import {
  BulkCreateCohortMembersRequest,
  LearnerListProps,
  UpdateCustomField,
  UserData,
} from '@/utils/Interfaces';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import BottomDrawer from './BottomDrawer';
import ConfirmationModal from './ConfirmationModal';
import DeleteUserModal from './DeleteUserModal';
import DropOutModal from './DropOutModal';
import LearnerModal from './LearnerModal';
import Loader from './Loader';
import ManageCentersModal from './ManageCentersModal';
// import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { bulkCreateCohortMembers } from '@/services/CohortServices';
import { updateCohortMemberStatus } from '@/services/MyClassDetailsService';
import { getUserDetails } from '@/services/ProfileService';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import useStore from '@/store/store';
import { capitalizeEachWord, filterMiniProfileFields } from '@/utils/Helper';
import { fetchAttendanceStats } from '@/utils/helperAttendanceStatApi';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ReactGA from 'react-ga4';
import manageUserStore from '../store/manageUserStore';
import { showToastMessage } from './Toastify';
import LearnerManage from '@/shared/LearnerManage/LearnerManage';
import axios from 'axios';
import { telemetryFactory } from '@/utils/telemetry';
import LMPSingleBatchListWidget from '@shared-lib-v2/MapUser/LMPSingleBatchListWidget';
import CloseIcon from '@mui/icons-material/Close';

type Anchor = 'bottom';

const LearnersListItem: React.FC<LearnerListProps> = ({
  type,
  userId,
  learnerName,
  isDropout,
  enrollmentId,
  cohortMembershipId,
  statusReason,
  reloadState,
  setReloadState,
  block,
  center,
  showMiniProfile,
  onLearnerDelete,
  isFromProfile = false,
  customFields,
  myCenterList,
  myCenterIds,
}) => {
  const [state, setState] = React.useState({
    bottom: false,
  });
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [isUserDeleted, setIsUserDeleted] = React.useState<boolean>(false);
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [
    confirmationModalReassignCentersOpen,
    setConfirmationModalReassignCentersOpen,
  ] = React.useState<boolean>(false);

  const [learnerState, setLearnerState] = React.useState({
    loading: false,
    isModalOpenLearner: false,
    userData: null as UserData | null,
    userName: '',
    contactNumber: '',
    enrollmentNumber: '',
    customFieldsData: [] as UpdateCustomField[],
    gender: '',
  });
  const userStore = useStore();
  const theme = useTheme<any>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { t } = useTranslation();
  const loggedInUserRole = localStorage.getItem('role');

  const [openCentersModal, setOpenCentersModal] = React.useState(false);
  const [openDeleteUserModal, setOpenDeleteUserModal] = React.useState(false);
  const [centers, setCenters] = React.useState();
  const [centersName, setCentersName] = React.useState();
  const store = manageUserStore();
  const reassignStore = reassignLearnerStore();
  const setReassignId = reassignLearnerStore((state) => state.setReassignId);
  const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: 'underline',
    textDecorationColor: theme?.palette?.secondary.main,
    textDecorationThickness: '1px',
  }));
  const setCohortLearnerDeleteId = manageUserStore(
    (state) => state.setCohortLearnerDeleteId
  );
  const isActiveYear = userStore.isActiveYearSelected;

  const [reassignModalOpen, setReassignModalOpen] =
    React.useState<boolean>(false);

  //reassign modal variables
  // const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [selectedCenterIdReassign, setSelectedCenterIdReassign] = useState<
    string | string[] | null
  >(null);
  const [originalCenterIdReassign, setOriginalCenterIdReassign] = useState<
    string | string[] | null
  >(null);
  const [selectedCenterListReassign, setSelectedCenterListReassign] = useState<
    any[]
  >([]);
  const [selectedBatchListReassign, setSelectedBatchListReassign] = useState<
    any[]
  >([]);
  const [selectedUserIdReassign, setSelectedUserIdReassign] = useState<
    string | null
  >(null);
  const [isReassignInProgress, setReassignInProgress] = useState(false);
  const [isReassignModelProgress, setIsReassignModelProgress] = useState(false);

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
      // window.location.reload();
    }
    const cohorts = userStore.cohorts;
    const centers = cohorts
      .filter((cohort: { status: any }) => cohort.status !== Status.ARCHIVED)
      .map((cohort: { name: string; cohortId: string; status: any }) => ({
        name: cohort?.name,
        cohortId: cohort?.cohortId,
      }));
    const centersName = centers?.map((center: { name: any }) => center?.name);

    setCenters(centers);
    setCentersName(centersName);
  }, [reloadState, setReloadState, userStore.cohorts]);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setCohortLearnerDeleteId(cohortMembershipId);
        setReassignId(userId);

        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, bottom: open });
      };

  const setLoading = (loading: boolean) => {
    setLearnerState((prevState) => ({ ...prevState, loading }));
  };

  const setIsModalOpenLearner = (isOpen: boolean) => {
    setLearnerState((prevState) => ({
      ...prevState,
      isModalOpenLearner: isOpen,
    }));
  };

  const setUserData = (data: UserData | null) => {
    setLearnerState((prevState) => ({ ...prevState, userData: data }));
  };

  const setUserName = (name: string) => {
    setLearnerState((prevState) => ({ ...prevState, userName: name }));
  };

  const setContactNumber = (number: string) => {
    setLearnerState((prevState) => ({ ...prevState, contactNumber: number }));
  };

  const setEnrollmentNumber = (number: string) => {
    setLearnerState((prevState) => ({
      ...prevState,
      enrollmentNumber: number,
    }));
  };

  const setCustomFieldsData = (fields: UpdateCustomField[]) => {
    setLearnerState((prevState) => ({
      ...prevState,
      customFieldsData: fields,
    }));
  };

  const handleUnmarkDropout = async () => {
    try {
      setLoading(true);

      if (cohortMembershipId) {
        const memberStatus = Status.ACTIVE;
        const membershipId = cohortMembershipId;

        const response = await updateCohortMemberStatus({
          memberStatus,
          membershipId,
        });

        if (response?.responseCode !== 200 || response?.params?.err) {
          ReactGA.event('unmark-dropout-student-error', {
            cohortMembershipId: membershipId,
          });
          throw new Error(
            response.params?.errmsg ||
            'An error occurred while updating the user.'
          );
        } else {
          ReactGA.event('unmark-dropout-student-successful', {
            cohortMembershipId: membershipId,
          });
          showToastMessage(t('COMMON.LEARNER_UNMARKED_DROPOUT'), 'success');
          setReloadState(true);
        }
      }
    } catch (error) {
      console.log(error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to transform cohorts array into cohortData format
  const transformCohortsToCohortData = (cohorts: any[]): any[] => {
    if (!cohorts || !Array.isArray(cohorts)) {
      return [];
    }

    return cohorts.map((cohort: any) => (cohort));
  };

  const listItemClick = async (event: React.MouseEvent, name: string) => {
    if (name === 'mark-drop-out') {
      setShowModal(true);
    } else if (name === 'unmark-drop-out') {
      handleUnmarkDropout();
    }
    if (name === 'reassign-batch') {
      //handle reassign batch functionality here
      // setOpenCentersModal(true);
      // console.log('CustomeFields!!!!!!!!!!!!!', customFields);
      //new flow of reassign learner batch

      //TODO: Add reassign logic here
      const reassignuserId = userId;

      //reassign data fetch code

      setReassignModalOpen(true);
      setSelectedCenterIdReassign(null); // Reset center selection when dialog closes
      setOriginalCenterIdReassign(null); // Reset original center selection when dialog closes
      setSelectedCenterListReassign([]); // Reset center list when dialog closes
      setSelectedBatchListReassign([]); // Reset batch list when dialog closes
      setSelectedUserIdReassign(null); // Reset user selection when dialog closes
      setIsReassignModelProgress(true);

      //get cohortdata
      // Extract centers from response
      // Response structure: response.data.result is an array of cohorts
      let centerId = localStorage.getItem('centerId');
      let batchId = localStorage.getItem('cohortId');
      const cohortData = [{
        "centerId": centerId,
        "centerName": "",
        "centerStatus": "active",
        "batchId": batchId,
        "batchName": "",
        "batchStatus": "active",
        "cohortMember": {
          "status": "active",
          "membershipId": ""
        }
      }];

      //load prefilled value
      // Transform cohorts to cohortData format
      // console.log('sasasasasselectedUser', selectedUser);
      // const cohortData = selectedUser?.cohorts
      //   ? transformCohortsToCohortData(selectedUser.cohorts)
      //   : [];
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };
      setSelectedUserIdReassign(userId);

      const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/geographical-hierarchy`;
      let response = null;
      try {
        const centerIds = myCenterList?.length > 0
          ? myCenterList.map((center: any) => center.value).filter((id: any) => id)
          : [];
        response = await axios.post(apiUrl, { userId: userId, filters: { parentId: centerIds } }, { headers });
      }
      catch (e) { }
      const geographicalData = response?.data?.result?.data || [];

      // Transform geographicalData into centerList
      let centerList = [];
      const batchList = [];
      const centerIdArray = [];


      geographicalData.forEach((state) => {
        state.districts?.forEach((district) => {
          district.blocks?.forEach((block) => {
            block.centers?.forEach((center) => {
              center.batches?.forEach((batch) => {
                // Check if centerId exists in cohortData with active status
                // Filter all entries for the same centerId and check if any has both statuses active
                const cohortCenterBatch = cohortData?.filter(
                  (item: any) => item?.centerId === center.centerId && item?.batchId === batch.batchId
                );
                const isActiveCenterBatch = cohortCenterBatch?.some(
                  (cohortCenterBatchs: any) =>
                    cohortCenterBatchs?.cohortMember?.status === 'active' && cohortCenterBatchs?.centerStatus === 'active' && cohortCenterBatchs?.batchStatus === 'active'
                );

                // Only push if center has active cohortMember status
                if (isActiveCenterBatch) {
                  const centerObject = {
                    value: center.centerId,
                    label: center.centerName,
                    state: state.stateName,
                    district: district.districtName,
                    block: block.blockName,
                    village: null, // villageName might not exist in the structure
                    stateId: state.stateId,
                    districtId: district.districtId,
                    blockId: block.blockId,
                    villageId: null, // villageId might not exist in the structure
                  };
                  centerList.push(centerObject);
                  const centerBatchObject = {
                    id: batch.batchId,
                    name: batch.batchName,
                    centerId: center.centerId,
                    centerName: center.centerName,
                    state: state.stateName,
                    district: district.districtName,
                    block: block.blockName,
                    village: null, // villageName might not exist in the structure
                    stateId: state.stateId,
                    districtId: district.districtId,
                    blockId: block.blockId,
                    villageId: null, // villageId might not exist in the structure
                  };
                  batchList.push(centerBatchObject);
                  centerIdArray.push(batch.batchId);
                }
              });
            });
          });
        });
      });

      // Remove duplicates from centerList based on value field
      const uniqueCenterMap = new Map();
      centerList.forEach((center) => {
        if (!uniqueCenterMap.has(center.value)) {
          uniqueCenterMap.set(center.value, center);
        }
      });
      centerList = Array.from(uniqueCenterMap.values());

      setSelectedCenterIdReassign(
        centerIdArray.length > 0 ? centerIdArray : null
      );
      setOriginalCenterIdReassign(
        centerIdArray.length > 0 ? centerIdArray : null
      );
      setSelectedCenterListReassign(centerList);
      setSelectedBatchListReassign(batchList);
      setIsReassignModelProgress(false);

      const telemetryInteract = {
        context: {
          env: 'teaching-center',
          cdata: [],
        },
        edata: {
          id: 'click-on-reassign-batch:' + userId,
          type: Telemetry.CLICK,
          subtype: '',
          pageid: 'learner-batch-reassign',
        },
      };
      telemetryFactory.interact(telemetryInteract);


    }
    if (name === 'delete-User') {
      setOpenDeleteUserModal(true);
    }
    setState({ ...state, bottom: false });
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      //API call to check if today's attendance is marked. If yes, don't allow achieve today
      if (type == Role.STUDENT) {
        const attendanceStats = await fetchAttendanceStats(userId);
        if (attendanceStats && attendanceStats.length > 0) {
          showToastMessage(
            t('COMMON.CANNOT_DELETE_TODAY_ATTENDANCE_MARKED'),
            'error'
          );
        }
      } else if (cohortMembershipId) {
        const memberStatus = Status.ARCHIVED;
        const membershipId = cohortMembershipId;

        const response = await updateCohortMemberStatus({
          memberStatus,
          membershipId,
        });

        if (response?.responseCode !== 200 || response?.params?.err) {
          ReactGA.event('remove-student-error', {
            cohortMembershipId: membershipId,
          });
          throw new Error(
            response.params?.errmsg ||
            'An error occurred while updating the user.'
          );
        } else {
          ReactGA.event('remove-student-successful', {
            cohortMembershipId: membershipId,
          });
          showToastMessage(t('COMMON.LEARNER_REMOVED'), 'success');
          setReloadState(true);
        }
      }
    } catch (error) {
      console.log(error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    } finally {
      setLoading(false);
    }
    setConfirmationModalOpen(false);
    setState({ ...state, bottom: false });
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
    setConfirmationModalReassignCentersOpen(false);
    setOpenDeleteUserModal(false);
  };

  const handleDroppedOutLabelClick = () => {
    setShowModal(true);
  };

  const handleOpenModalLearner = (userId: string) => {
    fetchUserDetails(userId);
    setIsModalOpenLearner(true);
  };

  const handleCloseModalLearner = () => {
    setIsModalOpenLearner(false);
  };

  const handleTeacherFullProfile = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  //message constants
  const successCreateMessage = 'LEARNERS.LEARNER_UPDATED_SUCCESSFULLY';
  const failureCreateMessage = 'COMMON.NOT_ABLE_UPDATE_LEARNER';

  const fetchUserDetails = async (userId: string) => {
    try {
      if (userId) {
        setLoading(true);
        const response = await getUserDetails(userId, true);
        if (response?.responseCode === 200) {
          const data = response?.result;
          if (data) {
            const userData = data?.userData;
            setUserData(userData);
            setUserName(
              [userData?.firstName, userData?.middleName, userData?.lastName]
                .filter(Boolean)
                .join(' ')
            );
            setContactNumber(userData?.mobile);
            setEnrollmentNumber(userData?.username);
            const customDataFields = userData?.customFields;
            if (customDataFields?.length > 0) {
              setCustomFieldsData(customDataFields);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFields = filterMiniProfileFields(learnerState.customFieldsData);

  console.log('filteredFields', learnerState);

  // const getTeamLeadersCenters = async () => {};

  const handleCloseCentersModal = () => {
    setOpenCentersModal(false);
  };
  const handleLearnerReassigned = () => {
    setReloadState(!reloadState);
  };

  // const handleAssignCenters = async (selectedCenters: any) => {
  //   setOpenCentersModal(false);
  //   setConfirmationModalReassignCentersOpen(true);
  // };

  const handleReassignCenterRequest = async () => {
    const attendanceStats = await fetchAttendanceStats(userId);
    if (attendanceStats && attendanceStats.length > 0) {
      showToastMessage(
        t('COMMON.CANNOT_REASSIGN_TODAY_ATTENDANCE_MARKED'),
        'error'
      );
    } else {
      const payload: BulkCreateCohortMembersRequest = {
        userId: [reassignStore?.reassignId],
        cohortId: [reassignStore?.cohortId],
        removeCohortId: [reassignStore?.removeCohortId],
      };

      try {
        const response = await bulkCreateCohortMembers(payload);
        console.log('Cohort members created successfully', response);

        showToastMessage(
          t('MANAGE_USERS.CENTERS_REASSIGNED_SUCCESSFULLY'),
          'success'
        );
        setReloadState(!reloadState);
      } catch (error) {
        console.error('Error creating cohort members', error);
        showToastMessage(t('MANAGE_USERS.CENTERS_REQUEST_FAILED'), 'error');
      }
    }
  };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
    setCohortLearnerDeleteId(cohortMembershipId);
    setReassignId(userId);
  };

  const renderCustomContent = () => {
    if (isDropout) {
      return (
        <Box
          sx={{
            padding: '10px 16px 10px 16px',
            mx: '20px',
            borderRadius: '12px',
            bgcolor: theme.palette.success.contrastText,
          }}
        >
          <Typography
            variant="h5"
            color={theme.palette.warning[400]}
            fontWeight="600"
          >
            {t('COMMON.REASON_FOR_DROPOUT')}
          </Typography>
          <Typography
            variant="h3"
            color={theme.palette.warning[300]}
            fontWeight="500"
          >
            {statusReason}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  const handleUserDelete = () => {
    setIsUserDeleted(true);
    onLearnerDelete();
  };
  const stringAvatar = (name: string) => {
    if (name) {
      const nameParts = name.split(' ');

      return {
        children:
          nameParts.length === 1
            ? nameParts[0][0]
            : `${nameParts[0][0]}${nameParts[1]?.[0] || ''}`,
      };
    }

    return '';
  };

  return (
    <>
      {isFromProfile ? (
        <Box>
          <MoreVertIcon
            onClick={(event) => {
              isMobile
                ? toggleDrawer('bottom', true)(event)
                : handleMenuOpen(event);
            }}
            sx={{
              fontSize: '32px',
              color: theme.palette.warning['300'],
              cursor: 'pointer',
            }}
          />
        </Box>
      ) : (
        <Box>
          {learnerState.loading ? (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          ) : (
            <LearnerModal
              userId={userId}
              open={learnerState.isModalOpenLearner}
              onClose={handleCloseModalLearner}
              data={filteredFields}
              userName={learnerState.userName}
              contactNumber={learnerState.contactNumber}
              enrollmentNumber={learnerState.enrollmentNumber}
              gender={learnerState?.userData?.gender}
              email={learnerState?.userData?.email}
            />
          )}
          <Box
            px={2}
            sx={{
              '@media (max-width: 900px)': {
                borderBottom: `1px solid ${theme.palette.warning['A100']}`,
              },
              '@media (min-width: 900px)': {
                marginTop: '20px',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0',
                '@media (min-width: 900px)': {
                  border: `1px solid ${theme.palette.warning['A100']}`,
                  padding: '10px',
                  borderRadius: '8px',
                  background: theme.palette.warning['A400'],
                },
              }}
            >
              <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Box className="box_shadow_center">
                  <Box>
                    <Avatar
                      sx={{
                        background: '#EDE1CF' /* not in custom theme */,
                        color: theme.palette.warning['300'],
                        fontSize: '16px',
                        fontWeight: '500',
                      }}
                      {...stringAvatar(learnerName)}
                    />
                  </Box>
                </Box>
                <Box>
                  {isDropout ? (
                    <Box
                      sx={{
                        fontSize: '16px',
                        color: theme.palette.warning['400'],
                        fontWeight: '400',
                      }}
                    >
                      {learnerName}
                    </Box>
                  ) : (
                    <CustomLink
                      className="word-break"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Typography
                        onClick={() => {
                          showMiniProfile
                            ? handleOpenModalLearner(userId!)
                            : handleTeacherFullProfile(userId!);
                          // ReactGA.event('teacher-details-link-clicked', {
                          //   userId: userId,
                          // });
                        }}
                        sx={{
                          textAlign: 'left',
                          fontSize: '16px',
                          fontWeight: '400',
                          color: theme.palette.secondary.main,
                        }}
                      >
                        {learnerName}
                      </Typography>
                    </CustomLink>
                  )}

                  <Box
                    sx={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      justifyContent: 'left',
                    }}
                  >
                    {isDropout ? (
                      <Box
                        sx={{
                          fontSize: '12px',
                          color: theme.palette.warning['300'],
                          background: theme.palette.error.light,
                          fontWeight: '500',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                        }}
                        onClick={handleDroppedOutLabelClick}
                      >
                        <Box sx={{ marginTop: '1px' }}>
                          {t('COMMON.DROPPED_OUT')}
                        </Box>
                        <ErrorOutlineIcon style={{ fontSize: '13px' }} />
                      </Box>
                    ) : (
                      <>
                        {/* {
                          age &&
                          <>
                            <Box
                              sx={{
                                fontSize: '14px',
                                fontWeight: '400',
                                color: theme.palette.warning['400'],
                                // marginRight:'4px',
                                whiteSpace:'nowrap'
                              }}
                                // className="one-line-text"
                            >
                              {age + ' y/o'}
                            </Box>
                            <FiberManualRecordIcon
                              style={{ fontSize: '8px', color: '#CDC5BD' }}
                            />
                          </>
                        } */}
                        <Box
                          sx={{
                            fontSize: '14px',
                            fontWeight: '400',
                            color: theme.palette.warning['400'],
                            wordBreak: 'break-all',
                          }}
                          className="one-line-text"
                        >
                          {enrollmentId}
                        </Box>
                      </>
                    )}
                  </Box>
                  {!isDropout && (
                    <Box
                      display={'flex'}
                      gap={'10px'}
                      alignItems={'center'}
                      justifyContent={'left'}
                    >
                      <Box
                        sx={{
                          fontSize: '14px',
                          fontWeight: '400',
                          color: theme.palette.warning['400'],
                        }}
                      >
                        {block}
                      </Box>

                      <Box
                        sx={{
                          fontSize: '14px',
                          fontWeight: '400',
                          color: theme.palette.warning['400'],
                        }}
                      >
                        {center}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
              {isActiveYear && (
                <MoreVertIcon
                  onClick={(event) => {
                    isMobile
                      ? toggleDrawer('bottom', true)(event)
                      : handleMenuOpen(event);
                  }}
                  sx={{
                    fontSize: '24px',
                    color: theme.palette.warning['300'],
                    cursor: 'pointer',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}

      <BottomDrawer
        toggleDrawer={toggleDrawer}
        state={state}
        listItemClick={listItemClick}
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        isMobile={isMobile}
        optionList={
          block
            ? [
              // TODO: Integrate todo service
              // {
              //   label: t('COMMON.REASSIGN_BLOCKS_REQUEST'),
              //   icon: (
              //     <LocationOnOutlinedIcon
              //       sx={{ color: theme.palette.warning['300'] }}
              //     />
              //   ),
              //   name: 'reassign-block-request',
              // },
              {
                label: t('COMMON.REASSIGN_CENTERS'),
                icon: (
                  <ApartmentIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'reassign-centers',
              },
              {
                label: isDropout
                  ? t('COMMON.UNMARK_DROP_OUT')
                  : t('COMMON.MARK_DROP_OUT'),
                icon: (
                  <NoAccountsIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: isDropout ? 'unmark-drop-out' : 'mark-drop-out',
              },
              {
                label: t('COMMON.DELETE_USER'),
                icon: (
                  <DeleteOutlineIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'delete-User',
              },
            ].filter((option) => {
              // If isDropout is true, only show unmark-drop-out option
              if (isDropout) {
                return option.name === 'unmark-drop-out';
              }
              // Otherwise, apply existing filter logic
              return (
                (type === Role.STUDENT ||
                  (option.name !== 'mark-drop-out' &&
                    option.name !== 'unmark-drop-out')) &&
                (!(isFromProfile || isDropout) ||
                  option.name !== 'reassign-centers')
              );
            })
            : [
              // Only TL will see this option
              ...(loggedInUserRole === Role.TEAM_LEADER
                ? [
                  {
                    label: t('COMMON.REASSIGN_BATCH'),
                    icon: (
                      <ApartmentIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'reassign-batch',
                  },
                ]
                : []),
              {
                label: isDropout
                  ? t('COMMON.UNMARK_DROP_OUT')
                  : t('COMMON.MARK_DROP_OUT'),
                icon: (
                  <NoAccountsIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: isDropout ? 'unmark-drop-out' : 'mark-drop-out',
              },
              {
                label: t('COMMON.DELETE_USER_FROM_CENTER'),
                icon: (
                  <DeleteOutlineIcon
                    sx={{ color: theme.palette.warning['300'] }}
                  />
                ),
                name: 'delete-User',
              },
            ].filter((option) => {
              // If isDropout is true, only show unmark-drop-out option
              if (isDropout) {
                return option.name === 'unmark-drop-out';
              }
              // Otherwise, apply existing filter logic
              return (
                (type === Role.STUDENT ||
                  (option.name !== 'mark-drop-out' &&
                    option.name !== 'unmark-drop-out')) &&
                (!(isFromProfile || isDropout) ||
                  option.name !== 'reassign-centers')
              );
            })
        }
        renderCustomContent={renderCustomContent}
      />

      {isDropout ? (
        <DropOutModal
          open={showModal}
          onClose={() => setShowModal(false)}
          cohortMembershipId={cohortMembershipId}
          isButtonAbsent={true}
          statusReason={statusReason}
          userId={userId}
          reloadState={reloadState}
          setReloadState={setReloadState}
        />
      ) : (
        <DropOutModal
          open={showModal}
          onClose={() => setShowModal(false)}
          cohortMembershipId={cohortMembershipId}
          userId={userId}
          reloadState={reloadState}
          setReloadState={setReloadState}
        />
      )}

      <ConfirmationModal
        message={t('COMMON.SURE_REASSIGN_CENTER')}
        handleAction={handleReassignCenterRequest}
        buttonNames={{
          primary: t('COMMON.YES'),
          secondary: t('COMMON.NO_GO_BACK'),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalReassignCentersOpen}
      />

      <ConfirmationModal
        message={t('COMMON.SURE_REMOVE')}
        handleAction={handleAction}
        buttonNames={{
          primary: t('COMMON.YES'),
          secondary: t('COMMON.NO_GO_BACK'),
        }}
        handleCloseModal={handleCloseModal}
        modalOpen={confirmationModalOpen}
      />
      {/* Onclick of reassign batch this modal opens */}

      {openCentersModal && (
        <LearnerManage
          open={openCentersModal}
          onClose={handleCloseCentersModal}
          isReassign={true}
          customFields={customFields}
          onLearnerReassigned={handleLearnerReassigned}
          userId={userId}
        />
      )}

      {reassignModalOpen && (
        //TODO: Add new reassign popup here
        //new reassign flow


        <Dialog
          open={reassignModalOpen}
          onClose={(event, reason) => {
            // Prevent closing on backdrop click
            if (reason !== 'backdropClick') {
              setReassignModalOpen(false);
              setSelectedCenterIdReassign(null); // Reset center selection when dialog closes
              setOriginalCenterIdReassign(null); // Reset original center selection when dialog closes
              setSelectedCenterListReassign(null); // Reset center list selection when dialog closes
              setSelectedBatchListReassign(null); // Reset batch selection when dialog closes
              setSelectedUserIdReassign(null); // Reset user selection when dialog closes
            }
          }}
          // maxWidth={false}
          // fullWidth={true}
          PaperProps={{
            sx: {
              width: { xs: '100%', md: '40%' },
              maxWidth: { xs: '100%', md: '40%' },
              maxHeight: { xs: '100vh', md: '100vh' },
            },
          }}
        >
          <DialogTitle
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              p: 2,
            }}
          >
            <Typography variant="h1" component="div">
              {t('COMMON.REASSIGN_LEARNER_TO_BATCH')}
            </Typography>
            <IconButton
              aria-label={t('COMMON.CLOSE')}
              onClick={() => setReassignModalOpen(false)}
              sx={{
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
            {isReassignModelProgress ? (
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '150px',
                  }}
                >
                  <CircularProgress />
                  <Typography variant="h1" component="div" sx={{ mt: 2 }}>
                    {t('COMMON.LOADING_ELLIPSIS')}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ mb: 3 }}>
                <LMPSingleBatchListWidget
                  value={selectedCenterIdReassign}
                  onChange={(batchId) => {
                    setSelectedCenterIdReassign(batchId);
                  }}
                  onCenterList={(centerList) => {
                    setSelectedCenterListReassign(centerList || []);
                  }}
                  selectedCenterList={selectedCenterListReassign}
                  onBatchList={(batchList) => {
                    setSelectedBatchListReassign(batchList || []);
                  }}
                  selectedBatchList={selectedBatchListReassign}
                  label={t('COMMON.SELECT_BATCH_WIDGET_TITLE')}
                  required={true}
                  centerList={myCenterList}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={async () => {
                if (selectedUserIdReassign && selectedCenterIdReassign != null && selectedCenterIdReassign !== '') {
                  setReassignInProgress(true);
                  try {
                    const raw = selectedCenterIdReassign;
                    const cohortIds =
                      Array.isArray(raw)
                        ? raw.filter((id) => id != null && id !== '')
                        : [raw];

                    if (cohortIds.length === 0) {
                      showToastMessage(
                        t('COMMON.PLEASE_SELECT_BATCH'),
                        'error'
                      );
                      setReassignInProgress(false);
                      return;
                    }

                    const removedIds = originalCenterIdReassign?.filter(
                      (item: any) =>
                        !cohortIds.some(
                          (id) => String(id) === String(item)
                        )
                    );

                    const response = await bulkCreateCohortMembers({
                      userId: [selectedUserIdReassign],
                      cohortId: cohortIds,
                      //add remove cohort id check
                      ...(removedIds?.length > 0
                        ? { removeCohortId: removedIds }
                        : {}),
                    });

                    if (
                      response?.responseCode === 201 ||
                      response?.data?.responseCode === 201 ||
                      response?.status === 201
                    ) {
                      showToastMessage(t(successCreateMessage), 'success');
                      // Close dialog
                      setReassignModalOpen(false);
                      setSelectedCenterIdReassign(null);
                      setOriginalCenterIdReassign(null);
                      setSelectedCenterListReassign(null);
                      setSelectedBatchListReassign(null);
                      setSelectedUserIdReassign(null);
                      // Refresh the data
                      handleLearnerReassigned();
                    } else {
                      showToastMessage(
                        response?.data?.params?.errmsg ||
                        t(failureCreateMessage),
                        'error'
                      );
                    }
                  } catch (error) {
                    console.error('Error creating cohort member:', error);
                    showToastMessage(
                      error?.response?.data?.params?.errmsg ||
                      t(failureCreateMessage),
                      'error'
                    );
                  } finally {
                    setReassignInProgress(false);
                  }
                } else if (!selectedUserIdReassign) {
                  showToastMessage(
                    t('COMMON.PLEASE_SEARCH_AND_SELECT_USER'),
                    'error'
                  );
                } else {
                  showToastMessage(t('COMMON.PLEASE_SELECT_BATCH'), 'error');
                }
              }}
              disabled={
                !selectedUserIdReassign || !selectedCenterIdReassign || isReassignInProgress
              }
            >
              {t('COMMON.REASSIGN')}
            </Button>
          </DialogActions>
        </Dialog>


        // <FacilitatorManage
        //   open={reassignModalOpen}
        //   onClose={handleCloseReassignModal}
        //   isReassign={true}
        //   reassignuserId={
        //     isFromFLProfile ? teacherUserId : selectedUser?.userId
        //   }
        //   selectedUserData={
        //     isFromCenterDetailPage ? selectedUser : selectedUserData
        //   }
        //   // onFacilitatorAdded={handleFacilitatorAdded}
        // />

        //Old Reassign flow
        // <ReassignModal
        //   cohortNames={reassignCohortNames}
        //   message={t('COMMON.ADD_OR_REASSIGN_CENTERS')}
        //   handleAction={handleRequestBlockAction}
        //   handleCloseReassignModal={handleCloseReassignModal}
        //   modalOpen={reassignModalOpen}
        //   reloadState={reloadState}
        //   setReloadState={setReloadState}
        //   buttonNames={{ primary: t('COMMON.SAVE') }}
        //   selectedUser={selectedUser}
        // />

      )}

      {/* Old Reassign flow implementation */}
      {/* <ManageCentersModal
        open={openCentersModal}
        onClose={handleCloseCentersModal}
        centersName={centersName}
        centers={centers}
        onAssign={handleAssignCenters}
        isForLearner={true}
      /> */}

      <DeleteUserModal
        type={Role.STUDENT}
        userId={userId}
        open={openDeleteUserModal}
        onClose={handleCloseModal}
        onUserDelete={handleUserDelete}
        reloadState={reloadState}
        setReloadState={setReloadState}
      />
    </>
  );
};

export default LearnersListItem;
