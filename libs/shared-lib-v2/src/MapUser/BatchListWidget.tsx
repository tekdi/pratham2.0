// @ts-nocheck
import React, { useState, useEffect } from 'react';
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

// Helper function to replace ** with actual value in nested objects
const replacePlaceholder = (obj: any, replacement: any): any => {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      return obj.map((item) => replacePlaceholder(item, replacement));
    } else {
      const replaced = { ...obj };
      for (const key in replaced) {
        if (replaced[key] === '**') {
          replaced[key] = Array.isArray(replacement)
            ? replacement
            : [replacement];
        } else if (typeof replaced[key] === 'object') {
          replaced[key] = replacePlaceholder(replaced[key], replacement);
        }
      }
      return replaced;
    }
  }
  return obj;
};

const getNestedValue = (obj: any, path: string) => {
  if (!path) return obj;
  return path.split('.').reduce((acc, key) => acc && acc[key], obj);
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

interface CenterData {
  id: number;
  name: string;
  blockId: number;
}

interface BatchData {
  id: number;
  name: string;
  centerId: number;
}

interface SelectedBatch {
  id: number;
  name: string;
}

interface SelectedCenter {
  centerId: number;
  centerName: string;
  batches: SelectedBatch[];
}

interface SelectedBlock {
  blockId: number;
  blockName: string;
  centers: SelectedCenter[];
}

interface SelectedDistrict {
  districtId: number;
  districtName: string;
  blocks: SelectedBlock[];
}

interface SelectedState {
  stateId: number;
  stateName: string;
  districts: SelectedDistrict[];
}

interface BatchListWidgetProps {
  value?: SelectedState[];
  onChange?: (value: SelectedState[]) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  readonly?: boolean;
}

// API configuration constants
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

const CENTER_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
  method: 'POST',
  header: {
    tenantId: '**',
    Authorization: '**',
    academicyearid: '**',
  },
  options: {
    label: 'name',
    value: 'cohortId',
    optionObj: 'result.results.cohortDetails',
  },
  payload: {
    limit: 200,
    offset: 0,
    filters: {
      type: 'COHORT',
      status: ['active'],
      block: '**',
    },
  },
};

const BATCH_API_CONFIG = {
  url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/search`,
  method: 'POST',
  header: {
    tenantId: '**',
    Authorization: '**',
    academicyearid: '**',
  },
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

const BatchListWidget: React.FC<BatchListWidgetProps> = ({
  value,
  onChange,
  label = 'Select Batch',
  required = false,
  error = false,
  helperText,
  disabled = false,
  readonly = false,
}) => {
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
  const [centers, setCenters] = useState<{ [blockId: number]: CenterData[] }>(
    {}
  );
  const [batches, setBatches] = useState<{ [centerId: number]: BatchData[] }>(
    {}
  );
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState<{
    [stateId: number]: boolean;
  }>({});
  const [loadingBlocks, setLoadingBlocks] = useState<{
    [districtId: number]: boolean;
  }>({});
  const [loadingCenters, setLoadingCenters] = useState<{
    [blockId: number]: boolean;
  }>({});
  const [loadingBatches, setLoadingBatches] = useState<{
    [centerId: number]: boolean;
  }>({});

  // Get available states (not yet selected) - single state selection
  const availableStates =
    selectedStates.length > 0
      ? [] // If a state is already selected, return empty array
      : states; // Otherwise return all states

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
  }, []);

  // Handle initial data - fetch districts, blocks, centers, and batches for pre-selected data
  useEffect(() => {
    const handleInitialData = async () => {
      if (selectedStates.length > 0) {
        for (const state of selectedStates) {
          // Fetch districts for this state
          await fetchDistrictsForState(state.stateId);

          // Fetch blocks for each district
          for (const district of state.districts) {
            await fetchBlocksForDistrict(district.districtId);

            // Fetch centers for each block
            for (const block of district.blocks) {
              await fetchCentersForBlock(block.blockId);

              // Fetch batches for each center
              for (const center of block.centers) {
                await fetchBatchesForCenter(center.centerId);
              }
            }
          }
        }
      }
    };

    // Only run if states are loaded and we have initial data
    if (states.length > 0 && selectedStates.length > 0) {
      handleInitialData();
    }
  }, [states, selectedStates]);

  // Handle value prop changes (e.g., form reset, external updates)
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(selectedStates)) {
      setSelectedStates(value);
    }
  }, [value]);

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
      } else {
        // Set empty array if no data or invalid response
        setDistricts((prev) => ({ ...prev, [stateId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
      // Set empty array on error
      setDistricts((prev) => ({ ...prev, [stateId]: [] }));
    } finally {
      setLoadingDistricts((prev) => ({ ...prev, [stateId]: false }));
    }
  };

  // Fetch blocks when a district is selected
  const fetchBlocksForDistrict = async (districtId: number) => {
    if (blocks[districtId]) return; // Already loaded

    try {
      setLoadingBlocks((prev) => ({ ...prev, [districtId]: true }));
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
      } else {
        // Set empty array if no data or invalid response
        setBlocks((prev) => ({ ...prev, [districtId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching blocks:', error);
      // Set empty array on error
      setBlocks((prev) => ({ ...prev, [districtId]: [] }));
    } finally {
      setLoadingBlocks((prev) => ({ ...prev, [districtId]: false }));
    }
  };

  // Fetch centers when a block is selected
  const fetchCentersForBlock = async (blockId: number) => {
    if (centers[blockId]) return; // Already loaded

    try {
      setLoadingCenters((prev) => ({ ...prev, [blockId]: true }));
      const headers = {
        'Content-Type': 'application/json',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };

      // Replace ** with blockId in payload (block should be array [blockId])
      const payload = {
        ...CENTER_API_CONFIG.payload,
        filters: {
          ...CENTER_API_CONFIG.payload.filters,
          block: [blockId], // block should be an array
        },
      };

      const response = await axios.post(CENTER_API_CONFIG.url, payload, {
        headers,
      });

      const centersData = getNestedValue(
        response.data,
        CENTER_API_CONFIG.options?.optionObj || 'result.results.cohortDetails'
      );
      if (centersData && Array.isArray(centersData)) {
        const formattedCenters = centersData.map((center: any) => ({
          id: Number(center[CENTER_API_CONFIG.options?.value || 'cohortId']),
          name: center[CENTER_API_CONFIG.options?.label || 'name'],
          blockId: blockId,
        }));
        setCenters((prev) => ({ ...prev, [blockId]: formattedCenters }));
      } else {
        // If no centers found, set empty array
        setCenters((prev) => ({ ...prev, [blockId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching centers:', error);
      // Set empty array on error
      setCenters((prev) => ({ ...prev, [blockId]: [] }));
    } finally {
      setLoadingCenters((prev) => ({ ...prev, [blockId]: false }));
    }
  };

  // Fetch batches when a center is selected
  const fetchBatchesForCenter = async (centerId: number) => {
    console.log(
      'fetchBatchesForCenter called with centerId:',
      centerId,
      'Already loaded?',
      !!batches[centerId]
    );

    if (batches[centerId]) {
      console.log(
        'Batches already loaded for center:',
        centerId,
        'Skipping API call'
      );
      return; // Already loaded
    }

    try {
      console.log('Starting to fetch batches for center:', centerId);
      setLoadingBatches((prev) => ({ ...prev, [centerId]: true }));
      const headers = {
        'Content-Type': 'application/json',
        tenantId: localStorage.getItem('tenantId') || '',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        academicyearid: localStorage.getItem('academicYearId') || '',
      };

      // Replace ** with centerId in payload (parentId should be array [centerId])
      const payload = {
        ...BATCH_API_CONFIG.payload,
        filters: {
          ...BATCH_API_CONFIG.payload.filters,
          parentId: [centerId], // parentId should be an array
        },
      };

      console.log(
        'Fetching batches for center:',
        centerId,
        'Payload:',
        payload,
        'URL:',
        BATCH_API_CONFIG.url
      );

      const response = await axios.post(BATCH_API_CONFIG.url, payload, {
        headers,
      });

      console.log('Batch API response:', response.data);

      const batchesData = getNestedValue(
        response.data,
        BATCH_API_CONFIG.options?.optionObj || 'result.results.cohortDetails'
      );
      if (batchesData && Array.isArray(batchesData)) {
        const formattedBatches = batchesData
          .map((batch: any) => {
            const batchId = Number(
              batch[BATCH_API_CONFIG.options?.value || 'cohortId']
            );
            // Only include batches with valid IDs
            if (!isNaN(batchId) && batchId > 0) {
              return {
                id: batchId,
                name:
                  batch[BATCH_API_CONFIG.options?.label || 'name'] ||
                  `Batch ${batchId}`,
                centerId: centerId,
              };
            }
            return null;
          })
          .filter((batch) => batch !== null) as BatchData[];
        setBatches((prev) => ({ ...prev, [centerId]: formattedBatches }));
      } else {
        // If no batches found, set empty array
        setBatches((prev) => ({ ...prev, [centerId]: [] }));
      }
    } catch (error) {
      console.error('Error fetching batches:', error);
      // Set empty array on error
      setBatches((prev) => ({ ...prev, [centerId]: [] }));
    } finally {
      setLoadingBatches((prev) => ({ ...prev, [centerId]: false }));
    }
  };

  const handleStateSelect = async (event: any) => {
    const selectedStateId = event.target.value;
    if (selectedStateId) {
      const selectedState = states.find((s) => s.id === selectedStateId);
      if (selectedState) {
        // Single state selection - replace existing state
        const newState: SelectedState = {
          stateId: selectedState.id,
          stateName: selectedState.name,
          districts: [],
        };
        const updatedStates = [newState]; // Replace instead of adding
        setSelectedStates(updatedStates);
        setStateSelectValue('');
        onChange?.(updatedStates);

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
            // Single district selection - replace existing district
            return {
              ...state,
              districts: [
                {
                  districtId: district.id,
                  districtName: district.name,
                  blocks: [],
                },
              ],
            };
          }
          return state;
        });
        setSelectedStates(updatedStates);
        setDistrictSelectValues({ ...districtSelectValues, [stateId]: '' });
        onChange?.(updatedStates);

        // Fetch blocks for this district
        await fetchBlocksForDistrict(district.id);
      }
    }
  };

  const handleBlockSelect = async (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const block = blocks[districtId]?.find((block) => block.id === blockId);
    if (block) {
      const updatedStates = selectedStates.map((state) => {
        if (state.stateId === stateId) {
          const updatedDistricts = state.districts.map((district) => {
            if (district.districtId === districtId) {
              // Check if block is already selected
              const isBlockSelected = district.blocks.some(
                (block) => block.blockId === blockId
              );
              if (!isBlockSelected) {
                const newBlock: SelectedBlock = {
                  blockId: block.id,
                  blockName: block.name,
                  centers: [],
                };
                const updatedBlocks = [...district.blocks, newBlock];
                return { ...district, blocks: updatedBlocks };
              }
            }
            return district;
          });
          return { ...state, districts: updatedDistricts };
        }
        return state;
      });
      setSelectedStates(updatedStates);
      onChange?.(updatedStates);

      // Fetch centers for this block
      await fetchCentersForBlock(block.id);
    }
  };

  const handleCenterSelect = async (
    stateId: number,
    districtId: number,
    blockId: number,
    centerId: number | string
  ) => {
    // Don't process if centerId is empty
    if (!centerId || centerId === '') {
      return;
    }

    // Convert centerId to number if it's a string
    const centerIdNum =
      typeof centerId === 'string' ? Number(centerId) : centerId;

    // Validate that centerIdNum is a valid number
    if (isNaN(centerIdNum) || centerIdNum === 0) {
      console.error('Invalid centerId:', centerId, centerIdNum);
      return;
    }

    console.log('handleCenterSelect called:', {
      stateId,
      districtId,
      blockId,
      centerId,
      centerIdNum,
      availableCenters: centers[blockId],
      centersCount: centers[blockId]?.length,
    });

    const center = centers[blockId]?.find((center) => {
      const centerIdAsNum = Number(center.id);
      return (
        centerIdAsNum === centerIdNum ||
        center.id === centerIdNum ||
        String(center.id) === String(centerIdNum)
      );
    });

    if (!center) {
      console.error('Center not found:', {
        centerIdNum,
        blockId,
        availableCenters: centers[blockId],
        allCenters: centers,
        centerIds: centers[blockId]?.map((c) => ({
          id: c.id,
          type: typeof c.id,
        })),
      });
      return;
    }

    console.log('Center found:', center);

    // Check if center is already selected
    const isCenterSelected = selectedStates
      .find((s) => s.stateId === stateId)
      ?.districts.find((d) => d.districtId === districtId)
      ?.blocks.find((b) => b.blockId === blockId)
      ?.centers.some(
        (c) => Number(c.centerId) === centerIdNum || c.centerId === centerIdNum
      );

    let updatedStates = selectedStates;

    if (!isCenterSelected) {
      // Add center if not already selected
      updatedStates = selectedStates.map((state) => {
        if (state.stateId === stateId) {
          const updatedDistricts = state.districts.map((district) => {
            if (district.districtId === districtId) {
              const updatedBlocks = district.blocks.map((block) => {
                if (block.blockId === blockId) {
                  const newCenter: SelectedCenter = {
                    centerId: center.id,
                    centerName: center.name,
                    batches: [],
                  };
                  const updatedCenters = [...block.centers, newCenter];
                  return { ...block, centers: updatedCenters };
                }
                return block;
              });
              return { ...district, blocks: updatedBlocks };
            }
            return district;
          });
          return { ...state, districts: updatedDistricts };
        }
        return state;
      });
      setSelectedStates(updatedStates);
      onChange?.(updatedStates);
      console.log('Center added to selected states');
    } else {
      console.log('Center already selected, fetching batches anyway');
    }

    // Always fetch batches for this center when selected
    console.log('Calling fetchBatchesForCenter with centerId:', center.id);
    await fetchBatchesForCenter(center.id);
  };

  const handleBatchSelect = (
    stateId: number,
    districtId: number,
    blockId: number,
    centerId: number,
    batchId: number | string
  ) => {
    // Convert batchId to number if it's a string
    const batchIdNum = typeof batchId === 'string' ? Number(batchId) : batchId;

    // Validate batchId
    if (isNaN(batchIdNum) || batchIdNum === 0) {
      console.error('Invalid batchId:', batchId, batchIdNum);
      return;
    }

    const batch = batches[centerId]?.find((batch) => batch.id === batchIdNum);
    if (batch) {
      const updatedStates = selectedStates.map((state) => {
        if (state.stateId === stateId) {
          const updatedDistricts = state.districts.map((district) => {
            if (district.districtId === districtId) {
              const updatedBlocks = district.blocks.map((block) => {
                if (block.blockId === blockId) {
                  const updatedCenters = block.centers.map((center) => {
                    if (center.centerId === centerId) {
                      // Check if batch is already selected
                      const isBatchSelected = center.batches.some(
                        (batch) => batch.id === batchIdNum
                      );
                      if (!isBatchSelected) {
                        const newBatch: SelectedBatch = {
                          id: batch.id,
                          name: batch.name,
                        };
                        const updatedBatches = [...center.batches, newBatch];
                        return { ...center, batches: updatedBatches };
                      }
                    }
                    return center;
                  });
                  return { ...block, centers: updatedCenters };
                }
                return block;
              });
              return { ...district, blocks: updatedBlocks };
            }
            return district;
          });
          return { ...state, districts: updatedDistricts };
        }
        return state;
      });
      setSelectedStates(updatedStates);
      onChange?.(updatedStates);
    }
  };

  const handleRemoveBatch = (
    stateId: number,
    districtId: number,
    blockId: number,
    centerId: number,
    batchId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            const updatedBlocks = district.blocks.map((block) => {
              if (block.blockId === blockId) {
                const updatedCenters = block.centers.map((center) => {
                  if (center.centerId === centerId) {
                    return {
                      ...center,
                      batches: center.batches.filter(
                        (batch) => batch.id !== batchId
                      ),
                    };
                  }
                  return center;
                });
                return { ...block, centers: updatedCenters };
              }
              return block;
            });
            return { ...district, blocks: updatedBlocks };
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange?.(updatedStates);
  };

  const handleRemoveCenter = (
    stateId: number,
    districtId: number,
    blockId: number,
    centerId: number
  ) => {
    const updatedStates = selectedStates.map((state) => {
      if (state.stateId === stateId) {
        const updatedDistricts = state.districts.map((district) => {
          if (district.districtId === districtId) {
            const updatedBlocks = district.blocks.map((block) => {
              if (block.blockId === blockId) {
                return {
                  ...block,
                  centers: block.centers.filter(
                    (center) => center.centerId !== centerId
                  ),
                };
              }
              return block;
            });
            return { ...district, blocks: updatedBlocks };
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange?.(updatedStates);
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
              blocks: district.blocks.filter(
                (block) => block.blockId !== blockId
              ),
            };
          }
          return district;
        });
        return { ...state, districts: updatedDistricts };
      }
      return state;
    });
    setSelectedStates(updatedStates);
    onChange?.(updatedStates);
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
    const { [stateId]: _, ...rest } = districtSelectValues;
    setDistrictSelectValues(rest);
    onChange?.(updatedStates);
  };

  const handleRemoveState = (stateId: number) => {
    const updatedStates = selectedStates.filter((s) => s.stateId !== stateId);
    setSelectedStates(updatedStates);
    const { [stateId]: _, ...rest } = districtSelectValues;
    setDistrictSelectValues(rest);
    onChange?.(updatedStates);
  };

  const getAvailableDistricts = (stateId: number) => {
    const state = selectedStates.find((s) => s.stateId === stateId);
    if (!state) return [];
    // Single district selection - if district is already selected, return empty array
    if (state.districts.length > 0) {
      return [];
    }
    // Otherwise return all districts
    return districts[stateId] || [];
  };

  const getAvailableBlocks = (stateId: number, districtId: number) => {
    const allBlocks = blocks[districtId] || [];
    const selectedBlocks = getSelectedBlocksForDistrict(stateId, districtId);
    const selectedBlockIds = selectedBlocks.map((block) =>
      Number(block.blockId)
    );
    return allBlocks.filter((block) => {
      const blockId = Number(block.id);
      return !selectedBlockIds.includes(blockId) && !isNaN(blockId);
    });
  };

  const getAvailableCenters = (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const allCenters = centers[blockId] || [];
    const selectedCenters = getSelectedCentersForBlock(
      stateId,
      districtId,
      blockId
    );
    const selectedCenterIds = selectedCenters.map((center) =>
      Number(center.centerId)
    );
    return allCenters.filter((center) => {
      const centerId = Number(center.id);
      return !selectedCenterIds.includes(centerId) && !isNaN(centerId);
    });
  };

  const getAvailableBatches = (
    stateId: number,
    districtId: number,
    blockId: number,
    centerId: number
  ) => {
    const allBatches = batches[centerId] || [];
    const selectedBatches = getSelectedBatchesForCenter(
      stateId,
      districtId,
      blockId,
      centerId
    );
    const selectedBatchIds = selectedBatches.map((batch) => Number(batch.id));
    return allBatches.filter((batch) => {
      const batchId = Number(batch.id);
      return !selectedBatchIds.includes(batchId) && !isNaN(batchId);
    });
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

  const getSelectedCentersForBlock = (
    stateId: number,
    districtId: number,
    blockId: number
  ) => {
    const state = selectedStates.find((s) => s.stateId === stateId);
    if (!state) return [];
    const district = state.districts.find((d) => d.districtId === districtId);
    if (!district) return [];
    const block = district.blocks.find((b) => b.blockId === blockId);
    if (!block) return [];
    return block.centers;
  };

  const getSelectedBatchesForCenter = (
    stateId: number,
    districtId: number,
    blockId: number,
    centerId: number
  ) => {
    const state = selectedStates.find((s) => s.stateId === stateId);
    if (!state) return [];
    const district = state.districts.find((d) => d.districtId === districtId);
    if (!district) return [];
    const block = district.blocks.find((b) => b.blockId === blockId);
    if (!block) return [];
    const center = block.centers.find((c) => c.centerId === centerId);
    if (!center) return [];
    return center.batches;
  };

  // Check if any states are selected
  const hasSelectedStates = () => {
    return selectedStates.length > 0;
  };

  // Get a string representation of selected states for the hidden input
  const getSelectedStatesString = () => {
    return selectedStates.map((state) => state.stateName).join(', ');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {error && helperText && (
        <Typography
          color="error"
          variant="caption"
          sx={{ display: 'block', mb: 1 }}
        >
          {helperText}
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
      {/* Hidden text input to force native validation */}
      <input
        value={hasSelectedStates() ? getSelectedStatesString() : ''}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        style={{
          height: 1,
          padding: 0,
          border: 0,
          ...(hasSelectedStates() && { visibility: 'hidden' }),
        }}
        aria-hidden="true"
      />
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
            A state has been selected
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
                ).map((block) => (
                  <Box
                    key={block.blockId}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      p: 1.5,
                      mb: 2,
                      backgroundColor: '#fafafa',
                      width: '100%',
                    }}
                  >
                    {/* Block Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Chip
                          label={block.blockName}
                          onDelete={() =>
                            handleRemoveBlock(
                              state.stateId,
                              district.districtId,
                              block.blockId
                            )
                          }
                          deleteIcon={<CloseIcon />}
                          sx={{
                            backgroundColor: '#e3f2fd',
                            color: '#1976d2',
                            fontWeight: 600,
                          }}
                          disabled={disabled || readonly}
                        />
                      </Box>
                    </Box>

                    {/* Centers as Chips */}
                    {getSelectedCentersForBlock(
                      state.stateId,
                      district.districtId,
                      block.blockId
                    ).length > 0 && (
                      <Box sx={{ mb: 1, mt: 1 }}>
                        <Chip
                          label="Selected Centers"
                          size="small"
                          sx={{
                            backgroundColor: '#fff3e0',
                            color: '#f57c00',
                            fontWeight: 600,
                            mb: 1,
                          }}
                        />
                      </Box>
                    )}
                    <Box
                      sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}
                    >
                      {getSelectedCentersForBlock(
                        state.stateId,
                        district.districtId,
                        block.blockId
                      ).map((center) => (
                        <Box
                          key={`center-${block.blockId}-${center.centerId}`}
                          sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            p: 1.5,
                            mb: 2,
                            backgroundColor: 'white',
                            width: '100%',
                          }}
                        >
                          {/* Center Header */}
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1.5,
                              pb: 1,
                              borderBottom: '1px solid #e0e0e0',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                              }}
                            >
                              <Chip
                                label="Center"
                                size="small"
                                sx={{
                                  backgroundColor: '#fff3e0',
                                  color: '#f57c00',
                                  fontWeight: 600,
                                }}
                              />
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600, fontSize: '1rem' }}
                              >
                                {center.centerName}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() =>
                                handleRemoveCenter(
                                  state.stateId,
                                  district.districtId,
                                  block.blockId,
                                  center.centerId
                                )
                              }
                              disabled={disabled || readonly}
                              sx={{ color: 'error.main' }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Batches as Chips */}
                          {getSelectedBatchesForCenter(
                            state.stateId,
                            district.districtId,
                            block.blockId,
                            center.centerId
                          ).length > 0 && (
                            <Box sx={{ mb: 1, mt: 1 }}>
                              <Chip
                                label="Selected Batches"
                                size="small"
                                sx={{
                                  backgroundColor: '#f3e5f5',
                                  color: '#7b1fa2',
                                  fontWeight: 600,
                                  mb: 1,
                                }}
                              />
                            </Box>
                          )}
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            {getSelectedBatchesForCenter(
                              state.stateId,
                              district.districtId,
                              block.blockId,
                              center.centerId
                            ).map((batch, index) => (
                              <Chip
                                key={`batch-${center.centerId}-${
                                  batch.id || index
                                }`}
                                label={batch.name}
                                onDelete={() =>
                                  handleRemoveBatch(
                                    state.stateId,
                                    district.districtId,
                                    block.blockId,
                                    center.centerId,
                                    batch.id
                                  )
                                }
                                deleteIcon={<CloseIcon />}
                                sx={{
                                  backgroundColor: '#f3e5f5',
                                  color: '#7b1fa2',
                                }}
                                disabled={disabled || readonly}
                              />
                            ))}
                          </Box>

                          {/* Available Batches Dropdown */}
                          {(() => {
                            const availableBatches = getAvailableBatches(
                              state.stateId,
                              district.districtId,
                              block.blockId,
                              center.centerId
                            );
                            const isLoading =
                              loadingBatches[center.centerId] || false;
                            const allBatches = batches[center.centerId];

                            // Show message if center is selected (always show for selected centers)
                            // Only show if batches have been loaded (not undefined) or are loading
                            if (isLoading || allBatches !== undefined) {
                              return (
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
                                    Select a Batch:
                                  </Typography>
                                  {isLoading ? (
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        p: 1,
                                      }}
                                    >
                                      <CircularProgress size={16} />
                                      <Typography
                                        variant="caption"
                                        sx={{ ml: 1, color: '#666' }}
                                      >
                                        Loading batches...
                                      </Typography>
                                    </Box>
                                  ) : allBatches.length === 0 ? (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: '#d32f2f',
                                        fontStyle: 'italic',
                                        p: 1,
                                      }}
                                    >
                                      No batches found
                                    </Typography>
                                  ) : availableBatches.length > 0 ? (
                                    <Select
                                      value=""
                                      onChange={(e) => {
                                        const batchId = e.target.value;
                                        if (batchId) {
                                          handleBatchSelect(
                                            state.stateId,
                                            district.districtId,
                                            block.blockId,
                                            center.centerId,
                                            batchId
                                          );
                                        }
                                      }}
                                      displayEmpty
                                      disabled={disabled || readonly}
                                      size="small"
                                      sx={{ backgroundColor: 'white' }}
                                    >
                                      <MenuItem value="">
                                        <em>Select Batch</em>
                                      </MenuItem>
                                      {availableBatches.map((batch, index) => (
                                        <MenuItem
                                          key={`batch-menu-${center.centerId}-${
                                            batch.id || index
                                          }`}
                                          value={batch.id}
                                        >
                                          {batch.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  ) : (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: '#666',
                                        fontStyle: 'italic',
                                      }}
                                    >
                                      No more batches available
                                    </Typography>
                                  )}
                                </FormControl>
                              );
                            }
                            return null;
                          })()}
                        </Box>
                      ))}
                    </Box>

                    {/* Available Centers Dropdown */}
                    {(() => {
                      const availableCenters = getAvailableCenters(
                        state.stateId,
                        district.districtId,
                        block.blockId
                      );
                      const isLoading = loadingCenters[block.blockId] || false;
                      const allCenters = centers[block.blockId];

                      // Show message if no centers found (after loading completes)
                      if (
                        !isLoading &&
                        allCenters !== undefined &&
                        allCenters.length === 0 &&
                        availableCenters.length === 0
                      ) {
                        return (
                          <Box sx={{ mt: 1, p: 1 }}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#d32f2f',
                                fontStyle: 'italic',
                              }}
                            >
                              No centers found
                            </Typography>
                          </Box>
                        );
                      }

                      return availableCenters.length > 0 ? (
                        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              mb: 0.5,
                              color: '#666',
                              fontWeight: 600,
                            }}
                          >
                            Select a Center:
                          </Typography>
                          {isLoading ? (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 1,
                              }}
                            >
                              <CircularProgress size={16} />
                              <Typography
                                variant="caption"
                                sx={{ ml: 1, color: '#666' }}
                              >
                                Loading centers...
                              </Typography>
                            </Box>
                          ) : (
                            <Select
                              value=""
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                console.log(
                                  'Center Select onChange triggered:',
                                  {
                                    selectedValue,
                                    stateId: state.stateId,
                                    districtId: district.districtId,
                                    blockId: block.blockId,
                                  }
                                );
                                if (selectedValue) {
                                  handleCenterSelect(
                                    state.stateId,
                                    district.districtId,
                                    block.blockId,
                                    selectedValue
                                  );
                                }
                              }}
                              displayEmpty
                              disabled={disabled || readonly}
                              size="small"
                              sx={{ backgroundColor: 'white' }}
                            >
                              <MenuItem value="">
                                <em>Select Center</em>
                              </MenuItem>
                              {availableCenters.map((center) => (
                                <MenuItem
                                  key={center.id}
                                  value={String(center.id)}
                                >
                                  {center.name}
                                </MenuItem>
                              ))}
                            </Select>
                          )}
                        </FormControl>
                      ) : null;
                    })()}
                  </Box>
                ))}
              </Box>

              {/* Available Blocks Dropdown */}
              {(() => {
                const availableBlocks = getAvailableBlocks(
                  state.stateId,
                  district.districtId
                );
                const isLoading = loadingBlocks[district.districtId] || false;
                const allBlocks = blocks[district.districtId];

                // Show message if no blocks found (after loading completes)
                // Show when: not loading, blocks have been loaded (exists in blocks object), and is empty
                if (
                  !isLoading &&
                  allBlocks !== undefined &&
                  allBlocks.length === 0 &&
                  availableBlocks.length === 0
                ) {
                  return (
                    <Box sx={{ mt: 1, p: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#d32f2f',
                          fontStyle: 'italic',
                        }}
                      >
                        No blocks found
                      </Typography>
                    </Box>
                  );
                }

                return availableBlocks.length > 0 ? (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
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
                    {isLoading ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 1,
                        }}
                      >
                        <CircularProgress size={16} />
                        <Typography
                          variant="caption"
                          sx={{ ml: 1, color: '#666' }}
                        >
                          Loading blocks...
                        </Typography>
                      </Box>
                    ) : (
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
                    )}
                  </FormControl>
                ) : null;
              })()}
            </Box>
          ))}

          {/* District Selection Dropdown */}
          {(() => {
            const availableDistricts = getAvailableDistricts(state.stateId);
            const isLoading = loadingDistricts[state.stateId];
            const allDistricts = districts[state.stateId];

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

            // Show message if no districts found (after loading completes)
            // Show when: not loading, districts have been loaded (exists in districts object), and is empty
            if (
              !isLoading &&
              allDistricts !== undefined &&
              allDistricts.length === 0 &&
              availableDistricts.length === 0
            ) {
              return (
                <Box sx={{ mt: 2, p: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#d32f2f',
                      fontStyle: 'italic',
                    }}
                  >
                    No districts found
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

export default BatchListWidget;
