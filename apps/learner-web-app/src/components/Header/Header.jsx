'use client';

import React, { useState } from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Image from 'next/image';
import appLogo from '../../../public/images/Pratham_Logo.png';
import { useTranslation } from '@shared-lib';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { t, setLanguage } = useTranslation();
  const [lang, setLang] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('lang') || 'en' : 'en'
  ); // state for selected language
  const router = useRouter();

  const handleLanguageChange = (event) => {
    const newLang = event.target.value;
    setLang(newLang);
    setLanguage(newLang);
  };

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
      <Box display="flex" alignItems="center" gap={2} onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>
        <Image src={appLogo} alt="Pratham Logo" width={200} height={40} />
      </Box>

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
          {/* Add more languages as needed */}
        </Select>
      </Box>
    </Box>
  );
};

export default Header;
