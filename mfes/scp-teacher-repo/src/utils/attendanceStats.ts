import { attendanceStatusList } from '../services/AttendanceService';
import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import {
  AttendancePercentageProps,
  CohortMemberList,
} from '../utils/Interfaces';
import { getLatestEntries, shortDateFormat } from './helper';
import { Status } from './app.constant';
import { AttendanceAPILimit } from '../../app.config';

/** Event repetition ids of the sessions scheduled on each date, keyed by yyyy-MM-dd. */
export type SessionIdsByDate = { [date: string]: string[] };

/**
 * Most dates we will fan out over when filling gaps. The attendance list API only
 * accepts a single contextId per call (`filters.contextId must be a UUID`), so each
 * date costs one request per session on it. Without a cap, a batch that has only ever
 * used session-level marking would fire one request per day on every dashboard load.
 */
const SESSION_GAP_DATE_LIMIT = 10;

const COHORT_RANGE_ATTENDANCE_LIMIT = 10000;

const getCountedStudentIds = async (
  response: any,
  fromDate: Date
): Promise<string[]> => {
  try {
    const filteredFields = response?.result?.userDetails || [];

    const nameUserIdArray = filteredFields
      .map((entry: any) => ({
        userId: entry.userId,
        memberStatus: entry.status,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      }))
      .filter(
        (member: {
          createdAt: string | number | Date;
          updatedAt: string | number | Date;
          memberStatus: string;
        }) => {
          const createdAt = new Date(member.createdAt).setHours(0, 0, 0, 0);
          const updatedAt = new Date(member.updatedAt).setHours(0, 0, 0, 0);
          const currentDate = new Date(fromDate).setHours(0, 0, 0, 0);

          if ((member.memberStatus === Status.ARCHIVED || member.memberStatus === "reassigned") && updatedAt <= currentDate) {
            return false;
          }
          return createdAt <= currentDate;
        }
      );

    // Get the latest entries
    const filteredEntries = getLatestEntries(
      nameUserIdArray,
      shortDateFormat(fromDate)
    );

    const countedMembers = filteredEntries.filter(member => member.memberStatus === Status.ACTIVE || (member.memberStatus === Status.DROPOUT && shortDateFormat(new Date(member.updatedAt)) > shortDateFormat(new Date(fromDate)))||
    (member.memberStatus === "reassigned" && shortDateFormat(new Date(member.updatedAt)) > shortDateFormat(new Date(fromDate)))||
    (member.memberStatus === Status.ARCHIVED && shortDateFormat(new Date(member.updatedAt)) > shortDateFormat(new Date(fromDate))));

    return countedMembers.map((member) => member.userId);
  } catch (error) {
    // console.error('Error in getCountedStudentIds:', error);
    return [];
  }
};



type PresentStudents = {
  [date: string]: {
    present_students: number;
  };
};

type Result = {
  [date: string]: {
    present_students: number;
    totalcount: number;
    present_percentage: number;
  };
};

/**
 * Reads session-level attendance for the given dates, one request per session.
 *
 * Counts *distinct* learners marked present rather than summing the API's facet
 * totals: those count a learner once per session, so a day with two sessions would
 * double-count anyone who attended both and report over 100%.
 */
const getSessionPresentCount = async (
  sessionIdsByDate: SessionIdsByDate,
  scope: string
): Promise<PresentStudents> => {
  const dates = Object.keys(sessionIdsByDate)
    .sort()
    .reverse()
    .slice(0, SESSION_GAP_DATE_LIMIT);

  const perDate = await Promise.all(
    dates.map(async (date) => {
      const sessionIds = sessionIdsByDate[date] ?? [];
      const lists = await Promise.all(
        sessionIds.map((contextId) =>
          attendanceStatusList({
            limit: AttendanceAPILimit,
            page: 0,
            filters: {
              fromDate: date,
              toDate: date,
              contextId,
              scope,
              context: 'event',
            },
          })
            // One unreadable session must not lose the others.
            .then((res) => res?.data?.attendanceList ?? [])
            .catch(() => [])
        )
      );

      const presentUserIds = new Set<string>();
      let rowCount = 0;
      lists.forEach((list: any[]) => {
        list?.forEach((row: any) => {
          rowCount += 1;
          if (row?.attendance === 'present' && row?.userId) {
            presentUserIds.add(row.userId);
          }
        });
      });

      return { date, present: presentUserIds.size, rowCount };
    })
  );

  const presentStudents: PresentStudents = {};
  perDate.forEach(({ date, present, rowCount }) => {
    // No rows at all means the day genuinely has no attendance, so leave it absent
    // from the result and let the calendar keep showing it as unmarked.
    if (rowCount > 0) {
      presentStudents[date] = { present_students: present };
    }
  });
  return presentStudents;
};

/** Attendance status per userId per date (yyyy-MM-dd) for the batch, from one range request. */
const getCohortAttendanceByDate = async (
  filters: AttendancePercentageProps['filters']
): Promise<{ [date: string]: Map<string, string> }> => {
  // Without an explicit limit the backend returns a default page of 20 rows.
  const res = await attendanceStatusList({
    limit: COHORT_RANGE_ATTENDANCE_LIMIT,
    page: 0,
    filters: {
      fromDate: filters.fromDate,
      toDate: filters.toDate,
      contextId: filters.contextId,
      scope: filters.scope,
      context: 'cohort',
    },
  });
  const rows = res?.data?.attendanceList ?? [];
  console.log(
    `cohort attendance rows for ${filters.fromDate} -> ${filters.toDate}:`,
    rows.length
  );
  if (rows.length >= COHORT_RANGE_ATTENDANCE_LIMIT) {
    console.warn(
      `cohort attendance range hit the ${COHORT_RANGE_ATTENDANCE_LIMIT}-row limit; counts may be incomplete`
    );
  }
  const byDate: { [date: string]: Map<string, string> } = {};
  rows.forEach((row: any) => {
    if (row?.userId && row?.attendanceDate) {
      (byDate[row.attendanceDate] ??= new Map<string, string>()).set(
        row.userId,
        row.attendance
      );
    }
  });
  console.log(
    'cohort attendance rows per date:',
    Object.fromEntries(
      Object.entries(byDate).map(([date, statuses]) => [date, statuses.size])
    )
  );
  return byDate;
};

export const calculatePercentage = async (
  cohortMemberRequest: CohortMemberList,
  attendanceRequest: AttendancePercentageProps,
  selectedDate?: any,
  sessionIdsByDate?: SessionIdsByDate
): Promise<Result> => {
  const response = await getMyCohortMemberList(cohortMemberRequest);

  // Batch-level attendance (context 'cohort', contextId = the batch), one row per learner per day.
  const cohortAttendanceByDate = await getCohortAttendanceByDate(
    attendanceRequest.filters
  );

  // Attendance marked through the session flow is stored against the event repetition,
  // so the query above cannot see it and the day looks unmarked. Fill in only those
  // gaps: a date that has a scheduled session but no batch-level attendance.
  let sessionPresentStudents: PresentStudents = {};
  if (sessionIdsByDate) {
    const gapDates: SessionIdsByDate = {};
    Object.keys(sessionIdsByDate).forEach((date) => {
      if (!cohortAttendanceByDate[date] && sessionIdsByDate[date]?.length) {
        gapDates[date] = sessionIdsByDate[date];
      }
    });
    if (Object.keys(gapDates).length > 0) {
      try {
        sessionPresentStudents = await getSessionPresentCount(
          gapDates,
          attendanceRequest.filters.scope
        );
      } catch (error) {
        // Additive only - the batch-level numbers must survive this failing.
        console.error('Error fetching session-level attendance:', error);
        sessionPresentStudents = {};
      }
    }
  }

  const result: Result = {};
  // Gap dates are by definition absent from `cohortAttendanceByDate`, so the two never
  // overlap and there is nothing to reconcile.
  const dates = Object.keys({
    ...cohortAttendanceByDate,
    ...sessionPresentStudents,
  });
  for (const date of dates) {
    const countedStudentIds = await getCountedStudentIds(
      response,
      new Date(date)
    );
    const totalStudentsCount = countedStudentIds.length;
    console.log(
      `totalStudentsCount for ${date}: ${totalStudentsCount}, userIds:`,
      countedStudentIds
    );
    let presentCount: number;
    const statusByUserId = cohortAttendanceByDate[date];
    if (statusByUserId) {
      const countedPresentIds = countedStudentIds.filter(
        (id) => statusByUserId.get(id) === 'present'
      );
      presentCount = countedPresentIds.length;
      console.log(
        `presentCount for ${date}: ${presentCount}, userIds:`,
        countedPresentIds
      );
      console.log(
        `attendance status for ${date}:`,
        countedStudentIds.map((id) => ({
          userId: id,
          attendance: statusByUserId.get(id) ?? 'not marked',
        }))
      );
    } else {
      presentCount = sessionPresentStudents[date]?.present_students ?? 0;
    }
    const presentPercentage =
      totalStudentsCount > 0
        ? parseFloat(((presentCount / totalStudentsCount) * 100).toFixed(2))
        : 0;
    result[date] = {
      present_students: presentCount,
      totalcount: totalStudentsCount,
      present_percentage: presentPercentage,
    };
  }
  return result;
};
