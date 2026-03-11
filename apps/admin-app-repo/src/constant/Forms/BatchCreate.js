export const BatchCreateSchema = {
  type: 'object',
  properties: {
    board: {
      type: 'array',
      title: 'BOARD',
      coreField: 0,
      fieldId: 'f93c0ac3-f827-4794-9457-441fa1057b42',
      field_type: 'drop_down',
      maxSelection: 50,
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
          code: 'board',
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/framework/v1/read/scp-framework`,
        },
        callType: 'initial',
      },
    },

    medium: {
      type: 'array',
      title: 'MEDIUM',
      coreField: 0,
      fieldId: '7b214a17-5a07-4ee0-bedc-271429862d30',
      field_type: 'drop_down',
      maxSelection: 50,
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
          code: 'board',
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/framework/v1/read/scp-framework`,
          findcode: 'medium',
          selectedvalue: '**',
        },
        callType: 'dependent',
        dependent: 'board',
      },
    },

    grade: {
      type: 'array',
      title: 'GRADE',
      coreField: 0,
      fieldId: '5a2dbb89-bbe6-4aa8-b541-93e01ab07b70',
      field_type: 'drop_down',
      maxSelection: 50,
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
          code: 'medium',
          fetchUrl: `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/framework/v1/read/scp-framework`,
          findcode: 'gradeLevel',
          selectedvalue: '**',
        },
        callType: 'dependent',
        dependent: 'medium',
      },
    },

    name: {
      type: 'string',
      title: 'Batch Name',
      coreField: 1,
      fieldId: null,
      field_type: 'text',
      pattern: '^[a-zA-Z][a-zA-Z ]*[a-zA-Z]$',
    },
    batch_type: {
      type: 'string',
      title: 'Type of Batch',
      coreField: 0,
      fieldId: '0417d8fd-47ae-4ec4-9b3b-3f8fdca31625',
      field_type: 'radio',
      isRequired: true,
      enum: [
        'remote',
        'regular',
        'hybrid',
      ],
      enumNames: [
        'REMOTE',
        'REGULAR',
        'HYBRID',
      ],
    },
  },
  required: ['board', 'medium', 'grade', 'name', 'batch_type'],
};

export const BatchCreateUISchema = {
  'ui:order': ['name', 'batch_type', 'board', 'medium', 'grade'],
  board: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
      hideError: false,
    },
  },
  medium: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
      hideError: false,
    },
  },
  grade: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': {
      multiple: true,
      uniqueItems: true,
      hideError: false,
    },
  },
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
};
