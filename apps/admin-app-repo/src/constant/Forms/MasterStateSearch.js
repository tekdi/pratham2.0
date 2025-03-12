export const MasterStateSearchSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      title: 'Search State',
      // description: 'Search for a specific user or entity',
    },
    sortBy: {
      type: 'string',
      title: 'Sort By',
      enum: ['asc', 'desc'],
      enumNames: ['A-Z', 'Z-A'],
    },
  },
};

export const MasterStateUISchema = {
  'ui:order': ['firstName', 'sortBy'],

  firstName: {
    'ui:widget': 'text',
  },

  sortBy: {
    'ui:widget': 'select',
  },
};
