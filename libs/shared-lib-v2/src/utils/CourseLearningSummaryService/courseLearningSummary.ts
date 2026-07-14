// Course Learning Summary for the Manager Dashboard Overview.
//
// One call, all courses x all users — NOT one call per course.

import { post } from '../../DynamicForm/services/RestClient';

export type CourseLearningStatus =
  | 'not_started'
  | 'in_progress'
  | 'completed'
  | 'certificate_issued'
  // The real API's certificate-issued stage — see STATUS_NORMALIZATION_MAP in youthNet's
  // utils/app.config.ts, which both variants normalize to.
  | 'viewCertificate'
  | (string & {});

export interface CourseUserLearningSummary {
  status: CourseLearningStatus;
  highestAttempt: number;
  // Set only once the certificate stage is reached — ISO string, same format as the real
  // /tracking/content/course/status endpoint (e.g. "2025-08-25T12:58:23.374Z"); null otherwise.
  issuedOn: string | null;
}

export type CourseUserLearningMap = Record<string, CourseUserLearningSummary>;
export type CourseLearningSummaryResult = Record<string, CourseUserLearningMap>;

export interface CourseLearningSummaryRequest {
  courseId: string[];
  userId: string[];
}

export interface CourseLearningSummaryApiResponse {
  responseCode: string;
  result: CourseLearningSummaryResult;
}

// Raw shape of POST /tracking/content/course/status — `data` is an array with one
// { [courseId]: CourseUserLearningMap } entry per requested course, rather than a single object
// keyed by all course ids, so it needs to be merged into `CourseLearningSummaryResult` below.
interface CourseStatusApiResponse {
  success: boolean;
  message: string;
  data: Array<Record<string, CourseUserLearningMap>>;
}

const MIDDLEWARE_BASE_URL = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || '';
const COURSE_STATUS_API_URL = `${MIDDLEWARE_BASE_URL}/tracking/content/course/status`;

// Flip to `true` to switch back to the deterministic mock for local testing — the request/
// response contract is identical either way, so no call sites need to change either direction.
const USE_MOCK_COURSE_STATUS = false;

// Simple deterministic string hash so the same courseId+userId pair always mocks the same
// status/attempt count — otherwise every re-render (and every page of pagination) would show
// different numbers for the same learner.
const hashPair = (a: string, b: string): number => {
  let hash = 0;
  const str = `${a}::${b}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + (str.codePointAt(i) ?? 0)) % 100000;
  }
  return hash;
};

const buildMockSummary = (courseId: string, userId: string): CourseUserLearningSummary => {
  const hash = hashPair(courseId, userId);
  // Weighted distribution: mostly not-started/in-progress, fewer completions/certificates —
  // roughly matches the shape of the design reference (few "completed", more "certificate
  // issued" among the courses that have any completions at all).
  const statusRoll = hash % 100;
  let status: CourseLearningStatus;
  if (statusRoll < 35) status = 'not_started';
  else if (statusRoll < 65) status = 'in_progress';
  else if (statusRoll < 75) status = 'completed';
  else status = 'certificate_issued';

  // Attempts only make sense once a learner has started; most learners need 1-2 attempts, a
  // minority need 3+ ("high attempts").
  const attemptRoll = (hash >> 3) % 100;
  let highestAttempt = 0;
  if (status !== 'not_started') {
    if (attemptRoll < 55) highestAttempt = 1;
    else if (attemptRoll < 80) highestAttempt = 2;
    else if (attemptRoll < 92) highestAttempt = 3;
    else if (attemptRoll < 98) highestAttempt = 4;
    else highestAttempt = 5 + (attemptRoll % 3);
  }

  // Certificate issue date is only meaningful once the learner actually reached that stage —
  // deterministically derived from the same hash (like status/highestAttempt above) so it stays
  // stable across re-renders/pagination, spread across roughly the last year.
  const issuedOn =
    status === 'certificate_issued'
      ? new Date(Date.UTC(2025, 0, 1) + hash * 9 * 60 * 1000).toISOString()
      : null;

  return { status, highestAttempt, issuedOn };
};

const MOCK_LATENCY_MS = 500;

const getMockCourseLearningSummary = async (
  request: CourseLearningSummaryRequest
): Promise<CourseLearningSummaryApiResponse> => {
  const { courseId: courseIds, userId: userIds } = request;

  await new Promise((resolve) => setTimeout(resolve, MOCK_LATENCY_MS));

  const result: CourseLearningSummaryResult = {};
  courseIds.forEach((courseId) => {
    const userMap: CourseUserLearningMap = {};
    userIds.forEach((userId) => {
      userMap[userId] = buildMockSummary(courseId, userId);
    });
    result[courseId] = userMap;
  });

  return { responseCode: 'OK', result };
};

const getLiveCourseLearningSummary = async (
  request: CourseLearningSummaryRequest
): Promise<CourseLearningSummaryApiResponse> => {
  const response = await post<CourseLearningSummaryRequest & { type: string }>(
    COURSE_STATUS_API_URL,
    { ...request, type: 'dashboard' }
  );
  const body: CourseStatusApiResponse = response.data;

  const result: CourseLearningSummaryResult = {};
  (body?.data ?? []).forEach((courseEntry) => {
    Object.entries(courseEntry).forEach(([courseId, userMap]) => {
      result[courseId] = userMap;
    });
  });

  return { responseCode: body?.success ? 'OK' : 'ERROR', result };
};

/**
 * Course Learning Summary for the Manager Dashboard — called ONCE with the full set of course
 * ids and user ids (never once per course).
 */
export const getCourseLearningSummary = (
  request: CourseLearningSummaryRequest
): Promise<CourseLearningSummaryApiResponse> =>
  USE_MOCK_COURSE_STATUS ? getMockCourseLearningSummary(request) : getLiveCourseLearningSummary(request);
