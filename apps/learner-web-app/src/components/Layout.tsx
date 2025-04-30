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

  const handleOpen = (event: any) => setAnchorEl(event.currentTarget);
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

  React.useEffect(() => {
    const currentPage =
      typeof window !== 'undefined' && window.location.pathname
        ? window.location.pathname
        : '';

    setDefaultNavLinks([
      {
        title: t('LEARNER_APP.COMMON.L1_COURSES'),
        icon: <Home sx={{ width: 28, height: 28 }} />,
        to: () => router.push('/content'),
        isActive: currentPage === '/content',
      },
      {
        title: t('LEARNER_APP.COMMON.EXPLORE'),
        icon: <ExploreOutlined sx={{ width: 28, height: 28 }} />,
        to: () => router.push('/explore'),
        isActive: currentPage === '/explore',
      },
      {
        title: t('LEARNER_APP.COMMON.SURVEYS'),
        icon: <AssignmentOutlined sx={{ width: 28, height: 28 }} />,
        to: () => router.push('/content'),
        isActive: currentPage === '/content',
      },
      {
        title: t('LEARNER_APP.COMMON.PROFILE'),
        icon: <AccountCircleOutlined sx={{ width: 28, height: 28 }} />,
        to: () => {
          setAnchorEl(true);
        },
        isActive: currentPage === '/profile',
      },
    ]);
  }, [t, router]);
  const onLanguageChange = (val: string) => {
    setLanguage(val);
  };
  return (
    <Layout
      onlyHideElements={['footer']}
      {...props}
      _topAppBar={{
        _brand: {
          name: 'YouthNet',
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
            onLogout={handleLogoutClick}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default App;
