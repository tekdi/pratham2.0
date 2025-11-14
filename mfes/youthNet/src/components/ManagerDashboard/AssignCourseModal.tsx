import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
  IconButton,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  selected?: boolean;
}

interface AssignCourseModalProps {
  open: boolean;
  onClose: () => void;
  employeeName: string;
  onAssign: (courseIds: string[]) => void;
}

const AssignCourseModal: React.FC<AssignCourseModalProps> = ({
  open,
  onClose,
  employeeName,
  onAssign,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  // Dummy course data - replace with API call
  const [courses] = useState<Course[]>([
    {
      id: '1',
      title: 'Empower Teams for Success',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing...',
      image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Empower+Teams',
    },
    {
      id: '2',
      title: 'Leadership in Practice',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctu...',
      image: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Leadership',
    },
    {
      id: '3',
      title: 'Effective Communication',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing...',
      image: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Communication',
    },
    {
      id: '4',
      title: 'Critical Thinking for Decision Making',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing...',
      image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Critical+Thinking',
    },
    {
      id: '5',
      title: 'Empower Teams for Success',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing...',
      image: 'https://via.placeholder.com/300x200/6366f1/ffffff?text=Empower+Teams',
    },
    {
      id: '6',
      title: 'Leadership in Practice',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctu...',
      image: 'https://via.placeholder.com/300x200/8b5cf6/ffffff?text=Leadership',
    },
    {
      id: '7',
      title: 'Effective Communication',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing...',
      image: 'https://via.placeholder.com/300x200/ec4899/ffffff?text=Communication',
    },
    {
      id: '8',
      title: 'Critical Thinking for Decision Making',
      description: 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing...',
      image: 'https://via.placeholder.com/300x200/f59e0b/ffffff?text=Critical+Thinking',
    },
  ]);

  const handleToggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleAssign = () => {
    onAssign(selectedCourses);
    setSelectedCourses([]);
    onClose();
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: '95vw',
          height: '95vh',
          maxWidth: 'none',
          maxHeight: '95vh',
          m: 2,
        },
      }}
    >
      {/* Header */}
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Assign Course
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {employeeName}
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
        {/* Search and Filter */}
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          <TextField
            placeholder="Search courses.."
            size="small"
            fullWidth
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
            startIcon={<FilterListIcon />}
            sx={{ textTransform: 'none', minWidth: 120 }}
          >
            Filters
          </Button>
        </Stack>

        {/* Course Grid */}
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1 }}>
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={3} key={course.id}>
                <Card
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    border: selectedCourses.includes(course.id)
                      ? '2px solid #1976d2'
                      : '2px solid transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => handleToggleCourse(course.id)}
                >
                  {/* Checkbox */}
                  <Checkbox
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleToggleCourse(course.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />

                  {/* Course Image */}
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.image}
                    alt={course.title}
                    sx={{ backgroundColor: '#e0e0e0' }}
                  />

                  {/* Course Content */}
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      gutterBottom
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '40px',
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {course.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={selectedCourses.length === 0}
          sx={{
            backgroundColor: '#FFC107',
            color: '#000',
            textTransform: 'none',
            px: 6,
            py: 1.5,
            borderRadius: 8,
            fontWeight: 600,
            '&:hover': {
              backgroundColor: '#FFB300',
            },
            '&:disabled': {
              backgroundColor: '#e0e0e0',
              color: '#9e9e9e',
            },
          }}
        >
          Assign Course{selectedCourses.length > 1 ? 's' : ''}
          {selectedCourses.length > 0 && ` (${selectedCourses.length})`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignCourseModal;

