'use client';

import React, { useState } from 'react';
import FilterFrameworkWrapper from '@learner/components/FilterFramework/FilterFrameworkWrapper';

const HomeCoursesClient: React.FC = () => {
  const [contentFilters, setContentFilters] = useState<Record<string, string[]>>({});

  // Handle filters from FilterFramework
  const handleFiltersReceived = (filters: Record<string, string[]>) => {
    console.log('Received filters in parent component:', filters);
    setContentFilters(filters);
    
    // Here you can:
    // 1. Store filters in state
    // 2. Make API calls with the filters
    // 3. Update your content/course list based on filters
    // 4. Pass filters to other components
    
    // Example: Filter your content/courses based on selected filters
    // if (filters['se_domains']?.length > 0) {
    //   // Filter by domains
    // }
    // if (filters['se_subjects']?.length > 0) {
    //   // Filter by subjects  
    // }
  };

  return (
    <>
      <FilterFrameworkWrapper 
        framework="pragyanpathFw" 
        onFiltersChange={handleFiltersReceived}
      />
      
      {/* You can add your filtered content/courses here */}
      {/* Example: */}
      {/* <FilteredCoursesList filters={contentFilters} /> */}
    </>
  );
};

export default HomeCoursesClient; 