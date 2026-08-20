import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { EmployeeCourseBreakdownProps } from '../../../utils/Interface';
import NoDataFound from '../../common/NoDataFound';
import EmployeeCourseGroup from './EmployeeCourseGroup';

const EmployeeCourseBreakdown: React.FC<EmployeeCourseBreakdownProps> = ({ groups }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const isEmpty = groups.mandatory.length === 0 && groups.nonMandatory.length === 0;

  return (
    <Box
      sx={{
        backgroundColor: 'white',
        borderRadius: 2,
        border: `1px solid ${theme.palette.warning['A100']}`,
        p: { xs: 1.5, sm: 2 },
      }}
    >
      <Typography
        variant="body1"
        color={'warning.100'}
        fontWeight={600}
        sx={{ mb: 0.25 }}
      >
        {t('MANAGER_OVERVIEW.COURSE_BREAKDOWN_SECTION_TITLE')}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: '12px', maxWidth: 400, mb: 1.5 }}
      >
        {t('MANAGER_OVERVIEW.COURSE_BREAKDOWN_SECTION_SUBTITLE')}
      </Typography>

      {isEmpty ? (
        <NoDataFound title="MANAGER_OVERVIEW.NO_COURSE_ENTRIES" />
      ) : (
        <Stack spacing={2.5}>
          <EmployeeCourseGroup
            titleKey="MANAGER_OVERVIEW.MANDATORY_ENTRIES"
            courses={groups.mandatory}
          />
          <EmployeeCourseGroup
            titleKey="MANAGER_OVERVIEW.NON_MANDATORY_ENTRIES"
            courses={groups.nonMandatory}
          />
        </Stack>
      )}
    </Box>
  );
};

export default EmployeeCourseBreakdown;
