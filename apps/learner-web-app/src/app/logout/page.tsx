'use client';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { logout } from '@learner/utils/API/LoginService';
import Loader from '@learner/components/Loader/Loader';
import { useRouter } from 'next/navigation';
const preserveLocalStorage = () => {
  const keysToKeep = [
    'preferredLanguage',
    'mui-mode',
    'mui-color-scheme-dark',
    'mui-color-scheme-light',
    'hasSeenTutorial',
  ];

  const valuesToKeep: { [key: string]: any } = {};

  keysToKeep.forEach((key: string) => {
    const value = localStorage.getItem(key);
    if (value !== null) {
      valuesToKeep[key] = value;
    }
  });

  localStorage.clear();

  keysToKeep.forEach((key: string) => {
    if (valuesToKeep[key] !== undefined) {
      localStorage.setItem(key, valuesToKeep[key]);
    }
  });
};
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
