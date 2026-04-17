import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Box, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { StatusCardsRow, StatusCardData } from '.';
import DataTable, { Column, RowData } from './DataTable';
import DynamicFilterBar, { FilterState, FilterLabels } from './DynamicFilterBar';
import { fetchUserList, getUserDetails, updateUser } from '../../services/youthNet/Dashboard/UserServices';
import { bulkUpdateUsersRoles, updateCohortStatus } from '../../services/ManageUser';
import { showToastMessage } from '../Toastify';
import { DASHBOARD_TYPE } from '../../utils/app.config';
import { useTranslation } from 'next-i18next';

// Role ID for Volunteer role - this should be configured based on your system
const VOLUNTEER_ROLE_ID = "27375aaa-1aa6-422f-905e-9e7d9e078e13"; // Update this with actual Volunteer role ID
import { getCohortList } from '../../services/youthNet/Dashboard/VillageServices';

interface PTMDashboardProps {
  dashboardType: 'volunteer' | 'student' | 'teacher' | string;
}

/**
 * INSTRUCTIONS TO HIDE ACTIONS FOR APPROVED/REJECTED ITEMS:
 * 
 * To hide approve/reject actions for items that are already approved or rejected:
 * 1. Find lines with commented "// disabled:" or "// Hide" comments
 * 2. Uncomment those lines and comment out the current disabled lines
 * 3. For bulk actions bar, uncomment the condition on line ~1029
 * 
 * This will:
 * - Disable individual Approve/Reject buttons for approved/rejected rows
 * - Disable bulk Approve/Reject buttons when selection contains approved/rejected rows  
 * - Hide entire bulk actions bar when all selected rows are approved/rejected
 */

interface CustomField {
  label: string;
  selectedValues: Array<{ id?: number; value: string }>;
}

const PTMDashboard: React.FC<PTMDashboardProps> = ({ dashboardType }) => {
  const { t } = useTranslation('common');

  // Helper to extract state from a parsed userData object
  const extractStateFromUserData = (parsedData: { customFields?: CustomField[] }) => {
    try {
      const stateField = parsedData?.customFields?.find((field: CustomField) => field.label === 'STATE');
      if (stateField && stateField.selectedValues && stateField.selectedValues.length > 0) {
        const stateValue = stateField.selectedValues[0];
        const stateId = stateValue.id?.toString() || stateValue.value;
        return { id: stateId, value: stateId, label: stateValue.value };
      }
    } catch {
      // ignore
    }
    return null;
  };

  // Function to get user state from localStorage
  const getUserStateFromStorage = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return extractStateFromUserData(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
    }
    return null;
  };

  const [resolvedUserState, setResolvedUserState] = useState<{ id: string; value: string; label: string } | null>(() => getUserStateFromStorage());
  const [loading] = useState(false); // Static loading state for status cards
  const [resetFilters, setResetFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);
  const [approvingUsers, setApprovingUsers] = useState<string[]>([]); // Track which users are being approved
  
  // Dialog states
  const [approveDialog, setApproveDialog] = useState<{
    open: boolean;
    user: RowData | null;
    isBulk: boolean;
    users: RowData[];
  }>({
    open: false,
    user: null,
    isBulk: false,
    users: [],
  });
  
  const [rejectDialog, setRejectDialog] = useState<{
    open: boolean;
    user: RowData | null;
    isBulk: boolean;
    users: RowData[];
  }>({
    open: false,
    user: null,
    isBulk: false,
    users: [],
  });

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    state: resolvedUserState ? [resolvedUserState.value] : [],
    district: [],
    block: [],
    // village: [],
    // status: [],
    organization: [],
    // poc: [],
  });

  // State for filter labels
  const [filterLabels, setFilterLabels] = useState<FilterLabels>({
    state: resolvedUserState ? [resolvedUserState.label] : [],
    district: [],
    block: [],
    // village: [],
    // status: [],
    organization: [],
    // poc: [],
  });


  // Handle status card clicks - filters table data based on selected status
  const handleStatusCardClick = useCallback((status: string) => {
    console.log(`${status} card clicked`);
    setSelectedStatus(status);
    setCurrentPage(0); // Reset to first page when status filter changes
    // Table data will be refetched automatically via useEffect dependency on selectedStatus
  }, []);

  // Initial status cards data with memoized onClick handlers  
  const initialStatusCards = useMemo<StatusCardData[]>(() => [
    {
      id: 'total',
      count: 0,
      title: t('PTM_DASHBOARD.TOTAL'),
      variant: 'total',
      onClick: () => handleStatusCardClick('total'),
    },
    {
      id: 'pending',
      count: 0,
      title: t('PTM_DASHBOARD.PENDING_REVIEW'),
      variant: 'pending',
      onClick: () => handleStatusCardClick('pending'),
    },
    {
      id: 'approved',
      count: 0,
      title: t('PTM_DASHBOARD.APPROVED'),
      variant: 'approved',
      onClick: () => handleStatusCardClick('approved'),
    },
    {
      id: 'rejected',
      count: 0,
      title: t('PTM_DASHBOARD.REJECTED'),
      variant: 'rejected',
      onClick: () => handleStatusCardClick('rejected'),
    },
  ], [handleStatusCardClick, t]);

  // Pagination state for table data
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalTableRecords, setTotalTableRecords] = useState(0);
  const [tableLoading, setTableLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('total'); // Track selected status card

  // Status cards data - dynamic (updated from API)
  const [statusCardsData, setStatusCardsData] = useState<StatusCardData[]>(initialStatusCards);

  // Update status card highlighting when selectedStatus changes
  useEffect(() => {
    setStatusCardsData(prevCards => 
      prevCards.map(card => ({
        ...card,
        customColors: selectedStatus === card.id ? {
          border: card.id === 'total' ? '#FF9800' :
                 card.id === 'pending' ? '#FFC107' : 
                 card.id === 'approved' ? '#4CAF50' : '#f44336',
          background: card.id === 'total' ? 'rgba(255, 152, 0, 0.2)' :
                     card.id === 'pending' ? 'rgba(255, 193, 7, 0.2)' : 
                     card.id === 'approved' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          iconColor: card.id === 'total' ? '#FF9800' :
                    card.id === 'pending' ? '#FFC107' : 
                    card.id === 'approved' ? '#4CAF50' : '#f44336',
        } : undefined,
      }))
    );
  }, [selectedStatus]);

  // Fetch and store full user details (including customFields with STATE)
  useEffect(() => {
    const fetchAndStoreUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const data = await getUserDetails(userId, true);

          if (data?.userData) {
            const userData = data.userData;
            localStorage.setItem('userData', JSON.stringify(userData));

            // Resolve user state from the freshly fetched data
            const state = extractStateFromUserData(userData);
            if (state) {
              setResolvedUserState(state);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchAndStoreUserData();
  }, []);

  // Utility function to capitalize first letter
  const capitalizeFirstLetter = (str: string): string => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // Function to fetch status cards data (extracted for reuse)
  const fetchStatusCardsData = useCallback(async () => {
      try {
        let Pendingfilters = {};
        let Approvedfilters = {};
        let Rejectedfilters = {};
        
        if(dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER){
          Pendingfilters = {
            role: ["Learner"],
            "how_would_you_like_to_register": [
                 "individual_volunteer"
             ],
              ptm_id: localStorage.getItem('userId') || '',
              is_rejected:"No",
             "volunteer_type":"individual_volunteer"
          };
          Approvedfilters = {
            role: ["Volunteer"],
            "how_would_you_like_to_register": [
                 "individual_volunteer"
             ],
             ptm_id: localStorage.getItem('userId') || '',
             "volunteer_type":"individual_volunteer"
          };
          Rejectedfilters = {
            role: "Learner",
            "how_would_you_like_to_register": [
                 "individual_volunteer"
             ],
             ptm_id: localStorage.getItem('userId') || '',
             is_rejected:"Yes",
             volunteer_type:"individual_volunteer"
          };
        }
        else if(dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER){
          Pendingfilters = {
            role: ["Learner"],
             "volunteer_type":"individual_volunteer_through_an_organisation",
             ptm_id: localStorage.getItem('userId') || '',
             // No is_rejected filter here — new users don't have the field set to "No"
             // We compute pendingCount = totalLearners - rejectedCount after the API calls
          };
          Approvedfilters = {
            role: ["Volunteer"],
             "volunteer_type":"individual_volunteer_through_an_organisation",
            ptm_id: localStorage.getItem('userId') || '',
          };
          Rejectedfilters = {
            role: ["Learner"],
             "volunteer_type":"individual_volunteer_through_an_organisation",
           ptm_id: localStorage.getItem('userId') || '',
             is_rejected:"Yes",
          };
        }
        else if(dashboardType === DASHBOARD_TYPE.ORGANISATION){
          Pendingfilters = {
            "type": "COHORT",
            "status": [
                "pending"
            ],
            "customFieldsName": {
              "ptm_id" :localStorage.getItem('userId') || ''
            }
          };
          Approvedfilters = {
            "type": "COHORT",
            "status": [
                "active"
            ],
            "customFieldsName": {
              "ptm_id" :localStorage.getItem('userId') || ''
            }          };
          Rejectedfilters = {
              "type": "COHORT",
            "status": [
                "inactive"
            ],
            "customFieldsName": {
              "ptm_id" :localStorage.getItem('userId') || ''
            }          }
        }

        // Make API calls for each status type to get counts
        if(dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER || dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER){
        
        const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
          fetchUserList({
            limit: 0, // We only need totalCount, not actual data
            filters: Pendingfilters,
            sort: ["firstName", "asc"],
            offset: 0
          }),
          fetchUserList({
            limit: 0, // We only need totalCount, not actual data
            filters: Approvedfilters,
            sort: ["firstName", "asc"],
            offset: 0
          }),
          fetchUserList({
            limit: 0, // We only need totalCount, not actual data
            filters: Rejectedfilters,
            sort: ["firstName", "asc"],
            offset: 0
          })
        ]);

        // Extract counts from responses
        const approvedCount = approvedResponse?.totalCount || 0;
        const rejectedCount = rejectedResponse?.totalCount || 0;
        // For ORGANISATION_VOLUNTEER, Pendingfilters returns all Learners (no is_rejected filter),
        // because new pending users don't have is_rejected set to "No" — they simply have no value.
        // So pendingCount = total Learners - explicitly rejected Learners.
        const pendingCount = dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER
          ? Math.max(0, (pendingResponse?.totalCount || 0) - rejectedCount)
          : (pendingResponse?.totalCount || 0);
        const totalCount = pendingCount + approvedCount + rejectedCount;

        // Update status cards with actual API counts
        setStatusCardsData([
          {
            id: 'total',
            count: totalCount,
            title: t('PTM_DASHBOARD.TOTAL'),
            variant: 'total',
            onClick: () => handleStatusCardClick('total'),
            customColors: selectedStatus === 'total' ? {
              border: '#FF9800',
              background: 'rgba(255, 152, 0, 0.2)',
              iconColor: '#FF9800',
            } : undefined,
          },
          {
            id: 'pending',
            count: pendingCount,
            title: t('PTM_DASHBOARD.PENDING_REVIEW'),
            variant: 'pending',
            onClick: () => handleStatusCardClick('pending'),
            customColors: selectedStatus === 'pending' ? {
              border: '#FFC107',
              background: 'rgba(255, 193, 7, 0.2)',
              iconColor: '#FFC107',
            } : undefined,
          },
          {
            id: 'approved',
            count: approvedCount,
            title: t('PTM_DASHBOARD.APPROVED'),
            variant: 'approved',
            onClick: () => handleStatusCardClick('approved'),
            customColors: selectedStatus === 'approved' ? {
              border: '#4CAF50',
              background: 'rgba(76, 175, 80, 0.2)',
              iconColor: '#4CAF50',
            } : undefined,
          },
          {
            id: 'rejected',
            count: rejectedCount,
            title: t('PTM_DASHBOARD.REJECTED'),
            variant: 'rejected',
            onClick: () => handleStatusCardClick('rejected'),
            customColors: selectedStatus === 'rejected' ? {
              border: '#f44336',
              background: 'rgba(244, 67, 54, 0.2)',
              iconColor: '#f44336',
            } : undefined,
          },
        ]);
      }
        if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
          // It appears getCohortList expects a string argument, possibly an endpoint or cohort identifier.
          // If you need to fetch ALL counts like with fetchUserList, you'll need to implement a similar approach.
          // For demonstration, we'll assume getCohortList accepts a filter type, e.g. "pending", "approved", "rejected".
          const [pendingResponse, approvedResponse, rejectedResponse] = await Promise.all([
            getCohortList({
              limit: 200,
              offset: 0,
              filters:Pendingfilters
            }),
            getCohortList({
              limit: 200,
              offset: 0,
              filters:Approvedfilters
            }),
            getCohortList({
              limit: 200,
              offset: 0,
              filters:Rejectedfilters
            }),
          ]);

          const pendingCount = pendingResponse?.count || 0;
          const approvedCount = approvedResponse?.count || 0;
          const rejectedCount = rejectedResponse?.count || 0;
          const totalCount = pendingCount + approvedCount + rejectedCount;

          setStatusCardsData([
            {
              id: 'total',
              count: totalCount,
              title: t('PTM_DASHBOARD.TOTAL'),
              variant: 'total',
              onClick: () => handleStatusCardClick('total'),
              customColors: selectedStatus === 'total' ? {
                border: '#FF9800',
                background: 'rgba(255, 152, 0, 0.2)',
                iconColor: '#FF9800',
              } : undefined,
            },
            {
              id: 'pending',
              count: pendingCount,
              title: t('PTM_DASHBOARD.PENDING_REVIEW'),
              variant: 'pending',
              onClick: () => handleStatusCardClick('pending'),
              customColors: selectedStatus === 'pending' ? {
                border: '#FFC107',
                background: 'rgba(255, 193, 7, 0.2)',
                iconColor: '#FFC107',
              } : undefined,
            },
            {
              id: 'approved',
              count: approvedCount,
              title: t('PTM_DASHBOARD.APPROVED'),
              variant: 'approved',
              onClick: () => handleStatusCardClick('approved'),
              customColors: selectedStatus === 'approved' ? {
                border: '#4CAF50',
                background: 'rgba(76, 175, 80, 0.2)',
                iconColor: '#4CAF50',
              } : undefined,
            },
            {
              id: 'rejected',
              count: rejectedCount,
              title: t('PTM_DASHBOARD.REJECTED'),
              variant: 'rejected',
              onClick: () => handleStatusCardClick('rejected'),
              customColors: selectedStatus === 'rejected' ? {
                border: '#f44336',
                background: 'rgba(244, 67, 54, 0.2)',
                iconColor: '#f44336',
              } : undefined,
            },
          ]);
        }
        // Fetch actual table data with pending filters (default view)
        // const tableDataResponse = await fetchUserList({
        //   limit: 100, // Get actual data for table
        //   filters: Pendingfilters,
        //   sort: ["firstName", "asc"],
        //   offset: 0
        // });
        
        // setApiData(tableDataResponse || []);
        // console.log('API Response - Counts:', { totalCount, pendingCount, approvedCount, rejectedCount });
        // console.log('API Response - Table Data:', tableDataResponse);
      } catch (error) {
        console.error('Error fetching status cards data:', error);
      }
    }, [dashboardType, handleStatusCardClick, selectedStatus, t]);

  // API integration useEffect
  useEffect(() => {
    fetchStatusCardsData();
  }, [fetchStatusCardsData]);

  // Table columns definition - memoized by dashboardType
  const columns = useMemo<Column[]>(() => {
    switch (dashboardType) {
      case DASHBOARD_TYPE.ORGANISATION:
        return [
          {
            id: 'name',
            label: 'Organization Name',
            minWidth: 200,
          },
          {
            id: 'location',
            label: 'Location',
            minWidth: 160,
          },
          {
            id: 'organization',
            label: 'Organization Type',
            minWidth: 150,
          },
          {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            align: 'center',
          },
        ];
      case 'volunteer':
      default:
        return [
          {
            id: 'name',
            label: 'Name',
            minWidth: 200,
          },
          {
            id: 'location',
            label: 'Location',
            minWidth: 160,
          },
          {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            align: 'center',
          },
        ];
    }
  }, [dashboardType]);

  // Separate useEffect for fetching table data with pagination
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setTableLoading(true);
        // Base filters for individual volunteers
        let baseFilters = {};
        if(dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER){
         baseFilters = {
          "role": ["Learner", "Volunteer"],
          "how_would_you_like_to_register": ["individual_volunteer"],
          "volunteer_type":"individual_volunteer",
          "ptm_id": localStorage.getItem('userId') || ''
        };
      }
      else if(dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER){
        baseFilters = {
          "role": ["Learner", "Volunteer"],
          "volunteer_type":"individual_volunteer_through_an_organisation",
          "ptm_id": localStorage.getItem('userId') || ''
        };
      }
      else if(dashboardType === DASHBOARD_TYPE.ORGANISATION){
        baseFilters = {
          "type": "COHORT",
          "customFieldsName": {
            "ptm_id" :localStorage.getItem('userId') || ''
          },
        //  "status": ["pending"],
          "ptm_id": localStorage.getItem('userId') || ''
        };
      }

      // Add status-based filters based on selected status card
      // This filters table data to show only records matching the clicked status
      if(dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER || dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER){
        if (selectedStatus === 'pending') {
          baseFilters = { ...baseFilters, role: ['Learner'] }; // Pending = Learners (not yet approved as Volunteer)
        } else if (selectedStatus === 'approved') {
          baseFilters = { ...baseFilters, role: ['Volunteer'] }; // Approved as Volunteers
        } else if (selectedStatus === 'rejected') {
          baseFilters = { ...baseFilters, role: ['Learner'], is_rejected: 'Yes' }; // Explicitly rejected Learners
        }
        // For 'total', no additional status filter is added (shows all records)
      } else if(dashboardType === DASHBOARD_TYPE.ORGANISATION){
        if (selectedStatus === 'pending') {
          baseFilters = { ...baseFilters, status: ['pending'] }; // Pending cohorts
        } else if (selectedStatus === 'approved') {
          baseFilters = { ...baseFilters, status: ['active'] }; // Active/approved cohorts
        } else if (selectedStatus === 'rejected') {
          baseFilters = { ...baseFilters, status: ['inactive'] }; // Inactive/rejected cohorts
        }
        // For 'total', no additional status filter is added (shows all cohorts)
      }
        // Combine with dynamic filters from DynamicFilterBar
        const dynamicFilters: Record<string, string[] | string> = {};
        
        // Add location filters if selected
        if (filters.state.length > 0) {
          dynamicFilters.state = filters.state;
        }
        if (filters.district.length > 0) {
          dynamicFilters.district = filters.district;
        }
        if (filters.block.length > 0) {
          dynamicFilters.block = filters.block;
        }
        // if (filters.village.length > 0) {
        //   dynamicFilters.village = filters.village;
        // }
        
        // Add status filter if selected
        // if (filters.status.length > 0) {
        //   if (filters.status.includes('pending')) {
        //     dynamicFilters.is_reject = 'no';
        //   } else if (filters.status.includes('rejected')) {
        //     dynamicFilters.is_reject = 'yes';
        //   }
        // }

        // Add organization filter if selected
        if (filters.organization.length > 0) {
          dynamicFilters.org_id = filters.organization;
        }

        // Combine base and dynamic filters
        const tableFilters = {
          ...baseFilters,
          ...dynamicFilters
        };

        if(dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER || dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER){
        const response = await fetchUserList({
          limit: rowsPerPage,
          offset: currentPage * rowsPerPage,
          filters: tableFilters,
          sort: ["firstName", "asc"]
        });
        if (response?.getUserDetails && response.getUserDetails.length > 0) {
          // Transform API response to table format
          const transformedData = response.getUserDetails.map((user: Record<string, unknown>, index: number) => {
            const customFields = user.customFields as Array<{
              fieldId: string;
              label: string;
              selectedValues: Array<{ value?: string; label?: string } | string>;
            }> || [];

            // Extract location data from customFields
            const getCustomFieldValue = (label: string) => {
              const field = customFields.find(f => f.label === label);
              if (!field?.selectedValues?.[0]) return 'N/A';
              
              const value = field.selectedValues[0];
              if (typeof value === 'string') return value;
              return value?.value || value?.label || 'N/A';
            };

            const state = getCustomFieldValue('STATE');
            const district = getCustomFieldValue('DISTRICT');
            const block = getCustomFieldValue('BLOCK');
            const is_rejected = getCustomFieldValue('IS_REJECTED');
            const village = getCustomFieldValue('VILLAGE');
            const location = [state, district, block, village].filter(l => l !== 'N/A').join(', ') || 'N/A';

            const transformedRow = {
              id: user.userId || `user-${currentPage * rowsPerPage + index + 1}`,
              name: capitalizeFirstLetter(`${user.firstName || ''} ${user.lastName || ''}`.trim() || (user.name as string) || 'N/A'),
              email: user.email || 'N/A',
              phone: user.mobile || 'N/A',
              location: location,
              organization: getCustomFieldValue('ORG_ID') || 'N/A',
              status: user.role === 'Volunteer' ? t('PTM_DASHBOARD.APPROVED') : (user.role === 'Learner' && is_rejected === 'Yes') ? t('PTM_DASHBOARD.REJECTED') : t('PTM_DASHBOARD.PENDING_REVIEW'),
            };
            
            return transformedRow;
          });

          // For pending view: client-side exclude rejected Learners
          // (API has no "NOT" operator, so role:["Learner"] returns pending + rejected Learners)
          const pendingRejectedStatus = t('PTM_DASHBOARD.REJECTED');
          const displayData = selectedStatus === 'pending'
            ? transformedData.filter((row: RowData) => row.status !== pendingRejectedStatus)
            : transformedData;

          setTableData(displayData);
          setTotalTableRecords(parseInt(response?.getUserDetails?.[0]?.total_count || '0') || 0);
        } else {
          console.log('No data received from API');
          setTableData([]);
        }
        setTableLoading(false);
      }
      else if(dashboardType === DASHBOARD_TYPE.ORGANISATION){
        const response = await getCohortList({
          limit: rowsPerPage,
          offset: currentPage * rowsPerPage,
          filters: tableFilters
        });

        if (response?.results?.cohortDetails && response.results.cohortDetails.length > 0) {
          // Transform cohort API response to table format
          const transformedData = response.results.cohortDetails.map((cohort: Record<string, unknown>, index: number) => {
            const customFields = cohort.customFields as Array<{
              fieldId: string;
              label: string;
              selectedValues: Array<{ value?: string; label?: string } | string>;
            }> || [];

            // Extract location data from customFields
            const getCustomFieldValue = (label: string) => {
              const field = customFields.find(f => f.label === label);
              if (!field?.selectedValues?.[0]) return 'N/A';
              
              const value = field.selectedValues[0];
              if (typeof value === 'string') return value;
              return value?.value || value?.label || 'N/A';
            };

            const state = getCustomFieldValue('STATE');
            const district = getCustomFieldValue('DISTRICT');
            const block = getCustomFieldValue('BLOCK');
            const location = [state, district, block].filter(l => l !== 'N/A').join(', ') || 'N/A';

            const transformedRow = {
              id: cohort.cohortId || `cohort-${currentPage * rowsPerPage + index + 1}`,
              name: capitalizeFirstLetter((cohort.name as string) || 'N/A'),
              email: 'N/A', // Cohorts don't have email
              phone: 'N/A', // Cohorts don't have phone
              location: location,
              organization: getCustomFieldValue('ORGANISATION_TYPE') || 'N/A',
              status: cohort.status === 'active' ? t('PTM_DASHBOARD.APPROVED') : cohort.status === 'inactive' ? t('PTM_DASHBOARD.REJECTED') : t('PTM_DASHBOARD.PENDING_REVIEW'),
            };
            
            return transformedRow;
          });
          
          setTableData(transformedData);
          setTotalTableRecords(response.count || 0);
        } else {
          console.log('No cohort data received from API');
          setTableData([]);
        }
        setTableLoading(false);
      }
      } catch (error) {
        console.error('Error fetching table data:', error);
        setTableData([]);
        setTableLoading(false);
      }
    };

    fetchTableData();
  }, [currentPage, rowsPerPage, filters, dashboardType, selectedStatus, t]);

  const [tableData, setTableData] = useState<RowData[]>([]);

  // Table actions - memoized by dashboardType
  const tableActions = useMemo(() => {
    switch (dashboardType) {
      case 'volunteer':
      default:
        return [
          {
            label: t('PTM_DASHBOARD.APPROVE'),
            onClick: (row: RowData) => {
              console.log('Approve:', row);
              setApproveDialog({
                open: true,
                user: row,
                isBulk: false,
                users: [row],
              });
            },
            color: 'success' as const,
            disabled: (row: RowData) => approvingUsers.includes(row.id),
          },
          {
            label: t('PTM_DASHBOARD.REJECT'),
            onClick: (row: RowData) => {
              console.log('Reject:', row);
              setRejectDialog({
                open: true,
                user: row,
                isBulk: false,
                users: [row],
              });
            },
            color: 'error' as const,
          },
        ];
    }
  }, [dashboardType, approvingUsers, t]);



  // Handle filter changes - memoized (filters only affect table data, not status cards)
  const handleFiltersChange = useCallback((newFilters: FilterState, newFilterLabels: FilterLabels) => {
    setFilters(newFilters);
    setFilterLabels(newFilterLabels);
    setCurrentPage(0); // Reset to first page when filters change
    
    // Note: Table data will be fetched automatically via useEffect dependency on filters
  }, []);

  // Handle row selection - memoized
  const handleRowSelect = useCallback((selected: RowData[]) => {
    setSelectedRows(selected);
    console.log('Selected rows:', selected);
  }, []);

  // Handle actual approve action (called from dialog)
  const handleConfirmApprove = useCallback(async (users: RowData[]) => {
    const userIds = users.map(user => user.id);
    
    // Set loading state
    setApprovingUsers(prev => [...prev, ...userIds]);
    
    try {
      // Call API based on dashboard type
      if (dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER || dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER) {
        await bulkUpdateUsersRoles({
          userIds: userIds,
          roleId: VOLUNTEER_ROLE_ID
        });
        console.log('Successfully approved users:', userIds);
        showToastMessage(
          users.length === 1 
            ? t('PTM_DASHBOARD.APPROVED_SUCCESS_SINGLE', { name: users[0].name })
            : t('PTM_DASHBOARD.APPROVED_SUCCESS_BULK_VOLUNTEERS', { count: users.length }),
          'success'
        );
      } else if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
        await updateCohortStatus({
          cohortIds: userIds,
          status: 'active'
        });
        console.log('Successfully approved cohorts:', userIds);
        showToastMessage(
          users.length === 1 
            ? t('PTM_DASHBOARD.APPROVED_SUCCESS_SINGLE_ORG', { name: users[0].name })
            : t('PTM_DASHBOARD.APPROVED_SUCCESS_BULK_ORGS', { count: users.length }),
          'success'
        );
      }
    } catch (error) {
      console.error('Error approving:', error);
      setApprovingUsers(prev => prev.filter(id => !userIds.includes(id)));
      if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
        showToastMessage(
          users.length === 1 
            ? t('PTM_DASHBOARD.APPROVE_FAILED_SINGLE_ORG')
            : t('PTM_DASHBOARD.APPROVE_FAILED_BULK_ORGS'),
          'error'
        );
      } else {
        showToastMessage(
          users.length === 1 
            ? t('PTM_DASHBOARD.APPROVE_FAILED_SINGLE_VOLUNTEER')
            : t('PTM_DASHBOARD.APPROVE_FAILED_BULK_VOLUNTEERS'),
          'error'
        );
      }
      return;
    }
    
    // Update local state
    setTableData(prev => 
      prev.map(item => 
        userIds.includes(item.id) 
          ? { ...item, status: t('PTM_DASHBOARD.APPROVED') } 
          : item
      )
    );
    
    // Remove from loading state and clear selection (both single and bulk)
    setApprovingUsers(prev => prev.filter(id => !userIds.includes(id)));
    setSelectedRows([]); // Clear all selected rows after action completes
    
    // Refresh status cards to update counts
    await fetchStatusCardsData();
  }, [dashboardType, t, fetchStatusCardsData]);

  // Handle actual reject action (called from dialog)
  const handleConfirmReject = useCallback(async (users: RowData[]) => {
    const userIds = users.map(user => user.id);
    
    try {
      // Call API based on dashboard type
      if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
        await updateCohortStatus({
          cohortIds: userIds,
          status: 'inactive'
        });
        console.log('Successfully rejected cohorts:', userIds);
      }
      else if (dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER || dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER) {
        // Update each user with custom field for rejection
        const updatePromises = userIds.map(userId => 
          updateUser(userId, {
            userData: {},
            customFields: [
              {
                fieldId: "4a04adbe-af01-4dea-92e3-688eab9935ca",
                value: "Yes"
              }
            ]
          })
        );
        await Promise.all(updatePromises);
        console.log('Successfully rejected volunteers:', userIds);
      }
      
      // For individual volunteers, we might not have a reject API, so just update local state
    } catch (error) {
      console.error('Error rejecting:', error);
      if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
        showToastMessage(
          users.length === 1 
            ? t('PTM_DASHBOARD.REJECT_FAILED_SINGLE_ORG')
            : t('PTM_DASHBOARD.REJECT_FAILED_BULK_ORGS'),
          'error'
        );
      } else {
        showToastMessage(
          users.length === 1 
            ? t('PTM_DASHBOARD.REJECT_FAILED_SINGLE_VOLUNTEER')
            : t('PTM_DASHBOARD.REJECT_FAILED_BULK_VOLUNTEERS'),
          'error'
        );
      }
      return;
    }
    
    // Update local state
    setTableData(prev => 
      prev.map(item => 
        userIds.includes(item.id) 
          ? { ...item, status: t('PTM_DASHBOARD.REJECTED') } 
          : item
      )
    );
    
    // Show success message
    if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
      showToastMessage(
        users.length === 1 
          ? t('PTM_DASHBOARD.REJECTED_SUCCESS_SINGLE_ORG', { name: users[0].name })
          : t('PTM_DASHBOARD.REJECTED_SUCCESS_BULK_ORGS', { count: users.length }),
        'info'
      );
    } else {
      showToastMessage(
        users.length === 1 
          ? t('PTM_DASHBOARD.REJECTED_SUCCESS_SINGLE_VOLUNTEER', { name: users[0].name })
          : t('PTM_DASHBOARD.REJECTED_SUCCESS_BULK_VOLUNTEERS', { count: users.length }),
        'info'
      );
    }
    
    // Clear all selected rows after action completes (both single and bulk)
    setSelectedRows([]);
    
    // Refresh status cards to update counts
    await fetchStatusCardsData();
  }, [dashboardType, t, fetchStatusCardsData]);

  // Handle bulk approve action - memoized (shows dialog)
  const handleApproveAll = useCallback(() => {
    setApproveDialog({
      open: true,
      user: null,
      isBulk: true,
      users: selectedRows,
    });
  }, [selectedRows]);

  // Handle bulk reject action - memoized (shows dialog)
  const handleRejectAll = useCallback(() => {
    setRejectDialog({
      open: true,
      user: null,
      isBulk: true,
      users: selectedRows,
    });
  }, [selectedRows]);

  // Clear all filters - memoized
  const clearAllFilters = useCallback(() => {
    setResetFilters(true);
    setSelectedRows([]); // Clear selected rows when filters are cleared
  }, []);

  // Handle reset complete - memoized (status cards remain unchanged)
  const handleResetComplete = useCallback(() => {
    setResetFilters(false);
    setCurrentPage(0); // Reset to first page when filters are reset
    // Reset filters
    setFilters({
      state: resolvedUserState ? [resolvedUserState.value] : [],
      district: [],
      block: [],
      // village: [],
      // status: [],
      organization: [],
      // poc: [],
    });
    setFilterLabels({
      state: resolvedUserState ? [resolvedUserState.label] : [],
      district: [],
      block: [],
      // village: [],
      // status: [],
      organization: [],
      // poc: [],
    });
    // Note: Table data will be fetched automatically via useEffect dependency on filters
    // Status cards remain unchanged - they show overall application data
  }, [resolvedUserState]);

  // Pagination handlers
  const handlePageChange = (event: unknown, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0); // Reset to first page when changing rows per page
  };

  return (
    <>
      {/* Status Cards Section */}
      <Box sx={{ mb: 4 }}>
        <StatusCardsRow
          cards={statusCardsData}
          size="medium"
          loading={loading}
          spacing={3}
          responsive={{
            xs: 1, // 1 card per row on mobile
            sm: 2, // 2 cards per row on small screens
            md: 4, // 4 cards per row on medium+ screens
            lg: 4,
            xl: 4,
          }}
        />
      </Box>

      {/* Dynamic Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <DynamicFilterBar 
          onFiltersChange={handleFiltersChange} 
          resetFilters={resetFilters}
          onResetComplete={handleResetComplete}
          showOrganizationFilter={dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER}
          initialUserState={resolvedUserState}
        />
      </Box>

      {/* Filter Summary - Don't show if only state is selected (state is auto-populated and disabled) */}
      {(filters.district.length > 0 || filters.block.length > 0 || 
        /* filters.village.length > 0 || filters.status.length > 0 || */ filters.organization.length > 0) && (
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>{t('PTM_DASHBOARD.APPLIED_FILTERS')}:</strong>{' '}
              {/* State filter is not shown as it's auto-populated and disabled */}
              {filterLabels.district.length > 0 && 
                `${t('PTM_DASHBOARD.DISTRICTS')}: ${filterLabels.district.length > 2 
                  ? `${filterLabels.district.slice(0, 2).join(', ')} +${filterLabels.district.length - 2} ${t('PTM_DASHBOARD.MORE')}` 
                  : filterLabels.district.join(', ')
                }; `}
              {filterLabels.block.length > 0 && 
                `${t('PTM_DASHBOARD.BLOCKS')}: ${filterLabels.block.length > 2 
                  ? `${filterLabels.block.slice(0, 2).join(', ')} +${filterLabels.block.length - 2} ${t('PTM_DASHBOARD.MORE')}` 
                  : filterLabels.block.join(', ')
                }; `}
              {/* {filterLabels.village.length > 0 && 
                `Villages: ${filterLabels.village.length > 2 
                  ? `${filterLabels.village.slice(0, 2).join(', ')} +${filterLabels.village.length - 2} more` 
                  : filterLabels.village.join(', ')
                }; `} */}
              {/* {filterLabels.status.length > 0 && 
                `Status: ${filterLabels.status.join(', ')}; `} */}
              {filterLabels.organization.length > 0 && 
                `${t('PTM_DASHBOARD.ORGANIZATIONS')}: ${filterLabels.organization.length > 2 
                  ? `${filterLabels.organization.slice(0, 2).join(', ')} +${filterLabels.organization.length - 2} ${t('PTM_DASHBOARD.MORE')}` 
                  : filterLabels.organization.join(', ')
                }`}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={clearAllFilters}
              sx={{ minWidth: 'auto' }}
            >
              {t('PTM_DASHBOARD.CLEAR_ALL')}
            </Button>
          </Paper>
        </Box>
      )}

      {/* Bulk Actions Bar - Shows when rows are selected */}
      {selectedRows.length > 0 && (
      /* Uncomment below line and comment above line to hide bulk actions when all selected rows are approved/rejected:
      {selectedRows.length > 0 && !selectedRows.every(row => row.status === 'Approved' || row.status === 'Rejected') && (
      */
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              backgroundColor: '#fff',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {selectedRows.length} {t('PTM_DASHBOARD.SELECTED')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckIcon />}
                onClick={handleApproveAll}
                // disabled={selectedRows.some(row => approvingUsers.includes(row.id))}
                disabled={selectedRows.some(row => approvingUsers.includes(row.id) || row.status === 'Approved' || row.status === 'Rejected')} // Also disable when approved/rejected items are selected
                sx={{
                  backgroundColor: '#00c851',
                  color: 'white',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#00a842',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    backgroundColor: '#cccccc',
                    color: 'white',
                  },
                }}
              >
                {selectedRows.some(row => approvingUsers.includes(row.id)) ? t('PTM_DASHBOARD.APPROVING') : t('PTM_DASHBOARD.APPROVE_ALL')}
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloseIcon />}
                onClick={handleRejectAll}
                disabled={selectedRows.some(row => row.status === 'Approved' || row.status === 'Rejected')} // Disable when approved/rejected items are selected
                sx={{
                  borderColor: '#ff4444',
                  color: '#ff4444',
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#cc0000',
                    color: '#cc0000',
                    backgroundColor: 'rgba(255, 68, 68, 0.04)',
                    boxShadow: 'none',
                  },
                }}
              >
                {t('PTM_DASHBOARD.REJECT_ALL')}
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Data Table */}
      <Box sx={{ mb: 3 }}>
        <DataTable
          columns={columns}
          rows={tableData}
          showCheckbox={true}
          showActions={true}
          actions={tableActions}
          onRowSelect={handleRowSelect}
          selectedRows={selectedRows}
          emptyMessage={t('PTM_DASHBOARD.NO_DATA_FOUND', {
                type:
                  dashboardType === DASHBOARD_TYPE.INDIVIDUAL_VOLUNTEER
                    ? 'Individual Volunteer'
                    : dashboardType === DASHBOARD_TYPE.ORGANISATION_VOLUNTEER
                    ? 'Organisation Volunteer'
                    : dashboardType === DASHBOARD_TYPE.ORGANISATION
                    ? 'Organisation'
                    : dashboardType,
              })}
          maxHeight={600}
          loading={tableLoading}
          showPagination={true}
          page={currentPage}
          rowsPerPage={rowsPerPage}
          totalCount={totalTableRecords}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialog.open}
        onClose={() => setApproveDialog(prev => ({ ...prev, open: false }))}
        aria-labelledby="approve-dialog-title"
        aria-describedby="approve-dialog-description"
      >
        <DialogTitle 
          id="approve-dialog-title"
          sx={{ fontSize: '1.5rem', fontWeight: 600 }}
        >
          {approveDialog.isBulk ? t('PTM_DASHBOARD.CONFIRM_BULK_APPROVAL') : t('PTM_DASHBOARD.CONFIRM_APPROVAL')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="approve-dialog-description">
            {(() => {
              if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
                return approveDialog.isBulk
                  ? t('PTM_DASHBOARD.APPROVE_CONFIRM_BULK_ORGS', { 
                      count: approveDialog.users.length, 
                      plural: approveDialog.users.length > 1 ? 's' : '' 
                    })
                  : t('PTM_DASHBOARD.APPROVE_CONFIRM_SINGLE_ORG', { name: approveDialog.user?.name || '' });
              } else {
                return approveDialog.isBulk
                  ? t('PTM_DASHBOARD.APPROVE_CONFIRM_BULK_VOLUNTEERS', { 
                      count: approveDialog.users.length, 
                      plural: approveDialog.users.length > 1 ? 's' : '' 
                    })
                  : t('PTM_DASHBOARD.APPROVE_CONFIRM_SINGLE_VOLUNTEER', { name: approveDialog.user?.name || '' });
              }
            })()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApproveDialog(prev => ({ ...prev, open: false }))} 
            color="inherit"
          >
            {t('PTM_DASHBOARD.CANCEL')}
          </Button>
          <Button
            onClick={() => {
              handleConfirmApprove(approveDialog.users);
              setApproveDialog(prev => ({ ...prev, open: false }));
            }}
            color="success"
            variant="contained"
            disabled={approveDialog.users.some(user => approvingUsers.includes(user.id))}
          >
            {approveDialog.users.some(user => approvingUsers.includes(user.id)) ? t('PTM_DASHBOARD.APPROVING') : t('PTM_DASHBOARD.APPROVE')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={rejectDialog.open}
        onClose={() => setRejectDialog(prev => ({ ...prev, open: false }))}
        aria-labelledby="reject-dialog-title"
        aria-describedby="reject-dialog-description"
      >
        <DialogTitle 
          id="reject-dialog-title"
          sx={{ fontSize: '1.5rem', fontWeight: 600 }}
        >
          {rejectDialog.isBulk ? t('PTM_DASHBOARD.CONFIRM_BULK_REJECTION') : t('PTM_DASHBOARD.CONFIRM_REJECTION')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reject-dialog-description">
            {(() => {
              if (dashboardType === DASHBOARD_TYPE.ORGANISATION) {
                return rejectDialog.isBulk
                  ? t('PTM_DASHBOARD.REJECT_CONFIRM_BULK_ORGS', { 
                      count: rejectDialog.users.length, 
                      plural: rejectDialog.users.length > 1 ? 's' : '' 
                    })
                  : t('PTM_DASHBOARD.REJECT_CONFIRM_SINGLE_ORG', { name: rejectDialog.user?.name || '' });
              } else {
                return rejectDialog.isBulk
                  ? t('PTM_DASHBOARD.REJECT_CONFIRM_BULK_VOLUNTEERS', { 
                      count: rejectDialog.users.length, 
                      plural: rejectDialog.users.length > 1 ? 's' : '' 
                    })
                  : t('PTM_DASHBOARD.REJECT_CONFIRM_SINGLE_VOLUNTEER', { name: rejectDialog.user?.name || '' });
              }
            })()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectDialog(prev => ({ ...prev, open: false }))} 
            color="inherit"
          >
            {t('PTM_DASHBOARD.CANCEL')}
          </Button>
          <Button
            onClick={() => {
              handleConfirmReject(rejectDialog.users);
              setRejectDialog(prev => ({ ...prev, open: false }));
            }}
            color="error"
            variant="contained"
          >
            {t('PTM_DASHBOARD.REJECT')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PTMDashboard;