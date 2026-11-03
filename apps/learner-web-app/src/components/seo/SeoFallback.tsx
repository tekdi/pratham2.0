'use client';

import React, { useEffect, useState } from 'react';

/**
 * Renders its children in the server HTML, then removes them once the client
 * bundle mounts and the real widget takes over. The widget stays a direct
 * child of the page: `ssr: false` components cannot be passed through a
 * client boundary.
 */
export default function SeoFallback({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? null : <>{children}</>;
}
