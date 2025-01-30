import React from 'react';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

interface CustomSwitchProps {
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
}) => {
  return (
    <FormControlLabel
      control={
        <Switch checked={checked} onChange={onChange} disabled={disabled} />
      }
      label={label}
    />
  );
};

export default CustomSwitch;
