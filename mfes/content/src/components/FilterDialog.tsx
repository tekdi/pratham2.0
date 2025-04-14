import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';

const FilterDialog = ({
  open,
  onClose,
  filter,
  language,
  selectedSubjects,
  selectedContentTypes,
  sort,
  onLanguageChange,
  onSubjectsChange,
  onContentTypeChange,
  onSortChange,
  onApply,
  frameworkFilter,
  filterValues,
}: {
  open: boolean;
  onClose: () => void;
  filter?: {
    sort?: boolean;
    language?: string[];
    subject?: string[];
    contentType?: string[];
  };
  language?: string;
  selectedSubjects?: string[];
  selectedContentTypes?: string[];
  sort?: any;
  onLanguageChange?: (language: string) => void;
  onSubjectsChange?: (subjects: string[]) => void;
  onContentTypeChange?: (contentType: string[]) => void;
  onSortChange?: (sort: any) => void;
  onApply?: (data: any) => void;
  frameworkFilter: any;
  filterValues: any;
}) => {
  // Manage the selected values for each category
  const [selectedValues, setSelectedValues] = useState(filterValues ?? {}); // Initialize as an empty object

  const handleChange = (event: any, filterCode: any) => {
    const { value } = event.target;
    setSelectedValues((prev: any) => ({
      ...prev,
      [filterCode]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  return (
    <Dialog
      fullWidth
      open={open}
      sx={{
        borderRadius: '16px',
        '& .MuiDialog-paper': { backgroundColor: '#FEF7FF' },
      }}
      onClose={onClose}
    >
      <DialogTitle>Filters</DialogTitle>
      <IconButton
        sx={(theme) => ({
          position: 'absolute',
          top: 8,
          right: 8,
          color: theme.palette.grey[500],
        })}
        onClick={onClose}
        aria-label="close"
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* new filter frameworkFilter */}
          <FrameworkFilterComponent
            frameworkFilter={frameworkFilter}
            selectedValues={selectedValues}
            handleChange={handleChange}
          />
        </Box>
        <Divider sx={{ marginTop: 4 }} />
        {/* <FormControl fullWidth>
            <InputLabel id="multi-checkbox-label">Select Options</InputLabel>
            <Select
              multiple
              value={selectedOptions}
              renderValue={(selected) => selected.join(', ')} // Display selected options
              onChange={handleChange}
              labelId="multi-checkbox-label"
            >
              {options.map((option) => (
                <MenuItem value={option} key={option} >
                  <Checkbox checked={selectedOptions.indexOf(option) > -1} />
                  <ListItemText primary={option} />
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}
        {/* Sort By */}
        {filter?.sort && (
          <>
            <Typography sx={{ fontWeight: 700 }} variant="subtitle1">
              Sort By
            </Typography>
            <FormControl>
              <RadioGroup
                onChange={(e) => {
                  const value = e.target.value;
                  onSortChange?.(value);
                }}
                value={sort?.sortBy || 'asc'}
              >
                <FormControlLabel
                  value="asc"
                  label="A to Z"
                  control={<Radio />}
                />
                <FormControlLabel
                  value="desc"
                  label="Z to A"
                  control={<Radio />}
                />
              </RadioGroup>
            </FormControl>
          </>
        )}
        {/* Language */}
        {filter?.language && filter.language.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Language</InputLabel>
            <Select
              label="Language"
              onChange={(e) => onLanguageChange?.(e.target.value)}
              value={language}
            >
              {filter.language.map((lang) => (
                <MenuItem value={lang} key={lang}>
                  {lang}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Subject */}
        {filter?.subject && filter.subject.length > 0 && (
          <FormControl margin="normal" fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              multiple
              label="Subject"
              value={selectedSubjects || []}
              renderValue={(selected) => (selected as string[]).join(', ')} // Join array values for display
              onChange={(e) => {
                const value = e.target.value as string[];
                onSubjectsChange?.(value);
              }}
            >
              {filter.subject.map((subject) => (
                <MenuItem value={subject} key={subject}>
                  <Checkbox
                    checked={(selectedSubjects || []).indexOf(subject) > -1}
                  />
                  <ListItemText primary={subject} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Content Type */}
        {filter?.contentType && filter.contentType.length > 0 && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Content Type</InputLabel>
            <Select
              renderValue={(selected) => (selected as string[]).join(', ')}
              label="Content Type"
              multiple
              value={selectedContentTypes || []}
              onChange={(e) => {
                const value = e.target.value as string[];
                onContentTypeChange?.(value);
              }}
            >
              {filter.contentType.map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox
                    checked={(selectedContentTypes || []).indexOf(type) > -1}
                  />
                  <ListItemText primary={type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {/* Buttons */}
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Button
              sx={{
                borderRadius: '100px',
                color: '#6750A4',
                textTransform: 'none',
              }}
              onClick={() => {
                onApply?.({});
                setSelectedValues({});
                onClose();
              }}
              variant="outlined"
            >
              Clear All
            </Button>
            <Button
              variant="contained"
              sx={{
                borderRadius: '100px',
                bgcolor: '#6750A4',
                color: '#FFFFFF',
                marginLeft: 2,
                textTransform: 'none',
              }}
              onClick={() => {
                onApply?.(selectedValues);
                onClose();
              }}
            >
              Apply
            </Button>
          </Box>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(FilterDialog);

const RenderCategories = React.memo(
  ({ categories, selectedValues, handleChange }: any) => {
    const componentKey = `multi-checkbox-label_${categories?.identifier}`;
    const options = categories?.terms.map((term: any) => ({
      label: term.name,
      value: term.code,
    }));

    const currentSelectedValues =
      selectedValues[`se_${categories?.code}s`] || [];

    return (
      <FormControl
        fullWidth
        key={componentKey}
        sx={{
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1D1B20',
          },
          '&.Mui-focused': {
            color: '#1D1B20',
          },
          '& .MuiInputLabel-root': { color: '#1D1B20' },
          '& .MuiOutlinedInput-root': {
            color: '#1D1B20',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1D1B20',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1D1B20',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#1D1B20',
            },
          },
        }}
      >
        <InputLabel id={componentKey}>{categories?.name}</InputLabel>
        <Select
          multiple
          labelId={componentKey}
          input={<OutlinedInput label={categories?.name} />}
          value={currentSelectedValues}
          renderValue={(selected) =>
            (selected as string[])
              .map((selectedValue: any) => {
                const selectedOption = options.find(
                  (option: any) => option.value === selectedValue
                );
                return selectedOption ? selectedOption.label : '';
              })
              .join(', ')
          }
          onChange={(event) => handleChange(event, `se_${categories?.code}s`)}
        >
          {options.map((option: any) => (
            <MenuItem value={option.value} key={option.value}>
              <Checkbox
                sx={{
                  color: '#6750A4',
                  '&.Mui-checked': {
                    color: '#6750A4',
                  },
                }}
                checked={currentSelectedValues.includes(option.value)}
              />
              <ListItemText primary={option.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

RenderCategories.displayName = 'RenderCategories';

const FrameworkFilterComponent = ({
  frameworkFilter,
  selectedValues,
  handleChange,
}: any) => {
  return frameworkFilter?.categories?.map((categories: any) => {
    return (
      <RenderCategories
        key={categories?.identifier}
        categories={categories}
        selectedValues={selectedValues}
        handleChange={handleChange}
      />
    );
  });
};
