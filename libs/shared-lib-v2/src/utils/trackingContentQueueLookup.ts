import { openCustomIdbStore, STORE_NAME } from './customIdbStore';

const RESERVED_PREFIX = '__';
const USER_ID_STORAGE_KEY = 'userId';

function parseStoredValue(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  if (typeof raw === 'string') {
    try {
      const o = JSON.parse(raw) as unknown;
      return typeof o === 'object' && o !== null
        ? (o as Record<string, unknown>)
        : null;
    } catch {
      return null;
    }
  }
  if (typeof raw === 'object') return raw as Record<string, unknown>;
  return null;
}

function valueMatchesContentParam(
  obj: Record<string, unknown> | null,
  content_id: string
): boolean {
  if (!obj) return false;
  const needle = String(content_id);
  for (const k of ['contentId', 'courseId', 'unitId'] as const) {
    const v = obj[k];
    if (v !== undefined && String(v) === needle) {
      return true;
    }
  }
  return false;
}

/**
 * Returns whether the tracking queue (IndexedDB via {@link openCustomIdbStore}) has any row where:
 * - the object store key string includes `localStorage.userId`, and
 * - the stored JSON has `contentId`, `courseId`, or `unitId` equal to `content_id`.
 *
 * Aligns with learner service worker queue rules (skips `__*` keys).
 */
export async function hasQueuedTrackingForContentId(
  content_id: string
): Promise<boolean> {
  if (typeof window === 'undefined' || !content_id) {
    return false;
  }

  const userId = localStorage.getItem(USER_ID_STORAGE_KEY);
  if (!userId) {
    return false;
  }

  const db = await openCustomIdbStore();
  try {
    return await new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onerror = () => reject(req.error);
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue | null>)
          .result;
        if (!cursor) {
          resolve(false);
          return;
        }
        const keyStr = String(cursor.key);
        if (keyStr.startsWith(RESERVED_PREFIX)) {
          cursor.continue();
          return;
        }
        if (!keyStr.includes(userId)) {
          cursor.continue();
          return;
        }
        const obj = parseStoredValue(cursor.value);
        if (valueMatchesContentParam(obj, content_id)) {
          resolve(true);
          return;
        }
        cursor.continue();
      };
    });
  } finally {
    db.close();
  }
}
