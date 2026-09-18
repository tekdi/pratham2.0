// Ported verbatim from apps/admin-app-repo/src/constant/Forms/L2BatchCreate.js
// (same field ids/titles) — the Vocational Training Batch creation form.
// domain/skills' `api` config here (framework-taxonomy fetch) is overridden
// away at render time in CreateBatchModal.tsx, restricting both fields to
// the Trainer's own assigned Domain/Course set instead.
export const L2BatchCreate = {
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'UNIT_NAME',
        coreField: 1,
        fieldId: null,
        field_type: 'text',
        pattern: "^[a-zA-Z0-9][a-zA-Z0-9 .'-]*[a-zA-Z0-9]$",
      },
      batch_type: {
        type: 'string',
        title: 'TYPE_OF_BATCH',
        coreField: 0,
        fieldId: '0417d8fd-47ae-4ec4-9b3b-3f8fdca31625',
        field_type: 'radio',
        isRequired: true,
        enum: ['regular', 'remote', 'hybrid'],
        enumNames: ['REGULAR', 'REMOTE', 'HYBRID'],
      },
      startdate: {
        type: 'string',
        title: 'START_DATE',
        coreField: 0,
        fieldId: '526ef5e9-667f-4790-98a8-e789ce9d5be0',
        field_type: 'text',
        isRequired: true,
        format: 'date',
      },
      enddate: {
        type: 'string',
        title: 'END_DATE',
        coreField: 0,
        fieldId: '5344eb96-810e-4696-ae98-1d9c2b7574b3',
        field_type: 'text',
        isRequired: true,
        format: 'date',
        // Must be strictly after startdate (sibling-field $data reference).
        formatExclusiveMinimum: { $data: '1/startdate' },
      },
      domain: {
        type: 'array',
        title: 'DOMAIN',
        coreField: 0,
        fieldId: 'e5277d7b-e7ef-4a11-9a54-a8e6e7975383',
        field_type: 'drop_down',
        maxSelection: 1,
        isMultiSelect: true,
        uniqueItems: true,
        isRequired: true,
        items: {
          type: 'string',
          enum: ['Select'],
          enumNames: ['Select'],
        },
        api: {
          url: '/api/dynamic-form/get-framework',
          method: 'POST',
          options: {
            label: 'label',
            value: 'value',
            optionObj: 'options',
          },
          payload: {
            code: 'subDomain',
            fetchUrl:
              'https://dev-middleware.prathamdigital.org/api/framework/v1/read/pos-framework',
            findcode: 'subject',
            selectedvalue: ['Career Exploration'],
          },
          callType: 'initial',
        },
      },
      skills: {
        type: 'array',
        title: 'SKILLS',
        coreField: 0,
        fieldId: 'ed585a8c-8727-4bd5-a9c5-7642b2df774f',
        field_type: 'drop_down',
        maxSelection: 1,
        isMultiSelect: true,
        uniqueItems: true,
        isRequired: true,
        items: {
          type: 'string',
          enum: ['Select'],
          enumNames: ['Select'],
        },
        api: {
          url: '/api/dynamic-form/get-framework',
          method: 'POST',
          options: {
            label: 'label',
            value: 'value',
            optionObj: 'options',
          },
          payload: {
            code: 'subject',
            fetchUrl:
              'https://dev-middleware.prathamdigital.org/api/framework/v1/read/pos-framework',
            findcode: 'skills',
            selectedvalue: '**',
          },
          callType: 'dependent',
          dependent: 'domain',
        },
      },
    },
    required: ['name', 'batch_type', 'domain', 'skills', 'startdate', 'enddate'],
  },
  uiSchema: {
    name: {
      'ui:widget': 'CustomTextFieldWidget',
      'ui:options': {
        validateOnBlur: true,
        hideError: true,
      },
    },
    batch_type: {
      'ui:widget': 'CustomRadioWidget',
      'ui:options': {
        hideError: true,
      },
    },
    domain: {
      'ui:widget': 'AutoCompleteMultiSelectWidget',
      'ui:options': {
        multiple: true,
        uniqueItems: true,
        hideError: false,
      },
    },
    skills: {
      'ui:widget': 'AutoCompleteMultiSelectWidget',
      'ui:options': {
        multiple: true,
        uniqueItems: true,
        hideError: false,
      },
    },
    startdate: {
      'ui:widget': 'CustomDateWidget',
      'ui:options': {
        validateOnBlur: true,
        hideError: true,
      },
    },
    enddate: {
      'ui:widget': 'CustomDateWidget',
      'ui:options': {
        validateOnBlur: true,
        hideError: true,
      },
    },
    'ui:order': ['name', 'batch_type', 'domain', 'skills', 'startdate', 'enddate'],
  },
};
