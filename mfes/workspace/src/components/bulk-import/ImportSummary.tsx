// ============================================================
// BULK IMPORT — STEP 6: IMPORT SUMMARY
// ============================================================

import React from 'react';
import {
  Box, Typography, Button, Alert, Chip, Paper,
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DownloadIcon from '@mui/icons-material/Download';
import ReplayIcon from '@mui/icons-material/Replay';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import * as XLSX from 'xlsx';

import { ImportSession, QueueJob, ErrorReportRow } from '../../types/bulkImport.types';

interface Props {
  session: ImportSession;
  onReset: () => void;
}

const JOB_TYPE_LABELS: Record<string, string> = {
  create_content: 'Create Content',
  upload_content_file: 'Upload File',
  review_content: 'Submit for Review',
  publish_content: 'Publish Content',
  create_questionset: 'Create Question Set',
  create_question: 'Create Question',
  update_questionset_hierarchy: 'Update QS Hierarchy',
  review_questionset: 'Submit QS for Review',
  publish_questionset: 'Publish Question Set',
  create_course: 'Create Course',
  update_course_hierarchy: 'Update Course Hierarchy',
};

const ImportSummary: React.FC<Props> = ({ session, onReset }) => {
  const { progress, phase, resolvedIds } = session;

  if (!progress) return null;

  const failedJobs = progress.jobs.filter((j) => j.status === 'failed');
  const skippedJobs = progress.jobs.filter((j) => j.status === 'skipped');
  const successJobs = progress.jobs.filter((j) => j.status === 'success');

  // Group resolved IDs by entity type
  const createdContent = Object.entries(resolvedIds).filter(([k]) =>
    k.toUpperCase().includes('CONTENT') && !k.includes('_q')
  );
  const createdQS = Object.entries(resolvedIds).filter(([k]) =>
    k.toUpperCase().includes('_QS_') && !k.includes('_q')
  );
  const createdCourses = Object.entries(resolvedIds).filter(([k]) =>
    k.toUpperCase().includes('COURSE')
  );

  // Download failure report
  const downloadFailureReport = () => {
    const rows: ErrorReportRow[] = [...failedJobs, ...skippedJobs].map((j) => ({
      Sheet: j.type.includes('content') ? 'Content' : j.type.includes('course') ? 'Courses' : 'QuestionSets',
      Row: 0,
      TempID: j.tempId,
      Field: j.type,
      Error: j.error || 'Unknown error',
      Severity: 'Error',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 15 }, { wch: 8 }, { wch: 20 }, { wch: 30 }, { wch: 60 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Import Failures');
    XLSX.writeFile(wb, 'Bulk_Import_Failures.xlsx');
  };

  // Download success report with resolved identifiers
  const downloadSuccessReport = () => {
    const rows = Object.entries(resolvedIds)
      .filter(([k]) => !k.includes('_q'))
      .map(([tempId, identifier]) => ({
        'Temp ID': tempId,
        'Platform Identifier': identifier,
        'Type': tempId.toUpperCase().includes('CONTENT')
          ? 'Content'
          : tempId.toUpperCase().includes('QS')
          ? 'QuestionSet'
          : tempId.toUpperCase().includes('COURSE')
          ? 'Course'
          : 'Existing',
      }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [{ wch: 25 }, { wch: 40 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(wb, ws, 'Created IDs');
    XLSX.writeFile(wb, 'Bulk_Import_Created_IDs.xlsx');
  };

  const phaseLabel = phase === 'completed'
    ? 'Import Completed Successfully'
    : phase === 'partial'
    ? 'Import Partially Completed'
    : 'Import Failed';

  const phaseColor = phase === 'completed' ? 'success' : phase === 'partial' ? 'warning' : 'error';
  const phaseIcon = phase === 'completed'
    ? <CheckCircleIcon />
    : phase === 'partial'
    ? <WarningAmberIcon />
    : <ErrorOutlineIcon />;

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Step 6: Import Summary
      </Typography>

      {/* Status banner */}
      <Alert severity={phaseColor} icon={phaseIcon} sx={{ mb: 2, fontWeight: 600 }}>
        {phaseLabel} — {successJobs.length} of {progress.totalJobs} jobs completed
      </Alert>

      {/* Stats cards */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }}
        gap={1.5}
        sx={{ mb: 3 }}
      >
        {[
          { label: 'Total Jobs', value: progress.totalJobs, color: '#1565C0' },
          { label: 'Succeeded', value: progress.completedJobs, color: '#2E7D32' },
          { label: 'Failed', value: progress.failedJobs, color: '#C62828' },
          { label: 'Skipped', value: progress.skippedJobs, color: '#E65100' },
        ].map((stat) => (
          <Paper key={stat.label} variant="outlined" sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
          </Paper>
        ))}
      </Box>

      {/* Created Entities */}
      {Object.keys(resolvedIds).filter((k) => !k.includes('_q')).length > 0 && (
        <>
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            Created Entities
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {createdContent.length > 0 && (
              <Chip label={`${createdContent.length} Content`} color="info" size="small" />
            )}
            {createdQS.length > 0 && (
              <Chip label={`${createdQS.length} Question Sets`} color="success" size="small" />
            )}
            {createdCourses.length > 0 && (
              <Chip label={`${createdCourses.length} Courses`} color="primary" size="small" />
            )}
          </Box>

          <Paper variant="outlined" sx={{ maxHeight: 220, overflow: 'auto', mb: 2, borderRadius: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: '#F5F5F5' }}>
                    {['Temp ID', 'Platform Identifier', 'Action'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 11 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(resolvedIds)
                    .filter(([k]) => !k.includes('_q'))
                    .map(([tempId, identifier]) => (
                      <TableRow key={tempId} hover>
                        <TableCell>
                          <Chip label={tempId} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, fontFamily: 'monospace', color: 'success.dark' }}>
                          {identifier}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            endIcon={<OpenInNewIcon sx={{ fontSize: 12 }} />}
                            sx={{ textTransform: 'none', fontSize: 11 }}
                            href="/mfe_workspace/workspace/content/allContents"
                            target="_blank"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Failed jobs */}
      {failedJobs.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" fontWeight={600} color="error.main" sx={{ mb: 1 }}>
            Failed Jobs ({failedJobs.length})
          </Typography>
          <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto', mb: 2, borderRadius: 2 }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ background: '#FFF8F8' }}>
                    {['Temp ID', 'Job Type', 'Error'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, fontSize: 11 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {failedJobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <Chip label={job.tempId} size="small" color="error" sx={{ fontSize: 10 }} />
                      </TableCell>
                      <TableCell sx={{ fontSize: 11 }}>{JOB_TYPE_LABELS[job.type] || job.type}</TableCell>
                      <TableCell sx={{ fontSize: 11, color: 'error.main' }}>{job.error}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </>
      )}

      {/* Action buttons */}
      <Box display="flex" gap={1.5} flexWrap="wrap" justifyContent="space-between" mt={2}>
        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={downloadSuccessReport}
            disabled={Object.keys(resolvedIds).filter((k) => !k.includes('_q')).length === 0}
            sx={{ textTransform: 'none' }}
          >
            Download Created IDs
          </Button>
          {failedJobs.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DownloadIcon />}
              onClick={downloadFailureReport}
              sx={{ textTransform: 'none' }}
            >
              Download Failure Report
            </Button>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<ReplayIcon />}
          onClick={onReset}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          Start New Import
        </Button>
      </Box>
    </Box>
  );
};

export default ImportSummary;
