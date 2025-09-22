'use client';
import React, { useEffect, useState } from 'react';
import { staticFilterContent } from '@shared-lib-v2/utils/AuthService';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Collapse,
  Paper,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

interface StaticFilterFieldsProps {
  onFiltersChange?: (filters: Record<string, string[]>) => void;
  showHeader?: boolean;
  clearTrigger?: number;
}

interface StaticFilterOption {
  identifier?: string;
  label?: string;
  value?: string; // for simple string values
}

interface StaticFilterField {
  code: string;
  name: string;
  label: string;
  range: (string | StaticFilterOption)[];
}

const StaticFilterFields: React.FC<StaticFilterFieldsProps> = ({ onFiltersChange, showHeader = false, clearTrigger = 0 }) => {
  const [filterFields, setFilterFields] = useState<StaticFilterField[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [collapseState, setCollapseState] = useState<Record<string, boolean>>({});
  const [showMoreState, setShowMoreState] = useState<Record<string, boolean>>({});

  const ITEMS_TO_SHOW = 3; // Number of items to show initially

  // Helper functions to handle both string and object range values
  const getOptionValue = (option: string | StaticFilterOption): string => {
    if (typeof option === 'string') {
      return option;
    }
    return option.identifier || option.label || '';
  };

  const getOptionLabel = (option: string | StaticFilterOption): string => {
    if (typeof option === 'string') {
      return option;
    }
    return option.label || option.identifier || '';
  };

  const getOptionKey = (option: string | StaticFilterOption, index: number): string => {
    if (typeof option === 'string') {
      return option;
    }
    return option.identifier || option.label || `option-${index}`;
  };

  const getCleanLabel = (label: string): string => {
    // Remove (s) suffix from labels
    return label.replace(/\(s\)$/, '');
  };

  const toggleShowMore = (fieldCode: string) => {
    setShowMoreState(prev => ({
      ...prev,
      [fieldCode]: !prev[fieldCode]
    }));
  };

  // Clear filters when clearTrigger changes
  useEffect(() => {
    if (clearTrigger > 0) {
      setSelectedFilters({});
      // Don't call onFiltersChange here - let the parent handle it
      // The parent (FilterFramework) will call onFiltersChange after setting clearTrigger
    }
  }, [clearTrigger]);

  useEffect(() => {
    const fetchStaticFilterContent = async () => {
      const channelId = localStorage.getItem('channelId');
      
      if (!channelId) {
        console.error('Channel ID not found in localStorage');
        return;
      }

      const result = await staticFilterContent({ 
        instantFramework: channelId 
      });
      
      if (result?.objectCategoryDefinition?.forms) {
        const forms = result.objectCategoryDefinition.forms as any;
        if (forms.search?.properties) {
          const searchProperties = forms.search.properties;
        
                  // Extract only contentLanguage field
        const staticFields: StaticFilterField[] = searchProperties
          .filter((field: any) => field.code === 'contentLanguage' && field.range && Array.isArray(field.range))
          .map((field: any) => ({
            code: field.code,
            name: field.name,
            label: field.label,
            range: field.range
          }));

                  setFilterFields(staticFields);
        
        // Initialize collapse state - all expanded by default
        const initialCollapseState: Record<string, boolean> = {};
        const initialShowMoreState: Record<string, boolean> = {};
        staticFields.forEach(field => {
          initialCollapseState[field.code] = true;
          initialShowMoreState[field.code] = false;
        });
        setCollapseState(initialCollapseState);
        setShowMoreState(initialShowMoreState);
        }
      }
    };

    fetchStaticFilterContent();
  }, []);

  const handleFilterChange = (fieldCode: string, option: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[fieldCode]) {
        newFilters[fieldCode] = [];
      }

      if (checked) {
        if (!newFilters[fieldCode].includes(option)) {
          newFilters[fieldCode] = [...newFilters[fieldCode], option];
        }
      } else {
        newFilters[fieldCode] = newFilters[fieldCode].filter(item => item !== option);
      }

      // Clean empty arrays
      if (newFilters[fieldCode].length === 0) {
        delete newFilters[fieldCode];
      }

      // Call callback if provided
      onFiltersChange?.(newFilters);
      
      return newFilters;
    });
  };

  const toggleCollapse = (fieldCode: string) => {
    setCollapseState(prev => ({
      ...prev,
      [fieldCode]: !prev[fieldCode]
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    onFiltersChange?.({});
  };

  // Calculate filter count
  const filterCount = Object.keys(selectedFilters).length;

  if (filterFields.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      {/* Header - only show if showHeader is true */}
      {showHeader && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #D0C5B4',
            pb: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 500,
              fontSize: '1.1rem',
            }}
          >
            Content Filters{' '}
            {filterCount > 0 && `(${filterCount})`}
          </Typography>
          {filterCount > 0 && (
            <Button
              variant="text"
              sx={{
                color: '#1976d2',
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '0.875rem',
              }}
              onClick={clearAllFilters}
            >
              Clear All
            </Button>
          )}
        </Box>
      )}

      {/* Filter Fields */}
      {filterFields.map((field) => {
        const isExpanded = collapseState[field.code];
        const showMore = showMoreState[field.code];
        const selectedOptions = selectedFilters[field.code] || [];
        const displayedOptions = showMore ? field.range : field.range.slice(0, ITEMS_TO_SHOW);
        const hasMoreItems = field.range.length > ITEMS_TO_SHOW;
        
        return (
          <Paper 
            key={field.code} 
            elevation={0}
            sx={{ 
              width: { xs: '100%', sm: '300px' }, 
              mb: 2,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Field Header */}
            <Box
              sx={{
                py: { xs: 1.5, sm: 2 }, 
                px: { xs: 1.5, sm: 2 },
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: isExpanded ? '1px solid #F0F0F0' : 'none'
              }}
              onClick={() => toggleCollapse(field.code)}
            >
              <Typography
                variant="h6"
                component="h3"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: '#1F1B13',
                  letterSpacing: '-0.025em'
                }}
              >
                {getCleanLabel(field.label)} {selectedOptions.length > 0 && `(${selectedOptions.length})`}
              </Typography>
              {isExpanded ? (
                <KeyboardArrowUp 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    color: '#1F1B13',
                    transition: 'transform 0.2s'
                  }} 
                />
              ) : (
                <KeyboardArrowDown 
                  sx={{ 
                    width: 20, 
                    height: 20, 
                    color: '#1F1B13',
                    transition: 'transform 0.2s'
                  }} 
                />
              )}
            </Box>

            {/* Field Options */}
            <Collapse in={isExpanded}>
              <Box sx={{ width: '100%', px: { xs: 1.5, sm: 2 }, pt: 1, pb: { xs: 1.5, sm: 2 } }}>
                <Box 
                  sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 0.5,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#c1c1c1',
                      borderRadius: '3px',
                      '&:hover': {
                        background: '#a8a8a8',
                      },
                    },
                  }}
                >
                  {displayedOptions.map((option, index) => {
                    const optionValue = getOptionValue(option);
                    const optionLabel = getOptionLabel(option);
                    const optionKey = getOptionKey(option, index);
                    
                    return (
                      <Box key={optionKey} sx={{ width: '100%' }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedOptions.includes(optionValue)}
                              onChange={(e) => handleFilterChange(field.code, optionValue, e.target.checked)}
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 18
                                },
                                color: '#666',
                                '&.Mui-checked': {
                                  color: '#000',
                                },
                                padding: '6px'
                              }}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: '0.875rem',
                                color: '#1F1B13',
                                fontWeight: 400,
                                lineHeight: 1.5,
                              }}
                            >
                              {optionLabel}
                            </Typography>
                          }
                          sx={{
                            margin: 0,
                            width: '100%',
                            cursor: 'pointer',
                            alignItems: 'center',
                            '& .MuiFormControlLabel-label': {
                              paddingLeft: '6px'
                            }
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>
                
                {/* Show More/Less Button */}
                {hasMoreItems && (
                  <Box sx={{ width: '100%' }}>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleShowMore(field.code);
                      }}
                      sx={{
                        mt: 1,
                        fontSize: '0.875rem',
                        color: '#987100',
                        fontWeight: 500,
                        textTransform: 'none',
                        padding: 0,
                        minWidth: 'auto',
                        '&:hover': {
                          color: '#987100',
                          backgroundColor: 'transparent'
                        }
                      }}
                    >
                      {showMore ? 'Show less ▲' : 'Show more ▼'}
                    </Button>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Paper>
        );
      })}
    </Box>
  );
};

export default StaticFilterFields;
