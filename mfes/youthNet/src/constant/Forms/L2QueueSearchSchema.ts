// Filter bar for the Trainer's L2 Interested Queue. Modeled field-for-field on
// admin-app-repo's CohortSearchSchema (same DynamicForm engine, same
// cascading api/dependent mechanism) — see the plan for why this is reused
// instead of a hand-rolled filter component.
const baseurl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;

export const L2QueueSearchSchema = {
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
        url: `${baseurl}/fields/options/read`,
        method: 'POST',
        payload: { fieldName: 'state', sort: ['state_name', 'asc'] },
        options: {
          optionObj: 'result.values',
          label: 'label',
          value: 'value',
        },
        callType: 'initial',
      },
      uniqueItems: true,
      isMultiSelect: true,
      maxSelection: 1,
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
        url: `${baseurl}/fields/options/read`,
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
      uniqueItems: true,
      isMultiSelect: true,
      maxSelection: 1,
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
        url: `${baseurl}/fields/options/read`,
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
      uniqueItems: true,
      isMultiSelect: true,
      maxSelection: 1,
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
        url: `${baseurl}/fields/options/read`,
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
      uniqueItems: true,
      isMultiSelect: true,
      maxSelection: 1,
    },
    name: {
      type: 'string',
      title: 'Search name or code',
    },
    status: {
      type: 'string',
      title: 'Status',
      enum: ['all', 'untagged', 'tagged'],
      enumNames: ['All', 'Untagged', 'Tagged'],
      default: 'all',
    },
    taggedDomain: {
      type: 'array',
      title: 'Tagged Domain',
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
      // Placeholder endpoint — no Domain Search API was ever given; modeled
      // on the existing /fields/options/read convention. Correct here only
      // if the real backend differs.
      api: {
       url: `/api/dynamic-form/get-framework`,
        method: 'POST',
        options: {
          label: 'label',
          value: 'value',
          optionObj: 'options',
        },
        payload: {
          code: 'subDomain',
          fetchUrl:
            'https://dev-middleware.prathamdigital.org/api/framework/v1/read/youthnet-framework',
          findcode: 'stream',
          selectedvalue: ['Career Exploration'],
        },
        callType: 'initial',
      },
      uniqueItems: true,
      isMultiSelect: true,
      maxSelection: 1,
    },
    taggedCourse: {
      type: 'array',
      title: 'Tagged Course',
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
      // Placeholder endpoint — modeled on the existing composite-search
      // convention (same one admin-app-repo's getCourseName() and this mfe's
      // AssesmentService use), filtering by domain instead of identifier.
      api: {
        url: `${baseurl}/action/composite/v3/search`,
        header: {
          tenantId: '**',
          Authorization: '**',
          academicyearid: '**',
        },
        method: 'POST',
        options: {
          label: 'name',
          value: 'identifier',
          optionObj: 'result.content',
        },
        payload: {
          request: {
            fields: ['name'],
            filters: {
              status: ['live'],
              channel: 'pos-channel',
              program: 'Vocational Training',
              se_domains: ['Learning for work'],
              se_subjects: '**',
              se_subDomains: ['Career Exploration'],
              primaryCategory: ['Course'],
            },
          },
        },
        callType: 'dependent',
        dependent: 'domain',
      },
      uniqueItems: true,
      isMultiSelect: true,
      maxSelection: 1,
    },
  },
};

export const L2QueueSearchUISchema = {
  'ui:order': [
    'state',
    'district',
    'block',
    'village',
    'name',
    'status',
    'taggedDomain',
    'taggedCourse',
  ],
  state: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': { multiple: true, uniqueItems: true },
  },
  district: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': { multiple: true, uniqueItems: true },
  },
  block: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': { multiple: true, uniqueItems: true },
  },
  village: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': { multiple: true, uniqueItems: true },
  },
  name: {
    'ui:widget': 'SearchTextFieldWidget',
  },
  status: {
    'ui:widget': 'select',
  },
  // Hidden by default (status defaults to 'all'); the page toggles this to
  // visible when status === 'tagged'.
  taggedDomain: {
    'ui:widget': 'hidden',
  },
  taggedCourse: {
    'ui:widget': 'hidden',
  },
};
