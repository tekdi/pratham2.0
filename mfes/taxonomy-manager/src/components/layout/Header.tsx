import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { HeaderProps } from '../../interfaces/LayoutInterface';
import UserProfile from './UserProfile';

// This component renders the header of the application.
// It includes a menu button for mobile view, a title, and user profile with login/logout functionality.
const Header: React.FC<HeaderProps> = ({ onMobileMenuClick }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isLgUp && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={onMobileMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <UserProfile />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
