'use client';

import React, { useState } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
} from '@shared-lib';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';

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

    const navLinks = [
      {
        title: t('LEARNER_APP.POS.ABOUT_US'),
        to: () => router.push('/pos/about-us'),
        isActive: currentPage === '/pos/about-us',
      },
      {
        title: t('LEARNER_APP.POS.SCHOOL'),
        to: () => router.push('/pos/school'),
        isActive: currentPage === '/pos/school',
      },
      {
        title: t('LEARNER_APP.POS.WORK'),
        to: () => router.push('/pos/work'),
        isActive: currentPage === '/pos/work',
      },
      {
        title: t('LEARNER_APP.POS.LIFE'),
        to: () => router.push('/pos/life'),
        isActive: currentPage === '/pos/life',
      },
      {
        title: t('LEARNER_APP.POS.PROGRAM'),
        to: () => router.push('/pos/program'),
        isActive: currentPage === '/pos/program',
      },
      {
        title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
        to: () => router.push('/pos/thematic-repository'),
        isActive: currentPage === '/pos/thematic-repository',
      },
    ];

    setDefaultNavLinks(navLinks);
  }, [t, router]);
  const onLanguageChange = (val: string) => {
    setLanguage(val);
  };
  return (
    <Layout
      // onlyHideElements={['footer']}
      {...props}
      _topAppBar={{
        isShowLang: false,
        _brand: {
          name: 'YouthNet',
          _box: {
            onClick: () => router.push('/content'),
            sx: {
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            },
            _text: {
              fontWeight: 400,
              fontSize: '22px',
              lineHeight: '28px',
              textAlign: 'center',
            },
          },
        },
        navLinks: defaultNavLinks,
        _navLinkBox: { gap: 5 },
        onLanguageChange,
        ...props?._topAppBar,
      }}
    >
      <Box>{children}</Box>
    </Layout>
  );
};

export default App;
