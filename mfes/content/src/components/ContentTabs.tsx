import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  Grid,
} from '@mui/material';
import { ContentItem, Loader, useTranslation } from '@shared-lib'; // Updated import
import React, { memo } from 'react';
import { ContentSearchResponse } from '../services/Search';
import ContentCard from './Card/ContentCard';

const RenderTabContent = memo(
  ({
    contentData,
    _config,
    trackData,
    type,
    handleCardClick,
    hasMoreData,
    handleLoadMore,
    tabs,
    value,
    onChange,
    ariaLabel,
    isLoadingMoreData,
    isPageLoading,
    isHideEmptyDataMessage,
  }: {
    contentData: ContentSearchResponse[];
    _config: any;
    trackData?: [];
    type: string;
    handleCardClick: (content: ContentItem) => void;
    hasMoreData: boolean;
    handleLoadMore: (e: any) => void;
    tabs?: any[];
    value?: number;
    onChange?: (event: React.SyntheticEvent, newValue: number) => void;
    ariaLabel?: string;
    isLoadingMoreData: boolean;
    isPageLoading: boolean;
    isHideEmptyDataMessage?: boolean;
  }) => {
    const { t } = useTranslation();
    const { default_img, _card, _box, _subBox } = _config ?? {};

    return (
      <Box sx={{ width: '100%', ...(_box?.sx ?? {}) }}>
        {tabs?.length !== undefined && tabs?.length > 1 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value ?? 0} onChange={onChange} aria-label={ariaLabel}>
              {tabs.map((tab: any, index: number) => (
                <Tab
                  key={tab.label}
                  icon={tab.icon ?? undefined}
                  label={tab.label}
                  {...{
                    id: `simple-tab-${index}`,
                    'aria-controls': `simple-tabpanel-${index}`,
                  }}
                />
              ))}
            </Tabs>
          </Box>
        )}
        <Box
          sx={{
            flexGrow: 1,
            mt: tabs?.length !== undefined && tabs?.length > 1 ? 2 : 0,
          }}
        >
          <Loader
            isLoading={isPageLoading}
            layoutHeight={197}
            isHideMaxHeight
            _loader={{ backgroundColor: 'transparent' }}
          >
            <Box {..._subBox} sx={{ ...(_subBox?.sx ?? {}) }}>
              <Grid
                container
                spacing={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(auto-fit, minmax(250px, 1fr))',
                  sm: 'repeat(auto-fit, minmax(250px, 1fr))',
                  md:
                    contentData.length > 3
                      ? 'repeat(auto-fit, minmax(250px, 1fr 1fr))'
                      : 'repeat(2, minmax(250px, 1fr))',
                  lg:
                    contentData.length > 3
                      ? 'repeat(auto-fit, minmax(250px, 1fr 1fr))'
                      : 'repeat(2, minmax(250px, 1fr))',
                  xl:
                    contentData.length > 4
                      ? 'repeat(auto-fit, minmax(250px, 1fr 1fr))'
                      : 'repeat(2, minmax(250px, 1fr))',
                }}
                gap="1rem"
                alignItems={'center'}
                justifyContent="center"
                padding="1rem"
              >
                {contentData?.map((item: any) => (
                  <Grid
                    item
                    key={item?.identifier}
                    sx={{
                      display: { xs: 'flex', sm: 'block' },
                      justifyContent: { xs: 'center', sm: 'initial' },
                    }}
                  >
                    <ContentCard
                      item={item}
                      type={type}
                      default_img={default_img}
                      _card={{
                        ..._card,
                        sx: { width: '230px', ...(_card?.sx ?? {}) },
                      }}
                      handleCardClick={handleCardClick}
                      trackData={trackData}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                {hasMoreData && (
                  <Button
                    variant="contained"
                    onClick={handleLoadMore}
                    disabled={isLoadingMoreData}
                  >
                    {isLoadingMoreData ? (
                      <CircularProgress size={20} />
                    ) : (
                      t('LEARNER_APP.CONTENT_TABS.LOAD_MORE')
                    )}
                  </Button>
                )}
              </Box>
              {!contentData?.length && (
                <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
                  {t('LEARNER_APP.CONTENT_TABS.NO_MORE_DATA')}
                </Typography>
              )}
            </Box>
          </Loader>
        </Box>
      </Box>
    );
  }
);

RenderTabContent.displayName = 'RenderTabContent';
export default RenderTabContent;
