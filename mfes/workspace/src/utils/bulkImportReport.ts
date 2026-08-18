// ============================================================
// BULK IMPORT — REPORT WORKBOOK BUILDER
// Pratham 2.0 — Workspace MFE
//
// Builds the same .xlsx the Summary screen offers for download, but as a
// base64 payload so it can be uploaded to cloud storage and linked from the
// completion email.
//
// One workbook, two sheets:
//   • Import Failures — failed + skipped jobs with their error text
//   • Created IDs     — tempId → platform identifier for everything created
//
// Sheets are only added when they have rows, so a clean run produces a
// "Created IDs" only workbook and a total failure produces a failures-only one.
// ============================================================

import * as XLSX from 'xlsx';
import { ImportSession, ErrorReportRow } from '../types/bulkImport.types';

const FAILURE_COLS = [{ wch: 15 }, { wch: 20 }, { wch: 30 }, { wch: 70 }, { wch: 10 }];
const CREATED_COLS = [{ wch: 25 }, { wch: 42 }, { wch: 15 }];

/** Classify a job type into the sheet it came from, for the report. */
const sheetForJobType = (type: string): string => {
  if (type.includes('content')) return 'Content';
  if (type.includes('course')) return 'Courses';
  return 'QuestionSets';
};

const classifyTempId = (tempId: string): string => {
  const t = tempId.toUpperCase();
  if (t.includes('CONTENT')) return 'Content';
  if (t.includes('QS')) return 'QuestionSet';
  if (t.includes('COURSE')) return 'Course';
  return 'Existing';
};

/**
 * Build the report workbook for a finished session.
 * Returns null when there is genuinely nothing to report.
 */
export const buildImportReportBase64 = (
  session: ImportSession
): { base64: string; fileName: string } | null => {
  const jobs = session.progress?.jobs || [];
  const failed = jobs.filter((j) => j.status === 'failed' || j.status === 'skipped');

  const failureRows: ErrorReportRow[] = failed.map((j) => ({
    Sheet: sheetForJobType(j.type),
    Row: 0,
    TempID: j.tempId,
    Field: j.type,
    Error: j.error || (j.status === 'skipped' ? 'Skipped — a previous step failed' : 'Unknown error'),
    Severity: 'Error',
  }));

  const createdRows = Object.entries(session.resolvedIds || {})
    // `_q` suffixed entries are individual questions inside a QS — noise here.
    .filter(([k]) => !k.includes('_q'))
    .map(([tempId, identifier]) => ({
      'Temp ID': tempId,
      'Platform Identifier': identifier,
      Type: classifyTempId(tempId),
    }));

  if (failureRows.length === 0 && createdRows.length === 0) return null;

  const wb = XLSX.utils.book_new();

  if (failureRows.length > 0) {
    const ws = XLSX.utils.json_to_sheet(
      // Drop the always-zero Row column — it means nothing for job failures.
      failureRows.map(({ Row, ...rest }) => rest)
    );
    ws['!cols'] = FAILURE_COLS;
    XLSX.utils.book_append_sheet(wb, ws, 'Import Failures');
  }

  if (createdRows.length > 0) {
    const ws = XLSX.utils.json_to_sheet(createdRows);
    ws['!cols'] = CREATED_COLS;
    XLSX.utils.book_append_sheet(wb, ws, 'Created IDs');
  }

  const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  return { base64, fileName: `Bulk_Import_Report_${stamp}.xlsx` };
};

/**
 * Upload the report and return its public URL.
 * Returns null on any failure — the email still goes out, just without a link.
 */
export const uploadImportReport = async (
  session: ImportSession,
  userId: string
): Promise<string | null> => {
  try {
    const report = buildImportReportBase64(session);
    if (!report) return null;

    // Same-origin API route; axios is not needed and keeps this dependency-free.
    const response = await fetch('/api/bulk-import/upload-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...report, userId }),
    });

    if (!response.ok) {
      console.error('[bulk-import] Report upload failed:', await response.text());
      return null;
    }

    const data = await response.json();
    return data?.url || null;
  } catch (err) {
    console.error('[bulk-import] Report upload error:', err);
    return null;
  }
};
