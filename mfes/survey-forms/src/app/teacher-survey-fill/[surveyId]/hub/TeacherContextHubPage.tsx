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
import TeacherContextTable from '../../../../Components/teacher/TeacherContextTable';
import TeacherEmptyState from '../../../../Components/teacher/TeacherEmptyState';
import PaginationBar from '../../../../Components/PaginationBar/PaginationBar';
import {
  fetchSurveyById,
  fetchResponseStatusByContext,
  fetchTeacherCentersWithBatches,
  fetchTeacherCohortLearners,
} from '../../../../utils/API/surveyService';
import type { ContextResponseInfo } from '../../../../utils/API/surveyService';
import type { Survey } from '../../../../types/survey';
import type { TeacherContextRow } from '../../../../types/teacherSurvey';

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

  const PAGE_SIZE = 10;
  const [learners, setLearners] = useState<TeacherContextRow[]>([]);
  const [learnersTotalCount, setLearnersTotalCount] = useState(0);
  const [learnersPage, setLearnersPage] = useState(1);
  const [learnersLoading, setLearnersLoading] = useState(false);
  const [learnersError, setLearnersError] = useState<string | null>(null);

  const [responseInfoById, setResponseInfoById] = useState<Record<string, ContextResponseInfo>>({});
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

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

  // Reset to page 1 when batch or search changes
  useEffect(() => {
    setLearnersPage(1);
  }, [batchId, debouncedSearch]);

  // Load learners when batchId or page changes
  useEffect(() => {
    if (!batchId) {
      setLearners([]);
      setLearnersTotalCount(0);
      setResponseInfoById({});
      return;
    }
    let cancelled = false;
    setLearnersLoading(true);
    setLearnersError(null);
    fetchTeacherCohortLearners(batchId, { limit: PAGE_SIZE, offset: (learnersPage - 1) * PAGE_SIZE, name: debouncedSearch || undefined })
      .then(({ learners: list, totalCount }) => {
        if (!cancelled) {
          setLearners(list);
          setLearnersTotalCount(totalCount);
        }
      })
      .catch(() => {
        if (!cancelled) { setLearnersError('Failed to load learners.'); setLearners([]); }
      })
      .finally(() => { if (!cancelled) setLearnersLoading(false); });
    return () => { cancelled = true; };
  }, [batchId, learnersPage, debouncedSearch]);

  // Fetch response status for loaded learners
  useEffect(() => {
    if (!survey || learners.length === 0) { setResponseInfoById({}); return; }
    const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    let cancelled = false;
    fetchResponseStatusByContext(survey.surveyId, learners.map((r) => r.id), userId)
      .then((map) => { if (!cancelled) setResponseInfoById(map); })
      .catch(() => { if (!cancelled) setResponseInfoById({}); });
    return () => { cancelled = true; };
  }, [learners, survey]);

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
            setLearners([]);
            setLearnersTotalCount(0);
            setLearnersPage(1);
            setResponseInfoById({});
            const firstBatch = (batchesByCenterId[id] ?? [])[0];
            setBatchId(firstBatch?.id ?? '');
          }}
          batches={batches}
          batchId={batchId}
          onBatchChange={setBatchId}
        />

        <Box sx={{ maxWidth: '100%' }}>
          {!centerId ? (
            <TeacherEmptyState message="No centers found for your account." />
          ) : !batchId ? (
            <TeacherEmptyState message="No batches found for this center." />
          ) : learnersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress sx={{ color: '#FDBE16' }} />
            </Box>
          ) : learnersError ? (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography color="error">{learnersError}</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2, borderColor: '#FDBE16', color: '#1E1B16' }}
                onClick={() => {
                  setLearnersError(null);
                  if (!batchId) return;
                  setLearnersLoading(true);
                  fetchTeacherCohortLearners(batchId)
                    .then(({ learners: list, totalCount }) => { setLearners(list); setLearnersTotalCount(totalCount); })
                    .catch(() => setLearnersError('Failed to load learners.'))
                    .finally(() => setLearnersLoading(false));
                }}
              >
                Retry
              </Button>
            </Box>
          ) : learners.length === 0 ? (
            <TeacherEmptyState
              message={
                search.trim()
                  ? 'No learners match your search.'
                  : 'No learners found in the selected batch.'
              }
            />
          ) : (
            <>
              <TeacherContextTable
                rows={learners}
                responseInfoById={responseInfoById}
                onRowAction={(row) =>
                  responseInfoById[row.id]?.status === 'submitted'
                    ? router.push(`/survey-fill/${surveyId}/${row.id}/view`)
                    : router.push(`/survey-fill/${surveyId}/${row.id}`)
                }
              />
              {learnersTotalCount > PAGE_SIZE && (
                <PaginationBar
                  page={learnersPage}
                  pageSize={PAGE_SIZE}
                  total={learnersTotalCount}
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
