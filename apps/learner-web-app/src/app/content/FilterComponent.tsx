import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from '@shared-lib';
import FilterForm from 'libs/shared-lib-v2/src/lib/Filter/FilterForm';

const FilterComponent: React.FC<{
  filterState: any;
  handleFilterChange: (newFilterState: any) => void;
}> = ({ filterState, handleFilterChange }) => {
  const { t } = useTranslation();

  const [isModal, setIsModal] = useState(true);
  const [parentFormData, setParentFormData] = useState([]);
  const [parentStaticFormData, setParentStaticFormData] = useState([]);
  const [orginalFormData, setOrginalFormData] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [instant, setInstant] = useState('');

  const memoizedFilterForm = useMemo(
    () => (
      <FilterForm
        onApply={handleFilterChange}
        setParentFormData={setParentFormData}
        setParentStaticFormData={setParentStaticFormData}
        parentStaticFormData={parentStaticFormData}
        setOrginalFormData={setOrginalFormData}
        orginalFormData={orginalFormData}
        setIsDrawerOpen={setIsDrawerOpen}
      />
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
