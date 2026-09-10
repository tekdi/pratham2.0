// Domain/Course/Note fields used inside the "Review & assign interest"
// side panel. Same api-driven cascade shape as L2QueueSearchSchema's
// taggedDomain/taggedCourse fields, just under plain `domain`/`course` keys.
// `fieldId` on each property lets extractMatchingKeys() (shared-lib-v2)
// prefill this schema from an already-tagged learner's customFields.
import { L2_FIELD_IDS } from '../../services/l2InterestedQueue/l2Queue.config';

const baseurl = process.env.NEXT_PUBLIC_MIDDLEWARE_URL;

export const L2QueueAssignSchema = {
  type: 'object',
  properties: {
    domain: {
      type: 'array',
      title: 'Domain',
      fieldId: L2_FIELD_IDS.DOMAIN,
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
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
    course: {
      type: 'array',
      title: 'Course',
      fieldId: L2_FIELD_IDS.COURSES,
      items: {
        type: 'string',
        enum: ['Select'],
        enumNames: ['Select'],
      },
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
    note: {
      type: 'string',
      title: 'Interaction note',
      fieldId: L2_FIELD_IDS.INTERACTION_NOTE,
    },
  },
};

export const L2QueueAssignUISchema = {
  'ui:order': ['domain', 'course', 'note'],
  domain: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': { multiple: true, uniqueItems: true },
    'ui:placeholder': 'Select a domain',
  },
  course: {
    'ui:widget': 'AutoCompleteMultiSelectWidget',
    'ui:options': { multiple: true, uniqueItems: true },
    'ui:placeholder': 'Choose a domain first',
  },
  note: {
    'ui:widget': 'textarea',
    'ui:placeholder': 'What was discussed with the learner?',
  },
};
