import Header from '@/components/Header';
import NoDataFound from '@/components/common/NoDataFound';
import { getCohortDetails, getCohortList } from '@/services/CohortServices';
import { getEventList } from '@/services/EventService';
import { sessionType } from '@/utils/app.constant';
import {
  convertUTCToIST,
  getAfterDate,
  shortDateFormat,
  toPascalCase,
} from '@/utils/helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupsIcon from '@mui/icons-material/Groups';
import { Box, Snackbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react';
import { accessControl } from '../../../../app.config';

interface BatchInfo {
  batchId: string;
  batchName: string;
  centerId: string;
  centerName: string;
}

// The facilitator's own cohort tree comes back center -> batch (or, for team
// leaders, block -> center -> batch). A leaf node (no childData) is always a
// batch; its immediate parent is the center it belongs to.
const flattenBatches = (
  nodes: any[],
  parent?: { id: string; name: string }
): BatchInfo[] => {
  let result: BatchInfo[] = [];
  for (const node of nodes || []) {
    const children = Array.isArray(node?.childData) ? node.childData : [];
    if (children.length > 0) {
      result = result.concat(
        flattenBatches(children, {
          id: node?.cohortId,
          name: node?.cohortName || node?.name,
        })
      );
    } else if (parent?.id && node?.cohortId) {
      result.push({
        batchId: node.cohortId,
        batchName: toPascalCase(node?.cohortName || node?.name || ''),
        centerId: parent.id,
        centerName: toPascalCase(parent.name || ''),
      });
    }
  }
  return result;
};

const getSessionTitle = (subject?: string, sessionTitle?: string) => {
  return subject && sessionTitle
    ? `${toPascalCase(subject)} - ${sessionTitle}`
    : subject
    ? toPascalCase(subject)
    : toPascalCase(sessionTitle || '');
};

const CrossCenterSessionCard: React.FC<{
  event: any;
  batchCount: number;
  centerCount: number;
  currentUserId: string;
  onCopy: () => void;
}> = ({ event, batchCount, centerCount, currentUserId, onCopy }) => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const startDateTime = convertUTCToIST(event?.startDateTime);
  const endDateTime = convertUTCToIST(event?.endDateTime);
  const subject = event?.metadata?.subject;
  const sessionTitle = event?.shortDescription;
  const creatorId = event?.createdBy ?? event?.metadata?.createdBy;
  const creatorName = event?.metadata?.teacherName;
  const meetingUrl = event?.meetingDetails?.url;

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
      <Typography
        color={theme.palette.warning['300']}
        fontWeight={400}
        fontSize={'16px'}
        className="one-line-text"
      >
        {getSessionTitle(subject, sessionTitle)}
      </Typography>
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
      <Typography
        fontWeight={400}
        fontSize={'12px'}
        sx={{ marginTop: '8px', color: theme.palette.warning['400'] }}
      >
        {creatorId === currentUserId
          ? t('CENTER_SESSION.CREATED_BY_YOU')
          : t('CENTER_SESSION.CREATED_BY', { name: creatorName || '' })}
      </Typography>
    </Box>
  );
};

const CrossCenterSessionsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const [loading, setLoading] = useState(true);
  const [extraSessions, setExtraSessions] = useState<any[]>([]);
  const [plannedSessions, setPlannedSessions] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        const cohortIds = myBatches.map((b) => b.batchId).filter(Boolean);

        if (cohortIds.length === 0) {
          setExtraSessions([]);
          setPlannedSessions([]);
          return;
        }

        const filters = {
          startDate: { after: getAfterDate(shortDateFormat(new Date())) },
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
              const centerId = details?.cohortData?.[0]?.parentId;
              if (centerId) centerIdByBatchId.set(batchId, centerId);
            } catch (error) {
              console.error('Error resolving batch center', batchId, error);
            }
          })
        );

        const withCoverage = crossCenterEvents.map((event) => {
          const batchIds: string[] =
            event?.metadata?.cohortIds ||
            (event?.metadata?.cohortId ? [event.metadata.cohortId] : []);
          const centerIds = new Set(
            batchIds
              .map((id) => centerIdByBatchId.get(id))
              .filter((id): id is string => Boolean(id))
          );
          return {
            event,
            batchCount: batchIds.length,
            centerCount: centerIds.size,
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
  }, []);

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
                  {extraSessions.map(({ event, batchCount, centerCount }) => (
                    <CrossCenterSessionCard
                      key={event?.eventRepetitionId}
                      event={event}
                      batchCount={batchCount}
                      centerCount={centerCount}
                      currentUserId={currentUserId}
                      onCopy={() => setSnackbarOpen(true)}
                    />
                  ))}
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
                    ({ event, batchCount, centerCount }) => (
                      <CrossCenterSessionCard
                        key={event?.eventRepetitionId}
                        event={event}
                        batchCount={batchCount}
                        centerCount={centerCount}
                        currentUserId={currentUserId}
                        onCopy={() => setSnackbarOpen(true)}
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
