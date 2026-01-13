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
  Paper,
  Chip,
  IconButton,
  Button,
  Checkbox,
  Card,
  CardContent,
  Stack,
  Divider,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import axios from 'axios';

interface MultipleCenterListWidgetProps {
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

const MultipleCenterListWidget: React.FC<MultipleCenterListWidgetProps> = ({
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
  // Theme color
  const themeColor = '#FDBE16';
  const themeColorLight = 'rgba(253, 190, 22, 0.1)'; // 10% opacity
  const themeColorLighter = 'rgba(253, 190, 22, 0.05)'; // 5% opacity
  const themeColorDark = '#E5A814'; // Slightly darker for hover states
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

  const [selectedState, setSelectedState] = useState(() => {
    if (!initialState) return [];
    return Array.isArray(initialState) ? initialState : [initialState];
  });
  const [selectedDistrict, setSelectedDistrict] = useState(() => {
    if (!initialDistrict) return [];
    return Array.isArray(initialDistrict) ? initialDistrict : [initialDistrict];
  });
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
  // Ref to track if a search is in progress to prevent overlapping API calls
  const isSearchingRef = useRef(false);
  // Ref to store the latest search timeout ID
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Ref to store the latest searchCenters function to avoid dependency issues
  const searchCentersRef = useRef(null);
  // Ref to store the latest fetchCenterDetailsById function to avoid dependency issues
  const fetchCenterDetailsByIdRef = useRef(null);
  // Ref to track last filter values to prevent duplicate searches
  const lastFilterValuesRef = useRef({
    state: null,
    district: null,
    block: null,
    searchKeyword: '',
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

        // console.log('Loaded states:', states);
        setStateOptions(states);

        // After loading states, set default from localStorage if found
        // Only set if not already set
        setSelectedState((prevSelectedState) => {
          const currentSelectedState = Array.isArray(prevSelectedState)
            ? prevSelectedState
            : prevSelectedState
            ? [prevSelectedState]
            : [];
          const currentStateId = stateId ? String(stateId) : null;
          const currentInitialState = initialState
            ? Array.isArray(initialState)
              ? initialState
              : [initialState]
            : [];

          if (currentSelectedState.length > 0) {
            // Already has a value, keep it
            return currentSelectedState;
          }

          if (currentStateId && currentInitialState.length === 0) {
            // Check if the stateId exists in the loaded states (compare as strings)
            const stateExists = states.some(
              (state) => String(state.value) === currentStateId
            );
            if (stateExists) {
              return [currentStateId];
            }
          } else if (currentInitialState.length > 0) {
            return currentInitialState;
          }

          return currentSelectedState;
        });
      } catch (error) {
        console.error('Error loading states:', error);
        if (!isMounted) return;

        setStateOptions([]); // Set empty array on error

        // On error, still set stateId if available to prevent stuck loading
        setSelectedState((prevSelectedState) => {
          const currentSelectedState = Array.isArray(prevSelectedState)
            ? prevSelectedState
            : prevSelectedState
            ? [prevSelectedState]
            : [];
          const currentStateId = stateId ? String(stateId) : null;
          const currentInitialState = initialState
            ? Array.isArray(initialState)
              ? initialState
              : [initialState]
            : [];

          if (currentSelectedState.length > 0) {
            return currentSelectedState;
          }

          if (currentStateId && currentInitialState.length === 0) {
            return [currentStateId];
          } else if (currentInitialState.length > 0) {
            return currentInitialState;
          }

          return currentSelectedState;
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

  // Store the latest fetchCenterDetailsById function in ref
  useEffect(() => {
    fetchCenterDetailsByIdRef.current = fetchCenterDetailsById;
  }, [fetchCenterDetailsById]);

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
        const centerDetails = await fetchCenterDetailsByIdRef.current?.(
          centerId.toString()
        );

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
          const currentStates = Array.isArray(selectedState)
            ? selectedState
            : selectedState
            ? [selectedState]
            : [];
          if (
            stateField?.selectedValues?.[0]?.id &&
            currentStates.length === 0
          ) {
            const stateId = stateField.selectedValues[0].id.toString();
            setSelectedState([stateId]);
            // Call onStateChange callback if provided
            if (onStateChange) {
              onStateChange([stateId]);
            }
          }

          // Check active filters to determine which filters to restore
          const activeFilters = activeFiltersWhenSelectedRef.current;
          const hasActiveFilters =
            (activeFilters.state &&
              Array.isArray(activeFilters.state) &&
              activeFilters.state.length > 0) ||
            (activeFilters.district &&
              Array.isArray(activeFilters.district) &&
              activeFilters.district.length > 0) ||
            (activeFilters.block &&
              Array.isArray(activeFilters.block) &&
              activeFilters.block.length > 0);

          // Only restore district if it was in active filters when center was selected
          if (districtField?.selectedValues?.[0]?.id) {
            const districtId = districtField.selectedValues[0].id.toString();
            if (
              activeFilters.district &&
              Array.isArray(activeFilters.district) &&
              activeFilters.district.some((id) => String(id) === districtId)
            ) {
              // District was active when center was selected, restore it
              pendingDistrictIdRef.current = districtId;
            } else {
              // District was not active, clear it
              pendingDistrictIdRef.current = null;
              // Also clear selectedDistrict if it's set but wasn't in active filters
              const currentDistricts = Array.isArray(selectedDistrict)
                ? selectedDistrict
                : selectedDistrict
                ? [selectedDistrict]
                : [];
              if (
                currentDistricts.length > 0 &&
                (!hasActiveFilters ||
                  !activeFilters.district ||
                  !Array.isArray(activeFilters.district) ||
                  !activeFilters.district.some(
                    (id) => String(id) === districtId
                  ))
              ) {
                setSelectedDistrict([]);
              }
            }
          } else {
            pendingDistrictIdRef.current = null;
            // Clear district if no active filters stored (navigation back scenario)
            const currentDistricts = Array.isArray(selectedDistrict)
              ? selectedDistrict
              : selectedDistrict
              ? [selectedDistrict]
              : [];
            if (!hasActiveFilters && currentDistricts.length > 0) {
              setSelectedDistrict([]);
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

            // Extract location details
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

            const stateSelectedValue = stateField?.selectedValues?.[0];
            const districtSelectedValue = districtField?.selectedValues?.[0];
            const blockSelectedValue = blockField?.selectedValues?.[0];

            const centerData = {
              value: centerId,
              label: centerDetails.name,
              stateId: stateSelectedValue?.id || null,
              state:
                stateSelectedValue?.value ||
                stateSelectedValue?.label ||
                stateSelectedValue?.name ||
                null,
              districtId: districtSelectedValue?.id || null,
              district:
                districtSelectedValue?.value ||
                districtSelectedValue?.label ||
                districtSelectedValue?.name ||
                null,
              blockId: blockSelectedValue?.id || null,
              block:
                blockSelectedValue?.value ||
                blockSelectedValue?.label ||
                blockSelectedValue?.name ||
                null,
            };

            if (existingIndex >= 0) {
              // Update existing center
              const updatedCenters = [...currentCenters];
              updatedCenters[existingIndex] = centerData;
              setSelectedCenter(updatedCenters);
            } else {
              // Add new center
              setSelectedCenter([centerData, ...currentCenters]);
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
  }, [value, selectedState]);

  // Load district options when state changes
  useEffect(() => {
    const loadDistrictOptions = async () => {
      // Handle multiple states - get array of selected states
      const selectedStates = Array.isArray(selectedState)
        ? selectedState
        : selectedState
        ? [selectedState]
        : [];

      // For non-central admin, always use stateId from localStorage
      // For central admin, use selectedStates
      const controllingField =
        !isCentralAdmin && stateId
          ? [stateId]
          : selectedStates.length > 0
          ? selectedStates
          : [];

      if (controllingField.length === 0) {
        setDistrictOptions([]);
        setSelectedDistrict([]);
        return;
      }

      setLoadingStates((prev) => ({ ...prev, district: true }));
      try {
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
        const currentSelectedDistricts = Array.isArray(selectedDistrict)
          ? selectedDistrict
          : selectedDistrict
          ? [selectedDistrict]
          : [];
        const currentInitialDistricts = initialDistrict
          ? Array.isArray(initialDistrict)
            ? initialDistrict
            : [initialDistrict]
          : [];

        if (
          pendingDistrictIdRef.current &&
          currentSelectedDistricts.length === 0 &&
          currentInitialDistricts.length === 0
        ) {
          const pendingDistrictId = pendingDistrictIdRef.current;
          const districtExists = districts.some(
            (d) => String(d.value) === String(pendingDistrictId)
          );
          if (districtExists) {
            setSelectedDistrict([pendingDistrictId]);
            pendingDistrictIdRef.current = null;
            // Call onDistrictChange callback if provided
            if (onDistrictChange) {
              onDistrictChange([pendingDistrictId]);
            }
          }
        } else if (
          currentInitialDistricts.length > 0 &&
          currentSelectedDistricts.length === 0
        ) {
          const validDistricts = currentInitialDistricts.filter((districtId) =>
            districts.some((d) => String(d.value) === String(districtId))
          );
          if (validDistricts.length > 0) {
            setSelectedDistrict(validDistricts);
            // Call onDistrictChange callback if provided
            if (onDistrictChange) {
              onDistrictChange(validDistricts);
            }
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
      const selectedDistricts = Array.isArray(selectedDistrict)
        ? selectedDistrict
        : selectedDistrict
        ? [selectedDistrict]
        : [];

      if (selectedDistricts.length === 0) {
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
            controllingfieldfk: selectedDistricts,
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
    // Handle multiple states and districts
    const selectedStates = Array.isArray(selectedState)
      ? selectedState
      : selectedState
      ? [selectedState]
      : [];
    const selectedDistricts = Array.isArray(selectedDistrict)
      ? selectedDistrict
      : selectedDistrict
      ? [selectedDistrict]
      : [];

    // Only search if we have at least one state selected
    if (selectedStates.length === 0) {
      setCenterOptions([]);
      return;
    }

    // Prevent overlapping API calls
    if (isSearchingRef.current) {
      return;
    }

    isSearchingRef.current = true;
    setLoadingStates((prev) => ({ ...prev, centers: true }));
    try {
      const tenantId = localStorage.getItem('tenantId') || '';
      const token = localStorage.getItem('token') || '';
      const academicYearId = localStorage.getItem('academicYearId') || '';

      const filters = {
        type: 'COHORT',
        status: ['active'],
      };

      if (selectedStates.length > 0) {
        filters.state = selectedStates;
      }
      if (selectedDistricts.length > 0) {
        filters.district = selectedDistricts;
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
      };

      // Add name search if searchKeyword is provided and not empty
      if (searchKeyword && searchKeyword.trim()) {
        payload.name = searchKeyword.trim();
      }

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

            // Extract location details from customFields
            const customFields = item.customFields || [];
            const stateField = customFields.find(
              (field) => field.label === 'STATE'
            );
            const districtField = customFields.find(
              (field) => field.label === 'DISTRICT'
            );
            const blockField = customFields.find(
              (field) => field.label === 'BLOCK'
            );

            // Extract IDs and values from customFields
            const stateSelectedValue = stateField?.selectedValues?.[0];
            const districtSelectedValue = districtField?.selectedValues?.[0];
            const blockSelectedValue = blockField?.selectedValues?.[0];

            return {
              value: item.cohortId,
              label: centerName,
              // State: extract ID and name/value
              stateId: stateSelectedValue?.id || null,
              state:
                stateSelectedValue?.value ||
                stateSelectedValue?.label ||
                stateSelectedValue?.name ||
                null,
              // District: extract ID and name/value
              districtId: districtSelectedValue?.id || null,
              district:
                districtSelectedValue?.value ||
                districtSelectedValue?.label ||
                districtSelectedValue?.name ||
                null,
              // Block: extract ID and name/value
              blockId: blockSelectedValue?.id || null,
              block:
                blockSelectedValue?.value ||
                blockSelectedValue?.label ||
                blockSelectedValue?.name ||
                null,
            };
          })
          .filter((item) => item !== null) || [];

      // If any centers have placeholder names (starting with "Center "), fetch their actual names
      // Note: Search API already returns name and location data in customFields, so we only fetch if name is missing
      const centersNeedingNames = centers.filter((center) =>
        center.label?.startsWith('Center ')
      );

      if (centersNeedingNames.length > 0) {
        // Only fetch the name - location data is already available from search response
        Promise.all(
          centersNeedingNames.map(async (center) => {
            try {
              const details = await fetchCenterDetailsByIdRef.current?.(
                center.value
              );
              if (details?.name?.trim()) {
                // Only update the name - keep existing location data from search response
                return {
                  ...center,
                  label: details.name.trim(),
                  // Keep existing location data - don't overwrite with fetched data
                  // since search API already provides it in customFields
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
        // Search API already provided all data (name + location), use it directly
        setCenterOptions(centers);
      }
    } catch (error) {
      console.error('Error searching centers:', error);
      setCenterOptions([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, centers: false }));
      isSearchingRef.current = false;
    }
  }, [selectedState, selectedDistrict, selectedBlock, searchKeyword]);

  // Store the latest searchCenters function in ref
  useEffect(() => {
    searchCentersRef.current = searchCenters;
  }, [searchCenters]);

  // Debounced search for centers - load when filters change or when user types
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Don't search if no state is selected or if we're in the middle of selecting a center
    const selectedStates = Array.isArray(selectedState)
      ? selectedState
      : selectedState
      ? [selectedState]
      : [];
    if (selectedStates.length === 0 || isSelectingCenterRef.current) {
      return;
    }

    // Normalize filter values for comparison
    const normalizedState = Array.isArray(selectedState)
      ? selectedState.sort().join(',')
      : selectedState || '';
    const normalizedDistrict = Array.isArray(selectedDistrict)
      ? selectedDistrict.sort().join(',')
      : selectedDistrict || '';
    const normalizedBlock = Array.isArray(selectedBlock)
      ? selectedBlock.sort().join(',')
      : selectedBlock || '';
    const normalizedSearchKeyword = (searchKeyword || '').trim();

    // Check if filters have actually changed
    const filtersChanged =
      lastFilterValuesRef.current.state !== normalizedState ||
      lastFilterValuesRef.current.district !== normalizedDistrict ||
      lastFilterValuesRef.current.block !== normalizedBlock ||
      lastFilterValuesRef.current.searchKeyword !== normalizedSearchKeyword;

    // If filters haven't changed, don't search
    if (!filtersChanged) {
      return;
    }

    // Use shorter delay for filter changes, longer delay for typing to prevent continuous API calls
    const delay = normalizedSearchKeyword ? 800 : 200; // Increased delay for filter changes to prevent loops

    searchTimeoutRef.current = setTimeout(() => {
      // Double check the flags before making the API call
      // Check isFilterChangingRef to prevent searches during rapid filter changes
      if (
        !isSelectingCenterRef.current &&
        !isSearchingRef.current &&
        !isFilterChangingRef.current &&
        searchCentersRef.current
      ) {
        // Update last filter values before search to prevent duplicate calls
        lastFilterValuesRef.current = {
          state: normalizedState,
          district: normalizedDistrict,
          block: normalizedBlock,
          searchKeyword: normalizedSearchKeyword,
        };
        searchCentersRef.current();
      }
      searchTimeoutRef.current = null;
    }, delay);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    searchKeyword,
    // Removed searchCenters from dependencies - using ref instead to prevent unnecessary re-runs
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

      // Check if any centers need their names or location data fetched
      const centersNeedingFetch = foundCenters.filter(
        (center) =>
          center.label?.startsWith('Center ') ||
          !center.state ||
          !center.district ||
          !center.block
      );

      if (centersNeedingFetch.length > 0) {
        // Fetch details for centers that need names or location data
        Promise.all(
          centersNeedingFetch.map((center) =>
            (
              fetchCenterDetailsByIdRef.current?.(center.value) ||
              Promise.resolve(null)
            ).then((details) => {
              if (!details) return center;
              const customFields = details.customFields || [];
              const stateField = customFields.find(
                (field) => field.label === 'STATE'
              );
              const districtField = customFields.find(
                (field) => field.label === 'DISTRICT'
              );
              const blockField = customFields.find(
                (field) => field.label === 'BLOCK'
              );

              const stateSelectedValue = stateField?.selectedValues?.[0];
              const districtSelectedValue = districtField?.selectedValues?.[0];
              const blockSelectedValue = blockField?.selectedValues?.[0];

              return {
                ...center,
                label: details?.name?.trim() || center.label,
                stateId: stateSelectedValue?.id || center.stateId || null,
                state:
                  stateSelectedValue?.value ||
                  stateSelectedValue?.label ||
                  stateSelectedValue?.name ||
                  center.state ||
                  null,
                districtId:
                  districtSelectedValue?.id || center.districtId || null,
                district:
                  districtSelectedValue?.value ||
                  districtSelectedValue?.label ||
                  districtSelectedValue?.name ||
                  center.district ||
                  null,
                blockId: blockSelectedValue?.id || center.blockId || null,
                block:
                  blockSelectedValue?.value ||
                  blockSelectedValue?.label ||
                  blockSelectedValue?.name ||
                  center.block ||
                  null,
              };
            })
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
          (
            fetchCenterDetailsByIdRef.current?.(String(centerId)) ||
            Promise.resolve(null)
          ).then((details) => {
            if (!details) {
              return {
                value: centerId,
                label: `Center ${centerId}`,
              };
            }
            const customFields = details.customFields || [];
            const stateField = customFields.find(
              (field) => field.label === 'STATE'
            );
            const districtField = customFields.find(
              (field) => field.label === 'DISTRICT'
            );
            const blockField = customFields.find(
              (field) => field.label === 'BLOCK'
            );

            const stateSelectedValue = stateField?.selectedValues?.[0];
            const districtSelectedValue = districtField?.selectedValues?.[0];
            const blockSelectedValue = blockField?.selectedValues?.[0];

            return {
              value: centerId,
              label: details?.name || `Center ${centerId}`,
              stateId: stateSelectedValue?.id || null,
              state:
                stateSelectedValue?.value ||
                stateSelectedValue?.label ||
                stateSelectedValue?.name ||
                null,
              districtId: districtSelectedValue?.id || null,
              district:
                districtSelectedValue?.value ||
                districtSelectedValue?.label ||
                districtSelectedValue?.name ||
                null,
              blockId: blockSelectedValue?.id || null,
              block:
                blockSelectedValue?.value ||
                blockSelectedValue?.label ||
                blockSelectedValue?.name ||
                null,
            };
          })
        )
      ).then((centers) => {
        setSelectedCenter(centers);
      });
    }
  }, [value, centerOptions, selectedCenter]);

  const handleStateChange = (values) => {
    // values is an array from MultiSelectFilter
    const newStates = Array.isArray(values) ? values : values ? [values] : [];
    // Set flag to prevent sync effect from restoring center
    isFilterChangingRef.current = true;

    // Clear any pending search to prevent it from running after filter change
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    // Normalize the new state value for comparison
    const normalizedNewState =
      newStates.length > 0 ? [...newStates].sort().join(',') : '';

    // Update last filter values with new state immediately to prevent search loop
    // This prevents the search effect from thinking filters changed when state updates
    lastFilterValuesRef.current = {
      state: normalizedNewState,
      district: null,
      block: null,
      searchKeyword: '',
    };

    setSelectedState(newStates);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    // Preserve selected centers - don't clear them
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]); // Clear center options when state changes

    // Keep the current selected centers in onChange callback
    if (onChange && selectedCenter.length > 0) {
      const centerIds = selectedCenter.map((c) => c.value);
      onChange(centerIds);
    }
    // Call onStateChange callback if provided
    if (onStateChange) {
      onStateChange(newStates.length > 0 ? newStates : null);
    }
    // Reset flag after state updates complete
    // Use longer timeout (300ms) to ensure it's longer than search delay (200ms)
    // This prevents the search from running before filters stabilize
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 300);
  };

  const handleDistrictChange = (values) => {
    // values is an array from MultiSelectFilter
    const newDistricts = Array.isArray(values)
      ? values
      : values
      ? [values]
      : [];
    // Set flag to prevent sync effect from restoring center
    isFilterChangingRef.current = true;

    // Clear any pending search to prevent it from running after filter change
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setSelectedDistrict(newDistricts);
    setSelectedBlock([]);
    // Preserve selected centers - don't clear them
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]); // Clear center options when district changes

    // Update last filter values with new district immediately to prevent search loop
    const normalizedState = Array.isArray(selectedState)
      ? selectedState.sort().join(',')
      : selectedState || '';
    const normalizedNewDistrict =
      newDistricts.length > 0 ? [...newDistricts].sort().join(',') : '';
    lastFilterValuesRef.current = {
      state: normalizedState,
      district: normalizedNewDistrict,
      block: null,
      searchKeyword: '',
    };
    // Keep the current selected centers in onChange callback
    if (onChange && selectedCenter.length > 0) {
      const centerIds = selectedCenter.map((c) => c.value);
      onChange(centerIds);
    }
    // Call onDistrictChange callback if provided
    if (onDistrictChange) {
      onDistrictChange(newDistricts.length > 0 ? newDistricts : null);
    }
    // Reset flag after state updates complete
    // Use longer timeout (300ms) to ensure it's longer than search delay (200ms)
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 300);
  };

  const handleBlockChange = (event, newValue) => {
    // Set flag to prevent sync effect from restoring center
    isFilterChangingRef.current = true;

    const blockIds = Array.isArray(newValue)
      ? newValue.map((block) => String(block.value))
      : newValue
      ? [String(newValue.value)]
      : [];

    // Clear any pending search to prevent it from running after filter change
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setSelectedBlock(blockIds);
    // Preserve selected centers - don't clear them
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]); // Clear center options when block changes

    // Update last filter values with new block immediately to prevent search loop
    const normalizedState = Array.isArray(selectedState)
      ? selectedState.sort().join(',')
      : selectedState || '';
    const normalizedDistrict = Array.isArray(selectedDistrict)
      ? selectedDistrict.sort().join(',')
      : selectedDistrict || '';
    const normalizedNewBlock =
      blockIds.length > 0 ? [...blockIds].sort().join(',') : '';
    lastFilterValuesRef.current = {
      state: normalizedState,
      district: normalizedDistrict,
      block: normalizedNewBlock,
      searchKeyword: '',
    };
    // Keep the current selected centers in onChange callback
    if (onChange && selectedCenter.length > 0) {
      const centerIds = selectedCenter.map((c) => c.value);
      onChange(centerIds);
    }
    // Call onBlockChange callback if provided
    if (onBlockChange) {
      onBlockChange(blockIds.length > 0 ? blockIds : null);
    }
    // Reset flag after state updates complete
    // Use longer timeout (300ms) to ensure it's longer than search delay (200ms)
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 300);
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
      const states = Array.isArray(selectedState)
        ? selectedState
        : selectedState
        ? [selectedState]
        : [];
      const districts = Array.isArray(selectedDistrict)
        ? selectedDistrict
        : selectedDistrict
        ? [selectedDistrict]
        : [];
      activeFiltersWhenSelectedRef.current = {
        state: states.length > 0 ? [...states] : null,
        district: districts.length > 0 ? [...districts] : null,
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

  // Calculate filter counts
  const totalFiltersCount = useMemo(() => {
    let count = 0;
    const states = Array.isArray(selectedState)
      ? selectedState
      : selectedState
      ? [selectedState]
      : [];
    const districts = Array.isArray(selectedDistrict)
      ? selectedDistrict
      : selectedDistrict
      ? [selectedDistrict]
      : [];
    count += states.length;
    count += districts.length;
    if (selectedBlock && selectedBlock.length > 0)
      count += selectedBlock.length;
    return count;
  }, [selectedState, selectedDistrict, selectedBlock]);

  const hasActiveFilters = totalFiltersCount > 0;

  // Handle clear all filters
  const handleClearAllFilters = useCallback(() => {
    isFilterChangingRef.current = true;

    // Clear any pending search to prevent it from running after clearing filters
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    setSelectedState([]);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    // Preserve selected centers - don't clear them
    setSearchKeyword('');
    setAutocompleteInputValue('');
    setBlockSearchKeyword('');
    setBlockAutocompleteInputValue('');
    setCenterOptions([]);

    // Reset last filter values
    lastFilterValuesRef.current = {
      state: null,
      district: null,
      block: null,
      searchKeyword: '',
    };
    // Keep the current selected centers in onChange callback
    if (onChange && selectedCenter.length > 0) {
      const centerIds = selectedCenter.map((c) => c.value);
      onChange(centerIds);
    } else if (onChange) {
      onChange(null);
    }
    if (onStateChange) {
      onStateChange(null);
    }
    if (onDistrictChange) {
      onDistrictChange(null);
    }
    if (onBlockChange) {
      onBlockChange(null);
    }
    // Reset flag after state updates complete
    // Use longer timeout (300ms) to ensure it's longer than search delay (200ms)
    setTimeout(() => {
      isFilterChangingRef.current = false;
    }, 300);
  }, [
    onChange,
    onStateChange,
    onDistrictChange,
    onBlockChange,
    selectedCenter,
  ]);

  // Handle center toggle (for card-based selection)
  const handleCenterToggle = useCallback(
    (center) => {
      const centerId = center.value || center;
      const centerIds = Array.isArray(value) ? value : value ? [value] : [];
      const exists = centerIds.some((id) => String(id) === String(centerId));

      isSelectingCenterRef.current = true;

      // Clear any pending search to prevent it from running when selecting a center
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      if (exists) {
        // Remove center
        const updatedIds = centerIds.filter(
          (id) => String(id) !== String(centerId)
        );
        const updatedCenters = selectedCenter.filter(
          (c) => String(c.value) !== String(centerId)
        );
        setSelectedCenter(updatedCenters);
        if (onChange) {
          onChange(updatedIds.length > 0 ? updatedIds : null);
        }
      } else {
        // Add center - use existing data from centerOptions (no API call needed)
        // Search API already provides all data (name + location) in customFields
        const centerFromOptions = centerOptions.find(
          (c) => String(c.value) === String(centerId)
        );
        let centerObj = centerFromOptions || center;

        // Only fetch if center is NOT from centerOptions (search results) AND location data is missing
        // Centers from search API already have all data, so no need to fetch
        if (!centerFromOptions) {
          // Center is not from search results - check if we need to fetch location data
          if (
            (!centerObj.state && !centerObj.stateId) ||
            (!centerObj.district && !centerObj.districtId) ||
            (!centerObj.block && !centerObj.blockId)
          ) {
            // Only fetch if location data is completely missing
            (
              fetchCenterDetailsByIdRef.current?.(centerId) ||
              Promise.resolve(null)
            ).then((details) => {
              if (details) {
                const customFields = details.customFields || [];
                const stateField = customFields.find(
                  (field) => field.label === 'STATE'
                );
                const districtField = customFields.find(
                  (field) => field.label === 'DISTRICT'
                );
                const blockField = customFields.find(
                  (field) => field.label === 'BLOCK'
                );

                const stateSelectedValue = stateField?.selectedValues?.[0];
                const districtSelectedValue =
                  districtField?.selectedValues?.[0];
                const blockSelectedValue = blockField?.selectedValues?.[0];

                const updatedCenterObj = {
                  ...centerObj,
                  stateId: stateSelectedValue?.id || null,
                  state:
                    stateSelectedValue?.value ||
                    stateSelectedValue?.label ||
                    stateSelectedValue?.name ||
                    centerObj.state ||
                    null,
                  districtId: districtSelectedValue?.id || null,
                  district:
                    districtSelectedValue?.value ||
                    districtSelectedValue?.label ||
                    districtSelectedValue?.name ||
                    centerObj.district ||
                    null,
                  blockId: blockSelectedValue?.id || null,
                  block:
                    blockSelectedValue?.value ||
                    blockSelectedValue?.label ||
                    blockSelectedValue?.name ||
                    centerObj.block ||
                    null,
                };
                // Update the center in selectedCenter array
                setSelectedCenter((prev) =>
                  prev.map((c) =>
                    String(c.value) === String(centerId) ? updatedCenterObj : c
                  )
                );
              }
            });
          }
        }
        // If center is from centerOptions, it already has all data from search API - no fetch needed

        const updatedCenters = [...selectedCenter, centerObj];
        const updatedIds = [...centerIds, centerId];
        setSelectedCenter(updatedCenters);
        if (onChange) {
          onChange(updatedIds);
        }
      }

      setTimeout(() => {
        isSelectingCenterRef.current = false;
      }, 200);
    },
    [value, selectedCenter, centerOptions, onChange]
  );

  // Handle select all visible centers
  const handleSelectAllVisible = useCallback(() => {
    const centerIds = Array.isArray(value) ? value : value ? [value] : [];
    const selectedCenterIds = new Set(centerIds.map((id) => String(id)));
    const allVisibleSelected =
      centerOptions.length > 0 &&
      centerOptions.every((c) => selectedCenterIds.has(String(c.value)));

    isSelectingCenterRef.current = true;

    // Clear any pending search to prevent it from running when selecting centers
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    if (allVisibleSelected) {
      // Deselect all visible
      const visibleIds = new Set(centerOptions.map((c) => String(c.value)));
      const remaining = centerIds.filter((id) => !visibleIds.has(String(id)));
      const remainingCenters = selectedCenter.filter((c) =>
        remaining.some((id) => String(c.value) === String(id))
      );
      setSelectedCenter(remainingCenters);
      if (onChange) {
        onChange(remaining.length > 0 ? remaining : null);
      }
    } else {
      // Select all visible (merge with existing)
      const newIds = [...centerIds];
      const newCenters = [...selectedCenter];
      centerOptions.forEach((center) => {
        if (!selectedCenterIds.has(String(center.value))) {
          newIds.push(center.value);
          newCenters.push(center);
        }
      });
      setSelectedCenter(newCenters);
      if (onChange) {
        onChange(newIds);
      }
    }

    setTimeout(() => {
      isSelectingCenterRef.current = false;
    }, 200);
  }, [value, selectedCenter, centerOptions, onChange]);

  // Handle remove center from selected
  const handleRemoveCenter = useCallback(
    (centerId) => {
      const centerIds = Array.isArray(value) ? value : value ? [value] : [];
      const updatedIds = centerIds.filter(
        (id) => String(id) !== String(centerId)
      );
      const updatedCenters = selectedCenter.filter(
        (c) => String(c.value) !== String(centerId)
      );
      setSelectedCenter(updatedCenters);
      if (onChange) {
        onChange(updatedIds.length > 0 ? updatedIds : null);
      }
    },
    [value, selectedCenter, onChange]
  );

  // Handle clear all selected centers
  const handleClearAllCenters = useCallback(() => {
    setSelectedCenter([]);
    if (onChange) {
      onChange(null);
    }
  }, [onChange]);

  // Group selected centers by state (for display)
  const centersByState = useMemo(() => {
    const grouped = {};
    const centers = Array.isArray(selectedCenter) ? selectedCenter : [];
    centers.forEach((center) => {
      if (!center) return;

      // Use the center's state property directly (should be the label/name)
      // If not available, try to find it from stateOptions using stateId
      let stateName = center.state;

      // If state is not available as a label, we need to fetch it or use a fallback
      if (!stateName || stateName === 'Unknown' || stateName === null) {
        // Try to find state name from stateOptions
        // We can't directly match without stateId, so use a fallback
        stateName = center.state || 'Unknown Location';
      }

      // Ensure we have a valid state name for grouping
      stateName = stateName || 'Unknown Location';

      if (!grouped[stateName]) {
        grouped[stateName] = [];
      }
      grouped[stateName].push(center);
    });
    return grouped;
  }, [selectedCenter, stateOptions]);

  // Structure selected centers hierarchically for API/props format
  const hierarchicalCenterStructure = useMemo(() => {
    const structure = {};
    const centers = Array.isArray(selectedCenter) ? selectedCenter : [];

    centers.forEach((center) => {
      if (!center) return;

      // Use IDs directly from center object (extracted from customFields)
      const stateId = center.stateId || null;
      const stateName = center.state || 'Unknown';
      const districtId = center.districtId || null;
      const districtName = center.district || 'Unknown';
      const blockId = center.blockId || null;
      const blockName = center.block || 'Unknown';

      // Fallback: If IDs are not available, try to find from options by name
      const finalStateId =
        stateId ||
        stateOptions.find((opt) => opt.label === stateName)?.value ||
        null;
      const finalDistrictId =
        districtId ||
        districtOptions.find((opt) => opt.label === districtName)?.value ||
        null;
      const finalBlockId =
        blockId ||
        blockOptions.find((opt) => opt.label === blockName)?.value ||
        null;

      // Create hierarchical structure using final IDs
      const structureKey = finalStateId || stateName;
      if (!structure[structureKey]) {
        structure[structureKey] = {
          stateId: finalStateId,
          stateName: stateName,
          districts: {},
        };
      }

      const districtKey = finalDistrictId || districtName;
      if (!structure[structureKey].districts[districtKey]) {
        structure[structureKey].districts[districtKey] = {
          districtId: finalDistrictId,
          districtName: districtName,
          blocks: {},
        };
      }

      const blockKey = finalBlockId || blockName;
      if (!structure[structureKey].districts[districtKey].blocks[blockKey]) {
        structure[structureKey].districts[districtKey].blocks[blockKey] = {
          blockId: finalBlockId,
          blockName: blockName,
          centers: [],
        };
      }

      structure[structureKey].districts[districtKey].blocks[
        blockKey
      ].centers.push({
        centerId: center.value,
        centerName: center.label || `Center ${center.value}`,
      });
    });

    // Convert to array format for easier API consumption
    const structuredArray = Object.values(structure).map((state) => ({
      stateId: state.stateId,
      stateName: state.stateName,
      districts: Object.values(state.districts).map((district) => ({
        districtId: district.districtId,
        districtName: district.districtName,
        blocks: Object.values(district.blocks).map((block) => ({
          blockId: block.blockId,
          blockName: block.blockName,
          centers: block.centers,
        })),
      })),
    }));

    return structuredArray;
  }, [
    selectedCenter,
    stateOptions,
    districtOptions,
    blockOptions,
    selectedState,
  ]);

  // Console log the hierarchical structure whenever it changes
  useEffect(() => {
    if (hierarchicalCenterStructure.length > 0) {
      // console.log('=== Selected Centers Hierarchical Structure ===');
      // console.log('Format: State -> District -> Block -> Centers');
      // console.log(JSON.stringify(hierarchicalCenterStructure, null, 2));
      // console.log('=== End of Structure ===');

      // Also log a simplified version for props (to refill form)
      const propsFormat = {
        selectedStates: Array.isArray(selectedState)
          ? selectedState
          : selectedState
          ? [selectedState]
          : [],
        selectedDistricts: Array.isArray(selectedDistrict)
          ? selectedDistrict
          : selectedDistrict
          ? [selectedDistrict]
          : [],
        selectedBlocks: selectedBlock,
        selectedCenters: Array.isArray(value) ? value : value ? [value] : [],
        hierarchicalData: hierarchicalCenterStructure,
      };
      // console.log('=== Props Format (for refilling form) ===');
      // console.log('Use this format to pass as props:');
      // console.log('initialState, initialDistrict, initialBlock, value');
      // console.log(JSON.stringify(propsFormat, null, 2));
      // console.log('=== End of Props Format ===');

      // Also create a flat format for backend API
      const flatFormat = hierarchicalCenterStructure.flatMap((state) =>
        (state.districts || []).flatMap((district) =>
          (district.blocks || []).flatMap((block) =>
            (block.centers || []).map((center) => ({
              stateId: state.stateId,
              stateName: state.stateName,
              districtId: district.districtId,
              districtName: district.districtName,
              blockId: block.blockId,
              blockName: block.blockName,
              centerId: center.centerId,
              centerName: center.centerName,
            }))
          )
        )
      );
      // console.log('=== Flat Format (for Backend API) ===');
      // console.log('Array of centers with full hierarchy in each object:');
      // console.log(JSON.stringify(flatFormat, null, 2));
      // console.log('=== End of Flat Format ===');
    } else if (selectedCenter.length === 0) {
      // console.log('=== No Centers Selected ===');
      // console.log('Selected Centers: []');
    }
  }, [
    hierarchicalCenterStructure,
    selectedState,
    selectedDistrict,
    selectedBlock,
    value,
    selectedCenter,
  ]);

  // Multi-select filter component
  const MultiSelectFilter = ({
    label,
    options,
    selectedValues,
    onChange,
    placeholder,
    disabled: filterDisabled,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const containerRef = useRef(null);
    const justOpenedRef = useRef(false);

    // Reset justOpenedRef when dropdown closes
    useEffect(() => {
      if (!isOpen) {
        justOpenedRef.current = false;
      }
    }, [isOpen]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        // Ignore clicks immediately after opening to prevent flickering
        if (justOpenedRef.current) {
          return;
        }

        // Don't close if clicking inside the container (button or dropdown)
        if (
          containerRef.current &&
          containerRef.current.contains(event.target)
        ) {
          return;
        }

        // Close dropdown if clicking outside
        if (isOpen) {
          setIsOpen(false);
          setSearchQuery('');
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    const filteredOptions = options.filter((option) =>
      (option.label || String(option.value || ''))
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    const toggleOption = (option, e) => {
      // Stop event propagation to prevent dropdown from closing
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }

      const optionValue = option.value || option;
      const currentValues = Array.isArray(selectedValues)
        ? selectedValues
        : selectedValues
        ? [selectedValues]
        : [];
      const exists = currentValues.some(
        (v) => String(v) === String(optionValue)
      );

      if (exists) {
        onChange(
          currentValues.filter((v) => String(v) !== String(optionValue))
        );
      } else {
        onChange([...currentValues, optionValue]);
      }

      // Keep dropdown open for multi-select (don't close after selection)
      // setIsOpen(true); // Already open, just keep it open
    };

    const removeValue = (valueToRemove, e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentValues = Array.isArray(selectedValues)
        ? selectedValues
        : selectedValues
        ? [selectedValues]
        : [];
      onChange(
        currentValues.filter((v) => String(v) !== String(valueToRemove))
      );
      // Keep dropdown open after removing a value (user might want to select again)
      // Don't close the dropdown
    };

    const clearAll = (e) => {
      e.stopPropagation();
      e.preventDefault();
      onChange([]);
      // Keep dropdown open after clearing (user might want to select again)
      // Don't close the dropdown
    };

    const selectedArray = Array.isArray(selectedValues)
      ? selectedValues
      : selectedValues
      ? [selectedValues]
      : [];

    const handleButtonClick = (e) => {
      if (filterDisabled) return;

      // Don't toggle if clicking on interactive elements (chips, buttons, icons)
      const target = e.target;
      const clickedElement =
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('.MuiChip-root') ||
        target.closest('.MuiIconButton-root') ||
        target.closest('svg');

      // If we clicked on an interactive element that's not the main button, don't toggle
      if (clickedElement && clickedElement !== e.currentTarget) {
        // Check if it's a child of the main button (chips, clear button, etc.)
        if (e.currentTarget.contains(clickedElement)) {
          // Don't toggle, let the child element handle the click
          // But reset justOpenedRef in case it was set
          justOpenedRef.current = false;
          return;
        }
      }

      // Toggle dropdown state
      const willOpen = !isOpen;
      setIsOpen(willOpen);

      // Set flag to prevent immediate click outside detection
      if (willOpen) {
        justOpenedRef.current = true;
        // Reset flag after a short delay
        setTimeout(() => {
          justOpenedRef.current = false;
        }, 150);
      } else {
        // Reset flag immediately when closing
        justOpenedRef.current = false;
      }
    };

    return (
      <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
        <Box
          component="label"
          sx={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'text.secondary',
            mb: 1,
          }}
        >
          {label}
        </Box>
        <Box
          component="button"
          type="button"
          onClick={handleButtonClick}
          disabled={filterDisabled}
          sx={{
            width: '100%',
            minHeight: '42px',
            px: 1.5,
            py: 1,
            textAlign: 'left',
            borderRadius: 1,
            border: '1px solid',
            borderColor: isOpen ? themeColor : 'divider',
            bgcolor: filterDisabled
              ? 'action.disabledBackground'
              : 'background.paper',
            cursor: filterDisabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap',
            opacity: filterDisabled ? 0.6 : 1,
            '&:hover': filterDisabled
              ? {}
              : {
                  borderColor: themeColor,
                },
            '&:focus': {
              outline: '2px solid',
              outlineColor: themeColor,
              outlineOffset: 2,
            },
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              flexWrap: 'wrap',
              minWidth: 0,
            }}
          >
            {selectedArray.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {placeholder}
              </Typography>
            ) : (
              <>
                {selectedArray.slice(0, 3).map((val) => {
                  const option = options.find(
                    (opt) => String(opt.value) === String(val)
                  );
                  const label = option?.label || String(val);
                  return (
                    <Chip
                      key={val}
                      label={label}
                      size="small"
                      onDelete={(e) => removeValue(val, e)}
                      sx={{
                        maxWidth: '120px',
                        bgcolor: themeColor,
                        color: '#000',
                        '& .MuiChip-deleteIcon': {
                          color: '#000',
                          '&:hover': {
                            color: '#333',
                          },
                        },
                      }}
                    />
                  );
                })}
                {selectedArray.length > 3 && (
                  <Typography variant="caption" color="text.secondary">
                    +{selectedArray.length - 3} more
                  </Typography>
                )}
              </>
            )}
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            {selectedArray.length > 0 && (
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  clearAll(e);
                }}
                sx={{ p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
            <KeyboardArrowDownIcon
              sx={{
                fontSize: '1rem',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </Stack>
        </Box>

        {isOpen && (
          <Paper
            sx={{
              position: 'absolute',
              zIndex: 1300,
              width: '100%',
              mt: 0.5,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              boxShadow: 3,
              overflow: 'hidden',
            }}
          >
            {options.length > 5 && (
              <Box
                sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider' }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    ),
                  }}
                />
              </Box>
            )}
            <Box sx={{ maxHeight: '220px', overflowY: 'auto', p: 0.5 }}>
              {filteredOptions.length === 0 ? (
                <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No options found
                  </Typography>
                </Box>
              ) : (
                filteredOptions.map((option) => {
                  const optionValue = option.value || option;
                  const isSelected = selectedArray.some(
                    (v) => String(v) === String(optionValue)
                  );
                  return (
                    <Box
                      key={optionValue}
                      component="button"
                      type="button"
                      onClick={(e) => toggleOption(option, e)}
                      sx={{
                        width: '100%',
                        px: 1.5,
                        py: 1,
                        textAlign: 'left',
                        borderRadius: 0.5,
                        border: 'none',
                        bgcolor: isSelected ? themeColorLight : 'transparent',
                        color: isSelected ? themeColor : 'text.primary',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        '&:hover': {
                          bgcolor: isSelected
                            ? themeColorLight
                            : 'action.hover',
                        },
                      }}
                    >
                      <Checkbox
                        checked={isSelected}
                        size="small"
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                        sx={{
                          color: themeColor,
                          '&.Mui-checked': {
                            color: themeColor,
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {option.label || String(optionValue)}
                      </Typography>
                    </Box>
                  );
                })
              )}
            </Box>
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Section 1: Geography Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: themeColorLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FilterListIcon sx={{ fontSize: 16, color: themeColor }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Geography Filters
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {hasActiveFilters
                  ? `${totalFiltersCount} filter${
                      totalFiltersCount > 1 ? 's' : ''
                    } active`
                  : 'No filters applied'}
              </Typography>
            </Box>
          </Stack>
          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleClearAllFilters}
              sx={{ textTransform: 'none' }}
            >
              Clear
            </Button>
          )}
        </Stack>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <MultiSelectFilter
              label="State"
              options={stateOptions}
              selectedValues={selectedState}
              onChange={handleStateChange}
              placeholder="Select states..."
              disabled={
                disabled || loadingStates.state || (!isCentralAdmin && stateId)
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MultiSelectFilter
              label="District"
              options={districtOptions}
              selectedValues={selectedDistrict}
              onChange={handleDistrictChange}
              placeholder={
                selectedState.length === 0
                  ? 'Select state first'
                  : 'Select districts...'
              }
              disabled={
                disabled || selectedState.length === 0 || loadingStates.district
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MultiSelectFilter
              label="Block"
              options={blockOptions}
              selectedValues={selectedBlock}
              onChange={(values) => {
                const blockObjects = values.map(
                  (val) =>
                    blockOptions.find(
                      (opt) => String(opt.value) === String(val)
                    ) || { value: val }
                );
                handleBlockChange(null, blockObjects);
              }}
              placeholder={
                selectedDistrict ? 'Select blocks...' : 'Select district first'
              }
              disabled={disabled || !selectedDistrict || loadingStates.block}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2: Center List */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: themeColorLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BusinessIcon sx={{ fontSize: 16, color: themeColor }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Centers
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {centerOptions.length} center
                {centerOptions.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          </Stack>
          {centerOptions.length > 0 && (
            <Button
              variant="outlined"
              size="small"
              onClick={handleSelectAllVisible}
              sx={{
                textTransform: 'none',
                borderColor: themeColor,
                color: themeColor,
                '&:hover': {
                  borderColor: themeColorDark,
                  bgcolor: themeColorLight,
                },
              }}
            >
              {centerOptions.every((c) =>
                (Array.isArray(value) ? value : value ? [value] : []).some(
                  (id) => String(id) === String(c.value)
                )
              ) ? (
                <>
                  <CheckBoxIcon sx={{ mr: 0.5, fontSize: 14 }} />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckBoxOutlineBlankIcon sx={{ mr: 0.5, fontSize: 14 }} />
                  Select All
                </>
              )}
            </Button>
          )}
        </Stack>

        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search centers..."
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setAutocompleteInputValue(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
          />
        </Box>

        <Box
          sx={{
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(4, 1fr)',
            },
            gap: 1.5,
          }}
        >
          {loadingStates.centers ? (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : centerOptions.length === 0 ? (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
              <BusinessIcon
                sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
              />
              <Typography variant="body2" fontWeight={500} gutterBottom>
                No centers found
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {searchKeyword
                  ? 'Try adjusting your search query'
                  : 'Adjust filters to see available centers'}
              </Typography>
            </Box>
          ) : (
            centerOptions.map((center) => {
              const centerIds = Array.isArray(value)
                ? value
                : value
                ? [value]
                : [];
              const isSelected = centerIds.some(
                (id) => String(id) === String(center.value)
              );
              return (
                <Card
                  key={center.value}
                  sx={{
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: isSelected ? themeColor : 'divider',
                    bgcolor: isSelected ? themeColorLight : 'background.paper',
                    '&:hover': {
                      borderColor: themeColor,
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleCenterToggle(center)}
                >
                  <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Checkbox
                        checked={isSelected}
                        size="small"
                        icon={<CheckBoxOutlineBlankIcon />}
                        checkedIcon={<CheckBoxIcon />}
                        sx={{
                          mt: 0.25,
                          color: themeColor,
                          '&.Mui-checked': {
                            color: themeColor,
                          },
                        }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ mb: 0.5 }}
                          noWrap
                        >
                          {center.label || `Center ${center.value}`}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                          flexWrap="wrap"
                        >
                          <LocationOnIcon
                            sx={{ fontSize: 12, color: 'text.secondary' }}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {[center.block, center.district, center.state]
                              .filter(Boolean)
                              .join(' • ') || 'Location not available'}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Paper>

      {/* Section 3: Selected Centers Panel */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: themeColorLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 16, color: themeColor }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Selected Centers
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {selectedCenter.length} center
                {selectedCenter.length !== 1 ? 's' : ''}
                {Object.keys(centersByState).length > 0 &&
                  ` across ${Object.keys(centersByState).length} state${
                    Object.keys(centersByState).length > 1 ? 's' : ''
                  }`}
              </Typography>
            </Box>
          </Stack>
          {selectedCenter.length > 0 && (
            <Button
              variant="text"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleClearAllCenters}
              sx={{ textTransform: 'none', color: 'error.main' }}
            >
              Clear
            </Button>
          )}
        </Stack>

        {selectedCenter.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }}
            />
            <Typography variant="body2" fontWeight={500} gutterBottom>
              No centers selected
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Select centers from the list above
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {Object.entries(centersByState).map(([state, centers]) => (
              <Box key={state}>
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ textTransform: 'uppercase', color: themeColor }}
                  >
                    {state}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({centers.length})
                  </Typography>
                </Stack>
                <Stack spacing={1}>
                  {centers.map((center) => (
                    <Card
                      key={center.value}
                      sx={{
                        p: 1.5,
                        bgcolor: themeColorLight,
                        border: '1px solid',
                        borderColor: themeColor,
                        borderRadius: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{ mb: 0.5 }}
                          >
                            {center.label || `Center ${center.value}`}
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <LocationOnIcon
                              sx={{ fontSize: 12, color: 'text.secondary' }}
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {[center.block, center.district, center.state]
                                .filter(Boolean)
                                .join(' • ') || 'Location not available'}
                            </Typography>
                          </Stack>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveCenter(center.value);
                          }}
                          sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MultipleCenterListWidget;
