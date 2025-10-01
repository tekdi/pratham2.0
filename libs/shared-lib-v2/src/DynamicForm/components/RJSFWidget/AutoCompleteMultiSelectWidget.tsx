// @ts-nocheck
import React, { useEffect, useState, useMemo } from 'react';
import { WidgetProps } from '@rjsf/utils';
import {
  Autocomplete,
  TextField,
  Chip,
  Checkbox,
  FormControl,
  FormHelperText,
  InputLabel,
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useTranslation } from 'libs/shared-lib-v2/src/lib/context/LanguageContext';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const AutoCompleteMultiSelectWidget = ({
  id,
  options,
  value = [],
  required,
  label,
  onChange,
  schema,
  uiSchema,
  rawErrors = [],
}: WidgetProps) => {
  const { enumOptions = [] } = options;
  const maxSelections = schema.maxSelection || enumOptions.length;
  const { t } = useTranslation();

  const selectedValues = Array.isArray(value) ? value : [];
  const isDisabled = uiSchema?.['ui:disabled'] === true;

  // Convert enumOptions to the format expected by Autocomplete
  const optionsList = useMemo(() => {
    return enumOptions
      .filter((option) => option.value !== 'Select')
      .map((option) => ({
        value: option.value,
        label: t(`FORM.${option.label}`, { defaultValue: option.label }),
      }));
  }, [enumOptions, t]);

  // Get selected options based on current values
  const selectedOptions = useMemo(() => {
    return optionsList.filter((option) =>
      selectedValues.includes(option.value)
    );
  }, [optionsList, selectedValues]);

  // Filter options based on search input
  const [inputValue, setInputValue] = useState('');

  const filteredOptions = useMemo(() => {
    if (!inputValue) return optionsList;

    return optionsList.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [optionsList, inputValue]);

  const handleChange = (event: any, newValue: any) => {
    if (Array.isArray(newValue)) {
      // Limit selections based on maxSelections
      const limitedValue = newValue.slice(0, maxSelections);
      const values = limitedValue.map((option) => option.value);
      onChange(values.length > 0 ? values : []);
    } else {
      onChange([]);
    }
  };

  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
  };

  // Select All functionality
  const handleSelectAll = () => {
    if (selectedValues.length === optionsList.length) {
      onChange([]);
    } else {
      const allValues = optionsList.map((option) => option.value);
      onChange(allValues.slice(0, maxSelections));
    }
  };

  const isAllSelected = selectedValues.length === optionsList.length;

  return (
    <FormControl
      fullWidth
      error={rawErrors.length > 0}
      required={required}
      disabled={isDisabled}
    >
      <Autocomplete
        id={id}
        multiple
        options={filteredOptions}
        value={selectedOptions}
        onChange={handleChange}
        onInputChange={handleInputChange}
        inputValue={inputValue}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        disabled={isDisabled}
        disableCloseOnSelect
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option.label}
              {...getTagProps({ index })}
              key={option.value}
            />
          ))
        }
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.value}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={
              selectedOptions.length === 0
                ? `Type to search ${label?.toLowerCase() || 'options'}...`
                : ''
            }
            error={rawErrors.length > 0}
            helperText={
              rawErrors.length > 0
                ? rawErrors[0]
                : maxSelections < enumOptions.length
                ? `Select up to ${maxSelections} options`
                : undefined
            }
          />
        )}
        ListboxProps={{
          style: {
            maxHeight: '300px',
          },
        }}
        // Add Select All option at the top
        ListboxComponent={(props) => (
          <div {...props}>
            {optionsList.length > 1 && maxSelections >= optionsList.length && (
              <div
                style={{
                  padding: '8px 16px',
                  borderBottom: '1px solid #e0e0e0',
                  cursor: 'pointer',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={handleSelectAll}
              >
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={isAllSelected}
                />
                {isAllSelected ? 'Deselect All' : 'Select All'}
              </div>
            )}
            {props.children}
          </div>
        )}
        // Disable options when max selections reached
        getOptionDisabled={(option) =>
          selectedValues.length >= maxSelections &&
          !selectedValues.includes(option.value)
        }
      />
    </FormControl>
  );
};

export default AutoCompleteMultiSelectWidget;
