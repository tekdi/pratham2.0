import React, { useMemo, useState } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import SortableDataTable from '../SortableDataTable';
import AssociationCategories from './AssociationCategories';
import type { CategoryCardProps } from '../../interfaces/CategoryInterface';
import type { ColumnDefinition } from '../SortableDataTable';
import { Association } from '../../interfaces/AssociationInterface';

// This component renders a card for a specific category.
// It displays the category name, description, and a sortable table of terms associated with that category.
// Each term shows its name, code, description, and associations.
// The associations are grouped by category and displayed as badges.
const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  groupAssociationsByCategory,
  getLiveTerms,
  grey,
  onBadgeClick,
}) => {
  // Local search state
  const [searchTerm, setSearchTerm] = useState('');

  // Get live terms for the category
  const liveTerms = useMemo(
    () => getLiveTerms(category),
    [category, getLiveTerms]
  );

  // Filter terms based on search
  const filteredTerms = useMemo(() => {
    if (!searchTerm.trim()) return liveTerms;

    const search = searchTerm.toLowerCase();
    return liveTerms.filter(
      (term) =>
        term?.name?.toLowerCase().includes(search) ||
        term?.code?.toLowerCase().includes(search) ||
        term?.description?.toLowerCase().includes(search)
    );
  }, [liveTerms, searchTerm]);

  // Define columns for the terms table
  const termColumns: ColumnDefinition[] = [
    {
      key: 'name',
      label: 'Terms',
      sortable: true,
      render: (value) => (
        <Typography sx={{ fontWeight: 500 }}>
          {(value as string) || 'Unnamed Term'}
        </Typography>
      ),
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (value) => (value as string) || '—',
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      render: (value) => (value as string) || '—',
    },
    {
      key: 'associations',
      label: 'Associations',
      sortable: false,
      render: (value, row: Record<string, unknown>) => {
        const associations = value as unknown[];
        if (!Array.isArray(associations) || associations.length === 0) {
          return <span style={{ color: grey[500] }}>No associations</span>;
        }

        const liveAssocs = associations.filter(
          (assoc: unknown) =>
            assoc &&
            typeof assoc === 'object' &&
            (assoc as { status?: string }).status === 'Live'
        );

        if (liveAssocs.length === 0) {
          return <span style={{ color: grey[500] }}>No associations</span>;
        }

        const categories = groupAssociationsByCategory(
          liveAssocs as Association[]
        );
        return (
          <AssociationCategories
            categories={categories}
            termName={row.name as string}
            categoryName={category.name}
            onBadgeClick={onBadgeClick}
          />
        );
      },
    },
  ];

  return (
    <Card sx={{ boxShadow: 2 }}>
      <CardHeader
        title={
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h3" fontWeight={600}>
                {category.name || 'Unnamed Category'}
              </Typography>
              {category.description && (
                <Typography color="text.secondary">
                  {category.description}
                </Typography>
              )}
            </Box>
            <TextField
              size="small"
              placeholder="Search Terms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ width: 300 }}
            />
          </Box>
        }
        sx={{
          bgcolor: grey[50],
          borderBottom: 1,
          borderColor: 'divider',
        }}
      />
      <CardContent>
        <SortableDataTable
          data={
            filteredTerms.filter((term) => term !== null) as unknown as Record<
              string,
              unknown
            >[]
          }
          columns={termColumns}
          searchable={false}
          rowsPerPage={5}
          emptyStateMessage="No terms available"
          getRowKey={(row: Record<string, unknown>) =>
            (row.identifier as string) || (row.code as string)
          }
        />
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
