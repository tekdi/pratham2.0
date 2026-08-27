import React from 'react';
import { MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FilterPillProps } from '../../../utils/Interface';
import { getThinScrollbarSx } from '../../../utils/scrollbarSx';

// Reusable "LABEL   Selected value ▾" pill control used by every Courses List filter, matching
// the rounded, bordered filter-pill style in the design reference. Built on a plain MUI Select
// (via renderValue) so keyboard/a11y behavior comes for free — no bespoke dropdown widget.
const FilterPill: React.FC<FilterPillProps> = ({ label, value, allLabel, options, onChange }) => {
  const theme = useTheme<any>();
  const isActive = Boolean(value);

  return (
    <Select
      size="small"
      displayEmpty
      value={value}
      onChange={(e) => onChange(e.target.value)}
      MenuProps={{
        PaperProps: { sx: { maxHeight: 300, ...getThinScrollbarSx(theme) } },
      }}
      renderValue={(selected) => {
        const selectedLabel =
          options.find((o) => o.value === selected)?.label || allLabel;
        return (
          <Stack direction="row" spacing={0.75} alignItems="center">
            <Typography
              variant="caption"
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: isActive ? '#9a6a12' : theme.palette.text.secondary,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontSize: '13px',
                fontWeight: 600,
                mb: 0,
                color: isActive ? '#633806' : theme.palette.text.primary,
                whiteSpace: 'nowrap',
              }}
            >
              {selectedLabel}
            </Typography>
          </Stack>
        );
      }}
      sx={{
        borderRadius: '7px',
        backgroundColor: isActive ? '#FFA00026' : 'white',
        '& .MuiSelect-select': { py: 0.75, pl: 1.75, pr: '32px !important' },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: `${
            isActive ? theme.palette.dashboardStatus.inProgress : theme.palette.warning['700']
          } !important`,
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: `${theme.palette.dashboardStatus.inProgress} !important`,
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: `${theme.palette.dashboardStatus.inProgress} !important`,
          borderWidth: '1px !important',
        },
        '& .MuiSvgIcon-root': {
          fontSize: '18px',
          color: theme.palette.text.secondary,
        },
      }}
    >
      <MenuItem value="">{allLabel}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default FilterPill;
