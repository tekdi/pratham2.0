import React, { useState, useEffect, useRef } from 'react';
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
    villages?: number[];
  }) => void;
}

type StoredLocationFilters = {
  states?: (number | string)[];
  districts?: (number | string)[];
  blocks?: (number | string)[];
  villages?: (number | string)[];
};

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({ onLocationChange }) => {
  const LOCATION_STORAGE_KEY = 'selectedLocationFilters';

  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [blocks, setBlocks] = useState<LocationOption[]>([]);
  const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedStates, setSelectedStates] = useState<(number | string)[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<(number | string)[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<(number | string)[]>([]);
  const [selectedVillages, setSelectedVillages] = useState<(number | string)[]>([]);

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);

  const storedLocationRef = useRef<StoredLocationFilters>({});
  const defaultsAppliedRef = useRef({
    states: false,
    districts: false,
    blocks: false,
    villages: false,
  });
  const [isStoredLocationLoaded, setIsStoredLocationLoaded] = useState(false);

  const parseCustomFieldSelections = (field: any): (number | string)[] | undefined => {
    if (!field?.selectedValues?.length) return undefined;
    const selections = field.selectedValues
      .map((valueItem: any) => {
        if (valueItem?.id !== undefined && valueItem?.id !== null) {
          const parsedId = Number(valueItem.id);
          if (!Number.isNaN(parsedId)) {
            return parsedId;
          }
        }
        if (valueItem?.value !== undefined && valueItem?.value !== null) {
          return valueItem.value;
        }
        return undefined;
      })
      .filter((val: number | string | undefined): val is number | string => val !== undefined);

    return selections.length > 0 ? selections : undefined;
  };

  const parseStoredFilters = (value: unknown): (number | string)[] | undefined => {
    if (!Array.isArray(value)) return undefined;
    const parsedValues = value
      .map((item) => {
        if (item === null || item === undefined) return undefined;
        const numeric = Number(item);
        return Number.isNaN(numeric) ? String(item) : numeric;
      })
      .filter((val): val is number | string => val !== undefined);
    return parsedValues.length > 0 ? parsedValues : undefined;
  };

  const getMatchingOptionValues = (
    options: LocationOption[],
    storedValues?: (number | string)[]
  ): (number | string)[] => {
    if (!storedValues || storedValues.length === 0) {
      return [];
    }
    const matched: (number | string)[] = [];
    storedValues.forEach((storedValue) => {
      const option = options.find(
        (opt) => opt.value === storedValue || opt.label === storedValue
      );
      if (option && !matched.includes(option.value)) {
        matched.push(option.value);
      }
    });
    return matched;
  };

  // Parse stored location filters from localStorage once on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const savedFiltersRaw = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (savedFiltersRaw) {
        const parsed = JSON.parse(savedFiltersRaw);
        storedLocationRef.current = {
          states: parseStoredFilters(parsed.states),
          districts: parseStoredFilters(parsed.districts),
          blocks: parseStoredFilters(parsed.blocks),
          villages: parseStoredFilters(parsed.villages),
        };
        setIsStoredLocationLoaded(true);
        return;
      }

      const storedValue = localStorage.getItem('userdata');
      if (!storedValue) {
        setIsStoredLocationLoaded(true);
        return;
      }

      const parsedUserData = JSON.parse(storedValue);
      const customFields = parsedUserData?.customFields;
      if (!customFields) {
        setIsStoredLocationLoaded(true);
        return;
      }

      const getFieldByLabel = (label: string) =>
        customFields.find((field: any) => field.label === label);

      storedLocationRef.current = {
        states: parseCustomFieldSelections(getFieldByLabel('STATE')),
        districts: parseCustomFieldSelections(getFieldByLabel('DISTRICT')),
        blocks: parseCustomFieldSelections(getFieldByLabel('BLOCK')),
        villages: parseCustomFieldSelections(getFieldByLabel('VILLAGE')),
      };
    } catch (error) {
      console.error('Error reading stored location filters:', error);
    } finally {
      setIsStoredLocationLoaded(true);
    }
  }, []);

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

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.states || states.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(states, storedLocationRef.current.states);
    const newSelection =
      storedMatches.length > 0 ? storedMatches : (states[0] ? [states[0].value] : []);

    setSelectedStates(newSelection);
    defaultsAppliedRef.current.states = true;
  }, [isStoredLocationLoaded, states]);

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
        defaultsAppliedRef.current.districts = false;
        defaultsAppliedRef.current.blocks = false;
        defaultsAppliedRef.current.villages = false;
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

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.districts || districts.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(districts, storedLocationRef.current.districts);
    // If we have stored matches, use them.
    // Otherwise, if this is a "fresh" load (user changed state manually), default to first district.
    const newSelection =
      storedMatches.length > 0 ? storedMatches : (districts[0] ? [districts[0].value] : []);

    setSelectedDistricts(newSelection);
    defaultsAppliedRef.current.districts = true;
  }, [districts, isStoredLocationLoaded]);

  // Fetch blocks when districts are selected
  useEffect(() => {
    if (selectedDistricts.length > 0) {
      const fetchBlocks = async () => {
        setLoadingBlocks(true);
        setBlocks([]);
        setVillages([]);
        setSelectedBlocks([]);
        setSelectedVillages([]);
        defaultsAppliedRef.current.blocks = false;
        defaultsAppliedRef.current.villages = false;
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

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.blocks || blocks.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(blocks, storedLocationRef.current.blocks);
    const newSelection =
      storedMatches.length > 0 ? storedMatches : (blocks[0] ? [blocks[0].value] : []);

    setSelectedBlocks(newSelection);
    defaultsAppliedRef.current.blocks = true;
  }, [blocks, isStoredLocationLoaded]);

  // Fetch villages when blocks are selected
  useEffect(() => {
    if (selectedBlocks.length > 0) {
      const fetchVillages = async () => {
        setLoadingVillages(true);
        setVillages([]);
        setSelectedVillages([]);
        defaultsAppliedRef.current.villages = false;
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

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.villages || villages.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(villages, storedLocationRef.current.villages);
    const newSelection =
      storedMatches.length > 0 ? storedMatches : (villages[0] ? [villages[0].value] : []);

    setSelectedVillages(newSelection);
    defaultsAppliedRef.current.villages = true;
  }, [villages, isStoredLocationLoaded]);

  // Notify parent component when location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        states: selectedStates.length > 0 ? (selectedStates as number[]) : undefined,
        districts: selectedDistricts.length > 0 ? (selectedDistricts as number[]) : undefined,
        blocks: selectedBlocks.length > 0 ? (selectedBlocks as number[]) : undefined,
        villages: selectedVillages.length > 0 ? (selectedVillages as number[]) : undefined,
      });
    }
  }, [selectedStates, selectedDistricts, selectedBlocks, selectedVillages, onLocationChange]);

  // Persist current location selections so they survive modal close/page reloads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: StoredLocationFilters = {
      states: selectedStates,
      districts: selectedDistricts,
      blocks: selectedBlocks,
      villages: selectedVillages,
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
  }, [selectedStates, selectedDistricts, selectedBlocks, selectedVillages]);

  const renderValue = (selected: (number | string)[], options: LocationOption[]) => {
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
                setSelectedStates(typeof value === 'string' ? [] : value as (number | string)[]);
              }}
              disabled={loadingStates}
              renderValue={(selected) => renderValue(selected as (number | string)[], states)}
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
                setSelectedDistricts(typeof value === 'string' ? [] : value as (number | string)[]);
              }}
              disabled={selectedStates.length === 0 || loadingDistricts}
              renderValue={(selected) => renderValue(selected as (number | string)[], districts)}
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
                setSelectedBlocks(typeof value === 'string' ? [] : value as (number | string)[]);
              }}
              disabled={selectedDistricts.length === 0 || loadingBlocks}
              renderValue={(selected) => renderValue(selected as (number | string)[], blocks)}
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
                setSelectedVillages(typeof value === 'string' ? [] : value as (number | string)[]);
              }}
              disabled={selectedBlocks.length === 0 || loadingVillages}
              renderValue={(selected) => renderValue(selected as (number | string)[], villages)}
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
