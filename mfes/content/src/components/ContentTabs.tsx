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
    const { default_img, _card, _grid } = _config ?? {};

    return (
      <Box sx={{ width: '100%' }}>
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
            <Box>
              <Grid container spacing={2}>
                {contentData?.map((item: any) => (
                  <Grid
                    key={item?.identifier}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    {..._grid}
                  >
                    <ContentCard
                      item={item}
                      type={type}
                      default_img={default_img}
                      _card={_card}
                      handleCardClick={handleCardClick}
                      trackData={trackData}
                    />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                {hasMoreData ? (
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
                ) : (
                  isHideEmptyDataMessage && (
                    <Typography variant="body1">
                      {t('LEARNER_APP.CONTENT_TABS.NO_MORE_DATA')}
                    </Typography>
                  )
                )}
              </Box>
            </Box>
          </Loader>
        </Box>
      </Box>
    );
  }
);

RenderTabContent.displayName = 'RenderTabContent';
export default RenderTabContent;
