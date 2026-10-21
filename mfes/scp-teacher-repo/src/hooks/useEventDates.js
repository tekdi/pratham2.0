import { useEffect, useState } from 'react';
import { getEventList } from '@/services/EventService';
import {
  shortDateFormat,
  getAfterDate,
  getBeforeDate,
  convertToIST,
  eventBelongsToCohort,
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
  cohortId
) => {
  const [eventDates, setEventDates] = useState({});

  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        if (idValue && idValue !== '' && idValue !== 'all') {
          let startDate, lastDate;

          if (modifyAttendanceLimit === dashboardDaysLimit) {
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
            status: ['live'],
          };
          // `filters.cohortId` (singular) was replaced by `filters.cohortIds`
          // (array) — the backend silently ignores the old singular field
          // instead of erroring, so this used to return every live event
          // across every cohort instead of just the one being asked for.
          if (idType === 'cohortId') {
            filters.cohortIds = [idValue];
          } else {
            filters[idType] = idValue;
          }
          if (cohortId && cohortId !== 'all') {
            filters.cohortIds = [cohortId];
          }

          const response = await getEventList({
            limit: 0,
            offset: 0,
            filters,
          });

          const newEventDates = {};
          const targetCohortId =
            cohortId && cohortId !== 'all'
              ? cohortId
              : idType === 'cohortId'
              ? idValue
              : null;
          if (response?.events?.length > 0) {
            response.events
              .filter((event) =>
                targetCohortId
                  ? eventBelongsToCohort(event, targetCohortId)
                  : true
              )
              .forEach((event) => {
                if (event.startDateTime) {
                  const eventDate = convertToIST(event.startDateTime);
                  newEventDates[eventDate] = { event: true };
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
  ]);

  return eventDates;
};

export default useEventDates;
