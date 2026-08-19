// ============================================================
// BULK IMPORT — COMPLETION EMAIL
// Pratham 2.0 — Workspace MFE
//
// Emails the logged-in user a success / partial / failure report when a bulk
// import finishes, via the Pratham notification service.
//
// ── Template configuration ───────────────────────────────────
// The template key is NOT hardcoded — set it in .env once the template exists:
//
//   NEXT_PUBLIC_BULK_IMPORT_NOTIFICATION_CONTEXT   (default: 'CMS')
//   NEXT_PUBLIC_BULK_IMPORT_NOTIFICATION_KEY       (default: 'onBulkImportComplete')
//   NEXT_PUBLIC_BULK_IMPORT_FAILURE_KEY            (optional — falls back to the key above)
//
// Set the failure key only if you want separately worded mail for
// partial/failed runs. With one key, use {status} inside the template instead.
//
// ── Placeholders available to the template ───────────────────
//   {userName}          Logged-in user's name
//   {fileName}          Uploaded workbook filename
//   {status}            Completed | Partially Completed | Failed
//   {importedOn}        Completion timestamp
//   {totalJobs}         Total steps in the run
//   {completedJobs}     Steps that succeeded
//   {failedJobs}        Steps that failed
//   {skippedJobs}       Steps skipped (dependency failed upstream)
//   {contentCount}      Content rows in the workbook
//   {questionSetCount}  QuestionSet rows
//   {questionCount}     Question rows
//   {courseCount}       Course rows
//   {failureSummary}    HTML <ul> of failures (or "None")
//   {appUrl}            Link back to the bulk import screen
//   {reportUrl}         Direct .xlsx download URL ('' if upload failed)
//   {reportLink}        Ready-made <a> block, empty when there is no report
//
// The notification API has no attachment field, so the report is uploaded to
// cloud storage and linked rather than attached.
// ============================================================

import { sendCredentialService } from './NotificationService';
import { getLocalStoredUserId, getLocalStoredUserName } from './LocalStorageService';
import { getUserDetailsInfo } from './userServices';
import { uploadImportReport } from '../utils/bulkImportReport';
import { ImportSession } from '../types/bulkImport.types';

const CONTEXT = process.env.NEXT_PUBLIC_BULK_IMPORT_NOTIFICATION_CONTEXT || 'CMS';
const SUCCESS_KEY = process.env.NEXT_PUBLIC_BULK_IMPORT_NOTIFICATION_KEY || 'onBulkImportComplete';
const FAILURE_KEY = process.env.NEXT_PUBLIC_BULK_IMPORT_FAILURE_KEY || SUCCESS_KEY;

/** Cap the failure list so a large broken import can't produce a huge email. */
const MAX_FAILURES_LISTED = 20;

/**
 * Placeholder value meaning "render nothing here".
 *
 * The notification service leaves the RAW token in the output when a
 * replacement value is an empty string — that is what produced literal
 * "{reportLink}" text in delivered mail. An HTML comment is non-empty, so the
 * substitution happens, and it renders as nothing in every mail client.
 * Never map a placeholder to '' here.
 */
const EMPTY_HTML = '<!-- -->';

/**
 * Resolve the logged-in user's email address.
 * Prefers the cached userData blob (no network); falls back to /user/read.
 */
export const getLoggedInUserEmail = async (): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cached = JSON.parse(localStorage.getItem('userData') || '{}');
      if (cached?.email) return cached.email;
    }
  } catch {
    /* fall through to the API lookup */
  }

  try {
    const userId = getLocalStoredUserId();
    if (!userId) return null;
    const response = await getUserDetailsInfo(userId, true);
    return response?.userData?.email || null;
  } catch (err) {
    console.error('[bulk-import] Could not resolve logged-in user email:', err);
    return null;
  }
};

/** Human-readable status derived from the final progress counters. */
const resolveStatus = (failed: number, completed: number): string => {
  if (failed === 0) return 'Completed';
  return completed > 0 ? 'Partially Completed' : 'Failed';
};

/**
 * Build an HTML list of failures for the template. Falls back to "None" so the
 * placeholder is never empty (some templates render blank values badly).
 */
const buildFailureSummary = (session: ImportSession): string => {
  const failures = (session.progress?.jobs || []).filter((j) => j.status === 'failed');
  if (failures.length === 0) return 'None';

  const shown = failures.slice(0, MAX_FAILURES_LISTED);
  const items = shown
    .map((j) => `<li><b>${j.tempId}</b> (${j.type}): ${j.error || 'Unknown error'}</li>`)
    .join('');

  const remaining = failures.length - shown.length;
  const more = remaining > 0 ? `<li>…and ${remaining} more</li>` : '';

  return `<ul>${items}${more}</ul>`;
};

/**
 * Send the completion report. Fire-and-forget: this never throws, so a mail
 * problem can never change the outcome of an import that already succeeded.
 */
export const sendBulkImportNotification = async (
  session: ImportSession
): Promise<void> => {
  try {
    const email = await getLoggedInUserEmail();
    if (!email) {
      console.warn('[bulk-import] No email on the logged-in user — report not sent.');
      return;
    }

    const p = session.progress;
    const failed = p?.failedJobs ?? 0;
    const completed = p?.completedJobs ?? 0;
    const status = resolveStatus(failed, completed);

    const data = session.parsedData;

    // The notification contract has no attachment field, so the .xlsx report is
    // uploaded to cloud storage and linked instead. A failed upload must not
    // block the email — the inline {failureSummary} still carries the detail.
    const reportUrl = await uploadImportReport(session, getLocalStoredUserId() || '');

    const replacements: Record<string, string> = {
      '{userName}': getLocalStoredUserName() || 'there',
      '{fileName}': session.fileName || '—',
      '{status}': status,
      '{importedOn}': new Date().toLocaleString(),
      '{totalJobs}': String(p?.totalJobs ?? 0),
      '{completedJobs}': String(completed),
      '{failedJobs}': String(failed),
      '{skippedJobs}': String(p?.skippedJobs ?? 0),
      '{contentCount}': String(data?.contents?.length ?? 0),
      '{questionSetCount}': String(data?.questionSets?.length ?? 0),
      '{questionCount}': String(data?.questions?.length ?? 0),
      '{courseCount}': String(data?.courses?.length ?? 0),
      '{failureSummary}': buildFailureSummary(session),
      '{appUrl}': typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : '-',
      // Direct download link to the full .xlsx report
      '{reportUrl}': reportUrl || '-',
      // Ready-made anchor so the template can drop in one placeholder, and the
      // whole block disappears cleanly when no report could be produced.
      '{reportLink}': reportUrl
        ? `<p><a href="${reportUrl}">Download the full report (.xlsx)</a></p>`
        : EMPTY_HTML,
    };

    await sendCredentialService({
      isQueue: false,
      context: CONTEXT,
      key: failed > 0 ? FAILURE_KEY : SUCCESS_KEY,
      replacements,
      email: { receipients: [email] },
    });
  } catch (err) {
    console.error('[bulk-import] Failed to send completion report:', err);
  }
};
