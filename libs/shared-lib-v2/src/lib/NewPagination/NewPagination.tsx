import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTranslation } from 'next-i18next';

export interface NewPaginationProps {
  count: number;
  page: number;
  onPageChange: (value: number) => void;
  color?: 'primary' | 'secondary' | 'standard';
  fetchMoreData?: () => void;
  TotalCount: number;
  hasMore?: boolean;
  items?: React.ReactNode[]; // Legacy: only its length is read. Prefer `dataLength`.
  /** How many rows are currently shown, for the mobile infinite scroll. */
  dataLength?: number;
  /** Show the "Go to page" input + Go button beside the page numbers. Default true. */
  showGoToPage?: boolean;
  /** Show the jump-to-first / jump-to-last arrows. Default true. */
  showFirstLastButtons?: boolean;
  /** Rows per page. Supply it to get the built-in "Showing x - y of z" label. */
  pageSize?: number;
  /** Noun for the built-in label, e.g. "learners". */
  itemsLabel?: string;
  /** Replaces the built-in label entirely, for callers with their own i18n key. */
  rangeLabel?: React.ReactNode;
  /** Page-size choices. Supply both this and `onPageSizeChange` to show the selector. */
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

const NewPagination: React.FC<NewPaginationProps> = ({
  count,
  page,
  onPageChange,
  color = 'primary',
  fetchMoreData,
  hasMore = true,
  TotalCount = 0,
  items = [],
  dataLength,
  showGoToPage = true,
  showFirstLastButtons = true,
  pageSize,
  itemsLabel,
  rangeLabel,
  pageSizeOptions,
  onPageSizeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const [goToValue, setGoToValue] = useState('');

  // Validated on every keystroke, so the error shows and Go stays disabled
  // before the user ever clicks.
  const targetPage = Number(goToValue);
  const isEmpty = goToValue === '';
  const isOutOfRange = !isEmpty && (targetPage < 1 || targetPage > count);
  const canGo = !isEmpty && !isOutOfRange;

  const rangeMessage = `${t('COMMON.ENTER_PAGE_BETWEEN', {
    defaultValue: 'Enter a page between',
  })} 1 - ${count}`;

  // Digits only, so the field can never hold a value we can't parse.
  const handleGoToChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGoToValue(event.target.value.replace(/\D/g, ''));
  };

  const handleGo = () => {
    if (!canGo) return;
    setGoToValue('');
    if (targetPage !== page) onPageChange(targetPage);
  };

  const handleGoKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleGo();
    }
  };

  // `items` is never rendered; only its length was ever used. `dataLength` replaces it.
  const shownCount = dataLength ?? items.length;

  // Built from parts rather than an i18n placeholder, so it can't render a raw {{var}}.
  const builtInRangeLabel =
    pageSize && TotalCount > 0
      ? `${t('COMMON.SHOWING', { defaultValue: 'Showing' })} ${
          (page - 1) * pageSize + 1
        } - ${Math.min(page * pageSize, TotalCount)} ${t('COMMON.OF', {
          defaultValue: 'of',
        })} ${TotalCount}${itemsLabel ? ` ${itemsLabel}` : ''}`
      : null;

  const leftLabel = rangeLabel ?? builtInRangeLabel;

  const showPageSizeSelector = Boolean(
    pageSize && pageSizeOptions?.length && onPageSizeChange
  );

  // One height for every control in the row, so the labels line up with the
  // inputs instead of being pushed off-centre by MUI's differing defaults.
  const CONTROL_HEIGHT = 36;
  const labelSx = {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap' as const,
    display: 'flex',
    alignItems: 'center',
    minHeight: CONTROL_HEIGHT,
    lineHeight: 1,
    // Typography body2 renders a <p>, which carries a browser default margin.
    m: 0,
  };

  // Only swap to infinite scroll when the caller can actually load more; without
  // `fetchMoreData` this would render nothing and strand mobile users on page 1.
  if (isMobile && fetchMoreData) {
    return (
      <InfiniteScroll
        dataLength={shownCount}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={shownCount >= TotalCount ? '' : <h4>{t('COMMON.LOADING')}...</h4>}
        // endMessage={
        //     <p style={{ textAlign: 'center' }}>You have seen all data!</p>
        // }
      >
        {null}
      </InfiniteScroll>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      justifyContent={
        leftLabel || showPageSizeSelector ? 'space-between' : 'flex-end'
      }
      flexWrap="wrap"
      useFlexGap
      sx={{ width: '100%' }}
    >
      {(showPageSizeSelector || leftLabel) && (
        <Stack direction="row" spacing={1.5} alignItems="center" useFlexGap>
          {showPageSizeSelector && (
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2" sx={labelSx}>
                {t('COMMON.ROWS_PER_PAGE', { defaultValue: 'Rows per page' })}:
              </Typography>
              <Select
                size="small"
                value={pageSize}
                onChange={(event) =>
                  onPageSizeChange?.(Number(event.target.value))
                }
                inputProps={{
                  'aria-label': t('COMMON.ROWS_PER_PAGE', {
                    defaultValue: 'Rows per page',
                  }),
                }}
                sx={{
                  height: CONTROL_HEIGHT,
                  borderRadius: '8px',
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    py: 0,
                  },
                }}
              >
                {pageSizeOptions?.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          {leftLabel && (
            <Typography variant="body2" sx={{ ...labelSx, fontWeight: 500 }}>
              {leftLabel}
            </Typography>
          )}
        </Stack>
      )}

      <Stack
        direction="row"
        spacing={1.5}
        alignItems="center"
        flexWrap="wrap"
        useFlexGap
      >
        {showGoToPage && count > 1 && (
          <>
            <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" sx={labelSx}>
              {t('COMMON.GO_TO_PAGE', { defaultValue: 'Go to page' })}:
            </Typography>

            <TextField
              size="small"
              value={goToValue}
              onChange={handleGoToChange}
              onKeyDown={handleGoKeyDown}
              error={isOutOfRange}
              helperText={isOutOfRange ? rangeMessage : ''}
              inputProps={{
                inputMode: 'numeric',
                'aria-label': t('COMMON.GO_TO_PAGE', { defaultValue: 'Go to page' }),
                style: { textAlign: 'center', padding: '0 8px' },
              }}
              sx={{
                width: 64,
                '& .MuiOutlinedInput-root': {
                  height: CONTROL_HEIGHT,
                  borderRadius: '8px',
                },
                // Float the message so showing it never changes the row height.
                '& .MuiFormHelperText-root': {
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  margin: '2px 0 0',
                  whiteSpace: 'nowrap',
                },
              }}
            />

            <Button
              onClick={handleGo}
              disabled={!canGo}
              sx={{
                minWidth: 64,
                height: CONTROL_HEIGHT,
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: 600,
                px: 2,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.text.primary,
                '&:hover': { backgroundColor: theme.palette.primary.dark },
                '&.Mui-disabled': {
                  backgroundColor: theme.palette.action.disabledBackground,
                },
              }}
            >
              {t('COMMON.GO', { defaultValue: 'Go' })}
            </Button>
          </Box>

            <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          </>
        )}

        <Pagination
          count={count}
          page={page}
          onChange={(event, value) => onPageChange(value)}
          color={color}
          showFirstButton={showFirstLastButtons}
          showLastButton={showFirstLastButtons}
          siblingCount={1}
          boundaryCount={1}
        />
      </Stack>
    </Stack>
  );
};

export { NewPagination };
export default NewPagination;
