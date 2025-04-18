import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { FilterForm } from '@shared-lib';
import React from 'react';

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
  const handleFilterChange = (data: any) => {
    onApply?.(data);
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
        <FilterForm
          _formControl={{ sx: { width: '100%' } }}
          filterValues={filterValues?.filters || {}}
          onApply={handleFilterChange}
          filter={filter}
          language={language}
          selectedSubjects={selectedSubjects}
          selectedContentTypes={selectedContentTypes}
          sort={sort}
          onLanguageChange={onLanguageChange}
          onSubjectsChange={onSubjectsChange}
          onContentTypeChange={onContentTypeChange}
          onSortChange={onSortChange}
          frameworkFilter={frameworkFilter}
        />
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(FilterDialog);
