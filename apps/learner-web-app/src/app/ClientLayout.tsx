'use client';

import { useEffect } from 'react';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    telemetryFactory.init();
  }, []);

  return <>{children}</>;
}
