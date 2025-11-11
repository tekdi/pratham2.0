import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Avatar,
  Stack,
  Button,
  Tooltip,
  Pagination,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import AssignCourseModal from './AssignCourseModal';
import { EmployeeProgress } from './types';
import { setData } from '@shared-lib-v2/utils/DataClient';

interface IndividualProgressProps {
  data: EmployeeProgress[];
  currentPage: number;
  totalPages: number;
  totalEmployees: number;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
 
  
}

const IndividualProgress: React.FC<IndividualProgressProps> = ({ 
  data, 
  currentPage, 
  totalPages, 
  totalEmployees, 
  onPageChange,
  onSearch,
  
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear selected employees when data changes (pagination)
  useEffect(() => {
    setSelectedEmployees([]);
  }, [data]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedEmployees(data.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  // Handle search input change with debounce
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchTerm(query);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(query);
    }, 500);
  }, [onSearch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Use data directly since filtering is handled by API
  const filteredData = data;
console.log('filteredData', filteredData);
  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAssignCourses = (courseIds: string[]) => {
    console.log('Assigning courses:', courseIds, 'to employee:', selectedEmployee);
  };

  const handleViewEmployeeDetails = async (userId: string) => {
    try {
      // Find the employee data
      const employee = data.find(emp => emp.id === userId);
      
      if (employee) {
        // Store course identifiers in IndexedDB
        await setData('mandatoryInProgressIdentifiers', employee.mandatoryInProgressIdentifiers || []);
        await setData('optionalInProgressIdentifiers', employee.optionalInProgressIdentifiers || []);
        await setData('mandatoryCompletedIdentifiers', employee.mandatoryCompletedIdentifiers || []);
        await setData('optionalCompletedIdentifiers', employee.optionalCompletedIdentifiers || []);
        
        console.log('Course identifiers stored in IndexedDB for employee:', userId);
      }
      
      // Navigate to employee details page
      router.push(`/employee-details?userId=${userId}`);
    } catch (error) {
      console.error('Error storing course identifiers in IndexedDB:', error);
      // Still navigate even if storage fails
      router.push(`/employee-details?userId=${userId}`);
    }
  };

  const renderProgressBar = (
    completed: number,
    inProgress: number,
    overdueOrNotEnrolled: number,
    total: number
  ) => {
    const completedPercent = (completed / total) * 100;
    const inProgressPercent = (inProgress / total) * 100;
    const overduePercent = (overdueOrNotEnrolled / total) * 100;

    const tooltipContent = (
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            backgroundColor: '#4caf50', 
            borderRadius: '50%', 
            mr: 1 
          }} />
          <span>Completed: {completed} ({completedPercent.toFixed(1)}%)</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            backgroundColor: '#ffc107', 
            borderRadius: '50%', 
            mr: 1 
          }} />
          <span>In Progress: {inProgress} ({inProgressPercent.toFixed(1)}%)</span>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ 
            width: 12, 
            height: 12, 
            backgroundColor: '#e0e0e0', 
            borderRadius: '50%', 
            mr: 1 
          }} />
          <span>Not Started: {overdueOrNotEnrolled} ({overduePercent.toFixed(1)}%)</span>
        </Box>
        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid #ddd', fontSize: '0.85em', fontWeight: 600 }}>
          Total: {total} courses
        </Box>
      </Box>
    );

    return (
      <Tooltip 
        title={tooltipContent} 
        arrow 
        placement="bottom"
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: '#F8EFE7',
              color: '#333',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
              borderRadius: 1,
              maxWidth: 250,
              '& .MuiTooltip-arrow': {
                color: '#F8EFE7',
              },
            },
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: 24,
            display: 'flex',
            borderRadius: 0.5,
            overflow: 'hidden',
            cursor: 'pointer',
          }}
        >
          {completed > 0 && (
            <Box
              sx={{
                width: `${completedPercent}%`,
                backgroundColor: '#4caf50',
              }}
            />
          )}
          {inProgress > 0 && (
            <Box
              sx={{
                width: `${inProgressPercent}%`,
                backgroundColor: '#ffc107',
              }}
            />
          )}
          {overdueOrNotEnrolled > 0 && (
            <Box
              sx={{
                width: `${overduePercent}%`,
                backgroundColor: '#e0e0e0', // Light gray for both not started and not enrolled
              }}
            />
          )}
        </Box>
      </Tooltip>
    );
  };

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        p: { xs: 1.5, sm: 2 },
        boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', sm: 'center' }}
        spacing={{ xs: 1.5, sm: 0 }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" fontWeight={600} sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
          Individual Progress
        </Typography>
        <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center">
          <TextField
            placeholder="Search employee.."
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: { xs: 1, sm: 'none' },
              width: { sm: 300 },
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f5f5f5',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1976d2',
                },
              },
            }}
          />
          <Button
            variant="outlined"
            sx={{ 
              textTransform: 'none',
              minWidth: { xs: 'auto', sm: 'auto' },
              px: { xs: 1.5, sm: 2 }
            }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Filters</Box>
            <FilterListIcon sx={{ display: { xs: 'inline', sm: 'none' } }} />
          </Button>
        </Stack>
      </Stack>

      <TableContainer sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: { xs: 800, md: '100%' } }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8EFE7' }}>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedEmployees.length === data.length}
                  indeterminate={
                    selectedEmployees.length > 0 &&
                    selectedEmployees.length < data.length
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              {/* <TableCell sx={{ fontWeight: 600 }}>Department</TableCell> */}
              <TableCell sx={{ fontWeight: 600 }}>Mandatory Courses</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Non-Mandatory Courses</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((employee) => (
              <TableRow
                key={employee.id}
                sx={{
                  '&:hover': { backgroundColor: '#f9f9f9' },
                }}
              >
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleSelectEmployee(employee.id)}
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: '#f5f5f5',
                        color: '#333',
                        border: '2px solid #e0e0e0',
                        fontWeight: 600,
                        fontSize: '14px',
                      }}
                    >
                      {employee.name.substring(0, 2).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {employee.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {employee.role}
                      </Typography>
                    </Box>
                  </Stack>
                </TableCell>
                {/* <TableCell>
                  <Typography variant="body2">{employee.department}</Typography>
                </TableCell> */}
                <TableCell sx={{ minWidth: 200 }}>
                  {renderProgressBar(
                    employee.mandatoryCourses.completed,
                    employee.mandatoryCourses.inProgress,
                    employee.mandatoryCourses.notStarted,
                    employee.mandatoryCourses.total
                  )}
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  {renderProgressBar(
                    employee.nonMandatoryCourses.completed,
                    employee.nonMandatoryCourses.inProgress,
                    employee.nonMandatoryCourses.notStarted,
                    employee.nonMandatoryCourses.total
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    {/* <Tooltip 
                      title="Assign Course" 
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: '#F8EFE7',
                            color: '#333',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                            borderRadius: 1,
                            '& .MuiTooltip-arrow': {
                              color: '#F8EFE7',
                            },
                          },
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleOpenAssignModal(employee)}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          '&:hover': { backgroundColor: '#bbdefb' },
                        }}
                      >
                        <AddIcon fontSize="small" sx={{ color: '#1976d2' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip 
                      title="Send Reminder" 
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: '#F8EFE7',
                            color: '#333',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                            borderRadius: 1,
                            '& .MuiTooltip-arrow': {
                              color: '#F8EFE7',
                            },
                          },
                        },
                      }}
                    >
                      <IconButton
                        size="small"
                        sx={{
                          backgroundColor: '#fce4ec',
                          '&:hover': { backgroundColor: '#f8bbd0' },
                        }}
                      >
                        <AccessTimeIcon fontSize="small" sx={{ color: '#c2185b' }} />
                      </IconButton>
                    </Tooltip> */}
                    <Tooltip 
                      title="View Employee Details" 
                      arrow
                      componentsProps={{
                        tooltip: {
                          sx: {
                            backgroundColor: '#F8EFE7',
                            color: '#333',
                            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                            borderRadius: 1,
                            '& .MuiTooltip-arrow': {
                              color: '#F8EFE7',
                            },
                          },
                        },
                      }}
                    >
                      <IconButton 
                        size="small"
                        onClick={() => handleViewEmployeeDetails(employee.id)}
                        sx={{
                          backgroundColor: '#e3f2fd',
                          '&:hover': { backgroundColor: '#bbdefb' },
                        }}
                      >
                        <ArrowForwardIcon fontSize="small" sx={{ color: '#1976d2' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mt: 2, 
          px: 2 
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {((currentPage - 1) * 10) + 1}-{Math.min(currentPage * 10, totalEmployees)} of {totalEmployees} employees
        </Typography>
        
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(event, page) => onPageChange(page)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
        />
      </Box>

      <AssignCourseModal
        open={assignModalOpen}
        onClose={handleCloseAssignModal}
        onAssign={handleAssignCourses}
        employeeName={selectedEmployee?.name || ''}
      />
    </Box>
  );
};



export default IndividualProgress;
