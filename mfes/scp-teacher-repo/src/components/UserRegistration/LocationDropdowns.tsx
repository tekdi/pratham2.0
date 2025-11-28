import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, InputLabel, Checkbox, ListItemText, Grid, FormControl } from '@mui/material';
import { getFieldOptions } from '../../services/MasterDataService';

interface LocationOption {
  value: number;
  label: string;
  [key: string]: any;
}

interface LocationDropdownsProps {
  onLocationChange?: (location: {
    states?: number[];
    districts?: number[];
    blocks?: number[];
    villages?: number[];
  }) => void;
}

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({ onLocationChange }) => {
  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [blocks, setBlocks] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedStates, setSelectedStates] = useState<number[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<number[]>([]);
  const [selectedVillages, setSelectedVillages] = useState<number[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const response = await getFieldOptions({
          fieldName: 'state',
          sort: ['state_name', 'asc'],
        });
        if (response?.result?.values) {
          const stateOptions = response.result.values.map((item: any) => ({
            value: item.value || item.state_id,
            label: item.label || item.state_name,
          }));
          setStates(stateOptions);
        }
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoadingStates(false);
      }
    };

    fetchStates();
  }, []);

  // Fetch districts when states are selected
  useEffect(() => {
    if (selectedStates.length > 0) {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        setDistricts([]);
        setBlocks([]);
        setVillages([]);
        setSelectedDistricts([]);
        setSelectedBlocks([]);
        setSelectedVillages([]);
        try {
          // Fetch districts for all selected states
          const allDistricts: LocationOption[] = [];
          for (const stateId of selectedStates) {
            const response = await getFieldOptions({
              fieldName: 'district',
              controllingfieldfk: [stateId],
              sort: ['district_name', 'asc'],
            });
            if (response?.result?.values) {
              const districtOptions = response.result.values.map((item: any) => ({
                value: item.value || item.district_id,
                label: item.label || item.district_name,
              }));
              // Avoid duplicates
              districtOptions.forEach((district: LocationOption) => {
                if (!allDistricts.find((d) => d.value === district.value)) {
                  allDistricts.push(district);
                }
              });
            }
          }
          setDistricts(allDistricts);
        } catch (error) {
          console.error('Error fetching districts:', error);
        } finally {
          setLoadingDistricts(false);
        }
      };

      fetchDistricts();
    } else {
      setDistricts([]);
      setBlocks([]);
      setVillages([]);
      setSelectedDistricts([]);
      setSelectedBlocks([]);
      setSelectedVillages([]);
    }
  }, [selectedStates]);

  // Fetch blocks when districts are selected
  useEffect(() => {
    if (selectedDistricts.length > 0) {
      const fetchBlocks = async () => {
        setLoadingBlocks(true);
        setBlocks([]);
        setVillages([]);
        setSelectedBlocks([]);
        setSelectedVillages([]);
        try {
          // Fetch blocks for all selected districts
          const allBlocks: LocationOption[] = [];
          for (const districtId of selectedDistricts) {
            const response = await getFieldOptions({
              fieldName: 'block',
              controllingfieldfk: [districtId],
              sort: ['block_name', 'asc'],
            });
            if (response?.result?.values) {
              const blockOptions = response.result.values.map((item: any) => ({
                value: item.value || item.block_id,
                label: item.label || item.block_name,
              }));
              // Avoid duplicates
              blockOptions.forEach((block: LocationOption) => {
                if (!allBlocks.find((b) => b.value === block.value)) {
                  allBlocks.push(block);
                }
              });
            }
          }
          setBlocks(allBlocks);
        } catch (error) {
          console.error('Error fetching blocks:', error);
        } finally {
          setLoadingBlocks(false);
        }
      };

      fetchBlocks();
    } else {
      setBlocks([]);
      setVillages([]);
      setSelectedBlocks([]);
      setSelectedVillages([]);
    }
  }, [selectedDistricts]);

  // Fetch villages when blocks are selected
  useEffect(() => {
    if (selectedBlocks.length > 0) {
      const fetchVillages = async () => {
        setLoadingVillages(true);
        setVillages([]);
        setSelectedVillages([]);
        try {
          // Fetch villages for all selected blocks
          const allVillages: LocationOption[] = [];
          for (const blockId of selectedBlocks) {
            const response = await getFieldOptions({
              fieldName: 'village',
              controllingfieldfk: [blockId],
              sort: ['village_name', 'asc'],
            });
            if (response?.result?.values) {
              const villageOptions = response.result.values.map((item: any) => ({
                value: item.value || item.village_id,
                label: item.label || item.village_name,
              }));
              // Avoid duplicates
              villageOptions.forEach((village: LocationOption) => {
                if (!allVillages.find((v) => v.value === village.value)) {
                  allVillages.push(village);
                }
              });
            }
          }
          setVillages(allVillages);
        } catch (error) {
          console.error('Error fetching villages:', error);
        } finally {
          setLoadingVillages(false);
        }
      };

      fetchVillages();
    } else {
      setVillages([]);
      setSelectedVillages([]);
    }
  }, [selectedBlocks]);

  // Notify parent component when location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        states: selectedStates.length > 0 ? selectedStates : undefined,
        districts: selectedDistricts.length > 0 ? selectedDistricts : undefined,
        blocks: selectedBlocks.length > 0 ? selectedBlocks : undefined,
        villages: selectedVillages.length > 0 ? selectedVillages : undefined,
      });
    }
  }, [selectedStates, selectedDistricts, selectedBlocks, selectedVillages, onLocationChange]);

  const renderValue = (selected: number[], options: LocationOption[]) => {
    if (selected.length === 0) {
      return 'Select';
    }
    if (selected.length === 1) {
      const option = options.find((opt) => opt.value === selected[0]);
      return option?.label || '';
    }
    return `${selected.length} selected`;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* State Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="state-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              State
            </InputLabel>
            <Select
              labelId="state-select-label"
              label="State"
              multiple
              value={selectedStates}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedStates(typeof value === 'string' ? [] : value as number[]);
              }}
              disabled={loadingStates}
              renderValue={(selected) => renderValue(selected as number[], states)}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
            {loadingStates ? (
              <MenuItem value="" disabled>
                Loading states...
              </MenuItem>
            ) : states.length === 0 ? (
              <MenuItem value="" disabled>
                No states available
              </MenuItem>
            ) : (
              states.map((state) => (
                <MenuItem key={state.value} value={state.value}>
                  <Checkbox checked={selectedStates.indexOf(state.value) > -1} />
                  <ListItemText primary={state.label} />
                </MenuItem>
              ))
            )}
            </Select>
          </FormControl>
        </Grid>

        {/* District Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="district-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              District
            </InputLabel>
            <Select
              labelId="district-select-label"
              label="District"
              multiple
              value={selectedDistricts}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedDistricts(typeof value === 'string' ? [] : value as number[]);
              }}
              disabled={selectedStates.length === 0 || loadingDistricts}
              renderValue={(selected) => renderValue(selected as number[], districts)}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
            {loadingDistricts ? (
              <MenuItem value="" disabled>
                Loading districts...
              </MenuItem>
            ) : selectedStates.length === 0 ? (
              <MenuItem value="" disabled>
                Select State first
              </MenuItem>
            ) : districts.length === 0 ? (
              <MenuItem value="" disabled>
                No districts available
              </MenuItem>
            ) : (
              districts.map((district) => (
                <MenuItem key={district.value} value={district.value}>
                  <Checkbox checked={selectedDistricts.indexOf(district.value) > -1} />
                  <ListItemText primary={district.label} />
                </MenuItem>
              ))
            )}
            </Select>
          </FormControl>
        </Grid>

        {/* Block Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="block-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              Block
            </InputLabel>
            <Select
              labelId="block-select-label"
              label="Block"
              multiple
              value={selectedBlocks}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedBlocks(typeof value === 'string' ? [] : value as number[]);
              }}
              disabled={selectedDistricts.length === 0 || loadingBlocks}
              renderValue={(selected) => renderValue(selected as number[], blocks)}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
            {loadingBlocks ? (
              <MenuItem value="" disabled>
                Loading blocks...
              </MenuItem>
            ) : selectedDistricts.length === 0 ? (
              <MenuItem value="" disabled>
                Select District first
              </MenuItem>
            ) : blocks.length === 0 ? (
              <MenuItem value="" disabled>
                No blocks available
              </MenuItem>
            ) : (
              blocks.map((block) => (
                <MenuItem key={block.value} value={block.value}>
                  <Checkbox checked={selectedBlocks.indexOf(block.value) > -1} />
                  <ListItemText primary={block.label} />
                </MenuItem>
              ))
            )}
            </Select>
          </FormControl>
        </Grid>

        {/* Village Dropdown */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="village-select-label"
              sx={{
                fontSize: '12px',
                color: '#7C766F',
              }}
            >
              Village
            </InputLabel>
            <Select
              labelId="village-select-label"
              label="Village"
              multiple
              value={selectedVillages}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedVillages(typeof value === 'string' ? [] : value as number[]);
              }}
              disabled={selectedBlocks.length === 0 || loadingVillages}
              renderValue={(selected) => renderValue(selected as number[], villages)}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': {
                  py: 1.5,
                },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': {
                      py: 0.5,
                    },
                  },
                },
              }}
            >
            {loadingVillages ? (
              <MenuItem value="" disabled>
                Loading villages...
              </MenuItem>
            ) : selectedBlocks.length === 0 ? (
              <MenuItem value="" disabled>
                Select Block first
              </MenuItem>
            ) : villages.length === 0 ? (
              <MenuItem value="" disabled>
                No villages available
              </MenuItem>
            ) : (
              villages.map((village) => (
                <MenuItem key={village.value} value={village.value}>
                  <Checkbox checked={selectedVillages.indexOf(village.value) > -1} />
                  <ListItemText primary={village.label} />
                </MenuItem>
              ))
            )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationDropdowns;
