import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Skeleton,
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const loginUrl = process.env.NEXT_PUBLIC_ADMIN_LOGIN_URL;

const UserProfile: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>('');
  const [isHydrated, setIsHydrated] = useState(false);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setIsHydrated(true);
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedName = localStorage.getItem('name');
      setUserName(storedName || 'Anonymous');
    }
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    if (loginUrl && typeof window !== 'undefined') {
      if (window.localStorage) {
        localStorage.clear();
      }
      if (window.parent) {
        window.parent.location.href = loginUrl;
      }
    }
  };

  const handleMenuCollapse = () => {
    setAnchorEl(null);
  };

  if (!isHydrated) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Skeleton variant="circular" width={32} height={32} sx={{ mr: 1 }} />
        <Skeleton variant="text" width={80} height={20} sx={{ mr: 1 }} />
        <Skeleton variant="circular" width={24} height={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar sx={{ width: 32, height: 32, mr: 1 }} />
      <Typography variant="body1" sx={{ mr: 1, color: 'text.primary' }}>
        {userName || 'Anonymous'}
      </Typography>
      <IconButton onClick={handleMenuOpen} size="small">
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuCollapse}
        PaperProps={{ elevation: 3 }}
      >
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default UserProfile;
