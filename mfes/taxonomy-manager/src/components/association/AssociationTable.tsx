import React, { useState } from 'react';
import { Chip, Box, Typography, IconButton, Checkbox } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SortableDataTable, { ColumnDefinition } from '../SortableDataTable';
import type { Term } from '../../interfaces/TermInterface';
import type { Category } from '../../interfaces/CategoryInterface';
import type { Association } from '../../interfaces/AssociationInterface';

interface AssociationTableProps {
  associations: (Term & { categoryCode?: string; categoryName?: string })[];
  categories: Category[];
  onChipClick: (
    term: Term,
    assocCategory: Category | undefined,
    assocTerms: Association[]
  ) => void;
  title?: string;
  // New props for selection
  selectedIds?: string[];
  onSelectRow?: (id: string) => void;
  onSelectAll?: (checked: boolean) => void;
  showSelection?: boolean;
  // New props for actions
  showEditAction?: boolean;
  showDeleteAction?: boolean;
  onEdit?: (
    term: Term & { categoryCode?: string; categoryName?: string }
  ) => void;
  onDelete?: (
    term: Term & { categoryCode?: string; categoryName?: string }
  ) => void;
}

const AssociationTable: React.FC<AssociationTableProps> = ({
  associations,
  categories,
  onChipClick,
  title,
  selectedIds = [],
  onSelectRow,
  onSelectAll,
  showSelection = false,
  showEditAction = false,
  showDeleteAction = false,
  onEdit,
  onDelete,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const allSelected =
    associations.length > 0 &&
    associations.every((term) => selectedIds.includes(term.identifier));
  const someSelected =
    associations.some((term) => selectedIds.includes(term.identifier)) &&
    !allSelected;

  // Define columns for the association table
  const columns: ColumnDefinition<
    Term & { categoryCode?: string; categoryName?: string }
  >[] = [
    // Selection column (conditionally added)
    ...(showSelection
      ? [
          {
            key: 'selection' as keyof (Term & {
              categoryCode?: string;
              categoryName?: string;
            }),
            label: '',
            sortable: false,
            render: (
              value: unknown,
              row: Term & { categoryCode?: string; categoryName?: string }
            ) => (
              <Checkbox
                checked={selectedIds.includes(row.identifier)}
                onChange={() => onSelectRow?.(row.identifier)}
                aria-label={`select association ${row.name}`}
              />
            ),
          },
        ]
      : []),

    // Category column
    {
      key: 'categoryCode',
      label: 'Category',
      sortable: true,
      render: (
        value: unknown,
        row: Term & { categoryCode?: string; categoryName?: string }
      ) => {
        const termCategoryCode = row.category || row.categoryCode;
        const termCategory = categories.find(
          (cat) => cat.code === termCategoryCode
        );
        return termCategory ? termCategory.name : termCategoryCode || 'Unknown';
      },
    },

    // Term column
    {
      key: 'name',
      label: 'Term',
      sortable: true,
      render: (value: unknown, row: Term) => (
        <Box sx={{ fontWeight: 500 }}>{row.name}</Box>
      ),
    },

    // Association column
    {
      key: 'associations',
      label: 'Association',
      sortable: false,
      render: (
        value: unknown,
        row: Term & { categoryCode?: string; categoryName?: string }
      ) => {
        // Group associations by category
        const grouped = (row.associations ?? []).reduce((acc, assoc) => {
          if (!acc[assoc.category]) acc[assoc.category] = [];
          acc[assoc.category].push(assoc);
          return acc;
        }, {} as Record<string, Association[]>);

        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.entries(grouped).map(([catCode, assocs]) => {
              const assocCategory = categories.find(
                (cat) => cat.code === catCode
              );
              return (
                <Chip
                  key={catCode}
                  label={assocCategory?.name || catCode}
                  onClick={() => onChipClick(row, assocCategory, assocs)}
                  sx={{
                    cursor: 'pointer',
                    fontWeight: 500,
                    backgroundColor: 'transparent',
                    color: 'primary.contrastText',
                    border: '1px solid',
                    borderColor: 'primary.contrastText',
                    fontSize: '12px',
                    height: '28px',
                    '&:hover': {
                      backgroundColor: 'rgba(253, 190, 22, 0.08)',
                      borderColor: 'primary.dark',
                      color: 'primary.dark',
                    },
                    mb: 0.5,
                  }}
                  tabIndex={0}
                  aria-label={`Show associations for ${
                    assocCategory?.name || catCode
                  }`}
                />
              );
            })}
          </Box>
        );
      },
    },

    // Actions column (conditionally added)
    ...(showEditAction || showDeleteAction
      ? [
          {
            key: 'actions' as keyof (Term & {
              categoryCode?: string;
              categoryName?: string;
            }),
            label: 'Actions',
            sortable: false,
            render: (
              value: unknown,
              row: Term & { categoryCode?: string; categoryName?: string }
            ) => (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {showEditAction && (
                  <IconButton
                    aria-label="edit"
                    size="small"
                    onClick={() => onEdit?.(row)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
                {showDeleteAction && (
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => onDelete?.(row)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {title && (
          <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
        )}
        {showSelection && associations.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Checkbox
              indeterminate={someSelected}
              checked={allSelected}
              onChange={(e) => onSelectAll?.(e.target.checked)}
              aria-label="select all associations"
              size="small"
            />
            <Typography variant="caption" sx={{ ml: 1 }}>
              Select All
            </Typography>
          </Box>
        )}
        <IconButton
          size="small"
          onClick={() => setCollapsed((prev) => !prev)}
          aria-label={collapsed ? 'Expand' : 'Collapse'}
          sx={{
            backgroundColor: 'rgba(0,0,0,0.04)',
            borderRadius: 1,
            transition: 'background 0.2s',
            ':hover': {
              backgroundColor: 'rgba(0,0,0,0.10)',
            },
          }}
        >
          {collapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </IconButton>
      </Box>
      {!collapsed && (
        <SortableDataTable<
          Term & { categoryCode?: string; categoryName?: string }
        >
          data={associations}
          columns={columns}
          searchable={true}
          searchPlaceholder="Search associations..."
          searchableFields={['name', 'categoryCode', 'categoryName']}
          rowsPerPage={10}
          emptyStateMessage="No associations available."
          getRowKey={(row) => row.identifier}
        />
      )}
    </Box>
  );
};

export default AssociationTable;
