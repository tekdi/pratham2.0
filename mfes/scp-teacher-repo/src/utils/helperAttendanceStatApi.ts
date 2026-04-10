import { getLearnerAttendanceStatus } from '@/services/AttendanceService';
import { getEventsForDay } from '@/services/EventService';
import { formatSelectedDate } from './Helper';
import { LearnerAttendanceProps } from './Interfaces';
import { Role } from './app.constant';

/**
 * Checks if the learner has attendance marked for today at any event/session.
 * Used to restrict dropout, reassign, and archive when attendance is marked for the current date.
 * Attendance is stored at event level; this fetches today's sessions and checks each.
 */
export const fetchAttendanceStats = async (userId: string) => {
  const classId = localStorage.getItem('classId') ?? '';
  if (!classId) {
    return [];
  }

  const todayStr = formatSelectedDate(new Date());

  let sessions: { id: string; eventRepetitionId: string }[];
  try {
    sessions = await getEventsForDay(classId, todayStr);
  } catch (error) {
    console.error('Error fetching events for day:', error);
    return [];
  }

  if (!sessions?.length) {
    return [];
  }

  const attendanceChecks = sessions.map((session) => {
    const eventRepetitionId = session.eventRepetitionId ?? session.id;
    const request: LearnerAttendanceProps = {
      limit: 300,
      page: 0,
      filters: {
        contextId: eventRepetitionId,
        context: 'event',
        fromDate: todayStr,
        toDate: todayStr,
        scope: Role.STUDENT,
        userId,
      },
    };
    return getLearnerAttendanceStatus(request)
      .then((response) => response?.data?.attendanceList ?? [])
      .catch(() => []);
  });

  const results = await Promise.all(attendanceChecks);
  const hasAttendanceToday = results.some((list) => list?.length > 0);

  if (hasAttendanceToday) {
    return [{ attendanceDate: todayStr }];
  }
  return [];
};
