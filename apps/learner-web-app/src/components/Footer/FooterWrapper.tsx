'use client';

import { usePathname } from 'next/navigation';
import { Footer } from './Footer';

export const FooterWrapper: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/pos')) {
    return null;
  }

  return <Footer />;
};
