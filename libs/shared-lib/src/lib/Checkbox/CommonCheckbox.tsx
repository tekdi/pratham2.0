import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';

interface CommonCheckboxProps extends CheckboxProps {
  label: string;
  required?: boolean;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  checkboxes: CommonCheckboxProps[];
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    label: string
  ) => void;
  direction?: 'row' | 'column';
}

export const CommonCheckbox: React.FC<CheckboxGroupProps> = ({
  checkboxes,
  onChange,
  direction = 'column',
}) => {
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    label: string
  ) => {
    if (onChange) {
      onChange(event, checked, label);
    }
  };

  return (
    <FormGroup row={direction === 'row'} sx={{ gap: 2 }}>
      {checkboxes.map(({ label, required, disabled, ...props }, index) => (
        <FormControlLabel
          key={label}
          control={
            <Checkbox
              {...props}
              disabled={disabled}
              onChange={(event, checked) => handleChange(event, checked, label)}
            />
          }
          label={label}
          required={required}
        />
      ))}
    </FormGroup>
  );
};
