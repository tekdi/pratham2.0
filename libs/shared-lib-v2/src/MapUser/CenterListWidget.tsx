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
  initialBlock?: string | string[]; // Initial block ID(s) - can be string or array
  onStateChange?: (stateId: string | null) => void; // Callback when state is selected/changed
  onDistrictChange?: (districtId: string | null) => void; // Callback when district is selected/changed
  onBlockChange?: (blockId: string | string[] | null) => void; // Callback when block is selected/changed
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
  onStateChange,
  onDistrictChange,
  onBlockChange,
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
  const [selectedBlock, setSelectedBlock] = useState(() => {
    if (!initialBlock) return [];
    return Array.isArray(initialBlock) ? initialBlock : [initialBlock];
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [blockSearchKeyword, setBlockSearchKeyword] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(() => {
    if (!value) return [];
    const centerIds = Array.isArray(value) ? value : [value];
    return centerIds.map((id) => ({
      value: id,
      label: `Center ${id}`, // Will be updated when details are fetched
    }));
  });
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');
  const [blockAutocompleteInputValue, setBlockAutocompleteInputValue] =
    useState('');

  // Ref to track if we're selecting a center to prevent unnecessary API calls
  const isSelectingCenterRef = useRef(false);
  // Refs to store district and block IDs from prefilled center details
  const pendingDistrictIdRef = useRef(null);
  const pendingBlockIdRef = useRef<string[] | null>(null);
  // Ref to track if we've already fetched center details for the current value
  const fetchedCenterDetailsRef = useRef(null);
  // Ref to track when filters are changing to prevent sync effect from restoring center
  const isFilterChangingRef = useRef(false);
  // Ref to track which filters were active when center was selected (for navigation back)
  const activeFiltersWhenSelectedRef = useRef({
    state: null,
    district: null,
    block: null as string[] | null,
  });

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

  // Function to fetch center details by ID
  const fetchCenterDetailsById = useCallback(async (centerId: string) => {
    if (!centerId || !centerId.toString().trim()) {
      return null;
    }

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

      return response?.data?.result?.results?.cohortDetails?.[0] || null;
    } catch (error) {
      console.error('Error fetching center details:', error);
      return null;
    }
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

      // Check if we need to fetch the center name
      const needsNameFetch =
        !selectedCenter ||
        selectedCenter.length === 0 ||
        selectedCenter.some((c) => c.label?.startsWith('Center '));

      // Skip if we've already fetched details for this center ID and don't need name
      if (
        fetchedCenterDetailsRef.current === centerId.toString() &&
        !needsNameFetch
      ) {
        return;
      }

      // Fetch if state is not set OR if we need to fetch the center name
      if (selectedState && !needsNameFetch) {
        return;
      }

      setLoadingStates((prev) => ({ ...prev, centers: true }));
      try {
        const centerDetails = await fetchCenterDetailsById(centerId.toString());

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

          // When navigating back with a prefilled center, only restore minimum filters (state)
          // Don't auto-set district/block unless they were in active filters when center was selected
          // This ensures only the filters that were actually used remain selected

          // Set state - always set if not already set (minimum required)
          if (stateField?.selectedValues?.[0]?.id && !selectedState) {
            const stateId = stateField.selectedValues[0].id.toString();
            setSelectedState(stateId);
            // Call onStateChange callback if provided
            if (onStateChange) {
              onStateChange(stateId);
            }
          }

          // Check active filters to determine which filters to restore
          const activeFilters = activeFiltersWhenSelectedRef.current;
          const hasActiveFilters =
            activeFilters.state ||
            activeFilters.district ||
            activeFilters.block;

          // Only restore district if it was in active filters when center was selected
          if (districtField?.selectedValues?.[0]?.id) {
            const districtId = districtField.selectedValues[0].id.toString();
            if (
              activeFilters.district &&
              activeFilters.district === districtId
            ) {
              // District was active when center was selected, restore it
              pendingDistrictIdRef.current = districtId;
            } else {
              // District was not active, clear it
              pendingDistrictIdRef.current = null;
              // Also clear selectedDistrict if it's set but wasn't in active filters
              if (
                selectedDistrict &&
                (!hasActiveFilters || activeFilters.district !== districtId)
              ) {
                setSelectedDistrict('');
              }
            }
          } else {
            pendingDistrictIdRef.current = null;
            // Clear district if no active filters stored (navigation back scenario)
            if (!hasActiveFilters && selectedDistrict) {
              setSelectedDistrict('');
            }
          }

          // Only restore block if it was in active filters when center was selected
          if (blockField?.selectedValues?.[0]?.id) {
            const blockId = blockField.selectedValues[0].id.toString();
            if (
              activeFilters.block &&
              Array.isArray(activeFilters.block) &&
              activeFilters.block.some((id) => String(id) === blockId)
            ) {
              // Block was active when center was selected, restore it
              pendingBlockIdRef.current = [blockId];
            } else {
              // Block was not active, clear it
              pendingBlockIdRef.current = null;
              // Also clear selectedBlock if it's set but wasn't in active filters
              if (
                selectedBlock.length > 0 &&
                (!hasActiveFilters ||
                  !activeFilters.block ||
                  !Array.isArray(activeFilters.block) ||
                  !activeFilters.block.some((id) => String(id) === blockId))
              ) {
                setSelectedBlock([]);
              }
            }
          } else {
            pendingBlockIdRef.current = null;
            // Clear block if no active filters stored (navigation back scenario)
            if (!hasActiveFilters && selectedBlock.length > 0) {
              setSelectedBlock([]);
            }
          }

          // Set center name in selectedCenter (always update if name is available)
          if (centerDetails.name) {
            const currentCenters = Array.isArray(selectedCenter)
              ? selectedCenter
              : [];
            const centerIdStr = centerId.toString();
            const existingIndex = currentCenters.findIndex(
              (c) => String(c.value) === centerIdStr
            );

            if (existingIndex >= 0) {
              // Update existing center
              const updatedCenters = [...currentCenters];
              updatedCenters[existingIndex] = {
                value: centerId,
                label: centerDetails.name,
              };
              setSelectedCenter(updatedCenters);
            } else {
              // Add new center
              setSelectedCenter([
                {
                  value: centerId,
                  label: centerDetails.name,
                },
                ...currentCenters,
              ]);
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
  }, [value, selectedState, fetchCenterDetailsById]);

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
            // Call onDistrictChange callback if provided
            if (onDistrictChange) {
              onDistrictChange(pendingDistrictId);
            }
          }
        } else if (initialDistrict && !selectedDistrict) {
          setSelectedDistrict(initialDistrict);
          // Call onDistrictChange callback if provided
          if (onDistrictChange) {
            onDistrictChange(initialDistrict);
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
  }, [selectedState, stateId, isCentralAdmin, initialDistrict]);

  // Load block options when district changes
  useEffect(() => {
    const loadBlockOptions = async () => {
      if (!selectedDistrict) {
        setBlockOptions([]);
        setSelectedBlock([]);
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

        // Set pending blocks if available
        if (
          pendingBlockIdRef.current &&
          pendingBlockIdRef.current.length > 0 &&
          selectedBlock.length === 0 &&
          !initialBlock
        ) {
          const pendingBlockIds = pendingBlockIdRef.current;
          const validBlocks = pendingBlockIds
            .map((blockId) => String(blockId))
            .filter((blockId) =>
              blocks.some((b) => String(b.value) === blockId)
            );
          if (validBlocks.length > 0) {
            setSelectedBlock(validBlocks);
            pendingBlockIdRef.current = null;
            // Call onBlockChange callback if provided
            if (onBlockChange) {
              onBlockChange(validBlocks);
            }
          }
        } else if (initialBlock && selectedBlock.length === 0) {
          const initialBlocks = Array.isArray(initialBlock)
            ? initialBlock
            : [initialBlock];
          const validBlocks = initialBlocks
            .map((blockId) => String(blockId))
            .filter((blockId) =>
              blocks.some((b) => String(b.value) === blockId)
            );
          if (validBlocks.length > 0) {
            setSelectedBlock(validBlocks);
            // Call onBlockChange callback if provided
            if (onBlockChange) {
              onBlockChange(validBlocks);
            }
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
      if (selectedBlock && selectedBlock.length > 0) {
        filters.block = Array.isArray(selectedBlock)
          ? selectedBlock
          : [selectedBlock];
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
            // Use center name if available, otherwise use a placeholder with ID
            const centerName = item.name?.trim() || `Center ${item.cohortId}`;
            return {
              value: item.cohortId,
              label: centerName,
            };
          })
          .filter((item) => item !== null) || [];

      // If any centers have placeholder names (starting with "Center "), fetch their actual names
      const centersNeedingNames = centers.filter((center) =>
        center.label?.startsWith('Center ')
      );

      if (centersNeedingNames.length > 0) {
        // Fetch names for centers that need them
        Promise.all(
          centersNeedingNames.map(async (center) => {
            try {
              const details = await fetchCenterDetailsById(center.value);
              if (details?.name?.trim()) {
                return {
                  ...center,
                  label: details.name.trim(),
                };
              }
              return center;
            } catch (error) {
              console.error(
                `Error fetching name for center ${center.value}:`,
                error
              );
              return center;
            }
          })
        ).then((updatedCenters) => {
          // Update the centers list with fetched names
          const updatedCenterOptions = centers.map((center) => {
            const updated = updatedCenters.find(
              (uc) => String(uc.value) === String(center.value)
            );
            return updated || center;
          });
          setCenterOptions(updatedCenterOptions);
        });
      } else {
        setCenterOptions(centers);
      }
    } catch (error) {
      console.error('Error searching centers:', error);
      setCenterOptions([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, centers: false }));
    }
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    searchKeyword,
    fetchCenterDetailsById,
  ]);

  // Debounced search for centers - load when filters change or when user types
  useEffect(() => {
    // Don't search if no state is selected or if we're in the middle of selecting a center
    if (!selectedState || isSelectingCenterRef.current) {
      return;
    }

    // Use shorter delay for filter changes, longer delay for typing
    const delay = searchKeyword ? 500 : 50;

    const timeoutId = setTimeout(() => {
      // Double check the flag before making the API call
      // Note: We don't check isFilterChangingRef here because we want search to run when filters change
      if (!isSelectingCenterRef.current) {
        searchCenters();
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    searchKeyword,
    searchCenters,
  ]);

  // Sync selectedCenter with value prop when value or centerOptions change
  useEffect(() => {
    // Skip if we're in the middle of selecting (to avoid conflicts)
    if (isSelectingCenterRef.current) {
      return;
    }

    // Skip if filters are changing (center will be cleared by handlers)
    if (isFilterChangingRef.current) {
      return;
    }

    if (!value || (Array.isArray(value) && value.length === 0)) {
      if (selectedCenter && selectedCenter.length > 0) {
        setSelectedCenter([]);
      }
      return;
    }

    const centerIds = Array.isArray(value) ? value : [value];

    // Always handle as multiple selection
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

      // Check if any centers need their names fetched
      const centersNeedingFetch = foundCenters.filter((center) =>
        center.label?.startsWith('Center ')
      );

      if (centersNeedingFetch.length > 0) {
        // Fetch details for centers that need names
        Promise.all(
          centersNeedingFetch.map((center) =>
            fetchCenterDetailsById(center.value).then((details) => ({
              ...center,
              label: details?.name || center.label,
            }))
          )
        ).then((updatedCenters) => {
          // Update only the centers that were fetched
          const updatedFoundCenters = foundCenters.map((center) => {
            const updated = updatedCenters.find(
              (uc) => String(uc.value) === String(center.value)
            );
            return updated || center;
          });
          setSelectedCenter(updatedFoundCenters);
        });
      } else {
        setSelectedCenter(foundCenters);
      }
    } else {
      // Fetch details for all centers
      Promise.all(
        centerIds.map((centerId) =>
          fetchCenterDetailsById(String(centerId)).then((details) => ({
            value: centerId,
            label: details?.name || `Center ${centerId}`,
          }))
        )
      ).then((centers) => {
        setSelectedCenter(centers);
      });
    }
  }, [value, centerOptions, selectedCenter, fetchCenterDetailsById]);

  const handleStateChange = (event) => {
    const newState = String(event.target.value || '');
    // Set flag to prevent sync effect from restoring center
    isFilterChangingRef.current = true;
    setSelectedState(newState);
    setSelectedDistrict('');
    setSelectedBlock([]);
    setSelectedCenter([]);
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]); // Clear center options when state changes
    if (onChange) {
      onChange(null);
    }
    // Call onStateChange callback if provided
    if (onStateChange) {
      onStateChange(newState || null);
    }
    // Reset flag after state updates complete
    // The useEffect will automatically trigger search when selectedState changes
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 150);
  };

  const handleDistrictChange = (event) => {
    const newDistrict = event.target.value;
    // Set flag to prevent sync effect from restoring center
    isFilterChangingRef.current = true;
    setSelectedDistrict(newDistrict);
    setSelectedBlock([]);
    setSelectedCenter([]);
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]); // Clear center options when district changes
    if (onChange) {
      onChange(null);
    }
    // Call onDistrictChange callback if provided
    if (onDistrictChange) {
      onDistrictChange(newDistrict || null);
    }
    // Reset flag after state updates complete
    // The useEffect will automatically trigger search when selectedDistrict changes
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 150);
  };

  const handleBlockChange = (event, newValue) => {
    // Set flag to prevent sync effect from restoring center
    isFilterChangingRef.current = true;

    const blockIds = Array.isArray(newValue)
      ? newValue.map((block) => String(block.value))
      : newValue
      ? [String(newValue.value)]
      : [];

    setSelectedBlock(blockIds);
    setSelectedCenter(null);
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]); // Clear center options when block changes
    if (onChange) {
      onChange(null);
    }
    // Call onBlockChange callback if provided
    if (onBlockChange) {
      onBlockChange(blockIds.length > 0 ? blockIds : null);
    }
    // Reset flag after state updates complete
    // The useEffect will automatically trigger search when selectedBlock changes
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 150);
  };

  const handleBlockInputChange = (event, newInputValue, reason) => {
    // Handle different input change reasons for block autocomplete
    if (reason === 'input') {
      // User is typing - update input value and search keyword
      setBlockAutocompleteInputValue(newInputValue);
      setBlockSearchKeyword(newInputValue);
    } else if (reason === 'clear') {
      // User clicked clear button
      setBlockAutocompleteInputValue('');
      setBlockSearchKeyword('');
    } else if (reason === 'reset') {
      // Reset after selection - don't update input value, let it show selected value
      if (selectedBlock.length === 0) {
        setBlockAutocompleteInputValue('');
        setBlockSearchKeyword('');
      }
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
      setSelectedCenter([]);
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

    if (
      newValue &&
      (Array.isArray(newValue) ? newValue.length > 0 : newValue)
    ) {
      // Store which filters were active when center is selected
      activeFiltersWhenSelectedRef.current = {
        state: selectedState || null,
        district: selectedDistrict || null,
        block:
          selectedBlock && selectedBlock.length > 0 ? [...selectedBlock] : null,
      };

      // Ensure we have a valid center object (always array)
      const centersArray = Array.isArray(newValue) ? newValue : [newValue];
      setSelectedCenter(centersArray);

      // Always return array of center IDs
      const centerIds = centersArray.map((c) => c.value);
      if (onChange) {
        onChange(centerIds);
      }

      // Clear search keyword when center is selected to prevent unnecessary API calls
      setSearchKeyword('');
      // Clear autocompleteInputValue so Autocomplete can display the selected value naturally
      setAutocompleteInputValue('');
    } else {
      // Clear active filters when center is deselected
      activeFiltersWhenSelectedRef.current = {
        state: null,
        district: null,
        block: null,
      };
      setSelectedCenter([]);
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

        {/* Block Autocomplete with multiple selection */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Autocomplete
              multiple
              options={blockOptions}
              value={
                selectedBlock.length > 0
                  ? blockOptions.filter((block) =>
                      selectedBlock.some(
                        (selectedId) =>
                          String(selectedId) === String(block.value)
                      )
                    )
                  : []
              }
              onChange={handleBlockChange}
              onInputChange={handleBlockInputChange}
              inputValue={blockAutocompleteInputValue}
              loading={loadingStates.block}
              getOptionLabel={(option) => {
                if (!option) return '';
                return (
                  option.label || option?.name || String(option.value || '')
                );
              }}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false;
                return String(option.value) === String(value.value);
              }}
              filterOptions={(options, state) => {
                // Filter options safely
                if (!options || !Array.isArray(options)) return [];
                const inputValue = state.inputValue || '';
                if (!inputValue) return options;

                return options.filter((option) => {
                  if (!option) return false;
                  const label = option.label || option?.name || '';
                  return label.toLowerCase().includes(inputValue.toLowerCase());
                });
              }}
              disabled={disabled || !selectedDistrict || loadingStates.block}
              freeSolo={false}
              clearOnBlur={false}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Block"
                  placeholder={
                    loadingStates.block
                      ? 'Loading blocks...'
                      : 'Type to search blocks...'
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingStates.block ? (
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

        {/* Center Autocomplete with integrated search */}
        <Grid item xs={12}>
          <FormControl fullWidth required={required} error={error}>
            <Autocomplete
              multiple={true}
              options={centerOptions || []}
              value={Array.isArray(selectedCenter) ? selectedCenter : []}
              onChange={handleCenterChange}
              onInputChange={handleAutocompleteInputChange}
              inputValue={
                // Control inputValue based on state:
                // - When user is typing: show the typed value
                // - When no center selected: show empty string
                searchKeyword ? autocompleteInputValue || '' : ''
              }
              loading={loadingStates.centers}
              getOptionLabel={(option) => {
                if (!option) return '';
                // Return the label, or name, or fallback to showing the value (center ID)
                const label = option.label || option?.name || '';
                if (label.trim()) {
                  return label;
                }
                // Fallback: show center ID if no name is available
                return option.value ? `Center ${option.value}` : '';
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
                  if (!option) return false;
                  // Get the label for filtering
                  const label = option.label || option?.name || '';
                  const displayLabel =
                    label.trim() ||
                    (option.value ? `Center ${option.value}` : '');
                  return displayLabel
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
