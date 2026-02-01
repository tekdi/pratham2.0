// @ts-nocheck
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import BottomDrawer from '@/components/BottomDrawer';
import ConfirmationModal from '@/components/ConfirmationModal';
import ManageCentersModal from '@/components/ManageCentersModal';
import ManageUsersModal from '@/components/ManageUsersModal';
import { showToastMessage } from '@/components/Toastify';
import { cohortList, getCohortList } from '@/services/CohortServices';
import {
  getMyCohortFacilitatorList,
  getMyUserList,
} from '@/services/MyClassDetailsService';
import reassignLearnerStore from '@/store/reassignLearnerStore';
import useStore from '@/store/store';
import {
  QueryKeys,
  Role,
  RoleId,
  Status,
  Telemetry,
  FormContext,
  FormContextType,
} from '@/utils/app.constant';
import { fetchUserData, getUserFullName, toPascalCase } from '@/utils/Helper';
import { telemetryFactory } from '@/utils/telemetry';
import AddIcon from '@mui/icons-material/Add';
import ApartmentIcon from '@mui/icons-material/Apartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { setTimeout } from 'timers';
import { useDirection } from '../hooks/useDirection';
import manageUserStore from '../store/manageUserStore';
import CustomPagination from './CustomPagination';
import DeleteUserModal from './DeleteUserModal';
import Loader from './Loader';
import ReassignModal from './ReassignModal';
import SearchBar from './Searchbar';
import SimpleModal from './SimpleModal';
import FacilitatorManage from '@/shared/FacilitatorManage/FacilitatorManage';
import { customFields } from './GeneratedSchemas';
import {
  fetchCohortMemberList,
  bulkCreateCohortMembers,
} from '@/services/CohortService/cohortService';
import EmailSearchUser from '@shared-lib-v2/MapUser/EmailSearchUser';
// import CenterBasedBatchListWidget from '@shared-lib-v2/MapUser/CenterBasedBatchListWidget';
import LMPMultipleBatchListWidget from '@shared-lib-v2/MapUser/LMPMultipleBatchListWidget';
import { enrollUserTenant } from '@shared-lib-v2/MapUser/MapService';
import { splitUserData } from '@/components/DynamicForm/DynamicFormCallback';
import { fetchForm } from '@/components/DynamicForm/DynamicFormCallback';
import { enhanceUiSchemaWithGrid } from '@shared-lib-v2/DynamicForm/components/DynamicFormCallback';
import { HierarchicalSearchUserList } from '@shared-lib-v2/DynamicForm/services/CreateUserService';

interface Cohort {
  cohortId: string;
  parentId: string;
  name: string;
}
interface User {
  name: string;
  userId: string;
  block: string;
}

type CohortsData = {
  [userId: string]: Cohort[];
};
type Anchor = 'bottom';

interface ManageUsersProps {
  reloadState: boolean;
  setReloadState: React.Dispatch<React.SetStateAction<boolean>>;
  cohortData?: any;
  isFromFLProfile?: boolean;
  teacherUserId?: string;
  hideSearch?: boolean;
  isFromCenterDetailPage?: boolean;
}

const ManageUser: React.FC<ManageUsersProps> = ({
  reloadState,
  setReloadState,
  cohortData,
  isFromFLProfile = false,
  teacherUserId,
  hideSearch = false,
  isFromCenterDetailPage = false,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const store = manageUserStore();
  const newStore = useStore();
  const queryClient = useQueryClient();
  const { isRTL } = useDirection();
  const isActiveYear = newStore.isActiveYearSelected;
  const loggedInUserRole = localStorage.getItem('role');
  const tenantId = localStorage.getItem('tenantId') || '';

  const [value, setValue] = React.useState(1);
  const [users, setUsers] = useState<
    {
      name?: string;
      firstName?: string;
      lastName?: string;
      userId: string;
      cohortNames?: string;
      batchNames?: any[];
      customFields?: any[];
    }[]
  >([]);
  const [loading, setLoading] = React.useState(false);
  const [cohortsData, setCohortsData] = useState<CohortsData>();
  const [centersData, setCentersData] = useState<Cohort[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openCentersModal, setOpenCentersModal] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserName, setSelectedUserName] = useState(null);
  const [centers, setCenters] = useState<any>([]);
  const [centerList, setCenterList] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [offset, setOffSet] = useState(0);
  const [infinitePage, setInfinitePage] = useState(1);
  const [infiniteData, setInfiniteData] = useState(users || []);
  const [selectedUserData, setSelectedUserData] = useState(null);

  const [state, setState] = React.useState({
    bottom: false,
  });
  const [confirmationModalOpen, setConfirmationModalOpen] =
    React.useState<boolean>(false);
  const [reassignModalOpen, setReassignModalOpen] =
    React.useState<boolean>(false);

  const [openDeleteUserModal, setOpenDeleteUserModal] = React.useState(false);
  const [isFacilitatorAdded, setIsFacilitatorAdded] = React.useState(false);
  const [openRemoveUserModal, setOpenRemoveUserModal] = React.useState(false);
  const [removeCohortNames, setRemoveCohortNames] = React.useState('');
  const [reassignCohortNames, setReassignCohortNames] = React.useState('');
  const [userId, setUserId] = React.useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const CustomLink = styled(Link)(({ theme }) => ({
    textDecoration: 'underline',
    textDecorationColor: theme?.palette?.secondary.main,
    textDecorationThickness: '1px',
  }));
  const setCohortDeleteId = manageUserStore((state) => state.setCohortDeleteId);
  const [openAddFacilitatorModal, setOpenFacilitatorModal] =
    React.useState(false);
  const setReassignFacilitatorUserId = reassignLearnerStore(
    (state) => state.setReassignFacilitatorUserId
  );

  // New facilitator mapping modal states
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const [myCenterIds, setMyCenterIds] = useState<any>([]);
  const [myCenterList, setMyCenterList] = useState<any[]>([]);
  const [mySelectedCenterId, setMySelectedCenterId] = useState<any>(null);
  const [mySelectedBatchIds, setMySelectedBatchIds] = useState<any>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<any>([]);
  const [selectedCenterList, setSelectedCenterList] = useState<any[]>([]);
  const [selectedBatchList, setSelectedBatchList] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isMappingInProgress, setIsMappingInProgress] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [prefilledState, setPrefilledState] = useState({});
  const [addFacilitatorSchema, setAddFacilitatorSchema] = useState<any>(null);
  const [addFacilitatorUiSchema, setAddFacilitatorUiSchema] =
    useState<any>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedBatchNames, setExpandedBatchNames] = useState<Set<string>>(new Set());
  const [truncatedBatchNames, setTruncatedBatchNames] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users || []);
  const [TotalCount, setTotalCount] = useState<number>(0);
  const [hasMore, setHasMore] = useState(true);
  const [allFacilitatorsData, setAllFacilitatorsData] = useState<any>([]);

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

  //message constants
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

  useEffect(() => {
    if (reloadState) {
      setReloadState(false);
    }
  }, [reloadState, setReloadState]);

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

  // Initialize selected center and batch IDs when myCenterList is populated
  useEffect(() => {
    if (myCenterList && myCenterList.length > 0 && mySelectedCenterId === null) {
      // Select the first center by default
      const storedCenterId = localStorage.getItem('centerId');
      if (storedCenterId) {
        // Check if storedCenterId exists in myCenterList
        const centerExists = myCenterList.find(
          (center: any) => center.value === storedCenterId
        );
        if (centerExists) {
          setMySelectedCenterId(storedCenterId);
        } else {
          // Use first center if stored center doesn't exist
          const firstCenter = myCenterList[0];
          const firstCenterId = firstCenter.value;
          if (firstCenterId) {
            localStorage.setItem('centerId', firstCenterId);
          }
          setMySelectedCenterId(firstCenterId);
        }
      }
      else {
        const firstCenter = myCenterList[0];
        const firstCenterId = firstCenter.value;
        if (firstCenterId) {
          localStorage.setItem('centerId', firstCenterId);
        }
        setMySelectedCenterId(firstCenterId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myCenterList]);

  useEffect(() => {
    if (mySelectedCenterId) {
      // Find the selected center from myCenterList
      const selectedCenter = myCenterList.find(
        (center: any) => (center.value || center.cohortId) === mySelectedCenterId
      );
      if (selectedCenter) {
        // Extract active batch IDs from childData
        const activeBatchIds = (selectedCenter.childData || [])
          .filter((child: any) => child.status === 'active')
          .map((child: any) => child.cohortId);

        setMySelectedBatchIds(activeBatchIds);
        setOffSet(0);
        setPage(1);
      } else {
        setMySelectedBatchIds([]);
        setOffSet(0);
        setPage(1);
      }
    }
    else {
      setMySelectedBatchIds([]);
      setOffSet(0);
      setPage(1);
    }
  }, [mySelectedCenterId]);

  // Fetch facilitator form schema
  useEffect(() => {
    const fetchFacilitatorFormSchema = async () => {
      const responseForm: any = await fetchForm([
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.USERS}&contextType=${FormContextType.TEACHER}`,
          header: {},
        },
        {
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/form/read?context=${FormContext.USERS}&contextType=${FormContextType.TEACHER}`,
          header: {
            tenantid: localStorage.getItem('tenantId'),
          },
        },
      ]);

      if (responseForm?.schema && responseForm?.uiSchema) {
        let alterSchema = responseForm?.schema;
        let alterUISchema = responseForm?.uiSchema;

        // Disable certain fields
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
        if (alterUISchema?.designation) {
          alterUISchema = {
            ...alterUISchema,
            designation: {
              ...alterUISchema.designation,
              'ui:disabled': true,
            },
          };
        }

        // Remove duplicates from required array
        let requiredArray = alterSchema?.required;
        if (Array.isArray(requiredArray)) {
          requiredArray = Array.from(new Set(requiredArray));
        }
        alterSchema.required = requiredArray;

        //set 2 grid layout
        alterUISchema = enhanceUiSchemaWithGrid(alterUISchema);

        setAddFacilitatorSchema(alterSchema);
        setAddFacilitatorUiSchema(alterUISchema);
      }
    };

    fetchFacilitatorFormSchema();
  }, []);

  // Helper function to extract all batch IDs from the centers structure
  const extractBatchIds = (centersStructure: any): string[] => {
    return centersStructure;
    const batchIds: string[] = [];

    if (!centersStructure || !Array.isArray(centersStructure)) {
      return batchIds;
    }

    // New structure: SelectedCenter[] with nested batches
    centersStructure.forEach((center: any) => {
      if (center?.batches && Array.isArray(center.batches)) {
        center.batches.forEach((batch: any) => {
          if (batch?.id) {
            batchIds.push(String(batch.id));
          }
        });
      }
    });

    return batchIds;
  };

  // Helper function to check if at least one batch is selected across all centers
  const hasAtLeastOneBatchSelected = (centersStructure: any): boolean => {
    if (!centersStructure || !Array.isArray(centersStructure)) {
      return false;
    }

    // Check if ALL selected centers have at least one batch selected
    return centersStructure.every((center: any) => {
      return (
        center?.batches &&
        Array.isArray(center.batches) &&
        center.batches.length > 0
      );
    });
  };

  // Helper function to transform cohorts array into cohortData format
  const transformCohortsToCohortData = (cohorts: any[]): any[] => {
    if (!cohorts || !Array.isArray(cohorts)) {
      return [];
    }

    return cohorts.map((cohort: any) => (cohort));
  };

  useEffect(() => {
    const fetchFacilitators = async () => {
        const bodyPayload = {
          limit: 100,
          offset: 0,
          role: [Role.TEACHER],
          tenantStatus: [Status.ACTIVE],
          filters: {
            batch: [cohortData],
            status: [Status.ACTIVE],
          },
          customfields: [
            'state',
            'district',
            'block',
            'village',
            'main_subject',
            'subject_taught',
          ],
          sort: [
            "firstName",
            "asc"
          ]
        };
        // const test = isMobile ? infinitePage : page
        const resp = await HierarchicalSearchUserList(bodyPayload);
        // const resp = await queryClient.fetchQuery({
        //   // queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR, filters],
        //   queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR],
        //   queryFn: () => getMyUserList({ limit, page, filters, fields }),
        // });

      if (resp?.getUserDetails) {
        let facilitatorList = resp?.getUserDetails;
        if (!facilitatorList || facilitatorList?.length === 0) {
          console.log('No users found.');
          return;
        }
        
        const extractedData = facilitatorList?.map(
          (user: any, index: number) => {
            // Extract batch names from cohortData
            const batchNames = (user?.cohortData || [])
              .filter(
                (item: any) =>
                  item.batchStatus === 'active' &&
                  item.cohortMember?.status === 'active' &&
                  item.centerStatus === 'active'
              )
              .map((item: any) => toPascalCase(item.batchName));

            // Extract unique center names based on centerId where centerStatus is active
            const uniqueCentersMap = new Map<string, string>();
            (user?.cohortData || [])
              .filter((item: any) => item.centerStatus === 'active' && item.cohortMember?.status === 'active' && item.batchStatus === 'active')
              .forEach((item: any) => {
                if (!uniqueCentersMap.has(item.centerId)) {
                  uniqueCentersMap.set(item.centerId, item.centerName);
                }
              });

            const cohortNames = Array.from(uniqueCentersMap.values())
              .map((centerName: string) => toPascalCase(centerName))
              .join(', ');

            return {
              userId: user?.userId,
              name: toPascalCase(
                getUserFullName({
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  name: user?.name,
                })
              ),
              cohortNames: cohortNames || null,
              batchNames: batchNames || null,
              customFields: user?.customfield,
              cohorts: user?.cohortData,
            };
          }
        );

        setFilteredUsers(extractedData);
      }
    };
    if (isFromCenterDetailPage) {
      fetchFacilitators();
    } else {
      //removeed this as center id can fetch facilitators
    }
  }, [
    isFacilitatorAdded,
    reloadState,
    page,
    infinitePage,
    isFromCenterDetailPage,
  ]);

  useEffect(() => {
    const getFacilitator = async () => {
      if (!isMobile) {
        setLoading(true);
      }
      try {
        const limit = 10;
        const page = offset;

        const bodyPayload = {
          limit: limit,
          offset: page,
          role: [Role.TEACHER],
          tenantStatus: [Status.ACTIVE],
          filters: {
            batch: mySelectedBatchIds,
          },
          customfields: [
            'state',
            'district',
            'block',
            'village',
            'main_subject',
            'subject_taught',
          ],
          sort: [
            "firstName",
            "asc"
          ]
        };
        // const test = isMobile ? infinitePage : page
        const resp = await HierarchicalSearchUserList(bodyPayload);
        // const resp = await queryClient.fetchQuery({
        //   // queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR, filters],
        //   queryKey: [QueryKeys.GET_ACTIVE_FACILITATOR],
        //   queryFn: () => getMyUserList({ limit, page, filters, fields }),
        // });
        const facilitatorList = resp?.getUserDetails;
        setAllFacilitatorsData(facilitatorList);

        setTotalCount(resp?.totalCount);

        if (!facilitatorList || facilitatorList?.length === 0) {
          setLoading(false);
          console.log('No users found.');
          return;
        }

        const extractedData = facilitatorList?.map(
          (user: any, index: number) => {
            // Extract batch names from cohortData
            const batchNames = (user?.cohortData || [])
              .filter(
                (item: any) =>
                  item.batchStatus === 'active' &&
                  item.cohortMember?.status === 'active' &&
                  item.centerStatus === 'active'
              )
              .map((item: any) => toPascalCase(item.batchName));

            // Extract unique center names based on centerId where centerStatus is active
            const uniqueCentersMap = new Map<string, string>();
            (user?.cohortData || [])
              .filter((item: any) => item.centerStatus === 'active' && item.cohortMember?.status === 'active' && item.batchStatus === 'active')
              .forEach((item: any) => {
                if (!uniqueCentersMap.has(item.centerId)) {
                  uniqueCentersMap.set(item.centerId, item.centerName);
                }
              });

            const cohortNames = Array.from(uniqueCentersMap.values())
              .map((centerName: string) => toPascalCase(centerName))
              .join(', ');

            return {
              userId: user?.userId,
              name: toPascalCase(
                getUserFullName({
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  name: user?.name,
                })
              ),
              cohortNames: cohortNames || null,
              batchNames: batchNames || null,
              customFields: user?.customfield,
              cohorts: user?.cohortData,
            };
          }
        );

        setUsers(extractedData);
        setLoading(false);
        if (isMobile) {
          setInfiniteData([...infiniteData, ...extractedData]);
        } else {
          setFilteredUsers(extractedData);
          setInfiniteData(extractedData);
        }

        setTimeout(() => {
          setUsers(extractedData);
          setFilteredUsers(extractedData);
          setLoading(false);
        }, 50);

      } catch (error) {
        console.log(error);
        // showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
        setLoading(false);
      }
      finally {
        setLoading(false);
      }
    };
    if(isFromCenterDetailPage===false){
    if (mySelectedBatchIds && mySelectedBatchIds.length > 0) {
      getFacilitator();
    } else {
      setUsers([]);
      setFilteredUsers([]);
      setInfiniteData([]);
    }
  }
  }, [mySelectedBatchIds, offset, isFacilitatorAdded]);

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
    setOpenDeleteUserModal(false);
    setState({ ...state, bottom: false });
  };

  const handleCloseReassignModal = () => {
    setReassignModalOpen(false);
  };

  const handleCloseRemoveModal = () => {
    setOpenRemoveUserModal(false);
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean, user?: any, teacherUserId?: string) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        setCohortDeleteId(isFromFLProfile ? teacherUserId : user.userId);
        if (!isFromFLProfile) {
          const cohortNamesArray = user?.cohortNames?.split(', ');
          const centerNames = cohortNamesArray?.map((cohortName: string) =>
            cohortName.trim()
          ) || [t('ATTENDANCE.NO_CENTERS_ASSIGNED')];
          setCenters(centerNames);
          fieldName: setSelectedUser(user);
        }

        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState({ ...state, bottom: open });
      };

  const listItemClick = async (event: React.MouseEvent, name: string) => {
    if (name === 'delete-User') {
      const userId = isFromFLProfile ? teacherUserId : store?.deleteId;
      setUserId(userId);

      const cohortList = await getCohortList(userId);

      const hasActiveCohorts =
        cohortList &&
        cohortList.length > 0 &&
        cohortList.some(
          (cohort: { cohortStatus: string }) =>
            cohort.cohortStatus === Status.ACTIVE
        );

      if (hasActiveCohorts) {
        const cohortNames = cohortList
          .filter(
            (cohort: { cohortStatus: string }) =>
              cohort.cohortStatus === Status.ACTIVE
          )
          .map((cohort: { cohortName: string }) => cohort.cohortName)
          .join(', ');

        setOpenRemoveUserModal(true);
        setRemoveCohortNames(cohortNames);

        const telemetryInteract = {
          context: {
            env: 'teaching-center',
            cdata: [],
          },
          edata: {
            id: 'click-on-delete-user:' + userId,
            type: Telemetry.CLICK,
            subtype: '',
            pageid: 'centers',
          },
        };
        telemetryFactory.interact(telemetryInteract);
      } else {
        console.log(
          'User does not belong to any cohorts, proceed with deletion'
        );
        setOpenDeleteUserModal(true);
      }
    }
    if (name === 'reassign-block') {
      //TODO: Add reassign logic here
      const reassignuserId = isFromFLProfile
        ? teacherUserId
        : selectedUser?.userId;

      //reassign data fetch code

      setReassignModalOpen(true);
      setSelectedCenterIdReassign(null); // Reset center selection when dialog closes
      setOriginalCenterIdReassign(null); // Reset original center selection when dialog closes
      setSelectedCenterListReassign([]); // Reset center list when dialog closes
      setSelectedBatchListReassign([]); // Reset batch list when dialog closes
      setSelectedUserIdReassign(null); // Reset user selection when dialog closes
      setIsReassignModelProgress(true);

      //load prefilled value
      //call geographical data api
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };
      const userId = reassignuserId;
      // Transform cohorts to cohortData format
      const cohortData = selectedUser?.cohorts
        ? transformCohortsToCohortData(selectedUser.cohorts)
        : [];
      setSelectedUserIdReassign(userId);
      const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/geographical-hierarchy/${userId}`;
      const response = await axios.get(apiUrl, { headers });
      const geographicalData = response?.data?.result || [];

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
                const cohortCenterBatch = cohortData?.find(
                  (item: any) => item?.centerId === center.centerId && item?.batchId === batch.batchId
                );
                const isActiveCenterBatch =
                  cohortCenterBatch?.cohortMember?.status === 'active' && cohortCenterBatch?.centerStatus === 'active' && cohortCenterBatch?.batchStatus === 'active';

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
          id: 'click-on-reassign-centers:' + userId,
          type: Telemetry.CLICK,
          subtype: '',
          pageid: 'centers',
        },
      };
      telemetryFactory.interact(telemetryInteract);
    }
    if (name === 'reassign-centers') {
      setOpenCentersModal(true);
      getTeamLeadersCenters();
    }
    if (name === 'reassign-block-request') {
      // setReassignModalOpen(true);
      getTeamLeadersCenters();
    }
  };

  const handleCloseCentersModal = () => {
    setOpenCentersModal(false);
  };

  const getTeamLeadersCenters = async () => {
    const parentId = localStorage.getItem('classId');
    setLoading(true);
    try {
      if (parentId) {
        const limit = 0;
        const offset = 0;
        const filters = { parentId: [parentId] };
        const resp = await cohortList({ limit, offset, filters });

        const extractedNames = resp?.results?.cohortDetails;
        // localStorage.setItem('parentCohortId', extractedNames?.[0].parentId);

        const filteredData = extractedNames
          ?.map((item: any) => ({
            cohortId: item?.cohortId,
            parentId: item?.parentId,
            name: item?.name,
          }))
          ?.filter(Boolean);
        setCentersData(filteredData);
        if (filteredData && Array.isArray(filteredData)) {
          const teamLeaderCenters = filteredData?.map((center) => center?.name);
          setCenterList(teamLeaderCenters.concat(centers));
        }
      }
    } catch (error) {
      console.log(error);
      // showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  const handleAssignCenters = async (selectedCenters: any) => {
    handleCloseCentersModal();
    showToastMessage(
      t('MANAGE_USERS.CENTERS_ASSIGNED_SUCCESSFULLY'),
      'success'
    );
    try {
      const selectedUserIds = [selectedUser?.userId];

      const matchedCohortIdsFromCohortsData = Object.values(cohortsData!)
        .flat()
        .filter((cohort) => selectedCenters?.includes(cohort?.name))
        .map((cohort) => cohort?.cohortId);

      const matchedCohortIdsFromCentersData = centersData
        .filter((center) => selectedCenters?.includes(center?.name))
        .map((center) => center?.cohortId);

      const matchedCohortIds = Array.from(
        new Set([
          ...matchedCohortIdsFromCohortsData,
          ...matchedCohortIdsFromCentersData,
        ])
      );
    } catch (error) {
      console.error('Error assigning centers:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };

  const handleTeacherFullProfile = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  const handleRequestBlockAction = () => {
    showToastMessage(t('BLOCKS.REASSIGN_BLOCK_REQUESTED'), 'success');

    setState({ ...state, bottom: false });

    const telemetryInteract = {
      context: {
        env: 'teaching-center',
        cdata: [],
      },
      edata: {
        id: 'reassign-block-request-success',
        type: Telemetry.CLICK,
        subtype: '',
        pageid: 'centers',
      },
    };
    telemetryFactory.interact(telemetryInteract);
  };

  const handleOpenAddFaciModal = () => {
    setPrefilledState({});
    setFormStep(0);
    setSelectedUserId(null);
    setUserDetails(null);
    setSelectedCenterId(null);
    setSelectedCenterList(null);
    setSelectedBatchList(null);
    setMapModalOpen(true);
  };

  const handleCloseAddFaciModal = () => {
    setMapModalOpen(false);
    setSelectedCenterId(null);
    setSelectedCenterList(null);
    setSelectedBatchList(null);
    setSelectedUserId(null);
    setUserDetails(null);
    setFormStep(0);
  };

  const handleDeleteUser = () => { };

  const handleFacilitatorAdded = () => {
    setIsFacilitatorAdded((prev) => !prev);
  };
  const handleMenuOpen = (event: any, user?: any) => {
    setAnchorEl(event.currentTarget);

    if (user) {
      setCohortDeleteId(isFromFLProfile ? teacherUserId : user.userId);

      if (!isFromFLProfile) {
        setSelectedUser(user);
      }
    }
  };

  const getCohortNames = (cohortNames: string) => {
    const cohorts = cohortNames.split(', ');
    if (cohorts.length > 2) {
      const names = `${cohorts[0]}, ${cohorts[1]}`;
      return (
        <>
          {names}
          {'  '}
          <span style={{ fontWeight: 400 }}>
            {t('COMMON.AND_COUNT_MORE', { count: cohorts.length - 2 })}
          </span>
        </>
      );
    }
    return cohortNames;
  };

  const getBatchNames = (batchNames: any) => {
    if (!Array.isArray(batchNames)) return null;
    return batchNames.join(', ');
  };

  const toggleBatchNamesExpanded = (userId: string) => {
    setExpandedBatchNames((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
        // When collapsing, let the ref callback check if it's still truncated
      } else {
        newSet.add(userId);
        // When expanding, remove from truncated set since it's now fully visible
        setTruncatedBatchNames((prevTruncated) => {
          const newTruncatedSet = new Set(prevTruncated);
          newTruncatedSet.delete(userId);
          return newTruncatedSet;
        });
      }
      return newSet;
    });
  };

  const handleSearch = (searchTerm: string) => {
    const term = searchTerm;
    setSearchTerm(term);
    setFilteredUsers(
      users?.filter((user) => user?.name?.toLowerCase()?.includes(term))
    );
  };

  const handleCenterChange = (event: any) => {
    setPage(1);
    setOffSet(0);
    setUsers([]);
    setFilteredUsers([]);
    setInfiniteData([]);
    const selectedCenterId = event.target.value;
    setMySelectedCenterId(selectedCenterId);
    localStorage.setItem('centerId', selectedCenterId);
  };
  const PAGINATION_CONFIG = {
    ITEMS_PER_PAGE: 10,
    INFINITE_SCROLL_INCREMENT: 10,
  };

  const fetchData = async () => {
    if (infiniteData && infiniteData.length >= TotalCount) {
      return;
    }
    try {
      setOffSet((prev) => {
        if (
          TotalCount &&
          prev + PAGINATION_CONFIG.ITEMS_PER_PAGE <= TotalCount
        ) {
          return prev + PAGINATION_CONFIG.ITEMS_PER_PAGE;
        }
        return prev;
      });

      setInfinitePage(
        (prev) => prev + PAGINATION_CONFIG.INFINITE_SCROLL_INCREMENT
      );
    } catch (error) {
      console.error('Error fetching more data:', error);
      showToastMessage(t('COMMON.SOMETHING_WENT_WRONG'), 'error');
    }
  };
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setOffSet((newPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE);
  };

  return (
    <div>
      <Box>
        {value === 1 && (
          <>
            {!isFromFLProfile && isActiveYear && (
              <Grid
                px={'18px'}
                spacing={2}
                mt={1}
                sx={{ display: 'flex', alignItems: 'center', direction: 'row' }}
                container
              >
                {!hideSearch && (
                  <SearchBar
                    onSearch={handleSearch}
                    value={searchTerm}
                    placeholder={t('COMMON.SEARCH_FACILITATORS')}
                  />
                )}
                {isFromCenterDetailPage ? null : (
                  <Box
                    mt={'18px'}
                    px={'18px'}
                    ml={'10px'}
                    sx={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Button
                      sx={{
                        border: `1px solid ${theme.palette.error.contrastText}`,
                        borderRadius: '100px',
                        height: '40px',
                        minWidth: '8rem',
                        color: theme.palette.error.contrastText,
                        '& .MuiButton-endIcon': {
                          marginLeft: isRTL
                            ? '0px !important'
                            : '8px !important',
                          marginRight: isRTL
                            ? '8px !important'
                            : '-2px !important',
                        },
                        flex: myCenterList && myCenterList.length > 0 ? '0 0 auto' : '1 1 auto',
                      }}
                      className="text-1E"
                      onClick={handleOpenAddFaciModal}
                      endIcon={<AddIcon />}
                    >
                      {t('COMMON.MAP')}
                    </Button>
                    {myCenterList && myCenterList.length > 0 && (
                      <Box sx={{ flex: '1 1 auto', minWidth: '200px' }}>
                        <FormControl fullWidth>
                          <InputLabel id="center-select-label">
                            {t('COMMON.SELECT_CENTER')}
                          </InputLabel>
                          <Select
                            labelId="center-select-label"
                            id="center-select"
                            value={mySelectedCenterId || ''}
                            label={t('COMMON.SELECT_CENTER')}
                            onChange={handleCenterChange}
                            sx={{
                              borderRadius: '8px',
                              height: '40px',
                            }}
                          >
                            {[...myCenterList]
                              .sort((a: any, b: any) =>
                                (a.label || '').localeCompare(b.label || '', undefined, { sensitivity: 'base' })
                              )
                              .map((center: any) => (
                                <MenuItem
                                  key={center.value}
                                  value={center.value}
                                >
                                  {(center.label)
                                    .split(' ')
                                    .map((word: string) =>
                                      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                                    )
                                    .join(' ')}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
            )}

            <Box>
              {isFromFLProfile ? (
                <MoreVertIcon
                  onClick={(event) => {
                    isMobile
                      ? toggleDrawer('bottom', true, teacherUserId)(event)
                      : handleMenuOpen(event, teacherUserId);
                  }}
                  sx={{
                    fontSize: '24px',
                    marginTop: '1rem',
                    color: theme.palette.warning['300'],
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <Box px={'18px'} mt={3}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '20px',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '15px',
                    }}
                  >
                    <Box
                      sx={{
                        gap: '15px',
                        alignItems: 'center',
                        '@media (min-width: 600px)': {
                          background: theme.palette.action.selected,
                          padding: '20px',
                          borderRadius: '12px',
                        },
                      }}
                      width={'100%'}
                    >
                      {loading ? (
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Loader
                            showBackdrop={false}
                            loadingText={t('COMMON.LOADING')}
                          />
                        </Box>
                      ) : isFromCenterDetailPage ? (
                        <>
                          <Box>
                            <Grid container spacing={2} >
                              {filteredUsers?.length > 0 ? (
                                filteredUsers?.map((user) => (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={4}
                                    key={user.userId}
                                  >
                                    <Box
                                      display={'flex'}
                                      borderBottom={`1px solid ${theme.palette.warning['A100']}`}
                                      width={'100%'}
                                      justifyContent={'space-between'}
                                      sx={{
                                        cursor: 'pointer',
                                        '@media (min-width: 600px)': {
                                          border: `1px solid  ${theme.palette.action.selected}`,
                                          padding: '4px 10px',
                                          borderRadius: '8px',
                                          background:
                                            theme.palette.warning['A400'],
                                        },
                                      }}
                                    >
                                      <Box
                                        display="flex"
                                        alignItems="center"
                                        gap="5px"
                                      >
                                        <Box>
                                          <CustomLink
                                            className="word-break"
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                          >
                                            <Typography
                                              onClick={() => {
                                                handleTeacherFullProfile(
                                                  user?.userId
                                                );
                                              }}
                                              sx={{
                                                textAlign: 'left',
                                                fontSize: '16px',
                                                fontWeight: '400',
                                                marginTop: '5px',
                                                color:
                                                  theme.palette.secondary.main,
                                              }}
                                            >
                                              {`${user?.name}`}
                                            </Typography>
                                          </CustomLink>
                                          {/* Uncomment if batchnames to be displayed */}
                                          <Box
                                            sx={{
                                              backgroundColor:
                                                theme.palette.action.selected,
                                              padding: '5px',
                                              width: 'fit-content',
                                              borderRadius: '5px',
                                              fontSize: '12px',
                                              fontWeight: '600',
                                              color: 'black',
                                              marginBottom: '10px',
                                            }}
                                          >
                                            {user?.batchNames?.length > 0
                                              ? getBatchNames(user.batchNames)
                                              : t(
                                                'ATTENDANCE.NO_BATCHES_ASSIGNED'
                                              )}
                                          </Box>
                                        </Box>
                                      </Box>
                                      <Box>
                                        <MoreVertIcon
                                          onClick={(event) => {
                                            isMobile
                                              ? toggleDrawer(
                                                'bottom',
                                                true,
                                                user
                                              )(event)
                                              : handleMenuOpen(event, user);
                                          }}
                                          sx={{
                                            fontSize: '24px',
                                            marginTop: '1rem',
                                            color: theme.palette.warning['300'],
                                            cursor: 'pointer',
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </Grid>
                                ))
                              ) : (
                                <Box
                                  sx={{
                                    m: '1.125rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  <Typography
                                    style={{
                                      width: '100%',
                                      textAlign: 'center',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {t('COMMON.NO_DATA_FOUND')}
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box>
                            <Grid container spacing={2} >
                              {(
                                isMobile
                                  ? infiniteData.length > 0
                                  : filteredUsers.length > 0
                              ) ? (
                                (isMobile ? infiniteData : filteredUsers).map(
                                  (user) => (
                                    <Grid
                                      item
                                      xs={12}
                                      sm={12}
                                      md={6}
                                      lg={4}
                                      key={user.userId}
                                      sx={{ display: 'flex' }}
                                    >
                                      <Box
                                        display={'flex'}
                                        flexDirection={'column'}
                                        borderBottom={`1px solid ${theme.palette.warning['A100']}`}
                                        width={'100%'}
                                        justifyContent={'space-between'}
                                        sx={{
                                          cursor: 'pointer',
                                          height: '100%',
                                          '@media (min-width: 600px)': {
                                            border: `1px solid  ${theme.palette.action.selected}`,
                                            padding: '4px 10px',
                                            borderRadius: '8px',
                                            background:
                                              theme.palette.warning['A400'],
                                          },
                                        }}
                                      >
                                        <Box
                                          display="flex"
                                          alignItems="flex-start"
                                          gap="5px"
                                          flex={1}
                                        >
                                          <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <CustomLink
                                              className="word-break"
                                              href="#"
                                              onClick={(e) =>
                                                e.preventDefault()
                                              }
                                            >
                                              <Typography
                                                onClick={() => {
                                                  handleTeacherFullProfile(
                                                    user?.userId
                                                  );
                                                }}
                                                sx={{
                                                  textAlign: 'left',
                                                  fontSize: '16px',
                                                  fontWeight: '400',
                                                  marginTop: '5px',
                                                  color:
                                                    theme.palette.secondary
                                                      .main,
                                                }}
                                              >
                                                {user?.name}
                                              </Typography>
                                            </CustomLink>
                                            <Box
                                              sx={{
                                                backgroundColor:
                                                  theme.palette.action.selected,
                                                padding: '5px',
                                                width: 'fit-content',
                                                maxWidth: '100%',
                                                borderRadius: '5px',
                                                fontSize: '12px',
                                                fontWeight: '600',
                                                color: 'black',
                                                marginBottom: '10px',
                                                position: 'relative',
                                              }}
                                            >
                                              <Box
                                                ref={(el: HTMLElement | null) => {
                                                  if (!el) return;

                                                  // Use requestAnimationFrame to ensure styles are applied
                                                  requestAnimationFrame(() => {
                                                    if (!expandedBatchNames.has(user.userId)) {
                                                      // Check if content is actually truncated
                                                      const isTruncated = el.scrollHeight > el.clientHeight;
                                                      setTruncatedBatchNames((prev) => {
                                                        const newSet = new Set(prev);
                                                        if (isTruncated) {
                                                          newSet.add(user.userId);
                                                        } else {
                                                          newSet.delete(user.userId);
                                                        }
                                                        return newSet;
                                                      });
                                                    } else {
                                                      // When expanded, remove from truncated set
                                                      setTruncatedBatchNames((prev) => {
                                                        const newSet = new Set(prev);
                                                        newSet.delete(user.userId);
                                                        return newSet;
                                                      });
                                                    }
                                                  });
                                                }}
                                                sx={{
                                                  display: '-webkit-box',
                                                  WebkitLineClamp: expandedBatchNames.has(user.userId) ? 'none' : 4,
                                                  WebkitBoxOrient: 'vertical',
                                                  overflow: expandedBatchNames.has(user.userId) ? 'visible' : 'hidden',
                                                  wordBreak: 'break-word',
                                                }}
                                              >
                                                {user?.batchNames?.length > 0
                                                  ? getBatchNames(user.batchNames)
                                                  : t(
                                                    'ATTENDANCE.NO_BATCHES_ASSIGNED'
                                                  )}
                                              </Box>
                                              {user?.batchNames?.length > 0 &&
                                                getBatchNames(user.batchNames) &&
                                                truncatedBatchNames.has(user.userId) && (
                                                  <Typography
                                                    onClick={() => toggleBatchNamesExpanded(user.userId)}
                                                    sx={{
                                                      fontSize: '11px',
                                                      fontWeight: '600',
                                                      color: theme.palette.secondary.main,
                                                      cursor: 'pointer',
                                                      marginTop: '4px',
                                                      textDecoration: 'underline',
                                                    }}
                                                  >
                                                    {expandedBatchNames.has(user.userId) ? 'Show less' : 'Show more'}
                                                  </Typography>
                                                )}
                                            </Box>
                                          </Box>
                                        </Box>
                                        <Box sx={{ alignSelf: 'flex-end' }}>
                                          <MoreVertIcon
                                            onClick={(event) => {
                                              isMobile
                                                ? toggleDrawer(
                                                  'bottom',
                                                  true,
                                                  user
                                                )(event)
                                                : handleMenuOpen(event, user);
                                            }}
                                            sx={{
                                              fontSize: '24px',
                                              marginTop: '1rem',
                                              color:
                                                theme.palette.warning['300'],
                                              cursor: 'pointer',
                                            }}
                                          />
                                        </Box>
                                      </Box>
                                    </Grid>
                                  )
                                )
                              ) : (
                                <Box
                                  sx={{
                                    m: '1.125rem',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '100%',
                                  }}
                                >
                                  <Typography
                                    style={{
                                      width: '100%',
                                      textAlign: 'center',
                                      fontWeight: '500',
                                    }}
                                  >
                                    {t('COMMON.NO_DATA_FOUND')}
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                          </Box>
                          {(
                            isMobile
                              ? infiniteData?.length > 0
                              : filteredUsers?.length > 0
                          )
                            && (
                              <Box
                                sx={{
                                  mt: 2,
                                  display: 'flex',
                                  justifyContent: 'end',
                                }}
                              >
                                <CustomPagination
                                  count={Math.ceil(
                                    TotalCount / PAGINATION_CONFIG.ITEMS_PER_PAGE
                                  )}
                                  page={page}
                                  onPageChange={handlePageChange}
                                  fetchMoreData={() => fetchData()}
                                  hasMore={hasMore}
                                  TotalCount={TotalCount}
                                  items={infiniteData.map((user) => (
                                    <Box key={user.userId}></Box>
                                  ))}
                                />
                              </Box>
                            )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Box>
              )}

              <ManageUsersModal
                open={open}
                onClose={handleClose}
                leanerName={selectedUserName ?? ''}
                blockName={selectedUser?.block ?? ''}
                centerName={centers}
              />
              <BottomDrawer
                toggleDrawer={toggleDrawer}
                state={state}
                listItemClick={listItemClick}
                setAnchorEl={setAnchorEl}
                anchorEl={anchorEl}
                isMobile={isMobile}
                optionList={[
                  // TODO

                  {
                    label: t('COMMON.REASSIGN_BATCH'),
                    icon: (
                      <ApartmentIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'reassign-block',
                  },
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
                    label: t('COMMON.DELETE_USER'),
                    icon: (
                      <DeleteOutlineIcon
                        sx={{ color: theme.palette.warning['300'] }}
                      />
                    ),
                    name: 'delete-User',
                  },
                ].filter((option) => {
                  if (option.name === 'reassign-block') {
                    return loggedInUserRole === Role.TEAM_LEADER; // Only show Reassign Batch if user is TL
                  }
                  if (isFromFLProfile) {
                    return (
                      option.name !== 'reassign-block' &&
                      option.name !== 'reassign-block-request'
                    );
                  }
                  return true;
                })}
              >
                <Box
                  sx={{
                    fontSize: '16px',
                    fontWeight: 300,
                    marginLeft: '20px',
                    marginBottom: '10px',
                    color: theme.palette.warning['400'],
                  }}
                >
                  {selectedUser?.name
                    ? selectedUser.name.charAt(0).toUpperCase() +
                    selectedUser.name.slice(1)
                    : ''}
                </Box>
                <Box
                  bgcolor={theme.palette.success.contrastText}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="left"
                  margin={'0rem 0.7rem 0rem 0.7rem'}
                  padding={'1rem'}
                  borderRadius={'1rem'}
                >
                  <Box
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500,
                      color: theme.palette.warning['400'],
                    }}
                  >
                    {t('COMMON.CENTERS_ASSIGNED', {
                      block: newStore.block,
                    })}
                  </Box>
                  <Box>
                    {centers.length > 0 &&
                      centers.map((name: string) => (
                        <Button
                          key={name}
                          sx={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: `1px solid ${theme.palette.warning[900]}`,
                            margin: '5px',
                          }}
                          className="text-dark-grey"
                        >
                          {name}
                        </Button>
                      ))}
                  </Box>
                </Box>
              </BottomDrawer>

              {openCentersModal && (
                <ManageCentersModal
                  open={openCentersModal}
                  onClose={handleCloseCentersModal}
                  centersName={centerList}
                  centers={centers}
                  onAssign={handleAssignCenters}
                />
              )}
            </Box>

            {confirmationModalOpen && (
              <ConfirmationModal
                message={t('CENTERS.BLOCK_REQUEST')}
                handleAction={handleRequestBlockAction}
                buttonNames={{
                  primary: t('COMMON.SEND_REQUEST'),
                  secondary: t('COMMON.CANCEL'),
                }}
                handleCloseModal={handleCloseModal}
                modalOpen={confirmationModalOpen}
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
                    {t('Reassign Instructor to Batch')}
                  </Typography>
                  <IconButton
                    aria-label="close"
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
                          {t('Loading...')}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ mb: 3 }}>
                      <LMPMultipleBatchListWidget
                        value={selectedCenterIdReassign}
                        onChange={(centerId) => {
                          setSelectedCenterIdReassign(centerId);
                        }}
                        onCenterList={(centerList) => {
                          setSelectedCenterListReassign(centerList || []);
                        }}
                        selectedCenterList={selectedCenterListReassign}
                        onBatchList={(batchList) => {
                          setSelectedBatchListReassign(batchList || []);
                        }}
                        selectedBatchList={selectedBatchListReassign}
                        label="Select Batch"
                        required={true}
                        multiple={false}
                        centerIds={myCenterIds}
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
                      if (selectedUserIdReassign && selectedCenterIdReassign) {
                        setReassignInProgress(true);
                        try {
                          //map user to tenant
                          // Extract all batch IDs from the nested structure
                          const batchIds = extractBatchIds(selectedCenterIdReassign);

                          if (batchIds.length === 0) {
                            showToastMessage(
                              'Please select at least one batch',
                              'error'
                            );
                            setReassignInProgress(false);
                            return;
                          }


                          const removedIds = originalCenterIdReassign?.filter(
                            (item: any) => !batchIds.includes(item)
                          );

                          // Call the cohortmember/create API with extracted batch IDs
                          const response = await bulkCreateCohortMembers({
                            userId: [selectedUserIdReassign],
                            cohortId: batchIds,
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
                            setIsFacilitatorAdded((prev) => !prev);
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
                        showToastMessage('Please search and select a user', 'error');
                      } else {
                        showToastMessage('Please select a center', 'error');
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

            {openDeleteUserModal && (
              <DeleteUserModal
                type={Role.TEACHER}
                userId={userId}
                open={openDeleteUserModal}
                onClose={handleCloseModal}
                onUserDelete={handleDeleteUser}
                reloadState={reloadState}
                setReloadState={setReloadState}
              />
            )}

            {openRemoveUserModal && (
              <SimpleModal
                primaryText={t('COMMON.OK')}
                primaryActionHandler={handleCloseRemoveModal}
                open={openRemoveUserModal}
                onClose={handleCloseRemoveModal}
                modalTitle={t('COMMON.DELETE_USER')}
              >
                {' '}
                <Box mt={1.5} mb={1.5}>
                  <Typography>
                    {t('CENTERS.THE_USER_BELONGS_TO_THE_FOLLOWING_COHORT')}{' '}
                    <strong>{toPascalCase(removeCohortNames)}</strong>
                    <br />
                    {t('CENTERS.PLEASE_REMOVE_THE_USER_FROM_COHORT')}
                  </Typography>
                </Box>
              </SimpleModal>
            )}
            {/* Map Facilitator Modal Dialog */}
            <Dialog
              open={mapModalOpen}
              onClose={(event, reason) => {
                // Prevent closing on backdrop click
                if (reason !== 'backdropClick') {
                  handleCloseAddFaciModal();
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
                  {t('FACILITATORS.MAP_USER_AS_FACILITATOR')}
                </Typography>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseAddFaciModal}
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
                      }}
                      onUserDetails={(userDetails) => {
                        setUserDetails(userDetails);
                        setFormStep(1);
                      }}
                      schema={addFacilitatorSchema}
                      uiSchema={addFacilitatorUiSchema}
                      prefilledState={prefilledState}
                      onPrefilledStateChange={(prefilledState) => {
                        setPrefilledState(prefilledState || {});
                      }}
                      roleId={RoleId.TEACHER}
                      tenantId={tenantId}
                      type="instructor"
                    />
                  </Box>
                )}
                {formStep === 1 && (
                  <Box sx={{ mb: 3 }}>
                    <LMPMultipleBatchListWidget
                      value={selectedCenterId}
                      onChange={(centerId) => {
                        setSelectedCenterId(centerId);
                      }}
                      onCenterList={(centerList) => {
                        setSelectedCenterList(centerList || []);
                      }}
                      selectedCenterList={selectedCenterList}
                      onBatchList={(batchList) => {
                        setSelectedBatchList(batchList || []);
                      }}
                      selectedBatchList={selectedBatchList}
                      label={t('COMMON.SELECT_CENTER')}
                      required={true}
                      multiple={false}
                      centerIds={myCenterIds}
                      centerList={myCenterList}
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

                          // Update user details
                          const updateUserResponse = await enrollUserTenant({
                            userId: selectedUserId,
                            tenantId: tenantId,
                            roleId: RoleId.TEACHER,
                            customField: customFields,
                            userData: userData,
                          });

                          if (
                            updateUserResponse &&
                            updateUserResponse?.params?.err === null
                          ) {
                            showToastMessage(
                              t(
                                'FACILITATORS.FACILITATOR_UPDATED_SUCCESSFULLY'
                              ),
                              'success'
                            );

                            // Extract all batch IDs from the nested structure
                            const batchIds = extractBatchIds(selectedCenterId);

                            if (batchIds.length === 0) {
                              showToastMessage(
                                t('COMMON.PLEASE_SELECT_AT_LEAST_ONE_BATCH'),
                                'error'
                              );
                              setIsMappingInProgress(false);
                              return;
                            }

                            // Call the cohortmember/create API with extracted batch IDs
                            const response = await bulkCreateCohortMembers({
                              userId: [selectedUserId],
                              cohortId: batchIds,
                            });

                            if (
                              response?.responseCode === 201 ||
                              response?.data?.responseCode === 201 ||
                              response?.status === 201
                            ) {
                              showToastMessage(
                                t(
                                  'FACILITATORS.FACILITATOR_CREATED_SUCCESSFULLY'
                                ),
                                'success'
                              );
                              // Close dialog
                              handleCloseAddFaciModal();
                              // Refresh the data
                              handleFacilitatorAdded();
                            } else {
                              showToastMessage(
                                response?.data?.params?.errmsg ||
                                t('COMMON.NOT_ABLE_CREATE_FACILITATOR'),
                                'error'
                              );
                            }
                          } else {
                            showToastMessage(
                              t('COMMON.NOT_ABLE_UPDATE_FACILITATOR'),
                              'error'
                            );
                          }
                        } catch (error: any) {
                          console.error('Error creating cohort member:', error);
                          showToastMessage(
                            error?.response?.data?.params?.errmsg ||
                            t('COMMON.NOT_ABLE_CREATE_FACILITATOR'),
                            'error'
                          );
                        } finally {
                          setIsMappingInProgress(false);
                        }
                      } else if (!selectedUserId) {
                        showToastMessage(
                          t('COMMON.PLEASE_SEARCH_AND_SELECT_USER'),
                          'error'
                        );
                      } else {
                        showToastMessage(
                          t('COMMON.PLEASE_SELECT_CENTER'),
                          'error'
                        );
                      }
                    }}
                    disabled={
                      !selectedUserId ||
                      !selectedCenterId ||
                      isMappingInProgress
                    }
                  >
                    {t('FACILITATORS.MAP_AS_FACILITATOR')}
                  </Button>
                )}
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
    </div>
  );
};

export default ManageUser;
