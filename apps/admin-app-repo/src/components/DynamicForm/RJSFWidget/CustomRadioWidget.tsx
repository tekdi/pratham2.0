// @ts-nocheck
import React from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';

const CustomRadioWidget = ({
  id,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  onChange,
  rawErrors = [],
}: WidgetProps) => {
  const { enumOptions = [] } = options;

  return (
    <FormControl
      component="fieldset"
      required={required}
      error={rawErrors.length > 0}
      fullWidth
    >
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <RadioGroup
        row
        id={id}
        name={id}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        {enumOptions.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
            disabled={disabled || readonly}
          />
        ))}
      </RadioGroup>
      {rawErrors.length > 0 && (
        <FormHelperText>{rawErrors[0]}</FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomRadioWidget;
