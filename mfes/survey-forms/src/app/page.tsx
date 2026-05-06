'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function IndexInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const tenantId = searchParams.get('tenantId');

    // Immediately strip sensitive params from the URL
    if (token || tenantId) {
      window.history.replaceState({}, '', '/');
    }

    if (token) {
      localStorage.setItem('token', token);
    }
    if (tenantId) {
      localStorage.setItem('tenantId', tenantId);
    }
    router.replace('/survey-list');
  }, [router, searchParams]);

  return null;
}

export default function Index() {
  return (
    <Suspense fallback={null}>
      <IndexInner />
    </Suspense>
  );
}
