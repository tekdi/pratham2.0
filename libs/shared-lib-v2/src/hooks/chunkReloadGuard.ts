/**
 * Recovers from stale-build chunk-load failures after a redeploy: when a browser tab stays
 * open across a deploy, the container serving it is replaced with a new Next.js build ID, so
 * any later chunk fetch for the old build 404s (webpack ChunkLoadError / "Failed to fetch
 * dynamically imported module"). A single full reload picks up the current build instead of
 * leaving the app in a broken state.
 */
const RELOAD_GUARD_KEY = '__chunk_reload_attempted__';

const CHUNK_ERROR_PATTERN =
  /ChunkLoadError|Loading chunk [\w-]+ failed|Failed to fetch dynamically imported module/i;

function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const name = (error as { name?: string })?.name ?? '';
  const message = (error as { message?: string })?.message ?? String(error);
  return CHUNK_ERROR_PATTERN.test(name) || CHUNK_ERROR_PATTERN.test(message);
}

function reloadOnce() {
  if (typeof window === 'undefined') return;
  if (window.sessionStorage.getItem(RELOAD_GUARD_KEY)) return;
  window.sessionStorage.setItem(RELOAD_GUARD_KEY, '1');
  window.location.reload();
}

let installed = false;

/** Idempotent: safe to call from every app's entry point without double-registering listeners. */
export function installChunkErrorReload() {
  if (typeof window === 'undefined' || installed) return;
  installed = true;

  window.addEventListener('error', (event) => {
    if (isChunkLoadError(event.error)) reloadOnce();
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) reloadOnce();
  });
}

export { isChunkLoadError, reloadOnce };
