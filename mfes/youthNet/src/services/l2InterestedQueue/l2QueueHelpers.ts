import { L2_FIELD_IDS, L2_INTERESTED_VALUES } from './l2Queue.config';

const findField = (row: any, label: string) =>
  row?.customFields?.find((field: any) => field.label === label);

export const getLearnerDomain = (row: any): string | null =>
  findField(row, 'DOMAIN')?.selectedValues?.[0] ?? null;

export const getLearnerCourseId = (row: any): string | null =>
  findField(row, 'COURSES')?.selectedValues?.[0] ?? null;

export const getLearnerNote = (row: any): string =>
  findField(row, 'INTERACTION_NOTE')?.selectedValues?.[0] ?? '';

export const getLearnerTaggedByUserId = (row: any): string | null =>
  findField(row, 'DOMAIN')?.updatedBy ?? findField(row, 'COURSES')?.updatedBy ?? null;

export const getLearnerInterestedAt = (row: any): string | null =>
  findField(row, 'L2_INTERESTED')?.createdAt ?? row?.createdAt ?? null;

export const isLearnerTagged = (row: any): boolean =>
  !!getLearnerDomain(row) && !!getLearnerCourseId(row);

export const getLearnerLocationValue = (row: any, label: string): string =>
  findField(row, label)?.selectedValues?.[0]?.value ?? '-';

export const buildTagCustomFields = (
  domain: string,
  courseId: string,
  note?: string
) => {
  const customFields = [
    { fieldId: L2_FIELD_IDS.DOMAIN, value: domain },
    { fieldId: L2_FIELD_IDS.COURSES, value: courseId },
  ];
  if (note) {
    customFields.push({ fieldId: L2_FIELD_IDS.INTERACTION_NOTE, value: note });
  }
  return customFields;
};

export const buildBatchEnrollCustomFields = () => [
  { fieldId: L2_FIELD_IDS.L2_INTERESTED, value: L2_INTERESTED_VALUES.ENROLLED },
];

// updateUser() (services/youthNet/Dashboard/UserServices.ts) catches its own
// axios errors and *returns* the error instead of throwing/rejecting — a
// pre-existing pattern in this codebase (see user-profile/[userId].tsx,
// villages/index.tsx, which have the same gap). Promise.all around it never
// rejects, so every call site here must inspect the resolved value itself
// to tell success from failure, instead of relying on try/catch.
export const isUpdateUserSuccess = (result: any): boolean => {
  const responseCode = result?.data?.responseCode ?? result?.response?.data?.responseCode;
  if (result?.isAxiosError || result instanceof Error) return false;
  return responseCode === undefined || responseCode === 200;
};

// Pulls the backend's own error message (e.g. "userData should not be
// empty") out of a failed updateUser() result, whichever of the two shapes
// it came back as, so the toast can show something more specific than a
// generic failure message when the backend provides one.
export const getUpdateUserErrorMessage = (result: any): string | undefined =>
  result?.data?.params?.errmsg ?? result?.response?.data?.params?.errmsg ?? undefined;
