'use client';

import React, { useEffect, useMemo, useState } from 'react';
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
import PaginationBar from '../../../../Components/PaginationBar/PaginationBar';
import {
  fetchSurveyById,
  fetchTeacherCentersWithBatches,
  fetchTeacherCohortLearners,
  fetchResponseListByCohort,
} from '../../../../utils/API/surveyService';
import type { ContextResponseInfo } from '../../../../utils/API/surveyService';
import type { Survey } from '../../../../types/survey';
import { isExpired } from '../../../../utils/Helper/helper';
import type { TeacherContextRow } from '../../../../types/teacherSurvey';

// A batch tops out around 300 learners — cheap to fetch in one call and filter/paginate client-side.
const MAX_BATCH_ROSTER = 300;
const PAGE_SIZE = 10;

interface LearnerWithStatus extends TeacherContextRow {
  status: ContextResponseInfo['status'];
  submittedAt: string | null;
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
                <TableCell sx={{ fontWeight: 600 }}>Submission Date</TableCell>
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

  const [learnersPage, setLearnersPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');

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

  // Sync centerId/batchId into URL so back-navigation restores them
  useEffect(() => {
    const p = new URLSearchParams();
    if (centerId) p.set('centerId', centerId);
    if (batchId) p.set('batchId', batchId);
    router.replace(`?${p.toString()}`, { scroll: false } as Parameters<typeof router.replace>[1]);
  }, [centerId, batchId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounce search input — 400ms delay before firing API
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when batch, search, or status filter changes
  useEffect(() => {
    setLearnersPage(1);
  }, [batchId, debouncedSearch, statusFilter]);

  const loadBatchData = React.useCallback(() => {
    if (!survey || !batchId) {
      setAllLearners([]);
      return;
    }
    let cancelled = false;
    setAllLearnersLoading(true);
    setAllLearnersError(null);
    Promise.all([
      fetchTeacherCohortLearners(batchId, { limit: MAX_BATCH_ROSTER, offset: 0 }),
      fetchResponseListByCohort(survey.surveyId, batchId),
    ])
      .then(([roster, responses]) => {
        if (cancelled) return;
        const byContextId = new Map(responses.map((r) => [r.contextId, r]));
        const merged: LearnerWithStatus[] = roster.learners.map((l) => {
          const r = byContextId.get(l.id);
          if (!r) return { ...l, status: 'none', submittedAt: null };
          const status = r.status === 'submitted' || r.status === 'reviewed' ? 'submitted' : 'draft';
          return { ...l, status, submittedAt: r.submittedAt };
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
      return true;
    });
  }, [allLearners, debouncedSearch, statusFilter]);

  const pagedLearners = useMemo(
    () => filteredLearners.slice((learnersPage - 1) * PAGE_SIZE, learnersPage * PAGE_SIZE),
    [filteredLearners, learnersPage]
  );

  const responseInfoById = useMemo(() => {
    const map: Record<string, ContextResponseInfo> = {};
    allLearners.forEach((l) => {
      map[l.id] = { status: l.status, submittedAt: l.submittedAt };
    });
    return map;
  }, [allLearners]);

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
        {!!batchId && (
          <SurveyStatusSummary counts={statusCounts} loading={allLearnersLoading} />
        )}

        <TeacherFilterBar
          search={search}
          onSearchChange={handleSearchChange}
          showSearch={!!batchId && centersLoaded}
          centersLoading={!centersLoaded}
          centers={centers}
          centerId={centerId}
          onCenterChange={(id) => {
            setCenterId(id);
            setSearch('');
            setStatusFilter('all');
            setAllLearners([]);
            const firstBatch = (batchesByCenterId[id] ?? [])[0];
            setBatchId(firstBatch?.id ?? '');
          }}
          batches={batches}
          batchId={batchId}
          onBatchChange={(id) => {
            setBatchId(id);
            setSearch('');
            setStatusFilter('all');
          }}
          showStatusFilter={!!batchId && centersLoaded}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        <Box sx={{ maxWidth: '100%' }}>
          {!centerId ? (
            <TeacherEmptyState message="No centers found for your account." />
          ) : !batchId ? (
            <TeacherEmptyState message="No batches found for this center." />
          ) : allLearnersLoading ? (
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
          ) : filteredLearners.length === 0 ? (
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
                onRowAction={(row) =>
                  responseInfoById[row.id]?.status === 'submitted'
                    ? router.push(`/survey-fill/${surveyId}/${row.id}/view`)
                    : router.push(`/survey-fill/${surveyId}/${row.id}?cohortId=${batchId}`)
                }
              />
              {filteredLearners.length > PAGE_SIZE && (
                <PaginationBar
                  page={learnersPage}
                  pageSize={PAGE_SIZE}
                  total={filteredLearners.length}
                  onPrev={() => setLearnersPage((p) => Math.max(1, p - 1))}
                  onNext={() => setLearnersPage((p) => p + 1)}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherContextHubPage;
