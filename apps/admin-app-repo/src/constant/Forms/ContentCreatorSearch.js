export const ContentCreatorSearchSchema = {
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
      maxSelection: 1000,
    },
    board: {
      "type": "array",
      "title": "BOARD",
      "coreField": 0,
      "fieldId": "f93c0ac3-f827-4794-9457-441fa1057b42",
      "field_type": "drop_down",
      "maxSelection": 10000,
      "isMultiSelect": true,
      "uniqueItems": true,
      "isRequired": true,
      "items": {
          "type": "string",
          "enum": [
              "Select"
          ],
          "enumNames": [
              "Select"
          ]
      },
      "api": {
          "url": "/api/dynamic-form/get-framework",
          "method": "POST",
          "options": {
              "label": "label",
              "value": "value",
              "optionObj": "options"
          },
          "payload": {
              "code": "board",
              "fetchUrl": `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/framework/v1/read/scp-framework`
          },
          "callType": "initial"
      }
  },
    name: {
      type: 'string',
      title: 'Search Content Creator',
    },
    sortBy: {
      type: 'string',
      title: 'Sort By',
      enum: ['asc', 'desc'],
      enumNames: ['A-Z', 'Z-A'],
    },
    tenantStatus: {
      type: 'string',
      title: 'Status',
      enum: ['active', 'archived'],
      enumNames: ['Active', 'Archived'],
    },
  },
};

export const ContentCreatorUISchema = {
  'ui:order': ['state', 'name', 'sortBy', 'tenantStatus'],

  state: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
    },
  },
  board: {
    "ui:widget": "AutoCompleteMultiSelectWidget",
    "ui:options": {
        "multiple": true,
        "uniqueItems": true,
        "hideError": false
    }
  },
  firstName: {
    'ui:widget': 'SearchTextFieldWidget',
  },

  sortBy: {
    'ui:widget': 'select',
  },

  tenantStatus: {
    'ui:widget': 'select',
  },
};
