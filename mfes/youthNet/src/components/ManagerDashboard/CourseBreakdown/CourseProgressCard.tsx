import React from 'react';
import { Box, ButtonBase, Stack, Tooltip, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VerifiedIcon from '@mui/icons-material/Verified';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CourseProgressCardProps } from '../../../utils/Interface';
import { getVisibleStatusSummaries } from '../../../utils/managerDashboardHelpers';
import { COURSE_CARD_STATUS_CONFIG } from '../../../utils/app.config';
import SegmentedProgressBar from '../SegmentedProgressBar';

// Maps each status key to a real MUI icon (in place of the plain ✓/◆/▶/○ glyphs) for a richer,
// more polished look on the Course Card's status summary line.
const STATUS_ICON_COMPONENTS: Record<string, React.ComponentType<{ sx?: object }>> = {
  certificateIssued: VerifiedIcon,
  completed: TaskAltIcon,
  inProgress: PlayCircleFilledIcon,
  notStarted: RadioButtonUncheckedIcon,
};

// One Course Card in the Course Breakdown list — the entire card is a single button that opens
// the Learners Modal (every non-zero status for this course). Status summaries below the bar are
// informational only, not separately clickable.
const CourseProgressCard: React.FC<CourseProgressCardProps> = ({ course, onCardClick }) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const summaries = getVisibleStatusSummaries(course.progress, COURSE_CARD_STATUS_CONFIG);

  return (
    <ButtonBase
      onClick={onCardClick}
      aria-label={`${course.courseName} (${course.language}) — ${t('MANAGER_OVERVIEW.CLICK_TO_VIEW_EMPLOYEES')}`}
      sx={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        p: 2,
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: 2,
        backgroundColor: 'white',
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1.5}>
        <Box sx={{ minWidth: 0 }}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Tooltip title={course.courseName} arrow>
              <Typography
                fontWeight={600}
                color={theme.palette.text.primary}
                sx={{
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: 220,
                }}
              >
                {course.courseName}
              </Typography>
            </Tooltip>
            <Box
              sx={{
                px: 1,
                py: 0.25,
                borderRadius: '4px',
                backgroundColor: theme.palette.secondary.light,
                fontSize: '11px',
                fontWeight: 700,
                color: theme.palette.secondary.main,
              }}
            >
              {course.language}
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px', mt: 0.25, mb: 0, fontWeight: 500 }}>
            {course.category ? `${course.category} · ` : ''}
            {t('MANAGER_OVERVIEW.CLICK_TO_VIEW_EMPLOYEES')}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <Box
            sx={{
              px: '8px',
              py: '3px',
              borderRadius: '20px',
              backgroundColor: theme.palette.warning['800'],
              fontSize: '10px',
              fontWeight: 600,
              color: theme.palette.text.secondary,
            }}
          >
            {course.isMandatory ? t('MANAGER_OVERVIEW.MANDATORY') : t('MANAGER_OVERVIEW.NON_MANDATORY')}
          </Box>
          <ChevronRightIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
        </Stack>
      </Stack>

      <Box sx={{ mt: 1.5 }}>
        <SegmentedProgressBar counts={course.progress} statusConfig={COURSE_CARD_STATUS_CONFIG} height={10} />
      </Box>

      {summaries.length > 0 && (
        <Stack direction="row" flexWrap="wrap" columnGap={2} rowGap={0.5} sx={{ mt: 1.25 }}>
          {summaries.map((summary) => {
            const StatusIcon = STATUS_ICON_COMPONENTS[summary.colorToken];
            return (
              <Stack key={summary.key} direction="row" spacing={0.5} alignItems="center">
                {StatusIcon && (
                  <StatusIcon sx={{ fontSize: 14, color: theme.palette.dashboardStatus[summary.colorToken] }} />
                )}
                <Typography
                  variant="body2"
                  sx={{ fontSize: '11px', color: theme.palette.dashboardStatus[summary.colorToken], fontWeight: 500, mb: 0 }}
                >
                  {summary.count} {t(summary.labelKey)}
                </Typography>
              </Stack>
            );
          })}
        </Stack>
      )}
    </ButtonBase>
  );
};

export default CourseProgressCard;
