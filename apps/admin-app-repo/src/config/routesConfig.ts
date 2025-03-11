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
      
    ],
    [Role.CCTA]: [
      
      '/subjectDetails',
      '/importCsv',
    
    ],
    [Role.SCTA]: [
      
      '/subjectDetails',
      '/importCsv ',
    ],
  },
  [TenantName.YOUTHNET]: {
    [Role.ADMIN]: [
    ],
    [Role.CENTRAL_ADMIN]: [
      
      
    ],
     
    [Role.CCTA]: [ ],
    [Role.SCTA]: [ ],
  },
};
