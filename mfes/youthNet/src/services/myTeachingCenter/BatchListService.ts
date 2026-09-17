import { getCohortList as searchCohorts } from '../youthNet/Dashboard/VillageServices';
import { BATCH_DATE_FIELD_IDS, BATCH_SKILLS_LABEL } from './myTeachingCenter.config';
import { MyTeachingCenterBatch } from '../../utils/Interfaces';

// COHORT-type nodes (cohort/mycohorts, cohort/search) carry their dynamic
// fields as `customFields` (plural) with a {label, selectedValues} shape —
// distinct from cohortmember/list's per-USER `customField` (singular,
// {label, value}) shape used in LearnerListService.ts. Don't conflate them.
const findField = (row: any, label: string) =>
  row?.customFields?.find((field: any) => field.label === label);

const getDateField = (row: any, fieldId: string): string | undefined =>
  row?.customFields?.find((field: any) => field.fieldId === fieldId)?.selectedValues?.[0];

// Confirmed real /cohort/search payload shape for this flow: filter by
// customFieldsName (plain domain/skills display strings), no parentId
// (Center) scoping at all — there's no Center lookup anywhere in this
// flow any more, so a Trainer sees every active batch matching their
// Domain/Skills regardless of Center.
const searchBatchesForPair = async (domain: string, skill: string): Promise<any[]> => {
  const raw = await searchCohorts({
    limit: 200,
    offset: 0,
    filters: {
      type: 'BATCH',
      status: ['active'],
      customFieldsName: { domain, skills: skill },
    },
  });
  if (!raw || raw?.isAxiosError || raw instanceof Error) return [];
  return raw?.results?.cohortDetails || [];
};

const mapToMyTeachingCenterBatch = (batch: any): MyTeachingCenterBatch => ({
  cohortId: batch.cohortId,
  name: batch.name,
  centerId: batch.parentId,
  domain: findField(batch, 'DOMAIN')?.selectedValues?.[0] ?? '',
  // A Batch's own course customField is labeled 'SKILLS' and its
  // selectedValues are already a plain, human-readable display string
  // (e.g. "Sewing Machine Operator (SMO)") — confirmed against a real
  // /cohort/search response.
  skill: findField(batch, BATCH_SKILLS_LABEL)?.selectedValues?.[0] ?? '',
  startDate: getDateField(batch, BATCH_DATE_FIELD_IDS.START_DATE),
  endDate: getDateField(batch, BATCH_DATE_FIELD_IDS.END_DATE),
  status: batch?.status,
});

// One search call per (domain, skill) pair the Trainer is assigned (the
// API takes one domain + one skill per call), deduped by cohortId. No
// cohortmember/list call for a per-batch learner count here any more —
// the Batch List's own card design doesn't display one (see BatchList.tsx).
export const getMyTeachingCenterBatches = async (
  domains: string[],
  skills: string[]
): Promise<MyTeachingCenterBatch[]> => {
  if (domains.length === 0 || skills.length === 0) return [];

  const pairs: Array<[string, string]> = [];
  domains.forEach((domain) => skills.forEach((skill) => pairs.push([domain, skill])));

  const results = await Promise.all(pairs.map(([domain, skill]) => searchBatchesForPair(domain, skill)));
  const flattened = results.flat();
  const deduped = Array.from(new Map(flattened.map((batch: any) => [batch.cohortId, batch])).values());

  return deduped.map(mapToMyTeachingCenterBatch);
};

// Fetches and maps a single batch by cohortId — used by the Batch Details
// page header.
export const getBatchById = async (cohortId: string): Promise<MyTeachingCenterBatch | null> => {
  const raw = await searchCohorts({
    limit: 1,
    offset: 0,
    filters: { cohortId: [cohortId] },
  });
  if (!raw || raw?.isAxiosError || raw instanceof Error) return null;
  const batch = raw?.results?.cohortDetails?.[0];
  if (!batch) return null;

  return mapToMyTeachingCenterBatch(batch);
};

// Fetches the Center's own Cohort Details (by its cohortId, i.e. an
// existing batch's parentId) and extracts TYPE_OF_CENTER — used to control
// which Type of Batch options the Create Batch form offers (see
// CreateBatchModal.tsx). Filter shape confirmed against a real
// /cohort/search request: a plain cohortId string, not wrapped in an array
// (unlike getBatchById's own call, which does use an array — the two
// requests were given as different shapes and each is kept as given).
export const getCohortTypeOfCenter = async (cohortId: string): Promise<string | null> => {
  const raw = await searchCohorts({
    limit: 100,
    offset: 0,
    filters: { cohortId },
  });
  if (!raw || raw?.isAxiosError || raw instanceof Error) return null;
  const cohort = raw?.results?.cohortDetails?.[0];
  const selected = findField(cohort, 'TYPE_OF_CENTER')?.selectedValues?.[0];
  // selectedValues[0] is an object ({id,value,label,order}) for this field,
  // confirmed against a real response — but fall back to a plain string
  // just in case, matching the defensive shape-handling already used
  // elsewhere in this file for fields that vary between the two shapes.
  return (typeof selected === 'string' ? selected : selected?.value) ?? null;
};
