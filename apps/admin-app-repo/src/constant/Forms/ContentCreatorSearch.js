export const ContentCreatorSearchSchema = {
    type: 'object',
    properties: {
      state: {
        type: 'string',
        title: 'State',
        enum: ['Select'],
        enumNames: ['Select'],
        api: {
          url: 'https://dev-interface.prathamdigital.org/interface/v1/fields/options/read',
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
      firstName: {
        type: 'string',
        title: 'Search Key',
      },
      sortBy: {
        type: 'string',
        title: 'Sort By',
        enum: ['asc', 'desc'],
        enumNames: ['A-Z', 'Z-A'],
      },
    },
  };
  
  export const ContentCreatorUISchema = {
    'ui:order': ['state', 'searchKey', 'sortBy'],
  
    state: {
      'ui:widget': 'select',
    },
  
    searchKey: {
      'ui:widget': 'text',
    },
  
    sortBy: {
      'ui:widget': 'select',
    },
  };
  