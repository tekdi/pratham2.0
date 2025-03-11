const mockedFields = [
    {
        "hint": null,
        "name": "firstName",
        "type": "text",
        "label": "first_name",
        "order": "1",
        "fieldId": null,
        "options": [],
        "pattern": "/^[A-Za-z]+$/",
        "coreField": 1,
        "dependsOn": null,
        "maxLength": null,
        "minLength": 3,
        "isEditable": true,
        "isPIIField": null,
        "isRequired": true,
        "validation": [
            "string"
        ],
        "placeholder": "ENTER_FIRST_NAME",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "hint": null,
        "name": "middleName",
        "type": "text",
        "label": "middle_name",
        "order": "1",
        "fieldId": null,
        "options": [],
        "pattern": "/^[A-Za-z]+$/",
        "coreField": 1,
        "dependsOn": null,
        "maxLength": null,
        "minLength": 3,
        "isEditable": true,
        "isPIIField": null,
        "isRequired": false,
        "validation": [
            "string"
        ],
        "placeholder": "ENTER_MIDDLE_NAME_OR_FATHER_NAME",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "hint": null,
        "name": "lastName",
        "type": "text",
        "label": "last_name",
        "order": "1",
        "fieldId": null,
        "options": [],
        "pattern": "/^[A-Za-z]+$/",
        "coreField": 1,
        "dependsOn": null,
        "maxLength": null,
        "minLength": 3,
        "isEditable": true,
        "isPIIField": null,
        "isRequired": true,
        "validation": [
            "string"
        ],
        "placeholder": "ENTER_LAST_NAME",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "hint": null,
        "name": "dob",
        "type": "date",
        "label": "dob",
        "order": "2",
        "fieldId": null,
        "options": [],
        "pattern": null,
        "coreField": 1,
        "dependsOn": null,
        "maxLength": null,
        "minLength": null,
        "isEditable": true,
        "isPIIField": null,
        "isRequired": true,
        "validation": [
            "date"
        ],
        "placeholder": "ENTER_DATE_OF_BIRTH",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "hint": null,
        "name": "gender",
        "type": "radio",
        "label": "WHATS_YOUR_GENDER",
        "order": "2",
        "fieldId": null,
        "options": [
            {
                "label": "MALE",
                "value": "male"
            },
            {
                "label": "FEMALE",
                "value": "female"
            },
            {
                "label": "TRANSGENDER",
                "value": "transgender"
            }
        ],
        "pattern": null,
        "coreField": 1,
        "dependsOn": null,
        "maxLength": null,
        "minLength": null,
        "isEditable": true,
        "isPIIField": null,
        "isRequired": true,
        "validation": [
            "string"
        ],
        "placeholder": "",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "hint": null,
        "name": "email",
        "type": "email",
        "label": "email",
        "order": "2",
        "fieldId": null,
        "options": [],
        "pattern": "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/",
        "coreField": 1,
        "dependsOn": null,
        "maxLength": null,
        "minLength": null,
        "isEditable": true,
        "isPIIField": null,
        "isRequired": false,
        "validation": [
            "string"
        ],
        "placeholder": "ENTER_EMAIL",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "hint": null,
        "name": "mobile",
        "type": "numeric",
        "label": "phone_number",
        "order": "2",
        "fieldId": null,
        "options": [],
        "pattern": "/^[6-9]\\d{9}$/",
        "coreField": 1,
        "dependsOn": null,
        "maxLength": 10,
        "minLength": 10,
        "isEditable": true,
        "isPIIField": true,
        "isRequired": true,
        "validation": [
            "mobile"
        ],
        "placeholder": "ENTER_PHONE_NUMBER",
        "isMultiSelect": false,
        "maxSelections": 0,
        "sourceDetails": {}
    },
    {
        "api": {
            "url": "https://dev-interface.prathamdigital.org/interface/v1/fields/options/read",
            "method": "POST",
            "options": {
                "label": "label",
                "value": "value",
                "optionObj": "result.values"
            },
            "payload": {
                "sort": [
                    "state_name",
                    "asc"
                ],
                "fieldName": "state"
            },
            "callType": "initial"
        },
        "order": "3",
        "fieldId": "6469c3ac-8c46-49d7-852a-00f9589737c5",
        "coreField": 0,
        "label": "STATE",
        "name": "state",
        "type": "drop_down",
        "isRequired": false,
        "isEditable": null,
        "isHidden": null,
        "isPIIField": null,
        "placeholder": "",
        "validation": {
            "isEditable": true,
            "isRequired": false,
            "isMultiSelect": true,
            "maxSelections": 1
        },
        "options": [
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {}
        ],
        "isMultiSelect": false,
        "maxSelections": null,
        "hint": null,
        "pattern": null,
        "maxLength": null,
        "minLength": null,
        "dependsOn": false,
        "sourceDetails": {
            "table": "state",
            "source": "table"
        },
        "ordering": 17,
        "default": {
            "isEditable": true,
            "isRequired": false,
            "isMultiSelect": true,
            "maxSelections": 1
        }
    },
    {
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
                "fetchUrl": "https://dev-middleware.prathamdigital.org/api/framework/v1/read/scp-framework"
            },
            "callType": "initial"
        },
        "order": "1",
        "fieldId": "f93c0ac3-f827-4794-9457-441fa1057b42",
        "coreField": 0,
        "label": "BOARD",
        "name": "board",
        "type": "drop_down",
        "isRequired": false,
        "isEditable": null,
        "isHidden": null,
        "isPIIField": null,
        "placeholder": "",
        "validation": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": false,
            "isMultiSelect": true,
            "maxSelections": 2
        },
        "options": [],
        "isMultiSelect": false,
        "maxSelections": null,
        "hint": null,
        "pattern": null,
        "maxLength": null,
        "minLength": null,
        "dependsOn": false,
        "sourceDetails": {
            "externalsource": "/api/framework/v1/read/scp-framework"
        },
        "ordering": 0,
        "default": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": false,
            "isMultiSelect": true,
            "maxSelections": 2
        }
    },
    {
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
                "fetchUrl": "https://dev-middleware.prathamdigital.org/api/framework/v1/read/scp-framework",
                "findcode": "medium",
                "selectedvalue": "**"
            },
            "callType": "dependent",
            "dependent": "board"
        },
        "order": "2",
        "fieldId": "7b214a17-5a07-4ee0-bedc-271429862d30",
        "coreField": 0,
        "label": "MEDIUM",
        "name": "medium",
        "type": "drop_down",
        "isRequired": false,
        "isEditable": null,
        "isHidden": null,
        "isPIIField": null,
        "placeholder": "",
        "validation": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": true,
            "isMultiSelect": true,
            "maxSelections": 1
        },
        "options": [],
        "isMultiSelect": false,
        "maxSelections": null,
        "hint": null,
        "pattern": null,
        "maxLength": null,
        "minLength": null,
        "dependsOn": "board",
        "sourceDetails": {
            "externalsource": "/api/framework/v1/read/scp-framework"
        },
        "ordering": 25,
        "default": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": true,
            "isMultiSelect": true,
            "maxSelections": 1
        }
    },
    {
        "api": {
            "url": "/api/dynamic-form/get-framework",
            "method": "POST",
            "options": {
                "label": "label",
                "value": "value",
                "optionObj": "options"
            },
            "payload": {
                "code": "medium",
                "fetchUrl": "https://dev-middleware.prathamdigital.org/api/framework/v1/read/scp-framework",
                "findcode": "gradeLevel",
                "selectedvalue": "**"
            },
            "callType": "dependent",
            "dependent": "medium"
        },
        "order": "3",
        "fieldId": "5a2dbb89-bbe6-4aa8-b541-93e01ab07b70",
        "coreField": 0,
        "label": "GRADE",
        "name": "grade",
        "type": "drop_down",
        "isRequired": false,
        "isEditable": null,
        "isHidden": null,
        "isPIIField": null,
        "placeholder": "",
        "validation": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": true,
            "isMultiSelect": true,
            "maxSelections": 1
        },
        "options": [],
        "isMultiSelect": false,
        "maxSelections": null,
        "hint": null,
        "pattern": null,
        "maxLength": null,
        "minLength": null,
        "dependsOn": "medium",
        "sourceDetails": {
            "externalsource": "/api/framework/v1/read/scp-framework"
        },
        "ordering": 25,
        "default": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": true,
            "isMultiSelect": true,
            "maxSelections": 1
        }
    },
    {
        "api": {
            "url": "/api/dynamic-form/get-framework",
            "method": "POST",
            "options": {
                "label": "label",
                "value": "value",
                "optionObj": "options"
            },
            "payload": {
                "code": "gradeLevel",
                "fetchUrl": "https://dev-middleware.prathamdigital.org/api/framework/v1/read/scp-framework",
                "findcode": "subject",
                "selectedvalue": "**"
            },
            "callType": "dependent",
            "dependent": "grade"
        },
        "order": "4",
        "fieldId": "69a9dba2-e05e-40cd-a39c-047b9b676b5c",
        "coreField": 0,
        "label": "SUBJECT",
        "name": "subject",
        "type": "drop_down",
        "isRequired": false,
        "isEditable": null,
        "isHidden": null,
        "isPIIField": null,
        "placeholder": "",
        "validation": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": true
        },
        "options": [],
        "isMultiSelect": false,
        "maxSelections": null,
        "hint": null,
        "pattern": null,
        "maxLength": null,
        "minLength": null,
        "dependsOn": "grade",
        "sourceDetails": {
            "externalsource": "/api/framework/v1/read/scp-framework"
        },
        "ordering": 25,
        "default": {
            "isHidden": true,
            "isEditable": true,
            "isRequired": true
        }
    }
]

export default mockedFields;