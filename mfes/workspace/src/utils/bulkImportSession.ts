// ============================================================
// BULK IMPORT — GLOBAL SESSION STORE
// Pratham 2.0 — Workspace MFE
//
// The import used to live in `useRef` inside BulkImportStepper. Navigating to
// another menu item unmounted that component, which threw away the queue and
// orphaned every in-flight request — users had to start the whole import over.
//
// This module owns the queue and the session OUTSIDE React. It is a plain
// module-level singleton, so it survives route changes for as long as the tab
// is alive. Components subscribe via `useSyncExternalStore` and simply render
// whatever the store currently holds; mounting and unmounting no longer has any
// effect on a running import.
//
// Scope (Tier 1): survives in-app navigation and tab switching.
// NOT covered: a full page refresh or closing the tab — that needs the job
// graph persisted to IndexedDB (Tier 2).
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import { BulkImportQueue } from './bulkImportQueue';
import {
  ImportSession,
  ParsedImportData,
  ImportProgress,
} from '../types/bulkImport.types';

// ─── Shape exposed to components ─────────────────────────────

export interface BulkImportState {
  /** Which stepper step is showing (0-5) */
  activeStep: number;
  session: ImportSession;
  parseError: string | null;
  /** True while the queue is actively processing jobs */
  isRunning: boolean;
}

const freshSession = (): ImportSession => ({
  id: uuidv4(),
  fileName: '',
  uploadedAt: 0,
  phase: 'idle',
  parsedData: null,
  validationResult: null,
  progress: null,
  resolvedIds: {},
});

const initialState = (): BulkImportState => ({
  activeStep: 0,
  session: freshSession(),
  parseError: null,
  isRunning: false,
});

// ─── Store internals ─────────────────────────────────────────

let state: BulkImportState = initialState();
let queue: BulkImportQueue | null = null;

const listeners = new Set<() => void>();

/**
 * Replace state with a new object identity and notify subscribers.
 * A new object every time is required — useSyncExternalStore compares by
 * reference to decide whether to re-render.
 */
const setState = (patch: Partial<BulkImportState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

// ─── Subscription API (useSyncExternalStore contract) ────────

export const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getSnapshot = (): BulkImportState => state;

/**
 * Server snapshot for SSR. Next.js renders this page on the server, where the
 * store is meaningless — return a stable object so React doesn't loop, and let
 * the client take over on hydration.
 */
const serverState = initialState();
export const getServerSnapshot = (): BulkImportState => serverState;

// ─── Actions ─────────────────────────────────────────────────

export const setActiveStep = (activeStep: number) => setState({ activeStep });

export const setParseError = (parseError: string | null) => setState({ parseError });

export const setPhase = (phase: ImportSession['phase']) =>
  setState({ session: { ...state.session, phase } });

export const setFileMeta = (fileName: string) =>
  setState({
    session: {
      ...state.session,
      fileName,
      uploadedAt: Date.now(),
      phase: 'parsing',
    },
  });

export const setParsedData = (parsedData: ParsedImportData) =>
  setState({
    session: { ...state.session, parsedData, phase: 'previewing' },
  });

export const setValidationResult = (
  validationResult: ImportSession['validationResult']
) =>
  setState({
    session: { ...state.session, validationResult, phase: 'validating' },
  });

/**
 * Kick off the import. Safe to call once per session — if a run is already in
 * flight this is a no-op, so a double click (or a remount that re-fires an
 * effect) can never start a second queue over the same data.
 */
export const startImport = async (): Promise<void> => {
  if (state.isRunning) return;
  const parsedData = state.session.parsedData;
  if (!parsedData) return;

  const q = new BulkImportQueue();
  q.buildJobs(parsedData);
  queue = q;

  setState({
    isRunning: true,
    activeStep: 4,
    session: { ...state.session, phase: 'importing' },
  });

  // Progress updates flow into the store, not into component state, so they
  // keep arriving while the user is on a different screen.
  q.onProgress((progress: ImportProgress) => {
    setState({ session: { ...state.session, progress } });
  });

  try {
    const finalProgress = await q.run();

    setState({
      isRunning: false,
      activeStep: 5,
      session: {
        ...state.session,
        phase:
          finalProgress.failedJobs > 0 && finalProgress.completedJobs > 0
            ? 'partial'
            : finalProgress.failedJobs > 0
            ? 'failed'
            : 'completed',
        progress: finalProgress,
        resolvedIds: q.getResolvedIds(),
      },
    });
  } catch (err) {
    // run() is defensive internally; this is a last-resort guard so a thrown
    // error can never leave isRunning stuck true and block all future imports.
    console.error('[bulk-import] Queue run failed:', err);
    setState({
      isRunning: false,
      session: { ...state.session, phase: 'failed' },
    });
  }
};

export const abortImport = () => {
  queue?.abort();
};

export const resetSession = () => {
  queue = null;
  state = initialState();
  listeners.forEach((l) => l());
};

/**
 * True when an import is mid-flight. Used by the app-level banner and the
 * navigation guards to decide whether leaving is destructive.
 */
export const isImportRunning = (): boolean => state.isRunning;
