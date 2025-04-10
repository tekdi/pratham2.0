import React, { useEffect, useState } from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { getCohortList } from '@/services/CohortServices';
import { QueryKeys } from '@/utils/app.constant';
import { useQueryClient } from '@tanstack/react-query';

interface CenterDropdownProps {
  cohortId?: string;
  roleName?: string;
  onChange?: (value: string) => void;
  centerList?: any;
}

const CenterDropdown: React.FC<CenterDropdownProps> = ({
  cohortId,
  roleName,
  onChange,
  centerList,
}) => {
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>(
    cohortId || ''
  );
  const queryClient = useQueryClient();

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
        {centerList && centerList.length === 0 ? (
          <MenuItem disabled>No centers found</MenuItem>
        ) : (
          centerList?.map((center) => (
            <MenuItem key={center?.cohortId} value={center?.cohortId}>
              {center?.cohortName}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default CenterDropdown;
