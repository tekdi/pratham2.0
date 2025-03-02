import { ArrowDropDown } from '@mui/icons-material';
import { Box, Button, FormControl, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import FilterModalCenter from '../../pages/blocks/components/FilterModalCenter';

const SortBy = ({ appliedFilters, setAppliedFilters, sortingContent }: { appliedFilters: any; setAppliedFilters: any ,sortingContent?: any}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();

  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const handleFilterModalOpen = () => setFilterModalOpen(true);
  const handleFilterModalClose = () => setFilterModalOpen(false);

  const [centerType, setCenterType] = useState<'regular' | 'remote' | ''>(appliedFilters.centerType || '');
  const [sortOrder, setSortOrder] = useState(appliedFilters.sortOrder || '');
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);

  const handleFilterApply = () => {
    console.log(centerType)

    setAppliedFilters({ centerType, sortOrder });
    handleFilterModalClose();
  };

  return (
    <>
      <Grid item xs={6} mt={'1rem'}>
        <Box
          sx={{
            '@media (min-width: 900px)': {
              display: 'flex',
              justifyContent: 'end',
            },
          }}
        >
          <FormControl
            className="drawer-select"
            sx={{
              width: '100%',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleFilterModalOpen}
              size="medium"
              endIcon={<ArrowDropDown />}
              sx={{
                borderRadius: '7px',
                border: `1px solid ${theme?.palette?.warning?.A700}`,
                color: theme?.palette?.warning['300'],
                pl: 3,
                fontSize: '13px',
                fontWeight: '500',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              className="one-line-text"
            >
              {t('COMMON.SORT_BY')}
            </Button>
          </FormControl>
        </Box>
      </Grid>

      <FilterModalCenter
        open={filterModalOpen}
        handleClose={handleFilterModalClose}
        centers={[]}
        selectedCenters={selectedCenters}
        setSelectedCenters={setSelectedCenters}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        centerType={centerType}
        setCenterType={setCenterType}
        onApply={handleFilterApply}
        sortingContent={sortingContent}
      />
    </>
  );
};


export default SortBy;
