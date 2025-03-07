export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/about',
  '/help',
  '/demo',
  '/logout'
];

export const ROLE_BASED_ROUTES = {
  'Second Chance Program': {
    'State Lead': ['/scp/state-dashboard', '/scp/state-reports'],
    'Central Lead': ['/scp/central-dashboard', '/scp/central-reports'],
    'Content Reviewer': ['/scp/review-submissions','/course-planner'],
    'Content Creator': ['/scp/create-content','/course-planner'],
  },
  YouthNet: {
    'State Lead': ['/youthnet/state-dashboard', '/youthnet/state-reports'],
    'Central Lead': [
      '/youthnet/central-dashboard',
      '/youthnet/central-reports',
    ],
    'Content Reviewer': ['/youthnet/review-feedback'],
    'Content Creator': ['/youthnet/upload-material'],
  },
};
