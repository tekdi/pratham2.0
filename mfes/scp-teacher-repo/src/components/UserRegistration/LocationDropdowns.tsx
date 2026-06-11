
import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, InputLabel, Checkbox, ListItemText, Grid, FormControl } from '@mui/material';
import { getFieldOptions } from '../../services/MasterDataService';

interface LocationOption {
  value: number | string;
  label: string;
  [key: string]: any;
}

interface LocationDropdownsProps {
  onLocationChange?: (location: {
    states?: number[];
    districts?: number[];
    blocks?: number[];
  }) => void;
}

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({ onLocationChange }) => {
  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [blocks, setBlocks] = useState<LocationOption[]>([]);

  const [selectedState, setSelectedState] = useState<number | string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<number | string>('');
  const [selectedBlocks, setSelectedBlocks] = useState<(number | string)[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);

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

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState !== '') {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        setDistricts([]);
        setBlocks([]);
        setSelectedDistrict('');
        setSelectedBlocks([]);
        try {
          const response = await getFieldOptions({
            fieldName: 'district',
            controllingfieldfk: [selectedState],
            sort: ['district_name', 'asc'],
          });
          if (response?.result?.values) {
            const districtOptions = response.result.values.map((item: any) => ({
              value: item.value || item.district_id,
              label: item.label || item.district_name,
            }));
            setDistricts(districtOptions);
          }
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
      setSelectedDistrict('');
      setSelectedBlocks([]);
    }
  }, [selectedState]);

  // Fetch blocks when district is selected
  useEffect(() => {
    if (selectedDistrict !== '') {
      const fetchBlocks = async () => {
        setLoadingBlocks(true);
        setBlocks([]);
        setSelectedBlocks([]);
        try {
          const response = await getFieldOptions({
            fieldName: 'block',
            controllingfieldfk: [selectedDistrict],
            sort: ['block_name', 'asc'],
          });
          if (response?.result?.values) {
            const blockOptions = response.result.values.map((item: any) => ({
              value: item.value || item.block_id,
              label: item.label || item.block_name,
            }));
            setBlocks(blockOptions);
          }
        } catch (error) {
          console.error('Error fetching blocks:', error);
        } finally {
          setLoadingBlocks(false);
        }
      };

      fetchBlocks();
    } else {
      setBlocks([]);
      setSelectedBlocks([]);
    }
  }, [selectedDistrict]);

  // Notify parent component when location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        states: selectedState !== '' ? [selectedState as number] : undefined,
        districts: selectedDistrict !== '' ? [selectedDistrict as number] : undefined,
        blocks: selectedBlocks.length > 0 ? (selectedBlocks as number[]) : undefined,
      });
    }
  }, [selectedState, selectedDistrict, selectedBlocks, onLocationChange]);

  const renderBlockValue = (selected: (number | string)[]) => {
    if (selected.length === 0) return 'Select';
    if (selected.length === 1) {
      const option = blocks.find((opt) => opt.value === selected[0]);
      return option?.label || '';
    }
    return `${selected.length} selected`;
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* State Dropdown — single select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="state-select-label"
              sx={{ fontSize: '12px', color: '#7C766F' }}
            >
              State
            </InputLabel>
            <Select
              labelId="state-select-label"
              label="State"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as number | string)}
              disabled={loadingStates}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': { py: 1.5 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': { py: 0.5 },
                  },
                },
              }}
            >
              {loadingStates ? (
                <MenuItem value="" disabled>Loading states...</MenuItem>
              ) : states.length === 0 ? (
                <MenuItem value="" disabled>No states available</MenuItem>
              ) : (
                states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* District Dropdown — single select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="district-select-label"
              sx={{ fontSize: '12px', color: '#7C766F' }}
            >
              District
            </InputLabel>
            <Select
              labelId="district-select-label"
              label="District"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value as number | string)}
              disabled={selectedState === '' || loadingDistricts}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': { py: 1.5 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': { py: 0.5 },
                  },
                },
              }}
            >
              {loadingDistricts ? (
                <MenuItem value="" disabled>Loading districts...</MenuItem>
              ) : selectedState === '' ? (
                <MenuItem value="" disabled>Select State first</MenuItem>
              ) : districts.length === 0 ? (
                <MenuItem value="" disabled>No districts available</MenuItem>
              ) : (
                districts.map((district) => (
                  <MenuItem key={district.value} value={district.value}>
                    {district.label}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        </Grid>

        {/* Block Dropdown — multiple select */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel
              id="block-select-label"
              sx={{ fontSize: '12px', color: '#7C766F' }}
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
                setSelectedBlocks(typeof value === 'string' ? [] : value as (number | string)[]);
              }}
              disabled={selectedDistrict === '' || loadingBlocks}
              renderValue={(selected) => renderBlockValue(selected as (number | string)[])}
              sx={{
                borderRadius: '8px',
                '& .MuiSelect-select': { py: 1.5 },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    maxHeight: '300px',
                    '& .MuiMenuItem-root': { py: 0.5 },
                  },
                },
              }}
            >
              {loadingBlocks ? (
                <MenuItem value="" disabled>Loading blocks...</MenuItem>
              ) : selectedDistrict === '' ? (
                <MenuItem value="" disabled>Select District first</MenuItem>
              ) : blocks.length === 0 ? (
                <MenuItem value="" disabled>No blocks available</MenuItem>
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
      </Grid>
    </Box>
  );
};

export default LocationDropdowns;
