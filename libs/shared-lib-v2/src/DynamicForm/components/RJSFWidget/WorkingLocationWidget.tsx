// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || '';

const getNestedValue = (obj: any, path: string) => {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

// Helper function to replace ** with actual value in nested objects
const replacePlaceholder = (obj: any, replacement: any): any => {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item) => replacePlaceholder(item, replacement));
    } else {
      const replaced = { ...obj };
      for (const key in replaced) {
        if (replaced[key] === '**') {
          replaced[key] = [replacement];
        } else if (typeof replaced[key] === 'object') {
          replaced[key] = replacePlaceholder(replaced[key], replacement);
        }
      }
      return replaced;
    }
  }
  return obj;
};

interface StateData {
  id: number;
  name: string;
}

interface DistrictData {
  id: number;
  name: string;
  stateId: number;
}

interface BlockData {
  id: number;
  name: string;
  districtId: number;
}

interface VillageData {
  id: number;
  name: string;
  blockId: number;
}

interface SelectedVillage {
  id: number;
  name: string;
}

interface SelectedBlock {
  id: number;
  name: string;
  villages: SelectedVillage[];
}

interface SelectedDistrict {
  districtId: number;
  districtName: string;
  blocks: SelectedBlock[];
}

interface SelectedState {
  stateId: number;
  stateName: string;
  districts: SelectedDistrict[];
}

const centerId =
  typeof window !== 'undefined'
    ? localStorage.getItem('workingLocationCenterId')
    : '';

// API configuration constants (moved outside component to prevent recreation on each render)
const STATE_API_CONFIG = {
  url: `/api/dynamic-form/get-sdbv`,
  method: 'POST',
  payload: {
    centerId: centerId,
    searchType: 'state',
    cohortSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/cohortHierarchy`,
    SDBVSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
    authToken:
      typeof window !== 'undefined' ? localStorage.getItem('token') : '',
    tenantId:
      typeof window !== 'undefined' ? localStorage.getItem('tenantId') : '',
    findKeyword: '',
  },
  options: {
    optionObj: 'result',
    label: 'name',
    value: 'id',
  },
};

const DISTRICT_API_CONFIG = {
  url: `/api/dynamic-form/get-sdbv`,
  method: 'POST',
  payload: {
    centerId: centerId,
    searchType: 'district',
    cohortSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/cohortHierarchy`,
    SDBVSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
    authToken:
      typeof window !== 'undefined' ? localStorage.getItem('token') : '',
    tenantId:
      typeof window !== 'undefined' ? localStorage.getItem('tenantId') : '',
    findKeyword: '**',
  },
  options: {
    optionObj: 'result',
    label: 'name',
    value: 'id',
  },
};

const BLOCK_API_CONFIG = {
  url: `/api/dynamic-form/get-sdbv`,
  method: 'POST',
  payload: {
    centerId: centerId,
    searchType: 'block',
    cohortSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/cohortHierarchy`,
    SDBVSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
    authToken:
      typeof window !== 'undefined' ? localStorage.getItem('token') : '',
    tenantId:
      typeof window !== 'undefined' ? localStorage.getItem('tenantId') : '',
    findKeyword: '**',
  },
  options: {
    optionObj: 'result',
    label: 'name',
    value: 'id',
  },
};

const VILLAGE_API_CONFIG = {
  url: `/api/dynamic-form/get-sdbv`,
  method: 'POST',
  payload: {
    centerId: centerId,
    searchType: 'village',
    cohortSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/cohortHierarchy`,
    SDBVSearchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
    authToken:
      typeof window !== 'undefined' ? localStorage.getItem('token') : '',
    tenantId:
      typeof window !== 'undefined' ? localStorage.getItem('tenantId') : '',
    findKeyword: '**',
  },
  options: {
    optionObj: 'result',
    label: 'name',
    value: 'id',
  },
};

const WorkingLocationWidget = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
  schema,
  uiSchema,
  options,
}: WidgetProps) => {
  const { t } = useTranslation();
  // Normalize initial value to ensure blocks have villages array
  const normalizeInitialValue = (val: SelectedState[]): SelectedState[] => {
    if (!val || !Array.isArray(val)) return [];
    return val.map((state) => ({
      ...state,
      districts: state.districts.map((district) => ({
        ...district,
        blocks: district.blocks.map((block) => ({
          ...block,
          villages: block.villages || [],
        })),
      })),
    }));
  };

  const [selectedStates, setSelectedStates] = useState<SelectedState[]>(
    normalizeInitialValue(value)
  );
  const [stateSelectValue, setStateSelectValue] = useState('');
  const [districtSelectValues, setDistrictSelectValues] = useState<{
    [stateId: number]: number;
  }>({});

  // API data states
  const [states, setStates] = useState<StateData[]>([]);
  const [districts, setDistricts] = useState<{
    [stateId: number]: DistrictData[];
  }>({});
  const [blocks, setBlocks] = useState<{ [districtId: number]: BlockData[] }>(
    {}
  );
  const [villages, setVillages] = useState<{
    [blockId: number]: VillageData[];
  }>({});
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState<{
    [stateId: number]: boolean;
  }>({});

  // Get available states (not yet selected)
  const availableStates = states.filter(
    (state) => !selectedStates.some((selected) => selected.stateId === state.id)
  );

  // Fetch states from API
  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoadingStates(true);
        const headers = {
          'Content-Type': 'application/json',
          tenantId: localStorage.getItem('tenantId') || '',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          academicyearid: localStorage.getItem('academicYearId') || '',
        };

        const response = await axios.post(
          STATE_API_CONFIG.url,
          {
            ...STATE_API_CONFIG.payload,
            centerId:
              typeof window !== 'undefined'
                ? localStorage.getItem('workingLocationCenterId')
                : '',
          } || {},
          { headers }
        );

        const statesData = getNestedValue(
          response.data,
          STATE_API_CONFIG.options?.optionObj || 'result.values'
        );
        if (statesData && Array.isArray(statesData)) {
          const formattedStates = statesData.map((state: any) => ({
            id: Number(state[STATE_API_CONFIG.options?.value || 'value']),
            name: state[STATE_API_CONFIG.options?.label || 'label'],
          }));
          setStates(formattedStates);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []); // Empty dependency array - only run once on mount

  // Handle initial data - fetch districts and blocks for pre-selected data
  useEffect(() => {
    const handleInitialData = async () => {
      if (selectedStates.length > 0) {
        for (const state of selectedStates) {
          // Fetch districts for this state
          await fetchDistrictsForState(state.stateId);

          // Fetch blocks for each district
          for (const district of state.districts) {
            await fetchBlocksForDistrict(district.districtId);

            // Fetch villages for each block
            for (const block of district.blocks) {
              await fetchVillagesForBlock(block.id);
            }
          }
        }
      }
    };

    // Only run if states are loaded and we have initial data
    if (states.length > 0 && selectedStates.length > 0) {
      handleInitialData();
    }
  }, [states, selectedStates]);

  // Normalize initial data to ensure blocks have villages array
  const normalizeSelectedStates = (
    states: SelectedState[]
  ): SelectedState[] => {
    return states.map((state) => ({
      ...state,
      districts: state.districts.map((district) => ({
        ...district,
        blocks: district.blocks.map((block) => ({
          ...block,
          villages: block.villages || [],
        })),
      })),
    }));
  };

  // Handle value prop changes (e.g., form reset, external updates)
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(selectedStates)) {
      const normalizedValue = normalizeSelectedStates(value);
      setSelectedStates(normalizedValue);
    }
  }, [value]);

  // Fetch districts when a state is selected
  const fetchDistrictsForState = async (stateId: number) => {
    if (districts[stateId]) return; // Already loaded

    try {
      setLoadingDistricts((prev) => ({ ...prev, [stateId]: true }));
      const headers = {
        'Content-Type': 'application/json',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };

      // Replace ** with stateId in payload
      const payload = replacePlaceholder(
        {
          ...DISTRICT_API_CONFIG.payload,
          centerId:
            typeof window !== 'undefined'
              ? localStorage.getItem('workingLocationCenterId')
              : '',
        } || {},
        stateId
      );

      const response = await axios.post(DISTRICT_API_CONFIG.url, payload, {
        headers,
      });

      const districtsData = getNestedValue(
        response.data,
        DISTRICT_API_CONFIG.options?.optionObj || 'result.values'
      );
      if (districtsData && Array.isArray(districtsData)) {
        const formattedDistricts = districtsData.map((district: any) => ({
          id: Number(district[DISTRICT_API_CONFIG.options?.value || 'value']),
          name: district[DISTRICT_API_CONFIG.options?.label || 'label'],
          stateId: stateId,
        }));
        setDistricts((prev) => ({ ...prev, [stateId]: formattedDistricts }));
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    } finally {
      setLoadingDistricts((prev) => ({ ...prev, [stateId]: false }));
    }
  };

  // Fetch blocks when a district is selected
  const fetchBlocksForDistrict = async (districtId: number) => {
    if (blocks[districtId]) return; // Already loaded

    try {
      const headers = {
        'Content-Type': 'application/json',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };

      // Replace ** with districtId in payload
      const payload = replacePlaceholder(
        {
          ...BLOCK_API_CONFIG.payload,
          centerId:
            typeof window !== 'undefined'
              ? localStorage.getItem('workingLocationCenterId')
              : '',
        } || {},
        districtId
      );

      const response = await axios.post(BLOCK_API_CONFIG.url, payload, {
        headers,
      });

      const blocksData = getNestedValue(
        response.data,
        BLOCK_API_CONFIG.options?.optionObj || 'result.values'
      );
      if (blocksData && Array.isArray(blocksData)) {
        const formattedBlocks = blocksData.map((block: any) => ({
          id: Number(block[BLOCK_API_CONFIG.options?.value || 'value']),
          name: block[BLOCK_API_CONFIG.options?.label || 'label'],
          districtId: districtId,
        }));
        setBlocks((prev) => ({ ...prev, [districtId]: formattedBlocks }));
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
    }
  };

  // Fetch villages when a block is selected
  const fetchVillagesForBlock = async (blockId: number) => {
    if (villages[blockId]) return; // Already loaded

    try {
      const headers = {
        'Content-Type': 'application/json',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };

      // Replace ** with blockId in payload (village API expects array)
      const payload = {
        ...VILLAGE_API_CONFIG.payload,
        centerId:
          typeof window !== 'undefined'
            ? localStorage.getItem('workingLocationCenterId')
            : '',
        findKeyword: blockId,
      };

      const response = await axios.post(VILLAGE_API_CONFIG.url, payload, {
        headers,
      });

      const villagesData = getNestedValue(
        response.data,
        VILLAGE_API_CONFIG.options?.optionObj || 'result.values'
      );
      if (villagesData && Array.isArray(villagesData)) {
        const formattedVillages = villagesData.map((village: any) => ({
          id: Number(village[VILLAGE_API_CONFIG.options?.value || 'value']),
          name: village[VILLAGE_API_CONFIG.options?.label || 'label'],
          blockId: blockId,
        }));
        setVillages((prev) => ({ ...prev, [blockId]: formattedVillages }));
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const handleStateSelect = async (event: any) => {
    const selectedStateId = event.target.value;
    if (selectedStateId) {
      const selectedState = states.find((s) => s.id === selectedStateId);
      if (selectedState) {
        const newState: SelectedState = {
          stateId: selectedState.id,
          stateName: selectedState.name,
          districts: [],
        };
        const updatedStates = [...selectedStates, newState];
        setSelectedStates(updatedStates);
        setStateSelectValue('');
        onChange(updatedStates);

        // Fetch districts for this state
        await fetchDistrictsForState(selectedState.id);
      }
    }
  };

  const handleDistrictSelect = async (stateId: number, districtId: number) => {
    if (districtId) {
      const district = districts[stateId]?.find((d) => d.id === districtId);
      if (district) {
        const updatedStates = selectedStates.map((state) => {
          if (state.stateId === stateId) {
            const districtExists = state.districts.some(
              (d) => d.districtId === districtId
            );
            if (!districtExists) {
              return {
                ...state,
                districts: [
                  ...state.districts,
                  {
                    districtId: district.id,
                    districtName: district.name,
                    blocks: [],
                  },
                ],
              };
            }
          }
          return state;
        });
        setSelectedStates(updatedStates);
        setDistrictSelectValues({ ...districtSelectValues, [stateId]: '' });
        onChange(updatedStates);

        // Fetch blocks for this district
        await fetchBlocksForDistrict(district.id);
      }
    }
  };

  const handleBlockSelect = async (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            // Check if block is already selected
            const isBlockSelected = district.blocks.some(
              (block) => block.id === blockId
            );
            if (!isBlockSelected) {
              // Find the block data to get both ID and name
              const blockData = blocks[districtId]?.find(
                (block) => block.id === blockId
              );
              if (blockData) {
                const newBlock: SelectedBlock = {
                  id: blockData.id,
                  name: blockData.name,
                  villages: [],
                };
                const updatedBlocks = [...district.blocks, newBlock];
                return { ...district, blocks: updatedBlocks };
              }
            }
            return district;
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange(updatedStates);

    // Fetch villages for this block
    await fetchVillagesForBlock(blockId);
  };

  const handleVillageSelect = (
    stateId: number,
    districtId: number,
    blockId: number,
    villageId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            const updatedBlocks = district.blocks.map((block) => {
              if (block.id === blockId) {
                // Check if village is already selected
                const isVillageSelected = block.villages.some(
                  (village) => village.id === villageId
                );
                if (!isVillageSelected) {
                  // Find the village data to get both ID and name
                  const villageData = villages[blockId]?.find(
                    (village) => village.id === villageId
                  );
                  if (villageData) {
                    const newVillage: SelectedVillage = {
                      id: villageData.id,
                      name: villageData.name,
                    };
                    const updatedVillages = [...block.villages, newVillage];
                    return { ...block, villages: updatedVillages };
                  }
                }
                return block;
              }
              return block;
            });
            return { ...district, blocks: updatedBlocks };
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange(updatedStates);
  };

  const handleRemoveVillage = (
    stateId: number,
    districtId: number,
    blockId: number,
    villageId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            const updatedBlocks = district.blocks.map((block) => {
              if (block.id === blockId) {
                return {
                  ...block,
                  villages: block.villages.filter(
                    (village) => village.id !== villageId
                  ),
                };
              }
              return block;
            });
            return { ...district, blocks: updatedBlocks };
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange(updatedStates);
  };

  const handleRemoveBlock = (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            return {
              ...district,
              blocks: district.blocks.filter((block) => block.id !== blockId),
            };
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange(updatedStates);
  };

  const handleRemoveDistrict = (stateId: number, districtId: number) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        return {
          ...state,
          districts: state.districts.filter((d) => d.districtId !== districtId),
        };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange(updatedStates);
  };

  const handleRemoveState = (stateId: number) => {
    const updatedStates = selectedStates.filter((s) => s.stateId !== stateId);
    setSelectedStates(updatedStates);
    // Update district select values to remove the state
    const { [stateId]: _, ...rest } = districtSelectValues;
    setDistrictSelectValues(rest);
    onChange(updatedStates);
  };

  const getAvailableDistricts = (stateId: number) => {
    const state = selectedStates.find((s) => s.stateId === stateId);
    if (!state) return [];
    const selectedDistrictIds = state.districts.map((d) => d.districtId);
    return (
      districts[stateId]?.filter(
        (district) => !selectedDistrictIds.includes(district.id)
      ) || []
    );
  };

  const getAvailableBlocks = (stateId: number, districtId: number) => {
    const allBlocks = blocks[districtId] || [];
    const selectedBlocks = getSelectedBlocksForDistrict(stateId, districtId);
    const selectedBlockIds = selectedBlocks.map((block) => block.id);
    return allBlocks.filter((block) => !selectedBlockIds.includes(block.id));
  };

  const getSelectedBlocksForDistrict = (
    stateId: number,
    districtId: number
  ) => {
    const state = selectedStates.find((s) => s.stateId === stateId);
    if (!state) return [];
    const district = state.districts.find((d) => d.districtId === districtId);
    if (!district) return [];
    return district.blocks;
  };

  const getSelectedVillagesForBlock = (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const state = selectedStates.find((s) => s.stateId === stateId);
    if (!state) return [];
    const district = state.districts.find((d) => d.districtId === districtId);
    if (!district) return [];
    const block = district.blocks.find((b) => b.id === blockId);
    if (!block) return [];
    return block.villages;
  };

  const getAvailableVillages = (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const allVillages = villages[blockId] || [];
    const selectedVillages = getSelectedVillagesForBlock(
      stateId,
      districtId,
      blockId
    );
    const selectedVillageIds = selectedVillages.map((village) => village.id);
    return allVillages.filter(
      (village) => !selectedVillageIds.includes(village.id)
    );
  };

  // Check if any villages are selected across all states/districts/blocks
  const hasSelectedVillages = () => {
    return selectedStates.some((state) =>
      state.districts.some((district) =>
        district.blocks.some((block) => block.villages.length > 0)
      )
    );
  };

  // Get a string representation of selected villages for the hidden input
  const getSelectedVillagesString = () => {
    const allSelectedVillages: string[] = [];
    selectedStates.forEach((state) => {
      state.districts.forEach((district) => {
        district.blocks.forEach((block) => {
          block.villages.forEach((village) => {
            allSelectedVillages.push(village.name);
          });
        });
      });
    });
    return allSelectedVillages.join(', ');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {rawErrors.length > 0 && (
        <Typography
          color="error"
          variant="caption"
          sx={{ display: 'block', mb: 1 }}
        >
          {rawErrors[0]}
        </Typography>
      )}

      {/* State Selection */}
      {loadingStates ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <CircularProgress size={24} />
          <Typography variant="caption" sx={{ ml: 2 }}>
            Loading states...
          </Typography>
        </Box>
      ) : (
        availableStates.length > 0 && (
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              {label} {required && '*'}
            </Typography>
            <Select
              value={stateSelectValue}
              onChange={handleStateSelect}
              displayEmpty
              disabled={disabled || readonly}
              size="small"
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>
              {availableStates.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{ mt: 0.5 }}
            >
              Select a state to start
            </Typography>
          </FormControl>
        )
      )}
      {!loadingStates && states.length === 0 && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: 'center' }}
          >
            No state found for center
          </Typography>
        </Box>
      )}
      {availableStates.length === 0 && selectedStates.length > 0 && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{ textAlign: 'center' }}
          >
            All states have been selected
          </Typography>
        </Box>
      )}

      {/* Hidden text input to force native validation */}
      <input
        value={hasSelectedVillages() ? getSelectedVillagesString() : ''}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        style={{
          height: 1,
          padding: 0,
          border: 0,
          ...(hasSelectedVillages() && { visibility: 'hidden' }),
        }}
        aria-hidden="true"
      />

      {/* Selected States Display */}
      {selectedStates.map((state) => (
        <Box
          key={state.stateId}
          sx={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            p: 2,
            mb: 2,
            backgroundColor: '#f9f9f9',
          }}
        >
          {/* State Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label="State"
                size="small"
                sx={{
                  backgroundColor: '#FFC107',
                  color: '#000000',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#000000', fontSize: '1rem' }}
              >
                {state.stateName}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={() => handleRemoveState(state.stateId)}
              disabled={disabled || readonly}
              sx={{ color: 'error.main' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {/* Districts for this State */}
          {state.districts.map((district) => (
            <Box
              key={district.districtId}
              sx={{
                borderLeft: '3px solid #e0e0e0',
                pl: 2,
                mb: 2,
                pt: 1,
                pb: 1,
                backgroundColor: 'white',
              }}
            >
              {/* District Header */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label="District"
                    size="small"
                    sx={{
                      backgroundColor: '#FFC107',
                      color: '#000000',
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      color: '#000000',
                      fontSize: '0.875rem',
                    }}
                  >
                    {district.districtName}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() =>
                    handleRemoveDistrict(state.stateId, district.districtId)
                  }
                  disabled={disabled || readonly}
                  sx={{ color: 'error.main' }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Blocks for this District */}
              {getSelectedBlocksForDistrict(
                state.stateId,
                district.districtId
              ).map((block) => (
                <Box
                  key={block.id}
                  sx={{
                    borderLeft: '3px solid #e0e0e0',
                    pl: 2,
                    mb: 2,
                    mt: 2,
                    pt: 1,
                    pb: 1,
                    backgroundColor: 'white',
                  }}
                >
                  {/* Block Header */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label="Block"
                        size="small"
                        sx={{
                          backgroundColor: '#FFC107',
                          color: '#000000',
                          fontWeight: 600,
                        }}
                      />
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: '#000000',
                          fontSize: '0.75rem',
                        }}
                      >
                        {block.name}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleRemoveBlock(
                          state.stateId,
                          district.districtId,
                          block.id
                        )
                      }
                      disabled={disabled || readonly}
                      sx={{ color: 'error.main' }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  {/* Villages as Chips */}
                  {getSelectedVillagesForBlock(
                    state.stateId,
                    district.districtId,
                    block.id
                  ).length > 0 && (
                    <Box
                      sx={{
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Chip
                        label="Village"
                        size="small"
                        sx={{
                          backgroundColor: '#FFC107',
                          color: '#000000',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}
                  >
                    {getSelectedVillagesForBlock(
                      state.stateId,
                      district.districtId,
                      block.id
                    ).map((village) => (
                      <Chip
                        key={village.id}
                        label={village.name}
                        onDelete={() =>
                          handleRemoveVillage(
                            state.stateId,
                            district.districtId,
                            block.id,
                            village.id
                          )
                        }
                        deleteIcon={<CloseIcon />}
                        sx={{
                          backgroundColor: '#FFC107',
                          color: '#000000',
                          fontSize: '0.6rem',
                          '& .MuiChip-label': {
                            fontSize: '0.75rem',
                          },
                        }}
                        disabled={disabled || readonly}
                      />
                    ))}
                  </Box>

                  {/* Available Villages Dropdown */}
                  {(() => {
                    const availableVillages = getAvailableVillages(
                      state.stateId,
                      district.districtId,
                      block.id
                    );
                    return availableVillages.length > 0 ? (
                      <FormControl fullWidth size="small">
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mb: 0.5,
                            color: '#666',
                            fontWeight: 600,
                          }}
                        >
                          Select a Village:
                        </Typography>
                        <Select
                          value=""
                          onChange={(e) =>
                            handleVillageSelect(
                              state.stateId,
                              district.districtId,
                              block.id,
                              e.target.value
                            )
                          }
                          displayEmpty
                          disabled={disabled || readonly}
                          size="small"
                          sx={{ backgroundColor: 'white' }}
                        >
                          <MenuItem value="">
                            <em>Select Village</em>
                          </MenuItem>
                          {availableVillages.map((village) => (
                            <MenuItem key={village.id} value={village.id}>
                              {village.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : null;
                  })()}
                </Box>
              ))}

              {/* Available Blocks Dropdown */}
              {(() => {
                const availableBlocks = getAvailableBlocks(
                  state.stateId,
                  district.districtId
                );
                return availableBlocks.length > 0 ? (
                  <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        mb: 0.5,
                        color: '#666',
                        fontWeight: 600,
                      }}
                    >
                      Select a Block:
                    </Typography>
                    <Select
                      value=""
                      onChange={(e) =>
                        handleBlockSelect(
                          state.stateId,
                          district.districtId,
                          e.target.value
                        )
                      }
                      displayEmpty
                      disabled={disabled || readonly}
                      size="small"
                      sx={{ backgroundColor: 'white' }}
                    >
                      <MenuItem value="">
                        <em>Select Block</em>
                      </MenuItem>
                      {availableBlocks.map((block) => (
                        <MenuItem key={block.id} value={block.id}>
                          {block.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : null;
              })()}
            </Box>
          ))}

          {/* District Selection Dropdown */}
          {(() => {
            const availableDistricts = getAvailableDistricts(state.stateId);
            const isLoading = loadingDistricts[state.stateId];

            if (isLoading) {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress size={20} />
                  <Typography variant="caption" sx={{ ml: 2, color: '#666' }}>
                    Loading districts...
                  </Typography>
                </Box>
              );
            }

            return availableDistricts.length > 0 ? (
              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mb: 1,
                    color: '#666',
                    fontWeight: 600,
                  }}
                >
                  Select a District:
                </Typography>
                <Select
                  value={districtSelectValues[state.stateId] || ''}
                  onChange={(e) => {
                    handleDistrictSelect(state.stateId, e.target.value);
                    setDistrictSelectValues({
                      ...districtSelectValues,
                      [state.stateId]: '',
                    });
                  }}
                  displayEmpty
                  disabled={disabled || readonly}
                  size="small"
                  sx={{ backgroundColor: 'white' }}
                >
                  <MenuItem value="">
                    <em>Select District</em>
                  </MenuItem>
                  {availableDistricts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : null;
          })()}
        </Box>
      ))}
    </Box>
  );
};

export default WorkingLocationWidget;
