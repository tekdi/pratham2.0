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
import { toPascalCase } from '../DynamicForm/utils/Helper';

interface CenterData {
  id: string;
  name: string;
  childData?: BatchData[];
}

interface BatchData {
  id: string;
  name: string;
  centerId: string;
  cohortStatus?: string;
}

interface SelectedBatch {
  id: string;
  name: string;
}

interface SelectedCenter {
  centerId: string;
  centerName: string;
  batches: SelectedBatch[];
}

interface CenterBasedBatchListWidgetProps {
  value?: SelectedCenter[];
  onChange?: (value: SelectedCenter[]) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  readonly?: boolean;
}

const CenterBasedBatchListWidget: React.FC<CenterBasedBatchListWidgetProps> = ({
  value,
  onChange,
  label = 'Select Batch',
  required = false,
  error = false,
  helperText,
  disabled = false,
  readonly = false,
}) => {
  const [selectedCenters, setSelectedCenters] = useState<SelectedCenter[]>(
    value || []
  );
  const [centers, setCenters] = useState<CenterData[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [loadingBatches, setLoadingBatches] = useState<{
    [centerId: string]: boolean;
  }>({});

  // Fetch centers on mount using mycohorts API
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoadingCenters(true);
        const userId = localStorage.getItem('userId');

        if (!userId) {
          console.error('UserId not found in localStorage');
          setLoadingCenters(false);
          return;
        }

        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
          tenantId: localStorage.getItem('tenantId') || '',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          academicyearid: localStorage.getItem('academicYearId') || '',
        };

        const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/cohort/mycohorts/${userId}?customField=true&children=true`;

        const response = await axios.get(apiUrl, { headers });

        // Extract centers from response
        // Response structure: response.data.result is an array of cohorts
        const cohortsData = response?.data?.result || [];

        console.log('API Response - cohortsData:', cohortsData);
        console.log('Number of cohorts:', cohortsData.length);

        // Filter for active centers (type COHORT, status active)
        const centersData: CenterData[] = cohortsData
          .filter((cohort: any) => {
            const isActiveCohort =
              cohort?.type === 'COHORT' && cohort?.cohortStatus === 'active';
            console.log('Cohort filter:', {
              cohortName: cohort?.cohortName,
              type: cohort?.type,
              cohortStatus: cohort?.cohortStatus,
              isActiveCohort,
            });
            return isActiveCohort;
          })
          .map((cohort: any) => ({
            id: cohort.cohortId || cohort.id,
            name: cohort.cohortName || cohort.name || '',
            childData: cohort.childData || [],
          }));

        console.log('Fetched centers:', centersData);
        console.log('Number of centers after filtering:', centersData.length);
        setCenters(centersData);
      } catch (error) {
        console.error('Error fetching centers:', error);
        setCenters([]);
      } finally {
        setLoadingCenters(false);
      }
    };

    fetchCenters();
  }, []);

  // Handle value prop changes
  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(selectedCenters)) {
      setSelectedCenters(value);
    }
  }, [value]);

  // Load batches for a center from its childData
  const loadBatchesForCenter = (centerId: string) => {
    const center = centers.find((c) => c.id === centerId);
    if (!center || !center.childData) {
      return [];
    }

    // Filter for active batches
    return center.childData
      .filter((child: any) => {
        return (
          child?.type === 'BATCH' &&
          (child?.cohortStatus === 'active' || child?.status === 'active')
        );
      })
      .map((child: any) => ({
        id: child.cohortId || child.id,
        name: child.name || '',
        centerId: centerId,
      }));
  };

  const handleCenterSelect = async (centerId: string) => {
    if (!centerId || centerId === '') {
      return;
    }

    const center = centers.find((c) => c.id === centerId);
    if (!center) {
      console.error('Center not found:', centerId);
      return;
    }

    // Check if center is already selected
    const isCenterSelected = selectedCenters.some(
      (c) => c.centerId === centerId
    );

    if (!isCenterSelected) {
      // Add center if not already selected
      const newCenter: SelectedCenter = {
        centerId: center.id,
        centerName: center.name,
        batches: [],
      };
      const updatedCenters = [...selectedCenters, newCenter];
      setSelectedCenters(updatedCenters);
      onChange?.(updatedCenters);
    }

    // Load batches for this center
    setLoadingBatches((prev) => ({ ...prev, [centerId]: true }));
    // Batches are already in childData, so we just mark as loaded
    setTimeout(() => {
      setLoadingBatches((prev) => ({ ...prev, [centerId]: false }));
    }, 100);
  };

  const handleBatchSelect = (centerId: string, batchId: string) => {
    if (!batchId || batchId === '') {
      return;
    }

    const batches = loadBatchesForCenter(centerId);
    const batch = batches.find((b) => b.id === batchId);

    if (batch) {
      const updatedCenters = selectedCenters.map((center) => {
        if (center.centerId === centerId) {
          // Check if batch is already selected
          const isBatchSelected = center.batches.some((b) => b.id === batchId);
          if (!isBatchSelected) {
            const newBatch: SelectedBatch = {
              id: batch.id,
              name: batch.name,
            };
            return {
              ...center,
              batches: [...center.batches, newBatch],
            };
          }
        }
        return center;
      });
      setSelectedCenters(updatedCenters);
      onChange?.(updatedCenters);
    }
  };

  const handleRemoveBatch = (centerId: string, batchId: string) => {
    const updatedCenters = selectedCenters.map((center) => {
      if (center.centerId === centerId) {
        return {
          ...center,
          batches: center.batches.filter((b) => b.id !== batchId),
        };
      }
      return center;
    });
    setSelectedCenters(updatedCenters);
    onChange?.(updatedCenters);
  };

  const handleRemoveCenter = (centerId: string) => {
    const updatedCenters = selectedCenters.filter(
      (c) => c.centerId !== centerId
    );
    setSelectedCenters(updatedCenters);
    onChange?.(updatedCenters);
  };

  const getAvailableCenters = () => {
    const selectedCenterIds = selectedCenters.map((c) => c.centerId);
    const available = centers.filter(
      (center) => !selectedCenterIds.includes(center.id)
    );
    console.log(
      'Available centers:',
      available,
      'Total centers:',
      centers.length,
      'Selected:',
      selectedCenterIds.length
    );
    return available;
  };

  const getAvailableBatches = (centerId: string) => {
    const center = selectedCenters.find((c) => c.centerId === centerId);
    if (!center) return [];

    const allBatches = loadBatchesForCenter(centerId);
    const selectedBatchIds = center.batches.map((b) => b.id);
    return allBatches.filter((batch) => !selectedBatchIds.includes(batch.id));
  };

  const hasSelectedCenters = () => {
    return selectedCenters.length > 0;
  };

  const getSelectedCentersString = () => {
    return selectedCenters.map((center) => center.centerName).join(', ');
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

      {/* Center Selection */}
      {loadingCenters ? (
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
            Loading centers...
          </Typography>
        </Box>
      ) : centers.length === 0 ? (
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
            No centers found
          </Typography>
        </Box>
      ) : getAvailableCenters().length > 0 ? (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            {label} {required && '*'}
          </Typography>
          <Select
            value=""
            onChange={(e) => {
              const selectedValue = e.target.value;
              if (selectedValue) {
                handleCenterSelect(selectedValue);
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
            {getAvailableCenters().map((center) => (
              <MenuItem key={center.id} value={center.id}>
                {toPascalCase(center.name)}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
            Select a center to start
          </Typography>
        </FormControl>
      ) : null}

      {/* Hidden text input to force native validation */}
      <input
        value={hasSelectedCenters() ? getSelectedCentersString() : ''}
        required={required}
        onChange={() => {}}
        tabIndex={-1}
        style={{
          height: 1,
          padding: 0,
          border: 0,
          ...(hasSelectedCenters() && { visibility: 'hidden' }),
        }}
        aria-hidden="true"
      />

      {getAvailableCenters().length === 0 && selectedCenters.length > 0 && (
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
            All centers have been selected
          </Typography>
        </Box>
      )}

      {/* Selected Centers Display */}
      {selectedCenters.map((center) => {
        const availableBatches = getAvailableBatches(center.centerId);
        const isLoading = loadingBatches[center.centerId] || false;
        const allBatches = loadBatchesForCenter(center.centerId);

        return (
          <Box
            key={center.centerId}
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              p: 2,
              mb: 2,
              backgroundColor: '#f9f9f9',
            }}
          >
            {/* Center Header */}
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
                  label="Center"
                  size="small"
                  sx={{
                    backgroundColor: '#FFC107',
                    color: '#000000',
                    fontWeight: 600,
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: '#000000', fontSize: '1rem' }}
                >
                  {toPascalCase(center.centerName)}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={() => handleRemoveCenter(center.centerId)}
                disabled={disabled || readonly}
                sx={{ color: 'error.main' }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {/* Selected Batches as Chips */}
            {center.batches.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Chip
                    label="Batch"
                    size="small"
                    sx={{
                      backgroundColor: '#FFC107',
                      color: '#000000',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  {center.batches.map((batch, index) => (
                    <Chip
                      key={`batch-${center.centerId}-${batch.id || index}`}
                      label={toPascalCase(batch.name)}
                      onDelete={() =>
                        handleRemoveBatch(center.centerId, batch.id)
                      }
                      deleteIcon={<CloseIcon />}
                      sx={{
                        backgroundColor: '#FFC107',
                        color: '#000000',
                        fontSize: '0.6rem',
                        '& .MuiChip-label': {
                          fontSize: '0.7rem',
                        },
                      }}
                      disabled={disabled || readonly}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Available Batches Dropdown */}
            {(() => {
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
                            handleBatchSelect(center.centerId, batchId);
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
                            {toPascalCase(batch.name)}
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
        );
      })}
    </Box>
  );
};

export default CenterBasedBatchListWidget;
