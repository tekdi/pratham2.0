export const learnerSearchSchema = {
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
        block: {
            type: 'string',
            title: 'Block',
            enum: ['Select'],
            enumNames: ['Select'],
            api: {
                url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
                method: 'POST',
                payload: {
                    fieldName: 'block',
                    controllingfieldfk: '**',
                    sort: ['block_name', 'asc'],
                },
                options: {
                    optionObj: 'result.values',
                    label: 'label',
                    value: 'value',
                },
                callType: 'dependent',
                dependent: 'district',
            },
        },
        village: {
            type: 'string',
            title: 'Village',
            enum: ['Select'],
            enumNames: ['Select'],
            api: {
                url: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/fields/options/read`,
                method: 'POST',
                payload: {
                    fieldName: 'village',
                    controllingfieldfk: '**',
                    sort: ['village_name', 'asc'],
                },
                options: {
                    optionObj: 'result.values',
                    label: 'label',
                    value: 'value',
                },
                callType: 'dependent',
                dependent: 'block',
            },
        },
        firstName: {
            type: 'string',
            title: 'Search Learner',
            // description: 'Search for a specific user or entity',
        },
        sortBy: {
            type: 'string',
            title: 'Sort By',
            enum: ['asc', 'desc'],
            enumNames: ['A-Z', 'Z-A'],
        },
        status: {
          type: 'string',
          title: 'Status',
          enum: ['active', 'archived'],
          enumNames: ['Active', 'Archived'],
        },
    },
};

export const learnerSearchUISchema = {
    'ui:order': [
        'state',
        'district',
        'block',
        'village',
        'firstName',
        'sortBy',
        'status',
    ],

    state: {
        'ui:widget': 'select',
    },

    district: {
        'ui:widget': 'select',
    },

    block: {
        'ui:widget': 'select',
    },

    village: {
        'ui:widget': 'select',
    },

    firstName: {
        'ui:widget': 'text',
    },

    sortBy: {
        'ui:widget': 'select',
    },

      status: {
        'ui:widget': 'select',
      },
};
