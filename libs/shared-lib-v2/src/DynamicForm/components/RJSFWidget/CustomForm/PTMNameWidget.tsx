// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  FormControl,
  FormLabel,
  TextField,
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  InputAdornment,
  Paper,
  Popper,
  ClickAwayListener,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  IconButton,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/API/APIEndpoints';
import { fetchActiveAcademicYearId } from '../../../utils/Helper';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

interface User {
  userId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  name: string;
}

interface UserOption {
  label: string;
  value: string;
  region?: string;
}

interface LocationOption {
  value: string;
  label: string;
}

const PTMNameWidget = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
  uiSchema = {},
  options = {},
}: WidgetProps) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [academicYearId, setAcademicYearId] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  // State, District, Block filters
  const [stateOptions, setStateOptions] = useState<LocationOption[]>([]);
  const [districtOptions, setDistrictOptions] = useState<LocationOption[]>([]);
  const [blockOptions, setBlockOptions] = useState<LocationOption[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedBlock, setSelectedBlock] = useState<string>('');
  const [ptmCode, setPtmCode] = useState<string>('');
  const [loadingStates, setLoadingStates] = useState({
    state: false,
    district: false,
    block: false,
  });

  // Get user role and state from localStorage
  const stateId = typeof window !== 'undefined' ? localStorage.getItem('stateId') : null;
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('roleName') : null;
  const isCentralAdmin = userRole === 'Central Lead' || userRole === 'Central Admin';

  const anchorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastSearchQueryRef = useRef<string>('');
  const currentDataSearchQueryRef = useRef<string>('');
  const previousSearchQueryRef = useRef<string>('');
  const previousFiltersRef = useRef<{ state: string; district: string; block: string; ptmCode: string; search: string }>({
    state: '',
    district: '',
    block: '',
    ptmCode: '',
    search: '',
  });

  const limit = 10;

  // Fetch active academic year ID on mount
  useEffect(() => {
    const loadAcademicYear = async () => {
      const yearId = await fetchActiveAcademicYearId();
      setAcademicYearId(yearId);
    };
    loadAcademicYear();
  }, []);

  // Load state options on mount
  useEffect(() => {
    const loadStateOptions = async () => {
      setLoadingStates((prev) => ({ ...prev, state: true }));
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
          {
            fieldName: 'state',
            sort: ['state_name', 'asc'],
          }
        );
        const states =
          response?.data?.result?.values?.map((item) => ({
            value: item.value,
            label: item.label,
          })) || [];
        setStateOptions(states);

        // Set default state from localStorage if available
        if (stateId && !selectedState) {
          const stateExists = states.some((state) => state.value === stateId);
          if (stateExists) {
            setSelectedState(stateId);
          }
        }
      } catch (error) {
        console.error('Error loading states:', error);
        if (stateId && !selectedState) {
          setSelectedState(stateId);
        }
      } finally {
        setLoadingStates((prev) => ({ ...prev, state: false }));
      }
    };
    loadStateOptions();
  }, []);

  // Load district options when state changes
  useEffect(() => {
    const loadDistrictOptions = async () => {
      const stateToUse = selectedState || stateId;
      if (!stateToUse) {
        setDistrictOptions([]);
        setSelectedDistrict('');
        return;
      }

      setLoadingStates((prev) => ({ ...prev, district: true }));
      try {
        const controllingField = !isCentralAdmin && stateId ? [stateId] : [stateToUse];
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
          {
            fieldName: 'district',
            controllingfieldfk: controllingField,
            sort: ['district_name', 'asc'],
          }
        );
        const districts =
          response?.data?.result?.values?.map((item) => ({
            value: item.value,
            label: item.label,
          })) || [];
        setDistrictOptions(districts);
      } catch (error) {
        console.error('Error loading districts:', error);
        setDistrictOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, district: false }));
      }
    };
    loadDistrictOptions();
  }, [selectedState, stateId, isCentralAdmin]);

  // Load block options when district changes
  useEffect(() => {
    const loadBlockOptions = async () => {
      if (!selectedDistrict) {
        setBlockOptions([]);
        setSelectedBlock('');
        return;
      }

      setLoadingStates((prev) => ({ ...prev, block: true }));
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
          {
            fieldName: 'block',
            controllingfieldfk: [selectedDistrict],
            sort: ['block_name', 'asc'],
          }
        );
        const blocks =
          response?.data?.result?.values?.map((item) => ({
            value: item.value,
            label: item.label,
          })) || [];
        setBlockOptions(blocks);
      } catch (error) {
        console.error('Error loading blocks:', error);
        setBlockOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, block: false }));
      }
    };
    loadBlockOptions();
  }, [selectedDistrict]);

  // Format user name: firstName + middleName (if exists) + lastName
  const formatUserName = useCallback((user: User): string => {
    const parts = [user.firstName];
    if (user.middleName) {
      parts.push(user.middleName);
    }
    if (user.lastName) {
      parts.push(user.lastName);
    }
    return parts.join(' ');
  }, []);

  // Format region from customFields array (priority: STATE > DISTRICT > BLOCK)
  const formatRegion = useCallback((user: any): string => {
    const customFields = user.customFields || [];

    // Helper function to get value from customFields by label
    const getFieldValue = (label: string): string | null => {
      const field = customFields.find((field: any) => field.label === label);
      if (field?.selectedValues && field.selectedValues.length > 0) {
        return field.selectedValues[0].value;
      }
      return null;
    };

    // Check in priority order: STATE > DISTRICT > BLOCK
    const stateValue = getFieldValue('STATE');
    if (stateValue) {
      return `${stateValue} Region`;
    }

    const districtValue = getFieldValue('DISTRICT');
    if (districtValue) {
      return `${districtValue} Region`;
    }

    const blockValue = getFieldValue('BLOCK');
    if (blockValue) {
      return `${blockValue} Region`;
    }

    return '';
  }, []);

  // Fetch users from API
  const fetchUsers = useCallback(
    async (searchTerm: string = '', currentOffset: number = 0, append: boolean = false) => {
      if (!academicYearId) {
        return;
      }

      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const tenantId = localStorage.getItem('onboardTenantId') || '';
        const token = localStorage.getItem('token') || '';

        if (!tenantId || !token) {
          setError('Missing tenant ID or token');
          return;
        }

        const requestBody: any = {
          limit,
          offset: currentOffset,
          filters: {
            role: 'Lead', tenantStatus: ["active"]
          },
          sort: ['firstName', 'asc'],
        };

        // Add location filters if selected
        if (selectedState) {
          requestBody.filters.state = [selectedState];
        }
        if (selectedDistrict) {
          requestBody.filters.district = [selectedDistrict];
        }
        if (selectedBlock) {
          requestBody.filters.block = [selectedBlock];
        }
        if (ptmCode && ptmCode.trim()) {
          requestBody.filters.ptm_code = ptmCode.trim();
        }

        // Add search filter if search term exists
        // Note: Adjust filter field based on your API capabilities
        if (searchTerm.trim()) {
          requestBody.filters = {
            ...requestBody.filters,
            name: searchTerm,
          };
        }

        const response = await axios.post(
          API_ENDPOINTS.userList,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              tenantid: tenantId,
              academicyearid: academicYearId,
            },
          }
        );

        const result = response.data?.result || {};
        const fetchedUsers: User[] = result.getUserDetails || [];
        const total = result.totalCount || 0;

        setTotalCount(total);
        setError(null); // Clear any previous errors on successful fetch

        // Transform users to options format
        let userOptions: UserOption[] = fetchedUsers.map((user) => ({
          label: formatUserName(user),
          value: user.userId,
          region: formatRegion(user),
        }));

        // Client-side filtering if search term exists and API doesn't filter properly
        if (searchTerm.trim() && !append) {
          const searchLower = searchTerm.toLowerCase();
          userOptions = userOptions.filter(
            (option) =>
              option.label.toLowerCase().includes(searchLower) ||
              (option.region && option.region.toLowerCase().includes(searchLower))
          );
        }

        if (append) {
          setUsers((prev) => [...prev, ...userOptions]);
        } else {
          setUsers(userOptions);
          // Update the search query that current data corresponds to
          currentDataSearchQueryRef.current = searchTerm;
          // Update the filter state that current data corresponds to
          previousFiltersRef.current = {
            state: selectedState || '',
            district: selectedDistrict || '',
            block: selectedBlock || '',
            ptmCode: ptmCode || '',
            search: searchTerm || '',
          };
        }

        // Check if there are more results
        const newOffset = currentOffset + fetchedUsers.length;
        setHasMore(newOffset < total);
        setOffset(newOffset);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError('API_FAILED');
        if (!append) {
          setUsers([]);
        }
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [academicYearId, selectedState, selectedDistrict, selectedBlock, ptmCode, formatUserName, formatRegion]
  );

  // Fetch users when filters or search change (only when dropdown is open)
  useEffect(() => {
    if (!academicYearId || !open) return;

    // Check if filters or search actually changed
    const currentFilters = {
      state: selectedState || '',
      district: selectedDistrict || '',
      block: selectedBlock || '',
      ptmCode: ptmCode || '',
      search: searchQuery || '',
    };

    const filtersChanged =
      previousFiltersRef.current.state !== currentFilters.state ||
      previousFiltersRef.current.district !== currentFilters.district ||
      previousFiltersRef.current.block !== currentFilters.block ||
      previousFiltersRef.current.ptmCode !== currentFilters.ptmCode ||
      previousFiltersRef.current.search !== currentFilters.search;

    // Only reset pagination when filters/search actually change
    if (filtersChanged) {
      setOffset(0);
      setHasMore(true);
      setTotalCount(0);
      setUsers([]);
      currentDataSearchQueryRef.current = '';

      // Debounce search query changes
      const timeoutId = setTimeout(() => {
        fetchUsers(searchQuery, 0, false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }

    // If filters haven't changed but dropdown just opened and we have no data, fetch initial data
    // This handles the case when dropdown first opens with no previous data
    if (users.length === 0) {
      const timeoutId = setTimeout(() => {
        fetchUsers(searchQuery, 0, false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, selectedState, selectedDistrict, selectedBlock, ptmCode, academicYearId, open, fetchUsers, users.length]);

  // Reset selected item and pagination immediately when user types in search box
  useEffect(() => {
    if (!open) return;

    // Reset if search query changed (user typed something)
    // Skip reset only on very first render when both previous and current are empty
    const isInitialState = previousSearchQueryRef.current === '' && searchQuery === '';

    if (previousSearchQueryRef.current !== searchQuery && !isInitialState) {
      // Reset selected item
      setSelectedUser(null);
      onChange(undefined);
      // Reset pagination state immediately to prevent multiple API calls
      setOffset(0);
      setHasMore(true);
      setTotalCount(0);
      setUsers([]); // Clear existing users to prevent showing old data
      // Don't reset currentDataSearchQueryRef here - let search effect handle it
      // This ensures search effect can detect change even when clearing to empty
    }

    // Update previous search query ref
    previousSearchQueryRef.current = searchQuery;
  }, [searchQuery, open, onChange]);


  // Handle scroll pagination
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

      // Check if current filters match the data we have loaded
      const filtersMatch =
        previousFiltersRef.current.state === (selectedState || '') &&
        previousFiltersRef.current.district === (selectedDistrict || '') &&
        previousFiltersRef.current.block === (selectedBlock || '') &&
        previousFiltersRef.current.ptmCode === (ptmCode || '') &&
        previousFiltersRef.current.search === (searchQuery || '');

      // Only trigger pagination if:
      // 1. Scrolled to bottom
      // 2. Has more data
      // 3. Not currently loading
      // 4. Filters match current data (prevents pagination during filter/search change)
      // 5. Academic year is available
      if (
        bottom &&
        hasMore &&
        !loading &&
        !loadingMore &&
        academicYearId &&
        filtersMatch
      ) {
        fetchUsers(searchQuery, offset, true);
      }
    },
    [hasMore, loading, loadingMore, searchQuery, offset, academicYearId, fetchUsers, selectedState, selectedDistrict, selectedBlock, ptmCode]
  );

  // Set selected user when value changes
  useEffect(() => {
    if (value && users.length > 0) {
      const found = users.find((u) => u.value === value);
      if (found) {
        setSelectedUser(found);
      } else {
        // If value exists but not in current list, we might need to fetch it
        // For now, just set a placeholder
        setSelectedUser({ label: 'Selected', value });
      }
    } else if (!value) {
      setSelectedUser(null);
    }
  }, [value, users]);

  // Handle user selection
  const handleUserSelect = (user: UserOption) => {
    setSelectedUser(user);
    onChange(user.value);
    setOpen(false);
  };

  // Handle dropdown toggle
  const handleToggle = () => {
    if (disabled || readonly) return;
    setOpen((prev) => !prev);
    if (!open) {
      // Focus search input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Handle click away
  const handleClickAway = () => {
    setOpen(false);
  };

  // Handle state change
  const handleStateChange = (event: any) => {
    const newState = event.target.value;
    setSelectedState(newState);
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle district change
  const handleDistrictChange = (event: any) => {
    const newDistrict = event.target.value;
    setSelectedDistrict(newDistrict);
    setSelectedBlock('');
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle block change
  const handleBlockChange = (event: any) => {
    const newBlock = event.target.value;
    setSelectedBlock(newBlock);
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle PTM code change
  const handlePtmCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPtmCode(event.target.value);
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle clear state filter
  const handleClearState = () => {
    if (disabled || readonly || (!isCentralAdmin && stateId)) return;

    // Clear user list and reset pagination
    setUsers([]);
    setOffset(0);
    setHasMore(true);
    setTotalCount(0);
    currentDataSearchQueryRef.current = '';

    setSelectedState('');
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle clear district filter
  const handleClearDistrict = () => {
    if (disabled || readonly || !selectedState) return;

    // Clear user list and reset pagination
    setUsers([]);
    setOffset(0);
    setHasMore(true);
    setTotalCount(0);
    currentDataSearchQueryRef.current = '';

    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle clear block filter
  const handleClearBlock = () => {
    if (disabled || readonly || !selectedDistrict) return;

    // Clear user list and reset pagination
    setUsers([]);
    setOffset(0);
    setHasMore(true);
    setTotalCount(0);
    currentDataSearchQueryRef.current = '';

    setSelectedBlock('');
    setSelectedUser(null);
    onChange(undefined);
  };

  // Handle clear PTM code filter
  const handleClearPtmCode = () => {
    if (disabled || readonly) return;

    // Clear user list and reset pagination
    setUsers([]);
    setOffset(0);
    setHasMore(true);
    setTotalCount(0);
    currentDataSearchQueryRef.current = '';

    setPtmCode('');
    setSelectedUser(null);
    onChange(undefined);
  };

  return (
    <Box>
      <Typography
        variant="h1"
        sx={{
          fontWeight: 600,
          marginBottom: 1,
          color: 'black',
        }}
      >
        {t('FORM.PTM_SELECTION', { defaultValue: 'PTM Selection' })}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: 2,
          color: 'grey',
        }}
      >
        {t('FORM.COMPLETE_YOUR_REGISTRATION', { defaultValue: 'Complete your registration.' })}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          marginBottom: 1,
          color: 'grey',
        }}
      >
        {t('FORM.FIND_YOUR_REGISTRED_ORGANISATION', { defaultValue: 'Select your PTM (Pratham Team Member) for the Summer Camp program.' })}
      </Typography>
      {/* State, District, Block Filters - 3 in one row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* State Dropdown */}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id={`${id}-state-label`}>
                {t('FORM.STATE', { defaultValue: 'State' })}
              </InputLabel>
              <Select
                labelId={`${id}-state-label`}
                value={selectedState}
                onChange={handleStateChange}
                label={t('FORM.STATE', { defaultValue: 'State' })}
                disabled={disabled || readonly || loadingStates.state || (!isCentralAdmin && stateId)}
              >
                {loadingStates.state ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  stateOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {selectedState && !disabled && !readonly && (isCentralAdmin || !stateId) && (
              <IconButton
                size="small"
                onClick={handleClearState}
                sx={{
                  mt: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'error.light',
                  },
                }}
                aria-label="Clear state"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Grid>

        {/* District Dropdown */}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id={`${id}-district-label`}>
                {t('FORM.DISTRICT', { defaultValue: 'District' })}
              </InputLabel>
              <Select
                labelId={`${id}-district-label`}
                value={selectedDistrict}
                onChange={handleDistrictChange}
                label={t('FORM.DISTRICT', { defaultValue: 'District' })}
                disabled={disabled || readonly || !selectedState || loadingStates.district}
              >
                {loadingStates.district ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  districtOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {selectedDistrict && !disabled && !readonly && selectedState && (
              <IconButton
                size="small"
                onClick={handleClearDistrict}
                sx={{
                  mt: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'error.light',
                  },
                }}
                aria-label="Clear district"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Grid>

        {/* Block Dropdown */}
        <Grid item xs={12} sm={12} md={4}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id={`${id}-block-label`}>
                {t('FORM.BLOCK', { defaultValue: 'Block' })}
              </InputLabel>
              <Select
                labelId={`${id}-block-label`}
                value={selectedBlock}
                onChange={handleBlockChange}
                label={t('FORM.BLOCK', { defaultValue: 'Block' })}
                disabled={disabled || readonly || !selectedDistrict || loadingStates.block}
              >
                {loadingStates.block ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} />
                  </MenuItem>
                ) : (
                  blockOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
            {selectedBlock && !disabled && !readonly && selectedDistrict && (
              <IconButton
                size="small"
                onClick={handleClearBlock}
                sx={{
                  mt: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'error.light',
                  },
                }}
                aria-label="Clear block"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Grid>

      </Grid>

      {/* PTM Code TextField - Full Width on Next Line */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              fullWidth
              label={t('FORM.PTM_CODE', { defaultValue: 'PTM Code (Optional)' })}
              value={ptmCode}
              onChange={handlePtmCodeChange}
              disabled={disabled || readonly}
              placeholder={t('FORM.PTM_CODE_PLACEHOLDER', { defaultValue: 'Enter PTM code for exact match' })}
            />
            {ptmCode && !disabled && !readonly && (
              <IconButton
                size="small"
                onClick={handleClearPtmCode}
                sx={{
                  mt: 1,
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'error.main',
                    backgroundColor: 'error.light',
                  },
                }}
                aria-label="Clear PTM code"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>

      <FormControl
        fullWidth
        required={required}
        error={rawErrors.length > 0}
        disabled={disabled || readonly}
      >
        <FormLabel
          sx={{
            color: 'black',
            marginBottom: 1,
            fontWeight: 600,
            fontSize: '1rem',
            '&.Mui-error': {
              color: 'black',
            },
            '&.Mui-disabled': {
              color: 'black',
            },
          }}
        >
          {t('FORM.PTM_NAME', { defaultValue: label || 'PTM Name' })}
        </FormLabel>

        {/* Hidden input for form validation */}
        <input
          name={id}
          id={`${id}-hidden`}
          value={value || ''}
          required={required}
          onChange={() => { }}
          tabIndex={-1}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
            width: '1px',
            height: '1px',
            padding: 0,
            border: 0,
            margin: 0,
            clip: 'rect(0, 0, 0, 0)',
            overflow: 'hidden', marginLeft: 50, marginTop: 20,
          }}
          aria-hidden="true"
        />

        {/* Main input field */}
        <Box
          ref={anchorRef}
          onClick={handleToggle}
          sx={{
            position: 'relative',
            cursor: disabled || readonly ? 'default' : 'pointer',
          }}
        >
          <TextField
            fullWidth
            placeholder={t('FORM.SEARCH_AND_SELECT_PTM', { defaultValue: 'Search and select PTM' })}
            value={selectedUser ? selectedUser.label : ''}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  {open ? (
                    <KeyboardArrowUpIcon sx={{ color: '#757575', fontSize: '1.25rem' }} />
                  ) : (
                    <KeyboardArrowDownIcon sx={{ color: '#757575', fontSize: '1.25rem' }} />
                  )}
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#f5f5f5',
                cursor: disabled || readonly ? 'default' : 'pointer',
                borderRadius: '4px',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e0e0e0',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: disabled || readonly ? '#e0e0e0' : '#bdbdbd',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#bdbdbd',
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
              },
            }}
          />
        </Box>

        {/* Dropdown Popper */}
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300, width: anchorRef.current?.clientWidth }}
        >
          <ClickAwayListener onClickAway={handleClickAway}>
            <Paper
              elevation={8}
              sx={{
                width: '100%',
                maxHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                mt: 0.5,
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              {/* Search input inside dropdown */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <TextField
                  inputRef={searchInputRef}
                  fullWidth
                  placeholder={t('FORM.SEARCH', { defaultValue: 'Search...' })}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#757575', fontSize: '1.25rem' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                    },
                  }}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '4px',
                    },
                  }}
                />
              </Box>

              {/* User list */}
              <Box
                ref={listRef}
                onScroll={handleScroll}
                sx={{
                  overflowY: 'auto',
                  maxHeight: '300px',
                  flex: 1,
                }}
              >
                {loading && users.length === 0 && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                  >
                    <CircularProgress size={24} />
                  </Box>
                )}

                {!loading && (error || users.length === 0) && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2, textAlign: 'center' }}
                  >
                    {t('FORM.NO_USER_DATA_FOUND', { defaultValue: 'No user data found' })}
                  </Typography>
                )}

                {users.length > 0 && (
                  <List sx={{ p: 0 }}>
                    {users.map((user) => (
                      <ListItem key={user.value} disablePadding>
                        <ListItemButton
                          onClick={() => handleUserSelect(user)}
                          selected={selectedUser?.value === user.value}
                          sx={{
                            px: 2,
                            py: 1.5,
                            '&.Mui-selected': {
                              backgroundColor: '#e3f2fd',
                              '&:hover': {
                                backgroundColor: '#bbdefb',
                              },
                            },
                            '&:hover': {
                              backgroundColor: '#f5f5f5',
                            },
                          }}
                        >
                          <ListItemText
                            primary={`${user.label}${user.region ? ` - ${user.region}` : ''}`}
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: selectedUser?.value === user.value ? 500 : 400,
                                fontSize: '0.9375rem',
                                color: '#212121',
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                    {loadingMore && (
                      <ListItem disablePadding>
                        <Box
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                          width="100%"
                          py={2}
                        >
                          <CircularProgress size={20} />
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            {t('FORM.LOADING_MORE', { defaultValue: 'Loading more...' })}
                          </Typography>
                        </Box>
                      </ListItem>
                    )}
                  </List>
                )}
              </Box>
            </Paper>
          </ClickAwayListener>
        </Popper>

        {/* {rawErrors.length > 0 && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
            {rawErrors[0]}
          </Typography>
        )} */}
      </FormControl>
    </Box>
  );
};

export default PTMNameWidget;

