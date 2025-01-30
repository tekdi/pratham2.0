import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import OutlinedFlagOutlinedIcon from '@mui/icons-material/OutlinedFlagOutlined';
import PreviewOutlinedIcon from '@mui/icons-material/PreviewOutlined';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { Role } from '../utils/app.constant';
import { getLocalStoredUserRole } from '../services/LocalStorageService';
const userRole = getLocalStoredUserRole();

// Updated menu items with icons
const menuItems = [
  { text: 'Create', key: 'create', icon: <AddOutlinedIcon /> },
  { text: 'Drafts', key: 'draft', icon: <CreateOutlinedIcon /> },
  ...(userRole !== Role.CCTA
    ? [
        {
          text: 'Submitted for Review',
          key: 'submitted',
          icon: <PreviewOutlinedIcon />,
        },
      ]
    : []),
  ...(userRole === Role.CCTA
    ? [
        {
          text: 'Up for Review',
          key: 'up-review',
          icon: <PreviewOutlinedIcon />,
        },
      ]
    : []),
  {
    text: 'My Published Contents',
    key: 'publish',
    icon: <OutlinedFlagOutlinedIcon />,
  },
  { text: 'All My Contents', key: 'allContents', icon: <AppsOutlinedIcon /> },
  {
    text: 'Discover Contents',
    key: 'discover-contents',
    icon: <ManageSearchIcon />,
  },
];

interface SidebarProps {
  selectedKey: string;
  onSelect: (key: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedKey, onSelect }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme<any>();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (key: string) => {
    console.log(key);
    router.push(`/workspace/content/${key}`);
    onSelect(key);
    if (isMobile) {
      setDrawerOpen(false); // Close drawer after selecting in mobile view
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const goBack = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const userInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      console.log('userInfo', userInfo);
      if (userInfo?.role === Role.SCTA || userInfo?.role === Role.CCTA) {
        router.push('/course-planner');
      } else router.push('/');
    }
  };

  const drawerContent = (
    <Box
      display="inline-block"
      padding="1rem 0.5rem 0.5rem"
      width="284px !important"
      height="100%"
      sx={{
        fontSize: '16px',
        '@media (max-width: 900px)': {
          background: 'linear-gradient(to bottom, white, #F8EFDA)',
          fontSize: '12px',
        },
      }}
    >
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <img src={'/logo.png'} alt="logo" height={60} />
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingTop={'1rem'}
      >
        <Box display="flex" alignItems="center">
          <ListItemIcon>
            <IconButton onClick={goBack}>
              <ArrowBackIcon sx={{ color: theme.palette.warning['100'] }} />
            </IconButton>
          </ListItemIcon>
          <Typography
            variant="h2"
            fontSize={'16px'}
            sx={{ color: theme.palette.warning['100'], fontWeight: 500 }}
          >
            Back to Main Page
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={toggleDrawer}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            sx={{
              gap: '4px',
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              borderRadius: '4rem',
              backgroundColor:
                selectedKey === item.key
                  ? 'var(--mui-palette-primary-main)'
                  : 'transparent',
              color: '#000',

              fontSize: '16px !important',

              '&:hover': {
                background:
                  selectedKey === item.key
                    ? 'var(--mui-palette-primary-main)'
                    : 'transparent',
              },
              margin: selectedKey === item.key ? '10px 0' : '0',
            }}
            key={item?.key}
            onClick={() => handleNavigation(item?.key)}
          >
            <ListItemIcon
              sx={{
                color:
                  selectedKey === item?.key
                    ? '#2E1500'
                    : theme.palette.warning.A200,
                minWidth: '40px',
                fontWeight: selectedKey === item?.key ? '500' : '500',
                fontSize: '16px !important',
              }}
            >
              {item?.icon}
            </ListItemIcon>
            <ListItemText
              className="menu-list-content"
              primaryTypographyProps={{
                fontSize: '16px',
                fontFamily: 'Poppins',
                fontWeight: selectedKey === item?.key ? '600' : '500',
                color: 'black',
              }}
              primary={item?.text}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MenuIcon
            sx={{ margin: 2, cursor: 'pointer' }}
            onClick={toggleDrawer}
          />

          <Drawer
            anchor="left"
            sx={{
              width: '284px',
              // background: "linear-gradient(to bottom, white, #F8EFDA)",
            }}
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{
              keepMounted: true, // Improves performance on mobile
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: 284,
          }}
        >
          {drawerContent}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
