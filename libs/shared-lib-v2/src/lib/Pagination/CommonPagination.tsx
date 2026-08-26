import * as React from 'react';
import { Box, Stack } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export interface CommonPaginationProps {
  /** 1-indexed current page. */
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** How many page numbers to show on each side of the current page. Default 1. */
  siblingCount?: number;
  firstLabel?: string;
  previousLabel?: string;
  nextLabel?: string;
  lastLabel?: string;
  disabled?: boolean;
}

const ELLIPSIS = '…' as const;

/** Classic "first, siblings-around-current, last, with ellipsis gaps" page-number range. */
const getPageRange = (
  currentPage: number,
  totalPages: number,
  siblingCount: number
): Array<number | typeof ELLIPSIS> => {
  const totalNumbersShown = siblingCount * 2 + 5; // first + last + current + 2 ellipses + siblings
  if (totalPages <= totalNumbersShown) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const range: Array<number | typeof ELLIPSIS> = [1];
  if (showLeftEllipsis) range.push(ELLIPSIS);
  for (let page = leftSibling; page <= rightSibling; page++) {
    if (page !== 1 && page !== totalPages) range.push(page);
  }
  if (showRightEllipsis) range.push(ELLIPSIS);
  range.push(totalPages);

  return range;
};

// Bordered-pill-button pagination (« First / ‹ Prev / page numbers / Next › / Last ») — a
// visual alternative to MUI's own `Pagination` for places that want the button-row look instead
// of circular page chips. Reusable across mfes: no app-specific colors, just `theme.palette`.
export const CommonPagination: React.FC<CommonPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  firstLabel = 'First',
  previousLabel = 'Prev',
  nextLabel = 'Next',
  lastLabel = 'Last',
  disabled = false,
}) => {
  const theme = useTheme<any>();

  if (totalPages <= 1) return null;

  const pageRange = getPageRange(currentPage, totalPages, siblingCount);
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const baseButtonSx = {
    minWidth: 0,
    height: 32,
    px: 1.25,
    borderRadius: '8px',
    border: `1px solid ${
      theme.palette.warning?.['700'] ?? theme.palette.divider
    }`,
    backgroundColor: 'white',
    color: theme.palette.text.secondary,
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none' as const,
    '&:hover': { borderColor : theme.palette.dashboardStatus?.inProgress },
    '&:disabled': { opacity: 0.5, cursor: 'default', backgroundColor: 'white', borderColor: theme.palette.divider },
  };

  return (
    <Stack direction="row" gap={0.75} alignItems="center" component="nav" aria-label="pagination" flexWrap={'wrap'}>
      <Box
        component="button"
        type="button"
        disabled={disabled || isFirstPage}
        onClick={() => goTo(1)}
        sx={baseButtonSx}
      >
        « {firstLabel}
      </Box>
      <Box
        component="button"
        type="button"
        disabled={disabled || isFirstPage}
        onClick={() => goTo(currentPage - 1)}
        sx={baseButtonSx}
      >
        ‹ {previousLabel}
      </Box>

      {pageRange.map((page, index) =>
        page === ELLIPSIS ? (
          <Box
            key={`ellipsis-${page}-${index}`}
            sx={{ px: 0.5, color: theme.palette.text.disabled, fontSize: '13px' }}
          >
            {ELLIPSIS}
          </Box>
        ) : (
          <Box
            key={page}
            component="button"
            type="button"
            disabled={disabled}
            onClick={() => goTo(page)}
            sx={{
              ...baseButtonSx,
              minWidth: 32,
              px: 0,
              ...(page === currentPage && {
                backgroundColor: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': { borderColor : theme.palette.dashboardStatus?.inProgress },
              }),
            }}
          >
            {page}
          </Box>
        )
      )}

      <Box
        component="button"
        type="button"
        disabled={disabled || isLastPage}
        onClick={() => goTo(currentPage + 1)}
        sx={baseButtonSx}
      >
        {nextLabel} ›
      </Box>
      <Box
        component="button"
        type="button"
        disabled={disabled || isLastPage}
        onClick={() => goTo(totalPages)}
        sx={baseButtonSx}
      >
        {lastLabel} »
      </Box>
    </Stack>
  );
};

export default CommonPagination;
