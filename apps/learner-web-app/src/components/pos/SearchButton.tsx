import React from 'react';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SpeakableText from '@shared-lib-v2/lib/textToSpeech/SpeakableText';

interface SearchButtonProps {
  searchValue?: string;
  handleSearch?: (value: string) => void;
  onSearch: (searchValue: string, e?: any) => void;
  isHideSubmitButton?: boolean;
  _box?: any;
  _button?: any;
  _input?: any;
  _icon?: any;
  _topAppBarUi?: boolean;
}

export const SearchButton: React.FC<SearchButtonProps> = ({
  searchValue,
  handleSearch,
  onSearch,
  isHideSubmitButton,
  _box,
  _button,
  _input,
  _icon,
  _topAppBarUi,
}) => {
  const [search, setSearch] = React.useState<string>(searchValue || '');

  React.useEffect(() => {
    setSearch(searchValue || '');
  }, [searchValue]);

  const handleClear = () => {
    setSearch('');
    // handleSearch?.('');
    // onSearch('');
  };

  return (
    <Box
      {..._box}
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#F5F5F5',
        borderRadius: '8px',
        mx: '25px',
        boxShadow: '0px 1px 2px 0px #0000004D',
        ...(_box?.sx ?? {}),
      }}
    >
      {!_topAppBarUi && (
        <SearchIcon
          {..._icon}
          sx={{ color: '#757575', ml: '8px', ...(_icon?.sx ?? {}) }}
        />
      )}
      <TextField
        variant="standard"
        placeholder="Search.."
        {..._input}
        InputProps={{
          disableUnderline: true,
          ...(_input?.InputProps ?? {}),
          sx: {
            fontFamily: 'Poppins',
            fontSize: '18px',
            pl: 1,
            // mr: 1,
            textWrap: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            bgcolor: 'transparent',
            ...(_input?.InputProps?.sx ?? {}),
          },
        }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          handleSearch?.(e.target.value);
        }}
        sx={{ flexGrow: 1, bgcolor: 'transparent', ...(_input?.sx ?? {}) }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(search, e);
          }
        }}
      />
      {search && (
        <IconButton
          onClick={handleClear}
          size="small"
          sx={{
            mr: 1,
            color: '#757575',
            '&:hover': {
              color: '#1F1B13',
            },
          }}
        >
          <ClearIcon sx={{ fontSize: '25px', color: 'black' }} />
        </IconButton>
      )}
      {!isHideSubmitButton && (
        <Button
          variant="contained"
          {..._button}
          sx={{
            bgcolor: '#FDBE16',
            color: '#1F1B13',
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            boxShadow: 'none',
            minWidth: _topAppBarUi ? '40px' : '65px',
            px: _topAppBarUi ? 0 : 4,
            py: _topAppBarUi ? 1 : 1.5,
            fontWeight: 600,
            fontSize: '16px',
            textTransform: 'none',
            '&:hover': { bgcolor: '#e9a416' },
            ...(_button?.sx ?? {}),
          }}
          onClick={(e) => onSearch(search, e)}
        >
          <SpeakableText>
            {_topAppBarUi ? <SearchIcon sx={{ fontSize: '22px' }} /> : 'Search'}
          </SpeakableText>
        </Button>
      )}
    </Box>
  );
};
