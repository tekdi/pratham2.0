import { useEffect } from 'react';
import Router from 'next/router';
import { installChunkErrorReload, isChunkLoadError, reloadOnce } from './chunkReloadGuard';

/**
 * For Pages Router apps: covers the same stale-build chunk failures as
 * `installChunkErrorReload`, plus Next's client-side navigation path, which surfaces chunk
 * failures via `routeChangeError` rather than a window-level error event.
 */
export function useChunkErrorReload() {
  useEffect(() => {
    installChunkErrorReload();

    const handleRouteChangeError = (error: unknown) => {
      if (isChunkLoadError(error)) reloadOnce();
    };

    Router.events.on('routeChangeError', handleRouteChangeError);
    return () => {
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, []);
}
