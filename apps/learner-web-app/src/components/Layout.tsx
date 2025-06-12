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
} from '@mui/icons-material';
import { useRouter, usePathname } from 'next/navigation';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import MuiThemeProvider from '@learner/assets/theme/MuiThemeProvider';

interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}

const App: React.FC<LayoutProps> = ({ children, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t, setLanguage } = useTranslation();

  const [defaultNavLinks, setDefaultNavLinks] = useState<NewDrawerItemProp[]>([]);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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

  // ✅ Simplified version without trying to close drawer
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

    const navLinks: NewDrawerItemProp[] = [
      {
        title: t('LEARNER_APP.COMMON.L1_COURSES'),
        icon: <Home sx={{ width: 28, height: 28 }} />,
        to: () => handleNavClick(() => router.push('/content')),
        isActive: currentPage === '/content',
        customStyle: getLinkStyle(currentPage === '/content'),
      },
    ];

    const isVolunteer = JSON.parse(localStorage.getItem('isVolunteer') || 'false');
    if (isVolunteer) {
      navLinks.push({
        title: t('LEARNER_APP.COMMON.SURVEYS'),
        icon: <AssignmentOutlined sx={{ width: 28, height: 28 }} />,
        to: () => handleNavClick(() => router.push('/observations')),
        isActive: currentPage === '/observations',
        customStyle: getLinkStyle(currentPage === '/observations'),
      });
    }

    if (checkAuth()) {
      if (isMobile) {
        navLinks.push(
          {
            title: t('LEARNER_APP.COMMON.PROFILE'),
            icon: <AccountCircleOutlined sx={{ width: 28, height: 28 }} />,
            to: () => handleNavClick(handleProfileClick),
            isActive: currentPage === '/profile',
            customStyle: getLinkStyle(currentPage === '/profile'),
          },
          {
            title: t('COMMON.LOGOUT'),
            icon: <Logout sx={{ width: 28, height: 28 }} />,
            to: () => handleNavClick(handleLogoutModal),
            isActive: false,
            customStyle: {},
          }
        );
      } else {
        navLinks.push(
           {
          title: t('COMMON.SKILLING_CENTERS'),
          // icon: <Logout sx={{ width: 28, height: 28 }} />,
          to: () => handleNavClick(() => router.push('/skill-center')),
          isActive:currentPage === '/skill-center',
          customStyle: {},
        },
          {
          title: t('LEARNER_APP.COMMON.PROFILE'),
          icon: <AccountCircleOutlined sx={{ width: 28, height: 28 }} />,
          to: () => setAnchorEl(true),
          isActive: currentPage === '/profile',
          customStyle: getLinkStyle(currentPage === '/profile'),
        },
       
      );
      }
    }

    setDefaultNavLinks(navLinks);
  }, [t, router, isMobile]);

  const onLanguageChange = (val: string) => setLanguage(val);

  return (
    <Layout
      onlyHideElements={['footer']}
      {...props}
      _topAppBar={{
        _brand: {
          name: typeof window !== 'undefined' ? localStorage.getItem('userProgram') ?? '' : '',
          _box: {
            onClick: () => router.push('/content'),
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
