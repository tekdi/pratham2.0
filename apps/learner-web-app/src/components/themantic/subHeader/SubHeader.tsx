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

const languages = ['English', 'Marathi', 'Hindi'];

const SubHeader = ({
  showFilter,
  resourceCount = 0,
}: {
  showFilter: boolean;
  resourceCount?: number;
}) => {
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLang, setSelectedLang] = React.useState('English');
  const open = Boolean(anchorEl);
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (lang?: string) => {
    setAnchorEl(null);
    if (lang) setSelectedLang(lang);
  };

  return (
    <>
      <Box
        sx={{
          fontSize: '36px',
          fontWeight: 700,
          color: '#3891CE',
          fontFamily: '"Montserrat", sans-serif',
          textAlign: 'center',
          bgcolor: '#fff',

          // py: 2,
          px: 4,
        }}
      >
        STEM Education for Innovation : Experimento India
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1, sm: 8 },
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
                bgcolor: '#fff',
                color: '#222',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 500,
                border: '1px solid #d1d5db',
                px: 2.5,
                py: 1,
                minWidth: 120,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                justifyContent: 'space-between',
                '&:hover': { bgcolor: '#f5f6fa', border: '1px solid #d1d5db' },
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
                  fontSize: '18px',
                  color: 'black',
                  mb: 0.5,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%',
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
                {resourceCount} Resources
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
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}
        >
          <Box
            sx={{
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
    </>
  );
};

export default SubHeader;
