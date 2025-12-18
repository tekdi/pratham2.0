// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import axiosInstance from '@/services/Interceptor';
import DynamicForm from '@shared-lib-v2/DynamicForm/components/DynamicForm';
import { enhanceUiSchemaWithGrid } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  TeamLeaderSearchSchema,
  TeamLeaderSearchUISchema,
} from '../constant/Forms/TeamLeaderSearch';
import { Role, RoleId, Status } from '@/utils/app.constant';
import { HierarchicalSearchUserList, userList } from '@/services/UserList';
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Button,
} from '@mui/material';
import { debounce, set } from 'lodash';
import { Numbers } from '@mui/icons-material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { bulkCreateCohortMembers, updateCohortMemberStatus } from '@/services/CohortService/cohortService';
import editIcon from '../../public/images/editIcon.svg';
import apartment from '../../public/images/apartment.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import Image from 'next/image';
import {
  extractMatchingKeys,
  fetchForm,
  searchListData,
} from '@/components/DynamicForm/DynamicFormCallback';
import { FormContext } from '@/components/DynamicForm/DynamicFormConstant';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import DeleteDetails from '@/components/DeleteDetails';
import { deleteUser } from '@/services/UserService';
import {
  calculateAge,
  calculateAgeFromDate,
  transformLabel,
} from '@/utils/Helper';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import ResetFiltersButton from '@/components/ResetFiltersButton/ResetFiltersButton';
import restoreIcon from '../../public/images/restore_user.svg';
import { showToastMessage } from '@/components/Toastify';
import CenterListWidget from '@shared-lib-v2/MapUser/CenterListWidget';
import EmailSearchUser from '@shared-lib-v2/MapUser/EmailSearchUser';
import { API_ENDPOINTS } from '@/utils/API/APIEndpoints';
import { updateUser } from '@/services/CreateUserService';
import { splitUserData } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { enrollUserTenant } from '@shared-lib-v2/MapUser/MapService';

const UserLeader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(TeamLeaderSearchSchema);
  const [uiSchema, setUiSchema] = useState(TeamLeaderSearchUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledState, setPrefilledState] = useState({});
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isReassign, setIsReassign] = useState(false);
  const [archiveToActiveOpen, setArchiveToActiveOpen] = useState(false);

  const [editableUserId, setEditableUserId] = useState('');
  const [roleId, setRoleID] = useState('');
  const [blockFieldId, setBlockFieldId] = useState('');
  const [districtFieldId, setDistrictFieldId] = useState('');

  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [village, setVillage] = useState('');
  const [reason, setReason] = useState('');
  const [userID, setUserId] = useState('');

  const { t, i18n } = useTranslation();
  const theme = useTheme<any>();
  const formRef = useRef(null);

  const [formStep, setFormStep] = useState(0);

  const initialFormData = localStorage.getItem('stateId')
    ? { state: [localStorage.getItem('stateId')] }
    : {};

  const searchStoreKey = 'teamLeader';
  const initialFormDataSearch =
    localStorage.getItem(searchStoreKey) &&
    localStorage.getItem(searchStoreKey) != '{}'
      ? JSON.parse(localStorage.getItem(searchStoreKey))
      : localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};

  useEffect(() => {
    if (response?.result?.totalCount !== 0) {
      searchData(prefilledFormData, 0);
    }
  }, [pageLimit]);
  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      const responseForm = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.teamLead.context}&contextType=${FormContext.teamLead.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.teamLead.context}&contextType=${FormContext.teamLead.contextType}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);
      // console.log('responseForm', responseForm);
      let alterSchema = responseForm?.schema;
      let alterUISchema = responseForm?.uiSchema;
      if (alterUISchema?.firstName) {
        alterUISchema.firstName['ui:disabled'] = true;
      }
      if (alterUISchema?.lastName) {
        alterUISchema.lastName['ui:disabled'] = true;
      }
      if (alterUISchema?.dob) {
        alterUISchema.dob['ui:disabled'] = true;
      }
      if (alterUISchema?.email) {
        alterUISchema.email['ui:disabled'] = true;
      }
      if (alterUISchema?.mobile) {
        alterUISchema.mobile['ui:disabled'] = true;
      }

      //bug fix for bakcend multiple times same fields in both form
      let requiredArray = alterSchema?.required;
      if (Array.isArray(requiredArray)) {
        // Remove duplicates from requiredArray
        requiredArray = Array.from(new Set(requiredArray));
      }
      alterSchema.required = requiredArray;

      //set 2 grid layout
      alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

      console.log('############# debugschema alterUISchema', alterUISchema);
      console.log('############# debugschema alterSchema', alterSchema);

      setAddSchema(alterSchema);
      setAddUiSchema(alterUISchema);
    };
    fetchData();
    setRoleID(RoleId.TEAM_LEADER);
    setTenantId(localStorage.getItem('tenantId'));
  }, []);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };
  const SubmitaFunction = async (formData: any) => {
    // console.log('###### debug issue formData', formData);
    if (Object.keys(formData).length > 0) {
      setPrefilledFormData(formData);
      //set prefilled search data on refresh
      localStorage.setItem(searchStoreKey, JSON.stringify(formData));
      await searchData(formData, 0);
    }
  };
  const HierarchicalSearchUserListCustom = async (data) => {
    const { role, tenantId, ...filteredFilters } = data.filters;
    const newData = {
      ...data,
      filters: filteredFilters,
    };
    return await HierarchicalSearchUserList({
      ...newData,
      role: [Role.TEAM_LEADER],
      customfields: ['state', 'district', 'block', 'village'],
    });
  };

  const userDelete = async () => {
    try {
      const resp = await deleteUser(userID, {
        userData: { reason: reason, status: 'archived' },
      });
      if (resp?.responseCode === 200) {
        // setResponse((prev) => ({
        //   ...prev, // Preserve other properties in `prev`
        //   result: {
        //     ...prev?.result, // Preserve other properties in `result`
        //     getUserDetails: prev?.result?.getUserDetails?.filter(
        //       (item) => item?.userId !== userID
        //     ),
        //   },
        // }));
        searchData(prefilledFormData, currentPage);
        console.log('Team leader successfully archived.');
      } else {
        console.error('Failed to archive team leader:', resp);
      }

      return resp;
    } catch (error) {
      console.error('Error updating team leader:', error);
    }
  };
  const archiveToactive = async () => {
    try {
      let membershipIds = null;

      // Attempt to get the cohort list
      try {
        const userCohortResp = await getCohortList(userID);
        if (userCohortResp?.result?.length) {
          membershipIds = userCohortResp?.result?.map(
            (item) => item.cohortMembershipId
          );
        } else {
          console.warn('No cohort data found for the user.');
        }
      } catch (error) {
        console.error('Failed to fetch cohort list:', error);
      }

      // Attempt to update cohort member status only if we got a valid membershipId
      if (membershipIds && Array.isArray(membershipIds)) {
        for (const membershipId of membershipIds) {
          try {
            const updateResponse = await updateCohortMemberStatus({
              memberStatus: 'active',
              //   statusReason: reason,
              membershipId,
            });

            if (updateResponse?.responseCode !== 200) {
              console.error(
                `Failed to archive user with membershipId ${membershipId}:`,
                updateResponse
              );
            } else {
              console.log(
                `User with membershipId ${membershipId} successfully archived.`
              );
            }
          } catch (error) {
            console.error(
              `Error archiving user with membershipId ${membershipId}:`,
              error
            );
          }
        }
      }

      // Always attempt to delete the user
      console.log('Proceeding to self-delete...');
      const resp = await deleteUser(userID, {
        userData: { status: 'active' },
      });
      showToastMessage(t('LEARNERS.ACTIVATE_USER_SUCCESS'), 'success');

      if (resp?.responseCode === 200) {
        // setResponse((prev) => ({
        //   ...prev,
        //   result: {
        //     ...prev?.result,
        //     getUserDetails: prev?.result?.getUserDetails?.filter(
        //       (item) => item?.userId !== userID
        //     ),
        //   },
        // }));
        searchData(prefilledFormData, currentPage);

        console.log('learner successfully aactive.');
      } else {
        console.error('Failed to archive team leader:', resp);
      }

      return resp;
    } catch (error) {
      console.error('Error updating team leader:', error);
    }
  };
  const searchData = async (formData, newPage) => {
    if (formData) {
      formData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => !Array.isArray(value) || value.length > 0
        )
      );
      const staticFilter = {
        role: 'Lead',
        tenantId: localStorage.getItem('tenantId'),
      };
      if (localStorage.getItem('roleName') === Role.ADMIN) {
        staticFilter.state = [localStorage.getItem('stateId')];
      }
      const { sortBy } = formData;
      const staticSort = ['firstName', sortBy || 'asc'];
      await searchListData(
        formData,
        newPage,
        staticFilter,
        pageLimit,
        setPageOffset,
        setCurrentPage,
        setResponse,
        HierarchicalSearchUserListCustom,
        staticSort
      );
    }
  };

  // Define table columns
  const columns = [
    {
      keys: ['firstName', 'middleName', 'lastName'],
      label: 'Team Lead Name',
      render: (row) =>
        `${transformLabel(row.firstName) || ''} ${
          transformLabel(row.middleName) || ''
        } ${transformLabel(row.lastName) || ''}`.trim(),
    },
    {
      keys: ['age'],
      label: 'Age',
      render: (row) => calculateAgeFromDate(row.dob) || '',
    },
    {
      keys: ['gender'],
      label: 'Gender',
      render: (row) => transformLabel(row.gender) || '',
    },
    {
      keys: ['STATE', 'DISTRICT', 'BLOCK'],
      label: 'State, District, Block',
      render: (row: any) => {
        const state = transformLabel(row?.customfield?.state) || '';
        const district = transformLabel(row?.customfield?.district) || '';
        const block = transformLabel(row?.customfield?.block) || '';
        return `${state == '' ? '' : `${state}`}${
          district == '' ? '' : `, ${district}`
        }${block == '' ? '' : `, ${block}`}`;
      },
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => transformLabel(row.status),
      getStyle: (row) => ({ color: row.status === 'active' ? 'green' : 'red' }),
    },
  ];

  // Define actions
  const actions = [
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Edit Team Leader"
    //     >
    //       <Image src={editIcon} alt="" />
    //     </Box>
    //   ),
    //   callback: (row) => {
    //     // console.log('row:', row);
    //     // console.log('AddSchema', addSchema);
    //     // console.log('AddUISchema', addUiSchema);
    //     let tempFormData = extractMatchingKeys(row, addSchema);
    //     setPrefilledAddFormData(tempFormData);
    //     setIsEdit(true);
    //     setIsReassign(false);
    //     setEditableUserId(row?.userId);
    //     handleOpenModal();
    //   },
    //   show: (row) => row.status !== 'archived',
    // },
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Delete Team Leader"
    //     >
    //       {' '}
    //       <Image src={deleteIcon} alt="" />{' '}
    //     </Box>
    //   ),
    //   callback: async (row) => {
    //     const findVillage = row?.customFields.find((item) => {
    //       if (item.label === 'BLOCK') {
    //         return item;
    //       }
    //     });
    //     setVillage(findVillage?.selectedValues[0]?.value);
    //     setUserId(row?.userId);
    //     setOpen(true);
    //     setFirstName(row?.firstName);
    //     setLastName(row?.lastName);
    //     setReason('');
    //     setChecked(false);
    //   },
    //   show: (row) => row.status !== 'archived',
    // },
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Reassign Team Leader"
    //     >
    //       <Image src={apartment} alt="" />
    //     </Box>
    //   ),
    //   callback: (row) => {
    //     // console.log('row:', row);
    //     // console.log('AddSchema', addSchema);
    //     // console.log('AddUISchema', addUiSchema);
    //     let tempFormData = extractMatchingKeys(row, addSchema);
    //     setPrefilledAddFormData(tempFormData);
    //     setIsEdit(false);
    //     setIsReassign(true);
    //     setEditableUserId(row?.userId);
    //     handleOpenModal();
    //   },
    //   show: (row) => row.status !== 'archived',
    // },
    // {
    //   icon: (
    //     <Box
    //       sx={{
    //         display: 'flex',
    //         flexDirection: 'column',
    //         alignItems: 'center',
    //         cursor: 'pointer',
    //         // backgroundColor: 'rgb(227, 234, 240)',
    //         justifyContent: 'center',
    //         padding: '10px',
    //       }}
    //       title="Reactivate Team Leader"
    //     >
    //       {' '}
    //       <Image src={restoreIcon} alt="" />{' '}
    //     </Box>
    //   ),
    //   callback: async (row) => {
    //     const findVillage = row?.customFields.find((item) => {
    //       if (item.label === 'VILLAGE') {
    //         return item;
    //       }
    //     });
    //     // console.log('row:', row?.customFields[2].selectedValues[0].value);
    //     setEditableUserId(row?.userId);
    //     setArchiveToActiveOpen(true);
    //     setUserId(row?.userId);
    //     const findVillagename = row?.customFields.find((item) => {
    //       if (item.label === 'BLOCK') {
    //         return item;
    //       }
    //     });
    //     setVillage(findVillagename?.selectedValues[0]?.value);
    //     setUserId(row?.userId);
    //     setFirstName(row?.firstName);
    //     setLastName(row?.lastName);
    //     // setReason('');
    //     // setChecked(false);
    //   },
    //   show: (row) => row.status !== 'active',
    // },
  ];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    // console.log('Page changed to:', newPage);
    searchData(prefilledFormData, newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    // console.log('Rows per page changed to:', newRowsPerPage);
    setPageLimit(newRowsPerPage);
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsReassign(false);
    setIsEdit(false);
  };

  //Add Edit Props
  const extraFieldsUpdate = {};
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: tenantId,
        roleId: roleId,
      },
    ],
    username: 'scpTeamLead',
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'TEAM_LEADERS.TEAM_LEADER_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'scp-team-lead-updated-successfully';
  const failureUpdateMessage = 'TEAM_LEADERS.NOT_ABLE_UPDATE_TEAM_LEADER';
  const successCreateMessage = 'TEAM_LEADERS.TEAM_LEADER_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'scp-team-lead-created-successfully';
  const failureCreateMessage = 'TEAM_LEADERS.NOT_ABLE_CREATE_TEAM_LEADER';
  const notificationKey = 'onTeamLeaderCreated';
  const notificationMessage = 'TEAM_LEADERS.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';
  const blockReassignmentNotificationKey = 'TL_BLOCK_REASSIGNMENT';
  const profileUpdateNotificationKey = 'TL_PROFILE_UPDATE';
  const districtUpdateNotificationKey = 'TL_DISTRICT_UPDATE';

  useEffect(() => {
    setPrefilledFormData(initialFormDataSearch);
  }, []);

  //new variables
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState<
    string | string[] | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMappingInProgress, setIsMappingInProgress] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {isLoading ? (
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        ) : (
          schema &&
          uiSchema && (
            <DynamicForm
              ref={formRef}
              schema={schema}
              uiSchema={updatedUiSchema}
              SubmitaFunction={SubmitaFunction}
              isCallSubmitInHandle={true}
              prefilledFormData={prefilledFormData}
            />
          )
        )}
        <Box mt={4} sx={{ display: 'flex', justifyContent: 'end' }}>
          <ResetFiltersButton
            searchStoreKey="teamLeader"
            formRef={formRef}
            SubmitaFunction={SubmitaFunction}
            setPrefilledFormData={setPrefilledFormData}
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            color="primary"
            sx={{
              textTransform: 'none',
              fontSize: '14px',
              color: theme.palette.primary['100'],
              width: '200px',
            }}
            onClick={() => {
              setPrefilledState({});
              setFormStep(0);
              setSelectedUserId(null);
              setUserDetails(null);
              setMapModalOpen(true);
            }}
          >
            {t('COMMON.ADD_NEW')}
          </Button>
        </Box>

        {response != null ? (
          <>
            {response && response?.result?.getUserDetails ? (
              <Box sx={{ mt: 1 }}>
                <PaginatedTable
                  count={response?.result?.totalCount}
                  data={response?.result?.getUserDetails}
                  columns={columns}
                  actions={actions}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  defaultPage={currentPage}
                  defaultRowsPerPage={pageLimit}
                />
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="20vh"
              >
                <Typography marginTop="10px" textAlign={'center'}>
                  {t('TEAM_LEADERS.NO_TEAM_LEADER_FOUND')}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <CenteredLoader />
        )}
      </Box>

      <ConfirmationPopup
        checked={checked}
        open={open}
        onClose={() => setOpen(false)}
        title={t('COMMON.DELETE_USER')}
        primary={t('COMMON.DELETE_USER_WITH_REASON')}
        secondary={t('COMMON.CANCEL')}
        reason={reason}
        onClickPrimary={userDelete}
      >
        <DeleteDetails
          firstName={firstName}
          lastName={lastName}
          village={village}
          checked={checked}
          setChecked={setChecked}
          reason={reason}
          setReason={setReason}
        />
      </ConfirmationPopup>
      <ConfirmationPopup
        checked={true}
        open={archiveToActiveOpen}
        onClose={() => setArchiveToActiveOpen(false)}
        title={t('COMMON.ACTIVATE_USER')}
        primary={t('COMMON.ACTIVATE')}
        secondary={t('COMMON.CANCEL')}
        reason={'yes'}
        onClickPrimary={archiveToactive}
      >
        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: 2,
            mb: 2,
            p: 1,
          }}
        >
          <Typography>
            {firstName} {lastName} {t('FORM.WAS_BELONG_TO')}
          </Typography>
          <TextField fullWidth value={village} disabled sx={{ mt: 1 }} />
        </Box>
        <Typography fontWeight="bold">
          {t('FORM.CONFIRM_TO_ACTIVATE')}
        </Typography>
      </ConfirmationPopup>

      {/* Map Modal Dialog */}
      <Dialog
        open={mapModalOpen}
        onClose={(event, reason) => {
          // Prevent closing on backdrop click
          if (reason !== 'backdropClick') {
            setMapModalOpen(false);
            setSelectedCenterId(null); // Reset center selection when dialog closes
            setSelectedUserId(null); // Reset user selection when dialog closes
            setUserDetails(null);
          }
        }}
        maxWidth={false}
        fullWidth={true}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            maxHeight: '100vh',
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
          {formStep === 1 ? (
            <Button
              sx={{
                backgroundColor: '#FFC107',
                color: '#000',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '14px',
                height: '40px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                textAlign: 'center',
                verticalAlign: 'middle',
                '&:hover': {
                  backgroundColor: '#ffb300',
                },
                p: 2,
              }}
              startIcon={<ArrowBackIcon />}
              onClick={() => setFormStep(0)}
            >
              {t('COMMON.BACK')}
            </Button>
          ) : (
            <Typography variant="h1" component="div"></Typography>
          )}
          <Typography variant="h1" component="div">
            {t('Map User as Lead')}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => setMapModalOpen(false)}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 3, overflowY: 'auto' }}>
          {formStep === 0 && (
            <Box sx={{ mb: 3 }}>
              <EmailSearchUser
                onUserSelected={(userId) => {
                  setSelectedUserId(userId || null);
                  console.log('Selected User ID:', userId);
                }}
                onUserDetails={(userDetails) => {
                  console.log('############# userDetails', userDetails);
                  setUserDetails(userDetails);
                  setFormStep(1);
                }}
                schema={addSchema}
                uiSchema={addUiSchema}
                prefilledState={prefilledState}
                onPrefilledStateChange={(prefilledState) => {
                  setPrefilledState(prefilledState || {});
                }}
                roleId={roleId}
                tenantId={tenantId}
                type="leader"
              />
            </Box>
          )}
          {formStep === 1 && (
            <Box sx={{ mb: 3 }}>
              <CenterListWidget
                value={selectedCenterId}
                onChange={(centerId) => {
                  setSelectedCenterId(centerId);
                  console.log('Selected Center ID:', centerId);
                }}
                label="Select Center"
                required={true}
                multiple={false}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          {formStep === 0 && (
            <Button
              sx={{
                backgroundColor: '#FFC107',
                color: '#000',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: '14px',
                height: '40px',
                lineHeight: '20px',
                letterSpacing: '0.1px',
                textAlign: 'center',
                verticalAlign: 'middle',
                '&:hover': {
                  backgroundColor: '#ffb300',
                },
                width: '100%',
              }}
              disabled={!selectedUserId || isMappingInProgress}
              form="dynamic-form-id"
              type="submit"
            >
              {t('COMMON.NEXT')}
            </Button>
          )}
          {formStep === 1 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={async () => {
                if (selectedUserId && selectedCenterId) {
                  setIsMappingInProgress(true);
                  try {
                    const { userData, customFields } =
                      splitUserData(userDetails);

                    delete userData.email;

                    const object = {
                      userData: userData,
                      customFields: customFields,
                    };

                    //update user details
                    const updateUserResponse = await enrollUserTenant({
                      userId: selectedUserId,
                      tenantId: tenantId,
                      roleId: roleId,
                      customFields: customFields,
                      userData: userData,
                    });
                    console.log('######### updatedResponse', updateUserResponse);

                    if (
                      updateUserResponse &&
                      updateUserResponse?.params?.err === null
                    ) {
                      // getNotification(editableUserId, profileUpdateNotificationKey);
                      showToastMessage(
                        t(successUpdateMessage),
                        'success'
                      );
                      // telemetryCallbacks(telemetryUpdateKey);

                      //map user to tenant
                      // Ensure selectedCenterId is a string (handle array case)
                      const cohortId = Array.isArray(selectedCenterId)
                        ? selectedCenterId[0]
                        : selectedCenterId;

                      console.log('Creating with User ID:', selectedUserId);
                      console.log(
                        'Creating with Center ID (cohortId):',
                        cohortId
                      );

                      // Call the cohortmember/create API
                      const response = await bulkCreateCohortMembers({
                        userId: [selectedUserId],
                        cohortId: [cohortId],
                        // removeCohortId: [],
                      });

                      if (
                        response?.responseCode === 201 ||
                        response?.data?.responseCode === 201 ||
                        response?.status === 201
                      ) {
                        showToastMessage(
                          t(successCreateMessage),
                          'success'
                        );
                        // Close dialog
                        setMapModalOpen(false);
                        setSelectedCenterId(null);
                        setSelectedUserId(null);
                        // Refresh the data
                        searchData(prefilledFormData, 0);
                      } else {
                        showToastMessage(
                          response?.data?.params?.errmsg ||
                            t(failureCreateMessage),
                          'error'
                        );
                      }
                    } else {
                      // console.error('Error update user:', error);
                      showToastMessage(
                        t(failureUpdateMessage),
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
                    setIsMappingInProgress(false);
                  }
                } else if (!selectedUserId) {
                  showToastMessage('Please search and select a user', 'error');
                } else {
                  showToastMessage('Please select a center', 'error');
                }
              }}
              disabled={
                !selectedUserId || !selectedCenterId || isMappingInProgress
              }
            >
              {t('COMMON.MAP')}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default UserLeader;
