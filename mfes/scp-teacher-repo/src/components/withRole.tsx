import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TENANT_DATA } from '../../app.config';

const withRole =
  (allowedRole: string | string[]) =>
  (WrappedComponent: React.ComponentType) => {
    const allowedRoles = Array.isArray(allowedRole)
      ? allowedRole
      : [allowedRole];

    return (props: any) => {
      const router = useRouter();

      useEffect(() => {
        const role = localStorage.getItem(TENANT_DATA.TENANT_NAME);

        if (!role || !allowedRoles.includes(role)) {
          router.push('/');
        }
      }, []);

      return <WrappedComponent {...props} />;
    };
  };

export default withRole;
