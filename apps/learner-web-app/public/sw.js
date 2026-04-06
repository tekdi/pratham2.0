/**
 * Service worker (origin-scoped): connectivity + offline tracking queue flush.
 * Queue: IndexedDB "tracking-db" / "tracking-store" — entries (non-__ keys) are JSON with createdAt + ContentCreate fields.
 * Auth URL: synced from page via postMessage (SW cannot read localStorage).
 */
const DB_NAME = 'tracking-db';
const STORE_NAME = 'tracking-store';
const RESERVED_PREFIX = '__';
const LOCK_KEY = '__sync_in_progress__';
const LOCK_STALE_MS = 120000;
const STATUS_INTERVAL_MS = 10000; // 10 seconds
/** Failed POST attempts per queue item before dropping it from the store. */
const MAX_FETCH_ATTEMPTS = 3;
const RETRY_DELAY_MS = 800;

/** Mirrors SW lock to page localStorage key (page must listen for TRACKING_SYNC_LOCK). */
const LS_IN_PROGRESS_KEY = 'trackingApiSyncInProgress';

let syncConfig = {
  contentCreateUrl: '',
  token: '',
  tenantId: '',
};

/** Prevents overlapping drains (interval / online / message won’t start another until this run finishes). */
let queueDrainRunning = false;

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseValue(raw) {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return typeof raw === 'object' ? raw : null;
}

function getCreatedAtMs(v) {
  if (!v || v.createdAt == null) return 0;
  const c = v.createdAt;
  if (typeof c === 'number' && Number.isFinite(c)) return c;
  const t = Date.parse(String(c));
  return Number.isFinite(t) ? t : 0;
}

/** Request body: full entry minus createdAt (API matches createContentTracking). */
function buildRequestBody(value) {
  if (!value || typeof value !== 'object') return null;
  const { createdAt, ...body } = value;
  return body;
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(DB_NAME);
    openReq.onerror = () => reject(openReq.error);
    openReq.onupgradeneeded = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    openReq.onsuccess = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close();
        reject(new Error('tracking-store missing'));
        return;
      }
      resolve(db);
    };
  });
}

function broadcastToClients(message) {
  return self.clients
    .matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      clients.forEach((client) => client.postMessage(message));
    });
}

function notifyTrackingLock(inProgress) {
  return broadcastToClients({
    type: 'TRACKING_SYNC_LOCK',
    inProgress,
    localStorageKey: LS_IN_PROGRESS_KEY,
  });
}

function getAllQueueEntries(db) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const list = [];
    const cursorReq = store.openCursor();
    cursorReq.onerror = () => reject(cursorReq.error);
    cursorReq.onsuccess = (e) => {
      const cursor = e.target.result;
      if (!cursor) {
        return;
      }
      const k = cursor.key;
      const keyStr = String(k);
      if (!keyStr.startsWith(RESERVED_PREFIX)) {
        const v = parseValue(cursor.value);
        if (v != null && v.createdAt != null) {
          list.push({ key: k, value: v });
        }
      }
      cursor.continue();
    };
    tx.oncomplete = () => resolve(list);
    tx.onerror = () => reject(tx.error);
  });
}

function idbGet(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

function idbPut(db, key, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

function idbDelete(db, key) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function runQueueSafely() {
  if (queueDrainRunning) return;
  queueDrainRunning = true;
  try {
    await processTrackingQueue();
  } finally {
    queueDrainRunning = false;
  }
}

/**
 * Drains the tracking queue while online: oldest first, sequential POSTs.
 * Each item: up to MAX_FETCH_ATTEMPTS tries; then the row is removed either way.
 */
async function processTrackingQueue() {
  if (!self.navigator.onLine) return;

  const url = syncConfig.contentCreateUrl;
  const token = syncConfig.token;
  if (!url || !token) {
    return;
  }

  let db;
  try {
    db = await openDatabase();
  } catch (e) {
    console.warn('[learner-sw] tracking DB open failed', e);
    return;
  }

  let weHoldLock = false;
  try {
    const lockVal = await idbGet(db, LOCK_KEY);
    if (lockVal && lockVal.v === true) {
      const at = lockVal.at;
      if (typeof at === 'number' && Date.now() - at < LOCK_STALE_MS) {
        return;
      }
      await idbDelete(db, LOCK_KEY);
      await notifyTrackingLock(false);
    }

    while (self.navigator.onLine) {
      const entries = await getAllQueueEntries(db);
      if (entries.length === 0) break;

      entries.sort((a, b) => getCreatedAtMs(a.value) - getCreatedAtMs(b.value));
      const { key, value } = entries[0];
      const body = buildRequestBody(value);
      if (!body || Object.keys(body).length === 0) {
        console.warn('[learner-sw] drop entry: empty body', key);
        await idbDelete(db, key);
        continue;
      }

      if (!weHoldLock) {
        await idbPut(db, LOCK_KEY, { v: true, at: Date.now() });
        weHoldLock = true;
        await notifyTrackingLock(true);
      } else {
        await idbPut(db, LOCK_KEY, { v: true, at: Date.now() });
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
      if (syncConfig.tenantId) {
        headers.tenantid = syncConfig.tenantId;
      }

      let ok = false;
      let lastErr = null;
      for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
        if (!self.navigator.onLine) break;
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          });
          if (res.ok) {
            ok = true;
            console.log('[learner-sw] tracking synced', key, 'attempt', attempt);
            break;
          }
          const text = await res.text().catch(() => '');
          lastErr = `${res.status} ${text}`;
          console.error(
            '[learner-sw] tracking API failed',
            key,
            'attempt',
            attempt,
            lastErr
          );
        } catch (err) {
          lastErr = err;
          console.error('[learner-sw] tracking fetch error', key, attempt, err);
        }
        if (attempt < MAX_FETCH_ATTEMPTS && self.navigator.onLine) {
          await delay(RETRY_DELAY_MS);
        }
      }

      await idbDelete(db, key);
      if (!ok) {
        console.warn(
          '[learner-sw] removed queue key after failed attempts',
          key,
          MAX_FETCH_ATTEMPTS,
          lastErr
        );
      }

      if (!self.navigator.onLine) break;
    }
  } catch (err) {
    console.error('[learner-sw] processTrackingQueue', err);
  } finally {
    if (weHoldLock) {
      try {
        await idbDelete(db, LOCK_KEY);
      } catch (_) {
        /* ignore */
      }
      await notifyTrackingLock(false);
    }
    try {
      db.close();
    } catch (_) {
      /* ignore */
    }
  }
}

function logAndBroadcastConnectivity(reason) {
  const online = self.navigator.onLine;
  const payload = {
    type: 'LEARNER_SW_STATUS',
    online,
    reason,
    time: new Date().toISOString(),
  };
  console.log('[learner-sw]', reason, 'navigator.onLine=', online);
  return broadcastToClients(payload);
}

async function intervalTick() {
  await logAndBroadcastConnectivity('interval');
  if (queueDrainRunning) return;
  await runQueueSafely();
}

self.addEventListener('install', () => {
  console.log('[learner-sw] install');
  self.skipWaiting();
});

let statusTimerId;

self.addEventListener('activate', (event) => {
  console.log('[learner-sw] activate');
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await logAndBroadcastConnectivity('activate');
      await runQueueSafely();
      if (statusTimerId) clearInterval(statusTimerId);
      statusTimerId = setInterval(() => {
        void intervalTick();
      }, STATUS_INTERVAL_MS);
    })()
  );
});

self.addEventListener('online', () => {
  logAndBroadcastConnectivity('online-event');
  void runQueueSafely();
});

self.addEventListener('offline', () => {
  logAndBroadcastConnectivity('offline-event');
});

function idbGetLegacyKeyval(key) {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open('keyval-store');
    openReq.onerror = () => reject(openReq.error);
    openReq.onupgradeneeded = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains('keyval')) {
        db.createObjectStore('keyval');
      }
    };
    openReq.onsuccess = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains('keyval')) {
        resolve(undefined);
        db.close();
        return;
      }
      try {
        const tx = db.transaction('keyval', 'readonly');
        const store = tx.objectStore('keyval');
        const getReq = store.get(key);
        getReq.onsuccess = () => {
          resolve(getReq.result);
          db.close();
        };
        getReq.onerror = () => {
          reject(getReq.error);
          db.close();
        };
      } catch (e) {
        reject(e);
        db.close();
      }
    };
  });
}

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SET_TRACKING_SYNC_CONFIG') {
    syncConfig = {
      contentCreateUrl: String(data.contentCreateUrl || ''),
      token: String(data.token || ''),
      tenantId: String(data.tenantId || ''),
    };
    console.log('[learner-sw] tracking config updated');
    void runQueueSafely();
    return;
  }

  if (data.type === 'IDB_GET' && data.key !== undefined && data.key !== null) {
    event.waitUntil(
      (async () => {
        try {
          const value = await idbGetLegacyKeyval(data.key);
          console.log('[learner-sw] IDB get', data.key, value);
          await broadcastToClients({
            type: 'LEARNER_SW_IDB_RESULT',
            key: data.key,
            value,
            time: new Date().toISOString(),
          });
        } catch (err) {
          console.error('[learner-sw] IDB get failed', data.key, err);
          await broadcastToClients({
            type: 'LEARNER_SW_IDB_ERROR',
            key: data.key,
            error: String(err),
            time: new Date().toISOString(),
          });
        }
      })()
    );
  }

  if (data.type === 'PING') {
    event.source?.postMessage({ type: 'PONG', time: new Date().toISOString() });
  }
});
