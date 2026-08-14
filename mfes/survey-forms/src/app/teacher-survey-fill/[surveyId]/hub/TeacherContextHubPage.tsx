'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import BackHeader from '../../../../Components/BackHeader/BackHeader';
import TeacherFilterBar from '../../../../Components/teacher/TeacherFilterBar';
import type { StatusFilterValue } from '../../../../Components/teacher/TeacherFilterBar';
import TeacherContextTable from '../../../../Components/teacher/TeacherContextTable';
import TeacherEmptyState from '../../../../Components/teacher/TeacherEmptyState';
import SurveyStatusSummary from '../../../../Components/teacher/SurveyStatusSummary';
import {
  fetchSurveyById,
  fetchTeacherCentersWithBatches,
  fetchAllTeacherCohortLearners,
  fetchResponseListByCohort,
  fetchAllSubmittedEntriesForContexts,
} from '../../../../utils/API/surveyService';
import type { ContextResponseInfo } from '../../../../utils/API/surveyService';
import type { Survey } from '../../../../types/survey';
import { isExpired, monthNameFromDate } from '../../../../utils/Helper/helper';
import type { TeacherContextRow } from '../../../../types/teacherSurvey';

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];
const DEFAULT_PAGE_SIZE = 10;

interface LearnerWithStatus extends TeacherContextRow {
  status: 'submitted' | 'draft' | 'none';
  entriesCount: number;
  latestSubmittedAt: string | null;
  // Tracked independently of `status` — a learner can be "Completed" (submittedCount > 0)
  // and still have a separate draft entry in progress at the same time.
  hasInProgress: boolean;
}

function PageSkeleton() {
  return (
    <Box sx={{ p: 2 }}>
      {/* Filter bar skeleton — matches Search + Center + Batch */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <Skeleton variant="rounded" width={220} height={40} />
        <Skeleton variant="rounded" width={200} height={40} />
        <Skeleton variant="rounded" width={200} height={40} />
      </Box>

      {/* Table skeleton — wrapped in same maxWidth as loaded table */}
      <Box sx={{ maxWidth: '100%' }}>
        <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0' }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Learner Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Survey Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Latest Submitted Date</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton variant="text" width="60%" /></TableCell>
                  <TableCell><Skeleton variant="rounded" width={80} height={22} /></TableCell>
                  <TableCell><Skeleton variant="text" width={80} /></TableCell>
                  <TableCell align="right"><Skeleton variant="rounded" width={60} height={28} /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

const TeacherContextHubPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = params.surveyId as string;

  // If URL already has centerId+batchId (e.g. reload), skip the full-page skeleton —
  // the filter bar renders immediately from URL state and learners handle their own loading.
  const hasUrlFilters = !!(searchParams.get('centerId') && searchParams.get('batchId'));

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [pageLoading, setPageLoading] = useState(!hasUrlFilters);
  const [pageError, setPageError] = useState<string | null>(null);

  const [centers, setCenters] = useState<TeacherContextRow[]>([]);
  const [batchesByCenterId, setBatchesByCenterId] = useState<Record<string, TeacherContextRow[]>>({});
  const [centersLoaded, setCentersLoaded] = useState(false);
  const [centerId, setCenterId] = useState<string>(searchParams.get('centerId') ?? '');
  const [batchId, setBatchId] = useState<string>(searchParams.get('batchId') ?? '');

  // Full batch roster merged with each learner's response status — single source of
  // truth for both the summary counts and the (client-side filtered/paginated) table.
  const [allLearners, setAllLearners] = useState<LearnerWithStatus[]>([]);
  const [allLearnersLoading, setAllLearnersLoading] = useState(false);
  const [allLearnersError, setAllLearnersError] = useState<string | null>(null);

  const [page, setPage] = useState(() => {
    const p = parseInt(searchParams.get('page') ?? '', 10);
    return Number.isInteger(p) && p >= 0 ? p : 0;
  });
  const [pageSize, setPageSize] = useState(() => {
    const s = parseInt(searchParams.get('pageSize') ?? '', 10);
    return ROWS_PER_PAGE_OPTIONS.includes(s) ? s : DEFAULT_PAGE_SIZE;
  });
  const initialSearch = searchParams.get('search') ?? '';
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>(
    (searchParams.get('status') as StatusFilterValue | null) ?? 'all'
  );
  const [monthFilter, setMonthFilter] = useState(searchParams.get('month') ?? 'All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    searchParams.get('sort') === 'asc' ? 'asc' : 'desc'
  );

  // Per-learner: their most recent entry date WITHIN monthFilter — null when
  // monthFilter is 'All' (no restriction) or the lookup hasn't resolved yet. The
  // per-learner aggregate only carries the true latest submission date, which isn't
  // enough to answer "does this learner have an entry in July" (or "what date was
  // it") for a learner whose true latest entry is in a different month, e.g. August.
  const [monthMatchDates, setMonthMatchDates] = useState<Map<string, string> | null>(null);
  const [monthMatchLoading, setMonthMatchLoading] = useState(false);

  const batches = batchesByCenterId[centerId] ?? [];

  // Fetch survey + centers in parallel on mount — eliminates the sequential load delay
  useEffect(() => {
    let userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId && typeof window !== 'undefined') {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.sub ?? payload.userId ?? null;
        }
      } catch { /* malformed token */ }
    }

    let cancelled = false;
    if (!hasUrlFilters) setPageLoading(true);
    setPageError(null);

    const surveyFetch = fetchSurveyById(surveyId);
    const centersFetch = userId
      ? fetchTeacherCentersWithBatches(userId)
      : Promise.resolve(null);

    Promise.all([surveyFetch, centersFetch])
      .then(([surveyResult, centersResult]) => {
        if (cancelled) return;

        if (surveyResult.params.status !== 'successful' || !surveyResult.result.data) {
          setPageError(surveyResult.params.errmsg || 'Failed to load survey');
          return;
        }
        setSurvey(surveyResult.result.data);

        if (centersResult) {
          const { centers: c, batchesByCenterId: b } = centersResult;
          setCenters(c);
          setBatchesByCenterId(b);
          setCentersLoaded(true);
          if (!searchParams.get('centerId') && c.length > 0) {
            const firstCenterId = c[0].id;
            setCenterId(firstCenterId);
            const firstBatches = b[firstCenterId] ?? [];
            if (!searchParams.get('batchId') && firstBatches.length > 0) {
              setBatchId(firstBatches[0].id);
            }
          }
        }
      })
      .catch(() => {
        if (!cancelled) setPageError('Failed to load page data.');
      })
      .finally(() => {
        if (!cancelled) setPageLoading(false);
      });

    return () => { cancelled = true; };
  }, [surveyId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync every filter into the URL (not just centerId/batchId) so navigating away
  // (e.g. to View Entries) and back restores the exact same view instead of
  // resetting to defaults — the hub component fully unmounts on that navigation,
  // so anything not in the URL would otherwise be lost.
  useEffect(() => {
    const p = new URLSearchParams();
    if (centerId) p.set('centerId', centerId);
    if (batchId) p.set('batchId', batchId);
    if (debouncedSearch) p.set('search', debouncedSearch);
    if (statusFilter !== 'all') p.set('status', statusFilter);
    if (monthFilter !== 'All') p.set('month', monthFilter);
    if (sortOrder !== 'desc') p.set('sort', sortOrder);
    if (page > 0) p.set('page', String(page));
    if (pageSize !== DEFAULT_PAGE_SIZE) p.set('pageSize', String(pageSize));
    router.replace(`?${p.toString()}`, { scroll: false } as Parameters<typeof router.replace>[1]);
  }, [centerId, batchId, debouncedSearch, statusFilter, monthFilter, sortOrder, page, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search input — 400ms delay before firing API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when batch, search, or status filter changes — but not on the
  // very first run, since that would clobber a page number just restored from the URL.
  const isInitialPageResetRender = useRef(true);
  useEffect(() => {
    if (isInitialPageResetRender.current) {
      isInitialPageResetRender.current = false;
      return;
    }
    setPage(0);
  }, [batchId, debouncedSearch, statusFilter, monthFilter, sortOrder]);

  const loadBatchData = React.useCallback(() => {
    if (!survey || !batchId) {
      setAllLearners([]);
      return;
    }
    let cancelled = false;
    setAllLearnersLoading(true);
    setAllLearnersError(null);
    Promise.all([
      fetchAllTeacherCohortLearners(batchId),
      fetchResponseListByCohort(survey.surveyId, batchId),
    ])
      .then(([roster, responses]) => {
        if (cancelled) return;
        const byContextId = new Map(responses.map((r) => [r.contextId, r]));
        const merged: LearnerWithStatus[] = roster.learners.map((l) => {
          const r = byContextId.get(l.id);
          if (!r) return { ...l, status: 'none' as const, entriesCount: 0, latestSubmittedAt: null, hasInProgress: false };
          const status = r.submittedCount > 0 ? ('submitted' as const) : r.hasInProgress ? ('draft' as const) : ('none' as const);
          return { ...l, status, entriesCount: r.submittedCount, latestSubmittedAt: r.latestSubmittedAt, hasInProgress: r.hasInProgress };
        });
        setAllLearners(merged);
      })
      .catch(() => {
        if (!cancelled) { setAllLearnersError('Failed to load learners.'); setAllLearners([]); }
      })
      .finally(() => {
        if (!cancelled) setAllLearnersLoading(false);
      });
    return () => { cancelled = true; };
  }, [survey, batchId]);

  useEffect(() => loadBatchData(), [loadBatchData]);

  // Resolve each learner's most recent entry date WITHIN monthFilter by checking
  // every submitted entry, not just the latest one — only runs when a specific
  // month is selected.
  useEffect(() => {
    if (monthFilter === 'All' || !survey || allLearners.length === 0) {
      setMonthMatchDates(null);
      return;
    }
    let cancelled = false;
    setMonthMatchLoading(true);
    fetchAllSubmittedEntriesForContexts(survey.surveyId, allLearners.map((l) => l.id))
      .then((entries) => {
        if (cancelled) return;
        const dates = new Map<string, string>();
        entries.forEach((e) => {
          if (!e.contextId || !e.submittedAt) return;
          if (monthNameFromDate(e.submittedAt) !== monthFilter) return;
          const existing = dates.get(e.contextId);
          if (!existing || new Date(e.submittedAt) > new Date(existing)) {
            dates.set(e.contextId, e.submittedAt);
          }
        });
        setMonthMatchDates(dates);
      })
      .catch(() => {
        if (!cancelled) setMonthMatchDates(new Map());
      })
      .finally(() => {
        if (!cancelled) setMonthMatchLoading(false);
      });
    return () => { cancelled = true; };
  }, [monthFilter, survey, allLearners]);

  const statusCounts = useMemo(() => {
    if (!batchId) return null;
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    allLearners.forEach((l) => {
      if (l.status === 'submitted') completed++;
      else if (l.status === 'draft') inProgress++;
      else notStarted++;
    });
    return { completed, inProgress, notStarted };
  }, [allLearners, batchId]);

  const filteredLearners = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return allLearners.filter((l) => {
      if (q && !l.label.toLowerCase().includes(q)) return false;
      if (statusFilter === 'completed' && l.status !== 'submitted') return false;
      if (statusFilter === 'inProgress' && l.status !== 'draft') return false;
      if (statusFilter === 'notStarted' && l.status !== 'none') return false;
      if (monthFilter !== 'All' && !monthMatchDates?.has(l.id)) return false;
      return true;
    });
  }, [allLearners, debouncedSearch, statusFilter, monthFilter, monthMatchDates]);

  // The date shown/sorted-by for each learner: their true latest entry normally,
  // or — while a month filter is active — their most recent entry WITHIN that
  // month, so the column stays consistent with what the filter is actually about.
  const displayDatesById = useMemo(() => {
    const map: Record<string, string | null> = {};
    allLearners.forEach((l) => {
      map[l.id] = monthFilter !== 'All' ? (monthMatchDates?.get(l.id) ?? null) : l.latestSubmittedAt;
    });
    return map;
  }, [allLearners, monthFilter, monthMatchDates]);

  const sortedLearners = useMemo(() => {
    return [...filteredLearners].sort((a, b) => {
      const aDate = displayDatesById[a.id];
      const bDate = displayDatesById[b.id];
      const av = aDate ? new Date(aDate).getTime() : -Infinity;
      const bv = bDate ? new Date(bDate).getTime() : -Infinity;
      if (av === bv) return 0;
      if (av === -Infinity) return 1;
      if (bv === -Infinity) return -1;
      return sortOrder === 'asc' ? av - bv : bv - av;
    });
  }, [filteredLearners, sortOrder, displayDatesById]);

  const pagedLearners = useMemo(
    () => sortedLearners.slice(page * pageSize, page * pageSize + pageSize),
    [sortedLearners, page, pageSize]
  );

  const responseInfoById = useMemo(() => {
    const map: Record<string, ContextResponseInfo> = {};
    allLearners.forEach((l) => {
      map[l.id] = { status: l.status, submittedAt: displayDatesById[l.id] ?? null };
    });
    return map;
  }, [allLearners, displayDatesById]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
  };

  // Derive a dynamic subtitle based on current selection state
  const pageSubtitle = useMemo(() => {
    if (!centersLoaded) return '';
    if (!centerId) return 'Select a center to get started';
    const centerLabel = centers.find((c) => c.id === centerId)?.label ?? '';
    if (!batchId) return `${centerLabel} — select a batch`;
    const batchLabel = (batchesByCenterId[centerId] ?? []).find((b) => b.id === batchId)?.label ?? '';
    return `${centerLabel} – ${batchLabel}`;
  }, [centersLoaded, centerId, batchId, centers, batchesByCenterId]);

  if (pageLoading) {
    return (
      <Box>
        <BackHeader title={survey?.surveyTitle || 'Survey'} subtitle={centerId ? undefined : 'Select center and batch to view learners'} />
        <PageSkeleton />
      </Box>
    );
  }

  if (pageError) {
    return (
      <Box>
        <BackHeader title="Survey" />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{pageError}</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => router.back()}>
            Go back
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <BackHeader
        title={survey?.surveyTitle || 'Survey'}
        subtitle={pageSubtitle}
      />

      <Box sx={{ p: 2 }}>
        {/* Center/Batch narrow the population the tiles summarize, so they sit above the tiles. */}
        <TeacherFilterBar
          search=""
          onSearchChange={() => undefined}
          centersLoading={!centersLoaded}
          centers={centers}
          centerId={centerId}
          onCenterChange={(id) => {
            setCenterId(id);
            setSearch('');
            setStatusFilter('all');
            setMonthFilter('All');
            setAllLearners([]);
            setAllLearnersLoading(true);
            const firstBatch = (batchesByCenterId[id] ?? [])[0];
            setBatchId(firstBatch?.id ?? '');
          }}
          batches={batches}
          batchId={batchId}
          onBatchChange={(id) => {
            setBatchId(id);
            setSearch('');
            setStatusFilter('all');
            setMonthFilter('All');
            setAllLearners([]);
            setAllLearnersLoading(true);
          }}
        />

        {!!batchId && (
          <SurveyStatusSummary counts={statusCounts} loading={allLearnersLoading} />
        )}

        {/* Status/Month/Search/Sort only filter the table below, not the tiles above. */}
        <TeacherFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          showSearch={!!batchId && centersLoaded}
          showStatusFilter={!!batchId && centersLoaded}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showMonthFilter={!!batchId && centersLoaded}
          monthFilter={monthFilter}
          onMonthFilterChange={setMonthFilter}
        />

        <Box sx={{ maxWidth: '100%' }}>
          {!centerId ? (
            <TeacherEmptyState message="No centers found for your account." />
          ) : !batchId ? (
            <TeacherEmptyState message="No batches found for this center." />
          ) : allLearnersLoading || monthMatchLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress sx={{ color: '#FDBE16' }} />
            </Box>
          ) : allLearnersError ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="error">{allLearnersError}</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2, borderColor: '#FDBE16', color: '#1E1B16' }}
                onClick={loadBatchData}
              >
                Retry
              </Button>
            </Box>
          ) : sortedLearners.length === 0 ? (
            <TeacherEmptyState
              message={
                search.trim() || statusFilter !== 'all'
                  ? 'No learners match your filters.'
                  : 'No learners found in the selected batch.'
              }
            />
          ) : (
            <>
              <TeacherContextTable
                rows={pagedLearners}
                responseInfoById={responseInfoById}
                expired={isExpired(survey?.endDate)}
                surveyType={survey?.surveyType}
                onRowAction={(row) =>
                  responseInfoById[row.id]?.status === 'submitted'
                    ? router.push(`/survey-fill/${surveyId}/${row.id}/view`)
                    : router.push(`/survey-fill/${surveyId}/${row.id}?cohortId=${batchId}`)
                }
                onNewEntry={(row) => router.push(`/survey-fill/${surveyId}/${row.id}?cohortId=${batchId}`)}
                onViewEntries={(row) => router.push(`/teacher-survey-fill/${surveyId}/hub/${row.id}/entries`)}
                sortOrder={sortOrder}
                onSortToggle={() => setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'))}
              />
              <TablePagination
                component="div"
                rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
                count={sortedLearners.length}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={(_event, newPage) => setPage(newPage)}
                onRowsPerPageChange={(event) => {
                  setPageSize(parseInt(event.target.value, 10));
                  setPage(0);
                }}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherContextHubPage;
