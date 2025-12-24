import React, { useState, useEffect, useRef } from 'react';
import { Box, Select, MenuItem, InputLabel, Checkbox, ListItemText, Grid, FormControl } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { getFieldOptions } from '../../services/MasterDataService';
import { getCohortData } from '../../services/CohortServices';

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
  const { t } = useTranslation();
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

  // Add state to store location IDs from user data
  const [userLocationIds, setUserLocationIds] = useState<{
    stateId: number | null;
    districtId: number | null;
    blockId: number | null;
    villageId: number | null;
  }>({
    stateId: null,
    districtId: null,
    blockId: null,
    villageId: null,
  });

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
  function getLocationIds(fields: any[]) {
    const getByLabel = (label: string) =>
      fields.find((f: any) => f.label === label)?.selectedValues?.[0];
  
    return {
      stateId: getByLabel("STATE")?.id ?? null,
      districtId: getByLabel("DISTRICT")?.id ?? null,
      blockId: getByLabel("BLOCK")?.id ?? null,
      villageId: getByLabel("VILLAGE")?.id ?? null,
    };
  }
  
  // Fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      const data = await getCohortData(localStorage.getItem('userId') || '');
      const userData = data?.result || {};
      console.log('userData=====>', userData[0]?.customField);
      const locationIds = getLocationIds(userData[0]?.customField);
      console.log('locationIds=====>', locationIds);
      
      // Store the location IDs for default selection
      setUserLocationIds(locationIds);
     
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
    let newSelection: (number | string)[] = [];

    if (storedMatches.length > 0) {
      // Use stored matches from localStorage
      newSelection = storedMatches;
    } else if (userLocationIds.stateId) {
      // Try to match with user's location ID
      const matchedState = states.find(state => state.value === userLocationIds.stateId);
      newSelection = matchedState ? [matchedState.value] : [];
    }
    
    // Fallback to first option if no match found
    if (newSelection.length === 0 && states[0]) {
      newSelection = [states[0].value];
    }

    setSelectedStates(newSelection);
    defaultsAppliedRef.current.states = true;
  }, [isStoredLocationLoaded, states, userLocationIds.stateId]);

  // Fetch districts when states are selected
  useEffect(() => {
    if (selectedStates.length > 0) {
      const fetchDistricts = async () => {
        // Clear dependent dropdowns and selections FIRST
        setSelectedDistricts([]);
        setSelectedBlocks([]);
        setSelectedVillages([]);
        setBlocks([]);
        setVillages([]);
        
        setLoadingDistricts(true);
        defaultsAppliedRef.current.districts = false;
        defaultsAppliedRef.current.blocks = false;
        defaultsAppliedRef.current.villages = false;
        
        try {
          const response = await getFieldOptions({
            fieldName: 'district',
            controllingfieldfk: selectedStates,
            sort: ['district_name', 'asc'],
          });
          if (response?.result?.values && response.result.values.length > 0) {
            const districtOptions = response.result.values.map((item: any) => ({
              value: item.value || item.district_id,
              label: item.label || item.district_name,
            }));
            setDistricts(districtOptions);
          } else {
            setDistricts([]);
          }
        } catch (error) {
          console.error('Error fetching districts:', error);
          setDistricts([]);
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
      setLoadingDistricts(false);
    }
  }, [selectedStates]);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.districts || districts.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(districts, storedLocationRef.current.districts);
    let newSelection: (number | string)[] = [];

    if (storedMatches.length > 0) {
      // Use stored matches from localStorage
      newSelection = storedMatches;
    } else if (userLocationIds.districtId) {
      // Try to match with user's location ID
      const matchedDistrict = districts.find(district => district.value === userLocationIds.districtId);
      newSelection = matchedDistrict ? [matchedDistrict.value] : [];
    }
    
    // Fallback to first option if no match found
    if (newSelection.length === 0 && districts[0]) {
      newSelection = [districts[0].value];
    }

    setSelectedDistricts(newSelection);
    defaultsAppliedRef.current.districts = true;
  }, [districts, isStoredLocationLoaded, userLocationIds.districtId]);

  // Fetch blocks when districts are selected
  useEffect(() => {
    if (selectedDistricts.length > 0) {
      const fetchBlocks = async () => {
        // Clear dependent dropdowns and selections FIRST
        setSelectedBlocks([]);
        setSelectedVillages([]);
        setVillages([]);
        
        setLoadingBlocks(true);
        defaultsAppliedRef.current.blocks = false;
        defaultsAppliedRef.current.villages = false;
        
        try {
          const response = await getFieldOptions({
            fieldName: 'block',
            controllingfieldfk: selectedDistricts,
            sort: ['block_name', 'asc'],
          });
          if (response?.result?.values && response.result.values.length > 0) {
            const blockOptions = response.result.values.map((item: any) => ({
              value: item.value || item.block_id,
              label: item.label || item.block_name,
            }));
            setBlocks(blockOptions);
          } else {
            setBlocks([]);
          }
        } catch (error) {
          console.error('Error fetching blocks:', error);
          setBlocks([]);
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
      setLoadingBlocks(false);
    }
  }, [selectedDistricts]);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.blocks || blocks.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(blocks, storedLocationRef.current.blocks);
    let newSelection: (number | string)[] = [];

    if (storedMatches.length > 0) {
      // Use stored matches from localStorage
      newSelection = storedMatches;
    } else if (userLocationIds.blockId) {
      // Try to match with user's location ID
      const matchedBlock = blocks.find(block => block.value === userLocationIds.blockId);
      newSelection = matchedBlock ? [matchedBlock.value] : [];
    }
    
    // Fallback to first option if no match found
    if (newSelection.length === 0 && blocks[0]) {
      newSelection = [blocks[0].value];
    }

    setSelectedBlocks(newSelection);
    defaultsAppliedRef.current.blocks = true;
  }, [blocks, isStoredLocationLoaded, userLocationIds.blockId]);

  // Fetch villages when blocks are selected
  useEffect(() => {
    if (selectedBlocks.length > 0) {
      const fetchVillages = async () => {
        // Clear dependent selections FIRST
        setSelectedVillages([]);
        
        setLoadingVillages(true);
        defaultsAppliedRef.current.villages = false;
        
        try {
          const response = await getFieldOptions({
            fieldName: 'village',
            controllingfieldfk: selectedBlocks,
            sort: ['village_name', 'asc'],
          });
          if (response?.result?.values && response.result.values.length > 0) {
            const villageOptions = response.result.values.map((item: any) => ({
              value: item.value || item.village_id,
              label: item.label || item.village_name,
            }));
            setVillages(villageOptions);
          } else {
            setVillages([]);
          }
        } catch (error) {
          console.error('Error fetching villages:', error);
          setVillages([]);
        } finally {
          setLoadingVillages(false);
        }
      };

      fetchVillages();
    } else {
      setVillages([]);
      setSelectedVillages([]);
      setLoadingVillages(false);
    }
  }, [selectedBlocks]);

  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.villages || villages.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(villages, storedLocationRef.current.villages);
    let newSelection: (number | string)[] = [];

    if (storedMatches.length > 0) {
      // Use stored matches from localStorage
      newSelection = storedMatches;
    } else if (userLocationIds.villageId) {
      // Try to match with user's location ID
      const matchedVillage = villages.find(village => village.value === userLocationIds.villageId);
      newSelection = matchedVillage ? [matchedVillage.value] : [];
    }
    
    // Fallback to first option if no match found
    if (newSelection.length === 0 && villages[0]) {
      newSelection = [villages[0].value];
    }

    setSelectedVillages(newSelection);
    defaultsAppliedRef.current.villages = true;
  }, [villages, isStoredLocationLoaded, userLocationIds.villageId]);

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
    if (selected.length === options.length && options.length > 0) {
      return t('COMMON.ALL');
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
                const value = e.target.value as (number | string)[];
                if (value.includes('all')) {
                  if (selectedStates.length === states.length) {
                    setSelectedStates([]);
                  } else {
                    setSelectedStates(states.map((state) => state.value));
                  }
                } else {
                  setSelectedStates(value);
                }
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
              [
                <MenuItem key="all" value="all">
                  <Checkbox checked={selectedStates.length === states.length && states.length > 0} />
                  <ListItemText primary={t('COMMON.SELECT_ALL')} />
                </MenuItem>,
                ...states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    <Checkbox checked={selectedStates.indexOf(state.value) > -1} />
                    <ListItemText primary={state.label} />
                  </MenuItem>
                ))
              ]
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
                const value = e.target.value as (number | string)[];
                if (value.includes('all')) {
                  if (selectedDistricts.length === districts.length) {
                    setSelectedDistricts([]);
                  } else {
                    setSelectedDistricts(districts.map((district) => district.value));
                  }
                } else {
                  setSelectedDistricts(value);
                }
              }}
              disabled={selectedStates.length === 0}
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
              [
                <MenuItem key="all" value="all">
                  <Checkbox checked={selectedDistricts.length === districts.length && districts.length > 0} />
                  <ListItemText primary={t('COMMON.SELECT_ALL')} />
                </MenuItem>,
                ...districts.map((district) => (
                  <MenuItem key={district.value} value={district.value}>
                    <Checkbox checked={selectedDistricts.indexOf(district.value) > -1} />
                    <ListItemText primary={district.label} />
                  </MenuItem>
                ))
              ]
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
                const value = e.target.value as (number | string)[];
                if (value.includes('all')) {
                  if (selectedBlocks.length === blocks.length) {
                    setSelectedBlocks([]);
                  } else {
                    setSelectedBlocks(blocks.map((block) => block.value));
                  }
                } else {
                  setSelectedBlocks(value);
                }
              }}
              disabled={selectedDistricts.length === 0}
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
              [
                <MenuItem key="all" value="all">
                  <Checkbox checked={selectedBlocks.length === blocks.length && blocks.length > 0} />
                  <ListItemText primary={t('COMMON.SELECT_ALL')} />
                </MenuItem>,
                ...blocks.map((block) => (
                  <MenuItem key={block.value} value={block.value}>
                    <Checkbox checked={selectedBlocks.indexOf(block.value) > -1} />
                    <ListItemText primary={block.label} />
                  </MenuItem>
                ))
              ]
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
                const value = e.target.value as (number | string)[];
                if (value.includes('all')) {
                  if (selectedVillages.length === villages.length) {
                    setSelectedVillages([]);
                  } else {
                    setSelectedVillages(villages.map((village) => village.value));
                  }
                } else {
                  setSelectedVillages(value);
                }
              }}
              disabled={selectedBlocks.length === 0}
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
              [
                <MenuItem key="all" value="all">
                  <Checkbox checked={selectedVillages.length === villages.length && villages.length > 0} />
                  <ListItemText primary={t('COMMON.SELECT_ALL')} />
                </MenuItem>,
                ...villages.map((village) => (
                  <MenuItem key={village.value} value={village.value}>
                    <Checkbox checked={selectedVillages.indexOf(village.value) > -1} />
                    <ListItemText primary={village.label} />
                  </MenuItem>
                ))
              ]
            )}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationDropdowns;
