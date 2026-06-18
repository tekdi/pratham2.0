'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

const POS_HOSTNAMES = [
  'qa-pos.prathamdigital.org',
  'dev-pos.prathamdigital.org',
  'prathamopenschool.org',
  'pos.prathamdigital.org',
];

const THEMANTIC_HOSTNAMES = [
  'qa-themantic.prathamdigital.org',
  'dev-themantic.prathamdigital.org',
  'experimentoindia.prathamopenschool.org',
];

// Matches exact hostname or any subdomain (e.g. www.qa-pos.prathamdigital.org).
// This covers http/https and www variants without listing each combination explicitly.
const matchesHostname = (hostname: string, list: string[]): boolean =>
  list.some((h) => hostname === h || hostname.endsWith(`.${h}`));

const isPOSDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return matchesHostname(hostname, POS_HOSTNAMES);
};

const isThematicDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  const hostname = window.location.hostname;
  return matchesHostname(hostname, THEMANTIC_HOSTNAMES);
};

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();

  if (
    pathname?.startsWith('/pos') ||
    pathname?.startsWith('/themantic') ||
    isPOSDomain() ||
    isThematicDomain()
  ) {
    return null;
  }

  return <Footer />;
};
