import React from 'react';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { FilterPopoverProps } from '../interfaces/BaseInterface';

// This component renders a popover for filtering items by status.
// It accepts props for anchor element, open state, close handler, selected status, status change handler, status options, and filter title.
// The popover displays a list of checkboxes for each status option, allowing users to select multiple statuses to filter the items displayed in the parent component.
const FilterPopover: React.FC<FilterPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  selectedStatus,
  onStatusChange,
  statusOptions = ['Live', 'Draft'],
  filterTitle = 'Filter by Status',
}) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    slotProps={{
      paper: {
        sx: {
          p: 3,
          width: 240,
          borderRadius: '12px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid rgba(30, 27, 22, 0.1)',
        },
      },
    }}
  >
    <Typography
      variant="h3"
      fontWeight={600}
      mb={2}
      color="text.primary"
      sx={{ fontSize: '14px', lineHeight: '20px' }}
    >
      {filterTitle}
    </Typography>
    <Stack direction="column" spacing={1.5}>
      {statusOptions.map((status) => (
        <Box
          key={status}
          display="flex"
          alignItems="center"
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(253, 190, 22, 0.05)',
              borderRadius: '6px',
              padding: '4px 0',
            },
          }}
        >
          <Checkbox
            checked={selectedStatus.includes(status)}
            onChange={() => onStatusChange(status)}
            size="small"
            sx={{
              color: 'text.secondary',
              '&.Mui-checked': {
                color: 'primary.main',
              },
              '&:hover': {
                backgroundColor: 'rgba(253, 190, 22, 0.1)',
              },
              marginRight: 1,
            }}
          />
          <Typography
            variant="body2"
            color="text.primary"
            sx={{
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: '20px',
            }}
          >
            {status}
          </Typography>
        </Box>
      ))}
    </Stack>
  </Popover>
);

export default FilterPopover;
