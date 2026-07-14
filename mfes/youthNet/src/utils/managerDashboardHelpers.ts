// Pure, reusable business logic for the Manager Dashboard Overview (Course List, Status
// Details Modal, High Quiz Attempt Count, Top Performers). Kept out of components so it can be
// unit-tested independently and reused across the Overview, Team, and Courses tabs.
import {
  AttemptSortOrder,
  Course,
  CourseById,
  CourseCardModel,
  CourseLearnerEntry,
  CourseLearningSummaryResult,
  CourseListFilters,
  CourseStatusCounts,
  CourseStatusKey,
  CourseUserLearningSummary,
  EmployeeCourseGroups,
  EmployeeCourseProgress,
  EmployeeProgressSummary,
  HighAttemptFilter,
  HighAttemptUser,
  IndividualProgressRow,
  ManagerDashboardTabKey,
  ManagerTeamUser,
  NormalizedStatus,
  StatusConfigItem,
  StatusSummaryItem,
  TopPerformer,
  UserById,
  UserCourseLearningMap,
  UserProgressCounts,
} from './Interface';
import {
  COURSE_CARD_STATUS_CONFIG,
  EMPTY_COURSE_STATUS_COUNTS,
  HIGH_ATTEMPT_THRESHOLD,
  INDIVIDUAL_PROGRESS_STATUS_CONFIG,
  MANAGER_DASHBOARD_NAV_ITEMS,
  STATUS_NORMALIZATION_MAP,
} from './app.config';

export const isHighAttempt = (highestAttempt: number): boolean =>
  highestAttempt >= HIGH_ATTEMPT_THRESHOLD;

// Which of theme.palette.highAttemptLevelColors ('3' | '4' | '5') an attempt count maps to —
// only meaningful for counts that already pass `isHighAttempt`; 5+ all share the '5' color.
export const getHighAttemptLevel = (highestAttempt: number): '3' | '4' | '5' => {
  if (highestAttempt <= 3) return '3';
  if (highestAttempt === 4) return '4';
  return '5';
};

export const normalizeLearningStatus = (status: string | undefined | null): NormalizedStatus =>
  STATUS_NORMALIZATION_MAP[status ?? ''] ?? 'notStarted';

export const isManagerDashboardTabKey = (value: unknown): value is ManagerDashboardTabKey =>
  MANAGER_DASHBOARD_NAV_ITEMS.some((item) => item.key === value);

export const buildUserById = (users: ManagerTeamUser[]): UserById =>
  users.reduce<UserById>((acc, user) => {
    if (user?.userId) acc[user.userId] = user;
    return acc;
  }, {});

export const buildCourseById = (courses: Course[]): CourseById =>
  courses.reduce<CourseById>((acc, course) => {
    if (course?.identifier) acc[course.identifier] = course;
    return acc;
  }, {});

export const getUserDisplayName = (user: ManagerTeamUser | undefined, fallback: string): string => {
  if (!user) return fallback;
  return user.name || `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || fallback;
};

export const getUserInitials = (name: string): string => {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + (parts.at(-1)?.charAt(0) ?? '')).toUpperCase();
};

export const getCourseDisplayName = (course: Course | undefined, fallback: string): string =>
  course?.name || course?.englishName || fallback;

export const getCourseLanguageLabel = (course: Course | undefined): string => {
  const raw = course?.language?.[0];
  if (!raw) return 'EN';
  const normalized = raw.trim().toLowerCase();
  if (normalized.startsWith('hi')) return 'HI';
  if (normalized.startsWith('en')) return 'EN';
  return raw.slice(0, 2).toUpperCase();
};

// The composite search API returns `courseType` inconsistently — sometimes a plain string,
// sometimes an array (e.g. ["Mandatory"]) — so normalize to a single trimmed string before any
// comparison instead of assuming either shape.
export const getCourseTypeValue = (courseType: Course['courseType']): string => {
  if (Array.isArray(courseType)) return String(courseType[0] ?? '').trim();
  return String(courseType ?? '').trim();
};

// "Mandatory" -> M, anything else ("Optional", missing, etc.) -> NM.
export const getCourseTypeBadge = (courseType: Course['courseType']): 'M' | 'NM' =>
  getCourseTypeValue(courseType).toLowerCase() === 'mandatory' ? 'M' : 'NM';

// Single source of truth for the Mandatory/Non-Mandatory split — used by both the Course List
// badge and My Team's mandatory/non-mandatory progress columns, instead of re-checking
// `courseType === 'Mandatory'` in multiple places.
export const isMandatoryCourse = (course: Course): boolean =>
  getCourseTypeValue(course.courseType).toLowerCase() === 'mandatory';

/** Per-user entries for one course, safe against a missing/partial summary. */
export const getCourseUserEntries = (
  courseId: string,
  summary: CourseLearningSummaryResult
): Array<{ userId: string; status: string; highestAttempt: number; issuedOn: string | null }> => {
  const userMap = summary[courseId];
  if (!userMap) return [];
  return Object.entries(userMap).map(([userId, entry]) => ({
    userId,
    status: entry?.status ?? '',
    highestAttempt: entry?.highestAttempt ?? 0,
    issuedOn: entry?.issuedOn ?? null,
  }));
};

export const getCourseStatusCounts = (
  courseId: string,
  summary: CourseLearningSummaryResult
): CourseStatusCounts => {
  const entries = getCourseUserEntries(courseId, summary);
  if (entries.length === 0) return { ...EMPTY_COURSE_STATUS_COUNTS };

  return entries.reduce<CourseStatusCounts>((counts, entry) => {
    const normalized = normalizeLearningStatus(entry.status);
    counts[normalized] += 1;
    // High attempts is a derived flag, not mutually exclusive with the 4 statuses above — a
    // learner can be "completed" and still have needed 3+ attempts to get there.
    if (isHighAttempt(entry.highestAttempt)) counts.highAttempts += 1;
    return counts;
  }, { ...EMPTY_COURSE_STATUS_COUNTS });
};

/** Users (+ highest attempt / certificate issue date) belonging to a given course + status chip —
 * status chips are clickable only when > 0. */
export const getCourseUsersByStatus = (
  courseId: string,
  status: CourseStatusKey,
  summary: CourseLearningSummaryResult,
  userById: UserById
): CourseLearnerEntry[] => {
  const entries = getCourseUserEntries(courseId, summary);
  const matching =
    status === 'highAttempts'
      ? entries.filter((entry) => isHighAttempt(entry.highestAttempt))
      : entries.filter((entry) => normalizeLearningStatus(entry.status) === status);

  return matching
    .map((entry) => {
      const user = userById[entry.userId];
      if (!user) return null;
      return { user, highestAttempt: entry.highestAttempt, issuedOn: entry.issuedOn };
    })
    .filter((entry): entry is CourseLearnerEntry => Boolean(entry));
};

/** Every (userId, courseId) pair anywhere in the summary with highestAttempt >= threshold. */
export const getHighQuizAttemptUsers = (
  summary: CourseLearningSummaryResult,
  userById: UserById,
  courseById: CourseById
): HighAttemptUser[] => {
  const result: HighAttemptUser[] = [];

  Object.entries(summary).forEach(([courseId, userMap]) => {
    const course = courseById[courseId];
    Object.entries(userMap).forEach(([userId, entry]) => {
      if (!isHighAttempt(entry?.highestAttempt ?? 0)) return;
      const user = userById[userId];
      if (!user) return; // unknown user — skip rather than render a broken row
      result.push({
        userId,
        courseId,
        userName: getUserDisplayName(user, userId),
        courseName: getCourseDisplayName(course, courseId),
        language: getCourseLanguageLabel(course),
        highestAttempt: entry.highestAttempt,
      });
    });
  });

  return result;
};

export const filterHighAttemptUsersByAttempt = (
  users: HighAttemptUser[],
  filter: HighAttemptFilter
): HighAttemptUser[] => {
  if (filter === '5+') return users.filter((u) => u.highestAttempt >= 5);
  const target = Number(filter);
  return users.filter((u) => u.highestAttempt === target);
};

/** Returns a new sorted array — never mutates `users`. */
export const sortHighAttemptUsers = (
  users: HighAttemptUser[],
  order: AttemptSortOrder
): HighAttemptUser[] =>
  [...users].sort((a, b) =>
    order === 'desc' ? b.highestAttempt - a.highestAttempt : a.highestAttempt - b.highestAttempt
  );

export const getCertificateCountByUser = (
  summary: CourseLearningSummaryResult
): Record<string, number> => {
  const counts: Record<string, number> = {};
  Object.values(summary).forEach((userMap) => {
    Object.entries(userMap).forEach(([userId, entry]) => {
      if (normalizeLearningStatus(entry?.status) === 'certificateIssued') {
        counts[userId] = (counts[userId] ?? 0) + 1;
      }
    });
  });
  return counts;
};

export const getTopPerformers = (
  summary: CourseLearningSummaryResult,
  userById: UserById,
  limit = 5
): TopPerformer[] => {
  const certificateCounts = getCertificateCountByUser(summary);

  const performers: TopPerformer[] = Object.entries(certificateCounts)
    .map(([userId, certificateCount]) => {
      const user = userById[userId];
      if (!user) return null;
      return { userId, userName: getUserDisplayName(user, userId), certificateCount };
    })
    .filter((performer): performer is TopPerformer => Boolean(performer && performer.certificateCount > 0));

  // Deterministic ordering: certificate count desc, then name asc on ties — so the list doesn't
  // reshuffle between renders when counts are equal.
  return [...performers]
    .sort((a, b) => b.certificateCount - a.certificateCount || a.userName.localeCompare(b.userName))
    .slice(0, limit);
};

export const filterCourses = (courses: Course[], filters: CourseListFilters): Course[] =>
  courses.filter((course) => {
    if (filters.courseType && getCourseTypeValue(course.courseType) !== filters.courseType) return false;
    if (filters.language) {
      const label = getCourseLanguageLabel(course).toLowerCase();
      if (label !== filters.language.toLowerCase()) return false;
    }
    if (filters.courseNames.length > 0) {
      const name = getCourseDisplayName(course, '');
      if (!filters.courseNames.includes(name)) return false;
    }
    return true;
  });

/**
 * Restricts a Course Learning Summary to a subset of course IDs — used to scope High Quiz
 * Attempt Count / Top Performers to the courses matching the Course List filters.
 * `courseIds: null` means "no filters active" and returns the summary unchanged.
 */
export const filterSummaryByCourseIds = (
  summary: CourseLearningSummaryResult,
  courseIds: string[] | null
): CourseLearningSummaryResult => {
  if (!courseIds) return summary;
  const scoped: CourseLearningSummaryResult = {};
  courseIds.forEach((courseId) => {
    if (summary[courseId]) scoped[courseId] = summary[courseId];
  });
  return scoped;
};

/**
 * Course IDs matching the Course Type / Language / Course Name filters — null when none of the
 * three are active, so callers can skip scoping entirely (every course applies).
 */
export const getSelectedCourseIds = (courses: Course[], filters: CourseListFilters): string[] | null => {
  const isFilterActive = Boolean(filters.courseType) || Boolean(filters.language) || filters.courseNames.length > 0;
  if (!isFilterActive) return null;
  return filterCourses(courses, filters).map((course) => course.identifier);
};

export const paginateCourses = <T,>(
  items: T[],
  currentPage: number,
  pageSize: number
): { visibleItems: T[]; totalPages: number } => {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  return { visibleItems: items.slice(startIndex, startIndex + pageSize), totalPages };
};

// Generic frontend pagination — reused as-is for My Team's employee list rather than
// reimplementing the same slicing logic under a new name.
export const paginateUsers = paginateCourses;

// --- My Team / Individual Progress --------------------------------------------------------------

/**
 * Inverts the course-centric `CourseLearningSummaryResult` into a user-centric lookup, built once
 * per render rather than re-scanning every course for every employee row/cell.
 */
export const buildUserCourseLearningMap = (
  summary: CourseLearningSummaryResult
): UserCourseLearningMap => {
  const map: UserCourseLearningMap = {};
  Object.entries(summary).forEach(([courseId, userMap]) => {
    Object.entries(userMap).forEach(([userId, entry]) => {
      if (!map[userId]) map[userId] = {};
      map[userId][courseId] = entry;
    });
  });
  return map;
};

/** A user's learning records for a specific set of course ids — missing records are omitted. */
export const getUserCourseLearningRecords = (
  userId: string,
  courseIds: string[],
  userCourseLearningMap: UserCourseLearningMap
): CourseUserLearningSummary[] => {
  const userMap = userCourseLearningMap[userId];
  if (!userMap) return [];
  return courseIds
    .map((courseId) => userMap[courseId])
    .filter((entry): entry is CourseUserLearningSummary => Boolean(entry));
};

/**
 * Status distribution for one user across a given set of course ids. A course with no record at
 * all for this user (never started/enrolled) counts as `notStarted`, same as an explicit
 * `not_started` status — so the counts always sum to `courseIds.length`.
 */
export const getUserCourseStatusCounts = (
  userId: string,
  courseIds: string[],
  userCourseLearningMap: UserCourseLearningMap
): UserProgressCounts => {
  const userMap = userCourseLearningMap[userId];
  const counts: UserProgressCounts = {
    notStarted: 0,
    inProgress: 0,
    completed: 0,
    certificateIssued: 0,
    total: courseIds.length,
  };

  courseIds.forEach((courseId) => {
    const entry = userMap?.[courseId];
    counts[normalizeLearningStatus(entry?.status)] += 1;
  });

  return counts;
};

export const getUserMandatoryCourseProgress = (
  userId: string,
  mandatoryCourseIds: string[],
  userCourseLearningMap: UserCourseLearningMap
): UserProgressCounts => getUserCourseStatusCounts(userId, mandatoryCourseIds, userCourseLearningMap);

export const getUserNonMandatoryCourseProgress = (
  userId: string,
  nonMandatoryCourseIds: string[],
  userCourseLearningMap: UserCourseLearningMap
): UserProgressCounts => getUserCourseStatusCounts(userId, nonMandatoryCourseIds, userCourseLearningMap);

/** Count of (userId, courseId) pairs — restricted to `courseIds` — with highestAttempt >= threshold. */
export const getUserHighAttemptCount = (
  userId: string,
  courseIds: string[],
  userCourseLearningMap: UserCourseLearningMap
): number =>
  getUserCourseLearningRecords(userId, courseIds, userCourseLearningMap).filter((entry) =>
    isHighAttempt(entry?.highestAttempt ?? 0)
  ).length;

export const getProgressSegmentPercentage = (count: number, total: number): number =>
  total > 0 ? (count / total) * 100 : 0;

/**
 * Non-zero status counts only, in the fixed Certificate Issued -> Completed -> In Progress ->
 * Not Started order. Accepts any status-config array sharing the same 4 keys (defaults to My
 * Team's abbreviated labels) so the Course Card's full-word labels can reuse this same function.
 */
export const getVisibleStatusSummaries = (
  counts: UserProgressCounts,
  config: StatusConfigItem[] = INDIVIDUAL_PROGRESS_STATUS_CONFIG
): StatusSummaryItem[] =>
  config.filter((item) => counts[item.key] > 0).map((item) => ({ ...item, count: counts[item.key] }));

// --- Courses / Course Breakdown ------------------------------------------------------------------

/** Converts the 5-key course-row shape (includes the non-exclusive `highAttempts` flag) into the
 * 4-key + total shape shared with My Team, so both can drive the same `SegmentedProgressBar`. */
export const toProgressCounts = (counts: CourseStatusCounts): UserProgressCounts => ({
  notStarted: counts.notStarted,
  inProgress: counts.inProgress,
  completed: counts.completed,
  certificateIssued: counts.certificateIssued,
  total: counts.notStarted + counts.inProgress + counts.completed + counts.certificateIssued,
});

// The Course API doesn't expose a single documented "logical course" id — different language
// variants of the same course are separate `identifier`s. Prefer an explicit courseId-style field
// if the backend ever adds one, then fall back to the English name (usually shared across
// language variants), then the display name, then the identifier itself.
const getCourseUniqueKey = (course: Course): string =>
  String((course as { courseId?: string }).courseId ?? course.englishName ?? course.name ?? course.identifier);

/** Total rendered Course Card entries (one per course+language combination). */
export const getCourseEntryCount = (courses: Course[]): number => courses.length;

/** Distinct logical courses, collapsing language variants of the same course into one. */
export const getUniqueCourseCount = (courses: Course[]): number =>
  new Set(courses.map(getCourseUniqueKey)).size;

// Course metadata fields for "category" vary by source (`subject`, `category`, `primaryCategory`)
// and aren't guaranteed — render nothing rather than a misleading/guessed label when absent.
export const getCourseCategoryLabel = (course: Course): string => {
  const subject = (course as { subject?: string[] }).subject;
  const raw = (Array.isArray(subject) ? subject[0] : undefined)
    ?? (course as { category?: string }).category
    ?? (course as { primaryCategory?: string }).primaryCategory;
  return typeof raw === 'string' ? raw.trim() : '';
};

export const getCourseTypeLabel = (course: Course): string =>
  isMandatoryCourse(course) ? 'MANAGER_OVERVIEW.MANDATORY' : 'MANAGER_OVERVIEW.NON_MANDATORY';

/** Builds one normalized Course Card model per course entry — pure derivation, no stored state. */
export const getCourseCardModels = (
  courses: Course[],
  summary: CourseLearningSummaryResult
): CourseCardModel[] =>
  courses.map((course) => ({
    courseId: course.identifier,
    courseName: getCourseDisplayName(course, course.identifier),
    language: getCourseLanguageLabel(course),
    category: getCourseCategoryLabel(course),
    isMandatory: isMandatoryCourse(course),
    progress: toProgressCounts(getCourseStatusCounts(course.identifier, summary)),
  }));

/** Learners for one course + one of the 4 normalized statuses, each with their highest attempt —
 * used by the Course Learners Modal instead of a separate lookup/API call. */
export const getCourseLearnersByStatus = (
  courseId: string,
  status: NormalizedStatus,
  summary: CourseLearningSummaryResult,
  userById: UserById
): CourseLearnerEntry[] =>
  getCourseUserEntries(courseId, summary)
    .filter((entry) => normalizeLearningStatus(entry.status) === status)
    .map((entry) => {
      const user = userById[entry.userId];
      if (!user) return null; // summary references a user not in the current roster — skip
      return { user, highestAttempt: entry.highestAttempt, issuedOn: entry.issuedOn };
    })
    .filter((entry): entry is CourseLearnerEntry => Boolean(entry));

/**
 * Builds one row per employee — visible even when they have no matching courses/progress data,
 * per the "employees remain visible while filters recalculate progress" requirement.
 */
export const buildIndividualProgressRows = (
  users: ManagerTeamUser[],
  mandatoryCourseIds: string[],
  nonMandatoryCourseIds: string[],
  userCourseLearningMap: UserCourseLearningMap
): IndividualProgressRow[] =>
  users.map((user) => {
    const allCourseIds = [...mandatoryCourseIds, ...nonMandatoryCourseIds];
    return {
      userId: user.userId,
      userName: getUserDisplayName(user, user.userId),
      metadata: user.designation || user.role || '',
      mandatoryProgress: getUserMandatoryCourseProgress(user.userId, mandatoryCourseIds, userCourseLearningMap),
      nonMandatoryProgress: getUserNonMandatoryCourseProgress(
        user.userId,
        nonMandatoryCourseIds,
        userCourseLearningMap
      ),
      flags: { highAttemptCount: getUserHighAttemptCount(user.userId, allCourseIds, userCourseLearningMap) },
    };
  });

// --- Employee Detail Page -----------------------------------------------------------------------

// Config lookup, shared with the Course Card labels/colors — status badges on the Employee Detail
// Page must not introduce a page-specific color/label mapping.
export const getCourseStatusConfig = (status: NormalizedStatus): StatusConfigItem | undefined =>
  COURSE_CARD_STATUS_CONFIG.find((item) => item.key === status);

/**
 * One normalized progress entry per course entry (course+language variant) for a single employee.
 * A course with no record for this user normalizes to 'notStarted' via `normalizeLearningStatus`,
 * same missing-record behavior as the rest of the Manager Dashboard.
 */
export const getEmployeeCourseProgress = (
  userId: string,
  courses: Course[],
  courseLearningSummary: CourseLearningSummaryResult
): EmployeeCourseProgress[] =>
  courses.map((course) => {
    const entry = courseLearningSummary[course.identifier]?.[userId];
    return {
      courseId: course.identifier,
      courseName: getCourseDisplayName(course, course.identifier),
      language: getCourseLanguageLabel(course),
      isMandatory: isMandatoryCourse(course),
      status: normalizeLearningStatus(entry?.status),
      highestAttempt: entry?.highestAttempt ?? 0,
    };
  });

/** Splits an employee's course entries into Mandatory / Non-Mandatory, preserving API order. */
export const groupEmployeeCoursesByType = (employeeCourses: EmployeeCourseProgress[]): EmployeeCourseGroups => ({
  mandatory: employeeCourses.filter((course) => course.isMandatory),
  nonMandatory: employeeCourses.filter((course) => !course.isMandatory),
});

/** Highest `highestAttempt` value across an employee's course entries (0 when there are none). */
export const getHighestAttempt = (employeeCourses: EmployeeCourseProgress[]): number =>
  employeeCourses.reduce((max, course) => Math.max(max, course.highestAttempt), 0);

/** Count of an employee's course entries meeting the shared high-attempt threshold. */
export const getHighestAttemptCourseCount = (employeeCourses: EmployeeCourseProgress[]): number =>
  employeeCourses.filter((course) => isHighAttempt(course.highestAttempt)).length;

const emptyEmployeeCategorySummary = () => ({ total: 0, mandatory: 0, nonMandatory: 0 });

/** Summary Card figures for the Employee Detail Page — pure derivation from the normalized
 * per-course progress entries, no additional lookups. */
export const getEmployeeProgressSummary = (employeeCourses: EmployeeCourseProgress[]): EmployeeProgressSummary => {
  const summary: EmployeeProgressSummary = {
    certificatesIssued: emptyEmployeeCategorySummary(),
    completed: emptyEmployeeCategorySummary(),
    inProgress: emptyEmployeeCategorySummary(),
    highAttemptCourses: {
      total: getHighestAttemptCourseCount(employeeCourses),
      highestAttempt: getHighestAttempt(employeeCourses),
    },
  };

  const bucketByStatus: Partial<Record<NormalizedStatus, EmployeeProgressSummary['certificatesIssued']>> = {
    certificateIssued: summary.certificatesIssued,
    completed: summary.completed,
    inProgress: summary.inProgress,
  };

  employeeCourses.forEach((course) => {
    const bucket = bucketByStatus[course.status];
    if (!bucket) return;
    bucket.total += 1;
    if (course.isMandatory) bucket.mandatory += 1;
    else bucket.nonMandatory += 1;
  });

  return summary;
};
