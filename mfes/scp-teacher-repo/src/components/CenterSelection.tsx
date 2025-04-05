import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import {getCentersByBlockId} from '@/services/CohortServices'

interface CenterDropdownProps {
  blockId: string;
  cohortId?: string;
  roleName?: string;
  onChange?: (value: string) => void;
}

const CenterDropdown: React.FC<CenterDropdownProps> = ({ blockId, cohortId, roleName, onChange }) => {
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>(cohortId || '');

  useEffect(() => {
    if (blockId) {
        getCentersByBlockId(blockId).then((res) => {
            console.log("res ===>", res);
        setCenters(res);
      });
    } else {
      setCenters([]);
    }
  }, [blockId]);

  const handleChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value;
    setSelectedCenterId(value);
    if (onChange) onChange(value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="center-dropdown-label">Center</InputLabel>
      <Select
        labelId="center-dropdown-label"
        value={selectedCenterId}
        onChange={handleChange}
        label="Center"
      >
        {centers.map((center) => (
          <MenuItem key={center.cohortId} value={center.cohortId}>
            {center.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CenterDropdown;