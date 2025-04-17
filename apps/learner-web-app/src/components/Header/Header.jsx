'use client';

import React from 'react';
import { Box, Typography, Select, MenuItem } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import Image from 'next/image';
import appLogo from '../../../public/images/appLogo.svg';

const Header = () => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      py={2}
      borderBottom="1px solid #ccc"
      bgcolor="#fff"
    >
      {/* Logo and tagline */}
      <Box display="flex" alignItems="center" gap={2}>
        <Image src={appLogo} alt="Pratham Logo" width={200} height={40} />
      </Box>

      {/* Language Selector */}
      <Box display="flex" alignItems="center" gap={1}>
        <LanguageIcon fontSize="small" />
        <Select
          value="en"
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
          <MenuItem value="hi">Hindi</MenuItem>
          {/* Add more languages as needed */}
        </Select>
      </Box>
    </Box>
  );
};

export default Header;
