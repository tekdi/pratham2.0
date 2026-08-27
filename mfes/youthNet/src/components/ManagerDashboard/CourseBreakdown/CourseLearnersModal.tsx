import React from 'react';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import ButtonBase from '@mui/material/ButtonBase';
import BoltIcon from '@mui/icons-material/Bolt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { CourseLearnersModalProps } from '../../../utils/Interface';
import {
  getCourseDisplayName,
  getCourseLanguageLabel,
  getCourseLearnersByStatus,
  getCourseTypeLabel,
  getUserDisplayName,
  getUserInitials,
  isHighAttempt,
} from '../../../utils/managerDashboardHelpers';
import { COURSE_CARD_STATUS_CONFIG } from '../../../utils/app.config';
import Modal from '../../common/Modal';
import NoDataFound from '../../common/NoDataFound';

// Shows every non-zero status group for one course — opened by clicking the course card — derived
// entirely from the already-loaded courseLearningSummary/userById, no separate fetch or
// duplicated learner list in state.
const CourseLearnersModal: React.FC<CourseLearnersModalProps> = ({
  open,
  onClose,
  course,
  courseLearningSummary,
  userById,
  onViewEmployee,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  if (!course) return null;

  const courseName = getCourseDisplayName(course, course.identifier);
  const language = getCourseLanguageLabel(course);
  const courseTypeLabel = t(getCourseTypeLabel(course));

  const groups = COURSE_CARD_STATUS_CONFIG.map((config) => ({
    config,
    learners: getCourseLearnersByStatus(course.identifier, config.key, courseLearningSummary, userById),
  })).filter((group) => group.learners.length > 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${courseName} (${language})`}
      subtitle={`${courseTypeLabel} · ${t('MANAGER_OVERVIEW.CLICK_EMPLOYEE_SUBTITLE')}`}
      sx={{ maxWidth: '600px', width: 'calc(100% - 15px)' }}
    >
      {groups.length === 0 ? (
        <NoDataFound title="MANAGER_OVERVIEW.NO_USERS_FOR_STATUS" />
      ) : (
        <Stack spacing={2.5}>
          {groups.map(({ config, learners }) => (
            <Box key={config.key}>
              <Box
                sx={{
                  display: 'inline-flex',
                  px: 1.25,
                  py: 0.5,
                  mb: 1,
                  borderRadius: '999px',
                  backgroundColor:
                    theme.palette.dashboardStatusBackground?.[config.colorToken] ??
                    `${theme.palette.dashboardStatus[config.colorToken]}26`,
                  color: theme.palette.dashboardStatus[config.colorToken],
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {t(config.labelKey)} · {t('MANAGER_OVERVIEW.PEOPLE_COUNT', { count: learners.length })}
              </Box>

              <Stack spacing={1}>
                {learners.map(({ user, highestAttempt, issuedOn }) => {
                  const displayName = getUserDisplayName(user, user.userId);
                  // toLocaleDateString with no timeZone override renders in the viewer's local zone.
                  const issuedOnLabel =
                    config.key === 'certificateIssued' && issuedOn
                      ? new Date(issuedOn).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : null;
                  return (
                    <ButtonBase
                      key={user.userId}
                      onClick={() => onViewEmployee(user.userId)}
                      sx={{
                        width: '100%',
                        justifyContent: 'space-between',
                        p: 1.25,
                        borderRadius: 2,
                        backgroundColor: theme.palette.warning['800']
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                        <Avatar
                          sx={{
                            width: 36,
                            height: 36,
                            backgroundColor:
                              theme.palette.dashboardStatusBackground?.[config.colorToken] ??
                              `${theme.palette.dashboardStatus[config.colorToken]}26`,
                            color: theme.palette.dashboardStatus[config.colorToken],
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          {getUserInitials(displayName)}
                        </Avatar>
                        <Box sx={{ minWidth: 0, textAlign: 'left' }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            mb={0}
                            sx={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textTransform: 'capitalize' }}
                          >
                            {displayName}
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
                    </ButtonBase>
                  );
                })}
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Modal>
  );
};

export default CourseLearnersModal;
