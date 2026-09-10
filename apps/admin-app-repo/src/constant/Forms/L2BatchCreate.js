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
            "domain": {
                "type": "array",
                "title": "DOMAIN",
                "coreField": 0,
                "fieldId": "e5277d7b-e7ef-4a11-9a54-a8e6e7975383",
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
                },
            },
            "courses": {
                "type": "array",
                "title": "COURSES",
                "coreField": 0,
                "fieldId": "323d95c5-f217-44c7-a157-7a435df10f49",
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
                },
            }
        },
        "required": [
            "batch_type",
            "courses",
            "startdate",
            "enddate",
            "domain"
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
        "domain": {
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
            "domain",
            "courses"
        ]
    }
}