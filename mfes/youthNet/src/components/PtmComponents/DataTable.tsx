import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
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
}

interface DataTableProps {
  columns: Column[];
  rows: RowData[];
  showCheckbox?: boolean;
  showActions?: boolean;
  actions?: ActionItem[];
  onRowSelect?: (selectedRows: RowData[]) => void;
  emptyMessage?: string;
  maxHeight?: number;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  showCheckbox = false,
  showActions = false,
  actions = [],
  onRowSelect,
  emptyMessage = "No data available",
  maxHeight = 400,
}) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowId, setMenuRowId] = useState<string | null>(null);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
      onRowSelect?.(rows);
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
    name: (value: any) => (
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
    ),
    location: (value: any) => (
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {value.state}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {value.city}, {value.district}
        </Typography>
      </Box>
    ),
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
              {showCheckbox && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={selected.length > 0 && selected.length < rows.length}
                    checked={rows.length > 0 && selected.length === rows.length}
                    onChange={handleSelectAllClick}
                    sx={{
                      '&.Mui-checked': {
                        color: 'primary.main',
                      },
                    }}
                  />
                </TableCell>
              )}
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
              
              return (
                <TableRow
                  hover
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{
                    cursor: showCheckbox ? 'pointer' : 'default',
                    '&:hover': {
                      backgroundColor: '#f8f9fa',
                    },
                  }}
                  onClick={showCheckbox ? () => handleRowClick(row.id) : undefined}
                >
                  {showCheckbox && (
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
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      {formatCellValue(column, row[column.id])}
                    </TableCell>
                  ))}
                  {showActions && (
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
                  )}
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
        {actions.map((action, index) => (
          <MenuItem 
            key={index} 
            onClick={() => handleActionClick(action)}
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
    </Paper>
  );
};

export default DataTable;