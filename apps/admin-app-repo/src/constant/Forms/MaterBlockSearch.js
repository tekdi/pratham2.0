export const MasterBlockSchema = {
  type: 'object',
  properties: {
    state: {
      type: 'string',
      title: 'State',
      enum: ['Select'],
      enumNames: ['Select'],
      api: {
        url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
        method: 'POST',
        payload: { fieldName: 'state', sort: ['state_name', 'asc'] },
        options: {
          optionObj: 'result.values',
          label: 'label',
          value: 'value',
        },
        callType: 'initial',
      },
    },
    district: {
      type: 'string',
      title: 'District',
      enum: ['Select'],
      enumNames: ['Select'],
      api: {
        url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
        method: 'POST',
        payload: {
          fieldName: 'district',
          controllingfieldfk: '**',
          sort: ['district_name', 'asc'],
        },
        options: {
          optionObj: 'result.values',
          label: 'label',
          value: 'value',
        },
        callType: 'dependent',
        dependent: 'state',
      },
    },
    firstName: {
      type: 'string',
      title: 'Search Block',
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

export const MasterBlocksUISchema = {
  'ui:order': ['firstName', 'sortBy'],

  state: {
    'ui:widget': 'select',
  },

  district: {
    'ui:widget': 'select',
  },

  firstName: {
    'ui:widget': 'text',
  },

  sortBy: {
    'ui:widget': 'select',
  },
};
