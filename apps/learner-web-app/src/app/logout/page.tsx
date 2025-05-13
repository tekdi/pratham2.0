'use client';
import { useEffect } from 'react';
import { logout } from '@learner/utils/API/LoginService';
import Loader from '@learner/components/Loader/Loader';
import { useRouter } from 'next/navigation';
import { preserveLocalStorage } from '@learner/utils/helper';
import { useTranslation } from '@shared-lib';

function Logout() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const userLogout = async () => {
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          await logout(refreshToken);
        }
      } catch (error) {
        console.log(error);
      }
    };
    userLogout();
    if (typeof window !== 'undefined' && window.localStorage) {
      // Specify the keys you want to keep
      preserveLocalStorage();
    }
    router.replace('/login');
  }, []);

  return <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />;
}

export default Logout;
