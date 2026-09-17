import { put } from '@shared-lib';
import API_ENDPOINTS from '../../utils/API/APIEndpoints';
import { fetchCohortMemberList } from '../MyClassDetailsService';
import { Role } from '../../utils/app.constant';
import { UpdateCohortMemberStatusParams, LearnerProgressStatus } from '../../utils/Interfaces';
import { ALL_LEARNER_STATUSES, OJT_ADDRESS_FIELD_ID } from './myTeachingCenter.config';

// cohortmember/list returns each learner's dynamic fields as `customField`
// (singular) with a plain {label, value} shape — confirmed against
// scp-teacher-repo's CohortLearnerList.tsx / CohortFacilitatorList.tsx
// (`user.customField.find(...)`, reading `.value`). This is a different
// shape from the {label, selectedValues} customFields used on
// cohort/mycohorts and cohort/search nodes — do not conflate the two.
const findLearnerCustomFieldById = (user: any, fieldId: string) =>
  user?.customField?.find((field: any) => field.fieldId === fieldId);

// The learner-progress status (in_training/course_completed/placed/
// retention_complete/dropout) is cohortmember/list's own core `status`
// field for this Trainer/Vocational-Training context — confirmed against
// the real filters.status contract, not a customField.
export const getLearnerStatus = (user: any): LearnerProgressStatus | null =>
  (user?.status as LearnerProgressStatus) ?? null;

// Matched by fieldId (confirmed real), not label — the label was never
// confirmed against the backend, fieldId is.
export const getOjtAddress = (user: any): string =>
  findLearnerCustomFieldById(user, OJT_ADDRESS_FIELD_ID)?.value ?? '';

export const getLearnerDisplayName = (user: any): string => {
  const first = user?.firstName || user?.name || '';
  const last = user?.lastName || '';
  return [first, last].filter(Boolean).join(' ').trim() || '-';
};

export interface GetBatchLearnersParams {
  batchCohortId: string;
  limit: number;
  offset: number;
  name?: string;
  status?: LearnerProgressStatus;
}

// Calls fetchCohortMemberList() directly (not the getMyCohortMemberList()
// wrapper — see BatchListService.ts's getLearnerCount() comment for why).
// filters.status carries the learner-progress enum directly: a single
// selected status filters to just that value; with no status selected
// ("All Status"), every value except the old generic 'active' is sent
// (ALL_LEARNER_STATUSES) — confirmed backend contract, no client-side
// filtering needed.
export const getBatchLearners = async ({
  batchCohortId,
  limit,
  offset,
  name,
  status,
}: GetBatchLearnersParams): Promise<{ userDetails: any[]; totalCount: number }> => {
  const filters: any = {
    cohortId: batchCohortId,
    role: Role.STUDENT,
    status: status ? [status] : ALL_LEARNER_STATUSES,
  };
  if (name) filters.name = name;

  const resp = await fetchCohortMemberList({ limit, offset, filters });
  const userDetails: any[] = resp?.result?.userDetails || [];
  const totalCount: number = resp?.result?.totalCount || 0;
  return { userDetails, totalCount };
};

// Ported verbatim (parameter shape/behavior) from
// mfes/scp-teacher-repo/src/services/MyClassDetailsService.ts:108-157, using
// youthNet's own `put` import and the `cohortMemberUpdate` endpoint added
// to APIEndpoints.ts. Used both for the OJT-address save-on-blur (via
// dynamicBody.customFields) and for learner status/dropout-reason updates.
export const updateCohortMemberStatus = async ({
  memberStatus,
  statusReason,
  membershipId,
  dynamicBody = {},
}: UpdateCohortMemberStatusParams): Promise<any> => {
  const apiUrl: string = API_ENDPOINTS.cohortMemberUpdate(membershipId);

  const prepareCustomFields = (customFields: any[]): any[] =>
    customFields.map((field) => {
      if (field && field.value !== undefined) {
        return {
          ...field,
          value: Array.isArray(field.value)
            ? field.value
            : typeof field.value === 'object' && field.value !== null
            ? JSON.stringify(field.value)
            : field.value,
        };
      }
      return field;
    });

  const requestBody = {
    ...(memberStatus && { status: memberStatus }),
    ...(statusReason && { statusReason }),
    ...Object.entries(dynamicBody).reduce((acc, [key, value]) => {
      acc[key] =
        typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : value;
      return acc;
    }, {} as Record<string, any>),
    // Only stringify the `value` field of customFields if needed — this
    // spread runs after the generic one above and overwrites its
    // (wrongly stringified) customFields entry with the correct array.
    ...(dynamicBody?.customFields && {
      customFields: prepareCustomFields(dynamicBody.customFields),
    }),
  };

  try {
    const response = await put(apiUrl, requestBody);
    return response?.data;
  } catch (error) {
    console.error('Error updating cohort member status:', error);
    return null;
  }
};

export const isMutationSuccess = (result: any): boolean =>
  !!result && !result?.isAxiosError && !(result instanceof Error);
