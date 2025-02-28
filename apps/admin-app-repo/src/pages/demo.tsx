// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { setSeconds } from 'date-fns';
import Loader from '@/components/Loader';
import { GenerateSchemaAndUiSchema } from '@/components/GeneratedSchemas';
import { useTranslation } from 'react-i18next';

//import { DynamicForm } from '@shared-lib';

const demo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setIsLoading(true);
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      let data = JSON.stringify({
        fetchUrl:
          'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=cohorts&contextType=cohort',
        tenantid: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: '/api/dynamic-form/get-rjsf-form',
        headers: {
          'Content-Type': 'application/json',
        },
        data: data,
      };

      await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          if (response.data?.schema) {
            console.log(`schema`, response.data?.schema);
            setSchema(response.data?.schema);
          }
          if (response.data?.schema) {
            console.log(`uiSchema`, response.data?.uiSchema);
            setUiSchema(response.data?.uiSchema);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        schema &&
        uiSchema && <DynamicForm schema={schema} uiSchema={uiSchema} />
      )}
    </>
  );
};

export default demo;

/*
// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { setSeconds } from 'date-fns';
import Loader from '@/components/Loader';
import { GenerateSchemaAndUiSchema } from '@/components/GeneratedSchemas';
import { useTranslation } from 'react-i18next';

//import { DynamicForm } from '@shared-lib';

const demo = () => {
  const schema = {
    type: 'object',
    properties: {
      studentName: {
        type: 'string',
        title: 'Student Name',
        pattern: '^[A-Za-z ]+$',
      },
      rollNo: {
        type: 'string',
        title: 'Roll No',
        pattern: '^[0-9]{1,6}$',
      },
      gender: {
        type: 'string',
        title: 'Gender',
        enum: ['Male', 'Female', 'Other'],
      },
      lastEducation: {
        type: 'string',
        title: 'Last Completed Education',
        enum: ['SSC', 'HSC', 'Degree'],
      },
      state: {
        type: 'number',
        title: 'State',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: 'https://dev-interface.prathamdigital.org/interface/v1/fields/options/read',
          method: 'POST',
          payload: { fieldName: 'state', sort: ['state_name', 'asc'] },
          options: {
            optionObj: 'result.values',
            label: 'label',
            value: 'value',
          },
          callType: 'initial', // initial or dependent
        },
      },
      district: {
        type: 'number',
        title: 'District',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: 'https://dev-interface.prathamdigital.org/interface/v1/fields/options/read',
          method: 'POST',
          payload: {
            fieldName: 'district',
            controllingfieldfk: '**',
            sort: ['district_name', 'asc'],
          },
          options: {
            optionObj: 'result.values',
            label: 'label',
            value: 'value',
          },
          callType: 'dependent', // initial or dependent,
          dependent: 'state',
        },
      },
      block: {
        type: 'number',
        title: 'Block',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: 'https://dev-interface.prathamdigital.org/interface/v1/fields/options/read',
          method: 'POST',
          payload: {
            fieldName: 'block',
            controllingfieldfk: '**',
            sort: ['block_name', 'asc'],
          },
          options: {
            optionObj: 'result.values',
            label: 'label',
            value: 'value',
          },
          callType: 'dependent', // initial or dependent,
          dependent: 'district',
        },
      },
      village: {
        type: 'number',
        title: 'Village',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: 'https://dev-interface.prathamdigital.org/interface/v1/fields/options/read',
          method: 'POST',
          payload: {
            fieldName: 'village',
            controllingfieldfk: '**',
            sort: ['village_name', 'asc'],
          },
          options: {
            optionObj: 'result.values',
            label: 'label',
            value: 'value',
          },
          callType: 'dependent', // initial or dependent,
          dependent: 'block',
        },
      },
      board: {
        type: 'string',
        title: 'Board',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: '/api/dynamic-form/get-framework',
          method: 'POST',
          payload: {
            code: 'board',
            fetchUrl:
              'https://qa-lap.prathamdigital.org/api/framework/v1/read/scp-framework',
          },
          options: {
            optionObj: 'options',
            label: 'label',
            value: 'value',
          },
          callType: 'initial', // initial or dependent,
        },
      },
      medium: {
        type: 'string',
        title: 'Medium',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: '/api/dynamic-form/get-framework',
          method: 'POST',
          payload: {
            code: 'board',
            findcode: 'medium',
            selectedvalue: '**',
            fetchUrl:
              'https://qa-lap.prathamdigital.org/api/framework/v1/read/scp-framework',
          },
          options: {
            optionObj: 'options',
            label: 'label',
            value: 'value',
          },
          callType: 'dependent', // initial or dependent,
          dependent: 'board',
        },
      },
      grade: {
        type: 'string',
        title: 'Grade',
        enum: ['Select'], // Clear the enum
        enumNames: ['Select'], // Clear the enumNames
        api: {
          url: '/api/dynamic-form/get-framework',
          method: 'POST',
          payload: {
            code: 'medium',
            findcode: 'gradeLevel',
            selectedvalue: '**',
            fetchUrl:
              'https://qa-lap.prathamdigital.org/api/framework/v1/read/scp-framework',
          },
          options: {
            optionObj: 'options',
            label: 'label',
            value: 'value',
          },
          callType: 'dependent', // initial or dependent,
          dependent: 'medium',
        },
      },
    },
    dependencies: {
      lastEducation: {
        oneOf: [
          {
            properties: {
              lastEducation: { const: 'SSC' },
              schoolName: { type: 'string', title: 'School Name' },
              percentage: {
                type: 'number',
                title: 'Percentage',
                minimum: 0,
                maximum: 100,
              },
            },
          },
          {
            properties: {
              lastEducation: { const: 'HSC' },
              collegeName: { type: 'string', title: 'College Name' },
              percentage: {
                type: 'number',
                title: 'Percentage',
                minimum: 0,
                maximum: 100,
              },
            },
          },
          {
            properties: {
              lastEducation: { const: 'Degree' },
              degreeCollege: {
                type: 'string',
                title: "Model's Degree College",
              },
              modelGrade: {
                type: 'string',
                title: 'Model Grade Received',
                enum: ['A', 'B', 'C', 'D'],
              },
            },
          },
        ],
      },
    },
  };

  const uiSchema = {
    studentName: {
      'ui:autofocus': true,
      'ui:emptyValue': '',
      'ui:options': { liveValidate: true },
    },
    rollNo: {
      'ui:options': { liveValidate: true },
    },
    lastEducation: {
      'ui:order': [
        'lastEducation',
        'schoolName',
        'collegeName',
        'degreeCollege',
        'percentage',
        'modelGrade',
      ],
    },
    percentage: {
      'ui:options': { liveValidate: true },
    },
    state: { 'ui:widget': 'select' },
    state: { 'ui:widget': 'hidden' },
    phoneDetails: { 'ui:widget': 'select' },
    district: { 'ui:widget': 'select' },
  };

  return <DynamicForm schema={schema} uiSchema={uiSchema} />;
};

export default demo;
*/
