'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, logPageView, hasDoId } from '../../utils/googleAnalytics';

declare global {
  interface Window {
    GA_INITIALIZED?: boolean;
  }
}

const TENANT_WAIT_MS = 5000;

const getTenantId = () => {
  try {
    return localStorage.getItem('tenantId');
  } catch (e) {
    return null;
  }
};

// GlobalProvider writes tenantId only after its start-up call, then reloads the
// page. Firing before that sends a page view whose name lookup fails (course_name
// arrives as "(not set)") and the reload sends a duplicate hit for the same view.
const waitForTenantId = () =>
  new Promise<number>((resolve) => {
    if (getTenantId()) {
      resolve(0);
      return;
    }
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      if (getTenantId() || elapsed >= TENANT_WAIT_MS) {
        clearInterval(timer);
        resolve(elapsed);
      }
    }, 100);
  });

const GoogleAnalyticsTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.GA_INITIALIZED) {
      console.log('Cleaned URL:', window.location.pathname.replace(/^\//, ''));
      if (window.location.href.includes('experimentoindia')) {
        console.log('Initializing GA for Themantic');
        initGA(`${process.env.NEXT_PUBLIC_MEASUREMENT_ID_THEMATIC}`);
      } else if (window.location.href.includes('plp')) {
        console.log('Initializing GA for PLP or PDP');
        initGA(`${process.env.NEXT_PUBLIC_MEASUREMENT_ID_PLP}`);
      } else {
        console.log('Initializing GA for POS');
        initGA(`${process.env.NEXT_PUBLIC_MEASUREMENT_ID_POS}`);
      }
      window.GA_INITIALIZED = true;
    }

    console.log(pathname, 'pathname');
    const page = pathname === '/themantic' ? '/' : pathname;

    // Only content routes need the tenant; everything else reports immediately.
    if (!hasDoId(window.location.pathname)) {
      logPageView(page);
      return;
    }

    let cancelled = false;
    waitForTenantId().then((waitedMs) => {
      console.log('[GA] tenantId ready after', waitedMs, 'ms; tenantId:', getTenantId());
      if (!cancelled) logPageView(page);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return null;
};

export default GoogleAnalyticsTracker;
