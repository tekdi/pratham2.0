// ============================================================
// BULK IMPORT — STEP 5: IMPORT PROGRESS
// ============================================================

import React, { useMemo } from 'react';
import {
  Box, Typography, LinearProgress, Chip, Paper,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Button, Tooltip, CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SyncIcon from '@mui/icons-material/Sync';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { ImportProgress as ImportProgressType, QueueJob } from '../../types/bulkImport.types';

interface Props {
  progress: ImportProgressType | null;
  onAbort: () => void;
}

const statusIcon = (status: string) => {
  switch (status) {
    case 'success': return <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />;
    case 'failed': return <ErrorOutlineIcon sx={{ fontSize: 16, color: 'error.main' }} />;
    case 'skipped': return <SkipNextIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
    case 'processing': return <CircularProgress size={14} thickness={5} />;
    case 'retrying': return <SyncIcon sx={{ fontSize: 16, color: 'warning.main', animation: 'spin 1s linear infinite', '@keyframes spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } } }} />;
    default: return <AccessTimeIcon sx={{ fontSize: 16, color: 'text.disabled' }} />;
  }
};

const statusChipColor = (status: string): any => {
  if (status === 'success') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'skipped') return 'default';
  if (status === 'processing' || status === 'retrying') return 'warning';
  return 'default';
};

const JOB_TYPE_LABELS: Record<string, string> = {
  create_content: 'Create Content',
  upload_content_file: 'Upload File',
  review_content: 'Submit for Review',
  create_questionset: 'Create Question Set',
  create_question: 'Create Question',
  update_questionset_hierarchy: 'Update QS Hierarchy',
  create_course: 'Create Course',
  update_course_hierarchy: 'Update Course Hierarchy',
};

const ImportProgress: React.FC<Props> = ({ progress, onAbort }) => {
  const isRunning = progress?.phase === 'importing';

  const statJobs = useMemo(() => {
    if (!progress) return { success: 0, failed: 0, skipped: 0, active: 0, queued: 0 };
    return {
      success: progress.completedJobs,
      failed: progress.failedJobs,
      skipped: progress.skippedJobs,
      active: progress.activeJobs,
      queued: progress.totalJobs - progress.completedJobs - progress.failedJobs - progress.skippedJobs - progress.activeJobs,
    };
  }, [progress]);

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Step 5: Importing...
      </Typography>

      {!progress ? (
        <Box display="flex" flexDirection="column" alignItems="center" py={6} gap={2}>
          <CircularProgress size={48} />
          <Typography color="text.secondary">Initialising import queue...</Typography>
        </Box>
      ) : (
        <>
          {/* Overall progress bar */}
          <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontWeight={600} fontSize={15}>
                Overall Progress
              </Typography>
              <Typography fontWeight={700} fontSize={20} color="primary">
                {progress.percentComplete}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress.percentComplete}
              sx={{ height: 10, borderRadius: 5, mb: 1.5 }}
              color={progress.failedJobs > 0 ? 'error' : 'primary'}
            />
            <Box display="flex" gap={1.5} flexWrap="wrap">
              <Chip label={`✓ ${statJobs.success} completed`} size="small" color="success" />
              {statJobs.active > 0 && (
                <Chip label={`⟳ ${statJobs.active} processing`} size="small" color="warning" />
              )}
              {statJobs.failed > 0 && (
                <Chip label={`✗ ${statJobs.failed} failed`} size="small" color="error" />
              )}
              {statJobs.skipped > 0 && (
                <Chip label={`⊘ ${statJobs.skipped} skipped`} size="small" variant="outlined" />
              )}
              {statJobs.queued > 0 && (
                <Chip label={`◷ ${statJobs.queued} queued`} size="small" variant="outlined" />
              )}
            </Box>
          </Paper>

          {/* Job Table */}
          <Paper variant="outlined" sx={{ maxHeight: 340, overflow: 'auto', borderRadius: 2 }}>
            <TableContainer>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {['Status', 'Job Type', 'Entity Temp ID', 'Result / Error', 'Retries'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 11, background: '#F5F5F5' }}>
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {progress.jobs.map((job) => (
                    <TableRow key={job.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          {statusIcon(job.status)}
                          <Chip
                            label={job.status}
                            size="small"
                            color={statusChipColor(job.status)}
                            sx={{ fontSize: 10 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>
                        {JOB_TYPE_LABELS[job.type] || job.type}
                      </TableCell>
                      <TableCell>
                        <Chip label={job.tempId} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 11, maxWidth: 200 }}>
                        {job.resolvedIdentifier ? (
                          <Typography variant="caption" color="success.main" fontFamily="monospace">
                            {job.resolvedIdentifier}
                          </Typography>
                        ) : job.error ? (
                          <Tooltip title={job.error} placement="top">
                            <Typography variant="caption" color="error.main" noWrap>
                              {job.error}
                            </Typography>
                          </Tooltip>
                        ) : '—'}
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>
                        {job.retryCount > 0 ? (
                          <Chip label={`${job.retryCount}x`} size="small" color="warning" sx={{ fontSize: 10 }} />
                        ) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Abort button */}
          {isRunning && (
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="error"
                startIcon={<StopCircleOutlinedIcon />}
                onClick={onAbort}
                sx={{ textTransform: 'none' }}
              >
                Stop Import
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ImportProgress;
