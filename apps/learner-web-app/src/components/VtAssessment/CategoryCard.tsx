'use client';

import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useTranslation } from '@shared-lib';
import AssessmentStatusLine, { VtStatusIcon } from './AssessmentStatusLine';
import { getAssessmentTypeLabelKey } from './typeLabels';

interface CategoryCardProps {
  type: string;
  status?: string;
  percentage?: number | string;
  onClick: () => void;
}

/** One assessment category (Pre Test, Post Test, …) — mobile `TestBox`. */
const CategoryCard: React.FC<CategoryCardProps> = ({
  type,
  status,
  percentage,
  onClick,
}) => {
  const { t } = useTranslation();

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'stretch',
        border: '1px solid #D0C5B4',
        borderRadius: '8px',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        textAlign: 'left',
        mb: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#FFDEA1',
          px: { xs: 2, md: 3 },
          py: 2.5,
          flexShrink: 0,
        }}
      >
        <VtStatusIcon status={status} />
      </Box>
      <Box sx={{ flex: 1, px: 2, py: 1.5, minWidth: 0 }}>
        <Typography
          sx={{ fontSize: '16px', fontWeight: 500, color: '#1E1B16' }}
        >
          {t(getAssessmentTypeLabelKey(type), { defaultValue: type })}
        </Typography>
        <AssessmentStatusLine status={status} percentage={percentage} />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 1.5 }}>
        <NavigateNextIcon sx={{ fontSize: 32, color: '#1E1B16' }} />
      </Box>
    </ButtonBase>
  );
};

export default CategoryCard;
