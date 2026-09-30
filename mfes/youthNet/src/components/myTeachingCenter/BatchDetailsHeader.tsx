import React from 'react';
import { Box, Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { useTranslation } from 'next-i18next';
import { MyTeachingCenterBatch } from '../../utils/Interfaces';

interface BatchDetailsHeaderProps {
  batch: MyTeachingCenterBatch;
}

// Summary card at the top of the Batch Details page — batch name, center ·
// domain · course, date range, and learner count, with a helper line above
// the Learner List below it.
const BatchDetailsHeader: React.FC<BatchDetailsHeaderProps> = ({ batch }) => {
  const { t } = useTranslation();
  const dateRange =
    batch.startDate && batch.endDate ? `${batch.startDate} → ${batch.endDate}` : null;

  return (
    <Box
      sx={{
        background: '#fff',
        border: '1px solid #EBE1D4',
        borderRadius: '16px',
        p: 3,
        mb: 3,
      }}
    >
      <Typography variant="h5" fontWeight={700}>
        {batch.name}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {[batch.centerName, batch.domain, batch.skill].filter(Boolean).join(' · ')}
      </Typography>

      <Box display="flex" flexWrap="wrap" alignItems="center" gap={3} sx={{ mt: 1.5 }}>
        {dateRange && (
          <Box display="flex" alignItems="center" gap={0.5}>
            <CalendarTodayOutlinedIcon fontSize="small" color="action" />
            <Typography variant="body2" sx={{ mb: 0 }}>{dateRange}</Typography>
          </Box>
        )}
        <Box display="flex" alignItems="center" gap={0.5}>
          <GroupsOutlinedIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ mb: 0 }}>
            {t('MY_TEACHING_CENTER.LEARNER_COUNT', { count: batch.learnerCount || 0 })}
          </Typography>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
        {t('MY_TEACHING_CENTER.LEARNER_LIST_HELPER')}
      </Typography>
    </Box>
  );
};

export default BatchDetailsHeader;
