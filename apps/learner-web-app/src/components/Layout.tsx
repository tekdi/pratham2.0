'use client';

import React, { useState } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
} from '@shared-lib';
import { AccountBox, Explore, Home, Summarize } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}
const App: React.FC<LayoutProps> = ({ children, ...props }) => {
  const router = useRouter();
  const { t, setLanguage } = useTranslation();
  const [defaultNavLinks, setDefaultNavLinks] = useState<NewDrawerItemProp[]>(
    []
  );

  React.useEffect(() => {
    const currentPage =
      typeof window !== 'undefined' && window.location.pathname
        ? window.location.pathname
        : '';

    setDefaultNavLinks([
      {
        title: t('LEARNER_APP.COMMON.L1_COURSES'),
        icon: <Home />,
        to: () => router.push('/content'),
        isActive: currentPage === '/content',
      },
      {
        title: t('LEARNER_APP.COMMON.EXPLORE'),
        icon: <Explore />,
        to: () => router.push('/explore'),
        isActive: currentPage === '/explore',
      },
      {
        title: t('LEARNER_APP.COMMON.SURVEYS'),
        icon: <Summarize />,
        to: () => router.push('/content'),
        isActive: currentPage === '/content',
      },
      {
        title: t('LEARNER_APP.COMMON.PROFILE'),
        icon: <AccountBox />,
        to: () => router.push('/profile'),
        isActive: currentPage === '/content',
      },
    ]);
  }, [t, router]);
  const onLanguageChange = (val: string) => {
    setLanguage(val);
  };
  return (
    <Layout
      onlyHideElements={['footer']}
      {...props}
      _topAppBar={{
        navLinks: defaultNavLinks,
        _navLinkBox: { gap: 5 },
        onLanguageChange,
        ...props?._topAppBar,
      }}
    >
      {children}
    </Layout>
  );
};

export default App;
