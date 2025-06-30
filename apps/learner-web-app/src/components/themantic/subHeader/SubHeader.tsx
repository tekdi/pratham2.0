'use client';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { SearchButton } from '../SearchButton';
import { useRouter } from 'next/navigation';

const languages = ['English', 'Hindi', 'Marathi'];

const SubHeader = ({ showFilter }: { showFilter: boolean }) => {
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLang, setSelectedLang] = React.useState('English');
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (lang?: string) => {
    if (lang) setSelectedLang(lang);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 1, sm: 4 },
        py: 2,
        bgcolor: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        borderRadius: 2,
        minHeight: 64,
        width: '100%',
        gap: 2,
      }}
    >
      {/* Language Dropdown */}
      {showFilter && (
        <Box sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              bgcolor: '#f5f6fa',
              color: '#222',
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              border: 'none',
              px: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#ececec', border: 'none' },
            }}
          >
            {selectedLang}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
            {languages.map((lang) => (
              <MenuItem key={lang} onClick={() => handleClose(lang)}>
                {lang}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      )}

      {/* Centered Label */}
      {showFilter && (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                color: '#222',
                mb: 0.5,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}
            >
              72 Resources
            </Typography>
            <Box
              sx={{
                height: 3,
                width: 48,
                mx: 'auto',
                bgcolor: 'primary.main',
                borderRadius: 2,
                opacity: 0.2,
              }}
            />
          </Box>
        </Box>
      )}

      {/* Search Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            justifyContent: 'center',
            minWidth: { xs: 120, sm: 260 },
            maxWidth: 340,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <SearchButton
            searchValue={search}
            onSearch={() => router.push('/themantic/search?q=' + search)}
            handleSearch={setSearch}
            _box={{
              mx: 'auto',
              mt: 4,
              '@media (min-width: 900px)': {
                mb: '100px',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SubHeader;
