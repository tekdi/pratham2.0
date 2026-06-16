'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();

  const isPOSDomain = typeof window !== 'undefined' &&
    window.location.hostname.includes('pos.prathamdigital');

  if (pathname?.startsWith('/pos') || isPOSDomain) {
    return null;
  }

  return <Footer />;
};
