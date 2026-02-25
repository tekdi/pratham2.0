import { scheduleEventParam, CreateEvent, EditEvent } from '@/utils/Interfaces';
import { getAfterDate, getBeforeDate } from '@/utils/Helper';
import { patch, post } from './RestClient';
import API_ENDPOINTS from '@/utils/API/APIEndpoints';
import { format, parseISO } from 'date-fns';

/** Event list API response event shape (for session-based attendance) */
export interface EventListApiEvent {
  eventRepetitionId: string;
  startDateTime: string;
  endDateTime: string;
  title?: string;
  eventType?: string;
  attendees?: string[];
  onlineDetails?: {
    attendanceMarked?: boolean;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface DaySessionFromApi {
  id: string;
  eventRepetitionId: string;
  name: string;
  startTime: string;
  endTime: string;
  type: 'inPerson' | 'online';
  presentCount?: number;
  totalCount?: number;
}

function formatTime(isoDateTime: string): string {
  try {
    const date = parseISO(isoDateTime);
    return format(date, 'HH:mm');
  } catch {
    return '--:--';
  }
}

/**
 * Map API event to day session for attendance UI.
 * offline -> inPerson, online -> online.
 */
export function mapEventToDaySession(ev: EventListApiEvent): DaySessionFromApi {
  const type =
    ev.eventType?.toLowerCase() === 'online' ? 'online' : 'inPerson';
  const totalCount = ev.attendees?.length ?? 0;
  return {
    id: ev.eventRepetitionId,
    eventRepetitionId: ev.eventRepetitionId,
    name: ev.title ?? 'Session',
    startTime: formatTime(ev.startDateTime),
    endTime: formatTime(ev.endDateTime),
    type,
    totalCount: totalCount > 0 ? totalCount : undefined,
  };
}

/**
 * Fetch events (sessions) for a single day for the given cohort.
 * Used by Mark Center Attendance sessions modal.
 */
export const getEventsForDay = async (
  cohortId: string,
  selectedDateStr: string
): Promise<DaySessionFromApi[]> => {
  const apiUrl = API_ENDPOINTS.eventList;
  const filters = {
    startDate: { after: getAfterDate(selectedDateStr) },
    endDate: { before: getBeforeDate(selectedDateStr) },
    cohortId,
    status: ['live'],
  };
  try {
    const response = await post(apiUrl, {
      limit: 0,
      offset: 0,
      filters,
    });
    const result = response?.data?.result;
    const events: EventListApiEvent[] = result?.events ?? [];
    return events.map(mapEventToDaySession);
  } catch (error) {
    console.error('getEventsForDay error', error);
    throw error;
  }
};

export const getEventList = async ({
  limit,
  offset,
  filters,
}: scheduleEventParam): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.eventList
  try {
    const response = await post(apiUrl, { limit, offset, filters });
    return response?.data?.result;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};

export const createEvent = async (apiBody: CreateEvent): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.eventCreate
  try {
    const response = await post(apiUrl, apiBody);
    return response?.data;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};

export const editEvent = async (
  eventRepetitionId: string,
  apiBody: EditEvent
): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.eventDetails(eventRepetitionId)
  try {
    const response = await patch(apiUrl, apiBody);
    return response?.data;
  } catch (error) {
    console.error('error in getting event List Service list', error);
    return error;
  }
};
