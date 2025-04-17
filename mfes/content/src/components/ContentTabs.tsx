import {
  Box,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Typography,
  Grid,
} from '@mui/material';
import { CommonCard, Loader } from '@shared-lib';
import React, { memo } from 'react';
import { ContentSearchResponse } from '../services/Search';
import AppConst from '../utils/AppConst/AppConst';

const RenderTabContent = memo(
  ({
    contentData,
    _grid,
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
  }: {
    contentData: ContentSearchResponse[];
    _grid: any;
    trackData?: [];
    type: string;
    handleCardClick: (content: ContentSearchResponse) => void;
    hasMoreData: boolean;
    handleLoadMore: (e: any) => void;
    tabs?: any[];
    value?: number;
    onChange?: (event: React.SyntheticEvent, newValue: number) => void;
    ariaLabel?: string;
    isLoadingMoreData: boolean;
    isPageLoading: boolean;
    _card?: any;
  }) => {
    return (
      <Box sx={{ width: '100%' }}>
        {tabs?.length !== undefined && tabs?.length > 1 && (
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={value ?? 0}
              onChange={onChange}
              aria-label={ariaLabel}
              TabIndicatorProps={{
                style: {
                  backgroundColor: '#6750A4',
                  height: '3px',
                  maxWidth: 49,
                  width: '100%',
                  marginLeft: '1.2rem',
                },
              }}
              sx={{
                '.MuiTab-root': {
                  color: '#49454F', // Default tab text color
                  fontWeight: 500,
                  textTransform: 'none', // Ensures text remains camel case
                },
                '.Mui-selected': {
                  color: '#6750A4 !important', // Selected tab text color
                },
              }}
            >
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
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          <Loader
            isLoading={isPageLoading}
            layoutHeight={197}
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
                    <CommonCard
                      minheight="100%"
                      title={(item?.name || '').trim()}
                      image={
                        item?.posterImage && item?.posterImage !== 'undefined'
                          ? item?.posterImage
                          : `${AppConst.BASEPATH}/assests/images/image_ver.png`
                      }
                      content={item?.description || '-'}
                      actions={item?.contentType}
                      // subheader={item?.contentType}
                      orientation="horizontal"
                      item={item}
                      TrackData={trackData}
                      type={type}
                      onClick={() => handleCardClick(item)}
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
                      'Load More'
                    )}
                  </Button>
                ) : (
                  <Typography variant="body1">
                    No more data available
                  </Typography>
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
