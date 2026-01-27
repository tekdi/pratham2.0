// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  MobilizerSearchSchema,
  MobilizerUISchema,
} from '../constant/Forms/MobilizerSearch';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { RoleId, RoleName, Status, TenantName } from '@/utils/app.constant';
import { HierarchicalSearchUserList, userList } from '@/services/UserList';
import {
  Box,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Autocomplete,
  Chip,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import { Button } from '@mui/material';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { deleteUser } from '@shared-lib-v2/MapUser/DeleteUser';
import DeleteDetails from '@/components/DeleteDetails';
import editIcon from '../../public/images/editIcon.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import Image from 'next/image';
import {
  extractMatchingKeys,
  fetchForm,
  searchListData,
} from '@/components/DynamicForm/DynamicFormCallback';
import { FormContext } from '@/components/DynamicForm/DynamicFormConstant';
import AddEditUser from '@/components/EntityForms/AddEditUser/AddEditUser';
import TenantService from '@/services/TenantService';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import CenteredLoader from '@/components/CenteredLoader/CenteredLoader';
import { extractWorkingLocationVillages, transformLabel } from '@/utils/Helper';
import ResetFiltersButton from '@/components/ResetFiltersButton/ResetFiltersButton';
import restoreIcon from '../../public/images/restore_user.svg';
import { showToastMessage } from '@/components/Toastify';
import ConfirmationPopup from '@/components/ConfirmationPopup';
import EmailSearchUser from '@shared-lib-v2/MapUser/EmailSearchUser';
import CenterListWidget from '@shared-lib-v2/MapUser/CenterListWidget';
import {
  enhanceUiSchemaWithGrid,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { enrollUserTenant } from '@shared-lib-v2/MapUser/MapService';
import axios from 'axios';
import {
  bulkCreateCohortMembers,
  updateCohortMemberStatus,
} from '@/services/CohortService/cohortService';
import { getCohortList } from '@/services/GetCohortList';
import { updateUserTenantStatus } from '@/services/UserService';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const Mobilizer = () => {
  const [archiveToActiveOpen, setArchiveToActiveOpen] = useState(false);

  const theme = useTheme<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(MobilizerSearchSchema);
  const [uiSchema, setUiSchema] = useState(MobilizerUISchema);
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
  const [editableUserId, setEditableUserId] = useState('');
  const [state, setState] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const { t, i18n } = useTranslation();
  const formRef = useRef(null);

  const [tenantId, setTenantId] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [userID, setUserId] = useState('');
  const [village, setVillage] = useState('');
  const [reason, setReason] = useState('');
  const [selectedCenters, setSelectedCenters] = useState<any[]>([]);
  const [availableCenters, setAvailableCenters] = useState<any[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [workingVillageId, setWorkingVillageId] = useState('');
  const [workingLocationId, setWorkingLocationId] = useState('');
  // const [workingVillageValues, setWorkingVillageValues] = useState([]);

  const searchStoreKey = 'mobilizer';
  const initialFormDataSearch =
    localStorage.getItem(searchStoreKey) &&
    localStorage.getItem(searchStoreKey) != '{}'
      ? JSON.parse(localStorage.getItem(searchStoreKey))
      : localStorage.getItem('stateId')
      ? { state: [localStorage.getItem('stateId')] }
      : {};

  const storedUserData = JSON.parse(localStorage.getItem('adminInfo') || '{}');

  console.log(
    '########### type mobilizer process.env.NEXT_PUBLIC_TEACHER_SBPLAYER',
    process.env.NEXT_PUBLIC_TEACHER_SBPLAYER
  );
  console.log(
    '########### type mobilizer process.env.NEXT_PUBLIC_ADMIN_SBPLAYER',
    process.env.NEXT_PUBLIC_ADMIN_SBPLAYER
  );
  let cleanedUrl = process.env.NEXT_PUBLIC_ADMIN_SBPLAYER?.replace(
    /\/sbplayer$/,
    ''
  );

  const [roleId, setRoleID] = useState('');
  console.log('########### type cleanedUrl', cleanedUrl);

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
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mobilizer.context}&contextType=${FormContext.mobilizer.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mobilizer.context}&contextType=${FormContext.mobilizer.contextType}`,
          header: {
            tenantid: TenantService.getTenantId(),
          },
        },
      ]);
      // console.log('responseForm', responseForm);
      let alterSchema = responseForm?.schema;
      let alterUISchema = responseForm?.uiSchema;
      console.log('alterSchema@@@', alterSchema);
      if (alterSchema) {
        setWorkingVillageId(alterSchema?.properties?.working_village?.fieldId);
        setWorkingLocationId(
          alterSchema?.properties?.working_location?.fieldId
        );
      }
      const keysToRemove = ['working_village'];
      keysToRemove.forEach((key) => delete alterSchema.properties[key]);
      keysToRemove.forEach((key) => delete alterUISchema[key]);
      //also remove from required if present
      alterSchema.required =
        alterSchema.required?.filter((key) => !keysToRemove.includes(key)) ||
        [];
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
      setTenantId(localStorage.getItem('tenantId'));
    };

    setPrefilledAddFormData(initialFormDataSearch);
    fetchData();

    setRoleID(RoleId.MOBILIZER);
    setTenantId(localStorage.getItem('tenantId'));
  }, []);

  const extractVillageIdsFromWorkingLocation = (
    workingLocation: any
  ): string[] | null => {
    if (!workingLocation || !Array.isArray(workingLocation)) {
      return null;
    }

    const villageIds: string[] = [];

    // Iterate through all states -> districts -> blocks -> villages
    for (const state of workingLocation) {
      if (state.districts && Array.isArray(state.districts)) {
        for (const district of state.districts) {
          if (district.blocks && Array.isArray(district.blocks)) {
            for (const block of district.blocks) {
              if (block.villages && Array.isArray(block.villages)) {
                for (const village of block.villages) {
                  if (village.id) {
                    villageIds.push(String(village.id));
                  }
                }
              }
            }
          }
        }
      }
    }

    // Return null if no villages found, otherwise return array of IDs
    return villageIds.length > 0 ? villageIds : null;
  };

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const SubmitaFunction = async (formData: any) => {
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
      role: [RoleName.MOBILIZER],
      customfields: ['state', 'district', 'block', 'village', 'working_location', 'working_village'],
    });
  };

  //new variables
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState<
    string | string[] | null
  >(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMappingInProgress, setIsMappingInProgress] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [cohortResponse, setCohortResponse] = useState<any>(null); // Store full cohort/search API response
  const [catchmentAreaData, setCatchmentAreaData] = useState<any>(null); // Store extracted CATCHMENT_AREA data
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null); // Track selected state
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(
    null
  ); // Track selected district
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null); // Track selected block

  // Function to check if villages are selected in working_location
  // Returns { isValid: boolean, missingBlocks: Array<{state, district, block}>, isWorkingLocationMissing?: boolean }
  const validateVillagesSelected = (
    userDetails: any
  ): {
    isValid: boolean;
    missingBlocks: Array<{
      stateName: string;
      districtName: string;
      blockName: string;
    }>;
    isWorkingLocationMissing?: boolean;
  } => {
    const missingBlocks: Array<{
      stateName: string;
      districtName: string;
      blockName: string;
    }> = [];

    // Extract working_location from userDetails
    // It can be at top level or inside customFields array
    let workingLocation = userDetails?.working_location;

    // If not at top level, try to find it in customFields
    // working_location has a specific structure: array of objects with stateId, stateName, districts
    if (
      !workingLocation &&
      userDetails?.customFields &&
      Array.isArray(userDetails.customFields)
    ) {
      const workingLocationField = userDetails.customFields.find(
        (field: any) => {
          // Check if the value matches working_location structure
          if (
            field.value &&
            Array.isArray(field.value) &&
            field.value.length > 0
          ) {
            const firstItem = field.value[0];
            // working_location structure: { stateId, stateName, districts: [...] }
            return (
              firstItem &&
              typeof firstItem === 'object' &&
              'stateId' in firstItem &&
              'stateName' in firstItem &&
              'districts' in firstItem
            );
          }
          return false;
        }
      );
      if (workingLocationField?.value) {
        workingLocation = workingLocationField.value;
      }
    }

    if (!workingLocation) {
      console.log(
        'validateVillagesSelected: No working_location found in userDetails or customFields',
        userDetails
      );
      // Return with a flag to indicate working_location is missing entirely
      return {
        isValid: false,
        missingBlocks: [],
        isWorkingLocationMissing: true,
      };
    }
    if (!Array.isArray(workingLocation) || workingLocation.length === 0) {
      console.log(
        'validateVillagesSelected: working_location is not a valid array'
      );
      return {
        isValid: false,
        missingBlocks: [],
        isWorkingLocationMissing: true,
      };
    }

    console.log(
      'validateVillagesSelected: workingLocation',
      JSON.stringify(workingLocation, null, 2)
    );

    let totalBlocks = 0;
    let blocksWithVillages = 0;

    // Check EVERY block - each block must have at least one village selected
    for (const state of workingLocation) {
      if (state.districts && Array.isArray(state.districts)) {
        for (const district of state.districts) {
          if (district.blocks && Array.isArray(district.blocks)) {
            for (const block of district.blocks) {
              totalBlocks++;

              // Check if this block has villages selected
              // Villages can be an array of objects with {id, name} or just empty array
              const hasVillages =
                block.villages &&
                Array.isArray(block.villages) &&
                block.villages.length > 0;

              console.log(
                `Block ${
                  block.name || block.id
                }: hasVillages=${hasVillages}, villages count=${
                  block.villages?.length || 0
                }, villages=`,
                block.villages
              );

              if (hasVillages) {
                blocksWithVillages++;
              } else {
                // This block is missing villages
                missingBlocks.push({
                  stateName: state.stateName || t('MOBILIZER.UNKNOWN_STATE'),
                  districtName:
                    district.districtName || t('MOBILIZER.UNKNOWN_DISTRICT'),
                  blockName: block.name || t('MOBILIZER.UNKNOWN_BLOCK'),
                });
              }
            }
          }
        }
      }
    }

    console.log(
      `validateVillagesSelected: totalBlocks=${totalBlocks}, blocksWithVillages=${blocksWithVillages}, missingBlocks=${missingBlocks.length}`
    );

    console.log('validateVillagesSelected: missingBlocks', missingBlocks);

    return {
      isValid: missingBlocks.length === 0,
      missingBlocks,
    };
  };

  const searchData = async (formData: any, newPage: any) => {
    if (formData) {
      formData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => !Array.isArray(value) || value.length > 0
        )
      );
      const staticFilter = {
        role: RoleName.MOBILIZER,
        tenantId: storedUserData.tenantData[0].tenantId,
      };
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
  let columns = [
    {
      keys: ['firstName', 'middleName', 'lastName'],
      label: t('MOBILIZER.MOBILIZER_NAME'),
      render: (row: any) =>
        `${transformLabel(row.firstName) || ''} ${
          transformLabel(row.middleName) || ''
        } ${transformLabel(row.lastName) || ''}`.trim(),
    },
    {
      keys: ['gender'],
      label: t('TABLE_TITLE.GENDER') || 'Gender',
      render: (row) => transformLabel(row.gender) || '',
    },
    {
      keys: ['mobile'],
      label: t('TABLE_TITLE.MOBILE') || 'Mobile',
      render: (row) => transformLabel(row.mobile) || '',
    },
    {
      keys: ['STATE', 'DISTRICT', 'BLOCK', 'VILLAGE'],
      label: t('TABLE_TITLE.LOCATION'),
      render: (row: any) => {
        const state = transformLabel(row?.customfield?.state) || '';
        const district = transformLabel(row?.customfield?.district) || '';
        const block = transformLabel(row?.customfield?.block) || '';
        const village = transformLabel(row?.customfield?.village) || '';
        return `${state == '' ? '' : `${state}`}${
          district == '' ? '' : `, ${district}`
        }${block == '' ? '' : `, ${block}`}${
          village == '' ? '' : `, ${village}`
        }`;
      },
    },
    {
      keys: ['working_village'],
      label: t('TABLE_TITLE.WORKING_VILLAGE') || 'Working Village',
      render: (row) => extractWorkingLocationVillages(row) || '',
    },
    {
      key: 'status',
      label: t('TABLE_TITLE.STATUS'),
      render: (row: any) => transformLabel(row.status),
      getStyle: (row: any) => ({
        color: row.status === 'active' ? 'green' : 'red',
      }),
    },
  ];

  const archiveToactive = async () => {
    try {
      // Validate that at least one center is selected
      if (!selectedCenters || selectedCenters.length === 0) {
        showToastMessage('Please select at least one center', 'error');
        return;
      }

      // Update cohort member status for each selected center
      const membershipIds = selectedCenters.map((center) => center.cohortMembershipId);
      
      for (const membershipId of membershipIds) {
        try {
          const updateResponse = await updateCohortMemberStatus({
            memberStatus: 'active',
            membershipId,
          });

          if (updateResponse?.responseCode !== 200) {
            console.error(
              `Failed to activate user with membershipId ${membershipId}:`,
              updateResponse
            );
            showToastMessage(
              `Failed to activate center membership ${membershipId}`,
              'error'
            );
            return;
          } else {
            console.log(
              `User with membershipId ${membershipId} successfully activated.`
            );
          }
        } catch (error) {
          console.error(
            `Error activating user with membershipId ${membershipId}:`,
            error
          );
          showToastMessage(
            `Error activating center membership ${membershipId}`,
            'error'
          );
          return;
        }
      }

      // After successful center activation, update user status
      const resp = await updateUserTenantStatus(userID, tenantId, {
        status: 'active',
      });
      
      if (resp?.responseCode === 200) {
        showToastMessage(t('MOBILIZER.ACTIVATE_USER_SUCCESS'), 'success');
        // Reset state
        setSelectedCenters([]);
        setAvailableCenters([]);
        setArchiveToActiveOpen(false);
        // Refresh the list
        searchData(prefilledFormData, currentPage);
        console.log('Mobilizer successfully activated.');
      } else {
        console.error('Failed to activate mobilizer:', resp);
        showToastMessage('Failed to activate mobilizer', 'error');
      }

      return resp;
    } catch (error) {
      console.error('Error activating mobilizer:', error);
      showToastMessage('Error activating mobilizer', 'error');
    }
  };
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
    //       title="Edit State Lead"
    //     >
    //       <Image src={editIcon} alt="" />
    //     </Box>
    //   ),
    //   callback: (row: any) => {
    //     console.log('row:', row);
    //     console.log('AddSchema', addSchema);
    //     console.log('AddUISchema', addUiSchema);
    //     let tempFormData = extractMatchingKeys(row, addSchema);
    //     console.log('tempFormData', tempFormData);
    //     setPrefilledAddFormData(tempFormData);
    //     setIsEdit(true);
    //     setEditableUserId(row?.userId);
    //     handleOpenModal();
    //   },
    //   show: (row) => row.status !== 'archived',
    // },
    {
      icon: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            // backgroundColor: 'rgb(227, 234, 240)',
            justifyContent: 'center',
            padding: '10px',
          }}
          title="Delete State Lead"
        >
          {' '}
          <Image src={deleteIcon} alt="" />
        </Box>
      ),
      callback: async (row: any) => {
        console.log('row>>>>>', row);
        // Extract centerName from cohortData where cohortMember.status === 'active'
        const centerNames = row?.cohortData
          ?.filter((item: any) => item?.cohortMember?.status === 'active')
          ?.map((item: any) => item?.centerName)
          ?.filter(Boolean) || [];
        const centerNamesString = centerNames.length > 0 ? centerNames.join(', ') : '';
        setAvailableCenters(centerNamesString);
        setVillage(centerNamesString || row?.customfield?.block || row?.customfield?.village || '');
        setUserId(row?.userId);
        setOpen(true);
        setFirstName(row?.firstName);
        setLastName(row?.lastName);
        setReason('');
        setChecked(false);
      },
      show: (row) => row.status !== 'archived',
    },
    {
      icon: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            // backgroundColor: 'rgb(227, 234, 240)',
            justifyContent: 'center',
            padding: '10px',
          }}
          title="Reactivate Mobilizer"
        >
          {' '}
          <Image src={restoreIcon} alt="" />{' '}
        </Box>
      ),
      callback: async (row: any) => {
        const selectedUserId = row?.userId;
        setEditableUserId(row?.userId);
        setUserId(row?.userId);
        setFirstName(row?.firstName);
        setLastName(row?.lastName);
        setSelectedCenters([]);
        setAvailableCenters([]);
        setLoadingCenters(true);
        setArchiveToActiveOpen(true);
        
        try {
          // Fetch cohort list for the user
          const cohortResponse = await getCohortList(selectedUserId);
          const cohortList = cohortResponse?.result || [];
          
          // Filter centers where cohortMemberStatus = "archived", cohortStatus = "active", and type = "CENTER" or "COHORT"
          const filteredCenters = cohortList.filter((cohort: any) => 
            cohort.cohortMemberStatus === 'archived' &&
            cohort.cohortStatus === 'active' &&
            (cohort.type === 'CENTER' || cohort.type === 'COHORT')
          );
          
          setAvailableCenters(filteredCenters);
        } catch (error) {
          console.error('Error fetching cohort list:', error);
          showToastMessage('Failed to load centers', 'error');
        } finally {
          setLoadingCenters(false);
        }
      },
      show: (row) => row.status !== 'active',
    }
  ];

  // Pagination handlers
  const handlePageChange = (newPage: any) => {
    console.log('Page changed to:', newPage);
    searchData(prefilledFormData, newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: any) => {
    console.log('Rows per page changed to:', newRowsPerPage);
    setPageLimit(newRowsPerPage);
  };

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [formStep, setFormStep] = useState(0);

  // Function to fetch cohort list when block is selected
  const fetchCohortListByBlock = async (blockId: string) => {
    if (!blockId) {
      setCohortResponse(null);
      setCatchmentAreaData(null);
      return;
    }

    try {
      const tenantId = localStorage.getItem('tenantId') || '';
      const token = localStorage.getItem('token') || '';
      const academicYearId = localStorage.getItem('academicYearId') || '';

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
        {
          limit: 200,
          offset: 0,
          filters: {
            type: 'COHORT',
            block: [blockId],
            status: ['active'],
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            tenantId: tenantId,
            Authorization: `Bearer ${token}`,
            academicyearid: academicYearId,
          },
        }
      );

      // Store the full response
      setCohortResponse(response?.data);
      console.log('############# cohortResponse stored', response?.data);
    } catch (error) {
      console.error('Error fetching cohort list:', error);
      setCohortResponse(null);
      setCatchmentAreaData(null);
    }
  };

  // Function to extract CATCHMENT_AREA from selected center
  const extractCatchmentAreaFromCenter = (centerId: string) => {
    if (!cohortResponse || !centerId) {
      setCatchmentAreaData(null);
      return;
    }

    try {
      const cohortDetails =
        cohortResponse?.result?.results?.cohortDetails || [];
      const selectedCenter = cohortDetails.find(
        (cohort: any) => cohort.cohortId === centerId
      );

      if (selectedCenter) {
        const customFields = selectedCenter.customFields || [];
        const catchmentAreaField = customFields.find(
          (field: any) => field.label === 'CATCHMENT_AREA'
        );

        if (
          catchmentAreaField?.selectedValues &&
          Array.isArray(catchmentAreaField.selectedValues) &&
          catchmentAreaField.selectedValues.length > 0
        ) {
          const extractedCatchmentArea = catchmentAreaField.selectedValues;
          setCatchmentAreaData(extractedCatchmentArea);
          console.log(
            '############# extractedCatchmentArea',
            extractedCatchmentArea
          );
        } else {
          setCatchmentAreaData(null);
          console.log('No CATCHMENT_AREA found in selected center');
        }
      } else {
        setCatchmentAreaData(null);
        console.log('Selected center not found in cohort response');
      }
    } catch (error) {
      console.error('Error extracting catchment area:', error);
      setCatchmentAreaData(null);
    }
  };

  //Add Edit Props
  const extraFieldsUpdate = {};
  const extraFields = {
    tenantCohortRoleMapping: [
      {
        tenantId: TenantService.getTenantId(),
        roleId: RoleId.MOBILIZER,
      },
    ],
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'MOBILIZER.MOBILIZER_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'mobilizer-updated-successfully';
  const failureUpdateMessage = 'MOBILIZER.NOT_ABLE_UPDATE_MOBILIZER';
  const successCreateMessage = 'MOBILIZER.MOBILIZER_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'mobilizer-created-successfully';
  const failureCreateMessage = 'MOBILIZER.NOT_ABLE_CREATE_MOBILIZER';
  const notificationKey = 'onMobilizerCreate';
  const notificationMessage = 'MOBILIZER.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';
  useEffect(() => {
    setPrefilledFormData(initialFormDataSearch);
  }, []);
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
              prefilledFormData={prefilledFormData || {}}
            />
          )
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} mt={4}>
          <ResetFiltersButton
            searchStoreKey="mobilizer"
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
              setSelectedCenterId(null);
              setCohortResponse(null);
              setCatchmentAreaData(null);
              setSelectedStateId(null);
              setSelectedDistrictId(null);
              setSelectedBlockId(null);
              setMapModalOpen(true);
            }}
          >
            {t('COMMON.ADD_NEW')}
          </Button>
        </Box>

        {/* <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={true}
          primaryText={isEdit ? t('Update') : t('Create')}
          id="dynamic-form-id"
          modalTitle={
            isEdit
              ? t('STATE_LEADS.UPDATE_STATE_LEAD')
              : t('STATE_LEADS.NEW_STATE_LEAD')
          }
        >
          <AddEditUser
            SuccessCallback={() => {
              setPrefilledFormData(initialFormDataSearch);
              searchData(initialFormDataSearch, 0);
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
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
            hideSubmit={true}
            type={'state-lead'}
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
                  {t('COMMON.NO_MOBILIZER_FOUND')}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <CenteredLoader />
        )}

        <ConfirmationPopup
          checked={checked}
          open={open}
          onClose={() => setOpen(false)}
          title={t('COMMON.DELETE_USER')}
          primary={t('COMMON.DELETE_USER_WITH_REASON')}
          secondary={t('COMMON.CANCEL')}
          reason={reason}
          onClickPrimary={async () => {
            try {
              const resp = await deleteUser({
                userId: userID,
                roleId: roleId,
                tenantId: tenantId,
                reason: reason,
              });

              if (resp?.responseCode === 200) {
                searchData(prefilledFormData, currentPage);
                console.log('Mobilizer successfully archived.');
                setOpen(false);
              } else {
                console.error('Failed to archive mobilizer:', resp);
              }
            } catch (error) {
              console.error('Error deleting mobilizer:', error);
            }
          }}
        >
          <DeleteDetails
            firstName={firstName}
            lastName={lastName}
            village={village}
            checked={checked}
            setChecked={setChecked}
            reason={reason}
            setReason={setReason}
            center={availableCenters}
          />
        </ConfirmationPopup>
        <ConfirmationPopup
          checked={true}
          open={archiveToActiveOpen}
          onClose={() => {
            setArchiveToActiveOpen(false);
            setSelectedCenters([]);
            setAvailableCenters([]);
          }}
          title={t('COMMON.ACTIVATE_USER')}
          primary={t('COMMON.ACTIVATE')}
          secondary={t('COMMON.CANCEL')}
          reason={selectedCenters.length > 0 ? 'yes' : ''}
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
            {loadingCenters ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Autocomplete
                multiple
                options={availableCenters}
                value={selectedCenters}
                onChange={(event, newValue) => {
                  setSelectedCenters(newValue);
                }}
                getOptionLabel={(option) => option.cohortName || ''}
                isOptionEqualToValue={(option, value) =>
                  option.cohortMembershipId === value.cohortMembershipId
                }
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.cohortName}
                      {...getTagProps({ index })}
                      key={option.cohortMembershipId}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Centers"
                    placeholder="Select centers to activate"
                    sx={{ mt: 1 }}
                  />
                )}
                renderOption={(props, option, { selected }) => (
                  <li {...props} key={option.cohortMembershipId}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.cohortName}
                  </li>
                )}
                disableCloseOnSelect
                disabled={loadingCenters || availableCenters.length === 0}
              />
            )}
            {!loadingCenters && availableCenters.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                No archived centers found for this user
              </Typography>
            )}
          </Box>
          <Typography fontWeight="bold">
            {t('FORM.CONFIRM_TO_ACTIVATE')}
          </Typography>
        </ConfirmationPopup>
      </Box>

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
            setCohortResponse(null);
            setCatchmentAreaData(null);
            setSelectedStateId(null);
            setSelectedDistrictId(null);
            setSelectedBlockId(null);
            setFormStep(0);
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
              onClick={() => {
                setFormStep(0);
                setSelectedUserId(null);
                setUserDetails(null);
                // Keep center selection, state, district, block, and catchment area data when going back
              }}
            >
              {t('COMMON.BACK')}
            </Button>
          ) : (
            <Typography variant="h1" component="div"></Typography>
          )}
          <Typography variant="h1" component="div">
            {t('MOBILIZER.MAP_USER_AS_MOBILIZER')}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              setMapModalOpen(false);
              setFormStep(0);
              setSelectedCenterId(null);
              setSelectedUserId(null);
              setUserDetails(null);
              setCohortResponse(null);
              setCatchmentAreaData(null);
              setSelectedStateId(null);
              setSelectedDistrictId(null);
              setSelectedBlockId(null);
            }}
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
              <CenterListWidget
                value={selectedCenterId}
                onChange={(centerId) => {
                  const centerIdStr = Array.isArray(centerId)
                    ? centerId[0]
                    : centerId;
                  setSelectedCenterId(centerIdStr);
                  console.log('Selected Center ID:', centerIdStr);

                  // Extract CATCHMENT_AREA when center is selected
                  // Note: CenterListWidget will handle fetching center details and
                  // calling onStateChange, onDistrictChange, onBlockChange callbacks
                  if (centerIdStr) {
                    extractCatchmentAreaFromCenter(centerIdStr);
                  } else {
                    setCatchmentAreaData(null);
                  }
                }}
                label="Select Center"
                required={true}
                multiple={false}
                initialState={selectedStateId || undefined}
                initialDistrict={selectedDistrictId || undefined}
                initialBlock={selectedBlockId || undefined}
                onStateChange={(stateId) => {
                  console.log('State changed to:', stateId);
                  setSelectedStateId(stateId);
                  // Clear dependent selections when state changes
                  if (!stateId) {
                    setSelectedDistrictId(null);
                    setSelectedBlockId(null);
                    setSelectedCenterId(null);
                    setCatchmentAreaData(null);
                  }
                }}
                onDistrictChange={(districtId) => {
                  console.log('District changed to:', districtId);
                  setSelectedDistrictId(districtId);
                  // Clear dependent selections when district changes
                  if (!districtId) {
                    setSelectedBlockId(null);
                    setSelectedCenterId(null);
                    setCatchmentAreaData(null);
                  }
                }}
                onBlockChange={(blockId) => {
                  // Handle block change - fetch cohort list
                  // Note: CenterListWidget's handleBlockChange already clears center selection
                  // when user manually changes block, so we don't need to clear it here
                  console.log('Block changed to:', blockId);
                  setSelectedBlockId(blockId);

                  if (blockId) {
                    fetchCohortListByBlock(blockId);
                  } else {
                    setCohortResponse(null);
                    setCatchmentAreaData(null);
                  }
                }}
              />
            </Box>
          )}
          {formStep === 1 && (
            <Box sx={{ mb: 3 }}>
              <EmailSearchUser
                // catchmentArea={catchmentAreaData}
                onUserSelected={(userId) => {
                  setSelectedUserId(userId || null);
                  console.log('Selected User ID:', userId);
                }}
                onUserDetails={async (userDetails) => {
                  console.log('############# userDetails', userDetails);
                  setUserDetails(userDetails);
                  // window.alert('userDetails' + userDetails);
                  // window.alert('selectedUserId' + selectedUserId);
                  if (selectedUserId && userDetails) {
                    const workingLocation = userDetails?.customFields?.find(
                      (field) => field.fieldId === workingLocationId
                    );
                    const workingLocationValue = workingLocation?.value;
                    // console.log(
                    //   'workingLocationValue@@@',
                    //   workingLocationValue
                    // );
                    // console.log('workingLocationValue@@@Id', workingLocationId);
                    const villageIds =
                      extractVillageIdsFromWorkingLocation(
                        workingLocationValue
                      );
                    // setWorkingVillageValues(villageIds);
                    // console.log(
                    //   'workingLocationValue@@@villageIds@@@',
                    //   villageIds
                    // );
                    // Validate that villages are selected for EVERY block in working_location
                    const validationResult =
                      validateVillagesSelected(userDetails);
                    console.log(
                      '############# validationResult',
                      validationResult
                    );
                    if (!validationResult.isValid) {
                      const missingCount =
                        validationResult.missingBlocks.length;
                      let errorMessage = '';

                      if (missingCount > 0) {
                        // Show first few missing blocks in the error message
                        const firstFew = validationResult.missingBlocks
                          .slice(0, 3)
                          .map(
                            (block) =>
                              `${block.blockName} (${block.districtName}, ${block.stateName})`
                          )
                          .join(', ');

                        if (missingCount > 3) {
                          errorMessage = t(
                            'MOBILIZER.WORKING_LOCATION_REQUIRED_MISSING_VILLAGES',
                            {
                              blocks: firstFew,
                              count: missingCount - 3,
                            }
                          );
                        } else {
                          errorMessage = t(
                            'MOBILIZER.WORKING_LOCATION_REQUIRED_MISSING_VILLAGES_SINGLE',
                            {
                              blocks: firstFew,
                            }
                          );
                        }
                      } else if (validationResult.isWorkingLocationMissing) {
                        // working_location itself is missing or invalid
                        errorMessage = t('MOBILIZER.WORKING_LOCATION_REQUIRED');
                      } else {
                        // No missing blocks but validation failed - this shouldn't happen, but handle it
                        errorMessage = t(
                          'MOBILIZER.WORKING_LOCATION_REQUIRED_AT_LEAST_ONE'
                        );
                      }

                      showToastMessage(errorMessage, 'error');
                      return;
                    }

                    setIsMappingInProgress(true);
                    try {
                      const { userData, customFields } =
                        splitUserData(userDetails);

                      delete userData.email;

                      // Extract village IDs from working location right before using them
                      const workingLocation = userDetails?.customFields?.find(
                        (field: any) => field.fieldId === workingLocationId
                      );
                      const workingLocationValue = workingLocation?.value;
                      const villageIds =
                        extractVillageIdsFromWorkingLocation(
                          workingLocationValue
                        );

                      // Modify customFields to add/update workingVillageId with villageIds
                      const updatedCustomFields = [...customFields];
                      const workingVillageIndex = updatedCustomFields.findIndex(
                        (field: any) => field.fieldId === workingVillageId
                      );

                      if (
                        workingVillageId &&
                        villageIds &&
                        villageIds.length > 0
                      ) {
                        if (workingVillageIndex !== -1) {
                          // Update existing field
                          updatedCustomFields[workingVillageIndex].value =
                            villageIds;
                        } else {
                          // Add new field
                          updatedCustomFields.push({
                            fieldId: workingVillageId,
                            value: villageIds,
                          });
                        }
                      }

                      const object = {
                        userData: userData,
                        customField: updatedCustomFields,
                      };

                      //update user details
                      const updateUserResponse = await enrollUserTenant({
                        userId: selectedUserId,
                        tenantId: tenantId,
                        roleId: roleId,
                        customField: updatedCustomFields,
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
                        // Ensure selectedCenterId is a string (handle array case)
                        const cohortId = Array.isArray(selectedCenterId)
                          ? selectedCenterId[0]
                          : selectedCenterId;

                        // Call bulkCreateCohortMembers to map user to center
                        if (cohortId && selectedUserId) {
                          try {
                            const cohortMemberResponse =
                              await bulkCreateCohortMembers({
                                userId: [selectedUserId],
                                cohortId: [cohortId],
                              });

                            if (
                              cohortMemberResponse?.responseCode === 201 ||
                              cohortMemberResponse?.params?.err === null
                            ) {
                              console.log(
                                'Successfully mapped user to center:',
                                cohortMemberResponse
                              );
                            } else {
                              console.error(
                                'Error mapping user to center:',
                                cohortMemberResponse
                              );
                            }
                          } catch (cohortError) {
                            console.error(
                              'Error in bulkCreateCohortMembers:',
                              cohortError
                            );
                            // Don't fail the entire flow if cohort mapping fails
                          }
                        }

                        showToastMessage(t(successUpdateMessage), 'success');

                        // Close dialog
                        setMapModalOpen(false);
                        setSelectedCenterId(null);
                        setSelectedUserId(null);
                        setCohortResponse(null);
                        setCatchmentAreaData(null);
                        setSelectedStateId(null);
                        setSelectedDistrictId(null);
                        setSelectedBlockId(null);
                        setFormStep(0);
                        // Refresh the data
                        searchData(prefilledFormData, 0);
                      } else {
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
                    showToastMessage(
                      t('MOBILIZER.PLEASE_SEARCH_AND_SELECT_USER'),
                      'error'
                    );
                  }
                }}
                schema={addSchema}
                uiSchema={addUiSchema}
                prefilledState={{}}
                onPrefilledStateChange={(prefilledState) => {
                  setPrefilledState(prefilledState || {});
                }}
                roleId={roleId}
                tenantId={tenantId}
                type="leader"
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
              disabled={!selectedCenterId || isMappingInProgress}
              onClick={() => {
                if (selectedCenterId) {
                  setFormStep(1);
                  localStorage.setItem(
                    'workingLocationCenterId',
                    selectedCenterId
                  );
                } else {
                  showToastMessage('Please select a center', 'error');
                }
              }}
            >
              {t('COMMON.NEXT')}
            </Button>
          )}
          {formStep === 1 && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={!selectedUserId || isMappingInProgress}
              form="dynamic-form-id"
              type="submit"
              // onClick={async () => {

              // }}
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

export default Mobilizer;
