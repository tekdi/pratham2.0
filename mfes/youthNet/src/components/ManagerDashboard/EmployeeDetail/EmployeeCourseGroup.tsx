import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { EmployeeCourseGroupProps } from '../../../utils/Interface';
import { getThinScrollbarSx } from '../../../utils/scrollbarSx';
import EmployeeCourseRow from './EmployeeCourseRow';

const EmployeeCourseGroup: React.FC<EmployeeCourseGroupProps> = ({
  titleKey,
  courses,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  if (courses.length === 0) return null;

  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          fontSize: '12px',
          mb: 0,
          borderBottom: '1px solid #E0E0E0',
          pb: 0.5,
        }}
      >
        {t(titleKey, { count: courses.length })}
      </Typography>
      <Box
        maxHeight={'400px'}
        sx={{ overflowY: 'auto', overflowX: 'auto', ...getThinScrollbarSx(theme) }}
      >
        <Box sx={{ minWidth: 640 }}>
          {courses.map((course) => (
            <EmployeeCourseRow key={course.courseId} course={course} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EmployeeCourseGroup;
