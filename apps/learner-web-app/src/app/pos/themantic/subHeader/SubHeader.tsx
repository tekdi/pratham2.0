'use client';
import React from 'react';
import { Box, Button, Typography, InputBase, IconButton, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';

const languages = ['English', 'Hindi', 'Marathi'];

const SubHeader = ({showFilter}: {showFilter: boolean}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedLang, setSelectedLang] = React.useState('English');
  const open = Boolean(anchorEl);

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
      {
        showFilter && (
            <Box>
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
        )
      }
     

      {/* Centered Label */}
      {
        showFilter && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              color: '#222',
              mb: 0.5,
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#f5f6fa',
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          minWidth: { xs: 120, sm: 260 },
          maxWidth: 340,
          width: { xs: '100%', sm: 'auto' },
        }}
      >
        <InputBase
          placeholder="Search"
          sx={{
            ml: 1,
            flex: 1,
            fontSize: '1rem',
            color: '#222',
            '& input': { p: 0 },
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
        <IconButton type="submit" sx={{ p: 0.5 }} aria-label="search">
          <SearchIcon sx={{ color: '#888' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SubHeader;