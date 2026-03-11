// @ts-nocheck
import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
  } from 'react';
  import { WidgetProps } from '@rjsf/utils';
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
  } from '@mui/material';
  import axios from 'axios';
  import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';
  
  const CustomCenterListWidget = ({
    id,
    value = [],
    required,
    label,
    onChange,
    schema,
    uiSchema,
    rawErrors = [],
    formContext,
    registry,
  }) => {
    const { t } = useTranslation();
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
  
    // Get form data from formContext or registry
    const getFormData = () => {
      if (formContext?.formData) {
        return formContext.formData;
      }
      if (registry?.formContext?.formData) {
        return registry.formContext.formData;
      }
      return {};
    };
  
    const formData = getFormData();
    const [selectedState, setSelectedState] = useState(formData.state?.[0] || '');
    const [selectedDistrict, setSelectedDistrict] = useState(
      formData.district?.[0] || ''
    );
    const [selectedBlock, setSelectedBlock] = useState(formData.block?.[0] || '');
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
  
          // After loading states, set default from localStorage if found
          if (stateId && !selectedState) {
            // Check if the stateId exists in the loaded states
            const stateExists = states.some((state) => state.value === stateId);
            if (stateExists) {
              setSelectedState(stateId);
            }
          }
        } catch (error) {
          console.error('Error loading states:', error);
          // On error, still set stateId if available to prevent stuck loading
          if (stateId && !selectedState) {
            setSelectedState(stateId);
          }
        } finally {
          // Always ensure loading is set to false
          setLoadingStates((prev) => ({ ...prev, state: false }));
        }
      };
      loadStateOptions();
    }, []);
  
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
              setSelectedCenter({
                value: centerId,
                label: centerDetails.name,
              });
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
    }, [value, selectedState]);
  
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
          if (pendingDistrictIdRef.current && !selectedDistrict) {
            const pendingDistrictId = pendingDistrictIdRef.current;
            const districtExists = districts.some(
              (d) => String(d.value) === String(pendingDistrictId)
            );
            if (districtExists) {
              setSelectedDistrict(pendingDistrictId);
              pendingDistrictIdRef.current = null;
            }
          }
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
  
          // Set pending block if available
          if (pendingBlockIdRef.current && !selectedBlock) {
            const pendingBlockId = pendingBlockIdRef.current;
            const blockExists = blocks.some(
              (b) => String(b.value) === String(pendingBlockId)
            );
            if (blockExists) {
              setSelectedBlock(pendingBlockId);
              pendingBlockIdRef.current = null;
            }
          }
        } catch (error) {
          console.error('Error loading blocks:', error);
          setBlockOptions([]);
        } finally {
          setLoadingStates((prev) => ({ ...prev, block: false }));
        }
      };
      loadBlockOptions();
    }, [selectedDistrict]);
  
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
    ]);
  
    // Sync selectedCenter with value prop when value or centerOptions change
    useEffect(() => {
      // Skip if we're in the middle of selecting (to avoid conflicts)
      if (isSelectingCenterRef.current) {
        return;
      }
  
      if (!value || value.length === 0) {
        if (selectedCenter) {
          setSelectedCenter(null);
        }
        return;
      }
  
      const centerId = Array.isArray(value) ? value[0] : value;
      const centerIdStr = String(centerId);
  
      // Check if we already have the correct center selected
      if (selectedCenter && String(selectedCenter.value) === centerIdStr) {
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
          if (!selectedCenter || String(selectedCenter.value) !== centerIdStr) {
            // Create a placeholder until options are loaded
            setSelectedCenter({
              value: centerId,
              label: `Center ${centerId}`,
            });
          }
        }
      } else if (centerId) {
        // If centerOptions is empty but we have a value, create a placeholder
        // This handles the case where the center was selected but options haven't loaded yet
        if (!selectedCenter || String(selectedCenter.value) !== centerIdStr) {
          setSelectedCenter({
            value: centerId,
            label: `Center ${centerId}`, // Placeholder label - will be replaced when options load
          });
        }
      }
    }, [value, centerOptions, selectedCenter]);
  
    // Sync with form data changes on initial load
    useEffect(() => {
      const currentFormData = getFormData();
      // Sync if form data has values and our local state is empty
      if (currentFormData.state?.[0] && !selectedState) {
        setSelectedState(currentFormData.state[0]);
      }
      if (currentFormData.district?.[0] && !selectedDistrict) {
        setSelectedDistrict(currentFormData.district[0]);
      }
      if (currentFormData.block?.[0] && !selectedBlock) {
        setSelectedBlock(currentFormData.block[0]);
      }
    }, [selectedState, selectedDistrict, selectedBlock]);
  
    // Update form data when selections change
    const updateFormData = useCallback(
      (field, newValue) => {
        const currentFormData = getFormData();
        const updatedFormData = {
          ...currentFormData,
          [field]: newValue,
        };
  
        // Try to update through formContext first
        if (formContext?.onChange) {
          formContext.onChange({ formData: updatedFormData });
        } else if (registry?.formContext?.onChange) {
          registry.formContext.onChange({ formData: updatedFormData });
        }
      },
      [formContext, registry]
    );
  
    const handleStateChange = (event) => {
      const newState = event.target.value;
      setSelectedState(newState);
      setSelectedDistrict('');
      setSelectedBlock('');
      setSelectedCenter(null);
      setSearchKeyword('');
      setAutocompleteInputValue('');
      onChange([]);
      // Optionally update form data if needed
      // updateFormData('state', [newState]);
    };
  
    const handleDistrictChange = (event) => {
      const newDistrict = event.target.value;
      setSelectedDistrict(newDistrict);
      setSelectedBlock('');
      setSelectedCenter(null);
      setSearchKeyword('');
      setAutocompleteInputValue('');
      onChange([]);
      // Optionally update form data if needed
      // updateFormData('district', [newDistrict]);
    };
  
    const handleBlockChange = (event) => {
      const newBlock = event.target.value;
      setSelectedBlock(newBlock);
      setSelectedCenter(null);
      setSearchKeyword('');
      setAutocompleteInputValue('');
      onChange([]);
      // Optionally update form data if needed
      // updateFormData('block', [newBlock]);
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
        onChange([]);
      } else if (reason === 'reset') {
        // Reset after selection - don't update input value, let it show selected value
        // Only clear if there's no selection
        if (!selectedCenter && !value?.length) {
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
        const centerObj = newValue;
        setSelectedCenter(centerObj);
  
        const centerIds = Array.isArray(newValue)
          ? newValue.map((c) => c.value)
          : [newValue.value];
        onChange(centerIds);
  
        // Clear search keyword when center is selected to prevent unnecessary API calls
        setSearchKeyword('');
        // Clear autocompleteInputValue so Autocomplete can display the selected value naturally
        setAutocompleteInputValue('');
      } else {
        setSelectedCenter(null);
        onChange([]);
        setSearchKeyword('');
        setAutocompleteInputValue('');
      }
  
      // Reset flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isSelectingCenterRef.current = false;
      }, 200);
    };
  
    // Get selected center options for display
    // Include selected centers even if they're not in current search results
    const selectedCenterOptions = useMemo(() => {
      if (!value || value.length === 0) return [];
      if (!centerOptions || !Array.isArray(centerOptions)) return [];
  
      const selected = centerOptions.filter((center) => {
        if (!center || !center.value) return false;
        return value.includes(center.value);
      });
  
      // If we have values but they're not in current options (e.g., after search filter),
      // we still need to show them. For now, return what we found.
      // The Autocomplete will handle displaying the selected value even if not in options
      return selected;
    }, [value, centerOptions]);
  
    // Force single select for center (not multiple)
    const isMultiple = false;
    const maxSelection = 1;
  
    return (
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={2}>
          {/* State Dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth required={required}>
              <InputLabel id="state-label">State</InputLabel>
              <Select
                labelId="state-label"
                value={selectedState}
                onChange={handleStateChange}
                label="State"
                disabled={loadingStates.state || (!isCentralAdmin && stateId)}
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
                disabled={!selectedState || loadingStates.district}
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
                disabled={!selectedDistrict || loadingStates.block}
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
            <FormControl
              fullWidth
              required={required}
              error={rawErrors.length > 0}
            >
              <Autocomplete
                multiple={isMultiple}
                options={
                  // Ensure selected center is always in options list
                  (() => {
                    const options = centerOptions || [];
                    if (selectedCenter && !isMultiple) {
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
                  isMultiple ? selectedCenterOptions : selectedCenter || null
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
                disabled={!selectedState || loadingStates.centers}
                freeSolo={false}
                clearOnBlur={false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label || 'Search and Select Center'}
                    placeholder={
                      loadingStates.centers
                        ? 'Loading centers...'
                        : 'Type to search centers...'
                    }
                    required={required}
                    error={rawErrors.length > 0}
                    helperText={
                      rawErrors.length > 0
                        ? rawErrors[0]
                        : isMultiple && maxSelection < Infinity
                        ? `Select up to ${maxSelection} centers`
                        : 'Type to search for centers'
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
  
  export default CustomCenterListWidget;