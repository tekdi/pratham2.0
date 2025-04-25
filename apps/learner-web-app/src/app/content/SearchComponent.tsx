import React, { memo, useState } from 'react';
import { CommonSearch, useTranslation } from '@shared-lib'; // Updated import
import { Search as SearchIcon } from '@mui/icons-material';

export default memo(function SearchComponent({
  onSearch,
}: {
  onSearch: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  return (
    <CommonSearch
      placeholder={t('LEARNER_APP.SEARCH_COMPONENT.PLACEHOLDER')}
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
