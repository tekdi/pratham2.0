// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { WidgetProps } from '@rjsf/utils';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

const CustomMultiSelectWidget = ({
  id,
  options,
  value = [],
  required,
  label,
  onChange,
  schema,
  uiSchema, // Pass uiSchema to read ui:disabled
}: WidgetProps) => {
  const { enumOptions = [] } = options;
  const maxSelections = schema.maxSelection || enumOptions.length; // Default to max options if not set

  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : [];

  // State to track if all options are selected
  const [isAllSelected, setIsAllSelected] = useState(
    selectedValues.length === enumOptions.length
  );

  // Check if the widget is disabled from uiSchema
  const isDisabled = uiSchema?.['ui:disabled'] === true;

  // Update `isAllSelected` when `selectedValues` changes
  useEffect(() => {
    setIsAllSelected(selectedValues.length === enumOptions.length);
  }, [selectedValues, enumOptions]);

  // Handle change event for select
  const handleChange = (event: any) => {
    const selected = event.target.value;

    if (selected.includes('selectAll')) {
      // If "Select All" is clicked, select or deselect all
      if (isAllSelected) {
        onChange([]); // Deselect all if already selected
      } else {
        const allValues = enumOptions.map((option) => option.value);
        onChange(allValues.slice(0, maxSelections)); // Select all up to maxSelections
      }
    } else {
      // Handle individual selections
      if (Array.isArray(selected)) {
        if (selected.length <= maxSelections) {
          onChange(selected.length > 0 ? selected : []); // Ensures array format
        }
      }
    }
  };

  return (
    <FormControl
      fullWidth
      error={selectedValues.length > maxSelections}
      disabled={
        isDisabled ||
        enumOptions.length === 0 ||
        (enumOptions.length === 1 && enumOptions[0]?.value === 'Select')
      }
    >
      <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
      <Select
        id={id}
        multiple
        label={label}
        labelId="demo-multiple-checkbox-label"
        value={selectedValues}
        onChange={handleChange}
        renderValue={(selected) =>
          enumOptions
            .filter((option) => selected.includes(option.value))
            .map((option) => option.label)
            .join(', ')
        }
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: '300px',
            },
          },
        }}
      >
        {/* Show "Select All" only if maxSelections >= enumOptions.length */}
        {enumOptions.length > 0 && maxSelections >= enumOptions.length && (
          <MenuItem
            key="selectAll"
            value="selectAll"
            disabled={enumOptions.length === 1}
          >
            <Checkbox checked={isAllSelected} />
            <ListItemText
              primary={isAllSelected ? 'Deselect All' : 'Select All'}
            />
          </MenuItem>
        )}

        {/* Map through actual options */}
        {enumOptions.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={
              selectedValues.length >= maxSelections &&
              !selectedValues.includes(option.value)
            }
          >
            <Checkbox checked={selectedValues.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>

      {selectedValues.length > maxSelections && (
        <FormHelperText>
          You can select up to {maxSelections} options
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomMultiSelectWidget;
