import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { TENANT_DATA } from '../app.config';

const withRole =
  (allowedRole: string) => (WrappedComponent: React.ComponentType) => {
    return (props: any) => {
      const router = useRouter();
      const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

      useEffect(() => {
        const role = localStorage.getItem(TENANT_DATA.TENANT_NAME);

        if (role === allowedRole) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.replace('/login');
        }
      }, []);

      if (isAuthorized === null) return null;

      return isAuthorized ? <WrappedComponent {...props} /> : null;
    };
  };

export default withRole;
