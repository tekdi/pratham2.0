import { useEffect, useState } from 'react';
import { getEventList } from '@/services/EventService';
import {
  shortDateFormat,
  getAfterDate,
  getBeforeDate,
  convertToIST,
} from '../utils/helper';
import { dashboardDaysLimit } from '../../app.config';

const useEventDates = (
  idValue,
  idType,
  modifyAttendanceLimit,
  timeTableDate,
  eventUpdated,
  eventDeleted,
  eventCreated,
  cohortId,
  rangeStartDate,
  rangeEndDate
) => {
  const [eventDates, setEventDates] = useState({});

  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        if (idValue && idValue !== '') {
          let startDate, lastDate;

          if (rangeStartDate && rangeEndDate) {
            // Explicit window (yyyy-MM-dd) from the caller. Used when the
            // rendered range can span more than one month, so a month-wide
            // fetch would miss events on the days outside it.
            startDate = rangeStartDate;
            lastDate = rangeEndDate;
          } else if (modifyAttendanceLimit === dashboardDaysLimit) {
            const date = new Date(timeTableDate);
            const firstDayOfMonth = new Date(
              date.getFullYear(),
              date.getMonth(),
              1
            );
            startDate = shortDateFormat(firstDayOfMonth);
            const lastDayOfMonth = new Date(
              date.getFullYear(),
              date.getMonth() + 1,
              0
            );
            lastDate = shortDateFormat(lastDayOfMonth);
          } else {
            const date = new Date();
            startDate = shortDateFormat(new Date());
            const adjustedDate = new Date(
              date.setDate(date.getDate() + modifyAttendanceLimit)
            );
            lastDate = shortDateFormat(adjustedDate);
          }

          const afterDate = getAfterDate(startDate);
          const beforeDate = getBeforeDate(lastDate);
          if (idType === 'userId') {
            idType = 'createdBy';
          }
          const filters = {
            date: {
              after: afterDate,
              before: beforeDate,
            },
            [idType]: idValue,
            status: ['live'],
            ...(cohortId && cohortId !== 'all' ? { cohortId } : {}),
          };

          const response = await getEventList({
            limit: 0,
            offset: 0,
            filters,
          });

          const newEventDates = {};
          if (response?.events?.length > 0) {
            response.events.forEach((event) => {
              if (event.startDateTime) {
                const eventDate = convertToIST(event.startDateTime);
                if (!newEventDates[eventDate]) {
                  // `event: true` is what the calendar checks; `eventIds` lets callers
                  // look up session-level attendance, which is stored against the
                  // event repetition rather than the batch.
                  newEventDates[eventDate] = { event: true, eventIds: [] };
                }
                if (event.eventRepetitionId) {
                  newEventDates[eventDate].eventIds.push(
                    event.eventRepetitionId
                  );
                }
              }
            });
          }
          setEventDates(newEventDates);
        }
      } catch (error) {
        console.error('Error fetching event dates:', error);
      }
    };

    fetchEventDates();
  }, [
    idValue,
    idType,
    modifyAttendanceLimit,
    timeTableDate,
    eventUpdated,
    eventDeleted,
    eventCreated,
    cohortId,
    rangeStartDate,
    rangeEndDate,
  ]);

  return eventDates;
};

export default useEventDates;
