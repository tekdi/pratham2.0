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
  CourseUserLearningMap,
  CourseUserLearningSummary,
  CustomFieldChipValue,
  CustomFieldValueCount,
  EmployeeCourseGroups,
  EmployeeCourseProgress,
  EmployeeProgressSummary,
  HighAttemptFilter,
  HighAttemptUser,
  IndividualProgressRow,
  ManagerDashboardTabKey,
  ManagerTeamUser,
  MonthlyCertificateCount,
  NormalizedStatus,
  StatusConfigItem,
  StatusSummaryItem,
  TopPerformer,
  UserById,
  UserCourseLearningMap,
  UserProgressCounts,
} from './Interface';
import {
  ATTEMPT_FILTER_OPTIONS,
  COURSE_CARD_STATUS_CONFIG,
  EMPTY_COURSE_STATUS_COUNTS,
  HIGH_ATTEMPT_THRESHOLD,
  INDIVIDUAL_PROGRESS_STATUS_CONFIG,
  MANAGER_DASHBOARD_ALL_FILTER_OPTION,
  MANAGER_DASHBOARD_CUSTOM_FIELD_COURSE_KEYS,
  MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS,
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

// The Team view groups/filters learners by job family, PSU, and group membership — a user with
// none of those custom fields has nothing to show there.
export const hasManagerDashboardCustomField = (user: ManagerTeamUser): boolean => {
  const customFields = user.customFields as { label?: string }[] | undefined;
  return (
    Array.isArray(customFields) &&
    customFields.some((field) => MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.includes(field?.label ?? ''))
  );
};

type ManagerDashboardCustomField = {
  label?: string;
  selectedValues?: (string | { value?: string })[];
};

// Every distinct value seen across all users for each of JOB_FAMILY / PSU / EMP_GROUP — e.g. for
// the Team view's filter dropdowns. `selectedValues` entries are either a plain string or a
// `{ id, value }` option object depending on the custom field's `type`.
export const getManagerDashboardCustomFieldValues = (
  users: ManagerTeamUser[]
): Record<string, string[]> => {
  const uniqueValuesByLabel: Record<string, Set<string>> = Object.fromEntries(
    MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.map((label) => [label, new Set<string>()])
  );

  users.forEach((user) => {
    const customFields = user.customFields as ManagerDashboardCustomField[] | undefined;
    if (!Array.isArray(customFields)) return;

    customFields.forEach((field) => {
      const label = field?.label ?? '';
      if (!MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.includes(label)) return;

      (field.selectedValues ?? []).forEach((selectedValue) => {
        const value = typeof selectedValue === 'string' ? selectedValue : selectedValue?.value;
        if (value) uniqueValuesByLabel[label].add(value);
      });
    });
  });

  return Object.fromEntries(
    MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.map((label) => [label, Array.from(uniqueValuesByLabel[label])])
  );
};

// A single user's own values for one label (JOB_FAMILY / PSU / EMP_GROUP) — the per-user
// counterpart to getManagerDashboardCustomFieldValues, which aggregates across every user.
export const getUserCustomFieldValues = (user: ManagerTeamUser, label: string): string[] => {
  const customFields = user.customFields as ManagerDashboardCustomField[] | undefined;
  if (!Array.isArray(customFields)) return [];

  return customFields
    .filter((field) => field?.label === label)
    .flatMap((field) => field.selectedValues ?? [])
    .map((value) => (typeof value === 'string' ? value : value?.value))
    .filter((value): value is string => Boolean(value));
};

// This user's own JOB_FAMILY/PSU/EMP_GROUP values, one entry per label they actually carry a
// value for — for showing custom-field chips anywhere an employee is listed (Team tab rows,
// Employee Detail Page profile). Labels the user has no value for are omitted entirely rather
// than shown empty.
export const getUserCustomFieldChipValues = (user: ManagerTeamUser): CustomFieldChipValue[] =>
  MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.map((label) => ({
    label,
    value: getUserCustomFieldValues(user, label).join(', '),
  })).filter((entry) => entry.value.length > 0);

// A course's declared audience for one label — courses carry these as plain string arrays
// (jobFamily / psu / groupMembership), unlike a user's {label, selectedValues} customFields shape.
export const getCourseCustomFieldValues = (course: Course, label: string): string[] => {
  const key = MANAGER_DASHBOARD_CUSTOM_FIELD_COURSE_KEYS[label];
  const values = key ? (course as Record<string, unknown>)[key] : undefined;
  return Array.isArray(values) ? (values as string[]) : [];
};

// Real data disagrees on casing between a user's own customFields values (e.g. "TECHNOLOGY &
// DIGITAL") and a course's declared audience (e.g. "Technology & Digital") — matching case-
// sensitively would silently drop every course for every filter, so this compares case-insensitively.
const hasOverlap = (values: string[], otherValues: string[]): boolean => {
  if (values.length === 0 || otherValues.length === 0) return false;
  const normalizedOther = new Set(otherValues.map((value) => value.trim().toLowerCase()));
  return values.some((value) => normalizedOther.has(value.trim().toLowerCase()));
};

// A filter label only restricts results once the user has explicitly picked a subset — untouched
// (`undefined`) or fully re-selected (includes the "ALL" sentinel) both mean "don't filter by
// this label at all", per the Team/Courses filters' "no selection yet = show everything" default.
// An explicit `[]` (every option unchecked) is a real, active filter — it matches nothing.
const getActiveUserCustomFilters = (
  userFilterFamily: Record<string, string[]>
): { label: string; values: string[] }[] =>
  MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.map((label) => {
    const selected = userFilterFamily[label];
    if (selected === undefined || selected.includes(MANAGER_DASHBOARD_ALL_FILTER_OPTION)) return null;
    return { label, values: selected };
  }).filter((entry): entry is { label: string; values: string[] } => entry !== null);

// Step A of the JOB_FAMILY/PSU/EMP_GROUP filtering pipeline — a course survives if its declared
// audience (jobFamily/psu/groupMembership) overlaps the selected values for AT LEAST ONE actively-
// filtered label (OR across labels, and OR within a label's values too).
export const filterCoursesByUserCustomFilters = (
  courses: Course[],
  userFilterFamily: Record<string, string[]>
): Course[] => {
  const activeFilters = getActiveUserCustomFilters(userFilterFamily);
  if (activeFilters.length === 0) return courses;

  return courses.filter((course) =>
    activeFilters.some(({ label, values }) => hasOverlap(values, getCourseCustomFieldValues(course, label)))
  );
};

// Does this user belong to this course's declared audience — overlap between the user's own
// JOB_FAMILY/PSU/EMP_GROUP values and the course's declared jobFamily/psu/groupMembership, across
// all 3 categories (OR), regardless of what's currently active in the filter UI. A course with
// none of the 3 arrays populated has no declared audience, so no user can "belong" to it. Shared
// by the courseLearningSummary pruning below and the Employee Detail Page's own course list.
export const isUserEligibleForCourse = (user: ManagerTeamUser, course: Course): boolean =>
  MANAGER_DASHBOARD_CUSTOM_FIELD_LABELS.some((label) =>
    hasOverlap(getUserCustomFieldValues(user, label), getCourseCustomFieldValues(course, label))
  );

// Steps B+C — restricts courseLearningSummary to the courses that survived
// filterCoursesByUserCustomFilters, then within each of those, drops any user who isn't eligible
// for that specific course (see isUserEligibleForCourse).
export const filterCourseLearningSummaryForFilteredCourses = (
  courseLearningSummary: CourseLearningSummaryResult,
  filteredCourses: Course[],
  users: ManagerTeamUser[]
): CourseLearningSummaryResult => {
  const filteredCourseById = buildCourseById(filteredCourses);
  const userById = buildUserById(users);

  const result: CourseLearningSummaryResult = {};

  Object.entries(courseLearningSummary).forEach(([courseId, userSummaries]) => {
    const course = filteredCourseById[courseId];
    if (!course) return; // dropped by the course-level filter — drop its summary entirely too

    const filteredUserSummaries: CourseUserLearningMap = {};
    Object.entries(userSummaries).forEach(([userId, summary]) => {
      const user = userById[userId];
      if (user && isUserEligibleForCourse(user, course)) filteredUserSummaries[userId] = summary;
    });

    result[courseId] = filteredUserSummaries;
  });

  return result;
};

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
  const raw = course?.contentLanguage ?? course?.language?.[0];
  if (!raw) return 'EN';
  const normalized = raw.trim().toLowerCase();
  if (normalized.startsWith('hi')) return 'HI';
  if (normalized.startsWith('en')) return 'EN';
  return raw.slice(0, 2).toUpperCase();
};

// Full, human-readable language name for display (e.g. "Marathi", "Tamil") — falls back to the
// `language` array's raw value, then "English", when `contentLanguage` isn't present.
export const getCourseLanguageName = (course: Course | undefined): string =>
  course?.contentLanguage?.trim() || course?.language?.[0]?.trim() || 'English';

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
// Each user's mandatory/non-mandatory course ids are scoped to the courses THEY are actually
// eligible for (see isUserEligibleForCourse) — a course outside a user's own JOB_FAMILY/PSU/
// EMP_GROUP audience must not count toward their "not started" total just because they have no
// summary entry for it. `courses` is the same (Course Type/Language/Course Name-)filtered list
// every user's row scopes down from; eligibility narrows it further, per user.
export const buildIndividualProgressRows = (
  users: ManagerTeamUser[],
  courses: Course[],
  userCourseLearningMap: UserCourseLearningMap
): IndividualProgressRow[] =>
  users.map((user) => {
    const eligibleCourses = courses.filter((course) => isUserEligibleForCourse(user, course));
    const mandatoryCourseIds = eligibleCourses.filter(isMandatoryCourse).map((course) => course.identifier);
    const nonMandatoryCourseIds = eligibleCourses
      .filter((course) => !isMandatoryCourse(course))
      .map((course) => course.identifier);
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
      customFieldValues: getUserCustomFieldChipValues(user),
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
// Only courses this employee is actually eligible for (see isUserEligibleForCourse) — a course
// whose declared jobFamily/psu/groupMembership audience doesn't include this employee never
// appears on their Employee Detail Page, even if the summary happens to carry an entry for them.
export const getEmployeeCourseProgress = (
  userId: string,
  courses: Course[],
  courseLearningSummary: CourseLearningSummaryResult,
  user: ManagerTeamUser | undefined
): EmployeeCourseProgress[] => {
  if (!user) return [];

  return courses
    .filter((course) => isUserEligibleForCourse(user, course))
    .map((course) => {
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
};

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

// --- Dashboard Overview (Dashboard tab aggregate analytics) ------------------------------------

/** Status counts summed across every course in `courses` — the Dashboard tab's team-wide status
 * breakdown, as opposed to `getCourseStatusCounts`'s single-course view. */
export const getAggregateStatusCounts = (
  courses: Course[],
  summary: CourseLearningSummaryResult
): CourseStatusCounts =>
  courses.reduce<CourseStatusCounts>((totals, course) => {
    const counts = getCourseStatusCounts(course.identifier, summary);
    (Object.keys(totals) as (keyof CourseStatusCounts)[]).forEach((key) => {
      totals[key] += counts[key];
    });
    return totals;
  }, { ...EMPTY_COURSE_STATUS_COUNTS });

/** How many users carry each distinct value for one JOB_FAMILY/PSU/EMP_GROUP label — team
 * composition for the Dashboard tab's distribution charts. Sorted by count desc. */
export const getUserCustomFieldValueCounts = (
  users: ManagerTeamUser[],
  label: string
): CustomFieldValueCount[] => {
  const counts = new Map<string, number>();
  users.forEach((user) => {
    getUserCustomFieldValues(user, label).forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
};

/** Top N courses by total tracked enrollment — reuses `getCourseCardModels` rather than
 * re-deriving course display data for a second time. */
export const getTopCoursesByEnrollment = (
  courses: Course[],
  summary: CourseLearningSummaryResult,
  limit = 6
): CourseCardModel[] =>
  getCourseCardModels(courses, summary)
    .sort((a, b) => b.progress.total - a.progress.total || a.courseName.localeCompare(b.courseName))
    .slice(0, limit);

/** Count of high-attempt users per bucket (3 / 4 / 5+) — same buckets as the High Quiz Attempt
 * section's own filter, aggregated into totals instead of a filterable list. */
export const getHighAttemptLevelCounts = (
  highAttemptUsers: HighAttemptUser[]
): Record<HighAttemptFilter, number> =>
  ATTEMPT_FILTER_OPTIONS.reduce(
    (counts, filter) => ({
      ...counts,
      [filter]: filterHighAttemptUsersByAttempt(highAttemptUsers, filter).length,
    }),
    {} as Record<HighAttemptFilter, number>
  );

/** Certificates issued per calendar month (UTC), chronological — a trend the rest of the app
 * doesn't otherwise surface even though `issuedOn` is already tracked per user-course entry. */
export const getCertificatesIssuedByMonth = (
  summary: CourseLearningSummaryResult
): MonthlyCertificateCount[] => {
  const counts = new Map<string, number>();

  Object.values(summary).forEach((userMap) => {
    Object.values(userMap).forEach((entry) => {
      if (normalizeLearningStatus(entry?.status) !== 'certificateIssued' || !entry?.issuedOn) return;
      const date = new Date(entry.issuedOn);
      if (Number.isNaN(date.getTime())) return;
      const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
      counts.set(monthKey, (counts.get(monthKey) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthKey, count]) => {
      const [year, month] = monthKey.split('-').map(Number);
      const label = new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      });
      return { monthKey, label, count };
    });
};
