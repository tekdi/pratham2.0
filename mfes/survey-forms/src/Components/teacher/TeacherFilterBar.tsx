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

export type StatusFilterValue = 'all' | 'completed' | 'inProgress' | 'notStarted';

const STATUS_FILTER_OPTIONS: { id: StatusFilterValue; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'completed', label: 'Completed' },
  { id: 'inProgress', label: 'In Progress' },
  { id: 'notStarted', label: 'Not Started' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

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
  showStatusFilter?: boolean;
  statusFilter?: StatusFilterValue;
  onStatusFilterChange?: (status: StatusFilterValue) => void;
  totalLabel?: string;
  showMonthFilter?: boolean;
  monthFilter?: string;
  onMonthFilterChange?: (month: string) => void;
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
  showStatusFilter = false,
  statusFilter = 'all',
  onStatusFilterChange,
  totalLabel,
  showMonthFilter = false,
  monthFilter = 'All',
  onMonthFilterChange,
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

      {showStatusFilter && onStatusFilterChange && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="teacher-status-label">Status</InputLabel>
          <Select
            labelId="teacher-status-label"
            label="Status"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilterValue)}
            sx={{ borderRadius: '8px' }}
          >
            {STATUS_FILTER_OPTIONS.map((o) => (
              <MenuItem key={o.id} value={o.id}>
                {o.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {showMonthFilter && onMonthFilterChange && (
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="teacher-month-label">Month</InputLabel>
          <Select
            labelId="teacher-month-label"
            label="Month"
            value={monthFilter}
            onChange={(e) => onMonthFilterChange(e.target.value as string)}
            sx={{ borderRadius: '8px' }}
          >
            <MenuItem value="All">All</MenuItem>
            {MONTHS.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
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
