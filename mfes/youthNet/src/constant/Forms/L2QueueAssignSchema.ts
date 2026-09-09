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
      // Real Domain API: local BFF proxy (src/pages/api/dynamic-form/get-framework.ts)
      // reads the youthnet-framework and returns the `subDomain` category's
      // terms as the Domain dropdown's options (no selectedvalue = "initial" fetch).
      api: {
        url: '/youthnet/api/dynamic-form/get-framework',
        method: 'POST',
        payload: {
          code: 'subDomain',
          fetchUrl: `${baseurl}/api/framework/v1/read/youthnet-framework`,
          findcode: 'stream',
        },
        options: {
          optionObj: 'options',
          label: 'label',
          value: 'value',
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
      // Real Course API: same composite-search endpoint/filters given for this
      // feature verbatim — only se_subDomains is templated from the selected
      // Domain value; everything else (status/channel/program/se_domains/
      // se_subjects/primaryCategory) stays fixed as given.
      api: {
        url: `${baseurl}/action/composite/v3/search`,
        method: 'POST',
        payload: {
          request: {
            fields: ['name'],
            filters: {
              status: ['live'],
              channel: 'pos-channel',
              program: 'Vocational Training',
              se_domains: ['Learning for work'],
              se_subjects: ['Agriculture Education'],
              se_subDomains: '**',
              primaryCategory: ['Course'],
            },
          },
        },
        header: {
          tenantId: '**',
          Authorization: '**',
          academicyearid: '**',
        },
        options: {
          optionObj: 'result.content',
          label: 'name',
          value: 'identifier',
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
