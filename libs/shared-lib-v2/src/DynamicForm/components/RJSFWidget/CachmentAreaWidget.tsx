// @ts-nocheck
import React, { useState } from 'react';
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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

// Mock data for States, Districts, and Blocks
const mockData = {
  states: [
    { id: 1, name: 'Maharashtra' },
    { id: 2, name: 'Karnataka' },
    { id: 3, name: 'Tamil Nadu' },
    { id: 4, name: 'Gujarat' },
    { id: 5, name: 'Delhi' },
  ],
  districts: {
    1: [
      { id: 101, name: 'Mumbai', stateId: 1 },
      { id: 102, name: 'Pune', stateId: 1 },
      { id: 103, name: 'Nagpur', stateId: 1 },
      { id: 104, name: 'Aurangabad', stateId: 1 },
    ],
    2: [
      { id: 201, name: 'Bangalore', stateId: 2 },
      { id: 202, name: 'Mysore', stateId: 2 },
      { id: 203, name: 'Hubli', stateId: 2 },
    ],
    3: [
      { id: 301, name: 'Chennai', stateId: 3 },
      { id: 302, name: 'Coimbatore', stateId: 3 },
    ],
    4: [
      { id: 401, name: 'Ahmedabad', stateId: 4 },
      { id: 402, name: 'Surat', stateId: 4 },
    ],
    5: [
      { id: 501, name: 'Central Delhi', stateId: 5 },
      { id: 502, name: 'New Delhi', stateId: 5 },
    ],
  },
  blocks: {
    101: [
      { id: 1001, name: 'Andheri', districtId: 101 },
      { id: 1002, name: 'Bandra', districtId: 101 },
      { id: 1003, name: 'Kandivali', districtId: 101 },
    ],
    102: [
      { id: 2001, name: 'Hinjewadi', districtId: 102 },
      { id: 2002, name: 'Viman Nagar', districtId: 102 },
      { id: 2003, name: 'Hadapsar', districtId: 102 },
    ],
    103: [
      { id: 3001, name: 'Ramnagar', districtId: 103 },
      { id: 3002, name: 'Wadi', districtId: 103 },
    ],
    104: [
      { id: 4001, name: 'Jalna Road', districtId: 104 },
      { id: 4002, name: 'Badre', districtId: 104 },
    ],
    201: [
      { id: 5001, name: 'HSR Layout', districtId: 201 },
      { id: 5002, name: 'Whitefield', districtId: 201 },
      { id: 5003, name: 'MG Road', districtId: 201 },
    ],
    202: [
      { id: 6001, name: 'Chamarajapuram', districtId: 202 },
      { id: 6002, name: 'Vijayanagar', districtId: 202 },
    ],
    203: [
      { id: 7001, name: 'Keshav Nagar', districtId: 203 },
      { id: 7002, name: 'Durgadbail', districtId: 203 },
    ],
    301: [
      { id: 8001, name: 'T Nagar', districtId: 301 },
      { id: 8002, name: 'Adyar', districtId: 301 },
    ],
    302: [
      { id: 9001, name: 'RS Puram', districtId: 302 },
      { id: 9002, name: 'Kovaipudur', districtId: 302 },
    ],
    401: [
      { id: 11001, name: 'Navrangpura', districtId: 401 },
      { id: 11002, name: 'Vastrapur', districtId: 401 },
    ],
    402: [
      { id: 12001, name: 'Varachha', districtId: 402 },
      { id: 12002, name: 'Katargam', districtId: 402 },
    ],
    501: [
      { id: 13001, name: 'Connaught Place', districtId: 501 },
      { id: 13002, name: 'Karol Bagh', districtId: 501 },
    ],
    502: [
      { id: 14001, name: 'Dwarka', districtId: 502 },
      { id: 14002, name: 'Saket', districtId: 502 },
    ],
  },
};

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

const CachmentAreaWidget = ({
  id,
  label,
  value,
  required,
  disabled,
  readonly,
  onChange,
  rawErrors = [],
}: WidgetProps) => {
  const { t } = useTranslation();
  const [selectedStates, setSelectedStates] = useState<SelectedState[]>(
    value || []
  );
  const [stateSelectValue, setStateSelectValue] = useState('');
  const [districtSelectValues, setDistrictSelectValues] = useState<{
    [stateId: number]: number;
  }>({});

  // Get available states (not yet selected)
  const availableStates = mockData.states.filter(
    (state) => !selectedStates.some((selected) => selected.stateId === state.id)
  );

  const handleStateSelect = (event: any) => {
    const selectedStateId = event.target.value;
    if (selectedStateId) {
      const selectedState = mockData.states.find(
        (s) => s.id === selectedStateId
      );
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
      }
    }
  };

  const handleDistrictSelect = (stateId: number, districtId: number) => {
    if (districtId) {
      const district = mockData.districts[stateId]?.find(
        (d) => d.id === districtId
      );
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
    return mockData.districts[stateId]?.filter(
      (district) => !selectedDistrictIds.includes(district.id)
    );
  };

  const getAvailableBlocks = (stateId: number, districtId: number) => {
    const allBlocks = mockData.blocks[districtId] || [];
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
      {availableStates.length > 0 && (
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
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
            Select a state to start
          </Typography>
        </FormControl>
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
                  const block = mockData.blocks[district.districtId]?.find(
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
