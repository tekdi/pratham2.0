import React, { useState, useMemo, useCallback } from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { StatusCardsRow, StatusCardData } from '.';
import DataTable, { Column, RowData } from './DataTable';
import DynamicFilterBar, { FilterState, FilterLabels } from './DynamicFilterBar';

interface PTMDashboardProps {
  dashboardType: 'volunteer' | 'student' | 'teacher' | string;
}

const PTMDashboard: React.FC<PTMDashboardProps> = ({ dashboardType }) => {
  const [loading] = useState(false); // Static loading state for status cards
  const [resetFilters, setResetFilters] = useState(false);
  const [selectedRows, setSelectedRows] = useState<RowData[]>([]);

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    state: [],
    district: [],
    block: [],
    village: [],
    status: [],
    organization: [],
    poc: [],
  });

  // State for filter labels
  const [filterLabels, setFilterLabels] = useState<FilterLabels>({
    state: [],
    district: [],
    block: [],
    village: [],
    status: [],
    organization: [],
    poc: [],
  });

  // Handle status card clicks - memoized to prevent recreation (moved up)
  const handleStatusCardClick = useCallback((status: string) => {
    console.log(`${status} card clicked`);
    // Add navigation or filtering logic here
  }, []);

  // Initial status cards data with memoized onClick handlers
  const initialStatusCards = useMemo<StatusCardData[]>(() => [
    {
      id: 'total',
      count: 4,
      title: 'Total',
      variant: 'total',
      onClick: () => handleStatusCardClick('total'),
    },
    {
      id: 'pending',
      count: 3,
      title: 'Pending Review',
      variant: 'pending',
      onClick: () => handleStatusCardClick('pending'),
    },
    {
      id: 'approved',
      count: 1,
      title: 'Approved',
      variant: 'approved',
      onClick: () => handleStatusCardClick('approved'),
    },
    {
      id: 'rejected',
      count: 0,
      title: 'Rejected',
      variant: 'rejected',
      onClick: () => handleStatusCardClick('rejected'),
    },
  ], [handleStatusCardClick]);

  // Status cards data - now static (shows overall application data)
  const statusCardsData = initialStatusCards;

  // Table columns definition - memoized by dashboardType
  const columns = useMemo<Column[]>(() => {
    switch (dashboardType) {
      case 'volunteer':
      default:
        return [
          {
            id: 'name',
            label: 'Name',
            minWidth: 200,
          },
          {
            id: 'subProgram',
            label: 'Sub-program',
            minWidth: 180,
          },
          {
            id: 'location',
            label: 'Location',
            minWidth: 160,
          },
          {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            align: 'center',
          },
        ];
    }
  }, [dashboardType]);

  // Sample table data - memoized by dashboardType
  const initialTableData = useMemo<RowData[]>(() => {
    switch (dashboardType) {
      case 'volunteer':
      default:
        return [
          {
            id: '1',
            name: {
              name: 'Priya Sharma',
              email: 'priya.sharma@example.com',
            },
            subProgram: "Children's Club (Creativity Club)",
            location: {
              state: 'Maharashtra',
              city: 'Mumbai',
              district: 'Andheri',
            },
            status: 'Pending',
          },
          {
            id: '2',
            name: {
              name: 'Rajesh Kumar',
              email: 'rajesh.kumar@example.com',
            },
            subProgram: 'Summer Camp',
            location: {
              state: 'Maharashtra',
              city: 'Mumbai',
              district: 'Andheri',
            },
            status: 'Pending',
          },
          {
            id: '3',
            name: {
              name: 'Sunita Patil',
              email: 'sunita.patil@example.com',
            },
            subProgram: "Children's Club (Creativity Club)",
            location: {
              state: 'Maharashtra',
              city: 'Mumbai',
              district: 'Andheri',
            },
            status: 'Pending',
          },
          {
            id: '4',
            name: {
              name: 'Arun Mehta',
              email: 'arun.mehta@example.com',
            },
            subProgram: 'Summer Camp',
            location: {
              state: 'Maharashtra',
              city: 'Mumbai',
              district: 'Andheri',
            },
            status: 'Approved',
          },
        ];
    }
  }, [dashboardType]);

  const [tableData, setTableData] = useState<RowData[]>(initialTableData);

  // Table actions - memoized by dashboardType
  const tableActions = useMemo(() => {
    switch (dashboardType) {
      case 'volunteer':
      default:
        return [
          {
            label: 'View Details',
            onClick: (row: RowData) => {
              console.log('View details for:', row);
            },
          },
          {
            label: 'Edit',
            onClick: (row: RowData) => {
              console.log('Edit:', row);
            },
          },
          {
            label: 'Approve',
            onClick: (row: RowData) => {
              console.log('Approve:', row);
              setTableData(prev => 
                prev.map(item => 
                  item.id === row.id 
                    ? { ...item, status: 'Approved' } 
                    : item
                )
              );
            },
            color: 'success' as const,
          },
          {
            label: 'Reject',
            onClick: (row: RowData) => {
              console.log('Reject:', row);
              setTableData(prev => 
                prev.map(item => 
                  item.id === row.id 
                    ? { ...item, status: 'Rejected' } 
                    : item
                )
              );
            },
            color: 'error' as const,
          },
        ];
    }
  }, [dashboardType]);


  // Filter table data based on applied filters - memoized (status cards unaffected)
  const filterTableData = useCallback((appliedFilters: FilterState) => {
    let filteredData = [...initialTableData]; // Use memoized initial data

    // Apply status filter
    if (appliedFilters.status.length > 0) {
      filteredData = filteredData.filter(item => 
        appliedFilters.status.some(status => 
          item.status.toLowerCase() === status.toLowerCase()
        )
      );
    }

    // Apply location filters (demo - in real app, this would be based on actual location data)
    if (appliedFilters.state.length > 0) {
      // Filter by state if needed
    }

    // Update only table data - status cards show overall application data
    setTableData(filteredData);
  }, [initialTableData]);

  // Handle filter changes - memoized (filters only affect table data, not status cards)
  const handleFiltersChange = useCallback((newFilters: FilterState, newFilterLabels: FilterLabels) => {
    setFilters(newFilters);
    setFilterLabels(newFilterLabels);
    console.log('Filters applied:', newFilters);
    console.log('Filter labels:', newFilterLabels);
    
    // Filter table data based on applied filters (status cards remain unchanged)
    filterTableData(newFilters);
  }, [filterTableData]);

  // Handle row selection - memoized
  const handleRowSelect = useCallback((selected: RowData[]) => {
    setSelectedRows(selected);
    console.log('Selected rows:', selected);
  }, []);

  // Handle bulk approve action - memoized
  const handleApproveAll = useCallback(() => {
    const selectedIds = selectedRows.map(row => row.id);
    setTableData(prev => 
      prev.map(item => 
        selectedIds.includes(item.id) 
          ? { ...item, status: 'Approved' } 
          : item
      )
    );
    setSelectedRows([]); // Clear selection after action
    console.log('Approved all selected rows:', selectedIds);
  }, [selectedRows]);

  // Handle bulk reject action - memoized
  const handleRejectAll = useCallback(() => {
    const selectedIds = selectedRows.map(row => row.id);
    setTableData(prev => 
      prev.map(item => 
        selectedIds.includes(item.id) 
          ? { ...item, status: 'Rejected' } 
          : item
      )
    );
    setSelectedRows([]); // Clear selection after action
    console.log('Rejected all selected rows:', selectedIds);
  }, [selectedRows]);

  // Clear all filters - memoized
  const clearAllFilters = useCallback(() => {
    setResetFilters(true);
    setSelectedRows([]); // Clear selected rows when filters are cleared
  }, []);

  // Handle reset complete - memoized (status cards remain unchanged)
  const handleResetComplete = useCallback(() => {
    setResetFilters(false);
    // Reset filters
    setFilters({
      state: [],
      district: [],
      block: [],
      village: [],
      status: [],
      organization: [],
      poc: [],
    });
    // Reset filter labels
    setFilterLabels({
      state: [],
      district: [],
      block: [],
      village: [],
      status: [],
      organization: [],
      poc: [],
    });
    // Reset table data to show all data
    setTableData(initialTableData);
    // Status cards remain unchanged - they show overall application data
  }, [initialTableData]);


  return (
    <>
      {/* Status Cards Section */}
      <Box sx={{ mb: 4 }}>
        <StatusCardsRow
          cards={statusCardsData}
          size="medium"
          loading={loading}
          spacing={3}
          responsive={{
            xs: 1, // 1 card per row on mobile
            sm: 2, // 2 cards per row on small screens
            md: 4, // 4 cards per row on medium+ screens
            lg: 4,
            xl: 4,
          }}
        />
      </Box>

      {/* Dynamic Filter Bar */}
      <Box sx={{ mb: 3 }}>
        <DynamicFilterBar 
          onFiltersChange={handleFiltersChange} 
          resetFilters={resetFilters}
          onResetComplete={handleResetComplete}
        />
      </Box>

      {/* Filter Summary */}
      {(filters.state.length > 0 || filters.district.length > 0 || filters.block.length > 0 || 
        filters.village.length > 0 || filters.status.length > 0 || filters.organization.length > 0) && (
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              <strong>Applied Filters:</strong>{' '}
              {filterLabels.state.length > 0 && 
                `States: ${filterLabels.state.length > 2 
                  ? `${filterLabels.state.slice(0, 2).join(', ')} +${filterLabels.state.length - 2} more` 
                  : filterLabels.state.join(', ')
                }; `}
              {filterLabels.district.length > 0 && 
                `Districts: ${filterLabels.district.length > 2 
                  ? `${filterLabels.district.slice(0, 2).join(', ')} +${filterLabels.district.length - 2} more` 
                  : filterLabels.district.join(', ')
                }; `}
              {filterLabels.block.length > 0 && 
                `Blocks: ${filterLabels.block.length > 2 
                  ? `${filterLabels.block.slice(0, 2).join(', ')} +${filterLabels.block.length - 2} more` 
                  : filterLabels.block.join(', ')
                }; `}
              {filterLabels.village.length > 0 && 
                `Villages: ${filterLabels.village.length > 2 
                  ? `${filterLabels.village.slice(0, 2).join(', ')} +${filterLabels.village.length - 2} more` 
                  : filterLabels.village.join(', ')
                }; `}
              {filterLabels.status.length > 0 && 
                `Status: ${filterLabels.status.join(', ')}; `}
              {filterLabels.organization.length > 0 && 
                `Organizations: ${filterLabels.organization.length > 2 
                  ? `${filterLabels.organization.slice(0, 2).join(', ')} +${filterLabels.organization.length - 2} more` 
                  : filterLabels.organization.join(', ')
                }`}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={clearAllFilters}
              sx={{ minWidth: 'auto' }}
            >
              Clear All
            </Button>
          </Paper>
        </Box>
      )}

      {/* Bulk Actions Bar - Shows when rows are selected */}
      {selectedRows.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              backgroundColor: '#fff',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e0e0e0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {selectedRows.length} selected
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<CheckIcon />}
                onClick={handleApproveAll}
                sx={{
                  backgroundColor: '#00c851',
                  color: 'white',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#00a842',
                    boxShadow: 'none',
                  },
                }}
              >
                Approve All
              </Button>
              
              <Button
                variant="outlined"
                size="small"
                startIcon={<CloseIcon />}
                onClick={handleRejectAll}
                sx={{
                  borderColor: '#ff4444',
                  color: '#ff4444',
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  px: 2,
                  py: 0.5,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    borderColor: '#cc0000',
                    color: '#cc0000',
                    backgroundColor: 'rgba(255, 68, 68, 0.04)',
                    boxShadow: 'none',
                  },
                }}
              >
                Reject All
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Data Table */}
      <Box sx={{ mb: 3 }}>
        <DataTable
          columns={columns}
          rows={tableData}
          showCheckbox={true}
          showActions={true}
          actions={tableActions}
          onRowSelect={handleRowSelect}
          emptyMessage={`No ${dashboardType} data found`}
          maxHeight={600}
        />
      </Box>
    </>
  );
};

export default PTMDashboard;