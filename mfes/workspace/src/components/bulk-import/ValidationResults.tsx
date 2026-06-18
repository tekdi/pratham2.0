// ============================================================
// BULK IMPORT — STEP 4: VALIDATION RESULTS
// ============================================================

import React, { useState } from 'react';
import {
  Box, Typography, Button, Alert, Chip, Table, TableHead, TableBody,
  TableRow, TableCell, TableContainer, Paper, Accordion, AccordionSummary,
  AccordionDetails, Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { ParsedImportData, ValidationResult, ValidationError, ErrorReportRow } from '../../types/bulkImport.types';
import * as XLSX from 'xlsx';

interface Props {
  parsedData: ParsedImportData;
  validationResult: ValidationResult;
  onStartImport: () => void;
  onBack: () => void;
}

const severityColor = (s: 'error' | 'warning') => (s === 'error' ? 'error' : 'warning');

const ValidationResults: React.FC<Props> = ({
  parsedData,
  validationResult,
  onStartImport,
  onBack,
}) => {
  const [filter, setFilter] = useState<'all' | 'error' | 'warning'>('all');

  const { isValid, errors, warnings, summary } = validationResult;
  const allIssues = [...errors, ...warnings];

  // Separate global (General) errors from sheet-specific ones
  const generalErrors = allIssues.filter((e) => e.sheet === 'General');
  const sheetIssues   = allIssues.filter((e) => e.sheet !== 'General');

  const filteredIssues =
    filter === 'all' ? sheetIssues :
    filter === 'error' ? sheetIssues.filter((e) => e.severity === 'error') :
    sheetIssues.filter((e) => e.severity === 'warning');

  // Group sheet-specific errors by sheet
  const bySheet = filteredIssues.reduce((acc, err) => {
    if (!acc[err.sheet]) acc[err.sheet] = [];
    acc[err.sheet].push(err);
    return acc;
  }, {} as Record<string, ValidationError[]>);

  // Download error report as Excel
  const downloadErrorReport = () => {
    const rows: ErrorReportRow[] = allIssues.map((e) => ({
      Sheet: e.sheet,
      Row: e.row,
      TempID: e.tempId || '',
      Field: e.column,
      Error: e.message,
      Severity: e.severity === 'error' ? 'Error' : 'Warning',
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 25 }, { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 60 }, { wch: 10 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, 'Validation Errors');
    XLSX.writeFile(wb, 'Bulk_Import_Validation_Errors.xlsx');
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Step 4: Validation Results
      </Typography>

      {/* Global (General) errors — shown before the main banner */}
      {generalErrors.map((e, i) => (
        <Alert key={i} severity="error" icon={<ErrorOutlineIcon />} sx={{ mb: 1.5 }}>
          {e.message}
        </Alert>
      ))}

      {/* Summary banner — only when there's actual data */}
      {summary.totalRows > 0 && (
        isValid ? (
          <Alert
            severity="success"
            icon={<CheckCircleIcon />}
            sx={{ mb: 2, fontWeight: 600 }}
          >
            All data is valid! You can now start the import.
            {warnings.length > 0 && ` (${warnings.length} warning(s) — these won't block import)`}
          </Alert>
        ) : (
          <Alert
            severity="error"
            icon={<ErrorOutlineIcon />}
            sx={{ mb: 2 }}
          >
            <strong>{errors.filter((e) => e.sheet !== 'General').length} error(s)</strong> found. Please fix them in your Excel file and re-upload.
            {warnings.length > 0 && ` There are also ${warnings.length} warning(s).`}
          </Alert>
        )
      )}

      {/* Stats */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: '1fr 1fr', md: 'repeat(4, 1fr)' }}
        gap={1.5}
        sx={{ mb: 2 }}
      >
        {[
          { label: 'Total Rows',  value: summary.totalRows,                                       color: '#1565C0' },
          { label: 'Valid',       value: summary.validRows,                                       color: '#2E7D32' },
          { label: 'Errors',      value: errors.filter((e) => e.sheet !== 'General').length,      color: '#C62828' },
          { label: 'Warnings',    value: warnings.filter((e) => e.sheet !== 'General').length,    color: '#E65100' },
        ].map((stat) => (
          <Paper
            key={stat.label}
            variant="outlined"
            sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}
          >
            <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Entity counts */}
      <Box display="flex" gap={1} flexWrap="wrap" sx={{ mb: 2 }}>
        <Chip label={`${summary.contentCount} Content`} size="small" variant="outlined" />
        <Chip label={`${summary.questionSetCount} Question Sets`} size="small" variant="outlined" />
        <Chip label={`${summary.questionCount} Questions`} size="small" variant="outlined" />
        <Chip label={`${summary.courseCount} Courses`} size="small" variant="outlined" />
      </Box>

      {/* Filters + Download — only when there are sheet-level issues */}
      {sheetIssues.length > 0 && (
        <>
          <Divider sx={{ mb: 2 }} />
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
            <Box display="flex" gap={1}>
              {(['all', 'error', 'warning'] as const).map((f) => {
                const sheetErrors   = sheetIssues.filter((e) => e.severity === 'error');
                const sheetWarnings = sheetIssues.filter((e) => e.severity === 'warning');
                const count = f === 'all' ? sheetIssues.length : f === 'error' ? sheetErrors.length : sheetWarnings.length;
                return (
                  <Chip
                    key={f}
                    label={f === 'all' ? `All (${count})` : f === 'error' ? `Errors (${count})` : `Warnings (${count})`}
                    size="small"
                    variant={filter === f ? 'filled' : 'outlined'}
                    color={f === 'error' ? 'error' : f === 'warning' ? 'warning' : 'default'}
                    onClick={() => setFilter(f)}
                    sx={{ cursor: 'pointer' }}
                  />
                );
              })}
            </Box>
            <Button
              size="small"
              startIcon={<DownloadIcon />}
              onClick={downloadErrorReport}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Download Error Report
            </Button>
          </Box>

          {/* Errors grouped by sheet */}
          {Object.entries(bySheet).map(([sheet, sheetErrors]) => (
            <Accordion key={sheet} defaultExpanded disableGutters sx={{ mb: 1, border: '1px solid #E0E0E0', borderRadius: 1.5 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Typography fontWeight={600} fontSize={14}>
                    {sheet}
                  </Typography>
                  <Chip
                    label={`${sheetErrors.filter((e) => e.severity === 'error').length} errors`}
                    size="small"
                    color="error"
                    sx={{ fontSize: 10 }}
                  />
                  {sheetErrors.some((e) => e.severity === 'warning') && (
                    <Chip
                      label={`${sheetErrors.filter((e) => e.severity === 'warning').length} warnings`}
                      size="small"
                      color="warning"
                      sx={{ fontSize: 10 }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: '#F5F5F5' }}>
                        {['Row', 'Field', 'Temp ID', 'Issue', 'Severity'].map((h) => (
                          <TableCell key={h} sx={{ fontWeight: 600, fontSize: 11 }}>{h}</TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {sheetErrors.map((err, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ fontSize: 12 }}>{err.row}</TableCell>
                          <TableCell sx={{ fontSize: 12, fontFamily: 'monospace' }}>{err.column}</TableCell>
                          <TableCell>
                            {err.tempId ? (
                              <Chip label={err.tempId} size="small" variant="outlined" sx={{ fontSize: 10 }} />
                            ) : '—'}
                          </TableCell>
                          <TableCell sx={{ fontSize: 12 }}>{err.message}</TableCell>
                          <TableCell>
                            {err.severity === 'error' ? (
                              <Chip
                                icon={<ErrorOutlineIcon sx={{ fontSize: '14px !important' }} />}
                                label="Error"
                                size="small"
                                color="error"
                                sx={{ fontSize: 10 }}
                              />
                            ) : (
                              <Chip
                                icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                                label="Warning"
                                size="small"
                                color="warning"
                                sx={{ fontSize: 10 }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          ))}
        </>
      )}

      {/* Navigation */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ textTransform: 'none' }}
        >
          Back to Preview
        </Button>
        <Button
          variant="contained"
          color={isValid ? 'primary' : 'error'}
          startIcon={<PlayArrowIcon />}
          onClick={onStartImport}
          disabled={!isValid}
          sx={{ textTransform: 'none', fontWeight: 600, px: 4 }}
        >
          {isValid ? 'Start Import' : 'Fix Errors to Proceed'}
        </Button>
      </Box>
    </Box>
  );
};

export default ValidationResults;
