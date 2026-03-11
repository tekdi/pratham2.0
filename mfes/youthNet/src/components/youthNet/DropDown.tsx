import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { toPascalCase } from '@/utils/Helper';

interface DropdownProps {
  name?: string;
  label?: string;
  values?: any[];
  onSelect: (value: string) => void;
  defaultValue?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  values = [],
  onSelect,
  defaultValue = '',
  disabled = false,
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value);
  };

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  return (
    <FormControl fullWidth>
      <InputLabel>{label || name}</InputLabel>
      <Select
        value={selectedValue}
        label={label || name}
        onChange={handleChange}
        disabled={disabled}
        IconComponent={KeyboardArrowDownIcon}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 200, 
            },
          },
        }}
      >
        {values.map((item: any) => (
          <MenuItem key={item.id} value={item.id}>
            {toPascalCase(item.name)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
