// @ts-nocheck
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Checkbox,
  Card,
  CardContent,
  Skeleton,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import axios from 'axios';
import { Role } from '../utils/app.constant';
import { extractWorkingVillageIds } from '../utils/helper';

// Helper function to filter villages by search keyword
const filterVillagesBySearch = (
  villages: Array<{ id: string; name: string; blockId: string; unavailable: boolean; assigned: boolean }>,
  searchKeyword: string
): Array<{ id: string; name: string; blockId: string; unavailable: boolean; assigned: boolean }> => {
  if (!searchKeyword.trim()) return villages;
  const searchLower = searchKeyword.toLowerCase().trim();
  return villages.filter((village) => village.name.toLowerCase().includes(searchLower));
};

// Helper function to get selected count in block
const getSelectedCountInBlock = (
  blockId: string,
  villagesByBlock: Record<string, Array<{ id: string; name: string; blockId: string; unavailable: boolean; assigned: boolean }>>,
  selectedVillages: Set<string>
): number => {
  const blockVillages = villagesByBlock[blockId] || [];
  return blockVillages.filter((v) => selectedVillages.has(v.id)).length;
};

interface WorkingVillageAssignmentWidgetProps { 
  userId?: string;
  onCenterChange?: (centerId: string) => void;
  onAssignmentComplete?: (centerId: string, workingLocation: any) => void;
  onSelectionChange?: (centerId: string, selectedVillages: Set<string>, villagesByBlock: Record<string, Array<{ id: string; name: string; blockId: string; unavailable: boolean; assigned: boolean }>>) => void;
  hideConfirmButton?: boolean; // Hide the Confirm Assignment button
  onCenterOptionsChange?: (centerOptions: any[]) => void; // Callback to get center options
  // Reassign props
  centerId?: string; // Center ID to pre-select in reassign flow
  existingWorkingVillageIds?: string; // Comma-separated string of existing village IDs (e.g., "648579, 648570")
  isForReassign?: boolean; // Flag to indicate reassign mode
  // LMP props: no state/district/block dropdowns, load centers directly from centerIds
  isForLmp?: boolean;
  centerIds?: string[]; // Array of center IDs (e.g. from cohortData); when isForLmp, load these centers directly
}

const WorkingVillageAssignmentWidget: React.FC<WorkingVillageAssignmentWidgetProps> = ({
  userId,
  onCenterChange,
  onAssignmentComplete,
  onSelectionChange,
  hideConfirmButton = false,
  onCenterOptionsChange,
  centerId: propCenterId,
  existingWorkingVillageIds,
  isForReassign = false,
  isForLmp = false,
  centerIds: propCenterIds,
}) => {
  // Theme color
  const themeColor = '#FDBE16';
  const themeColorLight = 'rgba(253, 190, 22, 0.1)'; // 10% opacity
  const themeColorLighter = 'rgba(253, 190, 22, 0.05)'; // 5% opacity

  // Local state management for geography filters and center selection
  const [selectedState, setSelectedState] = useState<string>('');      // Selected state ID
  const [selectedDistrict, setSelectedDistrict] = useState<string>(''); // Selected district ID
  const [selectedBlock, setSelectedBlock] = useState<string>('');     // Selected block ID
  const [selectedCenter, setSelectedCenter] = useState<string>('');   // Selected center ID
  const [villageIdToSelect, setVillageIdToSelect] = useState<any>(existingWorkingVillageIds); // Village ID to select
  // Sync villageIdToSelect when existingWorkingVillageIds prop changes (e.g. reassign modal opens after parent state updates)
  React.useEffect(() => {
    if (existingWorkingVillageIds !== undefined && existingWorkingVillageIds !== villageIdToSelect) {
      setVillageIdToSelect(existingWorkingVillageIds);
    }
  }, [existingWorkingVillageIds]);

  // Options state for dropdowns
  const [stateOptions, setStateOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [districtOptions, setDistrictOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [blockOptions, setBlockOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [centerOptions, setCenterOptions] = useState<Array<{
    id: string;
    name: string;
    stateId: string | number | null;
    districtId: string | number | null;
    blockId: string | number | null;
    villages?: number;
    blocks?: number;
    customFields?: any[]; // Store customFields to extract CATCHMENT_AREA
  }>>([]);

  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    state: false,
    district: false,
    block: false,
    centers: false,
    villages: false,
  });

  // Villages by block ID - stores real village data from API
  const [villagesByBlock, setVillagesByBlock] = useState<Record<string, Array<{
    id: string;
    name: string;
    blockId: string;
    unavailable: boolean;
    assigned: boolean; // New field to mark assigned villages
  }>>>({});

  // Pagination state: tracks how many villages to display per block (initially 50)
  const [villagesDisplayLimit, setVillagesDisplayLimit] = useState<Record<string, number>>({});

  // Village search keyword
  const [villageSearchKeyword, setVillageSearchKeyword] = useState<string>('');

  // Selected villages state - stores array of village IDs
  const [selectedVillages, setSelectedVillages] = useState<Set<string>>(new Set());

  // Catchment blocks extracted from selected center's CATCHMENT_AREA
  const [catchmentBlocks, setCatchmentBlocks] = useState<Array<{
    id: string | number;
    name: string;
    districtId: string | number;
    districtName: string;
    stateId: string | number;
    stateName: string;
  }>>([]);

  // Store center's CATCHMENT_AREA fetched via API in reassign mode
  const [reassignCenterCatchmentArea, setReassignCenterCatchmentArea] = useState<any>(null);

  // Load villages for all catchment blocks
  const loadVillagesForBlocks = useCallback(async () => {
    if (!selectedCenter || catchmentBlocks.length === 0) {
      setVillagesByBlock({});
      setVillagesDisplayLimit({});
      return;
    }

    setLoadingStates((prev) => ({ ...prev, villages: true }));
    
    try {
      const villagesData: Record<string, Array<{
        id: string;
        name: string;
        blockId: string;
        unavailable: boolean;
        assigned: boolean;
      }>> = {};

      const displayLimits: Record<string, number> = {};

      // Load villages for each block in parallel
      const villagePromises = catchmentBlocks.map(async (block) => {
        const blockId = String(block.id);
        
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
            {
              fieldName: 'village',
              controllingfieldfk: [blockId],
              sort: ['village_name', 'asc'],
            }
          );

          const villages = response?.data?.result?.values?.map((item: any) => ({
            id: String(item.value),
            name: item.label || '',
            blockId: blockId,
            unavailable: false,
            assigned: false, // Will be updated after checking userList
          })) || [];

          villagesData[blockId] = villages;
          // Initialize display limit to 50 per block
          displayLimits[blockId] = 50;
        } catch (error) {
          console.error(`Error loading villages for block ${blockId}:`, error);
          villagesData[blockId] = [];
          displayLimits[blockId] = 50;
        }
      });

      await Promise.all(villagePromises);

      // Collect all village IDs across all blocks
      const allVillageIds: number[] = [];
      Object.values(villagesData).forEach((villages) => {
        villages.forEach((village) => {
          allVillageIds.push(Number(village.id));
        });
      });

      // Check for assigned villages if we have any villages
      if (allVillageIds.length > 0) {
        try {
          const tenantId = localStorage.getItem('tenantId') || '';
          const token = localStorage.getItem('token') || '';
          const academicYearId = localStorage.getItem('academicYearId') || '';

          const payload = {
            sort: ['createdAt', 'asc'],
            filters: {
              role: Role.MOBILIZER,
              working_village: allVillageIds,
            },
          };
          // console.log("payload>>>>",payload);

          const userListResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/user/list`,
            payload,
            {
              headers: {
                'Content-Type': 'application/json',
                tenantId: tenantId,
                Authorization: `Bearer ${token}`,
                academicyearid: academicYearId,
              },
            }
          );

          // Extract assigned village IDs
          const assignedVillageIds = new Set<number>();
          if (userListResponse?.data?.result?.getUserDetails) {
            const filteredResponse = userListResponse.data.result.getUserDetails;
            // console.log("filteredResponse>>>>", filteredResponse);
            
            // Filter out the current user's data to avoid marking their own villages as assigned
            const filteredResponseExcludingCurrentUser = userId
              ? filteredResponse.filter((user: any) => user.userId !== userId)
              : filteredResponse;
            
            // console.log("filteredResponseExcludingCurrentUser>>>>", filteredResponseExcludingCurrentUser);
            
            const extractedIds = extractWorkingVillageIds(filteredResponseExcludingCurrentUser);
            extractedIds.forEach((id) => assignedVillageIds.add(id));
          }

          // Mark assigned villages
          Object.keys(villagesData).forEach((blockId) => {
            villagesData[blockId] = villagesData[blockId].map((village) => ({
              ...village,
              assigned: assignedVillageIds.has(Number(village.id)),
              // Unavailable if assigned (cannot be selected)
              unavailable: assignedVillageIds.has(Number(village.id)),
            }));
          });
        } catch (error) {
          console.error('Error checking assigned villages:', error);
          // Continue without marking assigned villages if API fails
        }
      }

      setVillagesByBlock(villagesData);
      setVillagesDisplayLimit(displayLimits);

      // In reassign mode, pre-select existing villages only when showing the initial center (propCenterId).
      // When user changes to a different center, do NOT preselect so selection resets immediately.
      if (
        isForReassign &&
        Object.keys(villagesData).length > 0 &&
        selectedCenter === propCenterId &&
        selectedVillages.size === 0
      ) {
        const existingVillageIdSet = new Set<string>();

        if (villageIdToSelect) {
          const idsFromString = villageIdToSelect
            .split(',')
            .map((id) => String(id).trim())
            .filter((id) => id.length > 0);
          idsFromString.forEach((id) => existingVillageIdSet.add(id));
        }

        const villagesToSelect = new Set<string>();
        Object.values(villagesData).forEach((villages) => {
          villages.forEach((village) => {
            const vid = String(village.id);
            if (existingVillageIdSet.has(vid)) {
              villagesToSelect.add(village.id);
            }
          });
        });
        if (villagesToSelect.size > 0) {
          setSelectedVillages(villagesToSelect);
        }
      }
    } catch (error) {
      console.error('Error loading villages:', error);
      setVillagesByBlock({});
      setVillagesDisplayLimit({});
    } finally {
      setLoadingStates((prev) => ({ ...prev, villages: false }));
    }
  }, [selectedCenter, catchmentBlocks, isForReassign, villageIdToSelect, selectedVillages, propCenterId]);

  // Load villages when catchment blocks are available
  useEffect(() => {
    loadVillagesForBlocks();
  }, [loadVillagesForBlocks]);

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange && selectedCenter) {
      onSelectionChange(selectedCenter, selectedVillages, villagesByBlock);
    }
  }, [selectedCenter, selectedVillages, villagesByBlock, onSelectionChange]);

  // Notify parent of center options changes
  useEffect(() => {
    if (onCenterOptionsChange) {
      onCenterOptionsChange(centerOptions);
    }
  }, [centerOptions, onCenterOptionsChange]);

  // Transform catchment blocks to match UI structure
  // Uses blocks extracted from selected center's CATCHMENT_AREA
  const catchmentBlocksForDisplay = useMemo(() => {
    if (!selectedCenter || catchmentBlocks.length === 0) return [];
    
    return catchmentBlocks.map((block) => {
      const blockIdStr = String(block.id);
      const villages = villagesByBlock[blockIdStr] || [];
      
      return {
        id: String(block.id),
        name: block.name,
        villageCount: villages.length || 0,
        unavailableCount: villages.filter((v) => v.unavailable || v.assigned).length || 0,
        assignedCount: villages.filter((v) => v.assigned).length || 0,
        location: `${block.districtName} • ${block.stateName}`,
        districtId: block.districtId,
        districtName: block.districtName,
        stateId: block.stateId,
        stateName: block.stateName,
      };
    });
  }, [selectedCenter, catchmentBlocks, villagesByBlock]);

  // Memoized filtered blocks based on search keyword
  // Filters blocks if block name matches OR if any village in the block matches
  // This ensures performance for large lists by using memoization
  const filteredBlocksForDisplay = useMemo(() => {
    if (!villageSearchKeyword.trim()) {
      return catchmentBlocksForDisplay;
    }

    const searchLower = villageSearchKeyword.toLowerCase().trim();

    return catchmentBlocksForDisplay.filter((block) => {
      // Check if block name matches
      const blockNameMatches = block.name.toLowerCase().includes(searchLower);
      const locationMatches = block.location.toLowerCase().includes(searchLower);

      // Check if any village in this block matches
      const blockVillages = villagesByBlock[block.id] || [];
      const hasMatchingVillage = blockVillages.some((village) =>
        village.name.toLowerCase().includes(searchLower)
      );

      // Show block if block name/location matches OR if any village matches
      return blockNameMatches || locationMatches || hasMatchingVillage;
    });
  }, [catchmentBlocksForDisplay, villagesByBlock, villageSearchKeyword]);

  // Calculate totals for header badges
  const totalVillages = useMemo(() => {
    return catchmentBlocksForDisplay.reduce((sum, block) => sum + block.villageCount, 0);
  }, [catchmentBlocksForDisplay]);

  const totalBlocks = useMemo(() => {
    return catchmentBlocksForDisplay.length;
  }, [catchmentBlocksForDisplay]);

  // Maximum villages that can be selected
  const MAX_VILLAGES = 50;

  // Calculate selected villages count
  const selectedVillagesCount = useMemo(() => {
    return selectedVillages.size;
  }, [selectedVillages]);

  // Calculate selected block count (blocks that have at least one selected village)
  const selectedBlockCount = useMemo(() => {
    if (selectedVillages.size === 0) return 0;
    
    const blocksWithSelections = new Set<string>();
    Object.entries(villagesByBlock).forEach(([blockId, villages]) => {
      const hasSelected = villages.some((v) => selectedVillages.has(v.id));
      if (hasSelected) {
        blocksWithSelections.add(blockId);
      }
    });
    
    return blocksWithSelections.size;
  }, [selectedVillages, villagesByBlock]);

  // Get selected village IDs as array
  const selectedVillageIds = useMemo(() => {
    return Array.from(selectedVillages);
  }, [selectedVillages]);

  // State for showing max limit message
  const [maxLimitMessage, setMaxLimitMessage] = useState<string>('');

  // Handler for village selection with max limit check
  const handleVillageToggle = (villageId: string, unavailable: boolean) => {
    // Don't allow selection of unavailable villages
    if (unavailable) {
      return;
    }
    
    setSelectedVillages((prev) => {
      const newSet = new Set(prev);
      
      // If village is already selected, deselect it
      if (newSet.has(villageId)) {
        newSet.delete(villageId);
        setMaxLimitMessage(''); // Clear message when deselecting
        return newSet;
      }
      
      // Check if we've reached the max limit
      if (newSet.size >= MAX_VILLAGES) {
        setMaxLimitMessage(`Maximum ${MAX_VILLAGES} villages can be selected. Please deselect some villages first.`);
        // Clear message after 3 seconds
        setTimeout(() => setMaxLimitMessage(''), 3000);
        return prev; // Don't add the village
      }
      
      // Add the village
      newSet.add(villageId);
      setMaxLimitMessage(''); // Clear any previous message
      return newSet;
    });
  };

  // Handler for clear selected villages
  const handleClearSelectedVillages = () => {
    setSelectedVillages(new Set());
    setMaxLimitMessage('');
  };

  // Handler for loading more villages in a block
  const handleLoadMoreVillages = (blockId: string) => {
    setVillagesDisplayLimit((prev) => ({
      ...prev,
      [blockId]: (prev[blockId] || 50) + 50,
    }));
  };

  // Get user role and state from localStorage
  const stateId =
    typeof window !== 'undefined' ? localStorage.getItem('stateId') : null;
  const userRole =
    typeof window !== 'undefined' ? localStorage.getItem('roleName') : null;
  const isCentralAdmin =
    userRole === 'Central Lead' || userRole === 'Central Admin';

  // Load state options on mount (skip when isForLmp - no state dropdown)
  useEffect(() => {
    if (isForLmp) return;
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

        setStateOptions(states);

        // Set default state from localStorage if available and user is not central admin
        if (!isCentralAdmin && stateId && states.some((s) => String(s.value) === String(stateId))) {
          setSelectedState(String(stateId));
        }
      } catch (error) {
        console.error('Error loading states:', error);
        if (!isMounted) return;
        setStateOptions([]);
      } finally {
        if (isMounted) {
          setLoadingStates((prev) => ({ ...prev, state: false }));
        }
      }
    };

    loadStateOptions();

    return () => {
      isMounted = false;
    };
  }, [isForLmp]); // Only run on mount; skip when isForLmp

  // Note: In reassign mode, state/district/block dropdowns follow normal flow
  // They are NOT initialized from CATCHMENT_AREA - user selects them normally
  // Only the center dropdown is pre-filled with propCenterId

  // Load district options when state changes
  useEffect(() => {
    const loadDistrictOptions = async () => {
      // For non-central admin, always use stateId from localStorage
      // For central admin, use selectedState
      const controllingField =
        !isCentralAdmin && stateId
          ? [stateId]
          : selectedState
          ? [selectedState]
          : [];

      if (controllingField.length === 0) {
        setDistrictOptions([]);
        setSelectedDistrict('');
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
            value: String(item.value),
            label: item.label,
          })) || [];
        setDistrictOptions(districts);
      } catch (error) {
        console.error('Error loading districts:', error);
        setDistrictOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, district: false }));
      }
    };
    loadDistrictOptions();
  }, [selectedState, stateId, isCentralAdmin]);

  // Load block options when district changes
  useEffect(() => {
    const loadBlockOptions = async () => {
      if (!selectedDistrict) {
        setBlockOptions([]);
        setSelectedBlock('');
        return;
      }

      setLoadingStates((prev) => ({ ...prev, block: true }));
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
          {
            fieldName: 'block',
            controllingfieldfk: [selectedDistrict],
            sort: ['block_name', 'asc'],
          }
        );
        const blocks =
          response?.data?.result?.values?.map((item) => ({
            value: String(item.value),
            label: item.label,
          })) || [];
        setBlockOptions(blocks);
      } catch (error) {
        console.error('Error loading blocks:', error);
        setBlockOptions([]);
      } finally {
        setLoadingStates((prev) => ({ ...prev, block: false }));
      }
    };
    loadBlockOptions();
  }, [selectedDistrict]);

  // Load centers when state/district/block changes
  const loadCenters = useCallback(async () => {
    setLoadingStates((prev) => ({ ...prev, centers: true }));
    try {
      const tenantId = localStorage.getItem('tenantId') || '';
      const token = localStorage.getItem('token') || '';
      const academicYearId = localStorage.getItem('academicYearId') || '';

      // LMP mode: load centers directly from centerIds (no state/district/block)
      const centerIdsToLoad = Array.isArray(propCenterIds) ? propCenterIds : (propCenterIds ? [propCenterIds] : []);
      if (isForLmp && centerIdsToLoad.length > 0) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
          {
            limit: 200,
            offset: 0,
            filters: {
              type: 'COHORT',
              status: ['active'],
              cohortId: centerIdsToLoad,
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              tenantId: tenantId,
              Authorization: `Bearer ${token}`,
              academicyearid: academicYearId,
            },
          }
        );
        const centers =
          response?.data?.result?.results?.cohortDetails
            ?.map((item: any) => {
              if (!item || !item.cohortId) return null;
              const customFields = item.customFields || [];
              const stateField = customFields.find((field: any) => field.label === 'STATE');
              const districtField = customFields.find((field: any) => field.label === 'DISTRICT');
              const blockField = customFields.find((field: any) => field.label === 'BLOCK');
              const villageField = customFields.find((field: any) => field.label === 'VILLAGE');
              return {
                id: String(item.cohortId),
                name: item.name?.trim() || `Center ${item.cohortId}`,
                stateId: stateField?.selectedValues?.[0]?.id || null,
                districtId: districtField?.selectedValues?.[0]?.id || null,
                blockId: blockField?.selectedValues?.[0]?.id || null,
                villageId: villageField?.selectedValues?.[0]?.id || null,
                villages: 0,
                blocks: 0,
                customFields: item.customFields || [],
              };
            })
            .filter((item: any) => item !== null) || [];
        setCenterOptions(centers);
        // Reassign flow: preselect mobilizer's current center when propCenterId is provided
        if (propCenterId && centers.some((c) => c.id === propCenterId)) {
          setSelectedCenter(propCenterId);
        } else if (centers.length === 1 && !selectedCenter) {
          setSelectedCenter(centers[0].id);
        }
        return;
      }

      // In reassign mode with propCenterId, load that specific center directly ONLY on initial load
      // (when no state/district/block is selected - user hasn't changed geography yet)
      // Once user changes state/district/block, follow normal flow
      if (isForReassign && propCenterId && !selectedState && !selectedDistrict && !selectedBlock) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
          {
            limit: 200,
            offset: 0,
            filters: {
              type: 'COHORT',
              status: ['active'],
              cohortId: [propCenterId],
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              tenantId: tenantId,
              Authorization: `Bearer ${token}`,
              academicyearid: academicYearId,
            },
          }
        );

        const centers =
          response?.data?.result?.results?.cohortDetails
            ?.map((item: any) => {
              if (!item || !item.cohortId) return null;

              // Extract location data from customFields
              const customFields = item.customFields || [];
              const stateField = customFields.find(
                (field: any) => field.label === 'STATE'
              );
              const districtField = customFields.find(
                (field: any) => field.label === 'DISTRICT'
              );
              const blockField = customFields.find(
                (field: any) => field.label === 'BLOCK'
              );
              const villageField = customFields.find(
                (field: any) => field.label === 'VILLAGE'
              );

              const stateIdValue = stateField?.selectedValues?.[0]?.id || null;
              const districtIdValue =
                districtField?.selectedValues?.[0]?.id || null;
              const blockIdValue = blockField?.selectedValues?.[0]?.id || null;
              const villageIdValue =
                villageField?.selectedValues?.[0]?.id || null;

              // Count villages and blocks (placeholder - would need actual API call for accurate counts)
              const villages = 0; // TODO: Get actual village count from API
              const blocks = 0; // TODO: Get actual block count from API

              return {
                id: String(item.cohortId),
                name: item.name?.trim() || `Center ${item.cohortId}`,
                stateId: stateIdValue,
                districtId: districtIdValue,
                blockId: blockIdValue,
                villageId: villageIdValue,
                villages,
                blocks,
                customFields: item.customFields || [], // Store customFields for CATCHMENT_AREA extraction
              };
            })
            .filter((item: any) => item !== null) || [];

        setCenterOptions(centers);

        // Pre-select center if propCenterId is provided
        if (propCenterId && centers.length > 0) {
          const centerExists = centers.some((c) => c.id === propCenterId);
          if (centerExists && !selectedCenter) {
            setSelectedCenter(propCenterId);
          }
        }
        return;
      }

      // Normal flow: Load centers based on state/district/block filters
      // No state selected: return empty array
      if (!selectedState) {
        setCenterOptions([]);
        return;
      }

      const filters: any = {
        type: 'COHORT',
        status: ['active'],
      };

      // Add filters based on what's selected
      if (selectedState) {
        filters.state = [selectedState];
      }

      if (selectedDistrict) {
        filters.district = [selectedDistrict];
      }

      if (selectedBlock) {
        filters.block = [selectedBlock];
      }

      const payload = {
        limit: 200,
        offset: 0,
        filters,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            tenantId: tenantId,
            Authorization: `Bearer ${token}`,
            academicyearid: academicYearId,
          },
        }
      );

      const centers =
        response?.data?.result?.results?.cohortDetails
          ?.map((item: any) => {
            if (!item || !item.cohortId) return null;

            // Extract location data from customFields
            const customFields = item.customFields || [];
            const stateField = customFields.find(
              (field: any) => field.label === 'STATE'
            );
            const districtField = customFields.find(
              (field: any) => field.label === 'DISTRICT'
            );
            const blockField = customFields.find(
              (field: any) => field.label === 'BLOCK'
            );
            const villageField = customFields.find(
              (field: any) => field.label === 'VILLAGE'
            );

            const stateIdValue = stateField?.selectedValues?.[0]?.id || null;
            const districtIdValue =
              districtField?.selectedValues?.[0]?.id || null;
            const blockIdValue = blockField?.selectedValues?.[0]?.id || null;
            const villageIdValue =
              villageField?.selectedValues?.[0]?.id || null;

            // Count villages and blocks (placeholder - would need actual API call for accurate counts)
            const villages = 0; // TODO: Get actual village count from API
            const blocks = 0; // TODO: Get actual block count from API

            return {
              id: String(item.cohortId),
              name: item.name?.trim() || `Center ${item.cohortId}`,
              stateId: stateIdValue,
              districtId: districtIdValue,
              blockId: blockIdValue,
              villageId: villageIdValue,
              villages,
              blocks,
              customFields: item.customFields || [], // Store customFields for CATCHMENT_AREA extraction
            };
          })
          .filter((item: any) => item !== null) || [];

      setCenterOptions(centers);
    } catch (error) {
      console.error('Error loading centers:', error);
      setCenterOptions([]);
    } finally {
      setLoadingStates((prev) => ({ ...prev, centers: false }));
    }
  }, [selectedState, selectedDistrict, selectedBlock, isForReassign, isForLmp, propCenterId, propCenterIds, selectedCenter]);

  // Load centers whenever state/district/block changes
  useEffect(() => {
    loadCenters();
  }, [loadCenters]);

  // Fetch selected center's CATCHMENT_AREA via API in reassign mode (so villages update when user changes center)
  useEffect(() => {
    if (!isForReassign || !selectedCenter) {
      setReassignCenterCatchmentArea(null);
      return;
    }

    setReassignCenterCatchmentArea(null); // Clear previous center's catchment while loading
    setSelectedVillages(new Set()); // Clear village selection when center changes so new center's list is fresh
    let isMounted = true;
    const centerIdToFetch = selectedCenter;

    const fetchCenterCatchmentArea = async () => {
      try {
        const tenantId = localStorage.getItem('tenantId') || '';
        const token = localStorage.getItem('token') || '';
        const academicYearId = localStorage.getItem('academicYearId') || '';

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
          {
            limit: 200,
            offset: 0,
            filters: {
              type: 'COHORT',
              status: ['active'],
              cohortId: [centerIdToFetch],
            },
          },
          {
            headers: {
              'Content-Type': 'application/json',
              tenantId: tenantId,
              Authorization: `Bearer ${token}`,
              academicyearid: academicYearId,
            },
          }
        );

        if (!isMounted) return;

        const cohortDetails = response?.data?.result?.results?.cohortDetails || [];
        const center = cohortDetails.find((c: any) => c.cohortId === centerIdToFetch);

        if (center && center.customFields) {
          const catchmentAreaField = center.customFields.find(
            (field: any) => field.label === 'CATCHMENT_AREA'
          );

          if (catchmentAreaField && catchmentAreaField.selectedValues) {
            setReassignCenterCatchmentArea(catchmentAreaField.selectedValues);
          } else {
            setReassignCenterCatchmentArea(null);
          }
        } else {
          setReassignCenterCatchmentArea(null);
        }
      } catch (error) {
        console.error('Error fetching center CATCHMENT_AREA:', error);
        if (isMounted) {
          setReassignCenterCatchmentArea(null);
        }
      }
    };

    fetchCenterCatchmentArea();

    return () => {
      isMounted = false;
    };
  }, [isForReassign, selectedCenter]);

  // Extract catchment blocks from selected center's CATCHMENT_AREA or fetched CATCHMENT_AREA (in reassign mode)
  useEffect(() => {
    // Priority 1: In reassign mode, use fetched CATCHMENT_AREA for the currently selected center (fetched when selectedCenter changes)
    if (isForReassign && selectedCenter && reassignCenterCatchmentArea) {
      // Extract blocks from fetched center's CATCHMENT_AREA
      const extractedBlocks: Array<{
        id: string | number;
        name: string;
        districtId: string | number;
        districtName: string;
        stateId: string | number;
        stateName: string;
      }> = [];

      if (Array.isArray(reassignCenterCatchmentArea) && reassignCenterCatchmentArea.length > 0) {
        reassignCenterCatchmentArea.forEach((stateData: any) => {
          const stateId = stateData.stateId;
          const stateName = stateData.stateName || '';

          if (stateData.districts && Array.isArray(stateData.districts)) {
            stateData.districts.forEach((district: any) => {
              const districtId = district.districtId;
              const districtName = district.districtName || '';

              if (district.blocks && Array.isArray(district.blocks)) {
                district.blocks.forEach((block: any) => {
                  extractedBlocks.push({
                    id: block.id,
                    name: block.name || '',
                    districtId: districtId,
                    districtName: districtName,
                    stateId: stateId,
                    stateName: stateName,
                  });
                });
              }
            });
          }
        });
      }

      setCatchmentBlocks(extractedBlocks);
      return;
    }

    // Normal flow: Extract blocks from center's CATCHMENT_AREA
    if (!selectedCenter) {
      setCatchmentBlocks([]);
      setVillagesByBlock({});
      setVillagesDisplayLimit({});
      return;
    }

    const center = centerOptions.find((c) => c.id === selectedCenter);
    if (!center || !center.customFields) {
      setCatchmentBlocks([]);
      setVillagesByBlock({});
      setVillagesDisplayLimit({});
      return;
    }

    // Find CATCHMENT_AREA field in customFields
    const catchmentAreaField = center.customFields.find(
      (field: any) => field.label === 'CATCHMENT_AREA'
    );

    if (!catchmentAreaField || !catchmentAreaField.selectedValues) {
      setCatchmentBlocks([]);
      setVillagesByBlock({});
      setVillagesDisplayLimit({});
      return;
    }

    // Extract all blocks from CATCHMENT_AREA
    // CATCHMENT_AREA structure: array of states, each with districts, each with blocks
    const extractedBlocks: Array<{
      id: string | number;
      name: string;
      districtId: string | number;
      districtName: string;
      stateId: string | number;
      stateName: string;
    }> = [];

    catchmentAreaField.selectedValues.forEach((stateData: any) => {
      const stateId = stateData.stateId;
      const stateName = stateData.stateName || '';

      if (stateData.districts && Array.isArray(stateData.districts)) {
        stateData.districts.forEach((district: any) => {
          const districtId = district.districtId;
          const districtName = district.districtName || '';

          if (district.blocks && Array.isArray(district.blocks)) {
            district.blocks.forEach((block: any) => {
              extractedBlocks.push({
                id: block.id,
                name: block.name || '',
                districtId: districtId,
                districtName: districtName,
                stateId: stateId,
                stateName: stateName,
              });
            });
          }
        });
      }
    });

      setCatchmentBlocks(extractedBlocks);
  }, [selectedCenter, centerOptions, isForReassign, propCenterId, reassignCenterCatchmentArea]);

  // Clear villages when center is reset to empty
  useEffect(() => {
    if (!selectedCenter) {
      setSelectedVillages(new Set());
      setVillagesByBlock({});
      setVillagesDisplayLimit({});
      setMaxLimitMessage('');
    }
  }, [selectedCenter]);

  // Get selected center details for summary badges
  const selectedCenterDetails = useMemo(() => {
    return centerOptions.find((c) => c.id === selectedCenter);
  }, [selectedCenter, centerOptions]);

  // Handlers
  const handleStateChange = (event: any) => {
    const value = event.target.value;
    setSelectedState(value);
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedCenter('');
    // Clear villages when center is reset
    setSelectedVillages(new Set());
    setVillagesByBlock({});
    setVillagesDisplayLimit({});
  };

  const handleDistrictChange = (event: any) => {
    const value = event.target.value;
    setSelectedDistrict(value);
    setSelectedBlock('');
    setSelectedCenter('');
    // Clear villages when center is reset
    setSelectedVillages(new Set());
    setVillagesByBlock({});
    setVillagesDisplayLimit({});
  };

  const handleBlockChange = (event: any) => {
    const value = event.target.value;
    setSelectedBlock(value);
    setSelectedCenter('');
    // Clear villages when center is reset
    setSelectedVillages(new Set());
    setVillagesByBlock({});
    setVillagesDisplayLimit({});
  };

  const handleCenterChange = (event: any) => {
    const centerId = event.target.value;
    // Clear catchment blocks and villages first so counts and preselect don't use old center data
    setCatchmentBlocks([]);
    setSelectedVillages(new Set());
    setVillagesByBlock({});
    setVillagesDisplayLimit({});
    setMaxLimitMessage('');
    setSelectedCenter(centerId);
    setVillageIdToSelect('');
    // Call callback if provided (only when center is selected, not when reset)
    if (onCenterChange && centerId) {
      onCenterChange(centerId);
    }
    // Catchment blocks will be updated by useEffect when selectedCenter changes
  };

  const handleClearFilters = () => {
    // For non-central admins, restore state from localStorage after clearing
    // For central admins, clear everything including state
    if (!isCentralAdmin && stateId) {
      // Restore state from localStorage for non-central admins
      const stateIdStr = String(stateId);
      // Check if the state exists in the loaded options
      const stateExists = stateOptions.some((s) => String(s.value) === stateIdStr);
      if (stateExists) {
        setSelectedState(stateIdStr);
      } else {
        setSelectedState('');
      }
    } else {
      // Central admins can clear state completely
      setSelectedState('');
    }
    setSelectedDistrict('');
    setSelectedBlock('');
    setSelectedCenter('');
    // Catchment blocks will be cleared by useEffect when selectedCenter is cleared
    setSelectedVillages(new Set());
    setMaxLimitMessage('');
    setVillagesByBlock({});
    setVillagesDisplayLimit({});
    setVillageSearchKeyword(''); // Clear search keyword
  };

  // Handler for Confirm Assignment button
  const handleConfirmAssignment = () => {
    if (!selectedCenter || selectedVillages.size === 0) {
      return;
    }

    const center = centerOptions.find((c) => c.id === selectedCenter);
    if (!center || !center.customFields) {
      console.error('Center or customFields not found');
      return;
    }

    // Find CATCHMENT_AREA field in customFields
    const catchmentAreaField = center.customFields.find(
      (field: any) => field.label === 'CATCHMENT_AREA'
    );

    if (!catchmentAreaField || !catchmentAreaField.selectedValues) {
      console.error('CATCHMENT_AREA not found');
      return;
    }

    // Create a map of selected villages by block ID
    const selectedVillagesByBlock: Record<string, Array<{ id: number; name: string }>> = {};
    
    // Iterate through all villages and group selected ones by block
    Object.entries(villagesByBlock).forEach(([blockId, villages]) => {
      const selectedInBlock = villages.filter((village) => selectedVillages.has(village.id));
      if (selectedInBlock.length > 0) {
        selectedVillagesByBlock[blockId] = selectedInBlock.map((v) => ({
          id: Number(v.id),
          name: v.name,
        }));
      }
    });

    // Build payload structure from CATCHMENT_AREA
    const payload: Array<{
      stateId: number;
      stateName: string;
      districts: Array<{
        districtId: number;
        districtName: string;
        blocks: Array<{
          id: number;
          name: string;
          villages: Array<{ id: number; name: string }>;
        }>;
      }>;
    }> = [];

    // Iterate through catchment area structure
    catchmentAreaField.selectedValues.forEach((stateData: any) => {
      const stateId = Number(stateData.stateId);
      const stateName = stateData.stateName || '';

      const districts: Array<{
        districtId: number;
        districtName: string;
        blocks: Array<{
          id: number;
          name: string;
          villages: Array<{ id: number; name: string }>;
        }>;
      }> = [];

      if (stateData.districts && Array.isArray(stateData.districts)) {
        stateData.districts.forEach((district: any) => {
          const districtId = Number(district.districtId);
          const districtName = district.districtName || '';

          const blocks: Array<{
            id: number;
            name: string;
            villages: Array<{ id: number; name: string }>;
          }> = [];

          if (district.blocks && Array.isArray(district.blocks)) {
            district.blocks.forEach((block: any) => {
              const blockId = String(block.id);
              
              // Only include blocks that have selected villages
              if (selectedVillagesByBlock[blockId] && selectedVillagesByBlock[blockId].length > 0) {
                blocks.push({
                  id: Number(block.id),
                  name: block.name || '',
                  villages: selectedVillagesByBlock[blockId],
                });
              }
            });
          }

          // Only include districts that have blocks with selected villages
          if (blocks.length > 0) {
            districts.push({
              districtId,
              districtName,
              blocks,
            });
          }
        });
      }

      // Only include states that have districts with selected villages
      if (districts.length > 0) {
        payload.push({
          stateId,
          stateName,
          districts,
        });
      }
    });

    console.log('Confirm Assignment Payload:', JSON.stringify(payload, null, 2));
    
    // Call callback if provided
    if (onAssignmentComplete) {
      onAssignmentComplete(selectedCenter, payload);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
          spacing={{ xs: 2, sm: 0 }}
        >
          <Box>
            <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
              Mentor Village Assignment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select a center, then assign villages from its catchment area.
            </Typography>
          </Box>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={2} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                icon={<LocationOnIcon sx={{ fontSize: 16 }} />}
                label={`${selectedVillagesCount}/${totalVillages} selected`}
                size="small"
                sx={{
                  bgcolor: themeColor,
                  color: '#fff',
                  fontWeight: 500,
                }}
              />
              <Chip
                label={`${selectedBlockCount} blocks`}
                size="small"
                sx={{
                  bgcolor: 'grey.200',
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              />
            </Stack>
            {!hideConfirmButton && (
              <Button
                variant="contained"
                disabled={selectedVillagesCount === 0}
                onClick={handleConfirmAssignment}
                fullWidth={false}
                sx={{
                  bgcolor: themeColor,
                  color: '#fff',
                  textTransform: 'none',
                  px: 3,
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': {
                    bgcolor: '#e0a812',
                  },
                  '&:disabled': {
                    bgcolor: 'grey.300',
                    color: 'grey.500',
                  },
                }}
              >
                Confirm Assignment
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Section 1: Step 1: Select Center */}
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
              <AssignmentIcon sx={{ fontSize: 16, color: themeColor }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Step 1: Select Center
              </Typography>
            </Box>
          </Stack>
        </Stack>

        {/* State, District, Block Dropdowns - hidden when isForLmp */}
        {!isForLmp && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
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
              {loadingStates.state ? (
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              ) : (
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedState}
                    onChange={handleStateChange}
                    displayEmpty
                    disabled={!isCentralAdmin && stateId}
                    sx={{
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select state...
                    </MenuItem>
                    {stateOptions.map((state) => (
                      <MenuItem key={state.value} value={state.value}>
                        {state.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>
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
              {loadingStates.district ? (
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              ) : (
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedDistrict}
                    onChange={handleDistrictChange}
                    displayEmpty
                    disabled={!selectedState}
                    sx={{
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="" disabled>
                      {!selectedState ? 'Select state first...' : 'Select district...'}
                    </MenuItem>
                    {districtOptions.map((district) => (
                      <MenuItem key={district.value} value={district.value}>
                        {district.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>
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
              {loadingStates.block ? (
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              ) : (
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedBlock}
                    onChange={handleBlockChange}
                    displayEmpty
                    disabled={!selectedDistrict}
                    sx={{
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="" disabled>
                      {!selectedDistrict ? 'Select district first...' : 'Select block...'}
                    </MenuItem>
                    {blockOptions.map((block) => (
                      <MenuItem key={block.value} value={block.value}>
                        {block.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Stack
              direction="row"
              alignItems="flex-end"
              sx={{ height: '100%' }}
            >
              <Button
                variant="text"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={handleClearFilters}
                disabled={!selectedState && !selectedDistrict && !selectedBlock && !selectedCenter}
                sx={{ 
                  textTransform: 'none', 
                  mt: 1,
                  color: '#000',
                  '& .MuiSvgIcon-root': {
                    color: '#000',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                  },
                  '&:disabled': {
                    color: 'rgba(0, 0, 0, 0.26)',
                    '& .MuiSvgIcon-root': {
                      color: 'rgba(0, 0, 0, 0.26)',
                    },
                  },
                }}
              >
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
        )}

        {/* Center Selection and Summary Badges */}
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={8}>
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
                Center
              </Typography>
              {loadingStates.centers ? (
                <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 1 }} />
              ) : (
                <FormControl fullWidth size="small">
                  <Select
                    value={selectedCenter}
                    onChange={handleCenterChange}
                    displayEmpty
                    disabled={!isForLmp && !selectedState}
                    sx={{
                      borderRadius: 1,
                    }}
                  >
                    <MenuItem value="" disabled>
                      {!isForLmp && !selectedState
                        ? 'Select state first...'
                        : centerOptions.length === 0
                        ? 'No centers found'
                        : 'Select center...'}
                    </MenuItem>
                    {centerOptions.map((center) => (
                      <MenuItem key={center.id} value={center.id}>
                        {center.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Section 2: Step 2: Select Villages */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: '1px solid',
          borderColor: !selectedCenter ? 'grey.300' : 'divider',
          borderRadius: 2,
          opacity: !selectedCenter ? 0.6 : 1,
          pointerEvents: !selectedCenter ? 'none' : 'auto',
          transition: 'opacity 0.2s, border-color 0.2s',
          position: 'relative',
        }}
      >
        {!selectedCenter && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
              borderRadius: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
              Please select a center in Step 1 to continue
            </Typography>
          </Box>
        )}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={{ xs: 2, sm: 0 }}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                bgcolor: !selectedCenter ? 'grey.200' : themeColorLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LocationOnIcon sx={{ fontSize: 16, color: !selectedCenter ? 'grey.400' : themeColor }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color={!selectedCenter ? 'text.disabled' : 'text.primary'}>
                Step 2: Select Villages
              </Typography>
            </Box>
          </Stack>
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={{ xs: 1, sm: 2 }} 
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`${totalVillages} total`}
                size="small"
                sx={{
                  bgcolor: 'grey.200',
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              />
              <Chip
                label={`${selectedBlockCount} blocks`}
                size="small"
                sx={{
                  bgcolor: 'grey.200',
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              />
              <Chip
                label={`${selectedVillagesCount}/${totalVillages} selected`}
                size="small"
                sx={{
                  bgcolor: themeColor,
                  color: '#fff',
                  fontWeight: 500,
                }}
              />
            </Stack>
            <Button
              variant="text"
              size="small"
              onClick={handleClearSelectedVillages}
              disabled={selectedVillagesCount === 0}
              sx={{ 
                textTransform: 'none', 
                alignSelf: { xs: 'flex-start', sm: 'center' },
                color: '#000',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:disabled': {
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              Clear
            </Button>
          </Stack>
        </Stack>

        {/* Max Limit Message */}
        {maxLimitMessage && (
          <Box
            sx={{
              mb: 2,
              p: 1.5,
              bgcolor: 'error.light',
              color: 'error.dark',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'error.main',
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {maxLimitMessage}
            </Typography>
          </Box>
        )}

        {/* Search Bar */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search villages, blocks..."
            value={villageSearchKeyword}
            onChange={(e) => setVillageSearchKeyword(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              },
            }}
          />
        </Box>

        {/* Catchment Area Text */}
        {selectedCenterDetails && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Showing catchment area of{' '}
              <Typography
                component="span"
                variant="body2"
                sx={{ color: themeColor, fontWeight: 500 }}
              >
                {selectedCenterDetails.name}
              </Typography>
            </Typography>
          </Box>
        )}

        {/* Blocks List with Accordion */}
        {!selectedCenter ? (
          <Box
            sx={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Please select a center first
            </Typography>
          </Box>
        ) : catchmentBlocksForDisplay.length === 0 ? (
          <Box
            sx={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No blocks found in catchment area for selected center
            </Typography>
          </Box>
        ) : filteredBlocksForDisplay.length === 0 ? (
          <Box
            sx={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px dashed',
              borderColor: 'divider',
              borderRadius: 1,
              p: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No blocks or villages found matching "{villageSearchKeyword}"
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: '600px',
              overflowY: 'auto',
              overflowX: 'hidden',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '4px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                },
              },
            }}
          >
            <Stack spacing={1}>
              {filteredBlocksForDisplay.map((block) => {

                return (
                  <Accordion
                    key={block.id}
                    defaultExpanded
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      boxShadow: 'none',
                      '&:before': {
                        display: 'none',
                      },
                      '&.Mui-expanded': {
                        margin: 0,
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<KeyboardArrowDownIcon />}
                      sx={{
                        px: 2,
                        py: 1.5,
                        '& .MuiAccordionSummary-content': {
                          margin: 0,
                          alignItems: 'center',
                        },
                      }}
                    >
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={{ xs: 1, sm: 2 }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        sx={{ width: '100%' }}
                      >
                        {/* Checkbox placeholder - will be added when selection logic is implemented */}
                        <Box sx={{ width: 24, height: 24, display: { xs: 'none', sm: 'block' } }} />

                        {/* Block Name and Info */}
                        <Box sx={{ flex: 1, width: '100%' }}>
                          <Stack 
                            direction={{ xs: 'column', sm: 'row' }} 
                            spacing={{ xs: 0.5, sm: 1.5 }} 
                            alignItems={{ xs: 'flex-start', sm: 'center' }}
                            flexWrap="wrap"
                            useFlexGap
                          >
                            <Typography variant="subtitle2" fontWeight={600}>
                              {block.name}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                              <Chip
                                label={`${block.villageCount} villages`}
                                size="small"
                                sx={{
                                  bgcolor: 'grey.200',
                                  color: 'text.primary',
                                  fontSize: '0.75rem',
                                  height: 20,
                                }}
                              />
                              {block.assignedCount > 0 && (
                                <Chip
                                  label={`${block.assignedCount} assigned`}
                                  size="small"
                                  sx={{
                                    bgcolor: 'grey.300',
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    height: 20,
                                  }}
                                />
                              )}
                              {block.unavailableCount > block.assignedCount && (
                                <Chip
                                  label={`${block.unavailableCount - block.assignedCount} unavailable`}
                                  size="small"
                                  sx={{
                                    bgcolor: 'grey.300',
                                    color: 'text.secondary',
                                    fontSize: '0.75rem',
                                    height: 20,
                                  }}
                                />
                              )}
                            </Stack>
                          </Stack>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 0.5, display: 'block' }}
                          >
                            {block.location}
                          </Typography>
                        </Box>

                        {/* Selected count badge (if any villages are selected) */}
                        {(() => {
                          const selectedInBlock = getSelectedCountInBlock(
                            block.id,
                            villagesByBlock,
                            selectedVillages
                          );
                          return selectedInBlock > 0 ? (
                            <Chip
                              label={`${selectedInBlock} selected`}
                              size="small"
                              sx={{
                                bgcolor: themeColor,
                                color: '#fff',
                                fontSize: '0.75rem',
                                height: 20,
                              }}
                            />
                          ) : null;
                        })()}
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, pb: 2 }}>
                      {(() => {
                        const blockVillages = villagesByBlock[block.id] || [];
                        
                        // Show loading state with skeletons
                        if (loadingStates.villages && blockVillages.length === 0) {
                          return (
                            <Grid container spacing={1.5}>
                              {[...Array(8)].map((_, index) => (
                                <Grid item xs={12} sm={6} md={3} key={index}>
                                  <Card>
                                    <CardContent sx={{ p: 1, py: 1.25, '&:last-child': { pb: 1.25 } }}>
                                      <Stack direction="row" spacing={1} alignItems="center">
                                        <Skeleton variant="circular" width={20} height={20} />
                                        <Skeleton variant="text" width="60%" height={16} />
                                        <Skeleton variant="rectangular" width={50} height={16} sx={{ borderRadius: 0.75 }} />
                                      </Stack>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}
                            </Grid>
                          );
                        }
                        
                        // Filter villages by search keyword using helper function
                        const filteredVillages = filterVillagesBySearch(blockVillages, villageSearchKeyword);

                        // Apply display limit (pagination)
                        const displayLimit = villagesDisplayLimit[block.id] || 50;
                        const totalFilteredVillages = filteredVillages.length;
                        const displayedVillages = filteredVillages.slice(0, displayLimit);
                        const hasMoreVillages = totalFilteredVillages > displayLimit;

                        if (displayedVillages.length === 0) {
                          return (
                            <Box
                              sx={{
                                p: 3,
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="body2" color="text.secondary">
                                {blockVillages.length === 0
                                  ? 'No villages found for this block'
                                  : 'No villages found matching your search'}
                              </Typography>
                            </Box>
                          );
                        }

                        return (
                          <>
                            <Grid container spacing={1.5}>
                              {displayedVillages.map((village) => {
                                const isSelected = selectedVillages.has(village.id);
                                const isUnavailable = village.unavailable || village.assigned;
                                // Disable if unavailable/assigned or if max limit reached and village is not selected
                                const isMaxLimitReached = selectedVillagesCount >= MAX_VILLAGES;
                                const isDisabled = isUnavailable || (isMaxLimitReached && !isSelected);

                              return (
                                <Grid item xs={12} sm={6} md={3} key={village.id}>
                                  <Card
                                    sx={{
                                      border: isSelected
                                        ? `2px solid ${themeColor}`
                                        : '1px solid',
                                      borderColor: isSelected
                                        ? themeColor
                                        : isDisabled
                                        ? 'grey.300'
                                        : 'divider',
                                      borderRadius: 1.5,
                                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                                      transition: 'all 0.2s',
                                      opacity: isDisabled ? 0.6 : 1,
                                      bgcolor: isSelected
                                        ? themeColorLighter
                                        : 'background.paper',
                                      '&:hover': {
                                        boxShadow: isDisabled ? 0 : 1,
                                        borderColor: isDisabled
                                          ? 'grey.300'
                                          : themeColor,
                                      },
                                    }}
                                    onClick={() =>
                                      !isDisabled && handleVillageToggle(village.id, isUnavailable)
                                    }
                                  >
                                    <CardContent
                                      sx={{
                                        p: 1,
                                        py: 1.25,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        '&:last-child': {
                                          pb: 1.25,
                                        },
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onChange={() =>
                                          !isDisabled && handleVillageToggle(village.id, isUnavailable)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        icon={<CheckBoxOutlineBlankIcon />}
                                        checkedIcon={<CheckBoxIcon />}
                                        size="small"
                                        sx={{
                                          color: themeColor,
                                          '&.Mui-checked': {
                                            color: themeColor,
                                          },
                                          '&.Mui-disabled': {
                                            color: 'grey.400',
                                          },
                                          p: 0.25,
                                          flexShrink: 0,
                                        }}
                                      />
                                      <Typography
                                        variant="caption"
                                        fontWeight={isSelected ? 600 : 400}
                                        sx={{
                                          flex: 1,
                                          fontSize: '0.8125rem',
                                          lineHeight: 1.4,
                                          color: isDisabled
                                            ? 'text.disabled'
                                            : 'text.primary',
                                        }}
                                      >
                                        {village.name}
                                      </Typography>
                                      {village.assigned && (
                                        <Chip
                                          label="Assigned"
                                          size="small"
                                          sx={{
                                            bgcolor: 'grey.300',
                                            color: 'text.secondary',
                                            fontSize: '0.65rem',
                                            height: 16,
                                            '& .MuiChip-label': {
                                              px: 0.75,
                                            },
                                            flexShrink: 0,
                                          }}
                                        />
                                      )}
                                      {!village.assigned && isUnavailable && (
                                        <Chip
                                          label="Unavailable"
                                          size="small"
                                          sx={{
                                            bgcolor: 'grey.300',
                                            color: 'text.secondary',
                                            fontSize: '0.65rem',
                                            height: 16,
                                            '& .MuiChip-label': {
                                              px: 0.75,
                                            },
                                            flexShrink: 0,
                                          }}
                                        />
                                      )}
                                    </CardContent>
                                  </Card>
                                </Grid>
                              );
                            })}
                          </Grid>
                          {/* Load More Button */}
                          {hasMoreVillages && (
                            <Box
                              sx={{
                                mt: 2,
                                display: 'flex',
                                justifyContent: 'center',
                              }}
                            >
                              <Button
                                variant="outlined"
                                onClick={() => handleLoadMoreVillages(block.id)}
                                sx={{
                                  textTransform: 'none',
                                  borderColor: 'grey.400',
                                  color: 'text.primary',
                                  '&:hover': {
                                    borderColor: 'grey.600',
                                    bgcolor: 'grey.50',
                                  },
                                }}
                              >
                                Load 50 more ({displayLimit} of {totalFilteredVillages})
                              </Button>
                            </Box>
                          )}
                        </>
                        );
                      })()}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default WorkingVillageAssignmentWidget;
