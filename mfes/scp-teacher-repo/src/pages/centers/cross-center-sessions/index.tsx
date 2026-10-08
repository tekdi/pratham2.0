import CenterSessionModal from '@/components/CenterSessionModal';
import CrossCenterScheduleWizard from '@/components/CrossCenterScheduleWizard';
import Header from '@/components/Header';
import NoDataFound from '@/components/common/NoDataFound';
import { getCohortDetails, getCohortList } from '@/services/CohortServices';
import { getEventList } from '@/services/EventService';
import { EventStatus, sessionType } from '@/utils/app.constant';
import { BatchInfo, flattenBatches } from '@/utils/crossCenter';
import {
  convertUTCToIST,
  getAfterDate,
  getBeforeDate,
  shortDateFormat,
  toPascalCase,
} from '@/utils/helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOutlined from '@mui/icons-material/EditOutlined';
import GroupsIcon from '@mui/icons-material/Groups';
import LockOutlined from '@mui/icons-material/LockOutlined';
import { Box, Button, Divider, Snackbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ComponentType, useEffect, useState } from 'react';
import { DaysOfWeek, accessControl } from '../../../../app.config';
import { isEliminatedFromBuild } from '../../../../featureEliminationUtil';

let SessionCardFooter: ComponentType<any> | null = null;
if (!isEliminatedFromBuild('SessionCardFooter', 'component')) {
  SessionCardFooter = dynamic(() => import('@/components/SessionCardFooter'), {
    ssr: false,
  });
}

const getSessionTitle = (subject?: string, sessionTitle?: string) => {
  return subject && sessionTitle
    ? `${toPascalCase(subject)} - ${sessionTitle}`
    : subject
    ? toPascalCase(subject)
    : toPascalCase(sessionTitle || '');
};

interface BatchDetail {
  batchId: string;
  batchName: string;
  centerName: string;
}

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

const CrossCenterSessionCard: React.FC<{
  event: any;
  batchCount: number;
  centerCount: number;
  currentUserId: string;
  primaryBatch?: BatchInfo;
  batchDetails?: BatchDetail[];
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

const CrossCenterSessionsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [extraSessions, setExtraSessions] = useState<any[]>([]);
  const [plannedSessions, setPlannedSessions] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setWizardOpen(true);
  };

  const handleWizardClose = () => {
    setWizardOpen(false);
    setEditingEvent(null);
  };

  // Redirect target from a batch page's multi-batch-edit confirmation
  // (SessionCard.tsx) — once this page's own session list has loaded, find
  // the referenced session and open its editor directly, per US-5.
  useEffect(() => {
    if (!router.isReady || loading) return;
    const editEventId = router.query.editEventId;
    if (!editEventId || typeof editEventId !== 'string') return;

    const allSessions = [...extraSessions, ...plannedSessions].map(
      (item) => item.event
    );
    const match = allSessions.find(
      (event) => event?.eventRepetitionId === editEventId
    );
    // Defence in depth against a hand-crafted URL: the edit icon this param
    // is meant to be reached from is already creator-gated, but a direct
    // visit shouldn't open the editor for anyone else either.
    const matchCreatorId = match?.createdBy ?? match?.metadata?.createdBy;
    if (match && matchCreatorId === currentUserId) {
      handleEdit(match);
    }

    const { editEventId: _editEventId, ...restQuery } = router.query;
    router.replace(
      { pathname: router.pathname, query: restQuery },
      undefined,
      { shallow: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.editEventId, loading]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const userId =
          typeof window !== 'undefined'
            ? localStorage.getItem('userId') || ''
            : '';
        setCurrentUserId(userId);
        if (!userId) {
          setExtraSessions([]);
          setPlannedSessions([]);
          return;
        }

        const centerTree = await getCohortList(userId, {
          customField: 'true',
        });
        const myBatches = flattenBatches(centerTree || []);
        const centerIdByBatchId = new Map(
          myBatches.map((b) => [b.batchId, b.centerId])
        );
        const batchNameById = new Map(
          myBatches.map((b) => [b.batchId, b.batchName])
        );
        const centerNameByCenterId = new Map(
          myBatches.map((b) => [b.centerId, b.centerName])
        );
        const cohortIds = myBatches.map((b) => b.batchId).filter(Boolean);

        if (cohortIds.length === 0) {
          setExtraSessions([]);
          setPlannedSessions([]);
          return;
        }

        // The backend requires startDate and endDate together — there is no
        // open-ended range, so this uses a generous 1-year window to
        // effectively mean "all upcoming sessions".
        const farFuture = new Date();
        farFuture.setDate(farFuture.getDate() + 365);
        const filters = {
          startDate: { after: getAfterDate(shortDateFormat(new Date())) },
          endDate: { before: getBeforeDate(shortDateFormat(farFuture)) },
          cohortIds,
          status: ['live'],
        };
        const response = await getEventList({ limit: 0, offset: 0, filters });
        const events: any[] = response?.events || [];
        const crossCenterEvents = events.filter(
          (event) => event?.metadata?.multiSession === true
        );

        // Resolve the center for every batch on every cross-center session so
        // "X batches · Y centers" is accurate even for batches taught by other
        // facilitators (not just the ones this facilitator's own tree covers).
        const unresolvedBatchIds = new Set<string>();
        crossCenterEvents.forEach((event) => {
          const batchIds: string[] =
            event?.metadata?.cohortIds ||
            (event?.metadata?.cohortId ? [event.metadata.cohortId] : []);
          batchIds.forEach((id) => {
            if (id && !centerIdByBatchId.has(id)) unresolvedBatchIds.add(id);
          });
        });

        await Promise.all(
          Array.from(unresolvedBatchIds).map(async (batchId) => {
            try {
              const details = await getCohortDetails(batchId);
              const batchRecord = details?.cohortData?.[0];
              const centerId = batchRecord?.parentId;
              if (batchRecord?.name) batchNameById.set(batchId, batchRecord.name);
              if (centerId) centerIdByBatchId.set(batchId, centerId);
            } catch (error) {
              console.error('Error resolving batch center', batchId, error);
            }
          })
        );

        // Same reasoning, one hop further - the "View details" breakdown needs
        // each batch's center *name*, not just its id, for centers outside
        // this facilitator's own tree.
        const unresolvedCenterIds = new Set<string>();
        centerIdByBatchId.forEach((centerId) => {
          if (centerId && !centerNameByCenterId.has(centerId)) {
            unresolvedCenterIds.add(centerId);
          }
        });
        await Promise.all(
          Array.from(unresolvedCenterIds).map(async (centerId) => {
            try {
              const details = await getCohortDetails(centerId);
              const centerName = details?.cohortData?.[0]?.name;
              if (centerName) centerNameByCenterId.set(centerId, centerName);
            } catch (error) {
              console.error('Error resolving center name', centerId, error);
            }
          })
        );

        const myBatchesById = new Map(myBatches.map((b) => [b.batchId, b]));

        const withCoverage = crossCenterEvents.map((event) => {
          const batchIds: string[] =
            event?.metadata?.cohortIds ||
            (event?.metadata?.cohortId ? [event.metadata.cohortId] : []);
          const centerIds = new Set(
            batchIds
              .map((id) => centerIdByBatchId.get(id))
              .filter((id): id is string => Boolean(id))
          );
          // The wizard only allows batches with matching Board/Medium/Grade into
          // one cross-center session, so any member batch this facilitator
          // teaches (there is always at least one - it's how this event matched
          // the `cohortIds` filter above) is a valid stand-in for the course
          // planner's board/medium/grade/entityId lookup.
          const primaryBatch = batchIds
            .map((id) => myBatchesById.get(id))
            .find((b): b is BatchInfo => Boolean(b));
          // Read-only breakdown for the "View details" modal - every batch on
          // the session, by name, with the center it belongs to.
          const batchDetails = batchIds.map((id) => {
            const known = myBatchesById.get(id);
            const centerId = centerIdByBatchId.get(id);
            return {
              batchId: id,
              batchName: known?.batchName || batchNameById.get(id) || id,
              centerName:
                known?.centerName ||
                (centerId ? centerNameByCenterId.get(centerId) : undefined) ||
                '',
            };
          });
          return {
            event,
            batchCount: batchIds.length,
            centerCount: centerIds.size,
            primaryBatch,
            batchDetails,
          };
        });

        const byStartTime = (a: any, b: any) =>
          new Date(a.event?.startDateTime).getTime() -
          new Date(b.event?.startDateTime).getTime();

        setExtraSessions(
          withCoverage
            .filter(
              (item) => item.event?.metadata?.type === sessionType.EXTRA
            )
            .sort(byStartTime)
        );
        setPlannedSessions(
          withCoverage
            .filter(
              (item) => item.event?.metadata?.type === sessionType.PLANNED
            )
            .sort(byStartTime)
        );
      } catch (error) {
        console.error('Error loading cross-center sessions', error);
        setExtraSessions([]);
        setPlannedSessions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  const hasSessions = extraSessions.length > 0 || plannedSessions.length > 0;

  return (
    <>
      <Header />
      <Box sx={{ padding: '16px' }}>
        <Typography
          fontSize={'20px'}
          fontWeight={600}
          color={theme.palette.warning['300']}
          sx={{ marginBottom: '16px' }}
        >
          {t('DASHBOARD.CROSS_CENTER_SESSIONS')}
        </Typography>

        <Box sx={{ marginBottom: '16px' }}>
          <Button
            sx={{
              border: `1px solid ${theme.palette.error.contrastText}`,
              borderRadius: '100px',
              height: '40px',
              px: '16px',
              color: theme.palette.error.contrastText,
            }}
            className="text-1E"
            endIcon={<AddIcon />}
            onClick={() => setWizardOpen(true)}
          >
            {t('COMMON.SCHEDULE_NEW')}
          </Button>
        </Box>

        {loading ? (
          <Typography>{t('COMMON.LOADING')}</Typography>
        ) : !hasSessions ? (
          <NoDataFound title="CENTER_SESSION.NO_CROSS_CENTER_SESSIONS" />
        ) : (
          <>
            {extraSessions.length > 0 && (
              <Box sx={{ marginBottom: '24px' }}>
                <Typography
                  fontSize={'14px'}
                  fontWeight={600}
                  color={theme.palette.warning['400']}
                  sx={{ marginBottom: '8px' }}
                >
                  {t('CENTER_SESSION.UPCOMING_EXTRA_SESSIONS')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: '12px',
                  }}
                >
                  {extraSessions.map(
                    ({
                      event,
                      batchCount,
                      centerCount,
                      primaryBatch,
                      batchDetails,
                    }) => (
                      <CrossCenterSessionCard
                        key={event?.eventRepetitionId}
                        event={event}
                        batchCount={batchCount}
                        centerCount={centerCount}
                        currentUserId={currentUserId}
                        primaryBatch={primaryBatch}
                        batchDetails={batchDetails}
                        onCopy={() => setSnackbarOpen(true)}
                        onEdit={handleEdit}
                        onTopicUpdated={() =>
                          setRefreshKey((prev) => prev + 1)
                        }
                      />
                    )
                  )}
                </Box>
              </Box>
            )}

            {plannedSessions.length > 0 && (
              <Box>
                <Typography
                  fontSize={'14px'}
                  fontWeight={600}
                  color={theme.palette.warning['400']}
                  sx={{ marginBottom: '8px' }}
                >
                  {t('CENTER_SESSION.PLANNED_SESSIONS')}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      sm: 'repeat(2, 1fr)',
                      md: 'repeat(3, 1fr)',
                    },
                    gap: '12px',
                  }}
                >
                  {plannedSessions.map(
                    ({
                      event,
                      batchCount,
                      centerCount,
                      primaryBatch,
                      batchDetails,
                    }) => (
                      <CrossCenterSessionCard
                        key={event?.eventRepetitionId}
                        event={event}
                        batchCount={batchCount}
                        centerCount={centerCount}
                        currentUserId={currentUserId}
                        primaryBatch={primaryBatch}
                        batchDetails={batchDetails}
                        onCopy={() => setSnackbarOpen(true)}
                        onEdit={handleEdit}
                        onTopicUpdated={() =>
                          setRefreshKey((prev) => prev + 1)
                        }
                      />
                    )
                  )}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="URL copied to clipboard"
      />
      <CrossCenterScheduleWizard
        open={wizardOpen}
        onClose={handleWizardClose}
        onScheduled={() => setRefreshKey((prev) => prev + 1)}
        editingEvent={editingEvent}
      />
    </>
  );
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default withAccessControl(
  'accessCenters',
  accessControl
)(CrossCenterSessionsPage);
