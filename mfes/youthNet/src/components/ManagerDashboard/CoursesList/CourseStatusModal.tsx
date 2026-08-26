import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CourseStatusModalProps } from '../../../utils/Interface';
import {
  getCourseDisplayName,
  getCourseLanguageLabel,
  getCourseTypeValue,
  getUserInitials,
  isHighAttempt,
} from '../../../utils/managerDashboardHelpers';
import { COURSE_STATUS_LABEL_KEYS } from '../../../utils/app.config';
import Modal from '../../common/Modal';
import NoDataFound from '../../common/NoDataFound';

const CourseStatusModal: React.FC<CourseStatusModalProps> = ({
  open,
  onClose,
  course,
  status,
  users,
  onUserClick,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  if (!course || !status) return null;

  const courseName = getCourseDisplayName(course, course.identifier);
  const language = getCourseLanguageLabel(course);
  const statusLabel = t(COURSE_STATUS_LABEL_KEYS[status]);
  const courseTypeLabel =
    getCourseTypeValue(course.courseType).toLowerCase() === 'mandatory'
      ? t('MANAGER_OVERVIEW.MANDATORY')
      : t('MANAGER_OVERVIEW.NON_MANDATORY');

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${courseName} (${language})`}
      subtitle={t('MANAGER_OVERVIEW.STATUS_MODAL_SUBTITLE', {
        courseType: courseTypeLabel,
        status: statusLabel,
      })}
      sx={{ maxWidth: '600px', width: 'calc(100% - 15px)' }}
      headerExtra={
        <Box
          sx={{
            display: 'inline-flex',
            px: 1.25,
            py: 0.5,
            borderRadius: '999px',
            backgroundColor:
              theme.palette.dashboardStatusBackground?.[status] ?? `${theme.palette.dashboardStatus[status]}26`,
            color: theme.palette.dashboardStatus[status],
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          {statusLabel} · {t('MANAGER_OVERVIEW.PEOPLE_COUNT', { count: users.length })}
        </Box>
      }
    >
      {users.length === 0 ? (
        <NoDataFound title="MANAGER_OVERVIEW.NO_USERS_FOR_STATUS" />
      ) : (
        <Stack spacing={1}>
          {users.map(({ user, highestAttempt, issuedOn }) => {
            // toLocaleDateString with no timeZone override renders in the viewer's local zone.
            const issuedOnLabel =
              status === 'certificateIssued' && issuedOn
                ? new Date(issuedOn).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                : null;

            return (
              <Stack
                key={user.userId}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                onClick={() => onUserClick(user.userId, course.identifier)}
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  backgroundColor: theme.palette.warning['800'],
                  cursor: 'pointer'
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      backgroundColor:
                        theme.palette.dashboardStatusBackground?.[status] ??
                        `${theme.palette.dashboardStatus[status]}26`,
                      color: theme.palette.dashboardStatus[status],
                      fontWeight: 600,
                      fontSize: '13px',
                    }}
                  >
                    {getUserInitials(user.name || user.userId)}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      mb={0}
                      sx={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                    >
                      {user.name}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
                  {isHighAttempt(highestAttempt) && (
                    <Stack direction="row" spacing={0.25} alignItems="center">
                      <BoltIcon sx={{ fontSize: 14, color: theme.palette.dashboardStatus.highAttempts }} />
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.dashboardStatus.highAttempts, fontWeight: 600 }}
                      >
                        {t('MANAGER_OVERVIEW.ATTEMPTS_COUNT', { count: highestAttempt })}
                      </Typography>
                    </Stack>
                  )}
                  {issuedOnLabel && (
                    <Stack direction="row" spacing={0.25} alignItems="center">
                      <VerifiedIcon sx={{ fontSize: 14, color: theme.palette.dashboardStatus.certificateIssued }} />
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.dashboardStatus.certificateIssued, fontWeight: 600 }}
                      >
                        {issuedOnLabel}
                      </Typography>
                    </Stack>
                  )}
                  <ChevronRightIcon fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      )}
    </Modal>
  );
};

export default CourseStatusModal;
