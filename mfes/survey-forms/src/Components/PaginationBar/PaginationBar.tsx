'use client';

import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface Props {
  page: number;       // 1-based
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const PaginationBar: React.FC<Props> = ({ page, pageSize, total, onPrev, onNext }) => {
  const totalPages = total === 0 ? 1 : Math.ceil(total / pageSize);
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 0.5,
        mt: 1.5,
      }}
    >
      <Typography variant="body2" sx={{ color: '#5F5A53', userSelect: 'none' }}>
        {page} of {totalPages}
      </Typography>
      <IconButton size="small" onClick={onPrev} disabled={!hasPrev} aria-label="Previous page">
        <ChevronLeftIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" onClick={onNext} disabled={!hasNext} aria-label="Next page">
        <ChevronRightIcon fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default PaginationBar;
