# React State Management & useEffect Best Practices

## Critical Rules to Prevent State Leakage and Infinite API Calls

### 1. Minimize useRef Usage
- **Rule**: Only use `useRef` for values that don't need to trigger re-renders (DOM refs, timeout IDs, stable callbacks)
- **Anti-pattern**: Using multiple refs to track state changes (e.g., `isSelectingCenterRef`, `isFilterChangingRef`, `isSearchingRef`)
- **Better approach**: Use state variables or derive from existing state
- **Example Bad**:
  ```tsx
  const isSelectingCenterRef = useRef(false);
  const isFilterChangingRef = useRef(false);
  const isSearchingRef = useRef(false);
  ```
- **Example Good**: Use state or derive from props/state directly

### 2. useEffect Dependency Management
- **Rule**: Always include ALL dependencies that are used inside useEffect
- **Rule**: If a function is used in useEffect, wrap it with `useCallback` and include it in dependencies
- **Anti-pattern**: Using refs to store functions to avoid dependency issues
  ```tsx
  // BAD: Storing function in ref to avoid dependencies
  const searchCentersRef = useRef(null);
  useEffect(() => {
    searchCentersRef.current = searchCenters;
  }, [searchCenters]);
  
  useEffect(() => {
    searchCentersRef.current?.(); // Using ref instead of direct call
  }, [filters]);
  ```
- **Better approach**: Use `useCallback` and include in dependencies
  ```tsx
  // GOOD: Stable function with useCallback
  const searchCenters = useCallback(async () => {
    // search logic
  }, [dependencies]);
  
  useEffect(() => {
    searchCenters();
  }, [filters, searchCenters]); // Include the function
  ```

### 3. Prevent Circular useEffect Chains
- **Rule**: Never update state in useEffect that is also in its dependency array
- **Anti-pattern**:
  ```tsx
  useEffect(() => {
    setSelectedCenter(newCenters); // Updating selectedCenter
  }, [value, centerOptions, selectedCenter]); // selectedCenter is in deps!
  ```
- **Better approach**: Remove the state from dependencies or use a different pattern
  ```tsx
  // GOOD: Only depend on external props/state
  useEffect(() => {
    if (value) {
      setSelectedCenter(computeCenters(value, centerOptions));
    }
  }, [value, centerOptions]); // Don't include selectedCenter
  ```

### 4. Debouncing and Timeouts
- **Rule**: Always clean up timeouts in useEffect cleanup
- **Rule**: Use simple timeout logic, avoid complex ref tracking
- **Anti-pattern**:
  ```tsx
  const searchTimeoutRef = useRef(null);
  const lastFilterValuesRef = useRef({});
  
  useEffect(() => {
    // Complex normalization and comparison
    const normalized = /* complex logic */;
    if (lastFilterValuesRef.current !== normalized) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        // More complex checks with multiple refs
        if (!isSelectingCenterRef.current && !isFilterChangingRef.current) {
          searchCentersRef.current?.();
        }
      }, delay);
    }
  }, [dependencies]);
  ```
- **Better approach**: Simple debouncing with cleanup
  ```tsx
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchCenters();
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [dependencies, searchCenters]);
  ```

### 5. State Synchronization Patterns
- **Rule**: Avoid bidirectional state synchronization between props and internal state
- **Rule**: Prefer controlled components pattern (props control state) or uncontrolled (internal state only)
- **Anti-pattern**: Syncing `value` prop with `selectedCenter` state in both directions
  ```tsx
  // BAD: Bidirectional sync causing loops
  useEffect(() => {
    // Sync value -> selectedCenter
    setSelectedCenter(computeFromValue(value));
  }, [value]);
  
  const handleChange = (newValue) => {
    setSelectedCenter(newValue); // Update internal state
    onChange(newValue); // Update parent
  };
  ```
- **Better approach**: Single source of truth
  ```tsx
  // GOOD: Use value prop as source of truth, or use internal state only
  const [selectedCenters, setSelectedCenters] = useState(selectedCenterList || []);
  
  // Only sync from props if explicitly provided and different
  useEffect(() => {
    if (selectedCenterList && selectedCenterList !== selectedCenters) {
      setSelectedCenters(selectedCenterList);
    }
  }, [selectedCenterList]);
  ```

### 6. API Call Optimization
- **Rule**: Use `useCallback` for API functions to ensure stability
- **Rule**: Include all dependencies in useCallback, don't use refs to bypass
- **Rule**: Check conditions before making API calls, not with refs
- **Anti-pattern**:
  ```tsx
  const isSearchingRef = useRef(false);
  
  const searchCenters = async () => {
    if (isSearchingRef.current) return; // Using ref to prevent calls
    isSearchingRef.current = true;
    // API call
    isSearchingRef.current = false;
  };
  ```
- **Better approach**: Use state or conditions
  ```tsx
  const [isSearching, setIsSearching] = useState(false);
  
  const searchCenters = useCallback(async () => {
    if (isSearching || !hasRequiredFilters) return;
    setIsSearching(true);
    try {
      // API call
    } finally {
      setIsSearching(false);
    }
  }, [isSearching, hasRequiredFilters]);
  ```

### 7. Filter State Management
- **Rule**: Keep filter state simple and avoid complex normalization
- **Rule**: Don't track "last values" in refs to prevent duplicate calls
- **Anti-pattern**:
  ```tsx
  const lastFilterValuesRef = useRef({});
  
  useEffect(() => {
    const normalized = /* complex normalization */;
    if (lastFilterValuesRef.current.state !== normalized.state) {
      lastFilterValuesRef.current = normalized;
      search();
    }
  }, [filters]);
  ```
- **Better approach**: React's dependency array handles this
  ```tsx
  useEffect(() => {
    searchCenters();
  }, [selectedState, selectedDistrict, selectedBlock, searchKeyword, searchCenters]);
  // React automatically prevents duplicate calls if values haven't changed
  ```

### 8. Handler Functions
- **Rule**: Keep handlers simple, avoid setting multiple flags/refs
- **Rule**: Update state directly, let useEffect handle side effects
- **Anti-pattern**:
  ```tsx
  const handleStateChange = (values) => {
    isFilterChangingRef.current = true; // Setting ref flag
    setSelectedState(values);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    setCenterOptions([]);
    // Clear timeouts, update refs, etc.
    setTimeout(() => {
      isFilterChangingRef.current = false; // Reset flag
    }, 300);
  };
  ```
- **Better approach**: Simple state updates
  ```tsx
  const handleStateChange = (values) => {
    setSelectedState(values);
    setSelectedDistrict([]);
    setSelectedBlock([]);
    // Let useEffect handle clearing options and searching
  };
  ```

### 9. Component Lifecycle Management
- **Rule**: Always use cleanup functions for async operations
- **Rule**: Use `isMounted` flag for async operations, not refs for preventing calls
- **Anti-pattern**:
  ```tsx
  useEffect(() => {
    const fetchData = async () => {
      if (isSelectingCenterRef.current) return; // Using ref
      // fetch
    };
  }, []);
  ```
- **Better approach**:
  ```tsx
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const data = await apiCall();
      if (isMounted) {
        setData(data);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);
  ```

### 10. Code Complexity Reduction
- **Rule**: If you need more than 3-4 refs, reconsider the architecture
- **Rule**: If useEffect has more than 5 dependencies, consider splitting or refactoring
- **Rule**: If you need flags to prevent loops, the design needs improvement
- **Rule**: Prefer multiple simple useEffects over one complex useEffect

## Summary Checklist

Before writing useEffect or state management code, ensure:

- [ ] All dependencies are included in useEffect dependency array
- [ ] Functions used in useEffect are wrapped with useCallback
- [ ] No state variable is both updated and in dependency array
- [ ] Timeouts/intervals are cleaned up in useEffect cleanup
- [ ] No more than 3-4 refs per component (excluding DOM refs)
- [ ] No flags/refs used to prevent infinite loops (fix the root cause instead)
- [ ] Simple debouncing without complex ref tracking
- [ ] Single source of truth for state (props OR internal state, not both)
- [ ] API calls are in useCallback with proper dependencies
- [ ] Async operations check isMounted before setting state

## Example: Good vs Bad Patterns

### Bad Pattern (Causes State Leakage & Infinite Loops)
```tsx
// Too many refs
const isSelectingCenterRef = useRef(false);
const isFilterChangingRef = useRef(false);
const isSearchingRef = useRef(false);
const searchCentersRef = useRef(null);
const lastFilterValuesRef = useRef({});

// Function stored in ref
useEffect(() => {
  searchCentersRef.current = searchCenters;
}, [searchCenters]);

// Complex useEffect with ref checks
useEffect(() => {
  if (isSelectingCenterRef.current || isFilterChangingRef.current) return;
  const normalized = /* complex */;
  if (lastFilterValuesRef.current !== normalized) {
    searchTimeoutRef.current = setTimeout(() => {
      if (!isSearchingRef.current) {
        searchCentersRef.current?.();
      }
    }, delay);
  }
}, [filters]);

// State in dependency array that's also updated
useEffect(() => {
  setSelectedCenter(compute(value));
}, [value, selectedCenter]); // selectedCenter updated inside!
```

### Good Pattern (Clean & Stable)
```tsx
// Minimal refs (only for timeout cleanup)
const timeoutRef = useRef<NodeJS.Timeout | null>(null);

// Stable function with useCallback
const searchCenters = useCallback(async () => {
  if (!hasRequiredFilters) return;
  setLoading(true);
  try {
    const data = await apiCall(filters);
    setCenters(data);
  } finally {
    setLoading(false);
  }
}, [filters, hasRequiredFilters]);

// Simple debounced useEffect
useEffect(() => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  
  timeoutRef.current = setTimeout(() => {
    searchCenters();
  }, 500);
  
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, [selectedState, selectedDistrict, searchKeyword, searchCenters]);

// Simple state sync (one direction only)
useEffect(() => {
  if (value && value !== selectedCenters.map(c => c.value)) {
    setSelectedCenters(computeFromValue(value));
  }
}, [value]); // Don't include selectedCenters
```

## Key Takeaways

1. **Less is More**: Fewer refs, simpler logic, cleaner code
2. **Trust React**: React's dependency array handles change detection
3. **useCallback is Your Friend**: Use it for functions in useEffect
4. **Single Source of Truth**: Don't sync state bidirectionally
5. **Fix Root Causes**: If you need flags to prevent loops, redesign
6. **Keep it Simple**: Complex normalization and comparison usually indicates a design issue

