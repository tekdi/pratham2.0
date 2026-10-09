import { getCohortDetails, getCohortList } from '@/services/CohortServices';
import { getEventList } from '@/services/EventService';
import { sessionType } from './app.constant';
import { getAfterDate, getBeforeDate, shortDateFormat, toPascalCase } from './helper';

const toUpperString = (value: unknown) =>
  typeof value === 'string' ? value.toUpperCase() : '';

const asString = (value: unknown): string | null => {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'value' in (value as any)) {
    const v = (value as any).value;
    return typeof v === 'string' ? v : null;
  }
  return null;
};

/**
 * Reads a custom field's first value by label, case-insensitively, and
 * falling back to a plain `value` string when `selectedValues` is absent —
 * some cohort APIs use one shape, some the other (see `centers/index.tsx`'s
 * own `getCustomFieldValues`, which this mirrors). `getBMG` in `helper.ts`
 * only handles the `selectedValues` shape with an exact-case label match,
 * which silently returns `undefined` for cohorts using the other shape —
 * this is used instead wherever Board/Medium/Grade must be compared reliably
 * across arbitrary batches.
 */
export const getCustomFieldSingleValue = (
  customField: any[] | undefined,
  label: string
): string | null => {
  const target = label.toUpperCase();
  const entry = (customField || []).find(
    (item) => toUpperString(item?.label) === target
  );
  const selectedValues = Array.isArray(entry?.selectedValues)
    ? entry.selectedValues
    : [];
  if (selectedValues.length > 0) {
    return asString(selectedValues[0]) ?? null;
  }
  return entry?.value ? asString(entry.value) : null;
};

export interface BatchBMG {
  board: string | null;
  medium: string | null;
  grade: string | null;
}

export const getBatchBMG = (customField: any[] | undefined): BatchBMG => ({
  board: getCustomFieldSingleValue(customField, 'BOARD'),
  medium: getCustomFieldSingleValue(customField, 'MEDIUM'),
  grade: getCustomFieldSingleValue(customField, 'GRADE'),
});

export interface BatchInfo {
  batchId: string;
  batchName: string;
  centerId: string;
  centerName: string;
  bmg: BatchBMG;
}

// The facilitator's own cohort tree comes back center -> batch (or, for team
// leaders, block -> center -> batch). A leaf node (no childData) is always a
// batch; its immediate parent is the center it belongs to. Every batch node
// in this tree already carries its own `customField` (Board/Medium/Grade),
// so it's read here once — no per-batch API call is needed later to compare
// batches against each other.
export const flattenBatches = (
  nodes: any[],
  parent?: { id: string; name: string }
): BatchInfo[] => {
  let result: BatchInfo[] = [];
  for (const node of nodes || []) {
    const children = Array.isArray(node?.childData) ? node.childData : [];
    if (children.length > 0) {
      result = result.concat(
        flattenBatches(children, {
          id: node?.cohortId,
          name: node?.cohortName || node?.name,
        })
      );
    } else if (parent?.id && node?.cohortId) {
      result.push({
        batchId: node.cohortId,
        batchName: toPascalCase(node?.cohortName || node?.name || ''),
        centerId: parent.id,
        centerName: toPascalCase(parent.name || ''),
        bmg: getBatchBMG(node?.customField),
      });
    }
  }
  return result;
};

export interface CrossCenterBatchDetail {
  batchId: string;
  batchName: string;
  centerName: string;
}

export interface CrossCenterSessionItem {
  event: any;
  batchCount: number;
  centerCount: number;
  primaryBatch?: BatchInfo;
  batchDetails: CrossCenterBatchDetail[];
}

/**
 * Fetches every cross-center (multi-batch) session this facilitator can see -
 * every batch they teach, resolved batch/center names for batches outside
 * their own tree - and splits the result into Planned vs Extra. Shared by the
 * Cross-Center Sessions list page and its month-calendar view so the two
 * don't duplicate (and risk diverging on) this resolution logic.
 */
export const loadCrossCenterSessions = async (
  userId: string
): Promise<{
  extraSessions: CrossCenterSessionItem[];
  plannedSessions: CrossCenterSessionItem[];
}> => {
  const empty = { extraSessions: [], plannedSessions: [] };
  if (!userId) return empty;

  const centerTree = await getCohortList(userId, { customField: 'true' });
  const myBatches = flattenBatches(centerTree || []);
  const centerIdByBatchId = new Map(myBatches.map((b) => [b.batchId, b.centerId]));
  const batchNameById = new Map(myBatches.map((b) => [b.batchId, b.batchName]));
  const centerNameByCenterId = new Map(
    myBatches.map((b) => [b.centerId, b.centerName])
  );
  const cohortIds = myBatches.map((b) => b.batchId).filter(Boolean);

  if (cohortIds.length === 0) return empty;

  // The backend requires startDate and endDate together — there is no
  // open-ended range, so this uses a generous 1-year window to effectively
  // mean "all upcoming sessions".
  const farFuture = new Date();
  farFuture.setDate(farFuture.getDate() + 365);
  const filters = {
    startDate: { after: getAfterDate(shortDateFormat(new Date())) },
    endDate: { before: getBeforeDate(shortDateFormat(farFuture)) },
    cohortIds,
    status: ['live'],
  };
  const response = await getEventList({ limit: 0, offset: 0, filters });
  const events: any[] = response?.events || [];
  const crossCenterEvents = events.filter(
    (event) => event?.metadata?.multiSession === true
  );

  // Resolve the center for every batch on every cross-center session so
  // "X batches · Y centers" is accurate even for batches taught by other
  // facilitators (not just the ones this facilitator's own tree covers).
  const unresolvedBatchIds = new Set<string>();
  crossCenterEvents.forEach((event) => {
    const batchIds: string[] =
      event?.metadata?.cohortIds ||
      (event?.metadata?.cohortId ? [event.metadata.cohortId] : []);
    batchIds.forEach((id) => {
      if (id && !centerIdByBatchId.has(id)) unresolvedBatchIds.add(id);
    });
  });

  await Promise.all(
    Array.from(unresolvedBatchIds).map(async (batchId) => {
      try {
        const details = await getCohortDetails(batchId);
        const batchRecord = details?.cohortData?.[0];
        const centerId = batchRecord?.parentId;
        if (batchRecord?.name) batchNameById.set(batchId, batchRecord.name);
        if (centerId) centerIdByBatchId.set(batchId, centerId);
      } catch (error) {
        console.error('Error resolving batch center', batchId, error);
      }
    })
  );

  // Same reasoning, one hop further - the "View details" breakdown needs each
  // batch's center *name*, not just its id, for centers outside this
  // facilitator's own tree.
  const unresolvedCenterIds = new Set<string>();
  centerIdByBatchId.forEach((centerId) => {
    if (centerId && !centerNameByCenterId.has(centerId)) {
      unresolvedCenterIds.add(centerId);
    }
  });
  await Promise.all(
    Array.from(unresolvedCenterIds).map(async (centerId) => {
      try {
        const details = await getCohortDetails(centerId);
        const centerName = details?.cohortData?.[0]?.name;
        if (centerName) centerNameByCenterId.set(centerId, centerName);
      } catch (error) {
        console.error('Error resolving center name', centerId, error);
      }
    })
  );

  const myBatchesById = new Map(myBatches.map((b) => [b.batchId, b]));

  const withCoverage: CrossCenterSessionItem[] = crossCenterEvents.map(
    (event) => {
      const batchIds: string[] =
        event?.metadata?.cohortIds ||
        (event?.metadata?.cohortId ? [event.metadata.cohortId] : []);
      const centerIds = new Set(
        batchIds
          .map((id) => centerIdByBatchId.get(id))
          .filter((id): id is string => Boolean(id))
      );
      // The wizard only allows batches with matching Board/Medium/Grade into
      // one cross-center session, so any member batch this facilitator
      // teaches (there is always at least one - it's how this event matched
      // the `cohortIds` filter above) is a valid stand-in for the course
      // planner's board/medium/grade/entityId lookup.
      const primaryBatch = batchIds
        .map((id) => myBatchesById.get(id))
        .find((b): b is BatchInfo => Boolean(b));
      // Read-only breakdown for the "View details" modal - every batch on the
      // session, by name, with the center it belongs to.
      const batchDetails = batchIds.map((id) => {
        const known = myBatchesById.get(id);
        const centerId = centerIdByBatchId.get(id);
        return {
          batchId: id,
          batchName: known?.batchName || batchNameById.get(id) || id,
          centerName:
            known?.centerName ||
            (centerId ? centerNameByCenterId.get(centerId) : undefined) ||
            '',
        };
      });
      return {
        event,
        batchCount: batchIds.length,
        centerCount: centerIds.size,
        primaryBatch,
        batchDetails,
      };
    }
  );

  const byStartTime = (a: CrossCenterSessionItem, b: CrossCenterSessionItem) =>
    new Date(a.event?.startDateTime).getTime() -
    new Date(b.event?.startDateTime).getTime();

  return {
    extraSessions: withCoverage
      .filter((item) => item.event?.metadata?.type === sessionType.EXTRA)
      .sort(byStartTime),
    plannedSessions: withCoverage
      .filter((item) => item.event?.metadata?.type === sessionType.PLANNED)
      .sort(byStartTime),
  };
};
