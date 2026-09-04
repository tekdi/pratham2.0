export const L2BatchCreate = {
    "schema": {
        "type": "object",
        "properties": {
            "name": {
                "type": "string",
                "title": "UNIT_NAME",
                "coreField": 1,
                "fieldId": null,
                "field_type": "text",
                "pattern": "^[a-zA-Z0-9][a-zA-Z0-9 .'-]*[a-zA-Z0-9]$"
            },
            "batch_type": {
                "type": "string",
                "title": "TYPE_OF_BATCH",
                "coreField": 0,
                "fieldId": "0417d8fd-47ae-4ec4-9b3b-3f8fdca31625",
                "field_type": "radio",
                "isRequired": true,
                "enum": [
                    "regular",
                    "remote",
                    "hybrid"
                ],
                "enumNames": [
                    "REGULAR",
                    "REMOTE",
                    "HYBRID"
                ]
            },
             "startdate": {
                "type": "string",
                "title": "START_DATE",
                "coreField": 0,
                "fieldId": "526ef5e9-667f-4790-98a8-e789ce9d5be0",
                "field_type": "text",
                "isRequired": true
            },
            "enddate": {
                "type": "string",
                "title": "END_DATE",
                "coreField": 0,
                "fieldId": "5344eb96-810e-4696-ae98-1d9c2b7574b3",
                "field_type": "text",
                "isRequired": true
            },
            "industry": {
                "type": "array",
                "title": "INDUSTRY",
                "coreField": 0,
                "fieldId": "8704db2a-33a9-4438-8ba7-7404b3aa55e7",
                "field_type": "drop_down",
                "maxSelection": 1,
                "isMultiSelect": true,
                "uniqueItems": true,
                "items": {
                    "type": "string",
                    "enum": [
                        "Select"
                    ],
                    "enumNames": [
                        "Select"
                    ]
                }
            },
            "courses": {
                "type": "array",
                "title": "COURSES",
                "coreField": 0,
                "fieldId": "d327b384-ccc7-4971-8bca-53b588ea98c5",
                "field_type": "drop_down",
                "maxSelection": 1,
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
                }
            }
        },
        "required": [
            "batch_type",
            "courses",
            "startdate",
            "enddate",
            "industry",
            "courses"
        ]
    },
    "uiSchema": {
        "name": {
            "ui:widget": "CustomTextFieldWidget",
            "ui:options": {
                "validateOnBlur": true,
                "hideError": true
            }
        },
        "industry": {
            "ui:widget": "AutoCompleteMultiSelectWidget",
            "ui:options": {
                "multiple": true,
                "uniqueItems": true,
                "hideError": false
            }
        },
        "batch_type": {
            "ui:widget": "CustomRadioWidget",
            "ui:options": {
                "hideError": true
            }
        },
        "courses": {
            "ui:widget": "AutoCompleteMultiSelectWidget",
            "ui:options": {
                "multiple": true,
                "uniqueItems": true,
                "hideError": false
            }
        },
        "startdate": {
            "ui:widget": "CustomDateWidget",
            "ui:options": {
                "validateOnBlur": true,
                "hideError": true
            }
        },
        "enddate": {
            "ui:widget": "CustomDateWidget",
            "ui:options": {
                "validateOnBlur": true,
                "hideError": true
            }
        },
        "ui:order": [
            "name",
            "batch_type",
            "startdate",
            "enddate",
            "industry",
            "courses"
        ]
    }
}