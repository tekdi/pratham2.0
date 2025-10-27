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

interface SelectedDistrict {
  districtId: number;
  districtName: string;
  blocks: number[];
}

interface SelectedState {
  stateId: number;
  stateName: string;
  districts: SelectedDistrict[];
}

// API configuration constants (moved outside component to prevent recreation on each render)
const STATE_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
  method: 'POST',
  payload: { fieldName: 'state', sort: ['state_name', 'asc'] },
  options: {
    optionObj: 'result.values',
    label: 'label',
    value: 'value',
  },
};

const DISTRICT_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
  method: 'POST',
  payload: {
    fieldName: 'district',
    controllingfieldfk: '**',
    sort: ['district_name', 'asc'],
  },
  options: {
    optionObj: 'result.values',
    label: 'label',
    value: 'value',
  },
};

const BLOCK_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
  method: 'POST',
  payload: {
    fieldName: 'block',
    controllingfieldfk: '**',
    sort: ['block_name', 'asc'],
  },
  options: {
    optionObj: 'result.values',
    label: 'label',
    value: 'value',
  },
};

const CachmentAreaWidget = ({
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
  const [selectedStates, setSelectedStates] = useState<SelectedState[]>(
    value || []
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
          STATE_API_CONFIG.payload || {},
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
        DISTRICT_API_CONFIG.payload || {},
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
        BLOCK_API_CONFIG.payload || {},
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

  const handleBlockSelect = (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            const updatedBlocks = district.blocks.includes(blockId)
              ? district.blocks
              : [...district.blocks, blockId];
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
              blocks: district.blocks.filter((id) => id !== blockId),
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
    const selectedBlockIds = getSelectedBlocksForDistrict(stateId, districtId);
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
                  backgroundColor: '#1976d2',
                  color: 'white',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1.15rem' }}
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
                borderLeft: '3px solid #4caf50',
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
                      backgroundColor: '#4caf50',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 600, fontSize: '1.15rem' }}
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

              {/* Blocks as Chips */}
              {getSelectedBlocksForDistrict(state.stateId, district.districtId)
                .length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label="Selected Blocks"
                    size="small"
                    sx={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      fontWeight: 600,
                      mb: 1,
                    }}
                  />
                </Box>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                {getSelectedBlocksForDistrict(
                  state.stateId,
                  district.districtId
                ).map((blockId) => {
                  const block = blocks[district.districtId]?.find(
                    (b) => b.id === blockId
                  );
                  return block ? (
                    <Chip
                      key={blockId}
                      label={block.name}
                      onDelete={() =>
                        handleRemoveBlock(
                          state.stateId,
                          district.districtId,
                          blockId
                        )
                      }
                      deleteIcon={<CloseIcon />}
                      sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      disabled={disabled || readonly}
                    />
                  ) : null;
                })}
              </Box>

              {/* Available Blocks Dropdown */}
              {(() => {
                const availableBlocks = getAvailableBlocks(
                  state.stateId,
                  district.districtId
                );
                return availableBlocks.length > 0 ? (
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

export default CachmentAreaWidget;
