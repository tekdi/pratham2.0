import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any) => React.ReactNode;
}

export interface RowData {
  [key: string]: any;
}

interface ActionItem {
  label: string;
  onClick: (row: RowData) => void;
  color?: 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: (row: RowData) => boolean;
}

interface DataTableProps {
  columns: Column[];
  rows: RowData[];
  showCheckbox?: boolean;
  showActions?: boolean;
  actions?: ActionItem[];
  onRowSelect?: (selectedRows: RowData[]) => void;
  selectedRows?: RowData[]; // Controlled selection from parent
  emptyMessage?: string;
  maxHeight?: number;
  loading?: boolean;
  // Pagination props
  showPagination?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  rowsPerPageOptions?: number[];
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  showCheckbox = false,
  showActions = false,
  actions = [],
  onRowSelect,
  selectedRows: controlledSelectedRows,
  emptyMessage = "No data available",
  maxHeight = 400,
  loading = false,
  // Pagination props
  showPagination = false,
  page = 0,
  rowsPerPage = 10,
  totalCount = 0,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [5, 10, 25, 50],
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  // Sync internal selection state with controlled prop from parent
  // This allows parent to clear selection by passing empty array
  useEffect(() => {
    if (controlledSelectedRows !== undefined) {
      const selectedIds = controlledSelectedRows.map(row => row.id);
      // Only update if the selection actually changed (to avoid unnecessary re-renders)
      const currentSelectedIds = selected.sort().join(',');
      const newSelectedIds = selectedIds.sort().join(',');
      if (currentSelectedIds !== newSelectedIds) {
        setSelected(selectedIds);
      }
    }
  }, [controlledSelectedRows]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Only select/deselect pending rows
    const pendingRows = rows.filter(row => {
      const status = row.status?.toLowerCase() || '';
      const pendingStatuses = ['pending', 'pending review'];
      return pendingStatuses.some(pending => status.includes(pending));
    });
    
    if (event.target.checked) {
      const newSelected = pendingRows.map((row) => row.id);
      setSelected(newSelected);
      onRowSelect?.(pendingRows);
    } else {
      setSelected([]);
      onRowSelect?.([]);
    }
  };

  const handleRowClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    const selectedRows = rows.filter(row => newSelected.includes(row.id));
    onRowSelect?.(selectedRows);
  };

  const handleActionsClick = (event: React.MouseEvent<HTMLElement>, rowId: string) => {
    setAnchorEl(event.currentTarget);
    setMenuRowId(rowId);
  };

  const handleActionsClose = () => {
    setAnchorEl(null);
    setMenuRowId(null);
  };

  const handleActionClick = (action: ActionItem) => {
    const row = rows.find(r => r.id === menuRowId);
    if (row) {
      action.onClick(row);
    }
    handleActionsClose();
  };

  // Get current row for menu
  const currentRow = menuRowId ? rows.find(r => r.id === menuRowId) : null;
  // Filter actions to only show when status is "Pending" (case-insensitive check)
  const filteredActions = currentRow 
    ? actions.filter(action => {
        const status = currentRow.status?.toLowerCase() || '';
        const pendingStatuses = ['pending', 'pending review'];
        return pendingStatuses.some(pending => status.includes(pending));
      })
    : [];

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Status chip color mapping
  const getStatusColor = (status: string): 'default' | 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success' => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'active':
        return 'primary';
      default:
        return 'default';
    }
  };

  // Default formatters
  const defaultFormatters = {
    status: (value: string) => (
      <Chip 
        label={value} 
        color={getStatusColor(value)}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    ),
    name: (value: any) => {
      // Handle both string and object formats
      if (typeof value === 'string') {
        return (
          <Typography variant="body2" fontWeight={500}>
            {value}
          </Typography>
        );
      }
      // Handle object format with name and email
      return (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {value.name}
          </Typography>
          {value.email && (
            <Typography variant="caption" color="text.secondary">
              {value.email}
            </Typography>
          )}
        </Box>
      );
    },
    location: (value: any) => {
      // Handle both string and object formats
      if (typeof value === 'string') {
        return (
          <Typography variant="body2" fontWeight={500}>
            {value}
          </Typography>
        );
      }
      // Handle object format with state, city, district
      return (
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {value.state}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {value.city}, {value.district}
          </Typography>
        </Box>
      );
    },
  };

  const formatCellValue = (column: Column, value: any) => {
    if (column.format) {
      return column.format(value);
    }
    
    // Apply default formatters based on column id
    if (defaultFormatters[column.id as keyof typeof defaultFormatters]) {
      return defaultFormatters[column.id as keyof typeof defaultFormatters](value);
    }
    
    return value;
  };

  if (loading) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 6, textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Loading data...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (rows.length === 0) {
    return (
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {emptyMessage}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight }}>
        <Table stickyHeader aria-label="data table">
          <TableHead>
            <TableRow>
              {showCheckbox && (() => {
                // Only show header checkbox when there are pending rows
                const pendingRows = rows.filter(row => {
                  const status = row.status?.toLowerCase() || '';
                  const pendingStatuses = ['pending', 'pending review'];
                  return pendingStatuses.some(pending => status.includes(pending));
                });
                
                return pendingRows.length > 0 ? (
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      indeterminate={
                        (() => {
                          // Only count pending rows for select all
                          const pendingSelected = selected.filter(id => {
                            const row = rows.find(r => r.id === id);
                            if (!row) return false;
                            const status = row.status?.toLowerCase() || '';
                            const pendingStatuses = ['pending', 'pending review'];
                            return pendingStatuses.some(pending => status.includes(pending));
                          });
                          return pendingRows.length > 0 && pendingSelected.length > 0 && pendingSelected.length < pendingRows.length;
                        })()
                      }
                      checked={
                        (() => {
                          // Only count pending rows for select all
                          const pendingSelected = selected.filter(id => {
                            const row = rows.find(r => r.id === id);
                            if (!row) return false;
                            const status = row.status?.toLowerCase() || '';
                            const pendingStatuses = ['pending', 'pending review'];
                            return pendingStatuses.some(pending => status.includes(pending));
                          });
                          return pendingRows.length > 0 && pendingSelected.length === pendingRows.length;
                        })()
                      }
                      onChange={handleSelectAllClick}
                      sx={{
                        '&.Mui-checked': {
                          color: 'primary.main',
                        },
                      }}
                    />
                  </TableCell>
                ) : (
                  <TableCell padding="checkbox"></TableCell>
                );
              })()}
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {showActions && (
                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 600,
                    backgroundColor: '#f5f5f5',
                    borderBottom: '2px solid #e0e0e0',
                    minWidth: 80,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isItemSelected = isSelected(row.id);
              // Only show checkbox when status is "Pending"
              const status = row.status?.toLowerCase() || '';
              const pendingStatuses = ['pending', 'pending review'];
              const isPending = pendingStatuses.some(pending => status.includes(pending));
              const showRowCheckbox = showCheckbox && isPending;
              
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{
                    cursor: showRowCheckbox ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                  onClick={showRowCheckbox ? () => handleRowClick(row.id) : undefined}
                >
                  {showRowCheckbox && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        sx={{
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                    </TableCell>
                  )}
                  {!showRowCheckbox && showCheckbox && (
                    <TableCell padding="checkbox"></TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {formatCellValue(column, row[column.id])}
                    </TableCell>
                  ))}
                  {showActions && (() => {
                    // Only show action icon when status is "Pending"
                    const status = row.status?.toLowerCase() || '';
                    const pendingStatuses = ['pending', 'pending review'];
                    const isPending = pendingStatuses.some(pending => status.includes(pending));
                    
                    return isPending ? (
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleActionsClick(event, row.id);
                          }}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'primary.light',
                            },
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    ) : (
                      <TableCell align="center"></TableCell>
                    );
                  })()}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {filteredActions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleActionClick(action)}
            disabled={action.disabled && currentRow ? action.disabled(currentRow) : false}
            sx={{
              color: action.color === 'error' ? 'error.main' : 'inherit',
              '&:hover': {
                backgroundColor: action.color === 'error' ? 'error.light' : 'action.hover',
              },
            }}
          >
            {action.label}
          </MenuItem>
        ))}
      </Menu>
      
      {/* Pagination */}
      {showPagination && (
        <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange || (() => {})}
          onRowsPerPageChange={onRowsPerPageChange || (() => {})}
          showFirstButton
          showLastButton
          sx={{
            borderTop: '1px solid',
            borderTopColor: 'divider',
          }}
        />
      )}
    </Paper>
  );
};

export default DataTable;