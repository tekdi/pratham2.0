import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const HomePage = () => {
  const path = process.env.NEXT_PUBLIC_WORKSPACE;

  useEffect(() => {
    // Set showHeader flag before redirecting to workspace MFE
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('showHeader', 'true');
    }

    // Use window.location.href for external MFE URL navigation.
    // router.push() is only for internal Next.js routes — using it with
    // an external URL causes a crash/abort in the router.
    if (path) {
      window.location.href = path;
    }
  }, [path]);

  return <div>Redirecting...</div>;
};

// Required so next-i18next loads the 'common' namespace for this page.
// Without this, the sidebar's useTranslation() has no translation data
// while this page is mounted, causing raw translation keys to flash.
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default HomePage;
