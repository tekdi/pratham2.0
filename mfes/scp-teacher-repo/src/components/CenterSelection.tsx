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
}

const CenterDropdown: React.FC<CenterDropdownProps> = ({
  cohortId,
  roleName,
  onChange,
}) => {
  const [centers, setCenters] = useState<any[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string>(
    cohortId || ''
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCenters = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        console.warn('No userId in localStorage');
        return;
      }

      try {
        const cohortList = await queryClient.fetchQuery({
          queryKey: [QueryKeys.MY_COHORTS, userId],
          queryFn: () => getCohortList(userId, { customField: 'true' }),
        });

        console.log('Fetched cohortList:', cohortList);

        if (Array.isArray(cohortList)) {
          const formatted = cohortList.map((center: any) => ({
            cohortId: center.cohortId || center.id,
            name: center.cohortName,
          }));
          setCenters(formatted);

          // Set default if no value passed
          if (!cohortId && formatted.length > 0) {
            setSelectedCenterId(formatted[0].cohortId);
            if (onChange) onChange(formatted[0].cohortId);
          }
        }
      } catch (error) {
        console.error('Error fetching centers:', error);
      }
    };

    fetchCenters();
  }, []);

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
        {centers.length === 0 ? (
          <MenuItem disabled>No centers found</MenuItem>
        ) : (
          centers.map((center) => (
            <MenuItem key={center.cohortId} value={center.cohortId}>
              {center.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default CenterDropdown;
