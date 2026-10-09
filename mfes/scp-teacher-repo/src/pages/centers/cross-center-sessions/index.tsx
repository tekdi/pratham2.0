import CrossCenterSessionCard from '@/components/CrossCenterSessionCard';
import CrossCenterScheduleWizard from '@/components/CrossCenterScheduleWizard';
import Header from '@/components/Header';
import NoDataFound from '@/components/common/NoDataFound';
import WeekCalender from '@/components/WeekCalender';
import useCrossCenterSessions from '@/hooks/useCrossCenterSessions';
import {
  convertToIST,
  formatSelectedDate,
  getMonthName,
  getTodayDate,
  sortSessionsByTime,
} from '@/utils/helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Box, Button, Snackbar, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { accessControl, eventDaysLimit } from '../../../../app.config';

const CrossCenterSessionsPage = () => {
  const { t } = useTranslation();
  const theme = useTheme<any>();
  const router = useRouter();
  const { loading, extraSessions, plannedSessions, currentUserId, refresh } =
    useCrossCenterSessions();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const [sortedExtraSessions, setSortedExtraSessions] = useState<any[]>([]);
  const [initialSlideIndex, setInitialSlideIndex] = useState<number>(0);

  const showDetailsHandle = (dayStr: string) => {
    setSelectedDate(formatSelectedDate(dayStr));
  };

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

  // Every session this facilitator can see is already loaded (1-year window,
  // see useCrossCenterSessions), so the day strip and "next N days" carousel
  // below are built by filtering what's already in hand instead of
  // re-querying the API per selected day, the way the single-batch page's
  // own WeekCalender does.
  const eventDatesMap = useMemo(() => {
    const map: Record<string, { event: boolean }> = {};
    [...extraSessions, ...plannedSessions].forEach(({ event }) => {
      if (event?.startDateTime) {
        map[convertToIST(event.startDateTime)] = { event: true };
      }
    });
    return map;
  }, [extraSessions, plannedSessions]);

  const selectedDatePlannedSessions = useMemo(
    () =>
      plannedSessions.filter(
        ({ event }) =>
          event?.startDateTime &&
          convertToIST(event.startDateTime) === selectedDate
      ),
    [plannedSessions, selectedDate]
  );

  useEffect(() => {
    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() + eventDaysLimit);
    const withinWindow = extraSessions.filter(
      ({ event }) => new Date(event?.startDateTime) < limitDate
    );
    const byEventId = new Map(
      withinWindow.map((item) => [item.event?.eventRepetitionId, item])
    );
    const { sessionList, index } = sortSessionsByTime(
      withinWindow.map((item) => item.event)
    );
    const ordered = sessionList
      .map((ev: any) => byEventId.get(ev?.eventRepetitionId))
      .filter(Boolean);
    setSortedExtraSessions(ordered);
    setInitialSlideIndex(index > 0 ? index : 0);
  }, [extraSessions]);

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
            <Box sx={{ marginBottom: '24px' }}>
              <Typography
                fontSize={'14px'}
                fontWeight={600}
                color={theme.palette.warning['400']}
                sx={{ marginBottom: '8px' }}
              >
                {t('COMMON.UPCOMING_EXTRA_SESSION', { days: eventDaysLimit })}
              </Typography>
              {sortedExtraSessions.length > 0 ? (
                <Swiper
                  initialSlide={initialSlideIndex}
                  pagination={{ type: 'fraction' }}
                  breakpoints={{
                    600: { slidesPerView: 1, spaceBetween: 20 },
                    900: { slidesPerView: 2, spaceBetween: 20 },
                    1200: { slidesPerView: 3, spaceBetween: 30 },
                    2000: { slidesPerView: 4, spaceBetween: 40 },
                  }}
                  navigation={true}
                  modules={[Pagination, Navigation]}
                  className="mySwiper"
                >
                  {sortedExtraSessions.map(
                    ({
                      event,
                      batchCount,
                      centerCount,
                      primaryBatch,
                      batchDetails,
                    }) => (
                      <SwiperSlide
                        style={{ paddingBottom: '38px' }}
                        key={event?.eventRepetitionId}
                      >
                        <CrossCenterSessionCard
                          event={event}
                          batchCount={batchCount}
                          centerCount={centerCount}
                          currentUserId={currentUserId}
                          primaryBatch={primaryBatch}
                          batchDetails={batchDetails}
                          onCopy={() => setSnackbarOpen(true)}
                          onEdit={handleEdit}
                          onTopicUpdated={() =>
                            refresh()
                          }
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              ) : (
                <Box
                  className="fs-12 fw-400 italic"
                  sx={{ color: theme.palette.warning['300'] }}
                >
                  {t('COMMON.NO_SESSIONS_SCHEDULED')}
                </Box>
              )}
            </Box>

            <Box sx={{ padding: '10px 0', mt: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography
                  fontSize={'14px'}
                  fontWeight={600}
                  color={theme.palette.warning['400']}
                  sx={{ marginBottom: '15px' }}
                >
                  {t('CENTER_SESSION.PLANNED_SESSIONS')}
                </Typography>
                <Box
                  display={'flex'}
                  sx={{
                    cursor: 'pointer',
                    color: theme.palette.secondary.main,
                    gap: '4px',
                    alignItems: 'center',
                  }}
                  onClick={() =>
                    router.push(
                      `/centers/cross-center-sessions/events/${getMonthName()?.toLowerCase()}`
                    )
                  }
                >
                  <Typography marginBottom={'0'} style={{ fontWeight: '500' }}>
                    {getMonthName()}
                  </Typography>
                  <CalendarMonthIcon sx={{ fontSize: '18px' }} />
                </Box>
              </Box>
              <WeekCalender
                showDetailsHandle={showDetailsHandle}
                data={null}
                disableDays={false}
                classId={'cross-center'}
                showFromToday={true}
                newWidth={'100%'}
                eventData={eventDatesMap}
                showEventIcon={true}
              />
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: '12px',
                mt: 2,
              }}
            >
              {selectedDatePlannedSessions.map(
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
                    onTopicUpdated={() => refresh()}
                  />
                )
              )}
              {selectedDatePlannedSessions.length === 0 && (
                <Box
                  className="fs-12 fw-400 italic"
                  sx={{ color: theme.palette.warning['300'] }}
                >
                  {t('COMMON.NO_SESSIONS_SCHEDULED')}
                </Box>
              )}
            </Box>
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
        onScheduled={() => refresh()}
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
