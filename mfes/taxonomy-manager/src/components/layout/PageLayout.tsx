import React from 'react';
import Box from '@mui/material/Box';
import Header from './Header';
import Sidebar from './Sidebar';
import { PageLayoutProps } from '../../interfaces/LayoutInterface';

// This component serves as the main layout for the application.
// It includes a sidebar for navigation and a header for the title and mobile menu toggle.
// The layout is responsive, adjusting the sidebar visibility based on the screen size.
// It accepts children components to render within the main content area.

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
          maxWidth: '100%',
          ml: { lg: 'var(--sidebar-width, 260px)' }, // Use CSS variable for sidebar width
        }}
      >
        <Header onMobileMenuClick={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            overflowY: 'auto',
            overflowX: 'hidden',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PageLayout;
