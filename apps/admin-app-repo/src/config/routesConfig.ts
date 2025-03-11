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
    [Role.ADMIN]: ['/center', '/team-leader' , '/faciliator'  , '/learners' , '/state', '/district', '/block', '/village' ],
    [Role.CENTRAL_ADMIN]: ['/team-leader', '/faciliator', '/learners' , '/state', '/district', '/block' , '/village'],
    [Role.CCTA]: ['/test-route/[identifier]'],
    [Role.SCTA]: ['/test-route/[identifier]'],
  },
  [TenantName.YOUTHNET]: {
    [Role.ADMIN]: ['/mentor', '/mentor-leader', '/certificate-issuance', '/support-request' ],
    [Role.CENTRAL_ADMIN]: ['/test-route/[identifier]'],
    [Role.CCTA]: ['/test-route/[identifier]'],
    [Role.SCTA]: ['/test-route/[identifier]'],
  },
};
