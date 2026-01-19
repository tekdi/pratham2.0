// @ts-nocheck
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  TextField,
  Box,
  Grid,
  CircularProgress,
  Typography,
  Paper,
  Chip,
  Button,
  Checkbox,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

// Helper function to get nested value from object
const getNestedValue = (obj: any, path: string) => {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};

// Batch API configuration
const BATCH_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
  method: 'POST',
  options: {
    label: 'name',
    value: 'cohortId',
    optionObj: 'result.results.cohortDetails',
  },
  payload: {
    limit: 200,
    offset: 0,
    filters: {
      type: 'BATCH',
      status: ['active'],
      parentId: '**',
    },
  },
};

interface LMPMultipleBatchListWidgetProps {
  value?: string | string[]; // Batch ID(s) - can be string or array
  onChange?: (batchId: string | string[] | null) => void; // Callback with batch ID(s)
  onCenterList?: (centerList: any[]) => void; // Callback with center list
  selectedCenterList?: any[]; // Selected center list
  onBatchList?: (batchList: any[]) => void; // Callback with batch list
  selectedBatchList?: any[]; // Selected batch list
  centerIds?: string | string[]; // Center ID(s) to display - can be string or array
  centerList?: any[]; // Center list to display
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  multiple?: boolean; // Allow multiple center selection
}

const LMPMultipleBatchListWidget: React.FC<LMPMultipleBatchListWidgetProps> = ({
  value = null,
  onChange,
  onCenterList,
  selectedCenterList,
  onBatchList,
  selectedBatchList,
  centerIds,
  centerList,
  label = 'Search and Select Batch',
  required = false,
  error = false,
  helperText,
  disabled = false,
  multiple = false,
}) => {
  // Theme color
  const themeColor = '#FDBE16';
  const themeColorLight = 'rgba(253, 190, 22, 0.1)'; // 10% opacity

  // State management
  const [loadingStates, setLoadingStates] = useState({
    batches: false,
  });

  // Convert centerIds to array format and create center options from centerList or centerIds
  const centerOptions = useMemo(() => {
    if (centerList && Array.isArray(centerList) && centerList.length > 0) {
      return centerList.map((center) => ({
        value: center.cohortId || center.value || center.id,
        label:
          center.name ||
          center.label ||
          `Center ${center.cohortId || center.value || center.id}`,
        state: center.state || '',
        district: center.district || '',
        block: center.block || '',
        village: center.village || '',
        stateId: center.stateId || null,
        districtId: center.districtId || null,
        blockId: center.blockId || null,
        villageId: center.villageId || null,
      }));
    }
    return [];
  }, [centerList]);

  // Store selected centers as objects with full details
  const [selectedCenters, setSelectedCenters] = useState<
    Array<{
      value: string;
      label: string;
      state: string;
      district: string;
      block: string;
      village: string;
      stateId: string | number | null;
      districtId: string | number | null;
      blockId: string | number | null;
      villageId: string | number | null;
    }>
  >(selectedCenterList || []);

  // Batch-related state
  const [batches, setBatches] = useState<{
    [centerId: string]: Array<{
      id: string | number;
      name: string;
      centerId: string;
      centerName: string;
    }>;
  }>({});
  const [loadingBatches, setLoadingBatches] = useState<{
    [centerId: string]: boolean;
  }>({});
  const [selectedBatches, setSelectedBatches] = useState<
    Array<{
      id: string | number;
      name: string;
      centerId: string;
      centerName: string;
      state?: string;
      district?: string;
      block?: string;
      village?: string;
      stateId?: string | number | null;
      districtId?: string | number | null;
      blockId?: string | number | null;
      villageId?: string | number | null;
    }>
  >(selectedBatchList || []);
  const [batchSearchKeyword, setBatchSearchKeyword] = useState('');

  // Sync selectedCenters with centerIds prop or selectedCenterList
  useEffect(() => {
    if (centerIds) {
      const idsArray = Array.isArray(centerIds) ? centerIds : [centerIds];
      const centersToSelect = centerOptions.filter((center) =>
        idsArray.includes(String(center.value))
      );
      if (centersToSelect.length > 0) {
        setSelectedCenters(centersToSelect);
      }
    } else if (selectedCenterList && selectedCenterList.length > 0) {
      setSelectedCenters(selectedCenterList);
    }
  }, [centerIds, centerOptions, selectedCenterList]);

  // Fetch batches for multiple centers in a single API call
  const fetchBatchesForCenters = async (centerIds: (string | number)[]) => {
    // Return early if no center IDs provided
    if (!centerIds || centerIds.length === 0) {
      return;
    }

    // Filter out centers that already have batches loaded
    const centersToFetch = centerIds.filter((centerId) => !batches[centerId]);

    // Double check: Do not call API if centersToFetch is empty
    if (!centersToFetch || centersToFetch.length === 0) {
      return; // All centers already have batches loaded or no centers to fetch
    }

    // Set loading state for all centers being fetched
    const loadingState: { [key: string]: boolean } = {};
    centersToFetch.forEach((centerId) => {
      loadingState[centerId] = true;
    });
    setLoadingBatches((prev) => ({ ...prev, ...loadingState }));

    try {
      const headers = {
        'Content-Type': 'application/json',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };

      // Final safety check: Ensure parentId is not empty before making API call
      if (!centersToFetch || centersToFetch.length === 0) {
        console.warn('Attempted to fetch batches with empty parentId array');
        return;
      }

      // Use array of all center IDs in parentId
      const payload = {
        ...BATCH_API_CONFIG.payload,
        filters: {
          ...BATCH_API_CONFIG.payload.filters,
          parentId: centersToFetch, // parentId should be an array of all center IDs
        },
      };

      const response = await axios.post(BATCH_API_CONFIG.url, payload, {
        headers,
      });

      const batchesData = getNestedValue(
        response.data,
        BATCH_API_CONFIG.options?.optionObj || 'result.results.cohortDetails'
      );

      if (batchesData && Array.isArray(batchesData)) {
        // Group batches by centerId (parentId from batch response)
        const batchesByCenterId: {
          [centerId: string]: Array<{
            id: string | number;
            name: string;
            centerId: string;
            centerName: string;
          }>;
        } = {};

        // Initialize empty arrays for all centers
        centersToFetch.forEach((centerId) => {
          batchesByCenterId[String(centerId)] = [];
        });

        batchesData.forEach((batch: any) => {
          const batchIdRaw =
            batch[BATCH_API_CONFIG.options?.value || 'cohortId'];
          // Handle both numeric IDs and UUID strings
          const batchId =
            typeof batchIdRaw === 'string' && isNaN(Number(batchIdRaw))
              ? batchIdRaw
              : Number(batchIdRaw);

          // Only include batches with valid IDs (not null/undefined/empty)
          if (
            batchId != null &&
            batchId !== '' &&
            !(typeof batchId === 'number' && (isNaN(batchId) || batchId === 0))
          ) {
            // Get parentId from batch (this is the centerId)
            const parentId = batch.parentId;
            if (parentId && batchesByCenterId[String(parentId)]) {
              const center = selectedCenters.find(
                (c) => String(c.value) === String(parentId)
              );
              const centerName = center?.label || '';

              batchesByCenterId[String(parentId)].push({
                id: batchId,
                name:
                  batch[BATCH_API_CONFIG.options?.label || 'name'] ||
                  `Batch ${batchId}`,
                centerId: String(parentId),
                centerName: centerName,
              });
            }
          }
        });

        // Update batches state for all centers
        // When filters change, we want to replace batches only for fetched centers
        // to avoid appending old batches from other centers
        setBatches((prev) => {
          const updated: {
            [centerId: string]: Array<{
              id: string | number;
              name: string;
              centerId: string;
              centerName: string;
            }>;
          } = {};

          // Only keep batches for currently selected centers
          const selectedCenterIds = selectedCenters.map((c) => String(c.value));

          // Keep existing batches only for selected centers that weren't just fetched
          Object.keys(prev).forEach((centerId) => {
            if (
              selectedCenterIds.includes(centerId) &&
              !centersToFetch.includes(centerId)
            ) {
              updated[centerId] = prev[centerId];
            }
          });

          // Add newly fetched batches
          centersToFetch.forEach((centerId) => {
            updated[String(centerId)] =
              batchesByCenterId[String(centerId)] || [];
          });

          return updated;
        });
      } else {
        // If no batches found, set empty arrays for fetched centers
        setBatches((prev) => {
          const updated: {
            [centerId: string]: Array<{
              id: string | number;
              name: string;
              centerId: string;
              centerName: string;
            }>;
          } = {};

          // Only keep batches for currently selected centers that weren't just fetched
          const selectedCenterIds = selectedCenters.map((c) => String(c.value));
          Object.keys(prev).forEach((centerId) => {
            if (
              selectedCenterIds.includes(centerId) &&
              !centersToFetch.includes(centerId)
            ) {
              updated[centerId] = prev[centerId];
            }
          });

          // Set empty arrays for fetched centers
          centersToFetch.forEach((centerId) => {
            updated[String(centerId)] = [];
          });

          return updated;
        });
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      // Set empty arrays on error
      setBatches((prev) => {
        const updated: {
          [centerId: string]: Array<{
            id: string | number;
            name: string;
            centerId: string;
            centerName: string;
          }>;
        } = {};

        // Only keep batches for currently selected centers that weren't just fetched
        const selectedCenterIds = selectedCenters.map((c) => String(c.value));
        Object.keys(prev).forEach((centerId) => {
          if (
            selectedCenterIds.includes(centerId) &&
            !centersToFetch.includes(centerId)
          ) {
            updated[centerId] = prev[centerId];
          }
        });

        // Set empty arrays for fetched centers
        centersToFetch.forEach((centerId) => {
          updated[String(centerId)] = [];
        });

        return updated;
      });
    } finally {
      // Clear loading state for all centers
      const loadingStateClear: { [key: string]: boolean } = {};
      centersToFetch.forEach((centerId) => {
        loadingStateClear[centerId] = false;
      });
      setLoadingBatches((prev) => ({ ...prev, ...loadingStateClear }));
    }
  };

  // Use a ref to track batches
  const batchesRef = useRef(batches);

  // Update batches ref when batches change
  useEffect(() => {
    batchesRef.current = batches;
  }, [batches]);

  // Fetch batches for newly selected centers in a single API call
  useEffect(() => {
    // If no centers are selected, clear batches and return early
    if (selectedCenters.length === 0) {
      setBatches({});
      setLoadingBatches({});
      return;
    }

    // Only fetch for centers that don't have batches yet
    const centerIdsToFetch = selectedCenters
      .filter((center) => {
        const centerBatches = batchesRef.current[center.value];
        return !centerBatches || centerBatches.length === 0;
      })
      .map((center) => center.value);

    // Only call API if we have center IDs to fetch (never call with empty array)
    if (centerIdsToFetch && centerIdsToFetch.length > 0) {
      fetchBatchesForCenters(centerIdsToFetch);
    }
  }, [selectedCenters]);

  // Handler functions

  // Get selected center IDs for comparison
  const selectedCenterIds = useMemo(() => {
    return selectedCenters.map((center) => center.value);
  }, [selectedCenters]);

  // Center selection handlers
  const handleCenterToggle = (center: {
    value: string;
    label: string;
    state: string;
    district: string;
    block: string;
    village: string;
    stateId: string | number | null;
    districtId: string | number | null;
    blockId: string | number | null;
    villageId: string | number | null;
  }) => {
    setSelectedCenters((prev) => {
      const isSelected = prev.some((c) => c.value === center.value);
      let newSelection;

      if (isSelected) {
        // Remove from selection
        // DO NOT remove batches from selected batches - they should persist independently
        // Clear batches data for this center (so Section 3 doesn't show them)
        // But keep selected batches (so Section 4 still shows them)
        newSelection = prev.filter((c) => c.value !== center.value);
        setBatches((prevBatches) => {
          const updated = { ...prevBatches };
          delete updated[center.value];
          return updated;
        });
        setLoadingBatches((prev) => {
          const updated = { ...prev };
          delete updated[center.value];
          return updated;
        });
      } else {
        // Append to selection (don't replace)
        newSelection = [...prev, center];
      }

      // onChange now sends batch IDs instead of center IDs
      // So we only call it when batches are selected, not when centers are selected
      // Call onCenterList callback with center list
      if (onCenterList) {
        onCenterList(newSelection);
      }

      return newSelection;
    });
  };

  // Batch selection handlers
  const handleBatchToggle = (batch: {
    id: string | number;
    name: string;
    centerId: string;
    centerName: string;
  }) => {
    setSelectedBatches((prev) => {
      const isSelected = prev.some(
        (b) => b.id === batch.id && b.centerId === batch.centerId
      );
      let newSelection;

      if (isSelected) {
        // Remove from selection
        newSelection = prev.filter(
          (b) => !(b.id === batch.id && b.centerId === batch.centerId)
        );
      } else {
        // Append to selection
        const center = selectedCenters.find((c) => c.value === batch.centerId);
        newSelection = [
          ...prev,
          {
            ...batch,
            state: center?.state || '',
            district: center?.district || '',
            block: center?.block || '',
            village: center?.village || '',
            stateId: center?.stateId || null,
            districtId: center?.districtId || null,
            blockId: center?.blockId || null,
            villageId: center?.villageId || null,
          },
        ];
      }

      // Call onBatchList callback with full batch details including IDs
      if (onBatchList) {
        onBatchList(newSelection);
      }

      // Call onChange with batch IDs instead of center IDs
      const batchIds = newSelection.map((b) => b.id);
      if (onChange) {
        onChange(batchIds.length > 0 ? batchIds : null);
      }

      return newSelection;
    });
  };

  const handleSelectAllBatches = () => {
    const allSelected = isAllBatchesSelected;

    if (allSelected) {
      // Deselect all visible batches
      const batchIdsToRemove = allBatchesFromSelectedCenters.map(
        (b) => `${b.id}-${b.centerId}`
      );
      const updatedBatches = selectedBatches.filter(
        (b) => !batchIdsToRemove.includes(`${b.id}-${b.centerId}`)
      );
      setSelectedBatches(updatedBatches);
      if (onBatchList) {
        onBatchList(updatedBatches);
      }
      // Call onChange with batch IDs
      const batchIds = updatedBatches.map((b) => b.id);
      if (onChange) {
        onChange(batchIds.length > 0 ? batchIds : null);
      }
    } else {
      // Select all visible batches
      setSelectedBatches((prev) => {
        const existingIds = prev.map((b) => `${b.id}-${b.centerId}`);
        const batchesToAdd = allBatchesFromSelectedCenters.filter(
          (b) => !existingIds.includes(`${b.id}-${b.centerId}`)
        );
        const newBatches = batchesToAdd.map((batch) => {
          const center = selectedCenters.find(
            (c) => c.value === batch.centerId
          );
          return {
            ...batch,
            state: center?.state || '',
            district: center?.district || '',
            block: center?.block || '',
            village: center?.village || '',
            stateId: center?.stateId || null,
            districtId: center?.districtId || null,
            blockId: center?.blockId || null,
            villageId: center?.villageId || null,
          };
        });
        const updatedBatches = [...prev, ...newBatches];
        if (onBatchList) {
          onBatchList(updatedBatches);
        }
        // Call onChange with batch IDs
        const batchIds = updatedBatches.map((b) => b.id);
        if (onChange) {
          onChange(batchIds.length > 0 ? batchIds : null);
        }
        return updatedBatches;
      });
    }
  };

  const handleClearSelectedBatches = () => {
    setSelectedBatches([]);
    if (onBatchList) {
      onBatchList([]);
    }
    // Call onChange with null when batches are cleared
    if (onChange) {
      onChange(null);
    }
  };

  const handleSelectAll = () => {
    const allSelected = centerOptions.every((center) =>
      selectedCenterIds.includes(center.value)
    );

    if (allSelected) {
      // Deselect all centers that are in current centerOptions
      const centerIdsToRemove = centerOptions.map((c) => c.value);
      setSelectedCenters((prev) => {
        const newSelection = prev.filter(
          (c) => !centerIdsToRemove.includes(c.value)
        );
        // onChange now sends batch IDs, not center IDs
        if (onCenterList) {
          onCenterList(newSelection);
        }
        return newSelection;
      });
    } else {
      // Select all centers from current centerOptions (append)
      setSelectedCenters((prev) => {
        const existingIds = prev.map((c) => c.value);
        const centersToAdd = centerOptions.filter(
          (c) => !existingIds.includes(c.value)
        );
        const newSelection = [...prev, ...centersToAdd];
        // onChange now sends batch IDs, not center IDs
        if (onCenterList) {
          onCenterList(newSelection);
        }
        return newSelection;
      });
    }
  };

  const isAllSelected = useMemo(() => {
    if (centerOptions.length === 0) return false;
    return centerOptions.every((center) =>
      selectedCenterIds.includes(center.value)
    );
  }, [centerOptions, selectedCenterIds]);

  // Clear selected centers
  const handleClearSelectedCenters = () => {
    setSelectedCenters([]);
    // Clear batches data when centers are cleared (so Section 3 is empty)
    // But keep selected batches (so Section 4 still shows them)
    setBatches({});
    setLoadingBatches({});
    // onChange now sends batch IDs - call it with current selected batch IDs
    const batchIds = selectedBatches.map((b) => b.id);
    if (onChange) {
      onChange(batchIds.length > 0 ? batchIds : null);
    }
    if (onCenterList) {
      onCenterList([]);
    }
  };

  const selectedCentersCount = selectedCenters.length;

  // Get all batches from selected centers (filtered by search)
  const allBatchesFromSelectedCenters = useMemo(() => {
    const allBatches: Array<{
      id: string | number;
      name: string;
      centerId: string;
      centerName: string;
    }> = [];

    selectedCenters.forEach((center) => {
      const centerBatches = batches[center.value] || [];
      centerBatches.forEach((batch) => {
        if (
          !batchSearchKeyword ||
          batch.name.toLowerCase().includes(batchSearchKeyword.toLowerCase())
        ) {
          allBatches.push(batch);
        }
      });
    });

    return allBatches;
  }, [selectedCenters, batches, batchSearchKeyword]);

  const totalBatchesCount = allBatchesFromSelectedCenters.length;
  const isAllBatchesSelected = useMemo(() => {
    if (totalBatchesCount === 0) return false;
    return allBatchesFromSelectedCenters.every((batch) =>
      selectedBatches.some(
        (b) => b.id === batch.id && b.centerId === batch.centerId
      )
    );
  }, [allBatchesFromSelectedCenters, selectedBatches, totalBatchesCount]);

  // Group batches by center
  const batchesByCenter = useMemo(() => {
    const grouped: Record<
      string,
      Array<{
        id: string | number;
        name: string;
        centerId: string;
        centerName: string;
      }>
    > = {};

    selectedCenters.forEach((center) => {
      const centerBatches = batches[center.value] || [];
      const filteredBatches = centerBatches.filter((batch) => {
        if (
          !batchSearchKeyword ||
          batch.name.toLowerCase().includes(batchSearchKeyword.toLowerCase())
        ) {
          return true;
        }
        return false;
      });

      if (filteredBatches.length > 0) {
        grouped[center.value] = filteredBatches;
      }
    });

    return grouped;
  }, [selectedCenters, batches, batchSearchKeyword]);

  // Group selected batches by center
  const selectedBatchesByCenter = useMemo(() => {
    const grouped: Record<
      string,
      Array<{
        id: string | number;
        name: string;
        centerId: string;
        centerName: string;
        state?: string;
        district?: string;
        block?: string;
        village?: string;
        stateId?: string | number | null;
        districtId?: string | number | null;
        blockId?: string | number | null;
        villageId?: string | number | null;
      }>
    > = {};

    selectedBatches.forEach((batch) => {
      if (!grouped[batch.centerId]) {
        grouped[batch.centerId] = [];
      }
      grouped[batch.centerId].push(batch);
    });

    return grouped;
  }, [selectedBatches]);

  // Get unique states, centers count from selected batches
  const selectedBatchesStats = useMemo(() => {
    const uniqueStates = new Set<string>();
    const uniqueCenters = new Set<string>();

    selectedBatches.forEach((batch) => {
      if (batch.state) uniqueStates.add(batch.state);
      uniqueCenters.add(batch.centerId);
    });

    return {
      statesCount: uniqueStates.size,
      centersCount: uniqueCenters.size,
      batchesCount: selectedBatches.length,
    };
  }, [selectedBatches]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* Section 1: Center List */}
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
              <BusinessIcon sx={{ fontSize: 16, color: themeColor }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                Centers
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {centerOptions.length} center
                {centerOptions.length !== 1 ? 's' : ''} found
              </Typography>
            </Box>
          </Stack>
          {centerOptions.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Checkbox
                checked={isAllSelected}
                onChange={handleSelectAll}
                icon={<CheckBoxOutlineBlankIcon />}
                checkedIcon={<CheckBoxIcon />}
                sx={{
                  color: themeColor,
                  '&.Mui-checked': {
                    color: themeColor,
                  },
                }}
              />
              <Typography variant="body2" color="text.secondary">
                Select All
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Center Cards Grid */}
        {centerOptions.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              py: 4,
            }}
          >
            <Typography variant="body2" color="text.secondary">
              No centers available.
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
            <Grid container spacing={2} sx={{ display: 'flex' }}>
              {centerOptions.map((center) => {
                const isSelected = selectedCenterIds.includes(center.value);
                const locationParts = [
                  center.village,
                  center.block,
                  center.district,
                  center.state,
                ].filter(Boolean);

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={3}
                    key={center.value}
                    sx={{ display: 'flex' }}
                  >
                    <Card
                      sx={{
                        border: isSelected
                          ? `2px solid ${themeColor}`
                          : '1px solid',
                        borderColor: isSelected ? themeColor : 'divider',
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          boxShadow: 2,
                          borderColor: themeColor,
                        },
                      }}
                      onClick={() => handleCenterToggle(center)}
                    >
                      <CardContent
                        sx={{
                          p: 2,
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5,
                            flex: 1,
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleCenterToggle(center)}
                            onClick={(e) => e.stopPropagation()}
                            icon={<CheckBoxOutlineBlankIcon />}
                            checkedIcon={<CheckBoxIcon />}
                            sx={{
                              color: themeColor,
                              '&.Mui-checked': {
                                color: themeColor,
                              },
                              p: 0,
                              mt: 0.5,
                              flexShrink: 0,
                            }}
                          />
                          <Box
                            sx={{
                              flex: 1,
                              minWidth: 0,
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              fontWeight={600}
                              sx={{
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '2.5em', // Ensure consistent height for 2 lines
                              }}
                            >
                              {center.label}
                            </Typography>
                            {locationParts.length > 0 && (
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  flexWrap: 'wrap',
                                }}
                              >
                                <LocationOnIcon
                                  sx={{
                                    fontSize: 14,
                                    color: 'text.secondary',
                                    flexShrink: 0,
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  {locationParts.map((part, index) => (
                                    <React.Fragment key={index}>
                                      {index > 0 && (
                                        <Box
                                          component="span"
                                          sx={{
                                            mx: 0.5,
                                            color: 'text.secondary',
                                          }}
                                        >
                                          •
                                        </Box>
                                      )}
                                      <Box
                                        component="span"
                                        sx={{
                                          color:
                                            index === locationParts.length - 1
                                              ? themeColor
                                              : 'text.secondary',
                                          fontWeight:
                                            index === locationParts.length - 1
                                              ? 500
                                              : 400,
                                        }}
                                      >
                                        {part}
                                      </Box>
                                    </React.Fragment>
                                  ))}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Section 2: Select Batches */}
      {/* Only show when there are selected centers */}
      {selectedCentersCount > 0 && (
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
                <CheckCircleIcon sx={{ fontSize: 16, color: themeColor }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Select Batches
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalBatchesCount} found
                </Typography>
              </Box>
            </Stack>
            {totalBatchesCount > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={isAllBatchesSelected}
                  onChange={handleSelectAllBatches}
                  icon={<CheckBoxOutlineBlankIcon />}
                  checkedIcon={<CheckBoxIcon />}
                  sx={{
                    color: themeColor,
                    '&.Mui-checked': {
                      color: themeColor,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Select All
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Batch Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search batches..."
              value={batchSearchKeyword}
              onChange={(e) => setBatchSearchKeyword(e.target.value)}
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

          {/* Batches Grouped by Center */}
          {(() => {
            const hasAnyBatches = Object.keys(batchesByCenter).length > 0;
            const isAnyLoading = selectedCenters.some(
              (center) => loadingBatches[center.value]
            );

            if (!hasAnyBatches && isAnyLoading) {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4,
                  }}
                >
                  <CircularProgress sx={{ color: themeColor }} />
                </Box>
              );
            }

            if (!hasAnyBatches && !isAnyLoading) {
              return (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    py: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No batches found for selected centers.
                  </Typography>
                </Box>
              );
            }

            return (
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
                {selectedCenters.map((center) => {
                  const centerBatches = batchesByCenter[center.value] || [];
                  const isLoading = loadingBatches[center.value];

                  if (centerBatches.length === 0 && !isLoading) {
                    return null;
                  }

                  const locationParts = [
                    center.village,
                    center.block,
                    center.district,
                    center.state,
                  ].filter(Boolean);

                  return (
                    <Box key={center.value} sx={{ mb: 3 }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          sx={{ mb: 0.5 }}
                        >
                          {center.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {centerBatches.length} batch
                          {centerBatches.length !== 1 ? 'es' : ''}
                        </Typography>
                      </Box>
                      {isLoading ? (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 2,
                          }}
                        >
                          <CircularProgress
                            size={24}
                            sx={{ color: themeColor }}
                          />
                        </Box>
                      ) : (
                        <Grid container spacing={2}>
                          {centerBatches.map((batch) => {
                            const isSelected = selectedBatches.some(
                              (b) =>
                                b.id === batch.id &&
                                b.centerId === batch.centerId
                            );

                            return (
                              <Grid
                                item
                                xs={12}
                                sm={6}
                                md={3}
                                key={`${batch.id}-${batch.centerId}`}
                              >
                                <Card
                                  sx={{
                                    border: isSelected
                                      ? `2px solid ${themeColor}`
                                      : '1px solid',
                                    borderColor: isSelected
                                      ? themeColor
                                      : 'divider',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                      boxShadow: 2,
                                      borderColor: themeColor,
                                    },
                                  }}
                                  onClick={() => handleBatchToggle(batch)}
                                >
                                  <CardContent
                                    sx={{
                                      p: 2,
                                      flex: 1,
                                      display: 'flex',
                                      flexDirection: 'column',
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 1.5,
                                        flex: 1,
                                      }}
                                    >
                                      <Checkbox
                                        checked={isSelected}
                                        onChange={() =>
                                          handleBatchToggle(batch)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        icon={<CheckBoxOutlineBlankIcon />}
                                        checkedIcon={<CheckBoxIcon />}
                                        sx={{
                                          color: themeColor,
                                          '&.Mui-checked': {
                                            color: themeColor,
                                          },
                                          p: 0,
                                          mt: 0.5,
                                          flexShrink: 0,
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          flex: 1,
                                          minWidth: 0,
                                          display: 'flex',
                                          flexDirection: 'column',
                                        }}
                                      >
                                        <Typography
                                          variant="subtitle2"
                                          fontWeight={600}
                                          sx={{
                                            mb: 0.5,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                          }}
                                        >
                                          {batch.name}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </CardContent>
                                </Card>
                              </Grid>
                            );
                          })}
                        </Grid>
                      )}
                    </Box>
                  );
                })}
              </Box>
            );
          })()}
        </Paper>
      )}

      {/* Section 3: Selected Batches Summary */}
      {/* Show selected batches independently */}
      {selectedBatches.length > 0 && (
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
                <CheckCircleIcon sx={{ fontSize: 16, color: themeColor }} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Selected Batches Summary
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    States: {selectedBatchesStats.statesCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <BusinessIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Centers: {selectedBatchesStats.centersCount}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 16, color: 'text.secondary' }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Batches:{' '}
                    <Box
                      component="span"
                      sx={{
                        bgcolor: themeColor,
                        color: '#000',
                        borderRadius: '50%',
                        width: 20,
                        height: 20,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        ml: 0.5,
                      }}
                    >
                      {selectedBatchesStats.batchesCount}
                    </Box>
                  </Typography>
                </Box>
              </Stack>
              <Button
                variant="text"
                size="small"
                onClick={handleClearSelectedBatches}
                sx={{ textTransform: 'none' }}
              >
                Clear All
              </Button>
            </Box>
          </Stack>

          {/* Selected Batches Grouped by Center */}
          <Stack spacing={2}>
            {Object.entries(selectedBatchesByCenter).map(
              ([centerId, centerBatches]) => {
                // Get center info from the first batch (all batches from same center have same info)
                const firstBatch = centerBatches[0];
                const centerName =
                  firstBatch?.centerName || `Center ${centerId}`;
                const locationParts = [
                  firstBatch?.village,
                  firstBatch?.block,
                  firstBatch?.district,
                  firstBatch?.state,
                ].filter(Boolean);

                return (
                  <Box key={centerId}>
                    <Box
                      sx={{
                        mb: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <BusinessIcon sx={{ fontSize: 18, color: themeColor }} />
                      <Typography variant="subtitle2" fontWeight={600}>
                        {centerName}
                      </Typography>
                    </Box>
                    {locationParts.length > 0 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mb: 1.5, display: 'block' }}
                      >
                        {locationParts.join(' • ')}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {centerBatches.map((batch) => (
                        <Chip
                          key={`${batch.id}-${batch.centerId}`}
                          label={
                            <Box sx={{ mt: 2 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {batch.name}
                              </Typography>
                            </Box>
                          }
                          onDelete={() => handleBatchToggle(batch)}
                          deleteIcon={<CloseIcon />}
                          sx={{
                            bgcolor: themeColorLight,
                            border: '1px solid',
                            borderColor: 'rgba(253, 190, 22, 0.3)',
                            '& .MuiChip-deleteIcon': {
                              color: 'text.secondary',
                              '&:hover': {
                                color: 'error.main',
                              },
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                );
              }
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
};

export default LMPMultipleBatchListWidget;
