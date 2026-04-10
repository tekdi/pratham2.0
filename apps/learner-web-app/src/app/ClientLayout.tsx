'use client';

import React, { useEffect } from 'react';
import { FontSizeProvider } from '../context/FontSizeContext';
import { UnderlineLinksProvider } from '../context/UnderlineLinksContext';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';
import ServiceWorkerRegister from '@learner/components/ServiceWorkerRegister/ServiceWorkerRegister';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    telemetryFactory.init();
  }, []);

  return (
    <FontSizeProvider>
      <ServiceWorkerRegister />
      <UnderlineLinksProvider>{children}</UnderlineLinksProvider>
    </FontSizeProvider>
  );
}
