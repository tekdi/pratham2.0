import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SortableDataTable, { ColumnDefinition } from '../SortableDataTable';

interface PendingTermsSectionProps {
  pendingTerms: {
    name: string;
    code: string;
    description: string;
    label: string;
    categoryCode: string;
  }[];
  onCreate: () => void;
  onDelete: (code: string) => void;
}

const PendingTermsSection: React.FC<PendingTermsSectionProps> = ({
  pendingTerms,
  onCreate,
  onDelete,
}) => {
  // Don't render anything if no pending terms
  if (!pendingTerms.length) return null;

  // Define columns for the pending terms table
  const pendingTermColumns: ColumnDefinition<{
    name: string;
    code: string;
    description: string;
    label: string;
    categoryCode: string;
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
      key: 'label',
      label: 'Label',
      sortable: true,
    },
    {
      key: 'categoryCode',
      label: 'Category',
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
          aria-label="Delete term"
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
        Terms to be created
      </Typography>

      <SortableDataTable
        data={pendingTerms}
        columns={pendingTermColumns}
        searchable={true}
        searchPlaceholder="Search pending terms..."
        searchableFields={[
          'name',
          'code',
          'description',
          'label',
          'categoryCode',
        ]}
        rowsPerPage={3}
        emptyStateMessage="No pending terms."
        getRowKey={(row) => row.code}
      />

      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: 180 }}
          onClick={onCreate}
        >
          Create Terms
        </Button>
      </Box>
    </Box>
  );
};

export default PendingTermsSection;
