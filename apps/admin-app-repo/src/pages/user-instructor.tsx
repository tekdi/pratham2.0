// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import {
  enhanceUiSchemaWithGrid,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  facilitatorSearchSchema,
  facilitatorSearchUISchema,
} from '../constant/Forms/facilitatorSearch';
import { Role, RoleId, Status } from '@/utils/app.constant';
import {
  getUserDetailsInfo,
  HierarchicalSearchUserList,
} from '@/services/UserList';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { debounce, forEach } from 'lodash';
import { Numbers } from '@mui/icons-material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  bulkCreateCohortMembers,
  updateCohortMemberStatus,
} from '@/services/CohortService/cohortService';
import editIcon from '../../public/images/editIcon.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import restoreIcon from '../../public/images/restore_user.svg';
import CloseIcon from '@mui/icons-material/Close';
import BatchListWidget from '@shared-lib-v2/MapUser/BatchListWidget';
import MultipleBatchListWidget from '@shared-lib-v2/MapUser/MultipleBatchListWidget';
import EmailSearchUser from '@shared-lib-v2/MapUser/EmailSearchUser';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
  transformLabel,
  fetchUserData,
  calculateAgeFromDate,
} from '@/utils/Helper';
import { getCohortList } from '@/services/GetCohortList';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import apartment from '../../public/images/apartment.svg';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import FacilitatorForm from '@/components/DynamicForm/FacilitatorForm/FacilitatorForm';
import CenterLabel from '@/components/Centerlabel';
import ResetFiltersButton from '@/components/ResetFiltersButton/ResetFiltersButton';
import { showToastMessage } from '@/components/Toastify';
import { enrollUserTenant } from '@shared-lib-v2/MapUser/MapService';

const Facilitator = () => {
  const theme = useTheme<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(facilitatorSearchSchema);
  const [uiSchema, setUiSchema] = useState(facilitatorSearchUISchema);
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
  const [editableUserId, setEditableUserId] = useState('');
  const [roleId, setRoleID] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [memberShipID, setMemberShipID] = useState('');
  const [blockFieldId, setBlockFieldId] = useState('');
  const [districtFieldId, setDistrictFieldId] = useState('');
  const [villageFieldId, setVillageFieldId] = useState('');
  const [archiveToActiveOpen, setArchiveToActiveOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [village, setVillage] = useState('');
  const [reason, setReason] = useState('');

  // const [centerFieldId, setCenterFieldId] = useState('');

  const [userID, setUserId] = useState('');
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    village: '',
  });

  const { t, i18n } = useTranslation();
  const formRef = useRef(null);

  const [formStep, setFormStep] = useState(0);

  const initialFormData = localStorage.getItem('stateId')
    ? { state: [localStorage.getItem('stateId')], designation: 'facilitator' }
    : { designation: 'facilitator' };

  const searchStoreKey = 'facilitator';
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
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.facilitator.context}&contextType=${FormContext.facilitator.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.facilitator.context}&contextType=${FormContext.facilitator.contextType}`,
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

      //designation is not editable
      if (alterUISchema?.designation) {
        alterUISchema = {
          ...alterUISchema,
          designation: {
            ...alterUISchema.designation,
            'ui:disabled': true,
          },
        };
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
    setRoleID(RoleId.TEACHER);
    setTenantId(localStorage.getItem('tenantId'));
  }, []);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const SubmitaFunction = async (formData: any) => {
    // console.log("###### debug issue formData", formData)
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
      role: [Role.TEACHER],
      customfields: [
        'state',
        'district',
        'block',
        'village',
        'main_subject',
        'subject_taught',
      ],
    });
  };
  const searchData = async (formData, newPage) => {
    if (formData) {
      formData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => !Array.isArray(value) || value.length > 0
        )
      );

      const staticFilter = {
        role: 'Instructor',
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
      label: 'Facilitator Name',
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
      keys: ['mobile'],
      label: 'Mobile',
      render: (row) => transformLabel(row.mobile) || '',
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
      key: 'village',
      label: 'Village',
      render: (row) => transformLabel(row?.customfield?.village) || '-',
    },
    {
      key: 'center',
      label: 'Center',
      render: (row) => {
        // let centerArray = row?.customfield?.find(
        //   (field) => field.label === 'CENTER'
        // )?.selectedValues
        // return (
        //   <>
        //     {centerArray && (
        //       <>
        //         {centerArray.map((centerId) => (
        //           <>
        //             <CenterLabel parentId={centerId} />,{' '}
        //           </>
        //         ))}
        //       </>
        //     )}
        //   </>
        // );
        const centers =
          row.cohortData
            ?.filter(
              (c: any) =>
                c.centerStatus === 'active' &&
                c.cohortMember?.status === 'active'
            )
            .map((c: any) => transformLabel(c.centerName))
            .filter(Boolean) || [];

        return centers.join(', ');
      },
    },
    {
      key: 'batch',
      label: 'Batch',
      render: (row) => {
        // console.log('BacthRow', row?.cohortData)
        const batches =
          row.cohortData
            ?.filter(
              (c: any) =>
                c.batchStatus === 'active' &&
                c.cohortMember?.status === 'active'
            )
            .map((c: any) => transformLabel(c.batchName))
            .filter(Boolean) || [];

        return batches.join(', ');
      },
    },
    {
      key: 'mysubject',
      label: 'Main Subjects',
      render: (row) => transformLabel(row?.customfield?.main_subject) || '-',
    },
    {
      key: 'subjectteach',
      label: 'Subjects Teach',
      render: (row) => transformLabel(row?.customfield?.subject_taught) || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row: any) => transformLabel(row.status),
      getStyle: (row) => ({ color: row.status === 'active' ? 'green' : 'red' }),
    },
  ];

  const userDelete = async () => {
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
              memberStatus: 'archived',
              statusReason: reason,
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
        userData: { reason: reason, status: 'archived' },
      });

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
  console.log(
    'response?.result?.getUserDetails',
    response?.result?.getUserDetails
  );
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
    //       title="Edit Facilitator"
    //     >
    //       <Image src={editIcon} alt="" />
    //     </Box>
    //   ),
    //   callback: async (row) => {
    //     console.log('row:', row);
    //     //extract id from row and make api call for user/read
    //     // console.log('AddSchema', addSchema);
    //     // console.log('AddUISchema', addUiSchema);
    //     const selectedUserId = row?.userId;
    //     const selectedUserDetails = await getUserDetailsInfo(
    //       selectedUserId,
    //       true
    //     );
    //     // console.log('selectedUserDetails:', selectedUserDetails);
    //     const updatedUserDetails = {
    //       ...selectedUserDetails,
    //       userData: {
    //         ...selectedUserDetails.userData,
    //         mobile: String(selectedUserDetails.userData.mobile),
    //       },
    //     };
    //     let tempFormData = extractMatchingKeys(updatedUserDetails?.userData, addSchema);
    //     // console.log('tempFormData', tempFormData);
    //     setPrefilledAddFormData(tempFormData);
    //     setIsEdit(true);
    //     setIsReassign(false);
    //     setButtonShow(true);
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
    //       title="Delete Facilitator"
    //     >
    //       {' '}
    //       <Image src={deleteIcon} alt="" />{' '}
    //     </Box>
    //   ),
    //   callback: async (row) => {
    //     console.log('row.cohortData:', row.cohortData); // Check what data is available
    //     const selectedUserId = row?.userId;
    //     const selectedUserDetails = await getUserDetailsInfo(selectedUserId, true);
    //     const cohortResponse = await getCohortList(selectedUserId);
    //     console.log('cohortResponse:', cohortResponse);
    //     const centerNames = [...new Set(row.cohortData.map(item => item.centerName))];
    //     const findVillage = selectedUserDetails?.userData?.customFields.find((item) => {
    //       if (item.label === 'VILLAGE' || item.label === 'BLOCK') {
    //         return item;
    //       }
    //     });
    //     // Option 1: Get village from cohortData if available
    //     const villagesFromCohort = row.cohortData
    //       ?.filter((c: any) => c.cohortMember?.status === 'active')
    //       .map((c: any) => c.villageName || c.village) // adjust property name as per your data
    //       .filter(Boolean);
    //     setUserData({
    //       firstName: row?.firstName || '',
    //       lastName: row?.lastName || '',
    //       village: centerNames.length!==0 ?centerNames :"-"  ,
    //     });
    //     setOpen(true);
    //     setUserId(row?.userId);
    //     setReason('');
    //     setChecked(false);
    //     // setEditableUserId(row?.userId);
    //     // const memberStatus = Status.ARCHIVED;
    //     // const statusReason = '';
    //     // const membershipId = row?.userId;
    //     // const response = await updateCohortMemberStatus({
    //     //   memberStatus,
    //     //   statusReason,
    //     //   membershipId,
    //     // });
    //     // setPrefilledFormData({});
    //     // searchData(prefilledFormData, currentPage);
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
    //       title="Reassign Facilitator"
    //     >
    //       <Image src={apartment} alt="" />
    //     </Box>
    //   ),
    //   callback: async (row) => {
    //     console.log('row:', row);
    //     // console.log('AddSchema', addSchema);
    //     // console.log('AddUISchema', addUiSchema);
    //     let batchList = await fetchUserData(row?.userId);
    //     console.log('######## batchList', batchList);
    //     const selectedUserId = row?.userId;
    //     const selectedUserDetails = await getUserDetailsInfo(
    //       selectedUserId,
    //       true
    //     );
    //     // console.log('selectedUserDetails:', selectedUserDetails);
    //     let tempFormData = extractMatchingKeys(selectedUserDetails?.userData, addSchema);
    //     tempFormData = {
    //       ...tempFormData,
    //       batch: batchList,
    //     };
    //     console.log(tempFormData, ' tempFormData');
    //     setPrefilledAddFormData(tempFormData);
    //     setIsEdit(false);
    //     setIsReassign(true);
    //     setButtonShow(true);
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
    //       title="Reactivate Facilitator"
    //     >
    //       {' '}
    //       <Image src={restoreIcon} alt="" />{' '}
    //     </Box>
    //   ),
    //   callback: async (row) => {
    //     const selectedUserId = row?.userId;
    //     const selectedUserDetails = await getUserDetailsInfo(
    //       selectedUserId,
    //       true
    //     );
    //     const findVillage = selectedUserDetails?.userData?.customFields.find((item) => {
    //       if (item.label === 'VILLAGE') {
    //         return item;
    //       }
    //     });
    //     // console.log('row:', row?.customFields[2].selectedValues[0].value);
    //     setEditableUserId(row?.userId);
    //     setArchiveToActiveOpen(true);
    //     setUserId(row?.userId);
    //     setUserData({
    //       firstName: row?.firstName || '',
    //       lastName: row?.lastName || '',
    //       village: findVillage?.selectedValues?.[0]?.value || '',
    //     });
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
    username: 'scpFacilitator',
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'FACILITATORS.FACILITATOR_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'scp-facilitator-updated-successfully';
  const failureUpdateMessage = 'COMMON.NOT_ABLE_UPDATE_FACILITATOR';
  const successCreateMessage = 'FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'SCP-Facilitator-created-successfully';
  const failureCreateMessage = 'COMMON.NOT_ABLE_CREATE_FACILITATOR';
  const notificationKey = 'onFacilitatorCreated';
  const notificationMessage = 'FACILITATORS.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';
  const blockReassignmentNotificationKey = 'FACILITATOR_BLOCK_UPDATE';
  const profileUpdateNotificationKey = 'FACILITATOR_PROFILE_UPDATE';
  const centerUpdateNotificationKey = 'FACILITATOR_CENTER_UPDATE';

  // console.log(response?.result?.getUserDetails , "shreyas");
  // response;

  useEffect(() => {
    setPrefilledFormData(initialFormDataSearch);
  }, []);

  //new variables
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState<
    string | string[] | null
  >(null);
  const [selectedCenterList, setSelectedCenterList] = useState<any[]>([]);
  const [selectedBatchList, setSelectedBatchList] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMappingInProgress, setIsMappingInProgress] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  const [buttonShow, setButtonShowState] = useState(true);

  const setButtonShow = (status) => {
    console.log('########## changed', status);
    setButtonShowState(status);
  };

  // Helper function to extract all batch IDs from the nested structure
  const extractBatchIds = (nestedStructure: any): string[] => {
    return nestedStructure;

    const batchIds: string[] = [];

    if (!nestedStructure || !Array.isArray(nestedStructure)) {
      return batchIds;
    }

    nestedStructure.forEach((state) => {
      if (state?.districts && Array.isArray(state.districts)) {
        state.districts.forEach((district) => {
          if (district?.blocks && Array.isArray(district.blocks)) {
            district.blocks.forEach((block) => {
              if (block?.centers && Array.isArray(block.centers)) {
                block.centers.forEach((center) => {
                  if (center?.batches && Array.isArray(center.batches)) {
                    center.batches.forEach((batch) => {
                      if (batch?.id) {
                        batchIds.push(String(batch.id));
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });

    return batchIds;
  };

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {isLoading ? (
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        ) : (
          schema &&
          uiSchema && (
            <DynamicForm
              schema={schema}
              uiSchema={updatedUiSchema}
              SubmitaFunction={SubmitaFunction}
              isCallSubmitInHandle={true}
              prefilledFormData={prefilledFormData}
              ref={formRef}
            />
          )
        )}
        <Box mt={4} sx={{ display: 'flex', justifyContent: 'end' }}>
          <ResetFiltersButton
            searchStoreKey="facilitator"
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
            {t('COMMON.ADD_NEW')}{' '}
          </Button>
        </Box>

        {/* <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={buttonShow}
          primaryText={isEdit ? t('Update') : t('Next')}
          id="dynamic-form-id"
          modalTitle={
            isEdit
              ? t('FACILITATORS.EDIT_FACILITATOR')
              : isReassign
                ? t('FACILITATORS.RE_ASSIGN_facilitator')
                : t('FACILITATORS.NEW_FACILITATOR')
          }
        >
          <FacilitatorForm
            t={t}
            SuccessCallback={() => {
              setPrefilledFormData(initialFormDataSearch);
              searchData(initialFormDataSearch, 0);
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
            isReassign={isReassign}
            // isExtraFields={true}
            editableUserId={editableUserId}
            UpdateSuccessCallback={() => {
              setPrefilledFormData(prefilledFormData);
              searchData(prefilledFormData, currentPage);
              setOpenModal(false);
            }}
            extraFields={extraFields}
            extraFieldsUpdate={extraFieldsUpdate}
            successUpdateMessage={successUpdateMessage}
            telemetryUpdateKey={telemetryUpdateKey}
            failureUpdateMessage={failureUpdateMessage}
            successCreateMessage={successCreateMessage}
            telemetryCreateKey={telemetryCreateKey}
            failureCreateMessage={failureCreateMessage}
            notificationKey={notificationKey}
            notificationMessage={notificationMessage}
            notificationContext={notificationContext}
            // blockFieldId={blockFieldId}
            // districtFieldId={districtFieldId}
            // villageFieldId={villageFieldId}
            // // centerFieldId={centerFieldId}
            type="facilitator"
            hideSubmit={true}
            setButtonShow={setButtonShow}
            // isSteeper={true}
            blockReassignmentNotificationKey={blockReassignmentNotificationKey}
            profileUpdateNotificationKey={profileUpdateNotificationKey}
            centerUpdateNotificationKey={centerUpdateNotificationKey}
          />
        </SimpleModal> */}

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
                  {t('COMMON.NO_FACILITATOR_FOUND')}
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
          firstName={userData.firstName}
          lastName={userData.lastName}
          village={userData.village}
          checked={checked}
          setChecked={setChecked}
          reason={reason}
          setReason={setReason}
          isForFacilitator={true}
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
            {userData.firstName} {userData.lastName} {t('FORM.WAS_BELONG_TO')}
          </Typography>
          <TextField
            fullWidth
            value={userData.village}
            disabled
            sx={{ mt: 1 }}
          />
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
            setSelectedCenterList(null); // Reset center list selection when dialog closes
            setSelectedBatchList(null); // Reset batch selection when dialog closes
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
            {t('Map User as Instructor')}
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
                type="instructor"
              />
            </Box>
          )}
          {formStep === 1 && (
            <Box sx={{ mb: 3 }}>
              <MultipleBatchListWidget
                value={selectedCenterId}
                onChange={(centerId) => {
                  setSelectedCenterId(centerId);
                  console.log('Selected Center ID:', centerId);
                }}
                onCenterList={(centerList) => {
                  setSelectedCenterList(centerList || []);
                  console.log('############# centerList', centerList);
                }}
                selectedCenterList={selectedCenterList}
                onBatchList={(batchList) => {
                  setSelectedBatchList(batchList || []);
                  console.log('############# batchList', batchList);
                }}
                selectedBatchList={selectedBatchList}
                label="Select Batch"
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
                    console.log(
                      '######### updatedResponse',
                      updateUserResponse
                    );

                    if (
                      updateUserResponse &&
                      updateUserResponse?.params?.err === null
                    ) {
                      // getNotification(editableUserId, profileUpdateNotificationKey);
                      showToastMessage(t(successUpdateMessage), 'success');
                      // telemetryCallbacks(telemetryUpdateKey);

                      //map user to tenant
                      // Extract all batch IDs from the nested structure
                      const batchIds = extractBatchIds(selectedCenterId);

                      console.log('Creating with User ID:', selectedUserId);
                      console.log('Extracted Batch IDs:', batchIds);

                      if (batchIds.length === 0) {
                        showToastMessage(
                          'Please select at least one batch',
                          'error'
                        );
                        setIsMappingInProgress(false);
                        return;
                      }

                      // Call the cohortmember/create API with extracted batch IDs
                      const response = await bulkCreateCohortMembers({
                        userId: [selectedUserId],
                        cohortId: batchIds,
                        // removeCohortId: [],
                      });

                      if (
                        response?.responseCode === 201 ||
                        response?.data?.responseCode === 201 ||
                        response?.status === 201
                      ) {
                        showToastMessage(t(successCreateMessage), 'success');
                        // Close dialog
                        setMapModalOpen(false);
                        setSelectedCenterId(null);
                        setSelectedCenterList(null);
                        setSelectedBatchList(null);
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
                      showToastMessage(t(failureUpdateMessage), 'error');
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
              {t('Map as Instructor')}
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

export default Facilitator;
