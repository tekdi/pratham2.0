'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from './Footer';
import { getTenantInfo } from '@learner/utils/API/ProgramService';

interface TenantChild {
  domain?: string;
}

interface Tenant {
  children?: TenantChild[];
}

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();
  const [isPOSDomain, setIsPOSDomain] = useState<boolean | null>(null);

  useEffect(() => {
    const checkIfPOSDomain = async () => {
      try {
        const res = await getTenantInfo();
        const tenants = res?.result || [];
        const currentOrigin = window.location.origin;

        const allChildren = tenants.flatMap((t: Tenant) => t.children || []);
        const domainCount: Record<string, number> = {};
        allChildren.forEach((child: TenantChild) => {
          const d = child.domain?.replace(/\/$/, '');
          if (d) domainCount[d] = (domainCount[d] || 0) + 1;
        });

        // A dedicated single-tenant site (like POS) has exactly one child owning this domain.
        // Shared platforms (like PLP) have multiple children pointing to the same domain.
        setIsPOSDomain(domainCount[currentOrigin] === 1);
      } catch {
        setIsPOSDomain(false);
      }
    };

    checkIfPOSDomain();
  }, []);

  // Suppress main footer on /pos paths (local dev) or dedicated tenant domains (e.g. qa-pos).
  if (pathname?.startsWith('/pos') || isPOSDomain) {
    return null;
  }

  // Avoid rendering the footer strip before the domain check resolves.
  if (isPOSDomain === null) {
    return null;
  }

  return <Footer />;
};
