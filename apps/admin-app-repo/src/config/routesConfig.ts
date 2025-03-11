import { Role, TenantName } from '@/utils/app.constant';

export const PUBLIC_ROUTES = [
  '/',
  '/404',
  '/login',
  '/demo',
  '/logout',
  '/unauthorized',
];
export const ROLE_BASED_ROUTES = {
  [TenantName.SECOND_CHANCE_PROGRAM]: {
    [Role.ADMIN]: ['/test-route/[identifier]'],
    [Role.CENTRAL_ADMIN]: ['/test-route/[identifier]'],
    [Role.CCTA]: ['/test-route/[identifier]'],
    [Role.SCTA]: ['/test-route/[identifier]'],
  },
  [TenantName.YOUTHNET]: {
    [Role.ADMIN]: ['/test-route/[identifier]'],
    [Role.CENTRAL_ADMIN]: ['/test-route/[identifier]'],
    [Role.CCTA]: ['/test-route/[identifier]'],
    [Role.SCTA]: ['/test-route/[identifier]'],
  },
};
