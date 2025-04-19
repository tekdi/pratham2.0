import React, { memo, useState } from 'react';
import { CommonSearch } from '@shared-lib';
import { Search as SearchIcon } from '@mui/icons-material';

export default memo(function SearchComponent({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  return (
    <CommonSearch
      placeholder={'Search content..'}
      rightIcon={<SearchIcon />}
      onRightIconClick={handleSearchClick}
      inputValue={searchValue}
      onInputChange={(event) => handleSearchChange(event.target.value)}
      onKeyPress={(ev: any) => {
        if (ev.key === 'Enter') {
          handleSearchClick();
        }
      }}
      sx={{
        backgroundColor: '#f0f0f0',
        borderRadius: '50px',
        width: '100%',
      }}
    />
  );
});
