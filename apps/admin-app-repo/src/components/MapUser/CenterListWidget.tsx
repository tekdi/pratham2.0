// @ts-nocheck
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  Autocomplete,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Box,
  Grid,
  CircularProgress,
  Typography,
} from '@mui/material';
import axios from 'axios';

interface CenterListWidgetProps {
  value?: string | string[]; // Center ID(s) - can be string or array
  onChange?: (centerId: string | string[] | null) => void; // Callback with center ID(s)
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiple?: boolean; // Allow multiple center selection
  initialState?: string; // Initial state ID
  initialDistrict?: string; // Initial district ID
  initialBlock?: string; // Initial block ID
}

const CenterListWidget: React.FC<CenterListWidgetProps> = ({
  value = null,
  onChange,
  label = 'Search and Select Center',
  required = false,
  error = false,
  helperText,
  disabled = false,
  multiple = false,
  initialState = null,
  initialDistrict = null,
  initialBlock = null,
}) => {
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [centerOptions, setCenterOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    state: false,
    district: false,
    block: false,
    centers: false,
  });

  const [selectedState, setSelectedState] = useState(initialState || '');
  const [selectedDistrict, setSelectedDistrict] = useState(
    initialDistrict || ''
  );
  const [selectedBlock, setSelectedBlock] = useState(initialBlock || '');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');

  // Ref to track if we're selecting a center to prevent unnecessary API calls
  const isSelectingCenterRef = useRef(false);
  // Refs to store district and block IDs from prefilled center details
  const pendingDistrictIdRef = useRef(null);
  const pendingBlockIdRef = useRef(null);
  // Ref to track if we've already fetched center details for the current value
  const fetchedCenterDetailsRef = useRef(null);

  // Get user role and state from localStorage
  const stateId =
    typeof window !== 'undefined' ? localStorage.getItem('stateId') : null;
  const userRole =
    typeof window !== 'undefined' ? localStorage.getItem('roleName') : null;
  const isCentralAdmin =
    userRole === 'Central Lead' || userRole === 'Central Admin';

  // Load state options on mount, then set default from localStorage
  useEffect(() => {
    let isMounted = true;

    const loadStateOptions = async () => {
      if (!isMounted) return;
      setLoadingStates((prev) => ({ ...prev, state: true }));

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
          {
            fieldName: 'state',
            sort: ['state_name', 'asc'],
          }
        );

        if (!isMounted) return;

        // Normalize values to strings for consistent comparison
        const states =
          response?.data?.result?.values?.map((item) => ({
            value: String(item.value || ''),
            label: item.label || '',
          })) || [];

        console.log('Loaded states:', states);
        setStateOptions(states);

        // After loading states, set default from localStorage if found
        // Only set if not already set
        setSelectedState((prevSelectedState) => {
          const currentSelectedState = prevSelectedState
            ? String(prevSelectedState)
            : '';
          const currentStateId = stateId ? String(stateId) : null;
          const currentInitialState = initialState
            ? String(initialState)
            : null;

          if (currentSelectedState) {
            // Already has a value, keep it
            return prevSelectedState;
          }

          if (currentStateId && !currentInitialState) {
            // Check if the stateId exists in the loaded states (compare as strings)
            const stateExists = states.some(
              (state) => String(state.value) === currentStateId
            );
            if (stateExists) {
              return currentStateId;
            }
          } else if (currentInitialState) {
            return currentInitialState;
          }

          return prevSelectedState;
        });
      } catch (error) {
        console.error('Error loading states:', error);
        if (!isMounted) return;

        setStateOptions([]); // Set empty array on error

        // On error, still set stateId if available to prevent stuck loading
        setSelectedState((prevSelectedState) => {
          const currentSelectedState = prevSelectedState
            ? String(prevSelectedState)
            : '';
          const currentStateId = stateId ? String(stateId) : null;
          const currentInitialState = initialState
            ? String(initialState)
            : null;

          if (currentSelectedState) {
            return prevSelectedState;
          }

          if (currentStateId && !currentInitialState) {
            return currentStateId;
          } else if (currentInitialState) {
            return currentInitialState;
          }

          return prevSelectedState;
        });
      } finally {
        if (isMounted) {
          // Always ensure loading is set to false
          setLoadingStates((prev) => ({ ...prev, state: false }));
        }
      }
    };

    loadStateOptions();

    return () => {
      isMounted = false;
    };
  }, []); // Only run on mount

  // Fetch center details when center ID is prefilled to auto-populate state/district/block
  useEffect(() => {
    const fetchCenterDetails = async () => {
      // Check if we have a center ID but state/district/block are not set
      const centerId = Array.isArray(value) ? value[0] : value;

      if (!centerId || !centerId.toString().trim()) {
        fetchedCenterDetailsRef.current = null;
        return;
      }

      // Skip if we've already fetched details for this center ID
      if (fetchedCenterDetailsRef.current === centerId.toString()) {
        return;
      }

      // Only fetch if state is not already set (to avoid unnecessary API calls)
      if (selectedState) {
        return;
      }

      setLoadingStates((prev) => ({ ...prev, centers: true }));
      try {
        const tenantId = localStorage.getItem('tenantId') || '';
        const token = localStorage.getItem('token') || '';
        const academicYearId = localStorage.getItem('academicYearId') || '';

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
          {
            limit: 10,
            offset: 0,
            filters: {
              cohortId: centerId.toString(),
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

        const centerDetails =
          response?.data?.result?.results?.cohortDetails?.[0];

        if (centerDetails) {
          // Extract state, district, block from customFields
          const customFields = centerDetails.customFields || [];

          const stateField = customFields.find(
            (field) => field.label === 'STATE'
          );
          const districtField = customFields.find(
            (field) => field.label === 'DISTRICT'
          );
          const blockField = customFields.find(
            (field) => field.label === 'BLOCK'
          );

          // Set state
          if (stateField?.selectedValues?.[0]?.id && !selectedState) {
            const stateId = stateField.selectedValues[0].id.toString();
            setSelectedState(stateId);
          }

          // Store district ID to set after districts load
          if (districtField?.selectedValues?.[0]?.id) {
            pendingDistrictIdRef.current =
              districtField.selectedValues[0].id.toString();
          }

          // Store block ID to set after blocks load
          if (blockField?.selectedValues?.[0]?.id) {
            pendingBlockIdRef.current =
              blockField.selectedValues[0].id.toString();
          }

          // Set center name in selectedCenter
          if (centerDetails.name) {
            if (multiple) {
              setSelectedCenter([
                {
                  value: centerId,
                  label: centerDetails.name,
                },
              ]);
            } else {
              setSelectedCenter({
                value: centerId,
                label: centerDetails.name,
              });
            }
          }

          // Mark as fetched
          fetchedCenterDetailsRef.current = centerId.toString();
        }
      } catch (error) {
        console.error('Error fetching center details:', error);
      } finally {
        setLoadingStates((prev) => ({ ...prev, centers: false }));
      }
    };

    fetchCenterDetails();
  }, [value, selectedState, multiple]);

  // Load district options when state changes
  useEffect(() => {
    const loadDistrictOptions = async () => {
      // Determine which state to use for loading districts
      const stateToUse = selectedState || stateId;

      if (!stateToUse) {
        setDistrictOptions([]);
        setSelectedDistrict('');
        return;
      }

      setLoadingStates((prev) => ({ ...prev, district: true }));
      try {
        // For non-central admin, always use stateId from localStorage
        // For central admin, use selectedState
        const controllingField =
          !isCentralAdmin && stateId ? [stateId] : [stateToUse];

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

        // Set pending district if available
        if (
          pendingDistrictIdRef.current &&
          !selectedDistrict &&
          !initialDistrict
        ) {
          const pendingDistrictId = pendingDistrictIdRef.current;
          const districtExists = districts.some(
            (d) => String(d.value) === String(pendingDistrictId)
          );
          if (districtExists) {
            setSelectedDistrict(pendingDistrictId);
            pendingDistrictIdRef.current = null;
          }
        } else if (initialDistrict && !selectedDistrict) {
          setSelectedDistrict(initialDistrict);
        }
      } catch (error) {
        console.error('Error loading districts:', error);
        setDistrictOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, district: false }));
      }
    };
    loadDistrictOptions();
  }, [selectedState, stateId, isCentralAdmin, initialDistrict]);

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

        // Set pending block if available
        if (pendingBlockIdRef.current && !selectedBlock && !initialBlock) {
          const pendingBlockId = pendingBlockIdRef.current;
          const blockExists = blocks.some(
            (b) => String(b.value) === String(pendingBlockId)
          );
          if (blockExists) {
            setSelectedBlock(pendingBlockId);
            pendingBlockIdRef.current = null;
          }
        } else if (initialBlock && !selectedBlock) {
          setSelectedBlock(initialBlock);
        }
      } catch (error) {
        console.error('Error loading blocks:', error);
        setBlockOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, block: false }));
      }
    };
    loadBlockOptions();
  }, [selectedDistrict, initialBlock]);

  // Search centers when state, district, block, or search keyword changes
  const searchCenters = useCallback(async () => {
    // Only search if we have at least state selected
    if (!selectedState) {
      setCenterOptions([]);
      return;
    }

    setLoadingStates((prev) => ({ ...prev, centers: true }));
    try {
      const tenantId = localStorage.getItem('tenantId') || '';
      const token = localStorage.getItem('token') || '';
      const academicYearId = localStorage.getItem('academicYearId') || '';

      const filters = {
        type: 'COHORT',
        status: ['active'],
      };

      if (selectedState) {
        filters.state = [selectedState];
      }
      if (selectedDistrict) {
        filters.district = [selectedDistrict];
      }
      if (selectedBlock) {
        filters.block = [selectedBlock];
      }

      const payload = {
        limit: 200,
        offset: 0,
        filters,
        ...(searchKeyword && { name: searchKeyword }),
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            tenantId: tenantId,
            Authorization: `Bearer ${token}`,
            academicyearid: academicYearId,
          },
        }
      );

      const centers =
        response?.data?.result?.results?.cohortDetails
          ?.map((item) => {
            if (!item || !item.cohortId) return null;
            return {
              value: item.cohortId,
              label: item.name || '',
            };
          })
          .filter((item) => item !== null) || [];
      setCenterOptions(centers);
    } catch (error) {
      console.error('Error searching centers:', error);
      setCenterOptions([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, centers: false }));
    }
  }, [selectedState, selectedDistrict, selectedBlock, searchKeyword]);

  // Debounced search for centers - only when search parameters change
  useEffect(() => {
    // Don't search if no state is selected or if we're in the middle of selecting a center
    if (!selectedState || isSelectingCenterRef.current) {
      return;
    }

    // Don't search if searchKeyword is empty and we have a selected center
    // This prevents unnecessary API calls when clearing search after selection
    if (!searchKeyword && selectedCenter) {
      return;
    }

    const timeoutId = setTimeout(() => {
      // Double check the flag before making the API call
      if (!isSelectingCenterRef.current) {
        searchCenters();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    searchKeyword,
    selectedCenter,
    searchCenters,
  ]);

  // Sync selectedCenter with value prop when value or centerOptions change
  useEffect(() => {
    // Skip if we're in the middle of selecting (to avoid conflicts)
    if (isSelectingCenterRef.current) {
      return;
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (selectedCenter) {
        setSelectedCenter(null);
      }
      return;
    }

    const centerIds = Array.isArray(value) ? value : [value];

    if (multiple) {
      // For multiple selection
      if (centerOptions && centerOptions.length > 0) {
        const foundCenters = centerIds
          .map((centerId) => {
            const centerIdStr = String(centerId);
            const found = centerOptions.find(
              (center) => center && String(center.value) === centerIdStr
            );
            return found || { value: centerId, label: `Center ${centerId}` };
          })
          .filter(Boolean);
        setSelectedCenter(foundCenters);
      } else {
        // Create placeholders
        const placeholders = centerIds.map((centerId) => ({
          value: centerId,
          label: `Center ${centerId}`,
        }));
        setSelectedCenter(placeholders);
      }
    } else {
      // For single selection
      const centerId = centerIds[0];
      const centerIdStr = String(centerId);

      // Check if we already have the correct center selected
      if (
        selectedCenter &&
        !Array.isArray(selectedCenter) &&
        String(selectedCenter.value) === centerIdStr
      ) {
        return;
      }

      // Find the center object that matches the value
      if (centerOptions && centerOptions.length > 0) {
        const foundCenter = centerOptions.find(
          (center) => center && String(center.value) === centerIdStr
        );

        if (foundCenter) {
          setSelectedCenter(foundCenter);
        } else {
          // Center not found in current options - might be filtered out
          // Keep the existing selectedCenter if it matches the value
          if (
            !selectedCenter ||
            Array.isArray(selectedCenter) ||
            String(selectedCenter.value) !== centerIdStr
          ) {
            // Create a placeholder until options are loaded
            setSelectedCenter({
              value: centerId,
              label: `Center ${centerId}`,
            });
          }
        }
      } else if (centerId) {
        // If centerOptions is empty but we have a value, create a placeholder
        if (
          !selectedCenter ||
          Array.isArray(selectedCenter) ||
          String(selectedCenter.value) !== centerIdStr
        ) {
          setSelectedCenter({
            value: centerId,
            label: `Center ${centerId}`,
          });
        }
      }
    }
  }, [value, centerOptions, selectedCenter, multiple]);

  const handleStateChange = (event) => {
    const newState = String(event.target.value || '');
    setSelectedState(newState);
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedCenter(null);
    setSearchKeyword('');
    setAutocompleteInputValue('');
    if (onChange) {
      onChange(null);
    }
  };

  const handleDistrictChange = (event) => {
    const newDistrict = event.target.value;
    setSelectedDistrict(newDistrict);
    setSelectedBlock('');
    setSelectedCenter(null);
    setSearchKeyword('');
    setAutocompleteInputValue('');
    if (onChange) {
      onChange(null);
    }
  };

  const handleBlockChange = (event) => {
    const newBlock = event.target.value;
    setSelectedBlock(newBlock);
    setSelectedCenter(null);
    setSearchKeyword('');
    setAutocompleteInputValue('');
    if (onChange) {
      onChange(null);
    }
  };

  const handleAutocompleteInputChange = (event, newInputValue, reason) => {
    // Handle different input change reasons
    if (reason === 'input') {
      // User is typing - update input value and search keyword
      setAutocompleteInputValue(newInputValue);
      setSearchKeyword(newInputValue);
    } else if (reason === 'clear') {
      // User clicked clear button
      setAutocompleteInputValue('');
      setSearchKeyword('');
      setSelectedCenter(null);
      if (onChange) {
        onChange(null);
      }
    } else if (reason === 'reset') {
      // Reset after selection - don't update input value, let it show selected value
      // Only clear if there's no selection
      if (!selectedCenter && !value) {
        setAutocompleteInputValue('');
        setSearchKeyword('');
      }
    }
  };

  const handleCenterChange = (event, newValue) => {
    // Set flag to prevent API calls during selection
    isSelectingCenterRef.current = true;

    if (newValue) {
      // Ensure we have a valid center object
      setSelectedCenter(newValue);

      if (multiple) {
        const centerIds = Array.isArray(newValue)
          ? newValue.map((c) => c.value)
          : [newValue.value];
        if (onChange) {
          onChange(centerIds);
        }
      } else {
        const centerId = Array.isArray(newValue)
          ? newValue[0]?.value
          : newValue.value;
        if (onChange) {
          onChange(centerId);
        }
      }

      // Clear search keyword when center is selected to prevent unnecessary API calls
      setSearchKeyword('');
      // Clear autocompleteInputValue so Autocomplete can display the selected value naturally
      setAutocompleteInputValue('');
    } else {
      setSelectedCenter(null);
      if (onChange) {
        onChange(null);
      }
      setSearchKeyword('');
      setAutocompleteInputValue('');
    }

    // Reset flag after a short delay to allow state updates to complete
    setTimeout(() => {
      isSelectingCenterRef.current = false;
    }, 200);
  };

  // Get selected center options for display
  const selectedCenterOptions = useMemo(() => {
    if (!value) return [];
    if (!centerOptions || !Array.isArray(centerOptions)) return [];

    const centerIds = Array.isArray(value) ? value : [value];
    const selected = centerOptions.filter((center) => {
      if (!center || !center.value) return false;
      return centerIds.includes(center.value);
    });

    return selected;
  }, [value, centerOptions]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
      <Grid item xs={12}>
      <Typography variant="body1" color="text.secondary">
          Center Allocation
        </Typography>
        </Grid>
        {/* State Dropdown */}
        <Grid item xs={12}>
          <FormControl fullWidth required={required}>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              value={selectedState || ''}
              onChange={handleStateChange}
              label="State"
              disabled={
                disabled || loadingStates.state || (!isCentralAdmin && stateId)
              }
              displayEmpty
            >
              {loadingStates.state ? (
                <MenuItem disabled>
                  <CircularProgress size={20} />
                </MenuItem>
              ) : stateOptions.length === 0 ? (
                <MenuItem disabled>No states available</MenuItem>
              ) : (
                stateOptions.map((option) => (
                  <MenuItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* District Dropdown */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="district-label">District</InputLabel>
            <Select
              labelId="district-label"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              label="District"
              disabled={disabled || !selectedState || loadingStates.district}
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
        </Grid>

        {/* Block Dropdown */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="block-label">Block</InputLabel>
            <Select
              labelId="block-label"
              value={selectedBlock}
              onChange={handleBlockChange}
              label="Block"
              disabled={disabled || !selectedDistrict || loadingStates.block}
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
        </Grid>

        {/* Center Autocomplete with integrated search */}
        <Grid item xs={12}>
          <FormControl fullWidth required={required} error={error}>
            <Autocomplete
              multiple={multiple}
              options={
                // Ensure selected center is always in options list
                (() => {
                  const options = centerOptions || [];
                  if (
                    selectedCenter &&
                    !multiple &&
                    !Array.isArray(selectedCenter)
                  ) {
                    const exists = options.some(
                      (opt) =>
                        opt &&
                        String(opt.value) === String(selectedCenter.value)
                    );
                    if (!exists && selectedCenter.value) {
                      return [selectedCenter, ...options];
                    }
                  }
                  return options;
                })()
              }
              value={
                multiple
                  ? Array.isArray(selectedCenter)
                    ? selectedCenter
                    : []
                  : selectedCenter || null
              }
              onChange={handleCenterChange}
              onInputChange={handleAutocompleteInputChange}
              inputValue={
                // Control inputValue only when user is actively typing/searching
                // When a center is selected, let Autocomplete handle the display naturally
                searchKeyword ? autocompleteInputValue : undefined
              }
              loading={loadingStates.centers}
              getOptionLabel={(option) => {
                if (!option) return '';
                return option.label || option?.name || '';
              }}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                // Compare values as strings to handle type mismatches
                return String(option.value) === String(value.value);
              }}
              filterOptions={(options, state) => {
                // Filter options safely
                if (!options || !Array.isArray(options)) return [];
                const inputValue = state.inputValue || '';
                if (!inputValue) return options;

                return options.filter((option) => {
                  if (!option || !option.label) return false;
                  return option.label
                    .toLowerCase()
                    .includes(inputValue.toLowerCase());
                });
              }}
              disabled={disabled || !selectedState || loadingStates.centers}
              freeSolo={false}
              clearOnBlur={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  placeholder={
                    loadingStates.centers
                      ? 'Loading centers...'
                      : 'Type to search centers...'
                  }
                  required={required}
                  error={error}
                  helperText={
                    helperText ||
                    (loadingStates.centers
                      ? 'Loading centers...'
                      : 'Type to search for centers')
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingStates.centers ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CenterListWidget;
