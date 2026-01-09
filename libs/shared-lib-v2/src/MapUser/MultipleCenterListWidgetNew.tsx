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
  onCenterList?: (centerList: any[]) => void; // Callback with center list
  selectedCenterList?: any[]; // Selected center list
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
  onCenterList,
  selectedCenterList,
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

  // State management
  const [stateOptions, setStateOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [villageOptions, setVillageOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    state: false,
    district: false,
    block: false,
    village: false,
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
  const [selectedVillage, setSelectedVillage] = useState([]);
  const [centerOptions, setCenterOptions] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  // Store selected centers as objects with full details
  const [selectedCenters, setSelectedCenters] = useState<
    Array<{
      value: string;
      label: string;
      state: string;
      district: string;
      block: string;
      village: string;
      stateId: string | number | null;
      districtId: string | number | null;
      blockId: string | number | null;
      villageId: string | number | null;
    }>
  >(selectedCenterList || []);

  // Refs to store district and block IDs from prefilled center details
  const pendingDistrictIdRef = useRef(null);
  const pendingBlockIdRef = useRef<string[] | null>(null);
  const pendingVillageIdRef = useRef<string[] | null>(null);

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
            return prevSelectedState;
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

          return prevSelectedState;
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
            return prevSelectedState;
          }

          if (currentStateId && currentInitialState.length === 0) {
            return [currentStateId];
          } else if (currentInitialState.length > 0) {
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
          const validDistricts = currentInitialDistricts
            .map((districtId) => String(districtId))
            .filter((districtId) =>
              districts.some((d) => String(d.value) === districtId)
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
      // Handle multiple districts - get array of selected districts
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

  // Load village options when block changes
  useEffect(() => {
    const loadVillageOptions = async () => {
      if (!selectedBlock || selectedBlock.length === 0) {
        setVillageOptions([]);
        setSelectedVillage([]);
        return;
      }

      setLoadingStates((prev) => ({ ...prev, village: true }));
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
          {
            fieldName: 'village',
            controllingfieldfk: selectedBlock,
            sort: ['village_name', 'asc'],
          }
        );
        const villages =
          response?.data?.result?.values?.map((item) => ({
            value: item.value,
            label: item.label,
          })) || [];
        setVillageOptions(villages);

        // Set pending villages if available
        if (
          pendingVillageIdRef.current &&
          pendingVillageIdRef.current.length > 0 &&
          selectedVillage.length === 0
        ) {
          const pendingVillageIds = pendingVillageIdRef.current;
          const validVillages = pendingVillageIds
            .map((villageId) => String(villageId))
            .filter((villageId) =>
              villages.some((v) => String(v.value) === villageId)
            );
          if (validVillages.length > 0) {
            setSelectedVillage(validVillages);
            pendingVillageIdRef.current = null;
          }
        }
      } catch (error) {
        console.error('Error loading villages:', error);
        setVillageOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, village: false }));
      }
    };
    loadVillageOptions();
  }, [selectedBlock]);

  // Search centers function
  const searchCenters = useCallback(async () => {
    // Allow search if we have at least state selected OR if there's a search keyword
    const selectedStates = Array.isArray(selectedState)
      ? selectedState
      : selectedState
      ? [selectedState]
      : [];

    // If no state selected and no search keyword, don't search
    if (selectedStates.length === 0 && !searchKeyword) {
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

      if (selectedStates.length > 0) {
        filters.state = selectedStates;
      }

      const selectedDistricts = Array.isArray(selectedDistrict)
        ? selectedDistrict
        : selectedDistrict
        ? [selectedDistrict]
        : [];
      if (selectedDistricts.length > 0) {
        filters.district = selectedDistricts;
      }

      if (selectedBlock.length > 0) {
        filters.block = selectedBlock;
      }

      if (selectedVillage.length > 0) {
        filters.village = selectedVillage;
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

            // Extract location data from customFields
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
            const villageField = customFields.find(
              (field) => field.label === 'VILLAGE'
            );

            const stateValue =
              stateField?.selectedValues?.[0]?.value ||
              stateField?.selectedValues?.[0]?.label ||
              '';
            const stateIdValue = stateField?.selectedValues?.[0]?.id || null;
            const districtValue =
              districtField?.selectedValues?.[0]?.value ||
              districtField?.selectedValues?.[0]?.label ||
              '';
            const districtIdValue =
              districtField?.selectedValues?.[0]?.id || null;
            const blockValue =
              blockField?.selectedValues?.[0]?.value ||
              blockField?.selectedValues?.[0]?.label ||
              '';
            const blockIdValue = blockField?.selectedValues?.[0]?.id || null;
            const villageValue =
              villageField?.selectedValues?.[0]?.value ||
              villageField?.selectedValues?.[0]?.label ||
              '';
            const villageIdValue =
              villageField?.selectedValues?.[0]?.id || null;

            return {
              value: item.cohortId,
              label: item.name?.trim() || `Center ${item.cohortId}`,
              state: stateValue,
              district: districtValue,
              block: blockValue,
              village: villageValue,
              stateId: stateIdValue,
              districtId: districtIdValue,
              blockId: blockIdValue,
              villageId: villageIdValue,
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
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedVillage,
    searchKeyword,
  ]);

  // Debounced search for centers - load when filters change or when user types
  useEffect(() => {
    const selectedStates = Array.isArray(selectedState)
      ? selectedState
      : selectedState
      ? [selectedState]
      : [];

    // If no state selected and no search keyword, clear options
    if (selectedStates.length === 0 && !searchKeyword) {
      setCenterOptions([]);
      return;
    }

    // Use shorter delay for filter changes, longer delay for typing
    const delay = searchKeyword ? 500 : 50;

    const timeoutId = setTimeout(() => {
      searchCenters();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [
    selectedState,
    selectedDistrict,
    selectedBlock,
    selectedVillage,
    searchKeyword,
    searchCenters,
  ]);

  // Handler functions
  const handleStateChange = (event, newValue) => {
    const stateIds = Array.isArray(newValue)
      ? newValue.map((state) => String(state.value))
      : newValue
      ? [String(newValue.value)]
      : [];

    setSelectedState(stateIds);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    setSelectedVillage([]);
    setCenterOptions([]); // Clear centers when filter changes
    // Don't clear selectedCenters - keep them
    // Call onStateChange callback if provided
    if (onStateChange) {
      onStateChange(stateIds.length > 0 ? stateIds : null);
    }
  };

  const handleDistrictChange = (event, newValue) => {
    const districtIds = Array.isArray(newValue)
      ? newValue.map((district) => String(district.value))
      : newValue
      ? [String(district.value)]
      : [];

    setSelectedDistrict(districtIds);
    setSelectedBlock([]);
    setSelectedVillage([]);
    setCenterOptions([]); // Clear centers when filter changes
    // Don't clear selectedCenters - keep them
    // Call onDistrictChange callback if provided
    if (onDistrictChange) {
      onDistrictChange(districtIds.length > 0 ? districtIds : null);
    }
  };

  const handleBlockChange = (event, newValue) => {
    const blockIds = Array.isArray(newValue)
      ? newValue.map((block) => String(block.value))
      : newValue
      ? [String(newValue.value)]
      : [];

    setSelectedBlock(blockIds);
    setSelectedVillage([]);
    setCenterOptions([]); // Clear centers when filter changes
    // Don't clear selectedCenters - keep them
    // Call onBlockChange callback if provided
    if (onBlockChange) {
      onBlockChange(blockIds.length > 0 ? blockIds : null);
    }
  };

  const handleVillageChange = (event, newValue) => {
    const villageIds = Array.isArray(newValue)
      ? newValue.map((village) => String(village.value))
      : newValue
      ? [String(newValue.value)]
      : [];

    setSelectedVillage(villageIds);
    setCenterOptions([]); // Clear centers when filter changes
    // Don't clear selectedCenters - keep them
  };

  const handleClearFilters = () => {
    setSelectedState([]);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    setSelectedVillage([]);
    setCenterOptions([]);
    // Don't clear selectedCenters - keep them
    if (onStateChange) onStateChange(null);
    if (onDistrictChange) onDistrictChange(null);
    if (onBlockChange) onBlockChange(null);
  };

  // Get selected center IDs for comparison
  const selectedCenterIds = useMemo(() => {
    return selectedCenters.map((center) => center.value);
  }, [selectedCenters]);

  // Center selection handlers
  const handleCenterToggle = (center: {
    value: string;
    label: string;
    state: string;
    district: string;
    block: string;
    village: string;
    stateId: string | number | null;
    districtId: string | number | null;
    blockId: string | number | null;
    villageId: string | number | null;
  }) => {
    setSelectedCenters((prev) => {
      const isSelected = prev.some((c) => c.value === center.value);
      let newSelection;

      if (isSelected) {
        // Remove from selection
        newSelection = prev.filter((c) => c.value !== center.value);
      } else {
        // Append to selection (don't replace)
        newSelection = [...prev, center];
      }

      // Call onChange callback with IDs
      const centerIds = newSelection.map((c) => c.value);
      if (onChange) {
        onChange(centerIds.length > 0 ? centerIds : null);
      }
      if (onCenterList) {
        onCenterList(newSelection);
      }

      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const allSelected = centerOptions.every((center) =>
      selectedCenterIds.includes(center.value)
    );

    if (allSelected) {
      // Deselect all centers that are in current centerOptions
      const centerIdsToRemove = centerOptions.map((c) => c.value);
      setSelectedCenters((prev) => {
        const newSelection = prev.filter(
          (c) => !centerIdsToRemove.includes(c.value)
        );
        const centerIds = newSelection.map((c) => c.value);
        if (onChange) {
          onChange(centerIds.length > 0 ? centerIds : null);
        }
        if (onCenterList) {
          onCenterList(newSelection);
        }
        return newSelection;
      });
    } else {
      // Select all centers from current centerOptions (append)
      setSelectedCenters((prev) => {
        const existingIds = prev.map((c) => c.value);
        const centersToAdd = centerOptions.filter(
          (c) => !existingIds.includes(c.value)
        );
        const newSelection = [...prev, ...centersToAdd];
        const centerIds = newSelection.map((c) => c.value);
        if (onChange) {
          onChange(centerIds.length > 0 ? centerIds : null);
        }
        if (onCenterList) {
          onCenterList(newSelection);
        }
        return newSelection;
      });
    }
  };

  const isAllSelected = useMemo(() => {
    if (centerOptions.length === 0) return false;
    return centerOptions.every((center) =>
      selectedCenterIds.includes(center.value)
    );
  }, [centerOptions, selectedCenterIds]);

  // Clear selected centers
  const handleClearSelectedCenters = () => {
    setSelectedCenters([]);
    if (onChange) {
      onChange(null);
    }
    if (onCenterList) {
      onCenterList([]);
    }
  };

  // Group selected centers by state
  const selectedCentersByState = useMemo(() => {
    const grouped: Record<
      string,
      Array<{
        value: string;
        label: string;
        state: string;
        district: string;
        block: string;
        village: string;
        stateId: string | number | null;
        districtId: string | number | null;
        blockId: string | number | null;
        villageId: string | number | null;
      }>
    > = {};

    selectedCenters.forEach((center) => {
      const state = center.state || 'Unknown';
      if (!grouped[state]) {
        grouped[state] = [];
      }
      grouped[state].push(center);
    });

    return grouped;
  }, [selectedCenters]);

  const selectedCentersCount = selectedCenters.length;
  const selectedStatesCount = Object.keys(selectedCentersByState).length;

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
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
    count += selectedStates.length;
    count += selectedDistricts.length;
    count += selectedBlock.length;
    count += selectedVillage.length;
    return count;
  }, [selectedState, selectedDistrict, selectedBlock, selectedVillage]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Get selected block labels
  const selectedBlockLabels = useMemo(() => {
    if (selectedBlock.length === 0) return [];
    return selectedBlock
      .map((blockId) => {
        const block = blockOptions.find(
          (b) => String(b.value) === String(blockId)
        );
        return block?.label || null;
      })
      .filter(Boolean);
  }, [selectedBlock, blockOptions]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Geography Filters Section */}
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
                  ? `${activeFiltersCount} filter${
                      activeFiltersCount > 1 ? 's' : ''
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
              onClick={handleClearFilters}
              sx={{ textTransform: 'none' }}
            >
              Clear
            </Button>
          )}
        </Stack>

        <Grid container spacing={2}>
          {/* State Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                State
              </Typography>
              <Autocomplete
                multiple
                options={stateOptions}
                getOptionLabel={(option) =>
                  option.label || String(option.value)
                }
                value={stateOptions.filter((state) => {
                  const selectedStates = Array.isArray(selectedState)
                    ? selectedState
                    : selectedState
                    ? [selectedState]
                    : [];
                  return selectedStates.includes(String(state.value));
                })}
                onChange={handleStateChange}
                disabled={
                  disabled ||
                  loadingStates.state ||
                  (!isCentralAdmin && stateId)
                }
                loading={loadingStates.state}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select states..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStates.state ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.value}
                      label={option.label}
                      size="small"
                      deleteIcon={<CloseIcon />}
                      sx={{
                        bgcolor: themeColor,
                        color: '#000',
                        '& .MuiChip-deleteIcon': {
                          color: '#000',
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* District Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                District
              </Typography>
              <Autocomplete
                multiple
                options={districtOptions}
                getOptionLabel={(option) =>
                  option.label || String(option.value)
                }
                value={districtOptions.filter((district) => {
                  const selectedDistricts = Array.isArray(selectedDistrict)
                    ? selectedDistrict
                    : selectedDistrict
                    ? [selectedDistrict]
                    : [];
                  return selectedDistricts.includes(String(district.value));
                })}
                onChange={handleDistrictChange}
                disabled={
                  disabled ||
                  !selectedState ||
                  (Array.isArray(selectedState)
                    ? selectedState.length === 0
                    : !selectedState) ||
                  loadingStates.district
                }
                loading={loadingStates.district}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select districts..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStates.district ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.value}
                      label={option.label}
                      size="small"
                      deleteIcon={<CloseIcon />}
                      sx={{
                        bgcolor: themeColor,
                        color: '#000',
                        '& .MuiChip-deleteIcon': {
                          color: '#000',
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Block Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                Block
              </Typography>
              <Autocomplete
                multiple
                options={blockOptions}
                getOptionLabel={(option) =>
                  option.label || String(option.value)
                }
                value={blockOptions.filter((block) =>
                  selectedBlock.includes(String(block.value))
                )}
                onChange={handleBlockChange}
                disabled={
                  disabled ||
                  !selectedDistrict ||
                  (Array.isArray(selectedDistrict)
                    ? selectedDistrict.length === 0
                    : !selectedDistrict) ||
                  loadingStates.block
                }
                loading={loadingStates.block}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select blocks..."
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
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.value}
                      label={option.label}
                      size="small"
                      deleteIcon={<CloseIcon />}
                      sx={{
                        bgcolor: themeColor,
                        color: '#000',
                        '& .MuiChip-deleteIcon': {
                          color: '#000',
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
          </Grid>

          {/* Village Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  mb: 1,
                }}
              >
                Village
              </Typography>
              <Autocomplete
                multiple
                options={villageOptions}
                getOptionLabel={(option) =>
                  option.label || String(option.value)
                }
                value={villageOptions.filter((village) =>
                  selectedVillage.includes(String(village.value))
                )}
                onChange={handleVillageChange}
                disabled={
                  disabled ||
                  !selectedBlock ||
                  selectedBlock.length === 0 ||
                  loadingStates.village
                }
                loading={loadingStates.village}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select villages..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingStates.village ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.value}
                      label={option.label}
                      size="small"
                      deleteIcon={<CloseIcon />}
                      sx={{
                        bgcolor: themeColor,
                        color: '#000',
                        '& .MuiChip-deleteIcon': {
                          color: '#000',
                        },
                      }}
                    />
                  ))
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  },
                }}
              />
            </Box>
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
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={isAllSelected}
                onChange={handleSelectAll}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                sx={{
                  color: themeColor,
                  '&.Mui-checked': {
                    color: themeColor,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Select All
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search centers..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        </Box>

        {/* Center Cards Grid */}
        {loadingStates.centers ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <CircularProgress sx={{ color: themeColor }} />
          </Box>
        ) : centerOptions.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No centers found. Please adjust your filters.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: '600px',
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
              },
            }}
          >
            <Grid container spacing={2} sx={{ display: 'flex' }}>
              {centerOptions.map((center) => {
                const isSelected = selectedCenterIds.includes(center.value);
                const locationParts = [
                  center.village,
                  center.block,
                  center.district,
                  center.state,
                ].filter(Boolean);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={center.value}
                    sx={{ display: 'flex' }}
                  >
                    <Card
                      sx={{
                        border: isSelected
                          ? `2px solid ${themeColor}`
                          : '1px solid',
                        borderColor: isSelected ? themeColor : 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: themeColor,
                        },
                      }}
                      onClick={() => handleCenterToggle(center)}
                    >
                      <CardContent
                        sx={{
                          p: 2,
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            flex: 1,
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleCenterToggle(center)}
                            onClick={(e) => e.stopPropagation()}
                            icon={<CheckBoxOutlineBlankIcon />}
                            checkedIcon={<CheckBoxIcon />}
                            sx={{
                              color: themeColor,
                              '&.Mui-checked': {
                                color: themeColor,
                              },
                              p: 0,
                              mt: 0.5,
                              flexShrink: 0,
                            }}
                          />
                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '2.5em', // Ensure consistent height for 2 lines
                              }}
                            >
                              {center.label}
                            </Typography>
                            {locationParts.length > 0 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <LocationOnIcon
                                  sx={{
                                    fontSize: 14,
                                    color: 'text.secondary',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  {locationParts.map((part, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && (
                                        <Box
                                          component="span"
                                          sx={{
                                            mx: 0.5,
                                            color: 'text.secondary',
                                          }}
                                        >
                                          •
                                        </Box>
                                      )}
                                      <Box
                                        component="span"
                                        sx={{
                                          color:
                                            index === locationParts.length - 1
                                              ? themeColor
                                              : 'text.secondary',
                                          fontWeight:
                                            index === locationParts.length - 1
                                              ? 500
                                              : 400,
                                        }}
                                      >
                                        {part}
                                      </Box>
                                    </React.Fragment>
                                  ))}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Section 3: Selected Centers */}
      {selectedCentersCount > 0 && (
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
                <CheckCircleIcon sx={{ fontSize: 16, color: themeColor }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Selected Centers
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedCentersCount} center
                  {selectedCentersCount !== 1 ? 's' : ''} across{' '}
                  {selectedStatesCount} state
                  {selectedStatesCount !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="text"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={handleClearSelectedCenters}
              sx={{ textTransform: 'none' }}
            >
              Clear
            </Button>
          </Stack>

          {/* Selected Centers Grouped by State */}
          <Grid container spacing={2}>
            {Object.entries(selectedCentersByState).map(([state, centers]) => (
              <Grid item xs={12} sm={6} key={state}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{
                      color: themeColor,
                      mb: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {state} ({centers.length})
                  </Typography>
                  <Stack spacing={1.5}>
                    {centers.map((center) => {
                      const locationParts = [
                        center.village,
                        center.block,
                        center.district,
                      ].filter(Boolean);

                      return (
                        <Card
                          key={center.value}
                          sx={{
                            bgcolor: themeColorLight, // Theme color background
                            border: '1px solid',
                            borderColor: 'rgba(253, 190, 22, 0.3)', // Theme color border with 30% opacity
                            borderRadius: 1.5,
                            p: 1.5,
                            position: 'relative',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleCenterToggle(center)}
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              p: 0.5,
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main',
                                bgcolor: 'rgba(0, 0, 0, 0.04)',
                              },
                            }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ mb: 0.5, pr: 3 }}
                          >
                            {center.label}
                          </Typography>
                          {locationParts.length > 0 && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                              }}
                            >
                              <LocationOnIcon
                                sx={{
                                  fontSize: 12,
                                  color: 'text.secondary',
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                }}
                              >
                                {locationParts.map((part, index) => (
                                  <React.Fragment key={index}>
                                    {index > 0 && (
                                      <Box
                                        component="span"
                                        sx={{
                                          mx: 0.5,
                                          color: 'text.secondary',
                                        }}
                                      >
                                        •
                                      </Box>
                                    )}
                                    <Box component="span">{part}</Box>
                                  </React.Fragment>
                                ))}
                              </Typography>
                            </Box>
                          )}
                        </Card>
                      );
                    })}
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default MultipleCenterListWidget;
