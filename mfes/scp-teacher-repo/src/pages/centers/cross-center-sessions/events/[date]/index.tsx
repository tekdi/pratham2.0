import CrossCenterSessionCard from '@/components/CrossCenterSessionCard';
import Header from '@/components/Header';
import MonthCalender from '@/components/MonthCalender';
import useCrossCenterSessions from '@/hooks/useCrossCenterSessions';
import { convertToIST, MONTHS, shortDateFormat } from '@/utils/helper';
import withAccessControl from '@/utils/hoc/withAccessControl';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { GetStaticPaths } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { accessControl } from '../../../../../../app.config';
import { useDirection } from '../../../../../hooks/useDirection';

const getDateFromMonthName = (monthName: string): Date => {
  const monthIndex = MONTHS.findIndex(
    (m) => m.toLowerCase() === monthName?.toLowerCase()
  );
  if (monthIndex === -1) return new Date();
  const today = new Date();
  // MonthCalender highlights today by default whenever the current month is
  // shown (its own internal state defaults to `new Date()`), so the
  // session lists below must agree with that and start on today too -
  // otherwise they'd show the 1st of the month's (usually empty) sessions
  // until the user re-clicks the already-highlighted day.
  if (monthIndex === today.getMonth()) return today;
  return new Date(today.getFullYear(), monthIndex, 1);
};

const CrossCenterEventMonthView: React.FC = () => {
  const theme = useTheme<any>();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const router = useRouter();
  const { date: dateParam }: any = router.query;

  const { loading, extraSessions, plannedSessions, currentUserId, refresh } =
    useCrossCenterSessions();
  const [selectedDate, setSelectedDate] = useState<Date>(() =>
    dateParam ? getDateFromMonthName(dateParam) : new Date()
  );

  useEffect(() => {
    if (router.isReady && dateParam) {
      setSelectedDate(getDateFromMonthName(dateParam));
    }
  }, [router.isReady, dateParam]);

  // Every cross-center session this facilitator can see is already loaded
  // (1-year window, see useCrossCenterSessions) - the month grid's dots and
  // the day's session lists below are both built by filtering what's already
  // in hand, same approach as the main Cross-Center Sessions page.
  const eventDatesMap = useMemo(() => {
    const map: Record<string, { event: boolean }> = {};
    [...extraSessions, ...plannedSessions].forEach(({ event }) => {
      if (event?.startDateTime) {
        map[convertToIST(event.startDateTime)] = { event: true };
      }
    });
    return map;
  }, [extraSessions, plannedSessions]);

  const selectedDateKey = shortDateFormat(selectedDate);
  const selectedDatePlannedSessions = useMemo(
    () =>
      plannedSessions.filter(
        ({ event }) =>
          event?.startDateTime &&
          convertToIST(event.startDateTime) === selectedDateKey
      ),
    [plannedSessions, selectedDateKey]
  );
  const selectedDateExtraSessions = useMemo(
    () =>
      extraSessions.filter(
        ({ event }) =>
          event?.startDateTime &&
          convertToIST(event.startDateTime) === selectedDateKey
      ),
    [extraSessions, selectedDateKey]
  );

  const handleActiveStartDateChange = (date: Date) => {
    setSelectedDate(date);
    const newMonthName = MONTHS[date.getMonth()]?.toLowerCase() || '';
    router.replace(
      `/centers/cross-center-sessions/events/${newMonthName}`,
      undefined,
      { shallow: true }
    );
  };

  const handleSelectedDateChange = (date: Date | Date[] | null) => {
    if (date && !Array.isArray(date)) {
      setSelectedDate(date);
    }
  };

  const renderSessionGrid = (items: typeof plannedSessions) => (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        },
        gap: '12px',
        mt: 1.5,
        px: '10px',
      }}
    >
      {items.map(({ event, batchCount, centerCount, primaryBatch, batchDetails }) => (
        <CrossCenterSessionCard
          key={event?.eventRepetitionId}
          event={event}
          batchCount={batchCount}
          centerCount={centerCount}
          currentUserId={currentUserId}
          primaryBatch={primaryBatch}
          batchDetails={batchDetails}
          onCopy={() => {}}
          onEdit={() => {}}
          onTopicUpdated={refresh}
        />
      ))}
      {items.length === 0 && (
        <Box
          className="fs-12 fw-400 italic"
          sx={{ color: theme.palette.warning['300'] }}
        >
          {t('COMMON.NO_SESSIONS_SCHEDULED')}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Box textAlign={'center'}>
        <Header />
        <Box display={'flex'} justifyContent={'center'}>
          <Box sx={{ width: '100%' }}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              gap={'1rem'}
              padding={'1rem 20px 0.5rem'}
              alignItems={'center'}
            >
              <Box
                display={'flex'}
                sx={{ color: theme.palette.warning['A200'] }}
                gap={'10px'}
                width={'100%'}
                paddingTop={'10px'}
              >
                <Box className="d-md-flex w-100 space-md-between min-align-md-center">
                  <Box display={'flex'} gap={'10px'}>
                    <Box onClick={() => window.history.back()}>
                      <KeyboardBackspaceOutlinedIcon
                        cursor={'pointer'}
                        sx={{
                          color: theme.palette.warning['A200'],
                          transform: isRTL ? ' rotate(180deg)' : 'unset',
                        }}
                      />
                    </Box>
                    <Typography
                      marginBottom={'0px'}
                      fontSize={'22px'}
                      color={theme.palette.warning['A200']}
                      className="flex-basis-md-30"
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      {t('DASHBOARD.CROSS_CENTER_SESSIONS')}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box className="calender-container">
              {/* No attendance data on this screen - the calendar only marks the days
                  that have sessions scheduled. */}
              <MonthCalender
                onChange={handleActiveStartDateChange}
                onDateChange={handleSelectedDateChange}
                eventData={eventDatesMap}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {loading ? (
        <Typography sx={{ mt: 3 }}>{t('COMMON.LOADING')}</Typography>
      ) : (
        <>
          <Box
            mt={3}
            px="14px"
            sx={{
              fontSize: '16px',
              fontWeight: '500',
              color: theme?.palette?.warning['300'],
            }}
          >
            <Typography sx={{ marginLeft: '10px' }}>
              {t('CENTER_SESSION.PLANNED_SESSIONS')}
            </Typography>
            {renderSessionGrid(selectedDatePlannedSessions)}
          </Box>

          <Box
            mt={3}
            mb={3}
            px="14px"
            sx={{
              fontSize: '16px',
              fontWeight: '500',
              color: theme?.palette?.warning['300'],
            }}
          >
            <Typography sx={{ marginLeft: '10px' }}>
              {t('CENTER_SESSION.EXTRA_SESSION')}
            </Typography>
            {renderSessionGrid(selectedDateExtraSessions)}
          </Box>
        </>
      )}
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export default withAccessControl(
  'accessCenters',
  accessControl
)(CrossCenterEventMonthView);
