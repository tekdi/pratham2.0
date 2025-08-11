'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  InputBase,
  IconButton,
  Menu,
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchIcon from '@mui/icons-material/Search';
import { SearchButton } from '../SearchButton';
import { useRouter, useSearchParams } from 'next/navigation';
import { logEvent } from '@learner/utils/googleAnalytics';

const languages = ['English', 'Marathi', 'Hindi'];
const STORAGE_KEY = 'selectedLanguage';

const SubHeader = ({
  showFilter,
  getFilter,
  resourceCount = 0,
}: {
  showFilter: boolean;
  getFilter?: (lang: string) => void;
  resourceCount?: number;
}) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams?.get('q') || '');

  // Initialize selectedLang with value from localStorage to prevent flash
  const getInitialLanguage = () => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      if (savedLang && languages.includes(savedLang)) {
        return savedLang;
      }
    }
    return 'English';
  };

  const [selectedLang, setSelectedLang] = React.useState(getInitialLanguage);
  const router = useRouter();

  // Load selected language from localStorage on component mount and call getFilter
  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEY);
    if (savedLang && languages.includes(savedLang) && getFilter) {
      getFilter(savedLang);
    }
  }, [getFilter]);

  useEffect(() => {
    const queryParam = searchParams?.get('q') || '';
    setSearch(queryParam);
  }, [searchParams]);

  const handleLanguageChange = (event: any) => {
    const lang = event.target.value;
    setSelectedLang(lang);
    // Save selected language to localStorage
    localStorage.setItem(STORAGE_KEY, lang);

    if (typeof window !== 'undefined') {
      const windowUrl = window.location.pathname;
      const cleanedUrl = windowUrl;

      logEvent({
        action: 'filter thematic content by language ' + lang,
        category: cleanedUrl,
        label: 'Filter thematic content by language ',
      });
    }

    if (getFilter) getFilter(lang);
  };

  return (
    <Box className='bs-container-fluid  bs-px-md-5 bs-px-sm-3' sx={{ background: '#fff' }}>
      {/* Main Title */}
      <Box
        sx={{
          fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '36px' },
          fontWeight: 600,
          color: '#3891CE',
          fontFamily: '"Montserrat", sans-serif',
          textAlign: 'center',
          bgcolor: '#fff',
          py: { xs: [0, 1], sm: [0, 1] },
          wordWrap: 'break-word',
          lineHeight: 1.2,
          pt: '5px'
        }}
      >
        STEM Education for Innovation : Experimento India
      </Box>

      {/* Main Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',

          pb: { xs: 1, sm: 1 },
          pt: '8px',
          bgcolor: '#fff',
          boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          borderRadius: 2,
          minHeight: { xs: 'auto', md: 64 },
          width: '100%',
          gap: { xs: 2, md: 2 },
        }}
      >
        {/* Language Dropdown */}
        {showFilter && (
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
            }}
          >
            <FormControl>
              <Select
                value={selectedLang}
                onChange={handleLanguageChange}
                IconComponent={KeyboardArrowDownIcon}
                sx={{
                  bgcolor: '#fff',
                  color: '#222',
                  borderRadius: '4px',
                  fontWeight: 500,
                  border: '1px solid #d1d5db',
                  height: '40px',

                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  '& .MuiSelect-select': {
                    padding: '4px 8px',
                    fontSize: '14px',
                    textAlign: 'center',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: '16px',
                    color: '#222',
                  },
                }}
              >
                {languages.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              order: { xs: 2, md: 1 },
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '16px', sm: '18px' },
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

            </Box>
          </Box>
        )}

        {/* Search Bar */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: { xs: 'center', md: 'flex-end' },
            width: '100%',
            order: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              minWidth: { xs: '100%', sm: 260 },
              maxWidth: { xs: '100%', sm: 340 },
              width: { xs: '100%', sm: 'auto' },
            }}
          >
            <SearchButton
              searchValue={search}
              onSearch={(value) => {
                if (typeof window !== 'undefined') {
                  const windowUrl = window.location.pathname;
                  const cleanedUrl = windowUrl;

                  logEvent({
                    action: 'search in thematic coneten by ' + value,
                    category: cleanedUrl,
                    label: 'Search thematic content',
                  });
                  if (value) {
                    router.push(
                      '/themantic/search?q=' + encodeURIComponent(value)
                    );
                  } else {
                    router.push('/themantic/search');
                  }
                }
              }}
              handleSearch={setSearch}
              _box={{
                mx: 'auto',
                mt: { xs: 0, sm: 4 },
                '@media (min-width: 900px)': {
                  mb: '100px',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SubHeader;
