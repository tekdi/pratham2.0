import React from 'react';
import { Box, Typography, Paper, Stack, useMediaQuery } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

interface CourseStatus {
  userId: string;
  courseId: string;
  status: 'completed' | 'inprogress';
}

interface CourseCompletionProps {
  mandatoryCourses: CourseStatus[];
  nonMandatoryCourses: CourseStatus[];
  userIds?: string[];
  mandatoryCourseIds?: string[];
  optionalCourseIds?: string[];
}

const CourseCompletion: React.FC<CourseCompletionProps> = ({
  mandatoryCourses,
  nonMandatoryCourses,
  userIds,
  mandatoryCourseIds,
  optionalCourseIds,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ✅ FINAL LOGIC WITH INPROGRESS SUPPORT
  const calculateUserCompletion = (
    courses: CourseStatus[],
    courseIds?: string[]
  ): ChartDataItem[] => {
    let completed = 0;
    let inProgress = 0;

    if (userIds && courseIds && userIds.length > 0 && courseIds.length > 0) {
      // user → completed courses
      const completedMap = new Map<string, Set<string>>();
      // user → any activity (completed OR inprogress)
      const activityMap = new Map<string, boolean>();

      courses.forEach((course) => {
        // track activity
        if (!activityMap.has(course.userId)) {
          activityMap.set(course.userId, false);
        }

        if (course.status === 'completed' || course.status === 'inprogress') {
          activityMap.set(course.userId, true);
        }

        // track completed
        if (course.status === 'completed') {
          if (!completedMap.has(course.userId)) {
            completedMap.set(course.userId, new Set());
          }
          completedMap.get(course.userId)?.add(course.courseId);
        }
      });

      userIds.forEach((userId) => {
        const completedCourses = completedMap.get(userId) || new Set();
        const hasActivity = activityMap.get(userId) || false;

        const completedCount = courseIds.filter((courseId) =>
          completedCourses.has(courseId)
        ).length;

        if (completedCount === courseIds.length) {
          // ✅ all completed
          completed++;
        } else if (hasActivity) {
          // ⏳ has at least one completed OR inprogress
          inProgress++;
        }
        // ❌ no activity → ignore
      });

    } else {
      // ✅ FALLBACK LOGIC
      completed = courses.filter(c => c.status === 'completed').length;
      inProgress = courses.filter(c => c.status === 'inprogress').length;
    }

    return [
      { name: t('COMPLETED'), value: completed, color: '#4CAF50' },
      { name: t('IN_PROGRESS'), value: inProgress, color: '#FFC107' },
    ];
  };

  const prepareMandatoryData = () =>
    calculateUserCompletion(mandatoryCourses, mandatoryCourseIds);

  const prepareNonMandatoryData = () =>
    calculateUserCompletion(nonMandatoryCourses, optionalCourseIds);

  const renderDonutChart = (data: ChartDataItem[], title: string) => {
    const backgroundData = [{ value: 100 }];
    const innerRadius = isMobile ? 38 : 48;
    const outerRadius = isMobile ? 55 : 68;

    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Typography variant="body2" fontWeight={500} color="text.secondary" gutterBottom>
          {title}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box sx={{ position: 'relative', height: 140, width: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={backgroundData}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  dataKey="value"
                  fill="#E0E0E0"
                />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={innerRadius}
                  outerRadius={outerRadius}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          <Stack spacing={1}>
            {data.map((item, index) => (
              <Stack key={index} direction="row" alignItems="center" spacing={1}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                  }}
                />
                <Typography variant="body2" color="primary">
                  {item.name} : {item.value}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid #E0E0E0',
        borderRadius: 2,
        height: '100%',
      }}
    >
      <Typography variant="subtitle1" fontWeight={600}>
        {t('COURSE_COMPLETION')}
      </Typography>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mt: 2 }}>
        {renderDonutChart(
          prepareMandatoryData(),
          t('MANDATORY_COURSES')
        )}
        {renderDonutChart(
          prepareNonMandatoryData(),
          t('NON_MANDATORY_COURSES')
        )}
      </Stack>
    </Paper>
  );
};

export default CourseCompletion;