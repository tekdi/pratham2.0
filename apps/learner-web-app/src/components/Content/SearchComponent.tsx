import React, { memo, useState, useMemo, useEffect, useRef } from 'react';
import { CommonSearch, useTranslation } from '@shared-lib';
import { Search as SearchIcon } from '@mui/icons-material';
import debounce from 'lodash/debounce';

export default memo(function SearchComponent({
  onSearch,
  value,
}: {
  value: string;
  onSearch: (value: string) => void;
}) {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(value || '');
  const isInitialized = useRef(false);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        if (value?.trim() !== '') {
          onSearch(value?.trim());
        }
      }, 500),
    [onSearch]
  );

  useEffect(() => {
    // Only trigger search if component is initialized and search value actually changed from user input
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    const trimmed = searchValue?.trim();

    if (trimmed === '') {
      debouncedSearch.cancel();
      onSearch('');
      return;
    }

    debouncedSearch(trimmed);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchValue, debouncedSearch, onSearch]);

  useEffect(() => {
    // Only update searchValue from prop if component hasn't been initialized yet
    // This prevents triggering search on initial prop value setting
    if (!isInitialized.current) {
      setSearchValue(value || '');
    }
  }, [value]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
  };

  const handleSearchClick = () => {
    const trimmed = searchValue.trim();
    debouncedSearch.cancel();

    if (trimmed !== '') {
      onSearch(trimmed);
    } else {
      onSearch('');
    }
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
        backgroundColor: '#fff',
        borderRadius: '50px',
        border: '1px solid  #D0C5B4',
        width: '100%',
      }}
    />
  );
});
