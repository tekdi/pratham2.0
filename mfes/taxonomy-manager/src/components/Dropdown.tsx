import React from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DropdownProps, DropdownOption } from '../interfaces/BaseInterface';

// This component renders an autocomplete input with a label, options, and helper text.
// It accepts props for label, value, onChange handler, options array, required and disabled states, and additional select properties.
const Dropdown: React.FC<DropdownProps> = ({
  label,
  value,
  onChange,
  options,
  required = false,
  disabled = false,
  helperText,
}) => {
  // Find the selected option object
  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Separate the __create__ option for custom logic
  const createOption = options.find((opt) => opt.value === '__create__');

  // Custom filter: if no match, show only the __create__ option if present
  function filterOptions(
    opts: DropdownOption[],
    { inputValue }: { inputValue: string }
  ) {
    const filtered = opts.filter(
      (opt) =>
        opt.value !== '__create__' &&
        (opt.label.toLowerCase().includes(inputValue.toLowerCase()) ||
          opt.value.toLowerCase().includes(inputValue.toLowerCase()))
    );
    if (filtered.length === 0 && createOption) {
      return [createOption];
    }
    return filtered.concat(createOption ? [createOption] : []);
  }

  return (
    <Box mb={2}>
      <Autocomplete
        options={options}
        value={selectedOption}
        onChange={(_e, newValue) => {
          if (newValue) onChange(newValue.value);
        }}
        getOptionLabel={(opt) => (typeof opt === 'string' ? opt : opt.label)}
        isOptionEqualToValue={(opt, val) => opt.value === val.value}
        filterOptions={filterOptions}
        disabled={disabled}
        fullWidth
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            required={required}
            variant="outlined"
            sx={{
              mb: 0.5,
              borderRadius: 1,
              minHeight: 56,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(248, 239, 231, 0.5)',
                borderRadius: 1,
              },
            }}
            helperText={helperText}
            inputProps={{ ...params.inputProps, 'aria-label': label }}
          />
        )}
        renderOption={(props, option) =>
          option.value === '__create__' ? (
            <li {...props} key={option.value} style={{ padding: 0 }}>
              <Box
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  borderRadius: 1,
                  p: 1.5,
                  mx: 1,
                  textAlign: 'center',
                  width: '100%',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {option.label}
              </Box>
            </li>
          ) : (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )
        }
        noOptionsText={createOption ? null : 'No options'}
      />
    </Box>
  );
};

export default Dropdown;
