export const genericEditorSaveFormResponse = {
    "id": "api.form.read",
    "params": {
        "status": "successful"
    },
    "responseCode": "OK",
    "result": {
        "form": {
            "type": "content",
            "subtype": "resource",
            "action": "save",
            "component": "*",
            "framework": "*",
            "data": {
                "templateName": "defaultTemplate",
                "action": "save",
                "fields": [
                    {
                        "code": "appicon",
                        "dataType": "url",
                        "description": "App Icon",
                        "editable": true,
                        "index": 1,
                        "inputType": "file",
                        "label": "App Icon",
                        "name": "App Icon",
                        "placeholder": "App Icon",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "name",
                        "dataType": "text",
                        "description": "Title of the content",
                        "editable": true,
                        "index": 2,
                        "inputType": "text",
                        "label": "Title",
                        "name": "Title",
                        "placeholder": "Enter Title",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "description",
                        "dataType": "text",
                        "description": "Brief description",
                        "editable": true,
                        "index": 3,
                        "inputType": "textarea",
                        "label": "Description",
                        "name": "Description",
                        "placeholder": "Brief description about the Book",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "keywords",
                        "dataType": "list",
                        "description": "Keywords for the content",
                        "editable": true,
                        "index": 4,
                        "inputType": "keywordsuggestion",
                        "label": "keywords",
                        "name": "Keywords",
                        "placeholder": "Enter Keywords",
                        "required": false,
                        "visible": true
                    }
                ]
            },
            "created_on": "2019-09-08T03:04:38.104Z",
            "last_modified_on": "2020-09-08T12:50:30.070Z",
            "rootOrgId": "*"
        }
    },
    "ver": "1.0"
}

export const genericEditorReviewFormResponse = {
    "id": "api.form.read",
    "params": {
        "resmsgid": "3f255e2a-c31a-4396-9d95-1e8b42b3ed61",
        "msgid": "9754ec68-3862-4489-9f3a-3eca797257e3",
        "status": "successful"
    },
    "responseCode": "OK",
    "result": {
        "form": {
            "type": "content",
            "subtype": "resource",
            "action": "review",
            "component": "*",
            "framework": "*",
            "data": {
                "templateName": "defaultTemplate",
                "action": "review",
                "fields": [
                    {
                        "code": "appicon",
                        "dataType": "url",
                        "description": "App Icon",
                        "editable": true,
                        "index": 1,
                        "inputType": "file",
                        "label": "App Icon",
                        "name": "App Icon",
                        "placeholder": "App Icon",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "name",
                        "dataType": "text",
                        "description": "Title of the content",
                        "editable": true,
                        "index": 2,
                        "inputType": "text",
                        "label": "Title",
                        "name": "Title",
                        "placeholder": "Enter Title",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "description",
                        "dataType": "text",
                        "description": "Brief description",
                        "editable": true,
                        "index": 3,
                        "inputType": "textarea",
                        "label": "Description",
                        "name": "Description",
                        "placeholder": "Brief description about the Book",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "keywords",
                        "dataType": "list",
                        "description": "Keywords for the content",
                        "editable": true,
                        "index": 4,
                        "inputType": "keywordsuggestion",
                        "label": "keywords",
                        "name": "Keywords",
                        "placeholder": "Enter Keywords",
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "domain",
                        "visible": true,
                        "depends": [
                            "subDomain"
                        ],
                        "editable": true,
                        "dataType": "list",
                        "renderingHints": {},
                        "description": "Domain",
                        "index": 5,
                        "label": "Domain",
                        "required": true,
                        "name": "Domain",
                        "inputType": "multiselect",
                        "placeholder": "Select Domain"
                    },
                    {
                        "code": "subDomain",
                        "visible": true,
                        "depends": [
                        ],
                        "editable": true,
                        "dataType": "list",
                        "renderingHints": {},
                        "description": "Sub Domain",
                        "index": 6,
                        "label": "Sub Domain",
                        "required": true,
                        "name": "Sub Domain",
                        "inputType": "multiselect",
                        "placeholder": "Sub Domain"
                    },
                    {
                        "code": "targetAgeGroup",
                        "dataType": "list",
                        "description": "Target Age group / Grade level (Who is the content targeted for?)",
                        "editable": true,
                        "index": 7,
                        "inputType": "multiselect",
                        "label": "Target Age group",
                        "name": "Target Age group",
                        "range": [
                            {
                                "key": "0-3 yrs",
                                "name": "0-3 yrs"
                            },
                            {
                                "key": "3-6 yrs",
                                "name": "3-6 yrs"
                            },
                            {
                                "key": "6-8 yrs",
                                "name": "6-8 yrs"
                            },
                            {
                                "key": "8-11 yrs",
                                "name": "8-11 yrs"
                            },
                            {
                                "key": "11-14 yrs",
                                "name": "11-14 yrs"
                            },
                            {
                                "key": "14-18 yrs",
                                "name": "14-18 yrs"
                            },
                            {
                                "key": "18 yrs +",
                                "name": "18 yrs +"
                            }
                        ],
                        "placeholder": "Target Age group",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "primaryUser",
                        "dataType": "list",
                        "description": "Primary User",
                        "editable": true,
                        "index": 8,
                        "inputType": "multiselect",
                        "label": "Primary User",
                        "name": "Primary User",
                        "range": [
                            {
                                "key": "Parents/Care givers",
                                "name": "Parents/Care givers"
                            },
                            {
                                "key": "Educators",
                                "name": "Educators"
                            },
                            {
                                "key": "Learners/Children",
                                "name": "Learners/Children"
                            }
                        ],
                        "placeholder": "Select Primary User",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "contentLanguage",
                        "dataType": "text",
                        "description": "Content Language",
                        "editable": true,
                        "index": 8,
                        "inputType": "select",
                        "label": "Content Language",
                        "name": "Content Language",
                        "range": [
                          {
                              "key": "English",
                              "name": "English"
                          },
                          {
                              "key": "Marathi",
                              "name": "Marathi"
                          },
                          {
                              "key": "Hindi",
                              "name": "Hindi"
                          },
                          {
                              "key": "Assamese",
                              "name": "Assamese"
                          },
                          {
                              "key": "Bengali",
                              "name": "Bengali"
                          },
                          {
                              "key": "Gujarati",
                              "name": "Gujarati"
                          },
                          {
                              "key": "Kannada",
                              "name": "Kannada"
                          },
                          {
                              "key": "Kashmiri",
                              "name": "Kashmiri"
                          },
                          {
                              "key": "Khasi",
                              "name": "Khasi"
                          },
                          {
                              "key": "Malayalam",
                              "name": "Malayalam"
                          },
                          {
                              "key": "Manipuri",
                              "name": "Manipuri"
                          },
                          {
                              "key": "Odia",
                              "name": "Odia"
                          },
                          {
                              "key": "Punjabi",
                              "name": "Punjabi"
                          },
                          {
                              "key": "Rabha (Rongdani)",
                              "name": "Rabha (Rongdani)"
                          },
                          {
                              "key": "Sanskrit",
                              "name": "Sanskrit"
                          },
                          {
                              "key": "Tamil",
                              "name": "Tamil"
                          },
                          {
                              "key": "Telugu",
                              "name": "Telugu"
                          },
                          {
                              "key": "Urdu",
                              "name": "Urdu"
                          }
                        ],
                        "placeholder": "Content Language",
                        "renderingHints": {},
                        "required": false,
                        "visible": true
                    },
                    {
                        "code": "program",
                        "dataType": "list",
                        "description": "Program",
                        "editable": true,
                        "index": 10,
                        "inputType": "multiselect",
                        "label": "Program",
                        "name": "Program",
                        "range": [
                          {
                              "name": "Hamara Gaon",
                              "value": "Hamara Gaon"
                          },
                          {
                              "name": "Early Childhood Education",
                              "value": "Early Childhood Education"
                          },
                          {
                              "name": "Inclusive Education (ENABLE)",
                              "value": "Inclusive Education (ENABLE)"
                          },
                          {
                              "name": "Elementary",
                              "value": "Elementary"
                          },
                          {
                              "name": "Second Chance",
                              "value": "Second Chance"
                          },
                          {
                              "name": "Digital Initiatives",
                              "value": "Digital Initiatives"
                          },
                          {
                              "name": "Vocational Training",
                              "value": "Vocational Training"
                          },
                          {
                              "name": "Pratham Council For Vulnerable Children",
                              "value": "Pratham Council For Vulnerable Children"
                          },
                          {
                              "name": "Annual Status of Education Report",
                              "value": "Annual Status of Education Report"
                          },
                          {
                              "name": "Pragyanpath",
                              "value": "Pragyanpath"
                          },
                          {
                              "name": "Open School",
                              "value": "Open School"
                          },
                          {
                              "name": "Other",
                              "value": "Other"
                          }
                        ],
                        "placeholder": "Please select an option",
                        "renderingHints": {},
                        "required": true,
                        "visible": true
                    }
                ]
            },
            "created_on": "2024-07-31T06:21:34.669Z",
            "last_modified_on": "2024-07-31T07:20:14.642Z",
            "rootOrgId": "*"
        }
    },
    "ts": "2024-10-10T12:25:59.637Z",
    "ver": "1.0"
}


export const genericEditorRequestForChangesFormResponse = {
  id: "api.form.read",
  params: {
    resmsgid: "fb345240-8d49-459d-a99c-4fcf3aa04da2",
    msgid: "b54b2ac7-2db4-406a-80f7-140d86bcccbb",
    status: "successful",
  },
  responseCode: "OK",
  result: {
    form: {
      type: "content",
      subtype: "resource",
      action: "requestforchanges",
      component: "*",
      framework: "*",
      data: {
        templateName: "defaultTemplate",
        action: "requestforchanges",
        fields: [
          {
            title:
              "Please confirm that ALL the following items are verified (by ticking the check-boxes) before you can publish:",
            contents: [
              {
                name: "Usability",
                checkList: [
                  "Correct Spellings and Grammar",
                  "Simple Language",
                  "Content/Audio/Video quality",
                  "Suitable font size for app and portal",
                  "Copyright infringement (images and texts)",
                ],
              },
              {
                name: "Content details",
                checkList: [
                  "Appropriate Title",
                  "Standard description of the course/resource",
                  "Relevant tags and keywords",
                  "Appropritae image ",
                ],
              },
            ],
          },
        ],
      },
      created_on: "2019-09-08T15:25:00.291Z",
      last_modified_on: "2020-08-24T06:06:08.120Z",
      rootOrgId: "*",
    },
  },
  ts: "2024-12-12T14:40:25.246Z",
  ver: "1.0",
};

export const telemetryResponse = {
  id: "api.telemetry.post",
  params: {
    status: "successful",
  },
  responseCode: "OK",
  result: {
    message: "This is mocked response",
  },
  ver: "1.0",
};

export const creatLockResponse = {
  id: "api.lock.create",
  params: {
    status: "successful",
  },
  responseCode: "OK",
  result: {
    lockKey: "69d82e1c-6d91-4b2e-a873-39ebeab007b9",
    expiresAt: "2026-10-09T12:53:41.138Z",
    expiresIn: 63072000,
  },
};

export const publishResourceFormResponse = {
  id: "api.form.read",
  params: {
    resmsgid: "0455438d-8bd5-4bfb-a97c-0d962cab1951",
    msgid: "2db53598-185f-44f9-a35c-e760e08fe62a",
    status: "successful",
  },
  responseCode: "OK",
  result: {
    form: {
      type: "content",
      subtype: "resource",
      action: "publish",
      component: "*",
      framework: "*",
      data: {
        templateName: "defaultTemplate",
        action: "publish",
        fields: [
          {
            title:
              "Please confirm that ALL the following items are verified (by ticking the check-boxes) before you can publish:",
            contents: [
              {
                name: "Usability",
                checkList: [
                  "Correct Spellings and Grammar",
                  "Simple Language",
                  "Content/Audio/Video quality",
                  "Suitable font size for app and portal",
                  "Copyright infringement (images and texts)",
                ],
              },
              {
                name: "Content details",
                checkList: [
                  "Appropriate Title",
                  "Standard description of the course/resource",
                  "Relevant tags and keywords",
                  "Appropritae image ",
                ],
              },
            ],
          },
        ],
      },
      created_on: "2019-09-08T15:25:39.638Z",
      last_modified_on: "2020-08-16T11:47:24.215Z",
      rootOrgId: "*",
    },
  },
  ts: "2024-12-24T05:46:18.384Z",
  ver: "1.0",
};

export const contentEditorQuestionFormResponse = {
  id: 'api.form.read',
  params: {
    resmsgid: '8437ee1d-b708-4f3f-9ec9-31d9a203a3c6',
    msgid: 'dd4e9440-9257-4c49-a668-7b79a6e6f83c',
    status: 'successful',
  },
  responseCode: 'OK',
  result: {
    form: {
      type: 'content',
      subtype: 'questions',
      action: 'question-filter-view',
      component: '*',
      framework: '*',
      data: {
        action: 'question-filter-view',
        templateName: 'filterMetaDataTemplate',
        fields: [
          {
            code: 'searchText',
            dataType: 'text',
            description: ' by question title',
            editable: true,
            inputType: 'text',
            label: 'Search',
            name: 'Search',
            index: 0,
            placeholder: 'Search by question title',
            renderingHints: {},
            required: false,
            visible: true,
          },
          {
            code: 'level',
            dataType: 'text',
            description: 'Add Notes',
            editable: true,
            index: 2,
            inputType: 'select',
            label: 'Difficulty',
            name: 'level',
            placeholder: 'Select Level',
            range: ['EASY', 'MEDIUM', 'DIFFICULT'],
            renderingHints: {},
            required: false,
            visible: true,
          },
          {
            code: 'questionType',
            dataType: 'list',
            description: 'Class',
            editable: true,
            index: 3,
            inputType: 'multiselect',
            label: 'Question Type',
            name: 'Question Type',
            placeholder: 'Question Type',
            range: [
              'Multiple Choice Questions',
              'Fill in the Blanks',
              'Match the Following',
            ],
            renderingHints: {},
            required: false,
            visible: true,
          },
          {
            code: 'myQuestions',
            dataType: 'toggle',
            description: 'My Questions',
            editable: true,
            inputType: 'checkbox',
            label: 'My Questions',
            name: 'My Questions',
            placeholder: 'My Questions',
            renderingHints: {},
            required: false,
            visible: true,
            index: 9,
          },
        ],
      },
      created_on: '2019-09-08T15:10:47.019Z',
      last_modified_on: '2020-08-16T11:48:08.835Z',
      rootOrgId: '*',
    },
  },
  ts: '2025-03-20T04:27:33.588Z',
  ver: '1.0',
};

export const contentEditorQuestionMetaFormResponse = {
  "id": "api.form.read",
  "params": {
    "resmsgid": "1d4dc61c-e66b-41ba-aed2-00509bd4c9b7",
      "msgid": "7f7f8182-5461-488d-93cc-3f6fdf11feaf",
      "status": "successful"
  },
  "responseCode": "OK",
  "result": {
      "form": {
          "type": "content",
          "subtype": "questions",
          "action": "question-meta-save",
          "component": "*",
          "framework": "*",
          "data": {
              "action": "question-meta-save",
              "templateName": "questionMetaDataTemplate",
              "fields": [
                  {
                      "code": "name",
                      "dataType": "text",
                      "description": "Title of the question",
                      "editable": true,
                      "inputType": "text",
                      "label": "Title",
                      "name": "Title",
                      "index": 0,
                      "placeholder": "Enter the Title",
                      "renderingHints": {},
                      "required": true,
                      "visible": true
                  },
                  {
                      "code": "description",
                      "dataType": "text",
                      "description": "Brief description",
                      "editable": true,
                      "inputType": "textarea",
                      "label": "Description",
                      "name": "Description",
                      "placeholder": "Enter the Description",
                      "renderingHints": {},
                      "required": false,
                      "visible": true,
                      "index": 1
                  },
                  {
                      "code": "medium",
                      "dataType": "text",
                      "description": "Language",
                      "editable": true,
                      "index": 8,
                      "inputType": "select",
                      "label": "Language",
                      "name": "Language",
                      "placeholder": "Select Language",
                      "renderingHints": {},
                      "required": false,
                      "visible": true
                  },
                  {
                      "code": "qlevel",
                      "dataType": "text",
                      "description": "Add Notes",
                      "editable": true,
                      "index": 3,
                      "inputType": "select",
                      "label": "Level",
                      "name": "qlevel",
                      "placeholder": "Select Level",
                      "range": [
                          "EASY",
                          "MEDIUM",
                          "DIFFICULT"
                      ],
                      "renderingHints": {},
                      "required": true,
                      "visible": true
                  },
                  {
                      "code": "max_score",
                      "dataType": "number",
                      "description": "",
                      "editable": true,
                      "index": 4,
                      "inputType": "number",
                      "label": "Max Score",
                      "name": "max_score",
                      "placeholder": "Enter the Max Score",
                      "renderingHints": {},
                      "required": true,
                      "visible": true,
                      "validation": [
                          {
                              "type": "min",
                              "value": "1",
                              "message": ""
                          }
                      ]
                  }
              ]
          },
          "created_on": "2020-08-19T11:42:18.732Z",
          "last_modified_on": "2020-08-16T11:48:17.934Z",
          "rootOrgId": "*"
      }
  },
  "ts": "2025-03-20T05:54:42.223Z",
  "ver": "1.0"
};
