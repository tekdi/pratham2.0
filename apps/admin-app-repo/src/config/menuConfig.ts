export const MENU_CONFIG = {
  'Second Chance Program': {
    batch: {
      title: 'Batch',
      icon: '/images/centers.svg',
      link: '/batch',
      roles: [
        'State Lead',
        'Central Lead', //check
      ],
    },
    centers: {
      title: 'Centers',
      icon: '/images/centers.svg',
      link: '/centers',
      roles: [
        'State Lead',
        'Central Lead', // check
      ],
    },
    manageUsers: {
      title: 'Manage Users',
      icon: '/images/group.svg',
      roles: ['State Lead', 'Central Lead'],
      subMenu: [
        {
          title: 'Team Leaders',
          link: '/team-leader',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Facilitators',
          link: '/facilitator',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Learners',
          link: '/learners',
          roles: ['State Lead', 'Central Lead'],
        },
      ],
    },

    master: {
      title: 'Master',
      icon: '/images/database.svg',
      roles: ['State Lead', 'Central Lead'],
      subMenu: [
        {
          title: 'States',
          link: '/state',
          roles: [
            // 'State Lead',
            'Central Lead',
          ],
        },
        {
          title: 'Districts',
          link: '/district',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Blocks',
          link: '/block',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Village',
          link: '/village',
          roles: ['State Lead', 'Central Lead'],
        },
      ],
    },
    programs: {
      title: 'Programs',
      icon: '/images/programIcon.svg',
      link: '/programs',
      roles: ['Central Lead'],
    },
    manageNotificationTemplates: {
      title: 'Manage Notification Templates',
      icon: '/images/centers.svg',
      link: '/notification-templates',
      roles: ['Central Lead'],
    },
    coursePlanner: {
      title: 'Curriculum Planner',
      icon: '/images/event_available.svg',
      link: '/course-planner',
      roles: ['Content Reviewer', 'Content Creator'],
    },
    workspace: {
      title: 'Workspace',
      icon: '/images/dashboard.svg',
      link: '/workspace',
      roles: ['Content Reviewer', 'Content Creator'],
    },

    supportRequest: {
      title: 'Support Request',
      icon: '/assets/images/Support.svg',
      link: '/support-request',
      roles: [
        'State Lead',
        'Central Lead',
        'Content Reviewer',
        'Content Creator',
      ],
    },
  },
  YouthNet: {
    manageUsers: {
      title: 'Manage Users',
      icon: '/images/group.svg',
      roles: ['State Lead', 'Central Lead'],
      subMenu: [
        {
          title: 'Mentor',
          link: '/mentor',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Mentor Leader',
          link: '/mentor-leader',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Youth',
          link: '/youth',
          roles: ['State Lead', 'Central Lead'], // yet to come
        },
      ],
    },
    master: {
      title: 'Master',
      icon: '/images/database.svg',
      roles: ['State Lead', 'Central Lead'],
      subMenu: [
        {
          title: 'States',
          link: '/state',
          roles: [
            // 'State Lead',
            'Central Lead',
          ],
        },
        {
          title: 'Districts',
          link: '/district',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Blocks',
          link: '/block',
          roles: ['State Lead', 'Central Lead'],
        },
        {
          title: 'Village',
          link: '/village',
          roles: ['State Lead', 'Central Lead'],
        },
      ],
    },
    certificateIssuance: {
      title: 'Certificate Issuance',
      icon: '/images/certificate_custom.svg',
      link: '/certificate-issuance',
      roles: ['State Lead'],
    },
    supportRequest: {
      title: 'Support Request',
      icon: 'assets/images/Support.svg',
      link: '/support-request',
      roles: [
        'State Lead',
        'Central Lead',
        'Content Reviewer',
        'Content Creator',
      ],
    },
  },
};
