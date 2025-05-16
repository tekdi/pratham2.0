'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import {
  LayoutProps,
  Layout,
  useTranslation,
  DrawerItemProp,
  transformCategories,
} from '@shared-lib';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import { Footer } from './Footer';
import { getDeviceIdUUID } from '@shared-lib-v2/DynamicForm/utils/Helper';
import { validate as uuidValidate } from 'uuid';
import { useGlobalData } from '../Provider/GlobalProvider';
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
  const {
    globalData: { filterFramework },
  } = useGlobalData();

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
    const categories = filterFramework?.framework?.categories ?? [];
    const transformedCategories = transformCategories(categories);
    const schoolSubCategory =
      transformedCategories?.domain?.options.find(
        (category: any) => category.code === 'learningForSchool'
      )?.associations?.subDomain ?? [];
    const workSubCategory =
      transformedCategories?.domain?.options.find(
        (category: any) => category.code === 'learningForWork'
      )?.associations?.subDomain ?? [];
    const lifeSubCategory =
      transformedCategories?.domain?.options.find(
        (category: any) => category.code === 'learningForLife'
      )?.associations?.subDomain ?? [];

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
        child: schoolSubCategory.map((item: any) => ({
          title: item?.name,
          to: () => router.push(`/pos/school?se_subDomains=${item?.code}`),
        })),
      },
      {
        title: t('LEARNER_APP.POS.WORK'),
        to: () => router.push('/pos/work'),
        isActive: currentPage === '/pos/work',
        child: workSubCategory.map((item: any) => ({
          title: item?.name,
          to: () => router.push(`/pos/work?se_subDomains=${item?.code}`),
        })),
      },
      {
        title: t('LEARNER_APP.POS.LIFE'),
        to: () => router.push('/pos/life'),
        isActive: currentPage === '/pos/life',
        child: lifeSubCategory.map((item: any) => ({
          title: item?.name,
          to: () => router.push(`/pos/life?se_subDomains=${item?.code}`),
        })),
      },
      {
        title: t('LEARNER_APP.POS.PROGRAM'),
        // to: () => router.push('/pos/program'),
        isActive: currentPage === '/pos/program',
        child: [
          { code: 'Vocational Training', name: 'YouthNet' },
          { name: 'Second Chance Program', code: 'SCP' },
        ].map((item: any) => ({
          title: item?.name,
          to: () => router.push(`/pos/program?program=${item?.code}`),
        })),
      },
      {
        title: t('LEARNER_APP.POS.THEMATIC_REPOSITORY'),
        to: () => router.push('/pos/thematic-repository'),
        isActive: currentPage === '/pos/thematic-repository',
      },
    ];

    setDefaultNavLinks(navLinks);
  }, [t, filterFramework?.framework?.categories, router]);

  return (
    <Layout
      {...props}
      onlyHideElements={['footer']}
      _topAppBar={{
        isShowLang: false,
        _brand: {
          _box: {
            brandlogo: <Brand />,
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
export default App;

const Brand = () => {
  const router = useRouter();
  return (
    <Box
      display="flex"
      gap={1}
      onClick={() => router.push('/pos')}
      sx={{ cursor: 'pointer' }}
    >
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
