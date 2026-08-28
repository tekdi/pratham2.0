import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Role, TenantName, isSecondChanceTenant, getSelectedTenantData } from '@/utils/app.constant';

// const Login = dynamic(() => import('./Login'), { ssr: false });
// const Dashboard = dynamic(() => import('./Dashboard'), { ssr: false });

const Home: React.FC = () => {
  const { push } = useRouter();
  const router = useRouter();

  const { t } = useTranslation();

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      setLoading(false);
      if (token) {
        const storedUserData = JSON.parse(
          localStorage.getItem('adminInfo') || '{}'
        );
        const selectedTenantData = getSelectedTenantData(
          storedUserData?.tenantData,
          localStorage.getItem('tenantId')
        );
        if (
          storedUserData?.role === Role.SCTA ||
          storedUserData?.role === Role.CCTA
        ) {
          if (!isSecondChanceTenant(selectedTenantData?.tenantName)) {
            router.push('/workspace');
            // window.location.href = "/course-planner";
          } else {
            router.push('/course-planner');
          }
        } else if (
          storedUserData?.role === Role.CENTRAL_ADMIN &&
          isSecondChanceTenant(selectedTenantData?.tenantName)
        ) {
          router.push('/programs');
        } else if (
          storedUserData?.role === Role.ADMIN &&
          isSecondChanceTenant(selectedTenantData?.tenantName)
        ) {
          router.push('/centers');
        } else if (
          (storedUserData?.role === Role.CENTRAL_ADMIN ||
            storedUserData?.role === Role.ADMIN) &&
          selectedTenantData?.tenantName == TenantName.YOUTHNET
        ) {
          router.push('/mentor');
        }
      } else {
        router.push('/login', undefined, { locale: 'en' });
      }
    }
  }, []);

  return <>{loading && <p>{t('COMMON.LOADING')}...</p>}</>;
};

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default Home;
