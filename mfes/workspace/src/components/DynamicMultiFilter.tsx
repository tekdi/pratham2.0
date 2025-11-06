import React, { useMemo, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Grid,
} from '@mui/material';

interface FilterField {
  code: string;
  label: string;
  inputType: string;
  range?: { key?: string; name?: string; value?: string }[];
  placeholder?: string;
  depends?: string[];
  visible?: boolean;
}

interface DynamicMultiFilterProps {
  readData: FilterField[];
  posFrameworkData: any;
  selectedFilters: { [key: string]: string[] };
  onChange: (filters: { [key: string]: string[] }) => void;
  onSelectedNamesChange?: (selectedNames: Record<string, string[]>) => void; // <-- new
  isProgramFilter?:boolean
}

// Helper to get field definition
const getField = (readData: FilterField[], code: string) =>
  readData.find((f) => f.code === code);

// Helper to get posFrameworkData object by code
const getPosDataByCode = (posFrameworkData: any, code: string) => {
  if (!Array.isArray(posFrameworkData)) return undefined;
  return posFrameworkData.find((p: any) => p.code === code);
};

// Helper to get options for a field based on dependencies
const getOptions = (
  field: FilterField,
  posFrameworkData: any,
  selectedFilters: { [key: string]: string[] },
  readData: FilterField[]
) => {
  if (['domain', 'subDomain', 'subject'].includes(field.code)) {
    const posObj = getPosDataByCode(posFrameworkData, field.code);
    if (posObj && Array.isArray(posObj.terms)) {
      return posObj.terms.map((t: any) => ({ code: t.code, name: t.name }));
    }
    return [];
  }
  if (field.depends && field.depends.length > 0) {
    // Find the posFrameworkData object for this field
    const posObj = getPosDataByCode(posFrameworkData, field.code);
    if (!posObj) return [];
    const options: any[] = [];
    // For each dependency, get selected values
    field.depends.forEach((dep) => {
      const depPosObj = getPosDataByCode(posFrameworkData, dep);
      const depSelected = selectedFilters[dep] || [];
      depSelected.forEach((depValue) => {
        // Find the term in depPosObj.terms
        const depTerm = depPosObj?.terms?.find((t: any) => t.code === depValue);
        if (depTerm && depTerm.associations) {
          // For each association, if its category matches this field's code, add as option
          depTerm.associations.forEach((assoc: any) => {
            if (assoc.category === field.code) {
              options.push({ code: assoc.code, name: assoc.name });
            }
          });
        }
      });
    });
    // Remove duplicates
    return Array.from(new Map(options.map((s) => [s.code, s])).values());
  }
  // If field has no dependencies, but is in posFrameworkData, use its terms
  const posObj = getPosDataByCode(posFrameworkData, field.code);
  if (posObj && Array.isArray(posObj.terms)) {
    return posObj.terms.map((t: any) => ({ code: t.code, name: t.name }));
  }
  return [];
};

const getDomainOptions = (posFrameworkData: any) => {
  const domainObj = posFrameworkData?.find((item: any) => item.code === 'domain');
  return domainObj?.terms?.map((term: any) => ({
    code: term.code,
    name: term.name,
    associations: term.associations,
  })) || [];
};

const getSubDomainOptions = (posFrameworkData: any, selectedDomains: string[]) => {
  const domainObj = posFrameworkData?.find((item: any) => item.code === 'domain');
  const subDomains: { code: string; name: string }[] = [];
  domainObj?.terms?.forEach((domain: any) => {
    if (selectedDomains.includes(domain.code)) {
      domain.associations?.forEach((assoc: any) => {
        if (assoc.category === 'subDomain') {
          subDomains.push({ code: assoc.code, name: assoc.name });
        }
      });
    }
  });
  return subDomains;
};

const getSubjectOptions = (posFrameworkData: any, selectedSubDomains: string[]) => {
  if (!selectedSubDomains || selectedSubDomains.length === 0) return [];
  const subDomainObj = posFrameworkData?.find((item: any) => item.code === 'subDomain');
  const subjects: { code: string; name: string }[] = [];
  subDomainObj?.terms?.forEach((subDomain: any) => {
    if (selectedSubDomains.includes(subDomain.code)) {
      subDomain.associations?.forEach((assoc: any) => {
        if (assoc.category === 'subject') {
          subjects.push({ code: assoc.code, name: assoc.name });
        }
      });
    }
  });
  return subjects;
};

// Utility to map selectedFilters to { label: value }
const getSelectedFiltersByLabel = (selectedFilters: any, readData: any) => {
  const result: Record<string, string[]> = {};
  Object.keys(selectedFilters).forEach(code => {
    const field = readData.find((f: any) => (f as { code: string }).code === code);
    if (field && selectedFilters[code] && selectedFilters[code].length > 0) {
      result[field.label] = selectedFilters[code];
    }
  });
  return result;
};

const getSelectedFiltersByCodeWithNames = (
  selectedFilters: { [key: string]: string[] },
  readData: FilterField[],
  posFrameworkData: any
) => {
  const result: Record<string, string[]> = {};
  Object.keys(selectedFilters).forEach(code => {
    const field = readData.find(f => f.code === code);
    if (field && selectedFilters[code] && selectedFilters[code].length > 0) {
      // Get options for this field
      let options: { code: string; name: string; value?: string }[] = [];
      if (code === 'domain') {
        options = getDomainOptions(posFrameworkData);
      } else if (code === 'subDomain') {
        options = getSubDomainOptions(posFrameworkData, selectedFilters.domain || []);
      } else if (code === 'subject') {
        options = getSubjectOptions(posFrameworkData, selectedFilters.subDomain || []);
      } else if (field.range) {
        options = field.range.map(r => ({
          code: String(r.key || r.value || r.name),
          name: String(r.name || r.value || r.key),
          value: String(r.value || r.key || r.name),
        }));
      }
      // Map selected codes to names (or values for mimetype)
      result[code] = selectedFilters[code]
        .map(val => {
          const option = options.find(opt => opt.code === val);
          if (code === "mimeType") {
            console.log("option", option);
            return option?.value || val;
          }
          return option?.name || val;
        });
    }
  });
  return result;
};

const DynamicMultiFilter: React.FC<DynamicMultiFilterProps> = ({
  readData,
  posFrameworkData,
  selectedFilters,
  onChange,
  onSelectedNamesChange,
  isProgramFilter=true
}) => {
  console.log("readData",readData)
  console.log("posFrameworkData",posFrameworkData)
  // Memoize filter codes for rendering
  const filterCodes = useMemo(() => readData.map((f) => f.code), [readData]);
  // Memoize options for performance
  const domainOptions = useMemo(() => getDomainOptions(posFrameworkData), [posFrameworkData]);
  const subDomainOptions = useMemo(
    () => getSubDomainOptions(posFrameworkData, selectedFilters.domain || []),
    [posFrameworkData, selectedFilters.domain]
  );
  const subjectOptions = useMemo(
    () => getSubjectOptions(posFrameworkData, selectedFilters.subDomain || []),
    [posFrameworkData, selectedFilters.subDomain]
  );

  // Usage (inside your component, after selectedFilters is updated)
  const selectedFiltersByLabel = useMemo(
    () => getSelectedFiltersByLabel(selectedFilters, readData),
    [selectedFilters, readData]
  );

  const selectedFiltersByCodeWithNames = useMemo(
    () => getSelectedFiltersByCodeWithNames(selectedFilters, readData, posFrameworkData),
    [selectedFilters, readData, posFrameworkData]
  );

  // For debugging:
  console.log("selectedFiltersByCodeWithNames",selectedFiltersByCodeWithNames);

  useEffect(() => {
    if (onSelectedNamesChange) {
      onSelectedNamesChange(selectedFiltersByCodeWithNames);
    }
  }, [selectedFiltersByCodeWithNames, onSelectedNamesChange]);

  // Handle change and reset dependents recursively
  const handleChange = (code: string, value: string[]) => {
    let newFilters = { ...selectedFilters, [code]: value };
    // Reset all fields listed in this field's depends array (backend style)
    const resetDependents = (changedCode: string) => {
      const field = readData.find(f => f.code === changedCode);
      if (field && field.depends) {
        field.depends.forEach(depCode => {
          newFilters[depCode] = [];
          resetDependents(depCode); // recursively reset
        });
      }
    };
    resetDependents(code);
    onChange(newFilters);
  };

  // Build a map: fieldCode -> array of parent codes (fields this field is a child of)
  const childToParents: Record<string, string[]> = {};
  readData.forEach(field => {
    (field.depends || []).forEach(childCode => {
      if (!childToParents[childCode]) childToParents[childCode] = [];
      childToParents[childCode].push(field.code);
    });
  });

  // Render a multi-select field
  const renderMultiSelect = (
    code: string,
    label: string,
    options: { code?: string; name?: string; key?: string; value?: string }[],
    placeholder?: string,
    disabled?: boolean
  ) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={code} sx={{ paddingRight: { xs: '0px', sm: '4px' }, paddingBottom: '16px' }}>
      <FormControl sx={{ width: { xs: '100%', lg: '350px' }, margin: 0 }} disabled={disabled}>
        <InputLabel sx={{ color: '#000000DB', fontSize: '14px', top: '-7px', '&.MuiInputLabel-shrink': { top: 0 } }}>{label}</InputLabel>
        <Select
          multiple
          value={selectedFilters[code] || []}
          onChange={(e) => handleChange(code, typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
          input={<OutlinedInput label={label} />}
          MenuProps={{
            PaperProps: { style: { maxHeight: 300 } },
            PopperProps: {
              modifiers: [
                { name: 'flip', enabled: false },
                { name: 'preventOverflow', options: { altAxis: false } },
              ],
            },
          } as any}
          renderValue={(selected) => (selected as string[]).map((v) => {
            const opt = options.find((o) => o.code === v || o.key === v || o.value === v || o.name === v);
            return opt?.name || opt?.value || opt?.key || v;
          }).join(', ')}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': { borderColor: '#000' },
              minHeight: '48px',
            },
            '& .MuiSelect-select': {
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              padding: '10px 14px',
              fontSize: '14px',
            },
            '& .MuiInputBase-root': {
              minHeight: '48px',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.code || option.key || option.value || option.name}
              value={option.code || option.key || option.value || option.name}
              sx={{
                color: '#000',
                padding: '6px 16px',
                minHeight: '36px',
                fontSize: '14px',
                '& .MuiCheckbox-root': {
                  color: '#000',
                  '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                    color: '#000',
                  },
                },
                '& .MuiSvgIcon-root': { fontSize: '16px' },
                '& .MuiListItemText-root': {
                  '& .MuiTypography-root': {
                    fontSize: '14px',
                  },
                },
              }}
            >
              <Checkbox
                checked={(selectedFilters[code] || []).indexOf((option.code || option.key || option.value || option.name) ?? '') > -1}
                sx={{
                  color: '#000',
                  padding: '6px',
                  '&.Mui-checked, &.MuiCheckbox-indeterminate': {
                    color: '#000',
                  },
                }}
              />
              <ListItemText primary={option.name || option.value || option.key} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Grid>
  );

  // Render all fields dynamically
  return (
    <Grid container>
      {/* Domain */}
      {(() => {
        const field = getField(readData, 'domain');
        if (!field?.visible) return null;
        return renderMultiSelect(
          'domain',
          field.label,
          domainOptions,
          field.placeholder
        );
      })()}
      {/* SubDomain */}
      {(() => {
        const field = getField(readData, 'subDomain');
        if (!field?.visible) return null;
        // Enable only if domain is selected
        const disabled = !(selectedFilters.domain && selectedFilters.domain.length > 0);
        return renderMultiSelect(
          'subDomain',
          field.label,
          subDomainOptions,
          field.placeholder,
          disabled
        );
      })()}
      {/* Subject */}
      {(() => {
        const field = getField(readData, 'subject');
        if (!field?.visible) return null;
        // Enable only if subDomain is selected
        const disabled = !(selectedFilters.subDomain && selectedFilters.subDomain.length > 0);
        return renderMultiSelect(
          'subject',
          field.label,
          subjectOptions,
          field.placeholder,
          disabled
        );
      })()}
      {/* Other range-based filters */}
      {filterCodes.filter((code) => {
        const excludedCodes = ['domain', 'subDomain', 'subject'];
        if (!isProgramFilter) {
          excludedCodes.push('program');
        }
        return !excludedCodes.includes(code);
      }).map((code) => {
        const field = getField(readData, code);
        if (!field || !field.visible || !field.range) return null;
        // Normalize options for range
        const options = field.range.map((r) => ({
          code: r.key || r.value || r.name,
          name: r.name || r.value || r.key,
        }));
        return renderMultiSelect(
          code,
          field.label,
          options,
          field.placeholder
        );
      })}
    </Grid>
  );
};

export default DynamicMultiFilter;
