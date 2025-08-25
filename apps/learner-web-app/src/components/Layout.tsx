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
import { TenantName } from '../utils/app.constant';

// Custom DrawerItem interface
interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}
const getClubStyleNavConfig = ({
  router,
  t,
  handleNavClick,
  getLinkStyle,
  currentPage,
  setAnchorEl,
  isMobile,
  handleLogoutModal,
}: {
  router: any;
  t: any;
  handleNavClick: (cb: () => void) => void;
  getLinkStyle: (active: boolean) => React.CSSProperties;
  currentPage: string;
  setAnchorEl: (el: boolean) => void;
  isMobile: boolean;
  handleLogoutModal: () => void;
}): NewDrawerItemProp[] => {
  const navLinks: NewDrawerItemProp[] = [
    {
      title: t('LEARNER_APP.COMMON.COURSES'),
      icon: <AssignmentOutlined sx={{ width: 28, height: 28 }} />,
      to: () => handleNavClick(() => router.push('/courses-contents')),
      isActive: currentPage === '/courses-contents' || currentPage === '/in-progress',
      customStyle: getLinkStyle(currentPage === '/courses-contents'),
    },
    {
      title: t('LEARNER_APP.COMMON.PROFILE'),
      icon: <AccountCircleOutlined sx={{ width: 28, height: 28 }} />,
      to: isMobile
        ? () => handleNavClick(() => router.push('/profile'))
        : () => { setAnchorEl(true) },
      isActive: currentPage === '/profile',
      customStyle: getLinkStyle(currentPage === '/profile'),
    },
  ];

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

// Nav config by userProgram
const NAV_CONFIG: Record<
  string,
  (params: {
    router: any;
    isMobile: boolean;
    t: any;
    handleNavClick: (cb: () => void) => void;
    handleProfileClick: () => void;
    handleLogoutModal: () => void;
    setAnchorEl: (el: boolean) => void;
    getLinkStyle: (active: boolean) => React.CSSProperties;
    currentPage: string;
    checkAuth: boolean;
  }) => NewDrawerItemProp[]
> = {
  [TenantName.YOUTHNET]: ({
    router,
    isMobile,
    t,
    handleNavClick,
    handleProfileClick,
    handleLogoutModal,
    setAnchorEl,
    getLinkStyle,
    currentPage,
    checkAuth,
  }) => {
    const navLinks: NewDrawerItemProp[] = [
      {
        title: t('LEARNER_APP.COMMON.L1_COURSES'),
        icon: <Home sx={{ width: 28, height: 28 }} />,
        to: () => handleNavClick(() => router.push('/content')),
        isActive: currentPage === '/content' || currentPage === '/in-progress',
        customStyle: getLinkStyle(currentPage === '/content'),
      },
    ];

    const isVolunteer = JSON.parse(
      localStorage.getItem('isVolunteer') || 'false'
    );
    if (isVolunteer) {
      navLinks.push({
        title: t('LEARNER_APP.COMMON.SURVEYS'),
        icon: <AssignmentOutlined sx={{ width: 28, height: 28 }} />,
        to: () => handleNavClick(() => router.push('/observations')),
        isActive: currentPage === '/observations',
        customStyle: getLinkStyle(currentPage === '/observations'),
      });
    }

    if (checkAuth) {
      if (isMobile) {
        navLinks.push({
          title: t('COMMON.LOGOUT'),
          icon: <Logout sx={{ width: 28, height: 28 }} />,
          to: () => handleNavClick(handleLogoutModal),
          isActive: false,
          customStyle: {},
        });
      } else {
        navLinks.push(
          {
            title: t('COMMON.SKILLING_CENTERS'),
            icon: (
              <img
                src="/images/engineering.png"
                alt="Skill Center"
                style={{ width: 28, height: 28 }}
              />
            ),
            to: () => handleNavClick(() => router.push('/skill-center')),
            isActive: currentPage === '/skill-center',
            customStyle: {},
          }
        );
      }
    }

    // Add Profile link at the end
    navLinks.push({
      title: t('LEARNER_APP.COMMON.PROFILE'),
      icon: <AccountCircleOutlined sx={{ width: 28, height: 28 }} />,
      to: isMobile 
        ? () => handleNavClick(handleProfileClick)
        : () => setAnchorEl(true),
      isActive: currentPage === '/profile',
      customStyle: getLinkStyle(currentPage === '/profile'),
    });

    return navLinks;
  },

  [TenantName.CAMP_TO_CLUB]: ({ router, t, handleNavClick, getLinkStyle, currentPage, setAnchorEl, isMobile, handleLogoutModal }) =>
    getClubStyleNavConfig({ router, t, handleNavClick, getLinkStyle, currentPage, setAnchorEl, isMobile, handleLogoutModal }),

  [TenantName.PRAGYANPATH]: ({ router, t, handleNavClick, getLinkStyle, currentPage, setAnchorEl, isMobile, handleLogoutModal }) =>
    getClubStyleNavConfig({ router, t, handleNavClick, getLinkStyle, currentPage, setAnchorEl, isMobile, handleLogoutModal }),
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

  const configFn = NAV_CONFIG[program];
  const navLinks = configFn
    ? configFn({
        router,
        isMobile,
        t,
        handleNavClick,
        handleProfileClick,
        handleLogoutModal,
        setAnchorEl,
        getLinkStyle,
        currentPage,
        checkAuth: checkAuth(),
      })
    : [];

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
    const configFn = NAV_CONFIG[program];

    const navLinks = configFn
      ? configFn({
          router,
          isMobile,
          t,
          handleNavClick,
          handleProfileClick,
          handleLogoutModal,
          setAnchorEl,
          getLinkStyle,
          currentPage,
          checkAuth: checkAuth(),
        })
      : [];

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
            onClick: () =>
              {
                const tenantName = localStorage.getItem('userProgram') || '';
                if(tenantName=== TenantName.YOUTHNET) {
          router.push('/content');
        }
        else if (tenantName===TenantName.CAMP_TO_CLUB)
        {
          router.push('/courses-contents');
        }
        else if(tenantName===TenantName.PRAGYANPATH)
        {
          router.push('/courses-contents');
        }
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
