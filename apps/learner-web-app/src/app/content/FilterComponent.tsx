import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { FilterForm, useTranslation } from '@shared-lib';

const FilterComponent: React.FC<{
  filterState: any;
  handleFilterChange: (newFilterState: any) => void;
}> = ({ filterState, handleFilterChange }) => {
  const { t } = useTranslation();

  const memoizedFilterForm = useMemo(
    () => (
      <FilterForm filterValues={filterState} onApply={handleFilterChange} />
    ),
    [filterState, handleFilterChange]
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
      <Typography variant="h6">{t('LEARNER_APP.COURSE.FILTER_BY')}</Typography>
      {memoizedFilterForm}
    </Box>
  );
};

export default React.memo(FilterComponent);
