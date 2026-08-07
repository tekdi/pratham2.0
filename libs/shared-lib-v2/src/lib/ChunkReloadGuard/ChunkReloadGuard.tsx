'use client';

import { useEffect } from 'react';
import { installChunkErrorReload } from '../../hooks/chunkReloadGuard';

/** App Router equivalent of `useChunkErrorReload` — mount once near the root layout. */
export default function ChunkReloadGuard() {
  useEffect(() => {
    installChunkErrorReload();
  }, []);

  return null;
}
