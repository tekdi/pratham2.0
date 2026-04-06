'use client';

import { useEffect } from 'react';

const SW_PATH = '/sw.js';

/** Must match shared-lib Interceptor (Bearer token). */
const TOKEN_STORAGE_KEY = 'token';
const TENANT_STORAGE_KEY = 'tenantId';

/** Must match `LS_IN_PROGRESS_KEY` in public/sw.js (page mirror of SW lock). */
export const TRACKING_API_SYNC_LS_KEY = 'trackingApiSyncInProgress';

function buildTrackingSyncPayload() {
  const base = process.env.NEXT_PUBLIC_MIDDLEWARE_URL || '';
  const contentCreateUrl = `${base.replace(/\/$/, '')}/tracking/content/create`;
  return {
    type: 'SET_TRACKING_SYNC_CONFIG' as const,
    contentCreateUrl,
    token: localStorage.getItem(TOKEN_STORAGE_KEY) || '',
    tenantId: localStorage.getItem(TENANT_STORAGE_KEY) || '',
  };
}

function pushTrackingConfig(registration: ServiceWorkerRegistration) {
  if (!registration.active) return;
  registration.active.postMessage(buildTrackingSyncPayload());
}

function requestIdbReadFromSw(registration: ServiceWorkerRegistration) {
  const key = process.env.NEXT_PUBLIC_SW_IDB_PROBE_KEY;
  if (!key || !registration.active) return;
  registration.active.postMessage({ type: 'IDB_GET', key });
}

/**
 * Registers the origin-scoped service worker, pushes auth + tracking API URL to the SW
 * (SW cannot read localStorage), and mirrors SW sync lock to localStorage.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    const onMessage = (event: MessageEvent) => {
      const d = event.data;
      if (!d || typeof d !== 'object') return;
      if (d.type === 'LEARNER_SW_STATUS') {
        console.log(
          '[learner-sw → page]',
          d.reason,
          'online=',
          d.online,
          d.time
        );
      }
      if (d.type === 'LEARNER_SW_IDB_RESULT') {
        console.log('[learner-sw → page] IDB', d.key, d.value, d.time);
      }
      if (d.type === 'LEARNER_SW_IDB_ERROR') {
        console.error(
          '[learner-sw → page] IDB error',
          d.key,
          d.error,
          d.time
        );
      }
      if (d.type === 'TRACKING_SYNC_LOCK') {
        const lsKey =
          typeof d.localStorageKey === 'string'
            ? d.localStorageKey
            : TRACKING_API_SYNC_LS_KEY;
        if (d.inProgress) {
          localStorage.setItem(lsKey, 'true');
        } else {
          localStorage.removeItem(lsKey);
        }
      }
    };

    navigator.serviceWorker.addEventListener('message', onMessage);

    const onStorage = (e: StorageEvent) => {
      if (e.key === TOKEN_STORAGE_KEY || e.key === TENANT_STORAGE_KEY) {
        void navigator.serviceWorker.ready.then(pushTrackingConfig);
      }
    };
    window.addEventListener('storage', onStorage);

    const onFocus = () => {
      void navigator.serviceWorker.ready.then(pushTrackingConfig);
    };
    window.addEventListener('focus', onFocus);

    let cancelled = false;
    let configIntervalId: ReturnType<typeof setInterval> | undefined;

    void navigator.serviceWorker
      .register(SW_PATH)
      .then(() => navigator.serviceWorker.ready)
      .then((registration) => {
        if (cancelled) return;
        pushTrackingConfig(registration);
        requestIdbReadFromSw(registration);
        configIntervalId = setInterval(() => {
          pushTrackingConfig(registration);
        }, 60000);
      })
      .catch((err) => {
        console.error('[learner-sw] registration failed', err);
      });

    return () => {
      cancelled = true;
      if (configIntervalId) clearInterval(configIntervalId);
      navigator.serviceWorker.removeEventListener('message', onMessage);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  return null;
}
