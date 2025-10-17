import React from 'react';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import { User } from './types';

interface UserCardProps {
  user: User;
  avatarText?: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, avatarText }) => {
  const getInitials = (name: string) => {
    if (!name) return '??';
    const words = name.split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
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
        {avatarText || getInitials(user.name)}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: '13px' }}>
          {user.name}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
          {user.role}
        </Typography>
      </Box>
    </Stack>
  );
};

export default UserCard;
