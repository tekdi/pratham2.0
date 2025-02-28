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

const Center = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(null);
  const [uiSchema, setUiSchema] = useState(null);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    setIsLoading(true);
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      let data = JSON.stringify({
        readForm: [
          {
            fetchUrl:
              'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=cohorts&contextType=cohort',
            header: {},
          },
          {
            fetchUrl:
              'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=cohorts&contextType=cohort',
            header: {
              tenantid: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
            },
          },
        ],
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
        uiSchema && <DynamicForm schema={schema} uiSchema={uiSchema} t={t}/>
      )}
    </>
  );
};

export default Center;
