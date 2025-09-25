'use client';

import React, { useEffect, useState } from 'react';
import { filterContent } from '@shared-lib-v2/utils/AuthService';
import { 
  KeyboardArrowDown, 
  KeyboardArrowUp 
} from '@mui/icons-material';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
  Collapse,
  Paper,
  useTheme
} from '@mui/material';
import StaticFilterFields from '../staticFilterFields/StaticFilterFields';

interface FilterFrameworkProps {
  framework: string;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
}

interface FilterTerm {
  identifier: string;
  code: string;
  name: string;
  description: string;
  index: number;
  category: string;
  status: string;
  associations?: FilterTerm[];
}

interface FilterCategory {
  identifier: string;
  code: string;
  name: string;
  description: string;
  index: number;
  status: string;
  terms: FilterTerm[];
}

interface FilterState {
  [categoryCode: string]: string[];
}

interface CollapseState {
  [categoryCode: string]: boolean;
}

interface ShowMoreState {
  [categoryCode: string]: boolean;
}

interface DependencyMap {
  [categoryCode: string]: string[]; // Maps category to its dependencies
}

const FilterFramework: React.FC<FilterFrameworkProps> = ({ 
  framework, 
  onFiltersChange 
}) => {
  const [frameworkData, setFrameworkData] = useState<any>(null);
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({});
  const [staticFilters, setStaticFilters] = useState<Record<string, string[]>>({});
  const [collapseState, setCollapseState] = useState<CollapseState>({});
  const [showMoreState, setShowMoreState] = useState<ShowMoreState>({});
  const [dependencyMap, setDependencyMap] = useState<DependencyMap>({});
  const [clearTrigger, setClearTrigger] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const ITEMS_TO_SHOW = 3; // Number of items to show initially
  
  // Calculate filter count (including static filters)
  const frameworkFilterCount = Object.keys(selectedFilters).filter(categoryCode => 
    selectedFilters[categoryCode] && selectedFilters[categoryCode].length > 0
  ).length;
  const staticFilterCount = Object.keys(staticFilters).length;
  const filterCount = frameworkFilterCount + staticFilterCount;

  // Clear all filters
  const clearAllFilters = () => {
    // Clear framework filters
    setSelectedFilters({});
    setStaticFilters({});
    
    // Clear static filters
    setClearTrigger(prev => prev + 1);
    
    // Notify parent with empty filters immediately
    onFiltersChange?.({});
  };
  
  // Transform filters for callback - convert keys and values to desired format
  const transformFiltersForCallback = (filters: FilterState, staticFiltersData: Record<string, string[]> = {}): Record<string, string[]> => {
    const transformedFilters: Record<string, string[]> = {};
    
    // Transform framework filters
    Object.keys(filters).forEach(categoryCode => {
      const selectedTermCodes = filters[categoryCode];
      if (selectedTermCodes && selectedTermCodes.length > 0) {
        // Transform key: add prefix 'se_' and suffix 's'
        const transformedKey = `se_${categoryCode}s`;
        
        // Transform values: convert term codes to term names
        const category = categories.find(cat => cat.code === categoryCode);
        const termNames = selectedTermCodes.map(termCode => {
          const term = category?.terms.find(t => t.code === termCode);
          return term?.name || termCode; // fallback to code if name not found
        }).filter(Boolean);
        
        if (termNames.length > 0) {
          transformedFilters[transformedKey] = termNames;
        }
      }
    });

    // Add static filters directly (they're already in the correct format)
    Object.keys(staticFiltersData).forEach(key => {
      if (staticFiltersData[key] && staticFiltersData[key].length > 0) {
        transformedFilters[key] = staticFiltersData[key];
      }
    });
    
    return transformedFilters;
  };

  // Handle static filter changes
  const handleStaticFiltersChange = (newStaticFilters: Record<string, string[]>) => {
    setStaticFilters(newStaticFilters);
    // Call the callback with merged filters
    const mergedFilters = transformFiltersForCallback(selectedFilters, newStaticFilters);
    onFiltersChange?.(mergedFilters);
  };

  useEffect(() => {
    const fetchFrameworkData = async () => {
      if (framework) {
        setLoading(true);
        try {
          const result = await filterContent({ instantId: framework });
          setFrameworkData(result);
          parseFrameworkData(result);
        } catch (error) {
          console.error('Error calling filterContent:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFrameworkData();
  }, [framework]);

  const parseFrameworkData = (data: any) => {
    if (!data?.framework?.categories) {
      console.error('Invalid framework data structure');
      return;
    }

    const parsedCategories: FilterCategory[] = data.framework.categories.map((category: any) => ({
      identifier: category.identifier,
      code: category.code,
      name: category.name,
      description: category.description,
      index: category.index,
      status: category.status,
      terms: category.terms || []
    }));

    // Sort categories by index
    parsedCategories.sort((a, b) => a.index - b.index);

    // Build dependency map by analyzing associations
    const dependencyGraph: DependencyMap = {};

    // Build dependencies: if category A has associations to category B, then B depends on A
    parsedCategories.forEach(category => {
      const categoryCode = category.code;
      
      category.terms.forEach(term => {
        if (term.associations && term.associations.length > 0) {
          term.associations.forEach(assoc => {
            const targetCategory = assoc.category;
            
            // Initialize dependency array for target category if not exists
            if (!dependencyGraph[targetCategory]) {
              dependencyGraph[targetCategory] = [];
            }
            
            // Add this category as a dependency for the target category
            if (!dependencyGraph[targetCategory].includes(categoryCode)) {
              dependencyGraph[targetCategory].push(categoryCode);
            }
          });
        }
      });
    });

    // Sort dependencies by category index to ensure proper order (parent categories first)
    Object.keys(dependencyGraph).forEach(categoryCode => {
      dependencyGraph[categoryCode].sort((a, b) => {
        const categoryA = parsedCategories.find(cat => cat.code === a);
        const categoryB = parsedCategories.find(cat => cat.code === b);
        return (categoryA?.index || 0) - (categoryB?.index || 0);
      });
    });



    setCategories(parsedCategories);
    setDependencyMap(dependencyGraph);
    
    // Initialize collapse state - all categories expanded by default
    const initialCollapseState: CollapseState = {};
    const initialShowMoreState: ShowMoreState = {};
    parsedCategories.forEach((category, index) => {
      initialCollapseState[category.code] = true; // All categories expanded
      initialShowMoreState[category.code] = false;
    });
    
    setCollapseState(initialCollapseState);
    setShowMoreState(initialShowMoreState);
  };

  const getFilterOptions = (categoryCode: string): FilterTerm[] => {
    const category = categories.find(cat => cat.code === categoryCode);
    if (!category) return [];

    // Check if this category depends on others
    const dependencies = dependencyMap[categoryCode];
    if (dependencies && dependencies.length > 0) {
      return getDependentOptions(categoryCode, dependencies);
    }

    // No dependencies, return all terms
    return category.terms;
  };

  const getDependentOptions = (categoryCode: string, dependencies: string[]): FilterTerm[] => {
    // Check if any dependency has selections
    const hasSelections = dependencies.some(depCode => 
      selectedFilters[depCode] && selectedFilters[depCode].length > 0
    );

    if (!hasSelections) {
      // No selections in dependencies, show all terms
      const category = categories.find(cat => cat.code === categoryCode);
      return category?.terms || [];
    }

    // Get associated terms from ALL dependencies with selections
    const termSets: FilterTerm[][] = [];

    dependencies.forEach(dependencyCode => {
      const selectedValues = selectedFilters[dependencyCode] || [];
      if (selectedValues.length === 0) return; // Skip if no selection for this dependency

      const dependencyCategory = categories.find(cat => cat.code === dependencyCode);
      if (!dependencyCategory) return;

      const associatedTerms: FilterTerm[] = [];
      
      selectedValues.forEach(selectedValue => {
        const dependencyTerm = dependencyCategory.terms.find(term => term.code === selectedValue);
        if (dependencyTerm?.associations) {
          // Filter associations that match our target category
          const relevantAssociations = dependencyTerm.associations.filter(
            assoc => assoc.category === categoryCode
          );
          associatedTerms.push(...relevantAssociations);
        }
      });

      if (associatedTerms.length > 0) {
        termSets.push(associatedTerms);
      }
    });

    if (termSets.length === 0) {
      return [];
    }

    // If only one dependency has selections, return its terms
    if (termSets.length === 1) {
      return termSets[0].filter((term, index, self) => 
        self.findIndex(t => t.identifier === term.identifier) === index
      );
    }

    // Multiple dependencies have selections - find intersection (terms that exist in ALL sets)
    let intersectionTerms = termSets[0];
    
    for (let i = 1; i < termSets.length; i++) {
      intersectionTerms = intersectionTerms.filter(term1 =>
        termSets[i].some(term2 => term1.identifier === term2.identifier)
      );
    }

    // Remove duplicates
    const uniqueTerms = intersectionTerms.filter((term, index, self) => 
      self.findIndex(t => t.identifier === term.identifier) === index
    );

    return uniqueTerms;
  };

  const handleFilterChange = (categoryCode: string, termCode: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[categoryCode]) {
        newFilters[categoryCode] = [];
      }

      if (checked) {
        if (!newFilters[categoryCode].includes(termCode)) {
          newFilters[categoryCode] = [...newFilters[categoryCode], termCode];
        }
      } else {
        newFilters[categoryCode] = newFilters[categoryCode].filter(code => code !== termCode);
      }

      // Clear dependent categories when parent selection changes
      clearDependentFilters(newFilters, categoryCode);

      // Call the callback if provided (merge with static filters)
      const mergedFilters = transformFiltersForCallback(newFilters, staticFilters);
      onFiltersChange?.(mergedFilters);
      console.log('newFilters', newFilters);
      console.log('staticFilters', staticFilters);
      console.log('mergedTransformedFilters', mergedFilters);
      
      return newFilters;
    });
  };

  const clearDependentFilters = (filters: FilterState, changedCategoryCode: string) => {
    // Find all categories that depend on the changed category
    Object.keys(dependencyMap).forEach(dependentCategory => {
      const dependencies = dependencyMap[dependentCategory];
      if (dependencies.includes(changedCategoryCode)) {
        // Clear this dependent category
        filters[dependentCategory] = [];
        // Recursively clear categories that depend on this one
        clearDependentFilters(filters, dependentCategory);
      }
    });

    // Additional logic: If this is a parent category, ensure all its downstream dependencies are cleared
    const categoriesSortedByIndex = categories.slice().sort((a, b) => a.index - b.index);
    const changedCategoryIndex = categories.find(cat => cat.code === changedCategoryCode)?.index || 0;

    // Clear all categories with higher index that might be indirectly dependent
    categoriesSortedByIndex.forEach(category => {
      if (category.index > changedCategoryIndex) {
        const categoryDependencies = dependencyMap[category.code];
        if (categoryDependencies) {
          // If any of this category's dependencies were cleared, clear this category too
          const hasClearedDependency = categoryDependencies.some(depCode => {
            return filters[depCode] && filters[depCode].length === 0;
          });
          
          // Or if the changed category is indirectly affecting this category
          const isIndirectlyAffected = categoryDependencies.some(depCode => {
            const depDependencies = dependencyMap[depCode];
            return depDependencies && depDependencies.includes(changedCategoryCode);
          });

          if (hasClearedDependency || isIndirectlyAffected) {
            filters[category.code] = [];
          }
        }
      }
    });
  };

  const toggleCollapse = (categoryCode: string) => {
    setCollapseState(prev => ({
      ...prev,
      [categoryCode]: !prev[categoryCode]
    }));
  };

  const toggleShowMore = (categoryCode: string) => {
    setShowMoreState(prev => ({
      ...prev,
      [categoryCode]: !prev[categoryCode]
    }));
  };

  const renderFilterSection = (category: FilterCategory) => {
    const isExpanded = collapseState[category.code];
    const showMore = showMoreState[category.code];
    const options = getFilterOptions(category.code);
    const displayedOptions = showMore ? options : options.slice(0, ITEMS_TO_SHOW);
    const hasMoreItems = options.length > ITEMS_TO_SHOW;

    return (
      <Paper 
        key={category.code} 
        elevation={0}
        sx={{ 
          width: { xs: '100%', sm: '300px' }, 
          mb: 2,
         // backgroundColor: '#FFFFFF',
          border: '1px solid #E0E0E0',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        {/* Filter Header */}
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
          onClick={() => toggleCollapse(category.code)}
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
            {category.name}
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

        {/* Filter Options */}
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
              {displayedOptions.map((term) => (
                <Box key={term.identifier} sx={{ width: '100%' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedFilters[category.code]?.includes(term.code) || false}
                        onChange={(e) => handleFilterChange(category.code, term.code, e.target.checked)}
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
                        {term.name}
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
              ))}
            </Box>
            
            {/* Show More/Less Button */}
                        {hasMoreItems && (
              <Box sx={{ width: '100%' }}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShowMore(category.code);
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
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
        }}
      >
        {/* Header Skeleton */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #D0C5B4',
            pb: 2,
          }}
        >
          <Box 
            sx={{ 
              height: 32, 
              bgcolor: 'grey.200', 
              borderRadius: 1, 
              width: 120 
            }} 
          />
        </Box>

        {/* Filter Content Skeleton */}
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ width: '100%' }}>
              <Box 
                sx={{ 
                  height: 20, 
                  bgcolor: 'grey.200', 
                  borderRadius: 1, 
                  width: 96, 
                  mb: 1.5 
                }} 
              />
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ height: 16, width: 16, bgcolor: 'grey.200', borderRadius: 0.5 }} />
                  <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: 128 }} />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ height: 16, width: 16, bgcolor: 'grey.200', borderRadius: 0.5 }} />
                  <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: 112 }} />
                </Box>
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ height: 16, width: 16, bgcolor: 'grey.200', borderRadius: 0.5 }} />
                  <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, width: 144 }} />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (!frameworkData || categories.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
        }}
      >
        {/* Filter Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #D0C5B4',
            pb: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 500,
            }}
          >
            Filter By
          </Typography>
        </Box>

        {/* Empty State */}
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" color="text.secondary">
            No filters available
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
       // backgroundColor: '#F8F9FA',
        padding: { xs: 1, sm: 2 },
        borderRadius: 2
      }}
    >
      {/* Filter Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E0E0E0',
          pb: 2,
          mb: 1,
          backgroundColor: 'transparent'
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 500,
          }}
        >
          Filter By{' '}
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
            Clear Filter
          </Button>
        )}
      </Box>

      {/* Filter Content */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Content Language Filter - First */}
        <StaticFilterFields 
          onFiltersChange={handleStaticFiltersChange} 
          showHeader={false} 
          clearTrigger={clearTrigger}
          filterTypes={['contentLanguage']}
        />
        
        {/* Framework Filters - Middle */}
        {categories.map(renderFilterSection)}
        
        {/* Skills and Course Type Filters - Last */}
        <StaticFilterFields 
          onFiltersChange={handleStaticFiltersChange} 
          showHeader={false} 
          clearTrigger={clearTrigger}
          filterTypes={['skills', 'courseType']}
        />
      </Box>
    </Box>
  );
};

export default FilterFramework; 