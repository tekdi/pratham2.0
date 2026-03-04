'use client';

import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, IconButton, Menu } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Image from 'next/image';
import appLogo from '../../../public/images/Pratham_Logo.png';
import { useTranslation } from '@shared-lib';
import { useRouter } from 'next/navigation';
import { languages } from '@shared-lib-v2/lib/context/Languages';

const Header = ({ isShowLogout = false }) => {
  const { t, setLanguage, language } = useTranslation();
  // Initialize with language from context if available, otherwise fallback to localStorage or 'en'
  const [lang, setLang] = useState(() => {
    if (language) {
      return language;
    }
    return typeof window !== 'undefined'
      ? localStorage.getItem('lang') || 'en'
      : 'en';
  }); // state for selected language
  const [logoutAnchorEl, setLogoutAnchorEl] = useState(null);
  const router = useRouter();

  // Sync local state with language from context
  useEffect(() => {
    if (language) {
      setLang(language);
    }
  }, [language]);

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLang(newLang);
    setLanguage(newLang);
    // Save language to localStorage so it persists and can be used by other components
    localStorage.setItem('lang', newLang);
    localStorage.setItem('preferredLanguage', newLang);
    if (localStorage.getItem('isAndroidApp') == 'yes') {
      // Send message to React Native WebView
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            type: 'LANGUAGE_CHANGE_EVENT', // Event type identifier
            data: {
              language: newLang,

              // Add any data you want to send
            },
          })
        );
      }
    }
  };

  const handleLogoutMenuOpen = (event) => {
    setLogoutAnchorEl(event.currentTarget);
  };

  const handleLogoutMenuClose = () => {
    setLogoutAnchorEl(null);
  };

  const handleLogout = () => {
    handleLogoutMenuClose();
    router.push('/logout');
  };

  const PLPDomain = [
    'localhost:3003',
    'dev-plp.prathamdigital.org',
    'qa-plp.prathamdigital.org',
    'plp.prathamdigital.org',
  ];

  // const isPLPDomain = typeof window !== 'undefined' && PLPDomain.includes(window.location.hostname);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={2}
      borderBottom="1px solid #ccc"
      bgcolor="#fff"
    >
      {/* Logo */}
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        onClick={(event) => {
          if (isShowLogout) {
            handleLogoutMenuOpen(event);
          } else {
            typeof window !== 'undefined' &&
              localStorage.getItem('landingPage');
            if (localStorage.getItem('landingPage')) {
              router.push(localStorage.getItem('landingPage'));
            } else {
              router.push('/');
            }
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <Image src={appLogo} alt="Pratham Logo" width={200} height={40} />
      </Box>

      {/* Language Selector and Logout */}
      <Box display="flex" alignItems="center" gap={2}>
        {/* Language Selector */}
        <Box display="flex" alignItems="center" gap={1}>
          <LanguageIcon fontSize="small" />
          <Select
            value={lang}
            onChange={handleLanguageChange}
            variant="standard"
            disableUnderline
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 400,
              fontSize: '14px',
              minWidth: '80px',
            }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="hi">हिंदी</MenuItem>
            <MenuItem value="mr">मराठी</MenuItem>
            <MenuItem value="odi">ଓଡ଼ିଆ</MenuItem>
            <MenuItem value="tel">తెలుగు</MenuItem>
            <MenuItem value="kan">ಕನ್ನಡ</MenuItem>
            <MenuItem value="tam">தமிழ்</MenuItem>
            <MenuItem value="guj">ગુજરાતી</MenuItem>
            {/* Add more languages as needed */}
          </Select>
        </Box>

        {/* Logout Dropdown Menu */}
        {isShowLogout && (
          <Menu
            anchorEl={logoutAnchorEl}
            open={Boolean(logoutAnchorEl)}
            onClose={handleLogoutMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            PaperProps={{
              sx: {
                borderRadius: 2,
                minWidth: 200,
                mt: 1,
              },
            }}
          >
            <MenuItem
              onClick={handleLogout}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1.5,
                px: 2,
              }}
            >
              <LogoutIcon fontSize="small" sx={{ color: '#1F1B13' }} />
              <Box sx={{ fontWeight: 500, color: '#1F1B13' }}>
                {t('COMMON.LOGOUT')}
              </Box>
            </MenuItem>
          </Menu>
        )}
      </Box>
    </Box>
  );
};

export default Header;
