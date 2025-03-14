import React from 'react';
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
}: WidgetProps) => {
  const { enumOptions = [] } = options;
  // console.log('enumOptions', enumOptions);
  const maxSelections = schema.maxSelection || enumOptions.length; // Default to max options if not set

  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : [];

  const handleChange = (event: any) => {
    const selected = event.target.value;
    if (Array.isArray(selected)) {
      if (selected.length <= maxSelections) {
        onChange(selected.length > 0 ? selected : []); // Ensures array format
      }
    }
  };

  return (
    <FormControl
      fullWidth
      error={selectedValues.length > maxSelections}
      disabled={
        enumOptions.length === 0 ||
        (enumOptions.length === 1 && enumOptions[0]?.value === 'Select')
      }
    >
      <InputLabel>{label}</InputLabel>
      <Select
        id={id}
        multiple
        value={selectedValues} // Ensures it's always an array
        onChange={handleChange}
        renderValue={(selected) =>
          enumOptions
            .filter((option) => selected.includes(option.value))
            .map((option) => option.label)
            .join(', ')
        }
      >
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
