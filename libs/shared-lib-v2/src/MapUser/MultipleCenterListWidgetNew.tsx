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
  };

  const handleClearFilters = () => {
    setSelectedState([]);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    setSelectedVillage([]);
    if (onStateChange) onStateChange(null);
    if (onDistrictChange) onDistrictChange(null);
    if (onBlockChange) onBlockChange(null);
  };

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
    </Box>
  );
};

export default MultipleCenterListWidget;
