'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
} from '@shared-lib';
import {
  AccountCircleOutlined,
  Home,
  AssignmentOutlined,
  Logout,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import ProgramSwitchModal from './ProgramSwitchModal/ProgramSwitchModal';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import MuiThemeProvider from '@learner/assets/theme/MuiThemeProvider';
import { TenantName } from '../utils/app.constant';

// Custom DrawerItem interface
interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}

// Dynamic navigation configuration based on uiConfig
const getDynamicNavConfig = ({
  router,
  t,
  handleNavClick,
  getLinkStyle,
  currentPage,
  setAnchorEl,
  isMobile,
  handleLogoutModal,
  handleProfileClick,
}: {
  router: any;
  t: any;
  handleNavClick: (cb: () => void) => void;
  getLinkStyle: (active: boolean) => React.CSSProperties;
  currentPage: string;
  setAnchorEl: (el: boolean) => void;
  isMobile: boolean;
  handleLogoutModal: () => void;
  handleProfileClick: () => void;
}): NewDrawerItemProp[] => {
  const storedConfig =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('uiConfig') || '{}')
      : {};

  console.log('storedConfig:', storedConfig);
  const navbarItems = storedConfig?.navbarItems || [];
  console.log('navbarItems:', navbarItems);
  const navLinks: NewDrawerItemProp[] = [];

  // Check if navbarItems exists and has entries
  if (!Array.isArray(navbarItems) || navbarItems.length === 0) {
    // Return empty array if no navbar items configured
    return navLinks;
  }

  // Sort navigation items by order and generate navigation items
  const sortedNavItems = [...navbarItems].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  sortedNavItems.forEach((item) => {
    const { key, route, order } = item;
    
    // Skip if key or route is missing
    if (!key || !route) {
      console.warn('Skipping navbar item with missing key or route:', { key, route, order });
      return;
    }
    
    // Get appropriate icon based on key
    const getIcon = () => {
      const keyLower = key.toLowerCase();
      console.log('keyLower:', keyLower);
      if (keyLower === 'knowledge_bank') {
        return <img src="/images/book_5.svg" alt="Knowledge Bank" style={{ width: 28, height: 28 }} />;
      } else if (keyLower === 'home') {
        return <Home sx={{ width: 28, height: 28 }} />;
      } else if (keyLower.includes('course')) {
        return <AssignmentOutlined sx={{ width: 28, height: 28 }} />;
      } else if (keyLower === 'profile') {
        return <AccountCircleOutlined sx={{ width: 28, height: 28 }} />;
      } else {
        return <Home sx={{ width: 28, height: 28 }} />;
      }
    };

    // Get appropriate click handler
    const getClickHandler = () => {
      if (key.toLowerCase() === 'profile') {
        return isMobile
          ? () => handleNavClick(handleProfileClick)
          : () => setAnchorEl(true);
      } else {
        return () => handleNavClick(() => router.push(route));
      }
    };

    // Add navigation item maintaining exact sequence by order
    navLinks.push({
      title: t(`LEARNER_APP.COMMON.${key}`),
      icon: getIcon(),
      to: getClickHandler(),
      isActive: currentPage === route || (key.toLowerCase().includes('course') && currentPage === '/in-progress'),
      customStyle: getLinkStyle(currentPage === route),
    });
  });

  // Add logout for mobile
  if (isMobile) {
    navLinks.push({
      title: t('COMMON.LOGOUT'),
      icon: <Logout sx={{ width: 28, height: 28 }} />,
      to: () => handleNavClick(handleLogoutModal),
      isActive: false,
      customStyle: {},
    });
  }

  return navLinks;
};


const App: React.FC<LayoutProps> = ({ children, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, setLanguage } = useTranslation();

  const [defaultNavLinks, setDefaultNavLinks] = useState<NewDrawerItemProp[]>(
    []
  );
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [programSwitchAnchorEl, setProgramSwitchAnchorEl] = useState<HTMLElement | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClose = () => setAnchorEl(null);
  const handleProfileClick = () => {
    if (pathname !== '/profile') {
      router.push('/profile');
    }
    handleClose();
  };
  const handleLogoutClick = () => router.push('/logout');
  const handleLogoutModal = () => setModalOpen(true);
  const handleCloseModel = () => setModalOpen(false);
  const handleNavClick = (callback: () => void) => {
    callback();
  };

  const getLinkStyle = (isActive: boolean): React.CSSProperties => ({
    backgroundColor: isActive ? '#e0f7fa' : 'transparent',
    borderRadius: 8,
  });

  const getMessage = () => (modalOpen ? t('COMMON.SURE_LOGOUT') : '');
  
  useEffect(() => {
  let currentPage = '';
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search);
    const activeLink = searchParams.get('activeLink');
    currentPage = activeLink || window.location.pathname || '';
  }

  const program = localStorage.getItem('userProgram') || '';

  const disallowedPathsMap: Record<string, string[]> = {
    [TenantName.YOUTHNET]: ['/courses-contents'],
    [TenantName.CAMP_TO_CLUB]: ['/content', '/observations', '/skill-center'],
    [TenantName.PRAGYANPATH]: ['/content', '/observations', '/skill-center'],
  };

  const disallowedPaths = disallowedPathsMap[program] || [];

  if (disallowedPaths.includes(currentPage)) {
    // Redirect to a safe/default page
    const fallbackPath = program === TenantName.CAMP_TO_CLUB ? '/courses-contents' : '/content';
    router.push('/unauthorized');
    return;
  }

  const navLinks = getDynamicNavConfig({
    router,
    t,
    handleNavClick,
    getLinkStyle,
    currentPage,
    setAnchorEl,
    isMobile,
    handleLogoutModal,
    handleProfileClick,
  });

  setDefaultNavLinks(navLinks);
}, [t, router, isMobile]);

  useEffect(() => {
    let currentPage = '';
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const activeLink = searchParams.get('activeLink');
      currentPage = activeLink || window.location.pathname || '';
    }

    const program = localStorage.getItem('userProgram') || '';
    const navLinks = getDynamicNavConfig({
      router,
      t,
      handleNavClick,
      getLinkStyle,
      currentPage,
      setAnchorEl,
      isMobile,
      handleLogoutModal,
      handleProfileClick,
    });

    setDefaultNavLinks(navLinks);
  }, [t, router, isMobile]);

  const onLanguageChange = (val: string) => setLanguage(val);

  return (
    <Layout
      onlyHideElements={['footer']}
      {...props}
      _topAppBar={{
        _brand: {
          name:
            typeof window !== 'undefined'
              ? localStorage.getItem('userProgram') ?? ''
              : '',
          _box: {
            onClick: (event: React.MouseEvent<HTMLElement>) => {
              // Open program switch dropdown instead of navigating
              setProgramSwitchAnchorEl(event.currentTarget);
            },

            sx: {
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
            _text: {
              fontWeight: 400,
              fontSize: '22px',
              lineHeight: '28px',
              textAlign: 'center',
            },
            children: (
              <KeyboardArrowDown
                sx={{
                  fontSize: '20px',
                  color: '#000',
                  ml: 0.5,
                }}
              />
            ),
          },
        },
        navLinks: defaultNavLinks,
        _navLinkBox: { gap: 5 },
        onLanguageChange,
        ...props?._topAppBar,
      }}
    >
      <Box>
        {children}
        {!isMobile && (
          <Box sx={{ marginTop: '20px' }}>
            <ProfileMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onProfileClick={handleProfileClick}
              onLogout={handleLogoutModal}
            />
          </Box>
        )}
      </Box>
      <ConfirmationModal
        message={getMessage()}
        handleAction={handleLogoutClick}
        buttonNames={{
          primary: t('COMMON.LOGOUT'),
          secondary: t('COMMON.CANCEL'),
        }}
        handleCloseModal={handleCloseModel}
        modalOpen={modalOpen}
      />
      <ProgramSwitchModal
        open={Boolean(programSwitchAnchorEl)}
        anchorEl={programSwitchAnchorEl}
        onClose={() => setProgramSwitchAnchorEl(null)}
        onSignOut={handleLogoutModal}
      />
    </Layout>
  );
};

export default function AppWrapper(props: Readonly<LayoutProps>) {
  return (
    <MuiThemeProvider>
      <App {...props} />
    </MuiThemeProvider>
  );
}
