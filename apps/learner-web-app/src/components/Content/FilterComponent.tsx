import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation, FilterForm } from '@shared-lib';

const FilterComponent: React.FC<{
  filterState: any;
  staticFilter?: Record<string, object> | undefined;
  handleFilterChange: (newFilterState: any) => void;
}> = ({ filterState, staticFilter, handleFilterChange }) => {
  const { t } = useTranslation();
  const [filterCount, setFilterCount] = useState<any>();

  useEffect(() => {
    setFilterCount(
      Object?.keys(filterState.filters || {}).filter(
        (e) => !['limit', ...Object.keys(staticFilter ?? {})].includes(e)
      ).length
    );
  }, [filterState, staticFilter]);

  const memoizedFilterForm = useMemo(
    () => (
      <FilterForm
        onApply={(newFilterState: any) => {
          setFilterCount(
            Object?.keys(newFilterState || {}).filter(
              (e) => e?.toString() != 'limit'
            ).length
          );
          handleFilterChange(newFilterState);
        }}
        orginalFormData={filterState?.filters || {}}
        staticFilter={staticFilter}
      />
    ),
    [handleFilterChange, staticFilter, filterState]
  );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 500,
            fontSize: '16px',
          }}
        >
          {t('LEARNER_APP.COURSE.FILTER_BY')}{' '}
          {filterCount > 0 && `(${filterCount})`}
        </Typography>
        {filterCount > 0 && (
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setFilterCount(0);
              handleFilterChange({});
            }}
          >
            {t('LEARNER_APP.COURSE.CLEAR_FILTER')}
          </Button>
        )}
      </Box>

      {memoizedFilterForm}
    </Box>
  );
};

export default React.memo(FilterComponent);
