'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initGA, logPageView } from '../../utils/googleAnalytics';

declare global {
  interface Window {
    GA_INITIALIZED?: boolean;
  }
}

const GoogleAnalyticsTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(`${process.env.NEXT_PUBLIC_MEASUREMENT_ID_ADMIN}`);
      window.GA_INITIALIZED = true;
    }
    logPageView(pathname);
  }, [pathname]);

  return null;
};

export default GoogleAnalyticsTracker;
