import { get, post, put } from './RestClient';
import { API_ENDPOINTS } from './EndUrls';
import {
  ApiResponse,
  Survey,
  SurveyResponse,
  PaginatedResponse,
} from '../../types/survey';
import type { TeacherContextRow } from '../../types/teacherSurvey';

/**
 * Nest `APIResponse.success` puts the entity on `result`, not `result.data`.
 * The MFE expects `result.data` for single-entity reads/writes — normalize both shapes.
 */
function normalizeEntityResult<T extends object>(
  api: ApiResponse<unknown>
): ApiResponse<{ data: T }> {
  const r = (api as { result?: unknown }).result;
  if (r === null || r === undefined) {
    return { ...api, result: { data: undefined as unknown as T } };
  }
  if (typeof r === 'object' && r !== null && 'data' in r) {
    const inner = (r as { data: unknown }).data;
    if (
      inner !== null &&
      typeof inner === 'object' &&
      !Array.isArray(inner)
    ) {
      return { ...api, result: { data: inner as T } };
    }
  }
  return { ...api, result: { data: r as T } };
}

export const fetchSurveyList = async (
  page = 1,
  limit = 20,
  sortBy = 'createdAt',
  sortOrder: 'ASC' | 'DESC' = 'DESC',
  listFilters?: { contextType?: string }
) => {
  const filters: { status: string; contextType?: string } = {
    status: 'published',
  };
  if (listFilters?.contextType) {
    filters.contextType = listFilters.contextType;
  }
  const response = await post<{
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: string;
    filters: typeof filters;
  }>(API_ENDPOINTS.SURVEY_LIST, { page, limit, sortBy, sortOrder, filters });
  return response.data as ApiResponse<PaginatedResponse<Survey>>;
};

export const fetchSurveyById = async (surveyId: string) => {
  const response = await get(API_ENDPOINTS.SURVEY_READ(surveyId));
  return normalizeEntityResult<Survey>(
    response.data as ApiResponse<unknown>
  );
};

export const createResponse = async (
  surveyId: string,
  contextId: string,
  responseMetadata?: Record<string, any>
) => {
  const body: Record<string, any> = {
    contextId,
    responseData: {},
    responseMetadata: {
      deviceType: 'desktop',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      ...responseMetadata,
    },
  };
  const response = await post(
    API_ENDPOINTS.RESPONSE_CREATE(surveyId),
    body
  );
  return normalizeEntityResult<SurveyResponse>(
    response.data as ApiResponse<unknown>
  );
};

export const saveDraft = async (
  responseId: string,
  responseData: Record<string, any>
) => {
  const response = await put(API_ENDPOINTS.RESPONSE_UPDATE(responseId), {
    responseData,
  });
  return normalizeEntityResult<SurveyResponse>(
    response.data as ApiResponse<unknown>
  );
};

export const submitResponse = async (
  responseId: string,
  responseData: Record<string, any>
) => {
  const response = await post(API_ENDPOINTS.RESPONSE_SUBMIT(responseId), {
    responseData,
  });
  return normalizeEntityResult<SurveyResponse>(
    response.data as ApiResponse<unknown>
  );
};

interface RawCohort {
  cohortId: string;
  cohortName?: string;
  name?: string;
  /** 'COHORT' = center, 'BLOCK' = block (parent of centers), 'BATCH' = batch */
  type?: string;
  cohortStatus?: string;
  cohortMemberStatus?: string;
  status?: string;
  parentId?: string;
  childData?: RawCohort[];
}

interface RawCohortMember {
  userId: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  cohortMembershipId?: string;
  status?: string;
}

export interface CentersWithBatches {
  centers: TeacherContextRow[];
  batchesByCenterId: Record<string, TeacherContextRow[]>;
}

const isActive = (c: RawCohort) =>
  (c.cohortStatus ?? c.status ?? 'active').toLowerCase() === 'active';

const toRow = (c: RawCohort): TeacherContextRow => ({
  id: c.cohortId,
  label: c.cohortName ?? c.name ?? c.cohortId,
  subtitle: c.type,
});

/**
 * For Instructor role: mycohorts returns batches at top level with no center wrapper.
 * Each batch has a parentId pointing to its center. This function fetches each unique
 * parent center via cohort/search and reconstructs the Center → [Batches] hierarchy.
 */
const fetchCentersForBatches = async (batches: RawCohort[]): Promise<RawCohort[]> => {
  const activeBatches = batches.filter((b) => isActive(b) && b.cohortMemberStatus?.toLowerCase() === 'active');
  const uniqueParentIds = Array.from(new Set(activeBatches.map((b) => b.parentId).filter(Boolean))) as string[];

  if (uniqueParentIds.length === 0) return [];

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';
  const tenantId = typeof window !== 'undefined' ? localStorage.getItem('tenantId') || '' : '';
  const academicYearId = typeof window !== 'undefined' ? localStorage.getItem('academicYearId') || '' : '';

  const fetchCenter = async (parentId: string): Promise<RawCohort[]> => {
    try {
      const res = await fetch(API_ENDPOINTS.COHORT_SEARCH, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          tenantId,
          academicyearid: academicYearId,
        },
        body: JSON.stringify({
          limit: 200,
          offset: 0,
          filters: { status: ['active'], cohortId: parentId },
        }),
      });
      const data = await res.json();
      return (data?.result?.results?.cohortDetails ?? []).filter((c: RawCohort) => isActive(c));
    } catch {
      return [];
    }
  };

  const centerArrays = await Promise.all(uniqueParentIds.map(fetchCenter));
  const centerList = centerArrays.flat();

  // Attach matching batches as childData under each center
  return centerList.map((center) => ({
    ...center,
    childData: activeBatches.filter((b) => b.parentId === center.cohortId),
  }));
};

/**
 * Fetches teacher's cohort hierarchy in a single call.
 *
 * Handles three response shapes from mycohorts:
 *  - BLOCK hierarchy (Lead/TL): top-level item is a block, childData = centers, each center childData = batches
 *  - COHORT hierarchy (Lead/TL): top-level items are centers (type='COHORT'), childData = batches
 *  - BATCH hierarchy (Instructor): top-level items are batches with parentId pointing to center;
 *    requires a separate cohort/search call to reconstruct the Center → [Batches] hierarchy
 */
export const fetchTeacherCentersWithBatches = async (
  userId: string
): Promise<CentersWithBatches> => {
  const response = await get(API_ENDPOINTS.TEACHER_MY_COHORTS(userId));
  const raw: RawCohort[] = (response.data as { result?: RawCohort[] })?.result ?? [];

  if (raw.length === 0) return { centers: [], batchesByCenterId: {} };

  const topType = raw[0].type?.toUpperCase();

  let centerList: RawCohort[];

  if (topType === 'BLOCK') {
    // Lead/TL — BLOCK hierarchy: dig one level to get centers
    centerList = raw.flatMap((block) => (block.childData ?? []).filter(isActive));
  } else if (topType === 'BATCH') {
    // Instructor — batches at top level, fetch parent centers separately
    centerList = await fetchCentersForBatches(raw);
  } else {
    // Lead/TL — COHORT hierarchy: top-level items are already centers
    centerList = raw.filter(isActive);
  }

  const centers = centerList.map(toRow);

  const batchesByCenterId: Record<string, TeacherContextRow[]> = {};
  centerList.forEach((center) => {
    batchesByCenterId[center.cohortId] = (center.childData ?? [])
      .filter(isActive)
      .map(toRow);
  });

  return { centers, batchesByCenterId };
};

// Keep for backwards compatibility
export const fetchTeacherCenters = async (
  userId: string
): Promise<TeacherContextRow[]> => {
  const { centers } = await fetchTeacherCentersWithBatches(userId);
  return centers;
};

export const fetchBatchesByCenter = async (
  _centerId: string
): Promise<TeacherContextRow[]> => {
  // Batches come from childData in the mycohorts response — use fetchTeacherCentersWithBatches instead.
  return [];
};

export interface CohortLearnersResult {
  learners: TeacherContextRow[];
  totalCount: number;
}

export const fetchTeacherCohortLearners = async (
  cohortId: string,
  opts: { limit?: number; offset?: number; name?: string } = {}
): Promise<CohortLearnersResult> => {
  const { limit = 10, offset = 0, name } = opts;
  const filters: Record<string, unknown> = { cohortId, role: 'Learner', status: ['active'] };
  if (name && name.trim()) filters['name'] = name.trim();
  const response = await post(API_ENDPOINTS.TEACHER_COHORT_MEMBER_LIST, {
    limit,
    offset,
    filters,
  });
  const result = (response.data as { result?: { userDetails?: RawCohortMember[]; totalCount?: number } })?.result;
  const raw = result?.userDetails ?? [];
  const totalCount = result?.totalCount ?? raw.length;
  const learners = raw.map((u) => ({
    id: u.userId,
    label:
      [u.firstName, u.lastName].filter(Boolean).join(' ').trim() ||
      u.username ||
      u.userId,
    subtitle: u.username,
  }));
  return { learners, totalCount };
};

export const fetchInProgressResponse = async (
  surveyId: string,
  contextId: string,
  respondentId?: string | null
): Promise<SurveyResponse | null> => {
  const resolvedContextId = contextId === 'self' ? '' : contextId;
  const body: Record<string, unknown> = {
    page: 1,
    limit: 20,
    sortBy: 'updatedAt',
    sortOrder: 'DESC',
  };
  if (resolvedContextId) body.contextIds = [resolvedContextId];
  const response = await post(API_ENDPOINTS.RESPONSE_LIST(surveyId), body);

  const rows =
    (response.data as { result?: { data?: SurveyResponse[] } })?.result?.data ?? [];

  const candidates = rows.filter(
    (r) =>
      r.status === 'in_progress' &&
      (resolvedContextId === ''
        ? !r.contextId || r.contextId === ''
        : r.contextId === resolvedContextId) &&
      (!respondentId || r.respondentId === respondentId)
  );

  if (candidates.length === 0) return null;
  candidates.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return candidates[0];
};

export const fetchSubmittedResponse = async (
  surveyId: string,
  contextId: string,
  respondentId?: string | null
): Promise<SurveyResponse | null> => {
  const resolvedContextId = contextId === 'self' ? '' : contextId;
  const body: Record<string, unknown> = {
    page: 1,
    limit: 20,
    sortBy: 'updatedAt',
    sortOrder: 'DESC',
  };
  if (resolvedContextId) body.contextIds = [resolvedContextId];
  const response = await post(API_ENDPOINTS.RESPONSE_LIST(surveyId), body);

  const rows =
    (response.data as { result?: { data?: SurveyResponse[] } })?.result?.data ??
    [];

  const candidates = rows.filter(
    (r) =>
      r.status === 'submitted' &&
      (resolvedContextId === ''
        ? !r.contextId || r.contextId === ''
        : r.contextId === resolvedContextId) &&
      (!respondentId || r.respondentId === respondentId)
  );

  if (candidates.length === 0) return null;
  candidates.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return candidates[0];
};

export interface ContextResponseInfo {
  status: 'none' | 'draft' | 'submitted';
  submittedAt: string | null;
}

export const fetchResponseStatusByContext = async (
  surveyId: string,
  contextIds: string[],
  respondentId?: string | null
): Promise<Record<string, ContextResponseInfo>> => {
  if (contextIds.length === 0) return {};

  const response = await post(API_ENDPOINTS.RESPONSE_LIST(surveyId), {
    page: 1,
    limit: contextIds.length,
    sortBy: 'updatedAt',
    sortOrder: 'DESC',
    contextIds,
  });

  const rows =
    (response.data as { result?: { data?: SurveyResponse[] } })?.result?.data ??
    [];

  const scoped = respondentId
    ? rows.filter((r) => r.respondentId === respondentId)
    : rows;

  const byContext = new Map<string, SurveyResponse>();
  scoped.forEach((r) => {
    if (!r.contextId || !contextIds.includes(r.contextId)) return;
    const prev = byContext.get(r.contextId);
    if (!prev) {
      byContext.set(r.contextId, r);
      return;
    }
    // Keep newest response if multiple exist.
    if (new Date(r.updatedAt).getTime() > new Date(prev.updatedAt).getTime()) {
      byContext.set(r.contextId, r);
    }
  });

  const out: Record<string, ContextResponseInfo> = {};
  contextIds.forEach((id) => {
    const r = byContext.get(id);
    if (!r) {
      out[id] = { status: 'none', submittedAt: null };
    } else if (r.status === 'submitted') {
      out[id] = { status: 'submitted', submittedAt: r.submittedAt ?? null };
    } else {
      out[id] = { status: 'draft', submittedAt: null };
    }
  });
  return out;
};
