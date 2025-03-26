import { Role } from '@/utils/app.constant';

const stateId =
  typeof window !== 'undefined' ? localStorage.getItem('stateId') : null;
  
export const YouthSearchSchema = {
  type: 'object',
  properties: {
    state: {
      type: 'array',
      title: 'State',
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
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
      //for multiselect
      uniqueItems: true,
      isMultiSelect: true,
      maxSelections: 1000,
    },
    district: {
      type: 'array',
      title: 'District',
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
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
      //for multiselect
      uniqueItems: true,
      isMultiSelect: true,
      maxSelections: 1000,
    },
    block: {
      type: 'array',
      title: 'Block',
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
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
      //for multiselect
      uniqueItems: true,
      isMultiSelect: true,
      maxSelections: 1000,
    },
    village: {
      type: 'array',
      title: 'Village',
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
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
      //for multiselect
      uniqueItems: true,
      isMultiSelect: true,
      maxSelections: 1000,
    },
    firstName: {
      type: 'string',
      title: 'Search Key',
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

export const YouthSearchUISchema = {
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
    'ui:widget': 'CustomMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
    },
    ...(stateId ? { 'ui:disabled': true } : {}),
  },

  district: {
    'ui:widget': 'CustomMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
    },
  },

  block: {
    'ui:widget': 'CustomMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
    },
  },

  village: {
    'ui:widget': 'CustomMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
    },
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
