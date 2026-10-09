import { BatchInfo, CrossCenterBatchDetail } from '@/utils/crossCenter';
import { EventStatus } from '@/utils/app.constant';
import { convertUTCToIST, toPascalCase } from '@/utils/helper';
import { isEliminatedFromBuild } from '../../featureEliminationUtil';
import { DaysOfWeek } from '../../app.config';
import CenterSessionModal from './CenterSessionModal';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlined from '@mui/icons-material/EditOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import LockOutlined from '@mui/icons-material/LockOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Divider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React, { ComponentType, useState } from 'react';

let SessionCardFooter: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('SessionCardFooter', 'component')) {
  SessionCardFooter = dynamic(() => import('./SessionCardFooter'), {
    ssr: false,
  });
}

export const getSessionTitle = (subject?: string, sessionTitle?: string) => {
  return subject && sessionTitle
    ? `${toPascalCase(subject)} - ${sessionTitle}`
    : subject
    ? toPascalCase(subject)
    : toPascalCase(sessionTitle || '');
};

const dayNameByIndex: Record<number, string> = {};
Object.entries(DaysOfWeek).forEach(([name, idx]) => {
  dayNameByIndex[idx as unknown as number] = name;
});

/** e.g. "Every Mon, Wed until 28 Oct 2026", or null for a one-time session. */
const getRecurrenceSummary = (event: any): string | null => {
  if (!event?.isRecurring || !event?.recurrencePattern) return null;
  const days = (event.recurrencePattern.daysOfWeek || [])
    .map((idx: number) => dayNameByIndex[idx])
    .filter(Boolean)
    .join(', ');
  const endValue = event.recurrencePattern.endCondition?.value;
  const endDate = endValue ? convertUTCToIST(endValue).date : '';
  if (!days) return null;
  return endDate ? `Every ${days} until ${endDate}` : `Every ${days}`;
};

export const CrossCenterSessionCard: React.FC<{
  event: any;
  batchCount: number;
  centerCount: number;
  currentUserId: string;
  primaryBatch?: BatchInfo;
  batchDetails?: CrossCenterBatchDetail[];
  onCopy: () => void;
  onEdit: (event: any) => void;
  onTopicUpdated: () => void;
}> = ({
  event,
  batchCount,
  centerCount,
  currentUserId,
  primaryBatch,
  batchDetails,
  onCopy,
  onEdit,
  onTopicUpdated,
}) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const startDateTime = convertUTCToIST(event?.startDateTime);
  const endDateTime = convertUTCToIST(event?.endDateTime);
  const subject = event?.metadata?.subject;
  const sessionTitle = event?.shortDescription;
  const creatorId = event?.createdBy ?? event?.metadata?.createdBy;
  const creatorName = event?.metadata?.teacherName;
  const meetingUrl = event?.meetingDetails?.url;
  const recurrenceSummary = getRecurrenceSummary(event);

  // Same UPCOMING/LIVE/PASSED computation as SessionCard.tsx, so edit is
  // only offered while it makes sense (matches the existing 538fed8b
  // creator-only-edit pattern, plus the completed-session lock).
  const now = new Date();
  const eventStart = new Date(event?.startDateTime);
  const eventEnd = new Date(event?.endDateTime);
  const eventStatus =
    now < eventStart
      ? EventStatus.UPCOMING
      : now <= eventEnd
      ? EventStatus.LIVE
      : EventStatus.PASSED;
  const canEditSession =
    creatorId === currentUserId && eventStatus === EventStatus.UPCOMING;

  const handleCopyUrl = () => {
    if (meetingUrl) {
      navigator.clipboard.writeText(meetingUrl).then(onCopy);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.warning['A100']}`,
        borderRadius: '8px',
        padding: '12px 16px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        <Typography
          color={theme.palette.warning['300']}
          fontWeight={400}
          fontSize={'16px'}
          className="one-line-text"
        >
          {getSessionTitle(subject, sessionTitle)}
        </Typography>
        {canEditSession && (
          <EditOutlined
            onClick={() => onEdit(event)}
            sx={{ cursor: 'pointer', fontSize: '20px', flexShrink: 0 }}
          />
        )}
        {eventStatus === EventStatus.PASSED && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              flexShrink: 0,
              color: theme.palette.warning['400'],
            }}
          >
            <LockOutlined sx={{ fontSize: '16px' }} />
            <Typography fontSize={'12px'}>
              {t('CENTER_SESSION.COMPLETED')}
            </Typography>
          </Box>
        )}
      </Box>
      <Typography
        fontWeight={400}
        fontSize={'14px'}
        sx={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}
        gap={'4px'}
      >
        <CalendarMonthIcon sx={{ fontSize: '18px' }} /> {startDateTime.date},{' '}
        {startDateTime.time} - {endDateTime.time}
      </Typography>
      <Typography
        fontWeight={400}
        fontSize={'14px'}
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginTop: '4px',
          color: theme.palette.warning['400'],
        }}
        gap={'4px'}
      >
        <GroupsIcon sx={{ fontSize: '18px' }} />
        {t('CENTER_SESSION.BATCH_CENTER_COVERAGE', {
          batchCount,
          centerCount,
        })}
      </Typography>
      {meetingUrl && (
        <Box
          sx={{
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
          onClick={handleCopyUrl}
        >
          <Box
            className="one-line-text"
            sx={{
              fontSize: '14px',
              color: theme.palette.secondary.main,
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <a
              href={meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: theme.palette.secondary.main,
                textDecoration: 'none',
              }}
            >
              {meetingUrl}
            </a>
          </Box>
          <ContentCopyIcon
            sx={{ fontSize: '18px', color: theme.palette.secondary.main }}
          />
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '8px',
          gap: '8px',
        }}
      >
        <Typography
          fontWeight={400}
          fontSize={'12px'}
          color={theme.palette.warning['400']}
        >
          {creatorId === currentUserId
            ? t('CENTER_SESSION.CREATED_BY_YOU')
            : t('CENTER_SESSION.CREATED_BY', { name: creatorName || '' })}
        </Typography>
        <Typography
          fontWeight={500}
          fontSize={'12px'}
          color={theme.palette.secondary.main}
          sx={{ cursor: 'pointer', flexShrink: 0 }}
          onClick={() => setDetailsOpen(true)}
        >
          {t('CENTER_SESSION.VIEW_DETAILS')}
        </Typography>
      </Box>
      {SessionCardFooter && primaryBatch && (
        <Box sx={{ marginTop: '8px' }}>
          <SessionCardFooter
            item={event}
            cohortName={primaryBatch.batchName}
            isTopicSubTopicAdded={onTopicUpdated}
            board={primaryBatch.bmg.board}
            medium={primaryBatch.bmg.medium}
            grade={primaryBatch.bmg.grade}
            cohortId={primaryBatch.batchId}
          />
        </Box>
      )}
      <CenterSessionModal
        open={detailsOpen}
        handleClose={() => setDetailsOpen(false)}
        title={getSessionTitle(subject, sessionTitle)}
        center={t('CENTER_SESSION.BATCH_CENTER_COVERAGE', {
          batchCount,
          centerCount,
        })}
        date={startDateTime.date}
      >
        <Box sx={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Box>
            <Typography fontSize={'12px'} color={theme.palette.warning['400']}>
              {t('CENTER_SESSION.SCHEDULE')}
            </Typography>
            <Typography fontSize={'14px'} color={theme.palette.warning['300']}>
              {startDateTime.time} - {endDateTime.time}
            </Typography>
            <Typography fontSize={'14px'} color={theme.palette.warning['300']}>
              {recurrenceSummary || t('CENTER_SESSION.ONE_TIME_SESSION')}
            </Typography>
          </Box>

          {meetingUrl && (
            <Box>
              <Typography fontSize={'12px'} color={theme.palette.warning['400']}>
                {t('CENTER_SESSION.MEETING_LINK')}
              </Typography>
              <Typography
                fontSize={'14px'}
                color={theme.palette.secondary.main}
                sx={{ wordBreak: 'break-all' }}
              >
                {meetingUrl}
              </Typography>
              {event?.meetingDetails?.password && (
                <Typography
                  fontSize={'14px'}
                  color={theme.palette.warning['300']}
                >
                  {t('CENTER_SESSION.PASSCODE', {
                    passcode: event.meetingDetails.password,
                  })}
                </Typography>
              )}
            </Box>
          )}

          <Divider />

          <Box>
            <Typography fontSize={'12px'} color={theme.palette.warning['400']}>
              {t('CENTER_SESSION.BATCHES_AND_CENTERS_LIST')}
            </Typography>
            {(batchDetails || []).map((b) => (
              <Typography
                key={b.batchId}
                fontSize={'14px'}
                color={theme.palette.warning['300']}
                sx={{ marginTop: '4px' }}
              >
                {toPascalCase(b.batchName)}
                {b.centerName ? ` — ${toPascalCase(b.centerName)}` : ''}
              </Typography>
            ))}
          </Box>

          {event?.erMetaData?.topic && (
            <>
              <Divider />
              <Box>
                <Typography
                  fontSize={'12px'}
                  color={theme.palette.warning['400']}
                >
                  {t('COMMON.TO_BE_TAUGHT')}
                </Typography>
                <Typography
                  fontSize={'14px'}
                  color={theme.palette.warning['300']}
                >
                  {event.erMetaData.topic.join(', ')}
                </Typography>
                {event?.erMetaData?.subTopic?.length > 0 && (
                  <Typography
                    fontSize={'14px'}
                    color={theme.palette.warning['300']}
                  >
                    {event.erMetaData.subTopic.join(', ')}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
      </CenterSessionModal>
    </Box>
  );
};

export default CrossCenterSessionCard;
