import { attendanceStatusList } from '../services/AttendanceService';
import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import {
  AttendancePercentageProps,
  CohortMemberList,
} from '../utils/Interfaces';
import { getLatestEntries, shortDateFormat } from './helper';
import { Status } from './app.constant';

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



type Result = {
  [date: string]: {
    present_students: number;
    totalcount: number;
    present_percentage: number;
  };
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
  selectedDate?: any
): Promise<Result> => {
  const response = await getMyCohortMemberList(cohortMemberRequest);

  // Batch-level attendance (context 'cohort', contextId = the batch), one row per learner per day.
  const cohortAttendanceByDate = await getCohortAttendanceByDate(
    attendanceRequest.filters
  );

  const result: Result = {};
  for (const [date, statusByUserId] of Object.entries(
    cohortAttendanceByDate
  )) {
    const countedStudentIds = await getCountedStudentIds(
      response,
      new Date(date)
    );
    const totalStudentsCount = countedStudentIds.length;
    console.log(
      `totalStudentsCount for ${date}: ${totalStudentsCount}, userIds:`,
      countedStudentIds
    );
    const countedPresentIds = countedStudentIds.filter(
      (id) => statusByUserId.get(id) === 'present'
    );
    const presentCount = countedPresentIds.length;
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
