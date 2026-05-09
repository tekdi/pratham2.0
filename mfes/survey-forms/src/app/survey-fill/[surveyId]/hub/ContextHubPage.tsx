'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Tab,
  Tabs,
  Tooltip,
} from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import BackHeader from '../../../../Components/BackHeader/BackHeader';
import NoDataFound from '../../../../Components/NoDataFound/NoDataFound';
import { fetchSurveyById } from '../../../../utils/API/surveyService';
import {
  mergeEntryConfig,
  readSurveyEntryConfig,
  readSurveyEntryConfigFromSearchParams,
} from '../../../../utils/surveyEntryConfig';
import type { Survey } from '../../../../types/survey';
import { CONTEXT_TYPE_LABELS } from '../../../../../app.config';

const hubTitle: Record<string, string> = {
  learner: 'Select learner',
  center: 'Select center',
  custom: 'Select context',
};

function statusChip(status: string | undefined) {
  if (!status || status === 'none') {
    return <Chip size="small" label="Not started" variant="outlined" />;
  }
  if (status === 'draft') {
    return <Chip size="small" label="In progress" sx={{ backgroundColor: '#FFF8E1' }} />;
  }
  if (status === 'submitted') {
    return <Chip size="small" label="Submitted" sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32' }} />;
  }
  return <Chip size="small" label={status} variant="outlined" />;
}

function relativeTime(dateStr: string | undefined): string {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const ContextHubPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const surveyId = params.surveyId as string;

  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'none' | 'draft' | 'submitted'>('all');

  const entryConfig = useMemo(() => {
    const fromStore = readSurveyEntryConfig(surveyId);
    const fromUrl = readSurveyEntryConfigFromSearchParams(searchParams);
    return mergeEntryConfig(fromStore, fromUrl);
  }, [surveyId, searchParams]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchSurveyById(surveyId);
        if (cancelled) return;
        if (result.params.status !== 'successful' || !result.result.data) {
          setError(result.params.errmsg || 'Failed to load survey');
          return;
        }
        setSurvey(result.result.data);
      } catch {
        if (!cancelled) setError('Failed to load survey');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [surveyId]);

  const rows = entryConfig?.rosterItems ?? [];
  const rosterSource = entryConfig?.rosterSource ?? 'inline';
  const hubKind = entryConfig?.hubKind ?? 'custom';
  const statusMap = entryConfig?.statusByContextId ?? {};

  const summaryCounts = useMemo(() => {
    const counts = { total: rows.length, none: 0, draft: 0, submitted: 0 };
    rows.forEach((r) => {
      const s = (statusMap[r.id] as string | undefined) ?? 'none';
      if (s === 'draft') counts.draft++;
      else if (s === 'submitted') counts.submitted++;
      else counts.none++;
    });
    return counts;
  }, [rows, statusMap]);

  const filteredRows = useMemo(() => {
    let result = rows;
    if (statusFilter !== 'all') {
      result = result.filter((r) => {
        const s = (statusMap[r.id] as string | undefined) ?? 'none';
        return s === statusFilter;
      });
    }
    const q = search.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (r) =>
        r.label.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        (r.subtitle && r.subtitle.toLowerCase().includes(q))
    );
  }, [rows, search, statusFilter, statusMap]);

  const missingHubSetup =
    entryConfig?.contextEntry === 'hub' &&
    rosterSource !== 'inline' &&
    rosterSource !== 'teacherCohort' &&
    rosterSource !== 'hostFetcherKey';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: '#FDBE16' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <BackHeader title="Survey" />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => router.back()}>
            Go back
          </Button>
        </Box>
      </Box>
    );
  }

  if (!entryConfig || entryConfig.contextEntry !== 'hub') {
    return (
      <Box>
        <BackHeader title={survey?.surveyTitle || 'Survey'} />
        <Box sx={{ p: 2 }}>
          <NoDataFound message="Missing hub entry configuration. The host app must set sessionStorage surveyFormsEntryConfig with version: 1 and contextEntry: &quot;hub&quot; before opening this page." />
        </Box>
      </Box>
    );
  }

  if (rosterSource === 'teacherCohort') {
    return (
      <Box>
        <BackHeader title={survey?.surveyTitle || 'Survey'} subtitle={hubTitle[hubKind] || hubTitle.custom} />
        <Box sx={{ p: 2 }}>
          <NoDataFound message="rosterSource &quot;teacherCohort&quot; is not wired in this MFE yet. Use rosterSource: &quot;inline&quot; and pass rosterItems from the host, or add a fetcher implementation." />
        </Box>
      </Box>
    );
  }

  if (rosterSource === 'hostFetcherKey') {
    return (
      <Box>
        <BackHeader title={survey?.surveyTitle || 'Survey'} subtitle={hubTitle[hubKind] || hubTitle.custom} />
        <Box sx={{ p: 2 }}>
          <NoDataFound message={`hostFetcherKey "${entryConfig.hostFetcherKey ?? ''}" is not registered in survey-forms yet. Pass rosterSource: "inline" with rosterItems from the host instead.`} />
        </Box>
      </Box>
    );
  }

  if (missingHubSetup) {
    return (
      <Box>
        <BackHeader title={survey?.surveyTitle || 'Survey'} />
        <Box sx={{ p: 2 }}>
          <NoDataFound message="Set rosterSource to inline | teacherCohort | hostFetcherKey in surveyFormsEntryConfig." />
        </Box>
      </Box>
    );
  }

  const ctxLabel =
    survey?.contextType && CONTEXT_TYPE_LABELS[survey.contextType]
      ? CONTEXT_TYPE_LABELS[survey.contextType]
      : survey?.contextType || 'Context';

  return (
    <Box>
      <BackHeader
        title={survey?.surveyTitle || 'Survey'}
        subtitle={`${hubTitle[hubKind] || hubTitle.custom} · ${ctxLabel}`}
      />

      <Box sx={{ p: 2 }}>
        {/* Summary card */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            p: 2,
            backgroundColor: '#FAFAFA',
            borderRadius: '12px',
            border: '1px solid #E0E0E0',
            flexWrap: 'wrap',
          }}
        >
          {[
            { label: 'Total', count: summaryCounts.total, color: '#1E1B16' },
            { label: 'Not started', count: summaryCounts.none, color: '#7C766F' },
            { label: 'In progress', count: summaryCounts.draft, color: '#E65100' },
            { label: 'Submitted', count: summaryCounts.submitted, color: '#2E7D32' },
          ].map(({ label, count, color }) => (
            <Box key={label} sx={{ textAlign: 'center', minWidth: 80 }}>
              <Typography variant="h2" sx={{ color, fontWeight: 700 }}>{count}</Typography>
              <Typography variant="caption" sx={{ color: '#7C766F' }}>{label}</Typography>
            </Box>
          ))}
        </Box>

        {/* Search + count row */}
        <Box sx={{ display: 'flex', gap: 2, mb: 1, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            size="small"
            label="Search learner"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name or ID"
            sx={{ minWidth: 220, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          />
          <Typography variant="body2" sx={{ alignSelf: 'center', color: '#7C766F', mb: 0 }}>
            {filteredRows.length} of {rows.length} shown
          </Typography>
        </Box>

        {/* Status filter tabs */}
        <Tabs
          value={statusFilter}
          onChange={(_, v) => setStatusFilter(v)}
          sx={{ mb: 1, minHeight: 36 }}
          TabIndicatorProps={{ style: { backgroundColor: '#FDBE16' } }}
        >
          <Tab value="all" label={`All (${summaryCounts.total})`} sx={{ minHeight: 36, fontSize: '13px' }} />
          <Tab value="none" label={`Not started (${summaryCounts.none})`} sx={{ minHeight: 36, fontSize: '13px' }} />
          <Tab value="draft" label={`In progress (${summaryCounts.draft})`} sx={{ minHeight: 36, fontSize: '13px' }} />
          <Tab value="submitted" label={`Submitted (${summaryCounts.submitted})`} sx={{ minHeight: 36, fontSize: '13px' }} />
        </Tabs>

        {rows.length === 0 ? (
          <NoDataFound message="No roster rows. Host should set rosterItems (rosterSource: inline) or implement a fetcher." />
        ) : (
          <TableContainer component={Paper} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0' }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 600 }}>{ctxLabel}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Submitted</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row.label}
                      </Typography>
                      {row.subtitle && (
                        <Typography variant="caption" sx={{ color: '#7C766F', display: 'block' }}>
                          {row.subtitle}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {row.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{statusChip(statusMap[row.id] as string | undefined)}</TableCell>
                    <TableCell>
                      {statusMap[row.id] === 'submitted' ? (
                        <Tooltip title={(entryConfig?.submittedAtByContextId as any)?.[row.id] ?? ''} placement="top">
                          <Typography variant="caption">
                            {relativeTime((entryConfig?.submittedAtByContextId as any)?.[row.id])}
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#bbb' }}>—</Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() =>
                          statusMap[row.id] === 'submitted'
                            ? router.push(`/survey-fill/${surveyId}/${row.id}/view`)
                            : router.push(`/survey-fill/${surveyId}/${row.id}`)
                        }
                        sx={{
                          backgroundColor: '#FDBE16',
                          color: '#1E1B16',
                          fontWeight: 600,
                          '&:hover': { backgroundColor: '#e6ab0e' },
                        }}
                      >
                        {statusMap[row.id] === 'submitted' ? 'View' : 'Continue'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default ContextHubPage;
