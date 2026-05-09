import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';

interface Option {
  id: string;
  label: string;
}

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  showSearch?: boolean;
  centersLoading?: boolean;
  centers?: Option[];
  centerId?: string;
  onCenterChange?: (centerId: string) => void;
  batches?: Option[];
  batchId?: string;
  onBatchChange?: (batchId: string) => void;
  totalLabel?: string;
}

const TeacherFilterBar: React.FC<Props> = ({
  search,
  onSearchChange,
  showSearch = false,
  centersLoading = false,
  centers,
  centerId,
  onCenterChange,
  batches,
  batchId,
  onBatchChange,
  totalLabel,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      {showSearch && (
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Learner name"
          sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
        />
      )}

      {onCenterChange && (
        centersLoading
          ? <Skeleton variant="rounded" width={200} height={40} />
          : <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="teacher-center-label">Center</InputLabel>
              <Select
                labelId="teacher-center-label"
                label="Center"
                value={centerId ?? ''}
                onChange={(e) => onCenterChange(e.target.value as string)}
                sx={{ borderRadius: '8px' }}
              >
                {(centers ?? []).map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
      )}

      {onBatchChange && (
        centersLoading
          ? <Skeleton variant="rounded" width={200} height={40} />
          : <FormControl size="small" sx={{ minWidth: 200 }} disabled={!centerId}>
              <InputLabel id="teacher-batch-label">Batch</InputLabel>
              <Select
                labelId="teacher-batch-label"
                label="Batch"
                value={batchId ?? ''}
                onChange={(e) => onBatchChange(e.target.value as string)}
                sx={{ borderRadius: '8px' }}
              >
                {(batches ?? []).map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
      )}

      {totalLabel && (
        <Typography variant="body2" sx={{ color: '#7C766F' }}>
          {totalLabel}
        </Typography>
      )}
    </Box>
  );
};

export default TeacherFilterBar;
