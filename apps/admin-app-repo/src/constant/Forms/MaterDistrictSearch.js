import { Role } from '@/utils/app.constant';

const stateId =
  typeof window !== 'undefined' ? localStorage.getItem('stateId') : null;
const stateName =
  typeof window !== 'undefined' ? localStorage.getItem('stateName') : null;
const userRole =
  typeof window !== 'undefined' ? localStorage.getItem('roleName') : null;

export const MasterDistrictsSearchSchema = {
  type: 'object',
  properties: {
    state: {
      type: 'array',
      title: 'State',
      items: {
        type: 'string',
        enum: userRole !== Role.CENTRAL_ADMIN ? [stateId] : ['Select'],
        enumNames: userRole !== Role.CENTRAL_ADMIN ? [stateName] : ['Select'],
      },
      api:
        userRole !== Role.CENTRAL_ADMIN
          ? undefined // Avoid API call if stateId is present
          : {
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
    firstName: {
      type: 'string',
      title: 'Search District',
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

export const MasterDistrictsUISchema = {
  'ui:order': ['state', 'firstName', 'sortBy'],

  state: {
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
};
