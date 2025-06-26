import { Role, TenantName } from '@/utils/app.constant';

export const MENU_CONFIG = {
  [TenantName.SECOND_CHANCE_PROGRAM]: {
    centers: {
      title:  'SIDEBAR.CENTERS',
      icon: '/images/centers.svg',
      link: '/centers',
      roles: [
        Role.ADMIN,
         Role.CENTRAL_ADMIN, 
      ],
    },
    batch: {
      title: 'SIDEBAR.BATCH',
      icon: '/images/centers.svg',
      link: '/batch',
      roles: [
        Role.ADMIN,
       Role.CENTRAL_ADMIN, 
      ],
    },
    manageUsers: {
      title: 'SIDEBAR.MANAGE_USERS',
      icon: '/images/group.svg',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
      subMenu: [
        {
          title:  'SIDEBAR.TEAM_LEADERS',
          link: '/team-leader',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.FACILITATORS',
          link: '/facilitator',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.LEARNERS',
          link: '/learners',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.CONTENT_CREATOR',
          link: '/content-creator',
          roles: [Role.CENTRAL_ADMIN],
        },
        {
          title:  'SIDEBAR.CONTENT_REVIEWER',
          link: '/content-reviewer',
          roles: [Role.CENTRAL_ADMIN],
        },
        {
                 title:  'SIDEBAR.STATE_LEAD',

          link: '/state-lead',
          roles: [Role.CENTRAL_ADMIN],
        },
      ],
    },

    master: {
          title:  'SIDEBAR.MASTER',
      icon: '/images/database.svg',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
      subMenu: [
        {
                    title:  'SIDEBAR.STATES',

          link: '/state',
          roles: [
            // Role.ADMIN,
            Role.CENTRAL_ADMIN,
          ],
        },
        {
                              title:  'SIDEBAR.DISTRICTS',

          link: '/district',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
        
          title:  'SIDEBAR.BLOCKS',

          link: '/block',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
         title:  'SIDEBAR.VILLAGES',
          link: '/village',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
      ],
    },
    programs: {
              
      title:  'SIDEBAR.PROGRAMS',

      icon: '/images/programIcon.svg',
      link: '/programs',
      roles: [Role.CENTRAL_ADMIN],
    },
    manageNotificationTemplates: {
      title:  'SIDEBAR.MANAGE_NOTIFICATION', 
      icon: '/images/centers.svg',
      link: '/notification-templates',
      roles: [Role.CENTRAL_ADMIN],
    },
    coursePlanner: {
      title:  'SIDEBAR.CURRICULUM_PLANNER',
      icon: '/images/event_available.svg',
      link: '/course-planner',
      roles: [Role.CCTA, Role.SCTA],
    },
    workspace: {
      title: 'SIDEBAR.WORKSPACE',
      icon: '/images/dashboard.svg',
      link: '/workspace',
      roles: [Role.CCTA, Role.SCTA],
    },
    faqs: {
      title: 'SIDEBAR.FAQS',
      icon: '/images/live_help.png',
      link: '/faqs',
      roles: [
        Role.ADMIN,
        Role.CENTRAL_ADMIN,
        Role.CCTA,
        Role.SCTA,
        // Role.CENTRAL_ADMIN, // check
      ],
    },
    supportRequest: {
      title: 'SIDEBAR.SUPPORT_REQUEST',
      icon: '/images/Support.svg',
      link: '/support-request',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN, Role.CCTA, Role.SCTA],
    },
  },
  [TenantName.YOUTHNET]: {
    centers: {
      title: 'SIDEBAR.SKILLING_CENTERS',
      icon: '/images/centers.svg',
      link: '/centers',
      roles: [Role.ADMIN,  Role.CENTRAL_ADMIN],
    },
    manageUsers: {
      title: 'SIDEBAR.MANAGE_USERS',
      icon: '/images/group.svg',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
      subMenu: [
        {
          title:  'SIDEBAR.MENTOR',
          link: '/mentor',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.MENTOR_LEADER',
          link: '/mentor-leader',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.YOUTH',
          link: '/youth',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN], // yet to come
        },
        {
          title:  'SIDEBAR.CONTENT_CREATOR',
          link: '/content-creator',
          roles: [Role.CENTRAL_ADMIN],
        },
        {
          title:  'SIDEBAR.CONTENT_REVIEWER',
          link: '/content-reviewer',
          roles: [Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.STATE_LEAD',
          link: '/state-lead',
          roles: [Role.CENTRAL_ADMIN],
        },
      ],
    },
    master: {
          title:  'SIDEBAR.MASTER',
      icon: '/images/database.svg',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
      subMenu: [
        {
         title:  'SIDEBAR.STATES',
          link: '/state',
          roles: [
            // Role.ADMIN,
            Role.CENTRAL_ADMIN,
          ],
        },
        {
                   title:  'SIDEBAR.DISTRICTS',

          link: '/district',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title:  'SIDEBAR.BLOCKS',
          link: '/block',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
           title:  'SIDEBAR.VILLAGES',
          link: '/village',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
      ],
    },
    certificateIssuance: {
      title:  'SIDEBAR.CERTIFICATE_ISSUANCE',
      icon: '/images/certificate_custom.svg',
      link: '/certificate-issuance',
      roles: [Role.ADMIN],
    },
    faqs: {
      title: 'SIDEBAR.FAQS',
      icon: '/images/live_help.png',
      link: '/faqs',
      roles: [
        Role.ADMIN,
        Role.CENTRAL_ADMIN,
        Role.CCTA,
        Role.SCTA,
        // Role.CENTRAL_ADMIN, // check
      ],
    },
    supportRequest: {
      title: 'SIDEBAR.SUPPORT_REQUEST',
      icon: '/images/Support.svg',
      link: '/support-request',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN, Role.CCTA, Role.SCTA],
    },
    workspace: {
      title: 'SIDEBAR.WORKSPACE',
      icon: '/images/dashboard.svg',
      link: '/workspace',
      roles: [Role.CCTA, Role.SCTA],
    },
  },
  [TenantName.POS]: {
    manageUsers: {
      title: 'SIDEBAR.MANAGE_USERS',
      icon: '/images/group.svg',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
      subMenu: [
        {
          title:  'SIDEBAR.MENTOR',
          link: '/mentor',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.MENTOR_LEADER',
          link: '/mentor-leader',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.YOUTH',
          link: '/youth',
          roles: [Role.ADMIN, Role.CENTRAL_ADMIN], // yet to come
        },
        {
          title:  'SIDEBAR.CONTENT_CREATOR',
          link: '/content-creator',
          roles: [Role.CENTRAL_ADMIN],
        },
        {
          title:  'SIDEBAR.CONTENT_REVIEWER',
          link: '/content-reviewer',
          roles: [Role.CENTRAL_ADMIN],
        },
        {
          title: 'SIDEBAR.STATE_LEAD',
          link: '/state-lead',
          roles: [Role.CENTRAL_ADMIN],
        },
      ],
    },
    workspace: {
      title: 'SIDEBAR.WORKSPACE',
      icon: '/images/dashboard.svg',
      link: '/workspace',
      roles: [Role.CCTA, Role.SCTA],
    },
    faqs: {
      title: 'SIDEBAR.FAQS',
      icon: '/images/live_help.png',
      link: '/faqs',
      roles: [
        Role.ADMIN,
        Role.CENTRAL_ADMIN,
        Role.CCTA,
        Role.SCTA,
        // Role.CENTRAL_ADMIN, // check
      ],
    },
    supportRequest: {
      title: 'SIDEBAR.SUPPORT_REQUEST',
      icon: '/images/Support.svg',
      link: '/support-request',
      roles: [Role.ADMIN, Role.CENTRAL_ADMIN, Role.CCTA, Role.SCTA],
    },
  },
  [TenantName.PRAGYANPATH]: {
    workspace: {
      title: 'SIDEBAR.WORKSPACE',
      icon: '/images/dashboard.svg',
      link: '/workspace',
      roles: [Role.CCTA, Role.SCTA],
    },
  },
};
