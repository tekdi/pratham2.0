'use client';

import React, { useState } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
} from '@shared-lib';
import {
  AccountCircleOutlined,
  ExploreOutlined,
  Home,
  AssignmentOutlined,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import ProfileMenu from './ProfileMenu/ProfileMenu';
import { Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import { checkAuth } from '@shared-lib-v2/utils/AuthService';
import MuiThemeProvider from '@learner/assets/theme/MuiThemeProvider';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';

interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}
const App: React.FC<LayoutProps> = ({ children, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { t, setLanguage } = useTranslation();
  const [defaultNavLinks, setDefaultNavLinks] = useState<NewDrawerItemProp[]>(
    []
  );
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const getMessage = () => {
    if (modalOpen) return t('COMMON.SURE_LOGOUT');
    return '';
  };
  const handleClose = () => setAnchorEl(null);
  const handleProfileClick = () => {
    if (pathname !== '/profile') {
      router.push('/profile');
    }
    handleClose();
  };
  const handleLogoutClick = () => {
    router.push('/logout');
  };
  const handleLogoutModal = () => {
    setModalOpen(true);
  };

  React.useEffect(() => {
    let currentPage = '';
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const activeLink = searchParams.get('activeLink');
      currentPage = activeLink
        ? activeLink
        : window.location.pathname
        ? window.location.pathname
        : '';
    }
    const navLinks = [
      {
        title: t('LEARNER_APP.COMMON.L1_COURSES'),
        icon: <Home sx={{ width: 28, height: 28 }} />,
        to: () => router.push('/content'),
        isActive: currentPage === '/content',
      },
      // {
      //   title: t('LEARNER_APP.COMMON.EXPLORE'),
      //   icon: <ExploreOutlined sx={{ width: 28, height: 28 }} />,
      //   to: () => router.push('/explore'),
      //   isActive: currentPage === '/explore',
      // },
    ];
    const isVolunteer = JSON.parse(
      localStorage.getItem('isVolunteer') || 'false'
    );

    if (isVolunteer) {
      navLinks.push({
        title: t('LEARNER_APP.COMMON.SURVEYS'),
        icon: <AssignmentOutlined sx={{ width: 28, height: 28 }} />,
        to: () => router.push('/observations'),
        isActive: currentPage === '/observations',
      });
    }
    if (checkAuth()) {
      navLinks.push({
        title: t('LEARNER_APP.COMMON.PROFILE'),
        icon: <AccountCircleOutlined sx={{ width: 28, height: 28 }} />,
        to: () => {
          setAnchorEl(true);
        },
        isActive: currentPage === '/profile',
      });
    }

    setDefaultNavLinks(navLinks);
  }, [t, router]);
  const onLanguageChange = (val: string) => {
    setLanguage(val);
  };
  const handleCloseModel = () => {
    setModalOpen(false);
  };
  return (
    <Layout
      onlyHideElements={['footer']}
      {...props}
      _topAppBar={{
        _brand: {
          name: localStorage.getItem('userProgram') ?? '',
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
        <Box
          sx={{
            marginTop: '20px',
          }}
        >
          <ProfileMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            onProfileClick={handleProfileClick}
            onLogout={handleLogoutModal}
          />
        </Box>
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
