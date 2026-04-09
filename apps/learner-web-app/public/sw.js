/**
 * Service worker (origin-scoped): connectivity + offline tracking queue flush.
 * Queue: IndexedDB "tracking-db" / "tracking-store" — entries (non-__ keys) are JSON with createdAt + ContentCreate fields.
 * Auth URL + userId: synced from page via postMessage (SW cannot read localStorage).
 * Queue rows are processed only when userId is set and the IDB key string includes that userId.
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
  courseStatusUrl: '',
  userCertificateStatusUpdateUrl: '',
  authUrl: '',
  userCertificateStatusGetUrl: '',
  courseHierarchyUrl: '',
  issueCertificateUrl: '',
  assessmentStatusUrl: '',
  token: '',
  tenantId: '',
  /** From page localStorage key `userId`; only queue keys containing this substring are synced. */
  userId: '',
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
  const { createdAt, configFunctionality, extraObject, ...body } = value;
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
  const userIdFilter = syncConfig.userId;
  if (!userIdFilter) {
    return Promise.resolve([]);
  }
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
        if (!keyStr.includes(userIdFilter)) {
          cursor.continue();
          return;
        }
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
  const courseStatusUrl = syncConfig.courseStatusUrl;
  const userCertificateStatusUpdateUrl =
    syncConfig.userCertificateStatusUpdateUrl;
  const authUrl = syncConfig.authUrl;
  const userCertificateStatusGetUrl = syncConfig.userCertificateStatusGetUrl;
  const courseHierarchyUrl = syncConfig.courseHierarchyUrl;
  const issueCertificateUrl = syncConfig.issueCertificateUrl;
  const assessmentStatusUrl = syncConfig.assessmentStatusUrl;
  const token = syncConfig.token;
  if (
    !url ||
    !token ||
    !syncConfig.userId ||
    !courseStatusUrl ||
    !userCertificateStatusUpdateUrl ||
    !authUrl ||
    !userCertificateStatusGetUrl ||
    !courseHierarchyUrl ||
    !issueCertificateUrl ||
    !assessmentStatusUrl
  ) {
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
      for (const entry of entries) {
        const { key, value } = entry;
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
        // Only retry the tracking POST when the response is not OK or fetch throws.
        // Certificate / course-status work runs at most once after a successful POST.
        for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt++) {
          if (!self.navigator.onLine) break;
          try {
            const res = await fetch(url, {
              method: 'POST',
              headers,
              body: JSON.stringify(body),
            });

            if (!res.ok) {
              const text = await res.text().catch(() => '');
              lastErr = `${res.status} ${text}`;
              console.error(
                '[learner-sw] tracking API failed',
                key,
                'attempt',
                attempt,
                lastErr
              );
              if (attempt < MAX_FETCH_ATTEMPTS && self.navigator.onLine) {
                await delay(RETRY_DELAY_MS);
              }
              continue;
            }

            const response = await res.json();

            try {
              if (
                response &&
                value?.configFunctionality?.isGenerateCertificate !== false &&
                value?.extraObject?.course &&
                value?.extraObject?.unitId
              ) {
                await updateCOurseAndIssueCertificate({
                  userId: syncConfig.userId,
                  course: value?.extraObject?.course,
                  unitId: value?.extraObject?.unitId,
                  isGenerateCertificate:
                    value?.configFunctionality?.isGenerateCertificate,
                });
              }
            } catch (certErr) {
              console.error(
                '[learner-sw] certificate / course flow failed (queue item still cleared)',
                key,
                certErr
              );
            }

            ok = true;
            console.log(
              '[learner-sw] tracking synced',
              key,
              'attempt',
              attempt
            );
            break;
          } catch (err) {
            lastErr = err;
            console.error(
              '[learner-sw] tracking fetch error',
              key,
              'attempt',
              attempt,
              err
            );
            if (attempt < MAX_FETCH_ATTEMPTS && self.navigator.onLine) {
              await delay(RETRY_DELAY_MS);
            }
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

//certificate issue function
async function updateCOurseAndIssueCertificate({
  course,
  userId,
  unitId,
  isGenerateCertificate,
}) {
  const apiUrl = syncConfig?.courseStatusUrl;
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${syncConfig.token}`,
        ...(syncConfig.tenantId && { tenantid: syncConfig.tenantId }),
      },
      body: JSON.stringify({
        courseId: [course?.identifier],
        userId: [userId],
      }),
    });
    const response = await res.json();

    const courseStatus = await calculateCourseStatus({
      statusData: response?.data?.[0]?.course?.[0],
      allCourseIds: course.leafNodes ?? [],
      courseId: course?.identifier,
    });

    if (courseStatus?.status === 'in progress') {
      await updateUserCourseStatus({
        userId,
        courseId: course?.identifier,
        status: 'inprogress',
      });
    } else if (courseStatus?.status === 'completed' && isGenerateCertificate) {
      const data = await fetchCertificateStatus({
        userId: userId,
        courseId: course?.identifier,
      });
      if (data !== 'viewCertificate') {
        const userResponse = await getUserId();
        const responseCriteria = await checkCriteriaForCertificate({
          userId: userId,
          courseId: course?.identifier,
        });
        if (responseCriteria === true) {
          try {
            await issueCertificate({
              userId: userId,
              courseId: course?.identifier,
              unitId: unitId,
              issuanceDate: new Date().toISOString(),
              expirationDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 20)
              ).toISOString(),
              // credentialId: data?.result?.usercertificateId,
              firstName: userResponse?.firstName ?? '',
              middleName: userResponse?.middleName ?? '',
              lastName: userResponse?.lastName ?? '',
              courseName: course?.name ?? '',
            });
          } catch (error) {
            await updateUserCourseStatus({
              userId,
              courseId: course?.identifier,
              status: 'completed',
            });
          }
        } else if (data !== 'completed') {
          await updateUserCourseStatus({
            userId,
            courseId: course?.identifier,
            status: 'completed',
          });
        }
      }
    } else if (courseStatus?.status != 'not started') {
      await updateUserCourseStatus({
        userId,
        courseId: course?.identifier,
        status: 'completed',
      });
    }
  } catch (error) {
    console.error('Error in updateCOurseAndIssueCertificate:', error);
    throw error;
  }
}
async function calculateCourseStatus({ statusData, allCourseIds, courseId }) {
  const completedList = new Set(statusData?.completed_list || []);
  const inProgressList = new Set(statusData?.in_progress_list || []);

  let completedCount = 0;
  let inProgressCount = 0;
  const completed_list = [];
  const in_progress_list = [];

  for (const id of allCourseIds) {
    if (completedList.has(id)) {
      completedCount++;
      completed_list.push(id);
    } else if (inProgressList.has(id)) {
      inProgressCount++;
      in_progress_list.push(id);
    }
  }

  const total = allCourseIds.length;
  let status = 'not started';

  if (completedCount === total && total > 0) {
    status = 'completed';
  } else if (completedCount > 0 || inProgressCount > 0) {
    status = 'in progress';
  }

  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return {
    completed_list,
    in_progress_list,
    completed: completedCount,
    in_progress: inProgressCount,
    courseId,
    status,
    percentage: percentage,
  };
}
async function updateUserCourseStatus({ userId, courseId, status }) {
  const apiUrl = syncConfig?.userCertificateStatusUpdateUrl;
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${syncConfig.token}`,
        ...(syncConfig.tenantId && { tenantid: syncConfig.tenantId }),
      },
      body: JSON.stringify({
        userId,
        courseId,
        status,
      }),
    });
    const response = await res.json();
    return response?.data?.result;
  } catch (error) {
    console.error('error in updating user course status', error);
    throw error;
  }
}
async function getUserId() {
  const apiUrl = syncConfig?.authUrl;

  try {
    const token = syncConfig.token;
    if (!token) {
      throw new Error('Authorization token not found');
    }

    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await res.json();

    return response?.data?.result;
  } catch (error) {
    console.error('Error in fetching user details', error);
    throw error;
  }
}
async function fetchCertificateStatus({ userId, courseId }) {
  try {
    const res = await fetch(syncConfig?.userCertificateStatusGetUrl, {
      method: 'POST',
      body: JSON.stringify({ userId, courseId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${syncConfig.token}`,
        ...(syncConfig.tenantId && { tenantid: syncConfig.tenantId }),
      },
    });
    const response = await res.json();
    const status = response?.result?.status;
    return status || 'No status found';
  } catch (error) {
    console.error('API call failed:', error);
    // return { error: error.message };
  }
}
async function checkCriteriaForCertificate(reqBody) {
  const userId = reqBody?.userId;
  const courseId = reqBody?.courseId;
  const apiUrl = syncConfig?.courseHierarchyUrl + courseId;

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${syncConfig.token}`,
        ...(syncConfig.tenantId && { tenantid: syncConfig.tenantId }),
      },
    });
    const response = await res.json();
    if (Object.keys(response?.result?.content).length > 0) {
      const content = response?.result?.content;

      // Extract question set identifiers with their parent unit IDs
      const questionSetData = [];

      function extractQuestionSets(node, parentId) {
        // Check if current node is a question set
        if (node.mimeType === 'application/vnd.sunbird.questionset') {
          questionSetData.push({
            contentId: node.identifier,
            unitId: parentId || node.parent || '',
          });
        }

        // Recursively traverse children if they exist
        if (node.children && Array.isArray(node.children)) {
          node.children.forEach((child) => {
            // Pass the current node's identifier as parent for its children
            extractQuestionSets(child, node.identifier);
          });
        }
      }

      // Start extraction from the root content
      extractQuestionSets(content);

      console.log('Question Set Data:', questionSetData);

      //tenantId
      const tenantId = syncConfig.tenantId;
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${syncConfig.token}`,
        ...(syncConfig.tenantId && { tenantid: syncConfig.tenantId }),
      };

      // You can now use questionSetData array for further processing
      // Example output: [{contentId: "do_214302433656496128152", unitId: "do_214373529013116928121"}]

      // Add your additional logic here using questionSetData
      if (questionSetData.length > 0) {
        // Process each question set data
        let criteriaCompleted = false;
        let statusUrl = syncConfig.assessmentStatusUrl;
        // Collect all contentIds and unitIds
        const contentIds = questionSetData.map((item) => item.contentId);
        const unitIds = questionSetData.map((item) => item.unitId);
        const options = {
          userId: [userId],
          courseId: [courseId], // temporary added here assessmentList(contentId)... if assessment is done then need to pass actual course id and unit id here
          unitId: unitIds,
          contentId: contentIds,
        };
        const res = await fetch(statusUrl, {
          method: 'POST',
          body: JSON.stringify(options),
          headers: headers,
        });
        const response = await res.json();

        if (response?.data?.length > 0) {
          // Filter data for specific userId
          const userData = response?.data.find(
            (item) => item.userId === userId
          );

          if (userData) {
            const assessments = userData?.assessments || [];

            // Check if all contentIds are present in the response
            const foundContentIds = assessments.map(
              (assessment) => assessment.contentId
            );
            const allContentIdsFound = contentIds.every((contentId) =>
              foundContentIds.includes(contentId)
            );

            if (allContentIdsFound) {
              // Check if all assessments have percentage >= 40%
              const allPassed = assessments.every((assessment) => {
                const percentage = parseFloat(assessment.percentage);
                //percentage comparison from program specific configuration
                let percentageComparision = 40;
                if (tenantId === '914ca990-9b45-4385-a06b-05054f35d0b9') {
                  percentageComparision = 80;
                }
                return percentage >= percentageComparision;
              });

              criteriaCompleted = allPassed;
            } else {
              criteriaCompleted = false;
            }
          } else {
            criteriaCompleted = false;
          }
        } else {
          criteriaCompleted = false;
        }

        if (criteriaCompleted) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
async function issueCertificate(reqBody) {
  const apiUrl = syncConfig.issueCertificateUrl;
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      body: JSON.stringify(reqBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${syncConfig.token}`,
        ...(syncConfig.tenantId && { tenantid: syncConfig.tenantId }),
      },
    });
    const response = await res.json();
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
//end certificate issue function

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
      courseStatusUrl: String(data.courseStatusUrl || ''),
      userCertificateStatusUpdateUrl: String(
        data.userCertificateStatusUpdateUrl || ''
      ),
      authUrl: String(data.authUrl || ''),
      userCertificateStatusGetUrl: String(
        data.userCertificateStatusGetUrl || ''
      ),
      courseHierarchyUrl: String(data.courseHierarchyUrl || ''),
      issueCertificateUrl: String(data.issueCertificateUrl || ''),
      assessmentStatusUrl: String(data.assessmentStatusUrl || ''),
      token: String(data.token || ''),
      tenantId: String(data.tenantId || ''),
      userId: String(data.userId || ''),
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
