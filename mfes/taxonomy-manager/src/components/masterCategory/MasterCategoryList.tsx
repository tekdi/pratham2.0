import React from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import SortableDataTable, { ColumnDefinition } from '../SortableDataTable';
import {
  MasterCategoryListProps,
  MasterCategory,
} from '../../interfaces/MasterCategoryInterface';

// Define columns for the master category table
const masterCategoryColumns: ColumnDefinition<MasterCategory>[] = [
  {
    key: 'name',
    label: 'Name',
    sortable: true,
  },
  {
    key: 'code',
    label: 'Code',
    sortable: true,
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (value): React.ReactNode => (value as string) || '—',
  },
];

// This component renders a paginated table of master categories with search and sorting functionality.
const MasterCategoryList: React.FC<MasterCategoryListProps> = ({
  categories,
  loading,
  error,
}) => {
  if (loading) {
    return (
      <Box textAlign="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ textAlign: 'center', py: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <SortableDataTable
      data={categories}
      columns={masterCategoryColumns}
      searchable={true}
      searchPlaceholder="Search master categories by name, code, or description..."
      searchableFields={['name', 'code', 'description']}
      rowsPerPage={5}
      emptyStateMessage="No master categories found."
      getRowKey={(category) => category.identifier}
    />
  );
};

export default MasterCategoryList;
