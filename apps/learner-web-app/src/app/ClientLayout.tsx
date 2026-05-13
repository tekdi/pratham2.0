'use client';

import React, { useEffect } from 'react';
import { FontSizeProvider } from '../context/FontSizeContext';
import { UnderlineLinksProvider } from '../context/UnderlineLinksContext';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';
import { usePathname, useRouter } from 'next/navigation';
import ServiceWorkerRegister from '@learner/components/ServiceWorkerRegister/ServiceWorkerRegister';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    telemetryFactory.init();
  }, []);

  useEffect(() => {
    try {
      const uiConfigRaw = localStorage.getItem('uiConfig');
      const registrationTestGiven = localStorage.getItem('registerationTestGiven');

      if (!uiConfigRaw || registrationTestGiven !== 'No') {
        return;
      }

      const uiConfig = JSON.parse(uiConfigRaw);
      const isRegistrationTestEnabled =
        uiConfig?.RegisterationTest === true ||
        uiConfig?.RegisterationTest === 'true';

      if (!isRegistrationTestEnabled) {
        return;
      }

      const isAllowedRoute =
        pathname?.startsWith('/player/') ||
        pathname === '/enroll-profile-completion' ||
        pathname === '/programs' ||
        pathname === '/logout' ||
        pathname === '/login' ||
        pathname === '/sso' ||
        pathname === '/registration';

      if (isAllowedRoute) {
        return;
      }

      // const questionSetIdentifier = localStorage.getItem(
      //   'registerationTestQuestionSetIdentifier'
      // );

      // if (questionSetIdentifier) {
      //   router.replace(
      //     `/player/${questionSetIdentifier}?previousPage=${encodeURIComponent('/programs')}&exitLink=${encodeURIComponent(localStorage.getItem('landingPage') || '/home')}`
      //   );
      //   return;
      // }

      router.replace('/programs');
    } catch (error) {
      console.error('Registration test route guard failed:', error);
    }
  }, [pathname, router]);

  return (
    <FontSizeProvider>
      <ServiceWorkerRegister />
      <UnderlineLinksProvider>{children}</UnderlineLinksProvider>
    </FontSizeProvider>
  );
}
