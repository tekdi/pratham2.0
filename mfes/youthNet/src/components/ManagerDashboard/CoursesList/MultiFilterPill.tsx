import React from 'react';
import { Checkbox, ListItemText, MenuItem, Select, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { MultiFilterPillProps } from '../../../utils/Interface';
import { getThinScrollbarSx } from '../../../utils/scrollbarSx';

// Multi-select sibling of `FilterPill` — same rounded "LABEL   summary ▾" pill shell, but backed
// by a checkbox list so more than one course name can be selected at once.
const MultiFilterPill: React.FC<MultiFilterPillProps> = ({ label, values, allLabel, options, onChange }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  const summaryLabel =
    values.length === 0
      ? allLabel
      : values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? values[0]
      : t('MANAGER_OVERVIEW.SELECTED_COUNT', { count: values.length });

  return (
    <Select
      size="small"
      displayEmpty
      multiple
      value={values}
      onChange={(e) => {
        const next = e.target.value;
        onChange(typeof next === 'string' ? next.split(',') : next);
      }}
      MenuProps={{ PaperProps: { sx: { maxHeight: 300, ...getThinScrollbarSx(theme) } } }}
      renderValue={() => (
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Typography
            variant="caption"
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.05em',
              color: theme.palette.text.secondary,
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
              color: theme.palette.text.primary,
              whiteSpace: 'nowrap',
              maxWidth: 160,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {summaryLabel}
          </Typography>
        </Stack>
      )}
      sx={{
        borderRadius: '7px',
        backgroundColor: 'white',
        '& .MuiSelect-select': { py: 0.75, pl: 1.75, pr: '32px !important' },
        '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.warning['700'] },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.warning['600'] },
        '& .MuiSvgIcon-root': { fontSize: '18px', color: theme.palette.text.secondary },
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} dense>
          <Checkbox size="small" checked={values.includes(option.value)} sx={{ p: 0.5, mr: 1 }} />
          <ListItemText primaryTypographyProps={{ fontSize: '13px' }}>{option.label}</ListItemText>
        </MenuItem>
      ))}
    </Select>
  );
};

export default MultiFilterPill;
