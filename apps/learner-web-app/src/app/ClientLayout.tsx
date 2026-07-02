'use client';

import React, { useEffect } from 'react';
import { FontSizeProvider } from '../context/FontSizeContext';
import { UnderlineLinksProvider } from '../context/UnderlineLinksContext';
import { telemetryFactory } from '@shared-lib-v2/DynamicForm/utils/telemetry';
import { usePathname, useRouter } from 'next/navigation';
import ServiceWorkerRegister from '@learner/components/ServiceWorkerRegister/ServiceWorkerRegister';
import { getUserDetails } from '@learner/utils/API/userService';

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
   // Why /enroll-profile-completion is in skipPaths:
  //   When a deleted user re-enrolls from the Explore Programs tab, their
  //   tenantId in localStorage is temporarily set to the archived program's ID
  //   before the enrollment API re-activates it. Running the guard here would
  //   wrongly log the user out mid-enrollment. The guard is intentionally skipped
  //   for this path so the enrollment flow can complete uninterrupted.
  // 
    const skipPaths = ['/login', '/logout', '/registration', '/landing', '/sso', '/', '/enroll-profile-completion'];
    const isSkippedPath = skipPaths.some(
      (p) => pathname === p || pathname?.startsWith(p + '/')
    );
    if (isSkippedPath) return;

    const userId = localStorage.getItem('userId');
    const currentTenantId = localStorage.getItem('tenantId');
    if (!userId || !currentTenantId) return;

    const checkUserAccess = async () => {
      try {
        const userResponse = await getUserDetails(userId, true);
        const tenantData = userResponse?.result?.userData?.tenantData || [];
        const currentTenant = tenantData.find(
          (t: any) => t.tenantId === currentTenantId
        );
        if (currentTenant && currentTenant.tenantStatus === 'archived') {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('tenantId');
          localStorage.removeItem('userProgram');
          document.cookie =
            'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
          router.replace('/login');
        }
      } catch {
        // Silently ignore — network errors shouldn't force a logout
      }
    };

    checkUserAccess();
  }, [pathname, router]);

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
        pathname === '/scp-dashboard' ||
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
