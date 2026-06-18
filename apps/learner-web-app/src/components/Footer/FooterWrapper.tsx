'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

const POS_ORIGINS = [
  'https://qa-pos.prathamdigital.org',
  'https://dev-pos.prathamdigital.org',
  'https://www.prathamopenschool.org',
  'https://pos.prathamdigital.org/',
];

const isPOSDomain = (): boolean => {
  if (typeof window === 'undefined') return false;
  return POS_ORIGINS.includes(window.location.origin);
};

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/pos') || isPOSDomain()) {
    return null;
  }

  return <Footer />;
};
