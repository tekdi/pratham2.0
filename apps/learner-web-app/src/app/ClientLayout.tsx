'use client';

import React, { useEffect } from 'react';
import { FontSizeProvider } from '../context/FontSizeContext';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    telemetryFactory.init();
  }, []);

  return <FontSizeProvider>{children}</FontSizeProvider>;
}
