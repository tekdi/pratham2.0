import { MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface DropdownProps {
  name?: string;
  values?: any[];
  onSelect: (value: string) => void;
  defaultValue?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  name,
  values = [],
  onSelect,
  defaultValue = '',
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const handleChange = (event: any) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value);
  };
  useEffect(() => {
      setSelectedValue(defaultValue);
  }, [defaultValue,]);
  return (
    <FormControl fullWidth>
      <InputLabel>{name}</InputLabel>
      <Select
        value={selectedValue}
        label={name}
        onChange={handleChange}
        IconComponent={KeyboardArrowDownIcon}
      >
        {values.map((user) => (
          <MenuItem key={user.userId} value={user.userId}>
            {user.firstName} {user.lastName}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
