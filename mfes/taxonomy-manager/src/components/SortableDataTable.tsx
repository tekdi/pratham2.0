import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TableSortLabel from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import SearchBar from './SearchBar';
import { SxProps } from '@mui/material/styles';

export type SortOrder = 'asc' | 'desc';

export interface ColumnDefinition<T = Record<string, unknown>> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: T) => React.ReactNode;
}

export interface SortableDataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: ColumnDefinition<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchableFields?: (keyof T)[];
  searchBarSx?: SxProps;
  searchAutoFocus?: boolean;
  rowsPerPage?: number;
  emptyStateMessage?: string;
  getRowKey: (row: T) => string | number;
}

// Shared styles
const headerCellStyles = {
  fontWeight: 600,
  bgcolor: '#f5f7fa',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': { bgcolor: '#e8f4fd' },
  transition: 'background-color 0.2s ease',
};

const nonSortableHeaderCellStyles = {
  fontWeight: 600,
  bgcolor: '#f5f7fa',
};

const sortLabelStyles = {
  '& .MuiTableSortLabel-icon': { fontSize: '1rem' },
  '&:hover .MuiTableSortLabel-icon': { opacity: 1 },
};

// Reusable sortable header cell component
const SortableHeaderCell = <T,>({
  column,
  sortColumn,
  sortOrder,
  onSort,
}: {
  column: ColumnDefinition<T>;
  sortColumn: string | null;
  sortOrder: SortOrder;
  onSort: (column: string) => void;
}) => (
  <TableCell
    sx={
      column.sortable !== false ? headerCellStyles : nonSortableHeaderCellStyles
    }
  >
    {column.sortable !== false ? (
      <TableSortLabel
        active={sortColumn === column.key}
        direction={sortColumn === column.key ? sortOrder : 'asc'}
        onClick={() => onSort(column.key as string)}
        sx={{
          ...sortLabelStyles,
          '& .MuiTableSortLabel-icon': {
            ...sortLabelStyles['& .MuiTableSortLabel-icon'],
            opacity: sortColumn === column.key ? 1 : 0.5,
          },
        }}
      >
        {column.label}
      </TableSortLabel>
    ) : (
      column.label
    )}
  </TableCell>
);

// Generic reusable sortable data table component
function SortableDataTable<T = Record<string, unknown>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchableFields,
  searchBarSx,
  searchAutoFocus = false,
  rowsPerPage = 5,
  emptyStateMessage = 'No data found.',
  getRowKey,
}: Readonly<SortableDataTableProps<T>>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
    setPage(0);
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  // Handle page change
  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Process data (filter and sort)
  const processedData = useMemo(() => {
    let result = data;

    // Apply search filter
    if (searchable && searchTerm.trim()) {
      const fieldsToSearch = searchableFields || columns.map((col) => col.key);
      result = data.filter((item) =>
        fieldsToSearch.some((field) => {
          const value = item[field];
          return (
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );
        })
      );
    }

    // Apply sorting
    if (sortColumn) {
      result = [...result].sort((a, b) => {
        const aVal = (a[sortColumn as keyof T] || '').toString().toLowerCase();
        const bVal = (b[sortColumn as keyof T] || '').toString().toLowerCase();
        const result = aVal.localeCompare(bVal);
        return sortOrder === 'asc' ? result : -result;
      });
    }

    return result;
  }, [
    data,
    searchTerm,
    sortColumn,
    sortOrder,
    searchable,
    searchableFields,
    columns,
  ]);

  // Get current page data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  return (
    <Box>
      {/* Search Bar */}
      {searchable && (
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder}
          autoFocus={searchAutoFocus}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': { borderRadius: 2 },
            ...searchBarSx,
          }}
        />
      )}

      {/* Table or Empty State */}
      {processedData.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 200,
            color: 'text.secondary',
            border: '1px solid #eee',
            borderRadius: 2,
            background: '#fafbfc',
            py: 4,
          }}
        >
          <Typography variant="body2">
            {searchTerm.trim()
              ? `No results found matching "${searchTerm}"`
              : emptyStateMessage}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid #ddd',
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <TableContainer component={Box}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <SortableHeaderCell
                      key={column.key as string}
                      column={column}
                      sortColumn={sortColumn}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={getRowKey(row)} hover>
                    {columns.map((column) => (
                      <TableCell key={column.key as string}>
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || '—')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={processedData.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            sx={{
              borderTop: '1px solid #e0e0e0',
              bgcolor: '#f5f7fa',
            }}
          />
        </Box>
      )}
    </Box>
  );
}

export default SortableDataTable;
