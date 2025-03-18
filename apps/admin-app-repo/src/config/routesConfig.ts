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
    [Role.ADMIN]: [],
    [Role.CENTRAL_ADMIN]: [
      '/notification-templates/create',
      '/notification-templates/update/[identifier]',
      '/edit-password',
    ],
    [Role.CCTA]: ['/subjectDetails', '/importCsv', '/edit-password',],
    [Role.SCTA]: ['/subjectDetails', '/importCsv ', '/edit-password'],
  },
  [TenantName.YOUTHNET]: {
    [Role.ADMIN]: ['/edit-password'],
    [Role.CENTRAL_ADMIN]: ['/edit-password'],
    [Role.CCTA]: ['/edit-password', '/subjectDetails', '/importCsv '],
    [Role.SCTA]: ['/edit-password', '/subjectDetails', '/importCsv '],
  },
};
