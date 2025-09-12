export const BatchSearchSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Search Batch..',
      // description: 'Search for a specific user or entity',
    },
    status: {
      type: 'string',
      title: 'Status',
      enum: ['active', 'archived'],
      enumNames: ['Active', 'Archived'],
    },
    sortBy: {
      type: 'string',
      title: 'Sort By',
      enum: ['asc', 'desc'],
      enumNames: ['A-Z', 'Z-A'],
    }
  },
};

export const BatchSearchUISchema = {
  'ui:order': [
    'name',
    'status',
    'sortBy'
  ],

  name: {
    'ui:widget': 'SearchTextFieldWidget',
  },

  sortBy: {
    'ui:widget': 'select',
  },
  status: {
    'ui:widget': 'select',
  },
};
