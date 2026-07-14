import { Box, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'next-i18next';

interface NoDataFoundProps {
  title?: string;
  bgColor?: string;
}

const NoDataFound: React.FC<NoDataFoundProps> = ({
  title = 'COMMON.NO_DATA_FOUND',
  bgColor
}) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        width: '100%',
        bgcolor: bgColor,
      }}
    >
      <Typography
        style={{ fontWeight: '500', textAlign: 'center', width: '100%' }}
      >
        {t(title,'No Data Found')}
      </Typography>
    </Box>
  );
};

export default NoDataFound;
