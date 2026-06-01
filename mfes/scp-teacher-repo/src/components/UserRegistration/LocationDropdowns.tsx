
import React, { useState, useEffect, useRef } from 'react';
import { Box, Select, MenuItem, InputLabel, Checkbox, ListItemText, Grid, FormControl } from '@mui/material';
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
    // villages?: number[];
  }) => void;
}

type StoredLocationFilters = {
  state?: number | string;
  district?: number | string;
  blocks?: (number | string)[];
  // village?: number | string;
};

const LocationDropdowns: React.FC<LocationDropdownsProps> = ({ onLocationChange }) => {
  const LOCATION_STORAGE_KEY = 'selectedLocationFilters';

  const [states, setStates] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [blocks, setBlocks] = useState<LocationOption[]>([]);
  // const [villages, setVillages] = useState<LocationOption[]>([]);

  const [selectedState, setSelectedState] = useState<number | string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<number | string>('');
  const [selectedBlocks, setSelectedBlocks] = useState<(number | string)[]>([]);
  // const [selectedVillage, setSelectedVillage] = useState<number | string>('');

  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  // const [loadingVillages, setLoadingVillages] = useState(false);

  const [userLocationIds, setUserLocationIds] = useState<{
    stateId: number | null;
    districtId: number | null;
    blockId: number | null;
    // villageId: number | null;
  }>({
    stateId: null,
    districtId: null,
    blockId: null,
    // villageId: null,
  });

  const storedLocationRef = useRef<StoredLocationFilters>({});
  const defaultsAppliedRef = useRef({
    states: false,
    districts: false,
    blocks: false,
    // villages: false,
  });
  const [isStoredLocationLoaded, setIsStoredLocationLoaded] = useState(false);

  const parseCustomFieldSelection = (field: any): number | string | undefined => {
    if (!field?.selectedValues?.length) return undefined;
    const valueItem = field.selectedValues[0];
    if (valueItem?.id !== undefined && valueItem?.id !== null) {
      const parsedId = Number(valueItem.id);
      if (!Number.isNaN(parsedId)) return parsedId;
    }
    if (valueItem?.value !== undefined && valueItem?.value !== null) {
      return valueItem.value;
    }
    return undefined;
  };

  const parseStoredValue = (value: unknown): number | string | undefined => {
    const item = Array.isArray(value) ? value[0] : value;
    if (item === null || item === undefined) return undefined;
    const numeric = Number(item);
    return Number.isNaN(numeric) ? String(item) : numeric;
  };

  const parseStoredArray = (value: unknown): (number | string)[] => {
    if (!Array.isArray(value)) {
      const single = parseStoredValue(value);
      return single !== undefined ? [single] : [];
    }
    return value
      .map((item) => {
        if (item === null || item === undefined) return undefined;
        const numeric = Number(item);
        return Number.isNaN(numeric) ? String(item) : numeric;
      })
      .filter((v): v is number | string => v !== undefined);
  };

  const getMatchingOptionValue = (
    options: LocationOption[],
    storedValue?: number | string
  ): number | string | undefined => {
    if (storedValue === undefined) return undefined;
    const option = options.find(
      (opt) => opt.value === storedValue || opt.label === storedValue
    );
    return option?.value;
  };

  const getMatchingOptionValues = (
    options: LocationOption[],
    storedValues?: (number | string)[]
  ): (number | string)[] => {
    if (!storedValues || storedValues.length === 0) return [];
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
          state: parseStoredValue(parsed.states ?? parsed.state),
          district: parseStoredValue(parsed.districts ?? parsed.district),
          blocks: parseStoredArray(parsed.blocks),
          // village: parseStoredValue(parsed.villages ?? parsed.village),
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
        state: parseCustomFieldSelection(getFieldByLabel('STATE')),
        district: parseCustomFieldSelection(getFieldByLabel('DISTRICT')),
        blocks: (() => {
          const v = parseCustomFieldSelection(getFieldByLabel('BLOCK'));
          return v !== undefined ? [v] : [];
        })(),
        // village: parseCustomFieldSelection(getFieldByLabel('VILLAGE')),
      };
    } catch (error) {
      console.error('Error reading stored location filters:', error);
    } finally {
      setIsStoredLocationLoaded(true);
    }
  }, []);

  function getLocationIds(fields: any[]) {
    const getByLabel = (label: string) =>
      fields?.find((f: any) => f.label === label)?.selectedValues?.[0];

    return {
      stateId: getByLabel('STATE')?.id ?? null,
      districtId: getByLabel('DISTRICT')?.id ?? null,
      blockId: getByLabel('BLOCK')?.id ?? null,
      // villageId: getByLabel('VILLAGE')?.id ?? null,
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

  // Apply default state selection
  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.states || states.length === 0) {
      return;
    }

    const storedMatch = getMatchingOptionValue(states, storedLocationRef.current.state);
    let newSelection: number | string = '';

    if (storedMatch !== undefined) {
      newSelection = storedMatch;
    } else if (userLocationIds.stateId) {
      const matchedState = states.find((state) => state.value === userLocationIds.stateId);
      newSelection = matchedState ? matchedState.value : '';
    }

    if (newSelection === '' && states[0]) {
      newSelection = states[0].value;
    }

    setSelectedState(newSelection);
    defaultsAppliedRef.current.states = true;
  }, [isStoredLocationLoaded, states, userLocationIds.stateId]);

  // Fetch districts when state is selected
  useEffect(() => {
    if (selectedState !== '') {
      const fetchDistricts = async () => {
        setLoadingDistricts(true);
        setDistricts([]);
        setBlocks([]);
        // setVillages([]);
        setSelectedDistrict('');
        setSelectedBlocks([]);
        // setSelectedVillage('');
        defaultsAppliedRef.current.districts = false;
        defaultsAppliedRef.current.blocks = false;
        // defaultsAppliedRef.current.villages = false;
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
      // setVillages([]);
      setSelectedDistrict('');
      setSelectedBlocks([]);
      // setSelectedVillage('');
    }
  }, [selectedState]);

  // Apply default district selection
  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.districts || districts.length === 0) {
      return;
    }

    const storedMatch = getMatchingOptionValue(districts, storedLocationRef.current.district);
    let newSelection: number | string = '';

    if (storedMatch !== undefined) {
      newSelection = storedMatch;
    } else if (userLocationIds.districtId) {
      const matchedDistrict = districts.find((d) => d.value === userLocationIds.districtId);
      newSelection = matchedDistrict ? matchedDistrict.value : '';
    }

    if (newSelection === '' && districts[0]) {
      newSelection = districts[0].value;
    }

    setSelectedDistrict(newSelection);
    defaultsAppliedRef.current.districts = true;
  }, [districts, isStoredLocationLoaded, userLocationIds.districtId]);

  // Fetch blocks when district is selected
  useEffect(() => {
    if (selectedDistrict !== '') {
      const fetchBlocks = async () => {
        setLoadingBlocks(true);
        setBlocks([]);
        // setVillages([]);
        setSelectedBlocks([]);
        // setSelectedVillage('');
        defaultsAppliedRef.current.blocks = false;
        // defaultsAppliedRef.current.villages = false;
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
      // setVillages([]);
      setSelectedBlocks([]);
      // setSelectedVillage('');
    }
  }, [selectedDistrict]);

  // Apply default block selection
  useEffect(() => {
    if (!isStoredLocationLoaded || defaultsAppliedRef.current.blocks || blocks.length === 0) {
      return;
    }

    const storedMatches = getMatchingOptionValues(blocks, storedLocationRef.current.blocks);
    let newSelection: (number | string)[] = [];

    if (storedMatches.length > 0) {
      newSelection = storedMatches;
    } else if (userLocationIds.blockId) {
      const matchedBlock = blocks.find((b) => b.value === userLocationIds.blockId);
      newSelection = matchedBlock ? [matchedBlock.value] : [];
    }

    if (newSelection.length === 0 && blocks[0]) {
      newSelection = [blocks[0].value];
    }

    setSelectedBlocks(newSelection);
    defaultsAppliedRef.current.blocks = true;
  }, [blocks, isStoredLocationLoaded, userLocationIds.blockId]);

  // Commented out: village fetch effect
  // useEffect(() => {
  //   if (selectedBlocks.length > 0) {
  //     const fetchVillages = async () => { ... };
  //     fetchVillages();
  //   } else {
  //     setVillages([]);
  //     setSelectedVillage('');
  //   }
  // }, [selectedBlocks]);

  // Notify parent component when location changes
  useEffect(() => {
    if (onLocationChange) {
      onLocationChange({
        states: selectedState !== '' ? [selectedState as number] : undefined,
        districts: selectedDistrict !== '' ? [selectedDistrict as number] : undefined,
        blocks: selectedBlocks.length > 0 ? (selectedBlocks as number[]) : undefined,
        // villages: selectedVillage !== '' ? [selectedVillage as number] : undefined,
      });
    }
  }, [selectedState, selectedDistrict, selectedBlocks, onLocationChange]);

  // Persist current location selections so they survive modal close/page reloads
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload: StoredLocationFilters = {
      state: selectedState !== '' ? selectedState : undefined,
      district: selectedDistrict !== '' ? selectedDistrict : undefined,
      blocks: selectedBlocks.length > 0 ? selectedBlocks : undefined,
      // village: selectedVillage !== '' ? selectedVillage : undefined,
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
  }, [selectedState, selectedDistrict, selectedBlocks]);

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

        {/* Village Dropdown — commented out */}
        {/* <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="village-select-label" sx={{ fontSize: '12px', color: '#7C766F' }}>
              Village
            </InputLabel>
            <Select
              labelId="village-select-label"
              label="Village"
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value as number | string)}
              disabled={selectedBlocks.length === 0 || loadingVillages}
              sx={{ borderRadius: '8px', '& .MuiSelect-select': { py: 1.5 } }}
            >
              {villages.map((village) => (
                <MenuItem key={village.value} value={village.value}>
                  {village.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default LocationDropdowns;
