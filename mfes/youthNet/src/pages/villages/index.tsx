//@ts-nocheck
import Header from '../../components/Header';
import BackHeader from '../../components/youthNet/BackHeader';
import {
  Box,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Radio,
  Tab,
  Tabs,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import SearchBar from '../../components/Searchbar';
import SortBy from '../../components/youthNet/SortBy';
import YouthAndVolunteers from '../../components/youthNet/YouthAndVolunteers';
import {
  DROPDOWN_NAME,
  users,
  VILLAGE_OPTIONS,
  villageList,
  youthList,
  mentorList,
  YOUTHNET_USER_ROLE,
  reAssignVillages,
  SURVEY_DATA,
} from '../../components/youthNet/tempConfigs';
import { UserList } from '../../components/youthNet/UserCard';
import DownloadIcon from '@mui/icons-material/Download';
import withRole from '../../components/withRole';
import { BOTTOM_DRAWER_CONSTANTS, TENANT_DATA } from '../../utils/app.config';
import Dropdown from '../../components/youthNet/DropDown';
import { useRouter } from 'next/router';
import BottomDrawer from '../../components/youthNet/BottomDrawer';
import Loader from '../../components/Loader';
import {
  fetchBlockData,
  fetchDistrictData,
  getStateBlockDistrictList,
} from '../../services/youthNet/Dashboard/VillageServices';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SimpleModal from '../../components/SimpleModal';
import Surveys from '../../components/youthNet/Surveys';
import { useDirection } from '../../hooks/useDirection';
import GenericForm from '../../components/youthNet/GenericForm';
import ExamplePage from '../../components/youthNet/BlockItem';
import VillageSelector from '../../components/youthNet/VillageSelector';
import {
  filterData,
  getAge,
  getLoggedInUserRole,
  getVillageUserCounts,
  filterSchema,
} from '../../utils/Helper';
import { fetchUserList, updateUserTenantStatus } from '../../services/youthNet/Dashboard/UserServices';
import {
  cohortHierarchy,
  Role,
  SortOrder,
  Status,
  VolunteerField,
} from '../../utils/app.constant';
import { fetchCohortMemberList } from '../../services/MyClassDetailsService';
import { editEditUser } from '../../services/ProfileService';
import { showToastMessage } from '@/components/Toastify';
import MentorAssignment from '../../components/youthNet/MentorForm/MentorAssignment';
import useSubmittedButtonStore from '../../store/useSubmittedButtonStore';
import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import DeleteIcon from '@mui/icons-material/Delete';
import MentorForm from '@/components/DynamicForm/MentorForm/MentorForm';
import { FormContext } from '@shared-lib-v2/DynamicForm/components/DynamicFormConstant';
import {
  extractMatchingKeys,
  fetchForm,
  enhanceUiSchemaWithGrid,
  splitUserData,
} from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { RoleId } from '@/utils/app.constant';
import { deleteUser } from '@shared-lib-v2/MapUser/DeleteUser';
import EmailSearchUser from '@shared-lib-v2/MapUser/EmailSearchUser';
import { enrollUserTenant } from '@shared-lib-v2/MapUser/MapService';
import { bulkCreateCohortMembers } from '../../services/CohortService';
import { getCohortList } from '../../services/GetCohortList';

const Index = () => {
  const { isRTL } = useDirection();
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const { villageId, tab, blockId } = router.query;
  // const blockId: blockResult?.selectedValues[0]?.id
  const [value, setValue] = useState<number>(
    tab
      ? Number(tab)
      : YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole()
      ? 1
      : 2
  );
  const [searchInput, setSearchInput] = useState('');
  const [toggledUser, setToggledUser] = useState('');
  const [selectedToggledUserId, setselectedToggledUserId] = useState('');
  const [formData, setFormData] = useState<any>();
  const [showAssignmentScreen, setShowAssignmentScreen] =
    useState<boolean>(false);
  const submittedButtonStatus = useSubmittedButtonStore(
    (state: any) => state.submittedButtonStatus
  );
  const [openMentorDrawer, setOpenMentorDrawer] = useState(false);
  const [toggledMentor, setToggledMentor] = useState('');
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openReassignDistrict, setOpenReassignDistrict] = useState(false);
  const [openReassignVillage, setOpenReassignVillage] = useState(false);
  // const [addNew, setAddNew] = useState(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isReassign, setIsReassign] = useState(false);
  const [buttonShow, setButtonShowState] = useState(true);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [originalSchema, setOriginalSchema] = useState(null);
  const [originalUiSchema, setOriginalUiSchema] = useState(null);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [roleId, setRoleID] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [editableUserId, setEditableUserId] = useState('');
  const [blockVillageMap, setBlockVillageMap] = useState<
    Record<number, number[]>
  >({});
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  const [count, setCount] = useState(0);
  const [villageCount, setVillageCount] = useState(0);
  const [mentorCount, setMentorCount] = useState(0);
  const [villageList, setVillageList] = useState<any>([]);
  const [mentorList, setMentorList] = useState<any>([]);
  const [villageListWithUsers, setVillageListWithUsers] = useState<any>([]);
  const [youthList, setYouthList] = useState<any>([]);
  const [filteredmentorList, setFilteredmentorList] = useState<any>([]);
  const [filteredvillageListWithUsers, setFilteredVillageListWithUsers] =
    useState<any>([]);
  const [filteredyouthList, setFilteredYouthList] = useState<any>([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [reason, setReason] = useState('');
  const [village, setVillage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userID, setUserId] = useState('');
  const [availableCenters, setAvailableCenters] = useState<string>('');
  const [stateData, setStateData] = useState<any>(null);
  const [districtData, setDistrictData] = useState<any>(null);
  const [blockData, setBlockData] = useState<any>(null);
  const [allDistrictsByState, setAllDistrictsByState] = useState<
    Record<number, any[]>
  >({});
  const [allBlocksByDistrict, setAllBlocksByDistrict] = useState<
    Record<number, any[]>
  >({});

  // Mobilizer modal state
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mobilizerFormStep, setMobilizerFormStep] = useState(0);
  const [selectedMobilizerUserId, setSelectedMobilizerUserId] = useState<
    string | null
  >(null);
  const [mobilizerUserDetails, setMobilizerUserDetails] = useState<any>(null);
  const [isMobilizerMappingInProgress, setIsMobilizerMappingInProgress] =
    useState(false);
  const [mobilizerPrefilledState, setMobilizerPrefilledState] = useState({});
  const [mobilizerAddSchema, setMobilizerAddSchema] = useState(null);
  const [mobilizerAddUiSchema, setMobilizerAddUiSchema] = useState(null);
  const [workingVillageId, setWorkingVillageId] = useState('');
  const [workingLocationId, setWorkingLocationId] = useState('');

  const [selectedValue, setSelectedValue] = useState<any>();
  const [selectedBlockValue, setSelectedBlockValue] = useState<any>(
    blockId ? blockId : ''
  );
  const [selectedVillageValue, setSelectedVillageValue] = useState<any>(
    villageId ? Array.isArray(villageId) ? villageId : [villageId] : []
  );
  const [selectedDistrictValue, setSelectedDistrictValue] = useState<any>('');
  const [selectedStateValue, setSelectedStateValue] = useState<any>('');
  const [isVolunteerFieldId, setIsVolunteerFieldId] = useState<any>('');

  const [loading, setLoading] = useState<boolean>(false);

  const [appliedFilters, setAppliedFilters] = useState({
    centerType: '',
    sortOrder: '',
  });

  // Helper function to extract states, districts and blocks from catchment_area
  const getStatesDistrictsAndBlocksFromCatchmentArea = () => {
    try {
      const cohortDataString = localStorage.getItem('cohortData');
      const cohortData: any[] = cohortDataString
        ? JSON.parse(cohortDataString)
        : [];
      const workingLocationCenterId = localStorage.getItem(
        'workingLocationCenterId'
      );

      // Find the cohort matching workingLocationCenterId, or use first active cohort
      let selectedCohort = null;
      if (workingLocationCenterId) {
        selectedCohort = cohortData.find(
          (cohort: any) => cohort.cohortId === workingLocationCenterId
        );
      }
      if (!selectedCohort) {
        selectedCohort = cohortData.find(
          (cohort: any) =>
            cohort.type === 'COHORT' &&
            cohort.cohortMemberStatus?.toLowerCase() === 'active' &&
            cohort.cohortStatus?.toLowerCase() === 'active'
        );
      }
      if (!selectedCohort && cohortData.length > 0) {
        selectedCohort = cohortData[0];
      }

      if (!selectedCohort || !selectedCohort.customField) {
        return { states: [], districtsByState: {}, blocksByDistrict: {} };
      }

      // Find CATCHMENT_AREA field
      const catchmentAreaField = selectedCohort.customField.find(
        (field: any) => field.label === 'CATCHMENT_AREA'
      );

      if (!catchmentAreaField || !catchmentAreaField.selectedValues) {
        return { states: [], districtsByState: {}, blocksByDistrict: {} };
      }

      const catchmentAreaArray = catchmentAreaField.selectedValues;
      const states: any[] = [];
      const stateMap = new Map();
      const districtsByState: Record<number, any[]> = {};
      const blocksByDistrict: Record<number, any[]> = {};

      // Extract states, districts and blocks from catchment_area
      // catchmentAreaField.selectedValues is an array of state objects
      if (Array.isArray(catchmentAreaArray)) {
        catchmentAreaArray.forEach((state: any) => {
          // Add state if not already added
          if (state.stateId && !stateMap.has(state.stateId)) {
            states.push({
              id: state.stateId,
              name: state.stateName,
            });
            stateMap.set(state.stateId, true);
            districtsByState[state.stateId] = [];
          }

          // Extract districts from this state
          if (state.districts && Array.isArray(state.districts)) {
            state.districts.forEach((district: any) => {
              // Add district to state's districts list
              if (
                district.districtId &&
                !districtsByState[state.stateId].find(
                  (d: any) => d.id === district.districtId
                )
              ) {
                districtsByState[state.stateId].push({
                  id: district.districtId,
                  name: district.districtName,
                });
                blocksByDistrict[district.districtId] = [];
              }

              // Extract blocks from this district
              if (district.blocks && Array.isArray(district.blocks)) {
                district.blocks.forEach((block: any) => {
                  if (block.id) {
                    blocksByDistrict[district.districtId].push({
                      id: block.id,
                      name: block.name,
                    });
                  }
                });
              }
            });
          }
        });
      }

      return { states, districtsByState, blocksByDistrict };
    } catch (error) {
      console.error(
        'Error extracting states, districts and blocks from catchment_area:',
        error
      );
      return { states: [], districtsByState: {}, blocksByDistrict: {} };
    }
  };

  useEffect(() => {
    const getData = async () => {
      try {
        // For tabs 2 and 3, get data from catchment_area
        const { states, districtsByState, blocksByDistrict } =
          getStatesDistrictsAndBlocksFromCatchmentArea();

        if (states.length > 0) {
          setStateData(states);
          const initialStateId = states[0]?.id;
          setSelectedStateValue(initialStateId);

          // Store districts by state and blocks by district mappings
          setAllDistrictsByState(districtsByState);
          setAllBlocksByDistrict(blocksByDistrict);

          // Set districts for the first state
          if (initialStateId && districtsByState[initialStateId]) {
            const initialDistricts = districtsByState[initialStateId];
            setDistrictData(initialDistricts);
            const initialDistrictId = initialDistricts[0]?.id;
            setSelectedDistrictValue(initialDistrictId);

            // Set blocks for the first district
            if (initialDistrictId && blocksByDistrict[initialDistrictId]) {
              const initialBlocks = blocksByDistrict[initialDistrictId];
              setBlockData(initialBlocks);
              setSelectedBlockValue(blockId ? blockId : initialBlocks[0]?.id);
            } else {
              // Fallback to API if no blocks from catchment_area for this district
              const controllingfieldfk = [initialDistrictId?.toString()];
              const fieldName = 'block';
              const blockResponce = await getStateBlockDistrictList({
                controllingfieldfk,
                fieldName,
              });

              const transformedBlockData = blockResponce?.result?.values?.map(
                (item: any) => ({
                  id: item?.value,
                  name: item?.label,
                })
              );
              setBlockData(transformedBlockData);
              setSelectedBlockValue(
                blockId ? blockId : transformedBlockData[0]?.id
              );
            }
          }
        }
      } catch (error) {
        console.error('Error fetching state, district and block data:', error);
        setBlockData([]);
      }
    };
    getData();
  }, [blockId, villageId]);

  useEffect(() => {
    // Initialize states, districts and blocks from catchment_area for tabs 2 and 3
    const { states, districtsByState, blocksByDistrict } =
      getStatesDistrictsAndBlocksFromCatchmentArea();

    if (states.length > 0) {
      setStateData(states);
      const initialStateId = states[0]?.id;
      setSelectedStateValue(initialStateId);

      // Store districts by state and blocks by district mappings
      setAllDistrictsByState(districtsByState);
      setAllBlocksByDistrict(blocksByDistrict);

      // Set districts for the first state
      if (initialStateId && districtsByState[initialStateId]) {
        const initialDistricts = districtsByState[initialStateId];
        setDistrictData(initialDistricts);
        const initialDistrictId = initialDistricts[0]?.id;
        setSelectedDistrictValue(initialDistrictId);

        // Set blocks for the first district
        if (initialDistrictId && blocksByDistrict[initialDistrictId]) {
          setBlockData(blocksByDistrict[initialDistrictId]);
        }
      }
    }
  }, []);

  // Update districts when state changes
  useEffect(() => {
    if (selectedStateValue && allDistrictsByState[selectedStateValue]) {
      const districtsForState = allDistrictsByState[selectedStateValue];
      setDistrictData(districtsForState);
      // Reset selected district to first district of new state
      if (districtsForState.length > 0) {
        setSelectedDistrictValue(districtsForState[0]?.id);
      } else {
        setDistrictData([]);
        setSelectedDistrictValue('');
      }
    }
  }, [selectedStateValue, allDistrictsByState]);

  // Update blocks when district changes
  useEffect(() => {
    if (selectedDistrictValue && allBlocksByDistrict[selectedDistrictValue]) {
      const blocksForDistrict = allBlocksByDistrict[selectedDistrictValue];
      setBlockData(blocksForDistrict);
      // Reset selected block to first block of new district
      if (blocksForDistrict.length > 0) {
        setSelectedBlockValue(blocksForDistrict[0]?.id);
      } else {
        setBlockData([]);
        setSelectedBlockValue('');
      }
    }
  }, [selectedDistrictValue, allBlocksByDistrict]);

  useEffect(() => {
    try {
      const getSortedData = (data: any, sortOrderType: any) => {
        setLoading(true);

        switch (sortOrderType) {
          case SortOrder.ASC:
            return [...data].sort((a, b) => a.name.localeCompare(b.name));
          case SortOrder.DESC:
            return [...data].sort((a, b) => b.name.localeCompare(a.name));
          case SortOrder.NEW_REGISTRATION_LOW_TO_HIGH:
            return [...data].sort(
              (a, b) => a.newRegistrations - b.newRegistrations
            );
          case SortOrder.NEW_REGISTRATION_HIGH_TO_LOW:
            return [...data].sort(
              (a, b) => b.newRegistrations - a.newRegistrations
            );
          case SortOrder.TOTAL_COUNT_LOW_TO_HIGH:
            return [...data].sort((a, b) => a.totalCount - b.totalCount);
          case SortOrder.TOTAL_COUNT_HIGH_TO_LOW:
            return [...data].sort((a, b) => b.totalCount - a.totalCount);
          case SortOrder.AGE_LOW_TO_HIGH:
            return [...data].sort((a, b) => a.age - b.age);
          case SortOrder.AGE_HIGH_TO_LOW:
            return [...data].sort((a, b) => b.age - a.age);
          case SortOrder.OLD_JOINER_FIRST:
            return [...data].sort(
              (a, b) =>
                new Date(a.joinOn).getTime() - new Date(b.joinOn).getTime()
            );
          case SortOrder.NEW_JOINER_FIRST:
            return [...data].sort(
              (a, b) =>
                new Date(b.joinOn).getTime() - new Date(a.joinOn).getTime()
            );
          default:
            return data;
        }
      };

      let filteredData = [];
      if (value === 1) {
        console.log('filteredDatamentorList', mentorList);
        filteredData = filterData(mentorList, searchInput);
        const data = getSortedData(filteredData, appliedFilters?.sortOrder);
        setFilteredmentorList(
          getSortedData(filteredData, appliedFilters?.sortOrder)
        );
        setMentorCount(data.length);
      } else if (value === 2) {
        filteredData = filterData(villageListWithUsers, searchInput);
        const data = getSortedData(filteredData, appliedFilters?.sortOrder);
        setFilteredVillageListWithUsers(
          getSortedData(filteredData, appliedFilters?.sortOrder)
        );
        setVillageCount(data.length);
      } else if (value === 3) {
        console.log('filteredDatayouthList', youthList);
        filteredData = filterData(youthList, searchInput);
        setFilteredYouthList(
          getSortedData(filteredData, appliedFilters?.sortOrder)
        );
      }
      const query = { ...router.query, value: value };
      router.replace({ pathname: router.pathname, query });
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [searchInput, appliedFilters, value]);

  useEffect(() => {
    const getYouthData = async () => {
      try {
        setLoading(true);
        const filters = {
          village: Array.isArray(selectedVillageValue) ? selectedVillageValue : [selectedVillageValue],
          role: Role.LEARNER,
          tenantStatus: [Status.ACTIVE],
        };

        const result = await fetchUserList({ filters });
        console.log('result', result);
        if (result.getUserDetails) {
          const transformedYouthData = result?.getUserDetails.map(
            (user: any) => {
              let name = user.firstName || '';
              const villageField = user?.customFields?.find(
                (field: any) => field?.label === cohortHierarchy.BLOCK
              );
              const blockField = user?.customFields?.find(
                (field: any) => field?.label === cohortHierarchy.BLOCK
              );
              const isVolunteer = user?.customFields?.find(
                (field: any) => field.label === VolunteerField.IS_VOLUNTEER
              );
              setIsVolunteerFieldId(isVolunteer?.fieldId);
              const blockValues = blockField?.selectedValues.map(
                (block: any) => block.value
              );

              if (user.lastName) {
                name += ` ${user.lastName}`;
              }
              let formattedDate;
              let isToday = false;
              if (user.createdAt) {
                const date = new Date(user.createdAt);
                const today = new Date();
                isToday =
                  date.getUTCFullYear() === today.getUTCFullYear() &&
                  date.getUTCMonth() === today.getUTCMonth() &&
                  date.getUTCDate() === today.getUTCDate();
                const options: Intl.DateTimeFormatOptions = {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                };

                formattedDate = date.toLocaleDateString('en-GB', options);
              }
              return {
                Id: user.userId,
                name: name.trim(),
                firstName: user?.firstName,
                dob: user?.dob,
                lastName: user?.lastName,
                joinOn: formattedDate,
                isNew: isToday,
                age: getAge(user?.dob),
                showMore: true,
                isVolunteer:
                  isVolunteer?.selectedValues[0] || VolunteerField?.NO,
              };
            }
          );
          const ascending = [...transformedYouthData].sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          setYouthList(ascending);
          setFilteredYouthList(ascending);
        } else {
          setYouthList([]);
          setFilteredYouthList([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (value === 3 && selectedVillageValue?.length > 0) getYouthData();
  }, [value, selectedVillageValue]);

  const getMobilizersList = async () => {
    try {
      if (value === 1) {
        setLoading(true);
        const workingLocationCenterId = localStorage.getItem(
          'workingLocationCenterId'
        );

        if (workingLocationCenterId) {
          const response = await fetchCohortMemberList({
            filters: {
              cohortId: workingLocationCenterId,
              role: Role.MOBILIZER,
              status: [Status.ACTIVE],
            },
          });

          const userDetails = response?.result?.userDetails || [];
          const transformedData = userDetails.map((user: any) => {
            let name = user.firstName || '';
            if (user.lastName) {
              name += ` ${user.lastName}`;
            }
            return {
              Id: user.userId,
              name: name.trim(),
              firstName: user?.firstName,
              lastName: user?.lastName,
              // showMore: true,
              customFields: user?.customFields,
            };
          });

          const ascending = [...transformedData].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setMentorList(ascending);
          setFilteredmentorList(ascending);
          setMentorCount(transformedData.length);
        } else {
          setMentorList([]);
          setFilteredmentorList([]);
          setMentorCount(0);
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (value === 1) {
      getMobilizersList();
    }
  }, [value, submittedButtonStatus]);

  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      const responseForm = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mentor.context}&contextType=${FormContext.mentor.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.mentor.context}&contextType=${FormContext.mentor.contextType}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);
      console.log('responseForm', responseForm);
      const { newSchema, extractedFields } = filterSchema(responseForm);
      setAddSchema(newSchema?.schema);
      setAddUiSchema(newSchema?.uiSchema);
      setOriginalSchema(responseForm?.schema);
      const originalResponse = JSON.parse(JSON.stringify(responseForm));
      if (originalResponse?.uiSchema?.state) {
        originalResponse.uiSchema.state['ui:disabled'] = true;
      }
      if (originalResponse?.uiSchema?.district) {
        originalResponse.uiSchema.district['ui:disabled'] = true;
      }
      setOriginalUiSchema(originalResponse?.uiSchema);
      // console.log('addschema', newSchema?.schema);
      // console.log('adduischema', newSchema?.uiSchema);
      // console.log('extractedFields', extractedFields);
      // setSdbvFieldData(extractedFields);
    };

    setPrefilledAddFormData({
      state: [selectedStateValue],
      district: [selectedDistrictValue],
    });
    console.log('####', selectedStateValue, selectedDistrictValue);
    setPrefilledFormData({});
    setRoleID(RoleId.TEACHER);
    setTenantId(localStorage.getItem('tenantId') || '');
    fetchData();
  }, [selectedStateValue, selectedDistrictValue]);

  // Fetch mobilizer form schema
  useEffect(() => {
    const fetchMobilizerForm = async () => {
      const mobilizerFormContext = {
        context: 'USERS',
        contextType: 'MOBILIZER',
      };
      const responseForm = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${mobilizerFormContext.context}&contextType=${mobilizerFormContext.contextType}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${mobilizerFormContext.context}&contextType=${mobilizerFormContext.contextType}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);
      let alterSchema = responseForm?.schema;
      let alterUISchema = responseForm?.uiSchema;
      if (alterSchema) {
        setWorkingVillageId(alterSchema?.properties?.working_village?.fieldId);
        setWorkingLocationId(
          alterSchema?.properties?.working_location?.fieldId
        );
        const keysToRemove = ['working_village'];
        keysToRemove.forEach((key) => delete alterSchema.properties[key]);
        keysToRemove.forEach((key) => delete alterUISchema[key]);
        //also remove from required if present
        alterSchema.required =
          alterSchema.required?.filter((key) => !keysToRemove.includes(key)) ||
          [];
      }
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

      // Remove duplicates from requiredArray
      let requiredArray = alterSchema?.required;
      if (Array.isArray(requiredArray)) {
        requiredArray = Array.from(new Set(requiredArray));
      }
      alterSchema.required = requiredArray;

      // Set 2 grid layout
      alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

      setMobilizerAddSchema(alterSchema);
      setMobilizerAddUiSchema(alterUISchema);
    };
    fetchMobilizerForm();
  }, []);

  const handleLocationClick = (Id: any, name: any) => {
    console.log(selectedBlockValue);

    router.push({
      pathname: `/villageDetails/${name}`,
      query: { id: Id, blockId: selectedBlockValue, tab: value },
    });
  };

  useEffect(() => {
    const getVillageYouthData = async () => {
      try {
        setLoading(true);
        let userDataString = localStorage.getItem('userData');
        let userData: any = userDataString ? JSON.parse(userDataString) : null;
        let blockIds: any;
        if (YOUTHNET_USER_ROLE.MOBILIZER === getLoggedInUserRole()) {
          const blockResult = userData?.customFields?.find(
            (item: any) => item.label === 'BLOCK'
          );
          blockIds =
            blockResult?.selectedValues?.map((item: any) => item.id) || [];
        } else if (selectedBlockValue !== '') {
          blockIds = [selectedBlockValue];
        }
        const filters = {
          block: blockIds,
          role: Role.LEARNER,
          tenantStatus: [Status.ACTIVE],
        };

        const result = await fetchUserList({ filters });
        let villagewithUser;
        villagewithUser = getVillageUserCounts(result, villageList);
        const ascending = [...villagewithUser].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setVillageListWithUsers([...ascending]);

        setFilteredVillageListWithUsers([...ascending]);
      } catch (e) {
        setVillageListWithUsers([]);
        setFilteredVillageListWithUsers([]);
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    if (villageList?.length !== 0) getVillageYouthData();
  }, [villageList, selectedBlockValue]);

  useEffect(() => {
    const getVillageList = async () => {
      try {
        if (YOUTHNET_USER_ROLE.MOBILIZER === getLoggedInUserRole()) {
          let villageDataString = localStorage.getItem('villageData');
          let villageData: any = villageDataString
            ? JSON.parse(villageDataString)
            : null;
          setVillageList(villageData);
          console.log('villageData', villageData);
          if (selectedBlockValue === blockId) {
            setSelectedVillageValue(villageId);
          } else {
            if (YOUTHNET_USER_ROLE.MOBILIZER === getLoggedInUserRole())
              setSelectedVillageValue(villageId);
            else setSelectedVillageValue(villageData[0]?.Id);
          }

          setVillageCount(villageData.length);
        } else if (selectedBlockValue !== '') {
          const controllingfieldfk = [selectedBlockValue?.toString()];
          const fieldName = 'village';
          const villageResponce = await getStateBlockDistrictList({
            controllingfieldfk,
            fieldName,
          });

          const transformedVillageData = villageResponce?.result?.values?.map(
            (item: any) => ({
              Id: item?.value,
              name: item?.label,
            })
          );
          setVillageCount(transformedVillageData.length);

          setVillageList(transformedVillageData);
          if (selectedBlockValue === blockId) {
            setSelectedVillageValue(villageId);
          } else {
            if (YOUTHNET_USER_ROLE.MOBILIZER === getLoggedInUserRole())
              setSelectedVillageValue(villageId);
            else setSelectedVillageValue(transformedVillageData[0]?.Id);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getVillageList();
  }, [selectedBlockValue, blockId, villageId]);
  useEffect(() => {
    setValue(
      tab
        ? Number(tab)
        : YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole()
        ? 1
        : 2
    );
  }, []);
  const FormSubmitFunction = async (formData: any, payload: any) => {
    setFormData(formData);
    setShowAssignmentScreen(true);
  };
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setSearchInput('');
    const centerType = '';
    const sortOrder = '';
    setAppliedFilters({ centerType, sortOrder });
  };

  const handleUserClick = (userId: any) => {
    router.push({
      pathname: `/user-profile/${userId}`,
      query: {
        tab: value,
        blockId: selectedBlockValue,
        villageId: Array.isArray(selectedVillageValue) ? selectedVillageValue : [selectedVillageValue],
      },
    });
  };

  const handleToggledUserClick = (user: any) => {
    setToggledUser(user.name);
    setselectedToggledUserId(user.Id);
    setOpenDrawer((prev) => !prev);
  };
  const handlemarkAsVolunteer = async () => {
    try {
      if (selectedToggledUserId !== '') {
        const userId = selectedToggledUserId;
        const userDetails = {
          userData: {},
          customFields: [
            {
              fieldId:
                isVolunteerFieldId || '59716ca7-37af-4527-a1ad-ce0f1dabeb00',
              value: 'yes',
            },
          ],
        };

        const response = await editEditUser(userId, userDetails);
        console.log(filteredyouthList);

        const updateIsVolunteer = (
          array: any[],
          targetId: any,
          newValue: any
        ) => {
          return array.map((item) =>
            item.Id === targetId ? { ...item, isVolunteer: newValue } : item
          );
        };

        const updatedYouthList = updateIsVolunteer(
          youthList,
          selectedToggledUserId,
          VolunteerField.YES
        );
        const updatedFilteredList = updateIsVolunteer(
          filteredyouthList,
          selectedToggledUserId,
          VolunteerField.YES
        );

        setYouthList(updatedYouthList);
        setFilteredYouthList(updatedFilteredList);
        showToastMessage(
          t('YOUTHNET_DASHBOARD.MARK_AS_VOLUNTEER_SUCCESSFULLY'),
          'success'
        );
      }
    } catch (e) {
      showToastMessage(
        t('YOUTHNET_DASHBOARD.MARK_AS_VOLUNTEER_FAILED'),
        'error'
      );

      console.log(e);
    }
  };

  const handleUnmarkAsVolunteer = async () => {
    try {
      if (selectedToggledUserId !== '') {
        const userId = selectedToggledUserId;
        const userDetails = {
          userData: {},
          customFields: [
            {
              fieldId:
                isVolunteerFieldId || '59716ca7-37af-4527-a1ad-ce0f1dabeb00',
              value: 'no',
            },
          ],
        };

        const response = await editEditUser(userId, userDetails);
        console.log(filteredyouthList);

        const updateIsVolunteer = (
          array: any[],
          targetId: any,
          newValue: any
        ) => {
          return array.map((item) =>
            item.Id === targetId ? { ...item, isVolunteer: newValue } : item
          );
        };

        const updatedYouthList = updateIsVolunteer(
          youthList,
          selectedToggledUserId,
          VolunteerField.NO
        );
        const updatedFilteredList = updateIsVolunteer(
          filteredyouthList,
          selectedToggledUserId,
          VolunteerField.NO
        );

        setYouthList(updatedYouthList);
        setFilteredYouthList(updatedFilteredList);
        showToastMessage(
          t('YOUTHNET_DASHBOARD.UNMARK_AS_VOLUNTEER_SUCCESSFULLY'),
          'success'
        );
      }
    } catch (e) {
      showToastMessage(
        t('YOUTHNET_DASHBOARD.UNMARK_AS_VOLUNTEER_FAILED'),
        'error'
      );

      console.log(e);
    }
  };

  const handleToggledMentorClick = (user: any) => {
    setToggledMentor(user.name);
    setSelectedMentor(user);
    setOpenMentorDrawer((prev) => !prev);
  };
  const handleToggleClose = () => {
    setOpenDrawer(false);
    setOpenMentorDrawer(false);
    setselectedToggledUserId('');
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
    username: 'youthnetmentor',
    password: Math.floor(10000 + Math.random() * 90000),
  };
  const successUpdateMessage = 'MENTORS.MENTOR_UPDATED_SUCCESSFULLY';
  const telemetryUpdateKey = 'youthnet-mentor-updated-successfully';
  const failureUpdateMessage = 'MENTORS.NOT_ABLE_UPDATE_MENTOR';
  const successCreateMessage = 'MENTORS.MENTOR_CREATED_SUCCESSFULLY';
  const telemetryCreateKey = 'youthnet-mentor-created-successfully';
  const failureCreateMessage = 'MENTORS.NOT_ABLE_CREATE_MENTOR';
  const notificationKey = 'onMentorCreate';
  const notificationMessage = 'MENTORS.USER_CREDENTIALS_WILL_BE_SEND_SOON';
  const notificationContext = 'USER';
  const blockReassignmentNotificationKey = 'onMentorBlockReassign';
  const villageReassignmentNotificationKey = 'onMentorVillageReassign';

  const setButtonShow = (
    status: boolean | ((prevState: boolean) => boolean)
  ) => {
    console.log('########## changed', status);
    setButtonShowState(status);
  };

  const handleVillageReassign = async () => {
    if (!selectedMentor) return;
    let tempFormData = extractMatchingKeys(selectedMentor, originalSchema);
    console.log('tempFormData+++', tempFormData);
    console.log('selectedMentor', selectedMentor);
    console.log('addschema', originalSchema);
    let blockIds: any = [];
    let villageIds: any = [];
    selectedMentor?.customFields?.forEach((field: any) => {
      if (field.label === 'BLOCK') {
        blockIds = field.selectedValues.map((item: any) => item.id);
      }
      if (field.label === 'VILLAGE') {
        villageIds = field.selectedValues.map((item: any) => item.id);
      }
    });
    // console.log('blockIds', blockIds);
    // console.log('villageIds', villageIds);
    // console.log('tempFormData>>>>', tempFormData);
    const getVillageMapByBlock = async () => {
      const result: Record<number, number[]> = {};

      for (const blockId of blockIds) {
        console.log('Processing blockId:', blockId); // Debug log

        if (!blockId) continue;

        try {
          const villageResponse = await getStateBlockDistrictList({
            controllingfieldfk: [blockId],
            fieldName: 'village',
          });

          const villages = villageResponse?.result?.values || [];

          const matchedVillages = villages
            .filter((item: any) => villageIds.includes(item?.value))
            .map((item: any) => item?.value);

          if (matchedVillages.length > 0) {
            result[blockId] = matchedVillages;
          }
        } catch (error) {
          console.error(
            `Error fetching villages for blockId ${blockId}:`,
            error
          );
        }
      }
      return result;
    };

    // Call the function
    const villageMap = await getVillageMapByBlock();
    // console.log('Final block-village map:', villageMap);
    setBlockVillageMap(villageMap);
    setPrefilledAddFormData(tempFormData);
    setIsReassign(true);
    setButtonShow(true);
    setEditableUserId(selectedMentor?.Id);
    handleOpenNew();
  };

  const onClose = () => {
    setOpenDelete(false);
    setOpenReassignDistrict(false);
    setCount(0);
    setShowAssignmentScreen(false);
    setFormData({});
    setOpenModal(false);
    setIsReassign(false);
    setButtonShow(true);
  };

  const handleButtonClick = async (actionType: string) => {
    console.log(actionType);

    switch (actionType) {
      case BOTTOM_DRAWER_CONSTANTS.MARK_VOLUNTEER: {
        setOpenDrawer(false);
        await handlemarkAsVolunteer();
        break;
      }

      case BOTTOM_DRAWER_CONSTANTS.UNMARK_VOLUNTEER: {
        setOpenDrawer(false);
        await handleUnmarkAsVolunteer();
        break;
      }

      case BOTTOM_DRAWER_CONSTANTS.ADD_REASSIGN:
        setOpenMentorDrawer(false);
        handleVillageReassign();
        break;

      case BOTTOM_DRAWER_CONSTANTS.REQUEST_REASSIGN:
        setOpenMentorDrawer(false);
        setOpenReassignDistrict(true);
        break;

      case BOTTOM_DRAWER_CONSTANTS.DELETE:
        setOpenMentorDrawer(false);
        // Extract village/center information from selectedMentor
        if (selectedMentor) {
          const mentorUserId = selectedMentor?.Id || selectedMentor?.userId || '';
          setUserId(mentorUserId);
          setFirstName(selectedMentor?.firstName || '');
          setLastName(selectedMentor?.lastName || '');
          setReason('');
          setChecked(false);
          
          // Fetch active centers/villages for the mentor
          const fetchMentorCenters = async () => {
            try {
              if (mentorUserId) {
                const cohortResponse = await getCohortList(mentorUserId);
                const cohortList = cohortResponse?.result || [];
                
                // Filter active centers where cohortMemberStatus = "active" and cohortStatus = "active"
                const activeCenters = cohortList.filter((cohort: any) => 
                  cohort.cohortMemberStatus === 'active' &&
                  cohort.cohortStatus === 'active' &&
                  (cohort.type === 'CENTER' || cohort.type === 'COHORT')
                );
                
                // Extract center names
                const centerNames = activeCenters
                  .map((cohort: any) => cohort.cohortName || cohort.name)
                  .filter(Boolean)
                  .join(', ');
                
                setAvailableCenters(centerNames);
                setVillage(centerNames);
                setOpen(true);
              } else {
                setAvailableCenters('');
                setVillage('');
                setOpen(true);
              }
            } catch (error) {
              console.error('Error fetching mentor centers:', error);
              setAvailableCenters('');
              setVillage('');
              setOpen(true);
            }
          };
          
          fetchMentorCenters();
        }
        break;

      default:
        console.warn(BOTTOM_DRAWER_CONSTANTS.UNKNOWN_ACTION, actionType);
    }
  };

  // Get current selected user from filteredyouthList
  const selectedUser = filteredyouthList.find(
    (user: any) => user.Id === selectedToggledUserId
  );
  const isCurrentUserVolunteer =
    selectedUser?.isVolunteer === VolunteerField.YES;

  const buttons = [
    // Show mark button for non-volunteers, unmark button for volunteers
    isCurrentUserVolunteer
      ? {
          label: t('YOUTHNET_DASHBOARD.UNMARK_AS_VOLUNTEER'),
          icon: <SwapHorizIcon />,
          onClick: () =>
            handleButtonClick(BOTTOM_DRAWER_CONSTANTS.UNMARK_VOLUNTEER),
        }
      : {
          label: t('YOUTHNET_USERS_AND_VILLAGES.MARK_AS_VOLUNTEER'),
          icon: <SwapHorizIcon />,
          onClick: () =>
            handleButtonClick(BOTTOM_DRAWER_CONSTANTS.MARK_VOLUNTEER),
        },
  ];

  const mentorActions = [
    // TODO: Uncomment after reassign functionality implementation is complete
    // {
    //   label: t('YOUTHNET_USERS_AND_VILLAGES.ADD_OR_REASSIGN_VILLAGES'),
    //   action: BOTTOM_DRAWER_CONSTANTS.ADD_REASSIGN,
    //   icon: <HolidayVillageIcon />,
    // },
    // {
    //   label: t('YOUTHNET_USERS_AND_VILLAGES.REQUEST_TO_REASSIGN_DISTRICT'),
    //   action: BOTTOM_DRAWER_CONSTANTS.REQUEST_REASSIGN,
    //   icon: <PersonPinIcon />,
    // },
    {
      label: t('YOUTHNET_USERS_AND_VILLAGES.DELETE_USER_PERMANENTLY'),
      action: BOTTOM_DRAWER_CONSTANTS.DELETE,
      icon: <DeleteIcon />,
    },
  ];

  const Mentorbuttons = mentorActions.map(({ label, action, icon }) => ({
    label,
    icon,
    onClick: () => handleButtonClick(action),
  }));

  const reasons = [
    { value: 'Incorrect Data Entry', label: t('COMMON.INCORRECT_DATA_ENTRY') },
    { value: 'Duplicated User', label: t('COMMON.DUPLICATED_USER') },
    { value: 'Resignation', label: t('COMMON.RESIGNATION') },
  ];

  const handleRadioChange = (value: string) => {
    setSelectedValue(value);
    setReason(value);
  };

  const formFields = [
    { type: 'text', label: 'Full Name' },
    { type: 'number', label: 'Contact Number' },
    {
      type: 'radio',
      label: 'Gender',
      options: [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
      ],
    },
    { type: 'number', label: 'Age' },
    { type: 'email', label: "Mentor's Email ID" },
  ];

  const handleOpenNew = () => {
    // setAddNew(true);
    //router.push(`/add-mentor`);
    // setPrefilledAddFormData(initialFormData);
    setOpenModal(true);
    setPrefilledAddFormData({
      state: [selectedStateValue],
      district: [selectedDistrictValue],
    });
    // setIsReassign(false);
    // setEditableUserId('');
  };

  // Function to validate villages selected in working_location for mobilizer
  const validateMobilizerVillagesSelected = (
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

    let workingLocation = userDetails?.working_location;

    if (
      !workingLocation &&
      userDetails?.customFields &&
      Array.isArray(userDetails.customFields)
    ) {
      const workingLocationField = userDetails.customFields.find(
        (field: any) => {
          if (
            field.value &&
            Array.isArray(field.value) &&
            field.value.length > 0
          ) {
            const firstItem = field.value[0];
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
      return {
        isValid: false,
        missingBlocks: [],
        isWorkingLocationMissing: true,
      };
    }
    if (!Array.isArray(workingLocation) || workingLocation.length === 0) {
      return {
        isValid: false,
        missingBlocks: [],
        isWorkingLocationMissing: true,
      };
    }

    let totalBlocks = 0;
    let blocksWithVillages = 0;

    for (const state of workingLocation) {
      if (state.districts && Array.isArray(state.districts)) {
        for (const district of state.districts) {
          if (district.blocks && Array.isArray(district.blocks)) {
            for (const block of district.blocks) {
              totalBlocks++;

              const hasVillages =
                block.villages &&
                Array.isArray(block.villages) &&
                block.villages.length > 0;

              if (hasVillages) {
                blocksWithVillages++;
              } else {
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

    return {
      isValid: missingBlocks.length === 0,
      missingBlocks,
    };
  };

  const extractVillageIdsFromWorkingLocation = (
    workingLocation: any
  ): string[] | null => {
    if (!workingLocation || !Array.isArray(workingLocation)) {
      return null;
    }

    const villageIds: string[] = [];

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

    return villageIds.length > 0 ? villageIds : null;
  };

  const handleOpenMobilizerModal = () => {
    setMobilizerPrefilledState({});
    setMobilizerFormStep(0);
    setSelectedMobilizerUserId(null);
    setMobilizerUserDetails(null);
    setMapModalOpen(true);
  };

  const handleNext = () => {
    // setCount(count + 1)
    setCount((prev) => prev + 1);
  };

  // Mentor delete logic
  const handleDeleteMentor = async () => {
    if (!checked) {
      showToastMessage(t('COMMON.PLEASE_CONFIRM_DELETION'), 'error');
      return;
    }
    if (!reason) {
      showToastMessage(t('COMMON.PLEASE_SELECT_REASON'), 'error');
      return;
    }
    
    try {
      const resp = await deleteUser({
        userId: userID,
        roleId: roleId,
        tenantId: tenantId,
        reason: reason,
      });

      if (resp?.responseCode === 200) {
        setOpen(false);
        setChecked(false);
        setReason('');
        showToastMessage(t('MENTORS.MENTOR_DELETED_SUCCESSFULLY'), 'success');
        await getMobilizersList();
        console.log('Mentor successfully archived.');
      } else {
        console.error('Failed to archive mentor:', resp);
        showToastMessage(t('MENTORS.MENTOR_DELETE_FAIL'), 'error');
      }
    } catch (error) {
      console.error('Error deleting mentor:', error);
      showToastMessage('Error deleting mentor', 'error');
    }
  };

  useEffect(() => {
    if (
      value === 3 &&
      villageList &&
      villageList.length > 0 &&
      !selectedVillageValue
    ) {
      setSelectedVillageValue(villageList?.map((village: any) => village.Id));
    }
  }, [value, villageList, selectedVillageValue]);

  return (
    <Box minHeight="100vh">
      <Box>
        <Header />
      </Box>
      <Box ml={2}>
        <BackHeader headingOne={t('DASHBOARD.VILLAGES_AND_YOUTH')} />
      </Box>
      <Box sx={{ width: '100%' }}>
        {value && (
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="secondary tabs example"
            sx={{
              fontSize: '14px',
              borderBottom: (theme) => `1px solid #EBE1D4`,

              '& .MuiTab-root': {
                color: theme.palette.warning['A200'],
                padding: '0 20px',
                flexGrow: 1,
              },
              '& .Mui-selected': {
                color: theme.palette.warning['A200'],
              },
              '& .MuiTabs-indicator': {
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '100px',
                height: '3px',
              },
              '& .MuiTabs-scroller': {
                overflowX: 'unset !important',
              },
            }}
          >
            {YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && (
              <Tab value={1} label={t('YOUTHNET_USERS_AND_VILLAGES.MENTORS')} />
            )}

            <Tab value={2} label={t('DASHBOARD.VILLAGES')} />
            <Tab value={3} label={t('DASHBOARD.YOUTH_VOLUNTEERS')} />
          </Tabs>
        )}
      </Box>

      <Box>
        {value === 1 && YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && (
          <>
            <Box
              display={'flex'}
              flexDirection={'row'}
              alignItems={'center'}
              sx={{
                pr: '20px',
              }}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('MOBILIZER.SEARCH_MOBILIZERS')}
                fullWidth={true}
              />
              <SortBy
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                sortingContent={Role.MOBILIZER}
              />
            </Box>

            <Box
              mt={'18px'}
              px={'18px'}
              ml={'10px'}
              display={'flex'}
              justifyContent={'flex-end'}
              gap={2}
            >
              <Button
                sx={{
                  border: `1px solid ${theme.palette.error.contrastText}`,
                  borderRadius: '100px',
                  height: '40px',
                  width: '10rem',
                  color: theme.palette.error.contrastText,
                  '& .MuiButton-endIcon': {
                    marginLeft: isRTL ? '0px !important' : '8px !important',
                    marginRight: isRTL ? '8px !important' : '-2px !important',
                  },
                }}
                className="text-1E"
                endIcon={<AddIcon />}
                onClick={handleOpenMobilizerModal}
              >
                {t('COMMON.ADD_MOBILIZER')}
              </Button>
            </Box>

            <Box>
              <Box display={'flex'} justifyContent={'space-between'}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: 'black',
                    margin: '0 20px',
                  }}
                >
                  {mentorCount} {''}
                  {t('YOUTHNET_USERS_AND_VILLAGES.MENTORS')}
                </Typography>

                {/* <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    pr: '20px',
                    color: '#0D599E',
                    '&:hover': {
                      color: '#074d82',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '16px',
                    }}
                  >
                    {t('YOUTHNET_USERS_AND_VILLAGES.CSV')}
                  </Typography>
                  <DownloadIcon />
                </Box> */}
              </Box>
            </Box>
            <Box
              sx={{
                px: '20px',
              }}
            >
              {filteredmentorList.length !== 0 ? (
                <UserList
                  layout="list"
                  users={filteredmentorList.map((user: any) => ({
                    ...user,
                    showMore: true,
                  }))}
                  onUserClick={handleUserClick}
                  onToggleUserClick={handleToggledMentorClick}
                />
              ) : filteredmentorList.length === 0 && !loading ? (
                <>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: theme.palette.warning['300'],
                      marginTop: '10px',
                      marginLeft: '15%',
                    }}
                  >
                    {t('YOUTHNET_USERS_AND_VILLAGES.NO_DATA_FOUND')}
                  </Typography>
                </>
              ) : (
                <Loader showBackdrop={true} />
              )}
            </Box>
            <BottomDrawer
              open={openMentorDrawer}
              onClose={handleToggleClose}
              title={toggledMentor}
              buttons={Mentorbuttons}
            />

            <SimpleModal
              open={open}
              onClose={() => {
                setOpen(false);
                setChecked(false);
                setReason('');
              }}
              showFooter={true}
              modalTitle={t('COMMON.DELETE_USER')}
              primaryText={t('COMMON.DELETE_USER_WITH_REASON')}
              secondaryText={t('COMMON.CANCEL')}
              primaryActionHandler={handleDeleteMentor}
              secondaryActionHandler={() => {
                setOpen(false);
                setChecked(false);
                setReason('');
              }}
            >
              <Box>
                <Box
                  sx={{
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    mb: 2,
                    p: 1,
                  }}
                >
                  <Typography fontWeight="bold">
                    {firstName} {lastName} {availableCenters || village ? t('FORM.BELONG_TO') : t('FORM.WAS_BELONG_TO')}
                  </Typography>
                  <TextField 
                    fullWidth 
                    value={availableCenters || village || ''} 
                    disabled 
                    sx={{ mt: 1 }} 
                    placeholder={availableCenters || village ? '' : 'No center/village assigned'}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                  }
                  label={t('FORM.DO_YOU_WANT_TO_DELETE')}
                  sx={{ mb: checked ? 2 : 0 }}
                />

                {checked && (
                  <Box mt={2}>
                    <Typography sx={{ fontSize: '14px', mb: 1 }}>
                      {t('COMMON.REASON_FOR_DELETION')}
                    </Typography>
                    {reasons.map((option, index) => (
                      <React.Fragment key={index}>
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Typography
                            sx={{
                              color: theme.palette.warning['A200'],
                              fontSize: '16px',
                              fontWeight: 400,
                            }}
                            component="h2"
                          >
                            {option.label}
                          </Typography>
                          <Radio
                            sx={{ pb: '20px' }}
                            onChange={() => setReason(option.value)}
                            value={option.value}
                            checked={reason === option.value}
                          />
                        </Box>
                        {reasons?.length - 1 !== index && <Divider />}
                      </React.Fragment>
                    ))}
                  </Box>
                )}
              </Box>
            </SimpleModal>
            <SimpleModal
              open={openModal}
              onClose={onClose}
              showFooter={buttonShow}
              primaryText={t('Next')}
              id="dynamic-form-id"
              modalTitle={
                isReassign
                  ? t('MENTOR.RE_ASSIGN_VILLAGES')
                  : t('MENTORS.NEW_MENTOR')
              }
            >
              <MentorForm
                t={t}
                SuccessCallback={async () => {
                  setPrefilledFormData({});
                  setOpenModal(false);
                  await getMobilizersList();
                }}
                schema={isReassign ? originalSchema : addSchema}
                uiSchema={isReassign ? originalUiSchema : addUiSchema}
                editPrefilledFormData={prefilledAddFormData}
                isEdit={false}
                isReassign={isReassign}
                editableUserId={editableUserId}
                UpdateSuccessCallback={async () => {
                  setOpenModal(false);
                  await getMobilizersList();
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
                type="mentor"
                hideSubmit={true}
                setButtonShow={setButtonShow}
                sdbvFieldData={originalSchema}
                blockVillageMap={isReassign ? blockVillageMap : {}}
                blockReassignmentNotificationKey={
                  blockReassignmentNotificationKey
                }
                villageReassignmentNotificationKey={
                  villageReassignmentNotificationKey
                }
              />
            </SimpleModal>

            {/* Mobilizer Map Modal Dialog */}
            <Dialog
              open={mapModalOpen}
              onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                  setMapModalOpen(false);
                  setSelectedMobilizerUserId(null);
                  setMobilizerUserDetails(null);
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
                <Typography variant="h1" component="div">
                  {t('MOBILIZER.MAP_USER_AS_MOBILIZER')}
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
                {mobilizerFormStep === 0 && (
                  <Box sx={{ mb: 3 }}>
                    <EmailSearchUser
                      getCatchmentAreaDetails={true}
                      onUserSelected={(userId) => {
                        setSelectedMobilizerUserId(userId || null);
                        console.log('Selected User ID:', userId);
                      }}
                      onUserDetails={async (userDetails) => {
                        console.log('############# userDetails', userDetails);
                        setMobilizerUserDetails(userDetails);

                        if (selectedMobilizerUserId) {
                          const validationResult =
                            validateMobilizerVillagesSelected(userDetails);
                          console.log(
                            '############# validationResult',
                            validationResult
                          );
                          if (!validationResult.isValid) {
                            const missingCount =
                              validationResult.missingBlocks.length;
                            let errorMessage = '';

                            if (missingCount > 0) {
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
                            } else if (
                              validationResult.isWorkingLocationMissing
                            ) {
                              errorMessage = t(
                                'MOBILIZER.WORKING_LOCATION_REQUIRED'
                              );
                            } else {
                              errorMessage = t(
                                'MOBILIZER.WORKING_LOCATION_REQUIRED_AT_LEAST_ONE'
                              );
                            }

                            showToastMessage(errorMessage, 'error');
                            return;
                          }

                          setIsMobilizerMappingInProgress(true);
                          try {
                            const { userData, customFields } =
                              splitUserData(userDetails);

                            delete userData.email;

                            let workingLocationValue =
                              userDetails?.working_location;
                            if (
                              !workingLocationValue &&
                              userDetails?.customFields &&
                              Array.isArray(userDetails.customFields)
                            ) {
                              const workingLocationById = workingLocationId
                                ? userDetails.customFields.find(
                                    (field: any) =>
                                      field.fieldId === workingLocationId
                                  )
                                : null;
                              const workingLocationField =
                                workingLocationById ||
                                userDetails.customFields.find((field: any) => {
                                  if (
                                    field.value &&
                                    Array.isArray(field.value) &&
                                    field.value.length > 0
                                  ) {
                                    const firstItem = field.value[0];
                                    return (
                                      firstItem &&
                                      typeof firstItem === 'object' &&
                                      'stateId' in firstItem &&
                                      'stateName' in firstItem &&
                                      'districts' in firstItem
                                    );
                                  }
                                  return false;
                                });
                              if (workingLocationField?.value) {
                                workingLocationValue =
                                  workingLocationField.value;
                              }
                            }

                            const villageIds =
                              extractVillageIdsFromWorkingLocation(
                                workingLocationValue
                              );

                            const updatedCustomFields = [...customFields];
                            const workingVillageIndex =
                              updatedCustomFields.findIndex(
                                (field: any) =>
                                  field.fieldId === workingVillageId
                              );
                            if (
                              workingVillageId &&
                              villageIds &&
                              villageIds.length > 0
                            ) {
                              if (workingVillageIndex !== -1) {
                                updatedCustomFields[workingVillageIndex].value =
                                  villageIds;
                              } else {
                                updatedCustomFields.push({
                                  fieldId: workingVillageId,
                                  value: villageIds,
                                });
                              }
                            }

                            const mobilizerRoleId =
                              'a4694781-65c1-4b92-8ff1-ad490ab6d140'; // RoleId.MOBILIZER

                            const updateUserResponse = await enrollUserTenant({
                              userId: selectedMobilizerUserId,
                              tenantId: tenantId,
                              roleId: mobilizerRoleId,
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
                              // Get center ID from localStorage (set when cohort data is loaded)
                              const workingLocationCenterId =
                                localStorage.getItem('workingLocationCenterId');

                              // Call bulkCreateCohortMembers to map user to center
                              if (
                                workingLocationCenterId &&
                                selectedMobilizerUserId
                              ) {
                                try {
                                  const cohortMemberResponse =
                                    await bulkCreateCohortMembers({
                                      userId: [selectedMobilizerUserId],
                                      cohortId: [workingLocationCenterId],
                                    });

                                  if (
                                    cohortMemberResponse?.responseCode ===
                                      201 ||
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

                              showToastMessage(
                                t('MOBILIZER.MOBILIZER_CREATED_SUCCESSFULLY'),
                                'success'
                              );

                              setMapModalOpen(false);
                              setSelectedMobilizerUserId(null);
                              setMobilizerUserDetails(null);
                            } else {
                              showToastMessage(
                                t('MOBILIZER.NOT_ABLE_CREATE_MOBILIZER'),
                                'error'
                              );
                            }
                          } catch (error) {
                            console.error('Error creating mobilizer:', error);
                            showToastMessage(
                              error?.response?.data?.params?.errmsg ||
                                t('MOBILIZER.NOT_ABLE_CREATE_MOBILIZER'),
                              'error'
                            );
                          } finally {
                            setIsMobilizerMappingInProgress(false);
                          }
                        } else if (!selectedMobilizerUserId) {
                          showToastMessage(
                            t('MOBILIZER.PLEASE_SEARCH_AND_SELECT_USER'),
                            'error'
                          );
                        }
                      }}
                      schema={mobilizerAddSchema}
                      uiSchema={mobilizerAddUiSchema}
                      prefilledState={mobilizerPrefilledState}
                      onPrefilledStateChange={(prefilledState) => {
                        setMobilizerPrefilledState(prefilledState || {});
                      }}
                      roleId={'a4694781-65c1-4b92-8ff1-ad490ab6d140'} // RoleId.MOBILIZER
                      tenantId={tenantId}
                      type="leader"
                    />
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
                {mobilizerFormStep === 0 && (
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
                    disabled={
                      !selectedMobilizerUserId || isMobilizerMappingInProgress
                    }
                    form="dynamic-form-id"
                    type="submit"
                  >
                    {t('COMMON.MAP')}
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>

      <Box>
        {value === 2 && (
          <>
            {YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && (
              <>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  sx={{
                    p: '20px 20px 0px 20px',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                      mr: '20px',
                    }}
                  >
                    {stateData ? (
                      <Dropdown
                        name={stateData?.STATE_NAME}
                        values={stateData}
                        defaultValue={selectedStateValue || stateData?.[0]?.id}
                        onSelect={(value) => {
                          setSelectedStateValue(value);
                        }}
                        label={t('YOUTHNET_USERS_AND_VILLAGES.STATE')}
                      />
                    ) : (
                      <Loader showBackdrop={true} />
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    {districtData ? (
                      <Dropdown
                        name={districtData?.DISTRICT_NAME}
                        values={districtData}
                        defaultValue={
                          selectedDistrictValue || districtData?.[0]?.id
                        }
                        onSelect={(value) => {
                          setSelectedDistrictValue(value);
                        }}
                        label={t('YOUTHNET_USERS_AND_VILLAGES.DISTRICTS')}
                      />
                    ) : (
                      <Loader showBackdrop={true} />
                    )}
                  </Box>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  sx={{
                    p: '20px 20px 20px 20px',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    {blockData ? (
                      <Dropdown
                        name={blockData?.BLOCK_NAME}
                        values={blockData}
                        defaultValue={selectedBlockValue || blockData?.[0]?.id}
                        onSelect={(value) => {
                          setSelectedBlockValue(value);
                        }}
                        label={t('YOUTHNET_USERS_AND_VILLAGES.BLOCKS')}
                      />
                    ) : (
                      <Loader showBackdrop={true} />
                    )}
                  </Box>
                </Box>
              </>
            )}
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
              alignItems={'center'}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('DASHBOARD.SEARCH_VILLAGES')}
                fullWidth={true}
              />
              <SortBy
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                sortingContent={cohortHierarchy.VILLAGE}
              />
            </Box>
            {/* <Box>
              <YouthAndVolunteers
                selectOptions={[
                  { label: 'As of today, 5th Sep', value: 'today' },
                  { label: 'As of yesterday, 4th Sep', value: 'yesterday' },
                ]}
              />
            </Box> */}
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'black',
                  marginLeft: '2rem',
                  mt: '10px',
                }}
              >
                {villageCount} {t(`YOUTHNET_DASHBOARD.VILLAGES`)}
              </Typography>

              {/* <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  pr: '20px',
                  color: '#0D599E',
                  '&:hover': {
                    color: '#074d82',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: '16px',
                  }}
                >
                  CSV
                </Typography>
                <DownloadIcon />
              </Box> */}
            </Box>
            <Box display={'flex'} mt={2} justifyContent={'space-between'}>
              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'textSecondary',
                  marginLeft: '2rem',
                  pr: '20px',
                }}
                className="one-line-text"
              >
                {t(`YOUTHNET_DASHBOARD.VILLAGES`)}
              </Typography>

              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'textSecondary',
                  pr: '20px',
                }}
              >
                {t(`YOUTHNET_DASHBOARD.TOTAL_COUNT_NEW_REGISTRATION`)}
              </Typography>
            </Box>
            <Box
              sx={{
                pr: '20px',
                mt: '15px',
              }}
            >
              {filteredvillageListWithUsers.length !== 0 ? (
                <UserList
                  layout="list"
                  users={filteredvillageListWithUsers}
                  onUserClick={handleLocationClick}
                />
              ) : filteredvillageListWithUsers.length === 0 && !loading ? (
                <>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: theme.palette.warning['300'],
                      marginTop: '15px',
                      marginLeft: '30%',
                    }}
                  >
                    {t('YOUTHNET_USERS_AND_VILLAGES.NO_DATA_FOUND')}
                  </Typography>
                </>
              ) : (
                <Loader showBackdrop={true} />
              )}
            </Box>
          </>
        )}
      </Box>
      <Box>
        {value === 3 && (
          <>
            {YOUTHNET_USER_ROLE.LEAD === getLoggedInUserRole() && (
              <>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  sx={{
                    p: '20px 20px 0px 20px',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                      mr: '20px',
                    }}
                  >
                    {stateData ? (
                      <Dropdown
                        name={stateData?.STATE_NAME}
                        values={stateData}
                        defaultValue={selectedStateValue || stateData?.[0]?.id}
                        onSelect={(value) => {
                          setSelectedStateValue(value);
                        }}
                        label={t('YOUTHNET_USERS_AND_VILLAGES.STATE')}
                      />
                    ) : (
                      <Loader showBackdrop={true} />
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    {districtData ? (
                      <Dropdown
                        name={districtData?.DISTRICT_NAME}
                        values={districtData}
                        defaultValue={
                          selectedDistrictValue || districtData?.[0]?.id
                        }
                        onSelect={(value) => {
                          setSelectedDistrictValue(value);
                        }}
                        label={t('YOUTHNET_USERS_AND_VILLAGES.DISTRICTS')}
                      />
                    ) : (
                      <Loader showBackdrop={true} />
                    )}
                  </Box>
                </Box>
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  sx={{
                    p: '20px 20px 0px 20px',
                  }}
                >
                  <Box
                    sx={{
                      width: '50%',
                      mr: '20px',
                    }}
                  >
                    {blockData ? (
                      <Dropdown
                        name={blockData?.BLOCK_NAME}
                        values={blockData}
                        defaultValue={selectedBlockValue || blockData?.[0]?.id}
                        onSelect={(value) => {
                          setSelectedBlockValue(value);
                        }}
                        label={t('YOUTHNET_USERS_AND_VILLAGES.BLOCKS')}
                      />
                    ) : (
                      <Loader showBackdrop={true} />
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: '50%',
                    }}
                  >
                    <Dropdown
                      name={DROPDOWN_NAME}
                      values={villageList.map((item: any) =>
                        Array.isArray(item)
                          ? item.map(({ Id, name }) => ({ id: Id, name }))
                          : { id: item.Id, name: item.name }
                      )}
                      defaultValue={selectedVillageValue}
                      onSelect={(value) => {
                        console.log('Selected:', value);
                        setSelectedVillageValue(value);
                      }}
                      label={t('YOUTHNET_USERS_AND_VILLAGES.VILLAGES')}
                    />
                  </Box>
                </Box>
              </>
            )}
            <Box
              display={'flex'}
              flexDirection={'row'}
              sx={{
                pr: '20px',
              }}
              alignItems={'center'}
            >
              <SearchBar
                onSearch={setSearchInput}
                value={searchInput}
                placeholder={t('DASHBOARD.SEARCH_YOUTH')}
                fullWidth={true}
              />
              <SortBy
                appliedFilters={appliedFilters}
                setAppliedFilters={setAppliedFilters}
                sortingContent={Role.LEARNER}
              />{' '}
            </Box>
            <Box
              sx={{
                px: '20px',
                mt: '15px',
              }}
            >
              {filteredyouthList.length !== 0 ? (
                <UserList
                  layout="list"
                  users={filteredyouthList}
                  onUserClick={handleUserClick}
                  onToggleUserClick={handleToggledUserClick}
                  showMore={true}
                />
              ) : filteredyouthList.length === 0 && !loading ? (
                <>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: theme.palette.warning['300'],
                      marginTop: '10%',
                      marginLeft: '25%',
                    }}
                  >
                    {t('YOUTHNET_USERS_AND_VILLAGES.NO_DATA_FOUND')}
                  </Typography>
                </>
              ) : (
                <Loader showBackdrop={true} />
              )}
            </Box>
            <BottomDrawer
              open={openDrawer}
              onClose={handleToggleClose}
              title={toggledUser}
              buttons={buttons}
            />
          </>
        )}
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

export default withRole(TENANT_DATA.YOUTHNET)(Index);
