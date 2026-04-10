/**
 * IndexedDB key/value helpers without third-party deps.
 * Ensures database and object store exist before read/write (creates store on upgrade; bumps version if needed).
 *
 * DB / store names must match the learner service worker tracking queue (apps/learner-web-app public sw).
 */
export const DB_NAME = 'tracking-db';
export const STORE_NAME = 'tracking-store';

/**
 * Opens {@link DB_NAME} and guarantees {@link STORE_NAME} exists (onupgradeneeded or version bump).
 */
export function openCustomIdbStore(): Promise<IDBDatabase> {
  const open = (version?: number): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
      const request =
        version != null
          ? indexedDB.open(DB_NAME, version)
          : indexedDB.open(DB_NAME);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => {
        const db = request.result;
        if (db.objectStoreNames.contains(STORE_NAME)) {
          resolve(db);
          return;
        }
        const nextVersion = db.version + 1;
        db.close();
        open(nextVersion).then(resolve, reject);
      };
    });

  return open();
}

export async function customStoreGet(key: IDBValidKey): Promise<unknown> {
  const db = await openCustomIdbStore();
  try {
    return await new Promise<unknown>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
    });
  } finally {
    db.close();
  }
}

export async function customStoreSet(
  key: IDBValidKey,
  value: unknown
): Promise<void> {
  const db = await openCustomIdbStore();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export async function customStoreRemove(key: IDBValidKey): Promise<void> {
  const db = await openCustomIdbStore();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/** Returns {@link customStoreGet} / {@link customStoreSet} / {@link customStoreRemove} for the default tracking store. */
export function createCustomStore() {
  return {
    get: (key: IDBValidKey) => customStoreGet(key),
    store: (key: IDBValidKey, value: unknown) => customStoreSet(key, value),
    remove: (key: IDBValidKey) => customStoreRemove(key),
  };
}
