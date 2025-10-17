import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import AssignCourseModal from './AssignCourseModal';

interface EmployeeProgress {
  id: string;
  name: string;
  role: string;
  department: string;
  mandatoryCourses: {
    completed: number;
    inProgress: number;
    overdue: number;
    total: number;
  };
  nonMandatoryCourses: {
    completed: number;
    inProgress: number;
    notEnrolled: number;
    total: number;
  };
}

interface IndividualProgressProps {
  data: EmployeeProgress[];
}

const IndividualProgress: React.FC<IndividualProgressProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<{ id: string; name: string } | null>(null);

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

  const filteredData = data.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAssignModal = (employee: EmployeeProgress) => {
    setSelectedEmployee({ id: employee.id, name: employee.name });
    setAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleAssignCourses = (courseIds: string[]) => {
    console.log('Assigning courses:', courseIds, 'to employee:', selectedEmployee);
  };

  const renderProgressBar = (
    completed: number,
    inProgress: number,
    overdueOrNotEnrolled: number,
    total: number,
    isMandatory: boolean
  ) => {
    const completedPercent = (completed / total) * 100;
    const inProgressPercent = (inProgress / total) * 100;
    const overduePercent = (overdueOrNotEnrolled / total) * 100;

    const tooltipContent = isMandatory
      ? `In Progress: ${inProgress}`
      : `Not Enrolled: ${overdueOrNotEnrolled}`;

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
                backgroundColor: isMandatory ? '#f44336' : '#e0e0e0',
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableCell sx={{ fontWeight: 600 }}>Department</TableCell>
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
                <TableCell>
                  <Typography variant="body2">{employee.department}</Typography>
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  {renderProgressBar(
                    employee.mandatoryCourses.completed,
                    employee.mandatoryCourses.inProgress,
                    employee.mandatoryCourses.overdue,
                    employee.mandatoryCourses.total,
                    true
                  )}
                </TableCell>
                <TableCell sx={{ minWidth: 200 }}>
                  {renderProgressBar(
                    employee.nonMandatoryCourses.completed,
                    employee.nonMandatoryCourses.inProgress,
                    employee.nonMandatoryCourses.notEnrolled,
                    employee.nonMandatoryCourses.total,
                    false
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip 
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
                    </Tooltip>
                    <IconButton size="small">
                      <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
