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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import API_ENDPOINTS from '../../../utils/API/APIEndpoints';
import { fetchActiveAcademicYearId } from '../../../utils/Helper';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

interface CohortDetail {
  cohortId: string;
  name: string;
  status: string;
  type: string;
}

interface OrganizationOption {
  label: string;
  value: string;
}

const OrganizationSearchWidget = ({
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
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationOption | null>(null);
  const [academicYearId, setAcademicYearId] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const anchorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastSearchQueryRef = useRef<string>('');
  const currentDataSearchQueryRef = useRef<string>('');
  const previousSearchQueryRef = useRef<string>('');

  const limit = 10;

  // Fetch active academic year ID on mount
  useEffect(() => {
    const loadAcademicYear = async () => {
      const yearId = await fetchActiveAcademicYearId();
      setAcademicYearId(yearId);
    };
    loadAcademicYear();
  }, []);

  // Fetch organizations from API
  const fetchOrganizations = useCallback(
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
          sort: ['name', 'asc'],
          filters: {
            type: 'COHORT',
            status: ["active"]
          },
        };

        // Add search filter if search term exists
        if (searchTerm.trim()) {
          requestBody.filters = {
            ...requestBody.filters,
            name: searchTerm,
          };
        }

        const response = await axios.post(
          API_ENDPOINTS.cohortSearch,
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
        const cohortDetails: CohortDetail[] = result.results?.cohortDetails || [];
        const total = result.count || 0;

        setTotalCount(total);
        setError(null); // Clear any previous errors on successful fetch

        // Transform organizations to options format - only include active ones
        let organizationOptions: OrganizationOption[] = cohortDetails
          .filter((cohort) => cohort.status === 'active')
          .map((cohort) => ({
            label: cohort.name,
            value: cohort.cohortId,
          }));

        // Client-side filtering if search term exists and API doesn't filter properly
        if (searchTerm.trim() && !append) {
          const searchLower = searchTerm.toLowerCase();
          organizationOptions = organizationOptions.filter((option) =>
            option.label.toLowerCase().includes(searchLower)
          );
        }

        if (append) {
          setOrganizations((prev) => [...prev, ...organizationOptions]);
        } else {
          setOrganizations(organizationOptions);
          // Update the search query that current data corresponds to
          currentDataSearchQueryRef.current = searchTerm;
        }

        // Check if there are more results
        const newOffset = currentOffset + organizationOptions.length;
        setHasMore(newOffset < total);
        setOffset(newOffset);
      } catch (err: any) {
        console.error('Error fetching organizations:', err);
        setError('API_FAILED');
        if (!append) {
          setOrganizations([]);
        }
      } finally {
        if (append) {
          setLoadingMore(false);
        } else {
          setLoading(false);
        }
      }
    },
    [academicYearId]
  );

  // Initial load - only fetch when dropdown first opens if no data exists
  useEffect(() => {
    if (academicYearId && open) {
      // Only fetch on initial open if we have no data
      // Don't fetch if search is being handled by search effect
      if (organizations.length === 0 && currentDataSearchQueryRef.current === '') {
        lastSearchQueryRef.current = searchQuery;
        fetchOrganizations(searchQuery, 0, false);
      }
    }
  }, [academicYearId, open, fetchOrganizations]);

  // Reset selected item and pagination immediately when user types in search box
  useEffect(() => {
    if (!open) return;

    // Reset if search query changed (user typed something)
    // Skip reset only on very first render when both previous and current are empty
    const isInitialState = previousSearchQueryRef.current === '' && searchQuery === '';

    if (previousSearchQueryRef.current !== searchQuery && !isInitialState) {
      // Reset selected item
      setSelectedOrganization(null);
      onChange(undefined);
      // Reset pagination state immediately to prevent multiple API calls
      setOffset(0);
      setHasMore(true);
      setTotalCount(0);
      setOrganizations([]); // Clear existing organizations to prevent showing old data
      // Don't reset currentDataSearchQueryRef here - let search effect handle it
      // This ensures search effect can detect change even when clearing to empty
    }

    // Update previous search query ref
    previousSearchQueryRef.current = searchQuery;
  }, [searchQuery, open, onChange]);

  // Handle search with debounce - fetch organizations when search changes
  useEffect(() => {
    if (!open || !academicYearId) return;

    // Only trigger if search query actually changed from what we last fetched
    if (currentDataSearchQueryRef.current === searchQuery) return;

    const timeoutId = setTimeout(() => {
      // Fetch only first page (offset 0) when search changes
      lastSearchQueryRef.current = searchQuery;
      fetchOrganizations(searchQuery, 0, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, open, academicYearId, fetchOrganizations]);

  // Handle scroll pagination
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 50;

      // Only trigger pagination if:
      // 1. Scrolled to bottom
      // 2. Has more data
      // 3. Not currently loading
      // 4. Search query matches current data (prevents pagination during search change)
      // 5. Academic year is available
      if (
        bottom &&
        hasMore &&
        !loading &&
        !loadingMore &&
        academicYearId &&
        currentDataSearchQueryRef.current === searchQuery
      ) {
        fetchOrganizations(searchQuery, offset, true);
      }
    },
    [hasMore, loading, loadingMore, searchQuery, offset, academicYearId, fetchOrganizations]
  );

  // Set selected organization when value changes
  useEffect(() => {
    if (value && organizations.length > 0) {
      const found = organizations.find((org) => org.value === value);
      if (found) {
        setSelectedOrganization(found);
      } else {
        // If value exists but not in current list, we might need to fetch it
        // For now, just set a placeholder
        setSelectedOrganization({ label: 'Selected', value });
      }
    } else if (!value) {
      setSelectedOrganization(null);
    }
  }, [value, organizations]);

  // Handle organization selection
  const handleOrganizationSelect = (organization: OrganizationOption) => {
    setSelectedOrganization(organization);
    onChange(organization.value);
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

  return (
    <Box>
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
          {t('FORM.ORGANISATION_NAME', { defaultValue: label || 'Organisation Name' })}
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
            placeholder={t('FORM.SEARCH_AND_SELECT_ORGANISATION', { defaultValue: 'Search and select your organisation' })}
            value={selectedOrganization ? selectedOrganization.label : ''}
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

              {/* Organization list */}
              <Box
                ref={listRef}
                onScroll={handleScroll}
                sx={{
                  overflowY: 'auto',
                  maxHeight: '300px',
                  flex: 1,
                }}
              >
                {loading && organizations.length === 0 && (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={3}
                  >
                    <CircularProgress size={24} />
                  </Box>
                )}

                {!loading && (error || organizations.length === 0) && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ p: 2, textAlign: 'center' }}
                  >
                    {t('FORM.NO_ORGANISATION_DATA_FOUND', { defaultValue: 'No organisation data found' })}
                  </Typography>
                )}

                {organizations.length > 0 && (
                  <List sx={{ p: 0 }}>
                    {organizations.map((organization) => (
                      <ListItem key={organization.value} disablePadding>
                        <ListItemButton
                          onClick={() => handleOrganizationSelect(organization)}
                          selected={selectedOrganization?.value === organization.value}
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
                            primary={organization.label}
                            primaryTypographyProps={{
                              sx: {
                                fontWeight: selectedOrganization?.value === organization.value ? 500 : 400,
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

export default OrganizationSearchWidget;

