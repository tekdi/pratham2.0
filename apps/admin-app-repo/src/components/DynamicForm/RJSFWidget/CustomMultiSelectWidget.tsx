import React from "react";
import { WidgetProps } from "@rjsf/utils";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";

const CustomMultiSelectWidget = ({ 
  id, 
  options, 
  value = [], 
  required, 
  label, 
  onChange, 
  schema 
}: WidgetProps) => {
  const { enumOptions = [] } = options;
  const maxSelections = schema.maxSelection || enumOptions.length; // Use schema-defined maxSelection

  const handleChange = (event: any) => {
    const selectedValues = event.target.value;
    if (selectedValues.length <= maxSelections) {
      onChange(selectedValues.length > 0 ? selectedValues : undefined);
    }
  };

  return (
    <FormControl fullWidth error={value.length > maxSelections}>
      <InputLabel>{label}</InputLabel>
      <Select
        id={id}
        multiple
        value={value}
        onChange={handleChange}
        renderValue={(selected) =>
          enumOptions
            .filter((option) => selected.includes(option.value))
            .map((option) => option.label)
            .join(", ")
        }
      >
        {enumOptions.map((option) => (
          <MenuItem 
            key={option.value} 
            value={option.value} 
            disabled={value.length >= maxSelections && !value.includes(option.value)}
          >
            <Checkbox checked={value.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>
      {value.length > maxSelections && (
        <FormHelperText>You can select up to {maxSelections} options</FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomMultiSelectWidget;
