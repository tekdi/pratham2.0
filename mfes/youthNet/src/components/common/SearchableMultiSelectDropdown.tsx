import React, { useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { SearchableMultiSelectDropdownProps } from '../../utils/Interface';
import { getThinScrollbarSx } from '../../utils/scrollbarSx';

// Generic "LABEL   summary ▾" filter pill that opens a popover with a search box + checkbox
// list — for multi-select filters where the option list can be long enough that a plain
// scrolling dropdown (like `MultiFilterPill`) isn't fast to navigate. Reusable anywhere a
// searchable multi-select is needed, not just the Courses List.
const SearchableMultiSelectDropdown: React.FC<SearchableMultiSelectDropdownProps> = ({
  label,
  values,
  allLabel,
  options,
  onChange,
  searchPlaceholder,
  noResultsLabel,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const open = Boolean(anchorEl);
  const isActive = values.length > 0 || open;

  const filteredOptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return options;
    return options.filter((option) => option.label.toLowerCase().includes(query));
  }, [options, searchTerm]);

  const summaryLabel =
    values.length === 0
      ? allLabel
      : values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? values[0]
      : t('MANAGER_OVERVIEW.SELECTED_COUNT', { count: values.length });

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => {
    setAnchorEl(null);
    setSearchTerm('');
  };

  const toggleValue = (value: string) => {
    onChange(values.includes(value) ? values.filter((v) => v !== value) : [...values, value]);
  };

  return (
    <>
      <Box
        onClick={handleOpen}
        role="button"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.75,
          py: 0.75,
          borderRadius: '7px',
          backgroundColor: isActive ? '#FFA00026' : 'white',
          border: `1px solid ${isActive ? theme.palette.dashboardStatus.inProgress : theme.palette.warning['700']}`,
          cursor: 'pointer',
          outline: 'none',
          '&:hover': { borderColor: theme.palette.dashboardStatus.inProgress },
        }}
      >
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
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {summaryLabel}
        </Typography>
        <ExpandMoreIcon
          sx={{ fontSize: '18px', color: theme.palette.text.secondary }}
        />
      </Box>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { width: 280, borderRadius: 2, mt: 0.5 } }}
      >
        <Box
          sx={{
            p: 1.25,
            borderBottom: `1px solid ${theme.palette.warning['800']}`,
          }}
        >
          <TextField
            size="small"
            fullWidth
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder ?? t('COMMON.SEARCH')}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon
                    fontSize="small"
                    sx={{ color: theme.palette.text.secondary }}
                  />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <List dense sx={{ maxHeight: 280, overflowY: 'auto', p: 1, ...getThinScrollbarSx(theme) }}>
          {filteredOptions.length === 0 ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ px: 2, py: 1.5, fontSize: '13px' }}
            >
              {noResultsLabel ?? t('COMMON.NO_RESULTS_FOUND')}
            </Typography>
          ) : (
            filteredOptions.map((option) => (
              <ListItemButton
                key={option.value}
                dense
                onClick={() => toggleValue(option.value)}
                sx={{
                  py: 0.75,
                  px: 1,
                  borderRadius: '8px',
                  '& span': {
                    mb: 0,
                    fontSize: '16px',
                  },
                }}
              >
                <Checkbox
                  size="small"
                  checked={values.includes(option.value)}
                  sx={{
                    p: 0.5,
                    mr: 1,
                    color: theme.palette.warning['600'],
                    '&.Mui-checked': { color: theme.palette.primary.main },
                  }}
                />
                <ListItemText
                  primaryTypographyProps={{ fontSize: '13px', fontWeight: 500 }}
                >
                  {option.label}
                </ListItemText>
              </ListItemButton>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default SearchableMultiSelectDropdown;
