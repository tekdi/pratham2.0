import React, { memo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ContentItem, useTranslation } from '@shared-lib';
import ContentCard from './ContentCard';
import { ContentSearchResponse } from '@content-mfes/services/Search';

interface ContentCardGridProps {
  contentData: ContentSearchResponse[];
  _config: any;
  type: string;
  handleCardClick: (content: ContentItem, e?: any, rowNumber?: number) => void;
  trackData?: any[];
  hasMoreData: boolean;
  handleLoadMore: (e: any) => void;
  isLoadingMoreData: boolean;
  pageName?: string;
}

const ContentCardGrid = memo((props: ContentCardGridProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('xl'));

  // Calculate items per row based on breakpoints and _grid overrides
  const getItemsPerRow = () => {
    // Default breakpoint values
    const defaultBreakpoints = {
      xs: 6,
      sm: 6,
      md: 4,
      lg: 3,
      xl: 2.4,
    };

    // Get actual breakpoint values considering _grid overrides
    const actualBreakpoints = {
      xs: _grid?.xs ?? defaultBreakpoints.xs,
      sm: _grid?.sm ?? defaultBreakpoints.sm,
      md: _grid?.md ?? defaultBreakpoints.md,
      lg: _grid?.lg ?? defaultBreakpoints.lg,
      xl: _grid?.xl ?? defaultBreakpoints.xl,
    };

    // Calculate items per row based on current breakpoint and actual grid values
    // Grid system: 12 columns total, so items per row = 12 / grid_value
    if (isXs) return Math.floor(12 / actualBreakpoints.xs);
    if (isSm) return Math.floor(12 / actualBreakpoints.sm);
    if (isMd) return Math.floor(12 / actualBreakpoints.md);
    if (isLg) return Math.floor(12 / actualBreakpoints.lg);
    if (isXl) return Math.floor(12 / actualBreakpoints.xl);

    return Math.floor(12 / actualBreakpoints.xs); // default fallback
  };

  const calculateRowNumber = (index: number) => {
    const itemsPerRow = getItemsPerRow();
    const rowNumber = Math.floor(index / itemsPerRow) + 1; // +1 to make it 1-indexed

    // Get current breakpoint name for debugging
    const currentBreakpoint = isXs
      ? 'xs'
      : isSm
      ? 'sm'
      : isMd
      ? 'md'
      : isLg
      ? 'lg'
      : 'xl';
    const currentGridValue =
      _grid?.[currentBreakpoint] ??
      (currentBreakpoint === 'xs'
        ? 6
        : currentBreakpoint === 'sm'
        ? 6
        : currentBreakpoint === 'md'
        ? 4
        : currentBreakpoint === 'lg'
        ? 3
        : 2.4);

    // For testing - you can remove this console.log later
    console.log(
      `Item ${
        index + 1
      } is in row ${rowNumber} (${itemsPerRow} items per row on ${currentBreakpoint} breakpoint, grid value: ${currentGridValue})`
    );

    return rowNumber;
  };

  const { default_img, _subBox, _grid, _containerGrid, _card } =
    props._config ?? {};

  return (
    <Box {..._subBox} sx={{ ...(_subBox?.sx ?? {}) }}>
      <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} {..._containerGrid}>
        {props.contentData?.map((item: any, index: number) => (
          <Grid
            key={item?.identifier}
            id={`${props?.pageName}-${item?.identifier}`}
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            {..._grid}
          >
            <ContentCard
              item={item}
              type={props.type}
              default_img={default_img}
              _card={_card}
              handleCardClick={(e?: any) =>
                props.handleCardClick(item, e, calculateRowNumber(index))
              }
              trackData={props.trackData as [] | undefined}
            />
          </Grid>
        ))}
      </Grid>
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {props.hasMoreData && (
          <Button
            variant="contained"
            onClick={props.handleLoadMore}
            disabled={props.isLoadingMoreData}
          >
            {props.isLoadingMoreData ? (
              <CircularProgress size={20} />
            ) : (
              t('LEARNER_APP.CONTENT_TABS.LOAD_MORE')
            )}
          </Button>
        )}
      </Box>
      {!props.contentData?.length && (
        <Typography
          variant="body1"
          sx={{
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...(props._config?._noData?.sx ?? {}),
          }}
        >
          {props._config?.noDataText ||
            t('LEARNER_APP.CONTENT_TABS.NO_MORE_DATA')}
        </Typography>
      )}
    </Box>
  );
});

ContentCardGrid.displayName = 'ContentCardGrid';

export default ContentCardGrid;
