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
    // {
    //     "order": "3",
    //     "fieldId": "cb407d11-f1c5-424c-a422-4755a1c4ab29",
    //     "coreField": 0,
    //     "label": "DESIGNATION",
    //     "name": "designation",
    //     "type": "radio",
    //     "isRequired": false,
    //     "isEditable": null,
    //     "isHidden": null,
    //     "isPIIField": null,
    //     "placeholder": "",
    //     "validation": {
    //         "default": "facilitator",
    //         "isEditable": false,
    //         "isRequired": true,
    //         "isMultiSelect": false
    //     },
    //     "options": [
    //         {
    //             "label": "Facilitator",
    //             "value": "facilitator"
    //         },
    //         {
    //             "label": "Team Leader",
    //             "value": "team_leader"
    //         }
    //     ],
    //     "isMultiSelect": false,
    //     "maxSelections": null,
    //     "hint": null,
    //     "pattern": null,
    //     "maxLength": null,
    //     "minLength": null,
    //     "dependsOn": false,
    //     "sourceDetails": {
    //         "source": "fieldparams"
    //     },
    //     "ordering": 1,
    //     "default": {
    //         "default": "facilitator",
    //         "isEditable": false,
    //         "isRequired": true,
    //         "isMultiSelect": false
    //     }
    // },
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
    }
]

export default mockedFields;