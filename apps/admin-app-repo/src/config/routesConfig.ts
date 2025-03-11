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
    [Role.ADMIN]: [
      '/center',
      '/team-leader',
      '/faciliator',
      '/learners',
      '/district',
      '/block',
      '/village',
      '/support-request',
      '/batch',
    ],
    [Role.CENTRAL_ADMIN]: [
      '/team-leader',
      '/faciliator',
      '/learners',
      '/state',
      '/district',
      '/block',
      '/village',
      '/programs',
      '/notification-templates',
      '/notification-templates/create',
      '/notification-templates/update/[identifier]',
      '/support-request',
    ],
    [Role.CCTA]: [
      '/support-request',
      '/course-planner',
      '/subjectDetails',
      '/importCsv',
      '/workspace',
    ],
    [Role.SCTA]: [
      '/support-request',
      '/course-planner',
      '/subjectDetails',
      '/importCsv ',
      '/workspace',
    ],
  },
  [TenantName.YOUTHNET]: {
    [Role.ADMIN]: [
      '/mentor',
      '/mentor-leader',
      '/certificate-issuance',
      '/support-request',
      '/support-request',
      '/district',
      '/block',
      '/village',
    ],
    [Role.CENTRAL_ADMIN]: [
      '/support-request',
      '/mentor',
      '/mentor-leader',
      '/state',
      '/district',
      '/block',
      '/village',
    ],
     
    [Role.CCTA]: ['/support-request' ,  '/workspace',],
    [Role.SCTA]: ['/support-request',  '/workspace',],
  },
};
