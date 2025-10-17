import React, { useEffect, useRef, useState } from 'react';
// import FeatherIcon from "feather-icons-react";
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import config from '../../../../config.json';
import PropTypes from 'prop-types';
import Image from 'next/image';
import TranslateIcon from '@mui/icons-material/Translate';
import Menu from '@mui/material/Menu';
import SearchBar from './SearchBar';
import { useRouter } from 'next/router';
import deleteIcon from '../../../../public/images/Language_icon.png';

import { useTranslation } from 'next-i18next';
import { createTheme, useTheme } from '@mui/material/styles';
import Profile from './Profile';
import { AcademicYear } from '@/utils/Interfaces';
import useStore from '@/store/store';
import { useQueryClient } from '@tanstack/react-query';
import { Role, TenantName } from '@/utils/app.constant';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({
  sx,
  customClass,
  toggleMobileSidebar,
  position,
  showIcon,
}: any) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [lang, setLang] = useState('');
  const queryClient = useQueryClient();

  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const setIsActiveYearSelected = useStore(
    (state: { setIsActiveYearSelected: any }) => state.setIsActiveYearSelected
  );

  const [selectedLanguage, setSelectedLanguage] = useState(lang);
  const [userRole, setUserRole] = useState('');

  const [academicYearList, setAcademicYearList] = useState<AcademicYear[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');

  const [language, setLanguage] = useState(selectedLanguage);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const lang = localStorage.getItem('preferredLanguage') || 'en';
      setLanguage(lang);
      const storedList = localStorage.getItem('academicYearList');
      try {
        const parsedList = storedList ? JSON.parse(storedList) : [];
        const modifiedList = parsedList.map(
          (item: { isActive: any; session: any }) => {
            if (item.isActive) {
              return {
                ...item,
                session: `${item.session} (${t('COMMON.ACTIVE')})`,
              };
            }
            return item;
          }
        );
        setAcademicYearList(modifiedList);
        const selectedAcademicYearId = localStorage.getItem('academicYearId');
        setSelectedSessionId(selectedAcademicYearId ?? '');
      } catch (error) {
        console.error('Error parsing stored academic year list:', error);
        setAcademicYearList([]);
        setSelectedSessionId('');
      }
    }
  }, [setLanguage]);

  useEffect(() => {
    const storedUserData = localStorage.getItem('adminInfo');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setUserRole(userData.role);
    }
  }, []);
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedSessionId(event.target.value);
    localStorage.setItem('academicYearId', event.target.value);
    // Check if the selected academic year is active
    const selectedYear = academicYearList?.find(
      (year) => year.id === event.target.value
    );
    const isActive = selectedYear ? selectedYear.isActive : false;
    // localStorage.setItem('isActiveYearSelected', JSON.stringify(isActive));
    setIsActiveYearSelected(isActive);

    queryClient.clear();
    // window.location.reload();
    const storedUserData = JSON.parse(
      localStorage.getItem('adminInfo') || '{}'
    );
    // window.location.href = (storedUserData?.role === Role.SCTA || storedUserData?.role === Role.CCTA)?"/course-planner":"/centers";
    const { locale } = router;
    if (
      storedUserData?.role === Role.SCTA ||
      storedUserData?.role === Role.CCTA
    ) {
      if (
        storedUserData?.tenantData[0]?.tenantName !=
        TenantName.SECOND_CHANCE_PROGRAM
      ) {
        // router.push('/workspace');
        router.push('/faqs');
      } else {
        if (locale)
          router.push('/course-planner', undefined, { locale: locale });
        else router.push('/course-planner');
      }
    } else {
      if (locale) {
        if (
          storedUserData?.role === Role.CENTRAL_ADMIN &&
          storedUserData?.tenantData[0]?.tenantName ==
            TenantName.SECOND_CHANCE_PROGRAM
        ) {
          if (router.pathname === '/programs') window.location.reload();
          else router.push('/programs', undefined, { locale: locale });
        } else if (
          (storedUserData?.role === Role.CENTRAL_ADMIN ||
            storedUserData?.role === Role.ADMIN) &&
          storedUserData?.tenantData[0]?.tenantName == TenantName.YOUTHNET
        ) {
          if (router.pathname === '/mentor') window.location.reload();
          else router.push('/mentor', undefined, { locale: locale });
        } else if (
          storedUserData?.role === Role.ADMIN &&
          storedUserData?.tenantData[0]?.tenantName ==
            TenantName.SECOND_CHANCE_PROGRAM
        ) {
          if (router.pathname === '/centers') window.location.reload();
          else router.push('/centers', undefined, { locale: locale });
        }
      } else {
        if (
          storedUserData?.role === Role.CENTRAL_ADMIN &&
          storedUserData?.tenantData[0]?.tenantName ==
            TenantName.SECOND_CHANCE_PROGRAM
        ) {
          if (router.pathname === '/programs') window.location.reload();
          else router.push('/programs');
        } else if (
          storedUserData?.role === Role.ADMIN &&
          storedUserData?.tenantData[0]?.tenantName ==
            TenantName.SECOND_CHANCE_PROGRAM
        ) {
          if (router.pathname === '/centers') window.location.reload();
          else router.push('/centers');
        } else if (
          (storedUserData?.role === Role.CENTRAL_ADMIN ||
            storedUserData?.role === Role.ADMIN) &&
          storedUserData?.tenantData[0]?.tenantName == TenantName.YOUTHNET
        ) {
          if (router.pathname === '/mentor') window.location.reload();
          else router.push('/mentor', undefined, { locale: locale });
        }
      }
    }
  };

  const handleChange = async (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    setLanguage(newLocale);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      await router.replace(router.pathname, router.asPath, {
        locale: newLocale,
      });
      window.location.reload(); // Force reload to update all components
    }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = async (newLocale: any) => {
    setLanguage(newLocale);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('preferredLanguage', newLocale);
      await router.replace(router.pathname, router.asPath, {
        locale: newLocale,
      });
      window.location.reload(); // Force reload to update all components
    }
    handleClose();
  };
  return (
    <AppBar sx={sx} position={position} elevation={0} className={customClass}>
      <Toolbar 
        sx={{ 
          gap: { xs: '8px', sm: '12px', md: '15px' }, // Responsive gap
          paddingX: { xs: '8px', sm: '16px' }, // Responsive horizontal padding
          minHeight: { xs: '56px', sm: '64px' }, // Responsive toolbar height
        }}
      >
        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
            color: '#333333', // Dark color for better visibility
            marginRight: '12px',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle background for contrast
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: '#000000',
            },
            '@media (max-width: 600px)': {
              padding: '4px',
              marginRight: '8px',
            },
          }}
        >
          <MenuIcon sx={{ fontSize: '24px' }} />
        </IconButton>
        <Typography
          variant="h2"
          sx={{
            color: '#635E57',
            marginRight: '10px',
            fontSize: '22px',
            fontWeight: 400,
            '@media (max-width: 900px)': { 
              fontSize: '20px',
            },
            '@media (max-width: 600px)': { 
              fontSize: '18px',
            },
          }}
        >
          Admin
        </Typography>
        {/* ------------------------------------------- */}
        {/* Search Dropdown */}
        {/* ------------------------------------------- */}
        {/* <SearchBar
          placeholder={t("NAVBAR.SEARCHBAR_PLACEHOLDER")}
          backgroundColor={theme.palette.background.default}
        /> */}
        {/* ------------ End Menu icon ------------- */}

        <Box flexGrow={1} />

        {(typeof window !== 'undefined' && localStorage.getItem('academicYearId')) &&(userRole !== Role.CCTA &&
          userRole !== Role.SCTA &&
          userRole !== '') && (
            <Box 
              sx={{ 
                flexBasis: { xs: '35%', sm: '25%', md: '20%' }, // Responsive width
                minWidth: { xs: '120px', sm: '150px' }, // Minimum width
                marginRight: { xs: '8px', sm: '12px' }, // Responsive margin
              }}
            >
              <Select
                onChange={handleSelectChange}
                value={selectedSessionId}
                className="select-languages"
                displayEmpty
                sx={{
                  borderRadius: '0.5rem',
                  width: '100%',
                  marginBottom: '0rem',
                  height: { xs: '28px', sm: '30px' }, // Responsive height
                  color: '#fff',
                  border: '1px solid #fff',
                  fontSize: { xs: '12px', sm: '14px' }, // Responsive font size
                  '& .MuiSvgIcon-root': {
                    color: 'black',
                  },
                  '& .MuiSelect-select': {
                    padding: { xs: '4px 8px', sm: '6px 12px' }, // Responsive padding
                  },
                }}
              >
                  {academicYearList.map(({ id, session }) => (
                  <MenuItem key={id} value={id}>
<span style={{ color: 'black', fontSize: '14px' }}>{session}</span>
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

        <Box
          sx={{
            display: 'flex',
            backgroundColor: '#bdbdbd',
            padding: { xs: '3px', sm: '5px' }, // Responsive padding
            alignItems: 'center',
            justifyContent: 'center',
            height: { xs: '24px', sm: '20px' }, // Responsive height
            width: { xs: '30px', sm: '35px' }, // Responsive width
            borderRadius: '10px',
            cursor: 'pointer',
            marginRight: { xs: '6px', sm: '8px' }, // Responsive margin
            marginLeft: { xs: '6px', sm: '0px' }, // Add left margin on mobile
          }}
          onClick={handleClick}
        >
          <Image 
            src={deleteIcon} 
            alt="" 
            width={18} 
            height={18}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Box>
        <Menu
          id="long-menu"
          MenuListProps={{
            'aria-labelledby': 'long-button',
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              // maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          {config.languages.map((lang) => (
            <MenuItem
              value={lang.code}
              key={lang.code}
              onClick={() => handleMenuItemClick(lang.code)}
              sx={{
                backgroundColor:
                  lang.code === language ? 'rgba(0, 0, 0, 0.08)' : 'inherit',
                '&:hover': {
                  backgroundColor:
                    lang.code === language
                      ? 'rgba(0, 0, 0, 0.12)'
                      : 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              {lang.label}
            </MenuItem>
          ))}
        </Menu>
        <Profile />
        {/* ------------------------------------------- */}
        {/* Profile Dropdown */}
        {/* ------------------------------------------- */}
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  position: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
  showIcon: PropTypes.bool,
};

export default Header;
