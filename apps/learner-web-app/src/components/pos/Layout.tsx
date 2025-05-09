'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
} from '@shared-lib';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import POSMuiThemeProvider from '@learner/assets/theme/POSMuiThemeProvider';
import { getTenantInfo } from '@learner/utils/API/ProgramService';
import { Footer } from './Footer';
import { getDeviceIdUUID } from '@shared-lib-v2/DynamicForm/utils/Helper';
import { validate as uuidValidate } from 'uuid';
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
    const init = async () => {
      const did = localStorage.getItem('did');
      if (!did || !(did && uuidValidate(did))) {
        const visitorId = await getDeviceIdUUID();
        localStorage.setItem(
          'did',
          typeof visitorId === 'string' ? visitorId : ''
        );
        console.log('Device fingerprint generated successfully', visitorId);
      }
    };
    init();
    const currentPage =
      typeof window !== 'undefined' && window.location.pathname
        ? window.location.pathname
        : '';

    const navLinks = [
      {
        title: t('LEARNER_APP.POS.ABOUT_US'),
        to: () => router.push('/pos/about-us'),
        isActive: currentPage === '/pos/about-us',
        child: [
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
        ],
      },
      {
        title: t('LEARNER_APP.POS.SCHOOL'),
        to: () => router.push('/pos/school'),
        isActive: currentPage === '/pos/school',
        child: [
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
        ],
      },
      {
        title: t('LEARNER_APP.POS.WORK'),
        to: () => router.push('/pos/work'),
        isActive: currentPage === '/pos/work',
        child: [
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
        ],
      },
      {
        title: t('LEARNER_APP.POS.LIFE'),
        to: () => router.push('/pos/life'),
        isActive: currentPage === '/pos/life',
        child: [
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
          {
            title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
            to: () => router.push('/pos/thematic-repository'),
          },
        ],
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
      onlyHideElements={['footer']}
      _topAppBar={{
        isShowLang: false,
        _brand: {
          _box: {
            logoComponent: <Brand />,
            onClick: () => router.push('/pos'),
          },
        },
        navLinks: defaultNavLinks,
        _navLinkBox: { gap: '12px' },
        ...props?._topAppBar,
      }}
    >
      <Box>{children}</Box>
      <Footer />
    </Layout>
  );
};

export default function AppWrapper(props: LayoutProps) {
  useEffect(() => {
    const init = async () => {
      const channelId = localStorage.getItem('channelId');
      const tenantId = localStorage.getItem('tenantId');
      const collectionFramework = localStorage.getItem('collectionFramework');

      if (!channelId || !tenantId || !collectionFramework) {
        const res = await getTenantInfo();
        const currentDomain = window.location.hostname;
        const youthnetContentFilter =
          res?.result.find(
            (program: any) => program.domain === currentDomain
          ) ||
          res?.result.find(
            (program: any) =>
              program.domain === process.env.NEXT_PUBLIC_POS_DOMAIN
          );

        if (youthnetContentFilter) {
          if (!channelId) {
            localStorage.setItem('channelId', youthnetContentFilter.channelId);
          }
          if (!tenantId) {
            localStorage.setItem('tenantId', youthnetContentFilter.tenantId);
          }
          if (!collectionFramework) {
            localStorage.setItem(
              'collectionFramework',
              youthnetContentFilter.collectionFramework
            );
          }

          // All values are set now, reload page
          window.location.reload();
        }
      }
    };
    init();
  }, []);

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
