'use client';

import React, { useState } from 'react';
import FilterFramework from './FilterFramework';

interface FilterFrameworkWrapperProps {
  framework: string;
  onFiltersChange?: (filters: Record<string, string[]>) => void;
}

const FilterFrameworkWrapper: React.FC<FilterFrameworkWrapperProps> = ({ 
  framework, 
  onFiltersChange 
}) => {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  const handleFiltersChange = (filters: Record<string, string[]>) => {
    console.log('Selected Filters:', filters);
    
    // Store filters in state
    setSelectedFilters(filters);
    
    // Call parent callback if provided
    onFiltersChange?.(filters);
    
    // Example of how to access specific filter categories:
    console.log('Domain filters:', filters['se_domains'] || []);
    console.log('SubDomain filters:', filters['se_subDomains'] || []);
    console.log('Subject filters:', filters['se_subjects'] || []);
    
    // Example of checking if any filters are selected
    const hasFilters = Object.values(filters).some(filterArray => filterArray.length > 0);
    console.log('Has active filters:', hasFilters);
  };

  return (
    <div className="w-full">
      <FilterFramework 
        framework={framework} 
        onFiltersChange={handleFiltersChange}
      />
    </div>
  );
};

export default FilterFrameworkWrapper; 