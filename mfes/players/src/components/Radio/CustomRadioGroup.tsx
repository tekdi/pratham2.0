import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

interface CustomRadioGroupProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  options: { value: string; label: string }[];
}

const CustomRadioGroup: React.FC<CustomRadioGroupProps> = ({
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <>
      <FormLabel>{label}</FormLabel>
      <RadioGroup value={value} onChange={onChange}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </>
  );
};

export default CustomRadioGroup;
