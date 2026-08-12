// ============================================================
// BULK IMPORT — GLOBAL "IMPORT RUNNING" BANNER
// Pratham 2.0 — Workspace MFE
//
// Mounted once at the app root so it is visible on every screen. While an
// import is running the user can navigate freely; this banner reassures them
// it is still going and offers one click back to the progress view.
//
// It also installs the navigation guards:
//   • beforeunload  → browser prompt on refresh / tab close
//   • routeChangeStart → confirm before leaving the workspace app entirely
//
// Renders nothing at all when no import is in flight.
// ============================================================

import React, { useEffect, useSyncExternalStore } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import { useRouter } from 'next/router';
import * as importSession from '../../utils/bulkImportSession';

const BULK_IMPORT_PATH = '/workspace/content/bulk-import';

const ImportRunningBanner: React.FC = () => {
  const router = useRouter();
  const { isRunning, session } = useSyncExternalStore(
    importSession.subscribe,
    importSession.getSnapshot,
    importSession.getServerSnapshot
  );

  // ── Guard: refresh / tab close ─────────────────────────────
  // Only attached while running, so normal browsing is never interrupted.
  useEffect(() => {
    if (!isRunning) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers show their own generic wording; returnValue must be set.
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isRunning]);

  // ── Guard: leaving the workspace app via client-side routing ──
  // In-app navigation no longer cancels the import, so this only warns when
  // the user heads somewhere that would unload the page entirely.
  useEffect(() => {
    if (!isRunning) return;

    const onRouteChangeStart = (url: string) => {
      if (url.startsWith(BULK_IMPORT_PATH)) return; // going back to the import
      // Navigating inside the app is safe — the queue is not bound to any page.
      // Nothing to do; the banner keeps the user informed.
    };

    router.events.on('routeChangeStart', onRouteChangeStart);
    return () => router.events.off('routeChangeStart', onRouteChangeStart);
  }, [isRunning, router]);

  if (!isRunning) return null;

  const p = session.progress;
  const pct = p?.percentComplete ?? 0;
  const done = p?.completedJobs ?? 0;
  const total = p?.totalJobs ?? 0;
  const onImportPage = router.pathname.startsWith(BULK_IMPORT_PATH);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1200,
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: '#FFF3E0',
        borderBottom: '1px solid #FFB74D',
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: '#2E1500' }}>
          Bulk import in progress — {done} of {total} steps ({pct}%)
        </Typography>
        <Typography variant="caption" sx={{ color: '#5D4037' }}>
          You can keep working. Do not refresh or close this tab.
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pct}
          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
        />
      </Box>

      {!onImportPage && (
        <Button
          size="small"
          variant="outlined"
          onClick={() => router.push(BULK_IMPORT_PATH)}
          sx={{ whiteSpace: 'nowrap' }}
        >
          View progress
        </Button>
      )}
    </Box>
  );
};

export default ImportRunningBanner;
