import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ChannelIcon from '@mui/icons-material/Cast';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SidebarProps } from '../../interfaces/LayoutInterface';

// Define the width of the sidebar drawer
const expandedWidth = 260;
const collapsedWidth = 64;

// Component for navigation items
const NavItem: React.FC<{
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  collapsed: boolean;
  onMobileClose: () => void;
}> = ({ href, label, icon, isActive, collapsed, onMobileClose }) => (
  <ListItem disablePadding sx={{ mb: 0.5 }}>
    <ListItemButton
      component={NextLink}
      href={href}
      onClick={onMobileClose}
      sx={{
        borderRadius: '24px',
        mx: 2,
        mb: 0.5,
        px: collapsed ? 1.5 : 3,
        py: 1.5,
        backgroundColor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? 'primary.contrastText' : 'text.primary',
        justifyContent: collapsed ? 'center' : 'flex-start',
        '&:hover': {
          backgroundColor: isActive
            ? 'primary.main'
            : 'rgba(253, 190, 22, 0.08)',
          borderRadius: '24px',
        },
        '& .MuiListItemIcon-root': {
          color: isActive ? 'primary.contrastText' : 'primary.main',
          minWidth: collapsed ? 'auto' : '40px',
        },
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            fontWeight: isActive ? 600 : 500,
            fontSize: '16px',
          },
        },
      }}
    >
      <ListItemIcon>{icon}</ListItemIcon>
      {!collapsed && <ListItemText primary={label} />}
    </ListItemButton>
  </ListItem>
);

// Component for collapsible sections
const CollapsibleSection: React.FC<{
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
  children: React.ReactNode;
}> = ({ title, icon, isOpen, onToggle, collapsed, children }) => (
  <>
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        onClick={onToggle}
        sx={{
          borderRadius: '24px',
          mx: 2,
          mb: 0.5,
          px: collapsed ? 1.5 : 3,
          py: 1.5,
          justifyContent: collapsed ? 'center' : 'flex-start',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'rgba(253, 190, 22, 0.08)',
            borderRadius: '24px',
          },
          '& .MuiListItemIcon-root': {
            color: 'primary.main',
            minWidth: collapsed ? 'auto' : '40px',
          },
          '& .MuiListItemText-root': {
            '& .MuiTypography-root': {
              fontWeight: 500,
              fontSize: '16px',
            },
          },
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {!collapsed && <ListItemText primary={title} />}
        {!collapsed && (isOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
    </ListItem>
    <Collapse in={isOpen && !collapsed} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {children}
      </List>
    </Collapse>
  </>
);

// Component for sidebar header
const SidebarHeader: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const goBack = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      console.log('userInfo', userInfo);
      const route = process.env.NEXT_PUBLIC_WORKSPACE_ROUTES || '/';
      // Navigate back to the main workspace or admin area
      window.parent.location.href = `${route}`;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 64,
        px: collapsed ? 1 : 3,
        py: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        justifyContent: collapsed ? 'center' : 'space-between',
        background: 'transparent',
      }}
    >
      {!collapsed && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            onClick={goBack}
            size="small"
            sx={{
              color: '#635E57',
              '&:hover': {
                backgroundColor: 'rgba(253, 190, 22, 0.08)',
              },
            }}
            aria-label="Exit Editor"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="body2"
            sx={{
              color: '#635E57',
              fontWeight: 500,
              fontSize: '14px',
            }}
          >
            Exit Editor
          </Typography>
        </Box>
      )}

      {collapsed && (
        <IconButton
          onClick={goBack}
          size="small"
          sx={{
            color: '#635E57',
            '&:hover': {
              backgroundColor: 'rgba(253, 190, 22, 0.08)',
            },
          }}
          aria-label="Exit Editor"
        >
          <ArrowBackIcon />
        </IconButton>
      )}
    </Box>
  );
};

// Component for collapse toggle
const CollapseToggle: React.FC<{
  collapsed: boolean;
  onToggle: () => void;
}> = ({ collapsed, onToggle }) => (
  <Box
    sx={{
      display: { xs: 'none', lg: 'flex' },
      justifyContent: 'center',
      py: 0,
      mt: 'auto',
    }}
  >
    <Box
      onClick={onToggle}
      sx={{
        width: '100%',
        cursor: 'pointer',
        bgcolor: 'primary.main',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
        transition: 'background 0.2s',
        borderTop: '1px solid',
        borderColor: 'divider',
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: 0.5,
        '&:hover': {
          bgcolor: 'primary.dark',
        },
      }}
    >
      {collapsed ? (
        <ChevronRightIcon sx={{ color: '#fff' }} />
      ) : (
        <ChevronLeftIcon sx={{ color: '#fff' }} />
      )}
    </Box>
  </Box>
);

// Component for submenu items
const SubMenuItem: React.FC<{
  href: string;
  label: string;
  isActive: boolean;
  onMobileClose: () => void;
}> = ({ href, label, isActive, onMobileClose }) => (
  <ListItem disablePadding sx={{ mb: 0.5 }}>
    <ListItemButton
      component={NextLink}
      href={href}
      onClick={onMobileClose}
      sx={{
        borderRadius: '20px',
        mx: 3,
        ml: 5,
        px: 2.5,
        py: 1,
        backgroundColor: isActive ? 'primary.main' : 'transparent',
        color: isActive ? 'primary.contrastText' : 'text.secondary',
        '&:hover': {
          backgroundColor: isActive
            ? 'primary.main'
            : 'rgba(253, 190, 22, 0.08)',
          borderRadius: '20px',
        },
        '& .MuiListItemText-root': {
          '& .MuiTypography-root': {
            fontWeight: isActive ? 600 : 400,
            fontSize: '14px',
          },
        },
      }}
    >
      <ListItemText primary={label} />
    </ListItemButton>
  </ListItem>
);

// This component renders the sidebar for the application.
// It includes navigation links for Dashboard, Channels, and Frameworks.
const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const router = useRouter();
  const [openFrameworks, setOpenFrameworks] = React.useState(true);
  const [openChannels, setOpenChannels] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.body.style.setProperty(
        '--sidebar-width',
        `${collapsed ? collapsedWidth : expandedWidth}px`
      );
    }
  }, [collapsed]);

  const handleFrameworksClick = () => setOpenFrameworks((prev) => !prev);
  const handleChannelsClick = () => setOpenChannels((prev) => !prev);
  const handleCollapseToggle = () => setCollapsed((prev) => !prev);

  const isActive = (href: string) => router.pathname === href;

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(to bottom, white, #F8EFDA)',
        bgcolor: '#F8EFDA',
      }}
    >
      <SidebarHeader collapsed={collapsed} />

      <List sx={{ pt: 2 }}>
        <NavItem
          href="/"
          label="Dashboard"
          icon={<DashboardIcon />}
          isActive={isActive('/')}
          collapsed={collapsed}
          onMobileClose={onMobileClose}
        />

        <CollapsibleSection
          title="Channels"
          icon={<ChannelIcon />}
          isOpen={openChannels}
          onToggle={handleChannelsClick}
          collapsed={collapsed}
        >
          <SubMenuItem
            href="/channels/create"
            label="Create New Channel"
            isActive={isActive('/channels/create')}
            onMobileClose={onMobileClose}
          />
          <SubMenuItem
            href="/channels"
            label="View All Channels"
            isActive={isActive('/channels')}
            onMobileClose={onMobileClose}
          />
        </CollapsibleSection>

        <CollapsibleSection
          title="Frameworks"
          icon={<AccountTreeIcon />}
          isOpen={openFrameworks}
          onToggle={handleFrameworksClick}
          collapsed={collapsed}
        >
          <SubMenuItem
            href="/frameworks/create"
            label="Create New Framework"
            isActive={isActive('/frameworks/create')}
            onMobileClose={onMobileClose}
          />
          <SubMenuItem
            href="/frameworks"
            label="View All Frameworks"
            isActive={isActive('/frameworks')}
            onMobileClose={onMobileClose}
          />
          <SubMenuItem
            href="/frameworks/manage"
            label="Manage Taxonomy"
            isActive={isActive('/frameworks/manage')}
            onMobileClose={onMobileClose}
          />
        </CollapsibleSection>
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <CollapseToggle collapsed={collapsed} onToggle={handleCollapseToggle} />
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            width: expandedWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            width: collapsed ? collapsedWidth : expandedWidth,
            boxSizing: 'border-box',
            transition: 'width 0.2s',
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
