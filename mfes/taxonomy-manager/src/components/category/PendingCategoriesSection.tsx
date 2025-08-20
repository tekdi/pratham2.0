import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SortableDataTable, { ColumnDefinition } from '../SortableDataTable';

interface PendingCategoriesSectionProps {
  pendingCategories: {
    name: string;
    code: string;
    description: string;
  }[];
  onCreate: () => void;
  onDelete: (code: string) => void;
}

const PendingCategoriesSection: React.FC<PendingCategoriesSectionProps> = ({
  pendingCategories,
  onCreate,
  onDelete,
}) => {
  // Don't render anything if no pending categories
  if (!pendingCategories.length) return null;

  // Define columns for the pending categories table
  const pendingCategoryColumns: ColumnDefinition<{
    name: string;
    code: string;
    description: string;
  }>[] = [
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
      render: (value) => (value as string) || '—',
    },
    {
      key: 'code',
      label: 'Actions',
      sortable: false,
      render: (value, row) => (
        <IconButton
          size="small"
          onClick={() => onDelete(row.code)}
          aria-label="Delete category"
          color="error"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ];

  return (
    <Box mt={4}>
      <Typography
        variant="subtitle2"
        fontSize={16}
        fontWeight={600}
        mb={2}
        sx={{
          textTransform: 'uppercase',
          color: 'text.secondary',
          fontSize: 15,
        }}
      >
        Categories to be created
      </Typography>

      <SortableDataTable
        data={pendingCategories}
        columns={pendingCategoryColumns}
        searchable={true}
        searchPlaceholder="Search pending categories..."
        searchableFields={['name', 'code', 'description']}
        rowsPerPage={3}
        emptyStateMessage="No pending categories."
        getRowKey={(row) => row.code}
      />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, minWidth: 180 }}
        onClick={onCreate}
      >
        Create Categories
      </Button>
    </Box>
  );
};

export default PendingCategoriesSection;
