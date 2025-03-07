import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MENU_CONFIG } from '../config/menuConfig';
import { PUBLIC_ROUTES, ROLE_BASED_ROUTES } from '../config/routesConfig';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ role: string; program: string } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('roleName');
    const storedProgram = localStorage.getItem('program');

    if (storedRole && storedProgram) {
      setUser({ role: storedRole, program: storedProgram });
    } else if (!PUBLIC_ROUTES.includes(router.pathname)) {
      // Redirect only if the route is NOT public
      router.replace('/login');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
  
    const allowedMenuRoutes = Object.values(MENU_CONFIG[user.program] || {})
      .filter((item) => item.roles.includes(user.role))
      .flatMap((item) => [
        item.link,
        ...(item.subMenu?.map((sub) => sub.link) || []),
      ]);
  
    const programSpecificRoutes =
      ROLE_BASED_ROUTES[user.program]?.[user.role] || [];
  
    const isPublicRoute = PUBLIC_ROUTES.includes(router.pathname);
    const isAllowedRoute =
      allowedMenuRoutes.includes(router.pathname) ||
      programSpecificRoutes.includes(router.pathname);
  
    // Handle dynamic paths (e.g., /course-hierarchy/[identifier])
    const isDynamicAllowed = programSpecificRoutes.some((route) =>
      router.pathname.startsWith(route.replace("[identifier]", ""))
    );
  
    if (!isPublicRoute && !isAllowedRoute && !isDynamicAllowed) {
      router.replace("/unauthorized");
    }
  }, [user, router.pathname]);

  if (loading) return <div>Loading...</div>;

  return <>{children}</>;
};

export default AuthWrapper;
