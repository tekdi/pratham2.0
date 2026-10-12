'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TenantName } from '@learner/utils/app.constant';
import { useUserProgram } from '@learner/utils/hooks/useUserProgram';
import {
  extractAssessmentIds,
  getActiveVtBatch,
  VtBatch,
} from '@learner/utils/helpers/vtBatchHelper';

// Mobile (`useActiveBatchEligibility`) re-checks every 3 seconds while focused so
// the tab appears/disappears as soon as a batch is assigned or removed. Same here.
const POLL_INTERVAL_MS = 3000;

export interface VtAssessmentEligibility {
  loading: boolean;
  eligible: boolean;
  batch: VtBatch | null;
  assessmentIds: string[];
  refresh: () => void;
}

/**
 * Active-batch eligibility for the Vocational Training Assessment feature.
 *
 * Inert for every other program: no timer, no listener, no API call — so SCP,
 * Pragyanpath, Camp to Club and public users are untouched.
 */
export const useVtAssessmentEligibility = (
  enabled = true
): VtAssessmentEligibility => {
  const userProgram = useUserProgram();
  const isVt = enabled && userProgram === TenantName.YOUTHNET;

  const [batch, setBatch] = useState<VtBatch | null>(null);
  // Which program the current `batch` was resolved for. `loading` is derived from
  // it rather than being its own state flag: useUserProgram's server snapshot is
  // null, so on the hydration render `isVt` flips from false to true, and a
  // stored flag would still read "not loading" for that one render — long enough
  // for the page shell to bounce an eligible learner to the landing page.
  const [resolvedFor, setResolvedFor] = useState<string | null>(null);
  const loading = isVt && resolvedFor !== userProgram;

  // A tick that lands while the previous request is still open is dropped rather
  // than queued, so a slow network can never pile up overlapping checks.
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    if (!isVt) {
      setBatch(null);
      return;
    }
    if (inFlightRef.current) return;

    const userId =
      typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    if (!userId) {
      setBatch(null);
      setResolvedFor(userProgram);
      return;
    }

    inFlightRef.current = true;
    try {
      const activeBatch = await getActiveVtBatch(userId, {
        programKey: userProgram ?? '',
      });
      if (mountedRef.current) setBatch(activeBatch);
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) setResolvedFor(userProgram);
    }
  }, [isVt, userProgram]);

  useEffect(() => {
    if (!isVt) {
      setBatch(null);
      return;
    }

    refresh();

    let intervalId: ReturnType<typeof setInterval> | null = null;

    const stopPolling = () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const startPolling = () => {
      if (intervalId !== null) return;
      intervalId = setInterval(refresh, POLL_INTERVAL_MS);
    };

    // Only poll while the tab is actually being looked at — a backgrounded tab
    // would otherwise keep hitting /cohort/mycohorts every 3 seconds forever.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopPolling();
      } else {
        refresh();
        startPolling();
      }
    };

    if (document.visibilityState !== 'hidden') startPolling();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', refresh);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', refresh);
    };
  }, [isVt, refresh]);

  return {
    loading,
    // Never report a stale batch from a program the learner just switched away
    // from: while `loading` is true the batch belongs to a different program.
    eligible: isVt && !loading && Boolean(batch),
    batch,
    assessmentIds: extractAssessmentIds(batch),
    refresh,
  };
};

export default useVtAssessmentEligibility;
