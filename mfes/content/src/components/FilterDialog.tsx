import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { FilterForm } from '@shared-lib';
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
  filterValues: any;
}) => {
  const handleFilterChange = (data: any) => {
    onApply?.(data);
  };

  const [isModal, setIsModal] = useState(true);
  const [parentFormData, setParentFormData] = useState([]);
  const [parentStaticFormData, setParentStaticFormData] = useState([]);
  const [orginalFormData, setOrginalFormData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [instant, setInstant] = useState('');

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
          onApply={handleFilterChange}
          setParentFormData={setParentFormData}
          setParentStaticFormData={setParentStaticFormData}
          parentStaticFormData={parentStaticFormData}
          setOrginalFormData={setOrginalFormData}
          orginalFormData={orginalFormData}
          setIsDrawerOpen={setIsDrawerOpen}
        />
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(FilterDialog);
