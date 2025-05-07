'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
} from '@shared-lib';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import POSMuiThemeProvider from '@learner/assets/theme/POSMuiThemeProvider';

interface NewDrawerItemProp extends DrawerItemProp {
  variant?: 'contained' | 'text';
  isActive?: boolean;
  customStyle?: React.CSSProperties;
}
const App: React.FC<LayoutProps> = ({ children, ...props }) => {
  const router = useRouter();
  const { t } = useTranslation();
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

  return (
    <Layout
      {...props}
      _topAppBar={{
        isShowLang: false,
        _brand: {
          _box: {
            logoComponent: <Brand />,
            onClick: () => router.push('/poc'),
          },
        },
        navLinks: defaultNavLinks,
        _navLinkBox: { gap: '12px' },
        ...props?._topAppBar,
      }}
    >
      <Box>{children}</Box>
    </Layout>
  );
};

export default function AppWrapper(props: LayoutProps) {
  return (
    <POSMuiThemeProvider>
      <App {...props} />
    </POSMuiThemeProvider>
  );
}

const Brand = () => {
  return (
    <Box display="flex" gap={1}>
      <Image
        src="/images/appLogo.svg"
        alt="Pratham"
        width={146}
        height={32}
        style={{ height: '32px' }}
      />
      <Image
        src="/images/pradigi.png"
        alt="Pradigi"
        width={94}
        height={32}
        style={{ height: '32px' }}
      />
    </Box>
  );
};
