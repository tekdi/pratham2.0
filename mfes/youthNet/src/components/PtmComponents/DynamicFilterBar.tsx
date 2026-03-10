//@ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Grid,
  Checkbox,
  ListItemText,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getStateBlockDistrictList, getCohortList } from '../../services/youthNet/Dashboard/VillageServices';
import { useTranslation } from 'next-i18next';

interface FilterOption {
  id: string | number;
  value: string;
  label: string;
}

interface FilterBarProps {
  onFiltersChange?: (filters: FilterState, filterLabels: FilterLabels) => void;
  resetFilters?: boolean;
  onResetComplete?: () => void;
  showOrganizationFilter?: boolean; // Optional prop to show/hide organization filter
}

interface FilterLabels {
  state: string[];
  district: string[];
  block: string[];
  // village: string[];
  // status: string[];
  organization: string[];
  // poc: string[];
}

interface FilterState {
  state: string[];
  district: string[];
  block: string[];
  // village: string[];
  // status: string[];
  organization: string[];
  // poc: string[];
}

interface LocationData {
  states: FilterOption[];
  districts: FilterOption[];
  blocks: FilterOption[];
  villages: FilterOption[];
  organizations: FilterOption[];
}

interface CustomField {
  label: string;
  selectedValues: Array<{ id?: number; value: string }>;
}

const DynamicFilterBar: React.FC<FilterBarProps> = ({ 
  onFiltersChange, 
  resetFilters, 
  onResetComplete,
  showOrganizationFilter = false // Default to false
}) => {
  const { t } = useTranslation('common');
  
  // Function to get user state from localStorage
  const getUserStateFromStorage = () => {
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        const stateField = parsedData.customFields?.find((field: CustomField) => field.label === 'STATE');
        if (stateField && stateField.selectedValues && stateField.selectedValues.length > 0) {
          const stateValue = stateField.selectedValues[0];
          // value should be the ID for matching, label should be the display text
          const stateId = stateValue.id?.toString() || stateValue.value;
          return {
            id: stateId,
            value: stateId, // Use ID as value for matching in dropdown
            label: stateValue.value // Use the actual state name as label
          };
        }
      }
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
    }
    return null;
  };

  const userState = getUserStateFromStorage();
  const [filters, setFilters] = useState<FilterState>({
    state: userState ? [userState.value] : [],
    district: [],
    block: [],
    // village: [],
    // status: [],
    organization: [],
    // poc: [],
  });

  const [filterLabels, setFilterLabels] = useState<FilterLabels>({
    state: userState ? [userState.label] : [],
    district: [],
    block: [],
    // village: [],
    // status: [],
    organization: [],
    // poc: [],
  });

  const [locationData, setLocationData] = useState<LocationData>({
    states: userState ? [userState] : [],
    districts: [],
    blocks: [],
    villages: [],
    organizations: [],
  });

  const [loading, setLoading] = useState({
    states: false,
    districts: false,
    blocks: false,
    villages: false,
    organizations: false,
  });

  const statusOptions = [
    { id: 'approve', value: 'approve', label: 'Approve' },
    { id: 'reject', value: 'reject', label: 'Reject' },
    { id: 'pending', value: 'pending', label: 'Pending' },
  ];

  // Load initial states
  useEffect(() => {
    loadStates();
    loadOrganizations(); // Load all organizations initially
    
    // Auto-load districts if user has a state from localStorage
    if (userState && userState.value) {
      loadDistricts([userState.value]);
    }
  }, []);

  // Trigger callback when filters change
  useEffect(() => {
    onFiltersChange?.(filters, filterLabels);
  }, [filters, filterLabels, onFiltersChange]);

  // Handle external reset
  useEffect(() => {
    if (resetFilters) {
      setFilters({
        state: userState ? [userState.value] : [], // Preserve user's state from localStorage
        district: [],
        block: [],
        // village: [],
        // status: [],
        organization: [],
        // poc: [],
      });
      setFilterLabels({
        state: userState ? [userState.label] : [], // Preserve user's state label from localStorage
        district: [],
        block: [],
        // village: [],
        // status: [],
        organization: [],
        // poc: [],
      });
      setLocationData({
        states: locationData.states, // Keep states loaded
        districts: [],
        blocks: [],
        villages: [],
        organizations: [],
      });
      // Reload districts if user has a state from localStorage
      if (userState && userState.value) {
        loadDistricts([userState.value]);
      }
      // Load all organizations again
      loadOrganizations();
      onResetComplete?.();
    }
  }, [resetFilters, onResetComplete, locationData.states, userState]);

  const loadStates = async () => {
    setLoading(prev => ({ ...prev, states: true }));
    try {
      const response = await getStateBlockDistrictList({
        fieldName: 'state',
        sort: ['state_name', 'asc'],
      });

      if (response?.result?.values) {
        const stateOptions = response.result.values.map((item: any) => ({
          id: item.value,
          value: item.value,
          label: item.label,
        }));
        
        // Ensure userState is included in the states list if it exists
        let finalStateOptions = stateOptions;
        if (userState) {
          const userStateExists = stateOptions.some(opt => opt.value === userState.value);
          if (!userStateExists) {
            finalStateOptions = [userState, ...stateOptions];
          }
        }
        
        setLocationData(prev => ({ ...prev, states: finalStateOptions }));
      }
    } catch (error) {
      console.error('Error loading states:', error);
    } finally {
      setLoading(prev => ({ ...prev, states: false }));
    }
  };

  const loadDistricts = async (stateIds: string[]) => {
    if (stateIds.length === 0) return;
    
    setLoading(prev => ({ ...prev, districts: true }));
    try {
      const response = await getStateBlockDistrictList({
        fieldName: 'district',
        controllingfieldfk: stateIds, // Pass all selected state IDs
        sort: ['district_name', 'asc'],
      });

      if (response?.result?.values) {
        const districtOptions = response.result.values.map((item: any) => ({
          id: item.value,
          value: item.value,
          label: item.label,
        }));
        setLocationData(prev => ({ ...prev, districts: districtOptions }));
      }
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(prev => ({ ...prev, districts: false }));
    }
  };

  const loadBlocks = async (districtIds: string[]) => {
    if (districtIds.length === 0) return;
    
    setLoading(prev => ({ ...prev, blocks: true }));
    try {
      const response = await getStateBlockDistrictList({
        fieldName: 'block',
        controllingfieldfk: districtIds, // Pass all selected district IDs
        sort: ['block_name', 'asc'],
      });

      if (response?.result?.values) {
        const blockOptions = response.result.values.map((item: any) => ({
          id: item.value,
          value: item.value,
          label: item.label,
        }));
        setLocationData(prev => ({ ...prev, blocks: blockOptions }));
      }
    } catch (error) {
      console.error('Error loading blocks:', error);
    } finally {
      setLoading(prev => ({ ...prev, blocks: false }));
    }
  };

  const loadVillages = async (blockIds: string[]) => {
    if (blockIds.length === 0) return;
    
    setLoading(prev => ({ ...prev, villages: true }));
    try {
      const response = await getStateBlockDistrictList({
        fieldName: 'village',
        controllingfieldfk: blockIds, // Pass all selected block IDs
        sort: ['village_name', 'asc'],
      });

      if (response?.result?.values) {
        const villageOptions = response.result.values.map((item: any) => ({
          id: item.value,
          value: item.value,
          label: item.label,
        }));
        setLocationData(prev => ({ ...prev, villages: villageOptions }));
      }
    } catch (error) {
      console.error('Error loading villages:', error);
    } finally {
      setLoading(prev => ({ ...prev, villages: false }));
    }
  };

  const loadOrganizations = async (locationFilters?: { [key: string]: string[] }) => {
    setLoading(prev => ({ ...prev, organizations: true }));
    try {
      const requestData: any = {
        limit: 200,
        offset: 0,
        filters: {
          type: 'COHORT',
          status: ['active'],
        },
      };

      // Add location filters if provided
      if (locationFilters) {
        Object.keys(locationFilters).forEach(key => {
          if (locationFilters[key].length > 0) {
            requestData.filters[key] = locationFilters[key];
          }
        });
      }

      const response = await getCohortList(requestData);

      if (response?.results?.cohortDetails) {
        // Helper function to capitalize first letter
        const capitalizeFirstLetter = (str: string): string => {
          if (!str) return str;
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        };
        
        const organizationOptions = response.results.cohortDetails.map((item: any) => ({
          id: item.cohortId,
          value: item.cohortId,
          label: capitalizeFirstLetter(item.name || ''),
        }));
        setLocationData(prev => ({ ...prev, organizations: organizationOptions }));
      }
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(prev => ({ ...prev, organizations: false }));
    }
  };

  const handleFilterChange = (filterName: keyof FilterState, value: string[]) => {
    const newFilters = { ...filters, [filterName]: value };
    
    // Update filter labels
    const newFilterLabels = { ...filterLabels };
    
    // Get labels for selected values
    if (filterName === 'state') {
      newFilterLabels.state = value.map(val => {
        const option = locationData.states.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    } else if (filterName === 'district') {
      newFilterLabels.district = value.map(val => {
        const option = locationData.districts.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    } else if (filterName === 'block') {
      newFilterLabels.block = value.map(val => {
        const option = locationData.blocks.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    } else if (filterName === 'village') {
      newFilterLabels.village = value.map(val => {
        const option = locationData.villages.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    } else if (filterName === 'status') {
      newFilterLabels.status = value.map(val => {
        const option = statusOptions.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    } else if (filterName === 'organization') {
      newFilterLabels.organization = value.map(val => {
        const option = locationData.organizations.find(opt => opt.value === val);
        return option ? option.label : val;
      });
    }
    
    setFilterLabels(newFilterLabels);

    // Handle hierarchical dependencies
    if (filterName === 'state') {
      newFilters.district = [];
      newFilters.block = [];
      newFilters.village = [];
      newFilterLabels.district = [];
      newFilterLabels.block = [];
      newFilterLabels.village = [];
      setLocationData(prev => ({
        ...prev,
        districts: [],
        blocks: [],
        villages: [],
      }));

      if (value.length > 0) {
        // Load districts for all selected states in one API call
        // controllingfieldfk expects array of parent IDs
        loadDistricts(value);
      }
    } else if (filterName === 'district') {
      newFilters.block = [];
      newFilters.village = [];
      newFilterLabels.block = [];
      newFilterLabels.village = [];
      setLocationData(prev => ({
        ...prev,
        blocks: [],
        villages: [],
      }));

      if (value.length > 0) {
        // Load blocks for all selected districts in one API call
        loadBlocks(value);
      }
    } else if (filterName === 'block') {
      newFilters.village = [];
      newFilterLabels.village = [];
      setLocationData(prev => ({
        ...prev,
        villages: [],
      }));

      if (value.length > 0) {
        // Load villages for all selected blocks in one API call
        loadVillages(value);
      }
    }

    setFilters(newFilters);

    // Update organizations based on location filters
    const locationFilters: { [key: string]: string[] } = {};
    if (newFilters.state.length > 0) locationFilters.state = newFilters.state;
    if (newFilters.district.length > 0) locationFilters.district = newFilters.district;
    if (newFilters.block.length > 0) locationFilters.block = newFilters.block;
    if (newFilters.village.length > 0) locationFilters.village = newFilters.village;

    if (Object.keys(locationFilters).length > 0 || filterName === 'state' || filterName === 'district' || filterName === 'block' || filterName === 'village') {
      loadOrganizations(Object.keys(locationFilters).length > 0 ? locationFilters : undefined);
    }
  };

  const renderDropdown = (
    name: keyof FilterState,
    label: string,
    options: FilterOption[],
        disabled = false,
        isLoading = false
  ) => (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel size="small">{label}</InputLabel>
      <Select
        size="small"
        multiple
        value={filters[name]}
        label={label}
        onChange={(e) => handleFilterChange(name, typeof e.target.value === 'string' ? [e.target.value] : e.target.value)}
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(selected) => {
          if (selected.length === 0) {
            const selectKey = name === 'state' ? 'SELECT_STATE' : 
                             name === 'district' ? 'SELECT_DISTRICT' : 
                             name === 'block' ? 'SELECT_BLOCK' : 
                             'SELECT_ORGANISATION';
            return <em style={{ color: '#999', fontStyle: 'italic' }}>{t(`DYNAMIC_FILTER_BAR.${selectKey}`)}</em>;
          }
          const selectedLabels = selected.map(val => {
            const option = options.find(opt => opt.value === val);
            return option ? option.label : val;
          });
          
          if (selectedLabels.length === 1) {
            return selectedLabels[0];
          } else if (selectedLabels.length <= 2) {
            return selectedLabels.join(', ');
          } else {
            return `${selectedLabels.slice(0, 2).join(', ')} (+${selectedLabels.length - 2} more)`;
          }
        }}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 250,
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {isLoading ? (
          <MenuItem disabled>Loading...</MenuItem>
        ) : (
          options.map((option) => (
            <MenuItem key={option.id} value={option.value} sx={{ pl: 1 }}>
              <Checkbox 
                checked={filters[name].indexOf(option.value) > -1}
                size="small"
                sx={{ 
                  py: 0.5,
                  color: '#999',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              />
              <ListItemText 
                primary={option.label} 
                sx={{ 
                  ml: 1,
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                  }
                }} 
              />
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );

  // Calculate grid size based on whether organization filter is shown
  // If organization filter is shown: 4 filters, each md={3} (12/4 = 3)
  // If organization filter is hidden: 3 filters, each md={4} (12/3 = 4)
  const gridSize = showOrganizationFilter ? 3 : 4;

  return (
    <Grid 
      container 
      spacing={2} 
      alignItems="center"
      sx={{
        p: 2,
        backgroundColor: '#fafafa',
        borderRadius: 1,
        border: '1px solid #e0e0e0',
      }}
    >
        <Grid item xs={12} sm={6} md={gridSize}>
          {renderDropdown('state', t('DYNAMIC_FILTER_BAR.STATE'), locationData.states, !!userState, loading.states)}
        </Grid>
        
        <Grid item xs={12} sm={6} md={gridSize}>
          {renderDropdown(
            'district',
            t('DYNAMIC_FILTER_BAR.DISTRICT'),
            locationData.districts,
            filters.state.length === 0,
            loading.districts
          )}
        </Grid>
        
        <Grid item xs={12} sm={6} md={gridSize}>
          {renderDropdown(
            'block',
            t('DYNAMIC_FILTER_BAR.BLOCK'),
            locationData.blocks,
            filters.district.length === 0,
            loading.blocks
          )}
        </Grid>
        
        {/* <Grid item xs={12} sm={6} md={1.5}>
          {renderDropdown(
            'village',
            'Village',
            locationData.villages,
            filters.block.length === 0,
            loading.villages
          )}
        </Grid> */}
        
        {/* <Grid item xs={12} sm={6} md={1.5}>
          {renderDropdown('status', 'Status', statusOptions)}
        </Grid> */}
        
        {showOrganizationFilter && (
          <Grid item xs={12} sm={6} md={gridSize}>
            {renderDropdown(
              'organization',
              t('DYNAMIC_FILTER_BAR.ORGANISATION_NAME'),
              locationData.organizations,
              false,
              loading.organizations
            )}
          </Grid>
        )}
        
        {/* <Grid item xs={12} sm={6} md={1.5}>
          {renderDropdown('poc', 'POC Name', [], true)}
        </Grid> */}
      </Grid>
  );
};

export { FilterState, FilterLabels };
export default DynamicFilterBar;