import React, { memo, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
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

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const isRequestingRef = useRef<boolean>(false);

  // Reset request lock when loading completes
  useEffect(() => {
    if (!props.isLoadingMoreData) {
      isRequestingRef.current = false;
    }
  }, [props.isLoadingMoreData]);
  const triggerLoadMore = () =>
    props.handleLoadMore({
      preventDefault: () => {},
      stopPropagation: () => {},
    } as any);

  useEffect(() => {
    if (!props.hasMoreData) return;
    if (props.isLoadingMoreData) return;
    if (!props.contentData || props.contentData.length === 0) return; // wait for first page
    if (typeof window === 'undefined') return; // SSR safeguard
    const node = sentinelRef.current;
    if (!node) return;

    let observer: IntersectionObserver | null = null;

    const onIntersect: IntersectionObserverCallback = (entries) => {
      const first = entries[0];
      if (
        first.isIntersecting &&
        !props.isLoadingMoreData &&
        !isRequestingRef.current &&
        props.hasMoreData
      ) {
        isRequestingRef.current = true;
        triggerLoadMore();
      }
    };

    if (!('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(onIntersect, {
      root: null,
      rootMargin: '400px',
      threshold: 0,
    });
    observer.observe(node);

    return () => {
      if (observer && node) {
        observer.unobserve(node);
        observer.disconnect();
      }
    };
  }, [
    props.hasMoreData,
    props.isLoadingMoreData,
    props.handleLoadMore,
    props.contentData?.length,
  ]);
console.log("props.contentData",props.contentData)
  return (
    <Box {..._subBox} sx={{ ...(_subBox?.sx ?? {}) }}>
      <Grid container spacing={{ xs: 2, sm: 2, md: 2 }} {..._containerGrid}>
        {props.contentData?.map((item: any, index: number) => (
          <Grid
            key={item?.identifier}
            id={`${props?.pageName}-${item?.identifier}`}
            item
            xs={6}
            sm={6}
            md={4}
            lg={3}
            xl={2.4}
            {..._grid}
            sx={{ display: 'flex', ...(_grid?.sx ?? {}) }}
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
          <div ref={sentinelRef} style={{ height: 1, width: '100%' }} />
        )}
        {props.isLoadingMoreData && <CircularProgress size={20} />}
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
