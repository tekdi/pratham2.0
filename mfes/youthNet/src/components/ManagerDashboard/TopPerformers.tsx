import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { User } from './types';

interface TopPerformersProps {
  usersData: {
    [key: string]: User[];
  };
}

const TopPerformers: React.FC<TopPerformersProps> = ({
  usersData,
}) => {
  // Hardcoded category
  const currentCategory = '5 Highest Course Completing Users';
  const currentUsers = usersData[currentCategory] || [];

  // Check if data is still loading
  const isLoading = !usersData || Object.keys(usersData).length === 0 || !usersData[currentCategory];

  // Get today's date in the format "5th Sep"
  const getTodayDate = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('en', { month: 'short' });
    
    // Add ordinal suffix
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${day}${getOrdinalSuffix(day)} ${month}`;
  };

  // Function to get initials from name (First + Last name initials)
  const getInitials = (name: string) => {
    const nameParts = name.trim().split(' ').filter(part => part.length > 0);
    if (nameParts.length === 0) return 'U';
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    // Take first letter of first name and first letter of last name
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    
    return firstInitial + lastInitial;
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      {/* Header with navigation */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600} sx={{ fontSize: { xs: '0.95rem', sm: '1.125rem' } }}>
          Top Performers & Attention Cohorts
        </Typography>
        {/* <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            size="small"
            disabled
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: { xs: 0.3, sm: 0.5 },
            }}
          >
            <ChevronLeft fontSize="small" />
          </IconButton>
          <Typography variant="caption" color="text.secondary" sx={{ px: { xs: 0.5, sm: 1 }, fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
            1 of 4
          </Typography>
          <IconButton
            size="small"
            disabled
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              p: { xs: 0.3, sm: 0.5 },
            }}
          >
            <ChevronRight fontSize="small" />
          </IconButton>
        </Stack> */}
      </Stack>

      {/* Category box */}
      <Box
        sx={{
          backgroundColor: '#fff9e6',
          borderRadius: 1,
          mb: 2,
          textAlign: 'center',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography 
          variant="body2" 
          fontWeight={600} 
          sx={{ 
            fontSize: { xs: '13px', sm: '14px' },
            margin: 0,
            textAlign: 'center',
            lineHeight: 1
          }}
        >
          {currentCategory}
        </Typography>
      </Box>

      {/* Date dropdown filter */}
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#eeeeee'
            }
          }}
        >
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              margin: 0,
              lineHeight: 1,
              fontSize: '14px'
            }}
          >
            As of today, {getTodayDate()}
          </Typography>
          <ExpandMore 
            sx={{ 
              color: 'text.secondary', 
              fontSize: '20px' 
            }} 
          />
        </Box>
      </Box>

      {/* Section title */}
      <Typography variant="body1" fontWeight={500} sx={{ mb: 2 }}>
        {currentCategory}
      </Typography>

      {/* Users grid */}
      <Box>
        {isLoading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Loading top performers...
            </Typography>
          </Box>
        ) : currentUsers.length > 0 ? (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: 3,
            '& > *': {
              minHeight: '60px'
            }
          }}>
            {currentUsers.slice(0, 6).map((user, index) => (
              <Box 
                key={user.id || index} 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  p: 0.5
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: '#e0e0e0',
                    color: '#333',
                    fontSize: '16px',
                    fontWeight: 600,
                    flexShrink: 0
                  }}
                >
                  {getInitials(user.name)}
                </Avatar>
                <Box sx={{ 
                  flex: 1, 
                  minWidth: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      fontSize: '14px',
                      lineHeight: 1.3,
                      color: '#333',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 0.25
                    }}
                  >
                    {user.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '12px',
                      lineHeight: 1.2,
                      color: '#666',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {user.role}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
            No users found for this category
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default TopPerformers;

