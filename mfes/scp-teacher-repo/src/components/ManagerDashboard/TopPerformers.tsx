import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Select,
  FormControl,
  MenuItem,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import UserCard from './UserCard';
import { User } from './types';

interface TopPerformersProps {
  categories: string[];
  usersData: {
    [key: string]: User[];
  };
  dateOptions: string[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({
  categories,
  usersData,
  dateOptions,
}) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dateOptions[0]);

  const currentCategory = categories[currentCategoryIndex];
  const currentUsers = usersData[currentCategory] || [];

  const handleNext = () => {
    setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrevious = () => {
    setCurrentCategoryIndex((prev) =>
      prev === 0 ? categories.length - 1 : prev - 1
    );
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1.125rem' } }}>
          Top Performers & Attention Cohorts
        </Typography>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            onClick={handlePrevious}
            size="small"
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: { xs: 0.3, sm: 0.5 },
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ px: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            {currentCategoryIndex + 1} of {categories.length}
          </Typography>
          <IconButton
            onClick={handleNext}
            size="small"
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: { xs: 0.3, sm: 0.5 },
              '&:hover': { backgroundColor: '#f5f5f5' },
            }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>

      <Box
        sx={{
          backgroundColor: '#fff9e6',
          borderRadius: 1,
          p: { xs: 1, sm: 1.5 },
          mb: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: { xs: '13px', sm: '14px' } }}>
          {currentCategory}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControl size="small" fullWidth>
          <Select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{
              backgroundColor: '#f5f5f5',
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
            }}
          >
            {dateOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Stack spacing={1.5}>
        {currentUsers.length > 0 ? (
          currentUsers.map((user) => <UserCard key={user.id} user={user} />)
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
            No users found for this category
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default TopPerformers;
