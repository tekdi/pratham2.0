import dynamic from 'next/dynamic';
import React, { useState, useCallback, memo, useEffect } from 'react';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { CommonDialog, useTranslation } from '@shared-lib';
import { FilterAltOutlined, FilterList } from '@mui/icons-material';
import SearchComponent from './SearchComponent';
import FilterComponent from './FilterComponent';
import { gredientStyle } from '@learner/utils/style';

interface LearnerCourseProps {
  title?: string;
  _content?: any;
}

const Content = dynamic(() => import('@Content'), {
  ssr: false,
});

export default memo(function LearnerCourse({
  title,
  _content,
}: LearnerCourseProps) {
  const [filterState, setFilterState] = useState<any>({ limit: 10 });
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { staticFilter, filterFramework } = _content ?? {};

  useEffect(() => {
    if (_content?.filters) {
      setFilterState((prevState: any) => ({
        ...prevState,
        ..._content?.filters,
      }));
    }
  }, [_content?.filters]);

  const handleTabChange = useCallback((tab: any) => {
    setFilterState((prevState: any) => ({
      ...prevState,
      query: '',
    }));
  }, []);
  const handleSearchClick = useCallback((searchValue: string) => {
    setFilterState((prevState: any) => ({
      ...prevState,
      query: searchValue,
    }));
  }, []);

  const handleFilterChange = (newFilterState: typeof filterState) => {
    setFilterState((prevState: any) => ({
      ...prevState,
      filters: newFilterState,
    }));
    setIsOpen(false);
  };

  return (
    <Stack sx={{ gap: { xs: 0, sm: 0, md: 2 }, pb: 4 }}>
      {title && (
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            bgcolor: '',
            px: { xs: 1, md: 4 },
            py: { xs: 1, md: 2 },
            zIndex: 1,
          }}
          style={gredientStyle}
        >
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems="center"
            sx={{
              gap: { xs: 2, md: 0 },
              px: { xs: 1, md: 0 },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 400,
                fontSize: '22px',
                lineHeight: '28px',
              }}
            >
              {t(title ?? 'LEARNER_APP.COURSE.GET_STARTED')}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Button
                  variant="outlined"
                  onClick={() => setIsOpen(true)}
                  size="large"
                  sx={{
                    borderRadius: '8px',
                    borderWidth: '1px',
                    borderColor: '#DADADA !important',
                    padding: '8px 10px',
                  }}
                >
                  <FilterList sx={{ width: 20, height: 20, mr: 0.5 }} />
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.1px',
                      mr: 0.5,
                    }}
                  >
                    {t('LEARNER_APP.CONTENT.FILTERS')}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0.1px',
                    }}
                  >
                    {Object.keys(filterState?.filters || {}).filter(
                      (e) =>
                        !['limit', ...Object.keys(staticFilter ?? {})].includes(
                          e
                        )
                    ).length
                      ? `(${
                          Object.keys(filterState.filters).filter(
                            (e) =>
                              ![
                                'limit',
                                ...Object.keys(staticFilter ?? {}),
                              ].includes(e)
                          ).length
                        })`
                      : null}
                  </Typography>
                </Button>
              </Box>
              <SearchComponent
                onSearch={handleSearchClick}
                value={filterState?.query}
              />
            </Box>
            <Box
              sx={{
                display: { xs: 'flex', sm: 'flex', md: 'none' },
                overflowY: 'auto',
                width: '100%',
              }}
            >
              {filterState?.filters
                ? Object.entries(filterState.filters)
                    .filter(
                      ([key, _]) =>
                        !['limit', ...Object.keys(staticFilter ?? {})].includes(
                          key
                        )
                    )
                    .map(([key, value], index) => {
                      if (typeof value === 'object') {
                        return (value as string[]).map((option, index) => (
                          <Chip
                            key={`${key}-${index}`}
                            label={option}
                            onDelete={() => {
                              const { [key]: options, ...rest } =
                                filterState.filters ?? {};
                              const newOptions = options.filter(
                                (o: any) => o !== option
                              );
                              if (newOptions.length === 0) {
                                handleFilterChange({
                                  ...rest,
                                });
                              } else {
                                handleFilterChange({
                                  ...rest,
                                  [key]: newOptions,
                                });
                              }
                            }}
                            sx={{ mr: 1, mb: 1, borderRadius: '8px' }}
                          />
                        ));
                      } else {
                        return (
                          <Chip
                            key={key}
                            label={`${key}: ${value}`}
                            onDelete={() => {
                              const { [key]: _, ...rest } =
                                filterState.filters ?? {};
                              handleFilterChange(rest);
                            }}
                            sx={{ mr: 1, mb: 1, borderRadius: '8px' }}
                          />
                        );
                      }
                    })
                : null}
            </Box>
          </Box>
        </Box>
      )}
      <Stack
        direction="row"
        sx={{ gap: 4, px: { xs: 1, md: 4 }, py: { xs: 1, md: 2 } }}
      >
        <CommonDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <FilterComponent
            filterFramework={filterFramework}
            staticFilter={staticFilter}
            filterState={filterState}
            handleFilterChange={handleFilterChange}
            onlyFields={_content?.onlyFields ?? []}
            isOpenColapsed={_content?.isOpenColapsed ?? []}
          />
        </CommonDialog>

        <Box
          flex={35}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'sticky',
            top: 100,
            alignSelf: 'flex-start',
          }}
        >
          <FilterComponent
            filterFramework={filterFramework}
            staticFilter={staticFilter}
            filterState={filterState}
            handleFilterChange={handleFilterChange}
            onlyFields={_content?.onlyFields ?? []}
            isOpenColapsed={_content?.isOpenColapsed ?? []}
          />
        </Box>
        <Box flex={127}>
          {!title && (
            <Box
              display="flex"
              justifyContent="space-between"
              gap={2}
              sx={{ mb: 2 }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {filterState?.filters
                  ? Object.keys(filterState.filters)
                      .filter(
                        (e) =>
                          ![
                            'limit',
                            ...Object.keys(staticFilter ?? {}),
                          ].includes(e)
                      )
                      .map((key, index) => (
                        <Chip
                          key={`${key}-${index}`}
                          label={
                            <Typography
                              noWrap
                              variant="body2"
                              sx={{ maxWidth: 300, mb: 0 }}
                            >
                              {`${key}: ${filterState.filters[key]}`}
                            </Typography>
                          }
                          onDelete={() => {
                            const { [key]: _, ...rest } =
                              filterState.filters ?? {};
                            handleFilterChange(rest);
                          }}
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))
                  : null}
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <SearchComponent
                  onSearch={handleSearchClick}
                  value={filterState?.query}
                />
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsOpen(true)}
                    size="large"
                  >
                    <FilterAltOutlined />
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
          <Content
            isShowLayout={false}
            contentTabs={['Course']}
            showFilter={false}
            showSearch={false}
            showHelpDesk={false}
            {..._content}
            _config={{
              tabChange: handleTabChange,
              default_img: '/images/image_ver.png',
              _card: { isHideProgress: true },
              ..._content?._config,
            }}
            filters={{
              ...filterState,
              filters: {
                ...filterState.filters,
                ...staticFilter,
              },
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
});
