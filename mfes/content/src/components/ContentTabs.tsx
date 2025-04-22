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
import { StatusIcon } from './CommonCollapse';

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
    handleCardClick: (content: ContentSearchResponse) => void;
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
    const { default_img, _card, ..._grid } = _config ?? {};
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
                          : default_img ??
                            `${AppConst.BASEPATH}/assests/images/image_ver.png`
                      }
                      content={item?.description || ''}
                      actions={
                        type !== 'Course' && (
                          <Box>
                            <StatusIcon
                              showMimeTypeIcon
                              mimeType={item?.mimeType}
                              _icon={{
                                isShowText: true,
                                _box: {
                                  py: '7px',
                                  px: '10px',
                                  borderRadius: '10px',
                                  borderWidth: '1px',
                                  borderStyle: 'solid',
                                  borderColor: '#79747E',
                                },
                              }}
                            />
                          </Box>
                        )
                      }
                      // subheader={item?.contentType}
                      orientation="horizontal"
                      item={item}
                      TrackData={trackData}
                      type={type}
                      onClick={() => handleCardClick(item)}
                      _card={_card}
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
                  isHideEmptyDataMessage && (
                    <Typography variant="body1">
                      No more data available
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
