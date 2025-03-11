// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import CustomObjectFieldTemplate from './CustomObjectFieldTemplate';
import CustomFieldTemplate from './CustomFieldTemplate';
import { TextField, Container, Typography } from '@mui/material';
import { useTranslation } from 'next-i18next';
const DynamicForm = ({
  schema,
  uiSchema,
  SubmitaFunction,
  isCallSubmitInHandle,
  prefilledFormData,
  FormSubmitFunction,
  extraFields,
}) => {
  const { t } = useTranslation();

  const [submitted, setSubmitted] = useState(false);
  const [formSchema, setFormSchema] = useState(schema);
  const [formUiSchemaOriginal, setFormUiSchemaOriginal] = useState(uiSchema);
  const [formUiSchema, setFormUiSchema] = useState(uiSchema);
  const [formData, setFormData] = useState({});
  const [dependentSchema, setDependentSchema] = useState([]);
  const [isInitialCompleted, setIsInitialCompleted] = useState(false);
  const [hideAndSkipFields, setHideAndSkipFields] = useState({});
  const [isRenderCompleted, setIsRenderCompleted] = useState(false);

  useEffect(() => {
    if (isInitialCompleted === true) {
      // setFormData;
      renderPrefilledForm();
    }
  }, [isInitialCompleted]);

  useEffect(() => {
    if (isCallSubmitInHandle) {
      SubmitaFunction(formData);
    }
  }, [formData]);

  useEffect(() => {
    if (isRenderCompleted === true) {
      handleChange({ formData: prefilledFormData });
    }
  }, [isRenderCompleted]);

  useEffect(() => {
    function extractSkipAndHide(schema: any): Record<string, any> {
      const skipAndHideMap: Record<string, any> = {};

      Object.entries(schema.properties).forEach(
        ([key, value]: [string, any]) => {
          if (value.extra?.skipAndHide) {
            skipAndHideMap[key] = value.extra.skipAndHide;
          }
        }
      );

      return skipAndHideMap;
    }
    const extractedSkipAndHide = extractSkipAndHide(schema);
    setHideAndSkipFields(extractedSkipAndHide);
    console.log('extractedSkipAndHide', extractedSkipAndHide);
    console.log('formUiSchema', uiSchema);
  }, [schema]);

  const prevFormData = useRef({});

  useEffect(() => {
    const fetchApiData = async (schema) => {
      const initialApis = extractApiProperties(schema, 'initial');
      const dependentApis = extractApiProperties(schema, 'dependent');
      setDependentSchema(dependentApis);
      // console.log('!!!', initialApis);
      try {
        const apiRequests = initialApis.map((field) => {
          const { api } = field;
          const config = {
            method: api.method,
            url: api.url,
            headers: { 'Content-Type': 'application/json' },
            ...(api.method === 'POST' && { data: api.payload }),
          };
          return axios(config).then((response) => ({
            fieldKey: field.key,
            data: getNestedValue(response.data, api.options.optionObj),
          }));
        });

        const responses = await Promise.all(apiRequests);
        console.log('API Responses:', responses);
        // Update schema dynamically
        setFormSchema((prevSchema) => {
          const updatedProperties = { ...prevSchema.properties };
          responses.forEach(({ fieldKey, data }) => {
            // console.log('Data:', data);
            // console.log('fieldKey:', fieldKey);
            let label = prevSchema.properties[fieldKey].api.options.label;
            let value = prevSchema.properties[fieldKey].api.options.value;
            updatedProperties[fieldKey] = {
              ...updatedProperties[fieldKey],
              enum: data
                ? data.map((item) => item?.[value].toString())
                : ['Select'],
              enumNames: data
                ? data.map((item) => item?.[label].toString())
                : ['Select'],
            };
          });
          return { ...prevSchema, properties: updatedProperties };
        });
        //setIsInitialCompleted
        setIsInitialCompleted(true);
      } catch (error) {
        // console.error("Error fetching API data:", error);
      }
    };

    const getNestedValue = (obj, path) => {
      // console.log("@@@@", obj)
      // console.log("path", path)
      if (path === '') {
        return obj;
      } else {
        return path.split('.').reduce((acc, key) => acc && acc[key], obj);
      }
    };

    // Call the function
    fetchApiData(schema);

    console.log('formSchema !!!!!', formSchema);
    //replace title with language constant
    const updateSchemaTitles = (schema, t) => {
      if (!schema || typeof schema !== 'object') return schema;

      const updatedSchema = { ...schema };

      if (updatedSchema.title) {
        updatedSchema.title = t(updatedSchema.title);
      }

      if (updatedSchema.properties) {
        updatedSchema.properties = Object.keys(updatedSchema.properties).reduce(
          (acc, key) => {
            acc[key] = updateSchemaTitles(updatedSchema.properties[key], t);
            return acc;
          },
          {}
        );
      }

      return updatedSchema;
    };
    // Dynamically update schema titles
    const translatedSchema = updateSchemaTitles(formSchema, t);
    setFormSchema(translatedSchema);
  }, []);

  // console.log('schema', schema)
  const extractApiProperties = (schema, callType) => {
    return Object.entries(schema.properties)
      .filter(([_, value]) => value.api && value.api.callType === callType)
      .map(([key, value]) => ({ key, ...value }));
  };

  const renderPrefilledForm = () => {
    const temp_prefilled_form = { ...prefilledFormData };
    console.log('temp', temp_prefilled_form);
    const dependentApis = extractApiProperties(schema, 'dependent');
    const initialApis = extractApiProperties(schema, 'initial');
    // console.log('initialApis', initialApis);
    console.log('dependentFields', dependentApis);
    if (dependentApis.length > 0 && initialApis.length > 0) {
      let initialKeys = initialApis.map((item) => item.key);
      let dependentKeys = dependentApis.map((item) => item.key);
      dependentKeys = [...initialKeys, ...dependentKeys];
      console.log('dependentKeys', dependentKeys);
      console.log('prefilledFormData', temp_prefilled_form);
      const removeDependentKeys = (formData, keysToRemove) => {
        const updatedData = { ...formData };
        keysToRemove.forEach((key) => delete updatedData[key]);
        return updatedData;
      };
      let updatedFormData = removeDependentKeys(
        temp_prefilled_form,
        dependentKeys
      );
      // console.log('updatedFormData', updatedFormData);
      setFormData(updatedFormData);

      //prefill other dependent keys
      const filterDependentKeys = (
        formData: Record<string, any>,
        keysToKeep: string[]
      ) => {
        return Object.fromEntries(
          Object.entries(formData).filter(([key]) => keysToKeep.includes(key))
        );
      };
      let filteredFormData = filterDependentKeys(
        temp_prefilled_form,
        dependentKeys
      );
      console.log('filteredFormData', filteredFormData);
      const filteredFormDataKey = Object.keys(filteredFormData);
      console.log('filteredFormDataKey', filteredFormDataKey);
      let filterDependentApis = [];
      for (let i = 0; i < filteredFormDataKey.length; i++) {
        filterDependentApis.push({
          key: filteredFormDataKey[i],
          data: schema.properties[filteredFormDataKey[i]],
        });
      }
      console.log('filterDependentApis', filterDependentApis);
      //dependent calls
      const workingSchema = filterDependentApis;

      const getNestedValue = (obj, path) => {
        if (path === '') {
          return obj;
        } else {
          return path.split('.').reduce((acc, key) => acc && acc[key], obj);
        }
      };

      const fetchDependentApis = async () => {
        // Filter only the dependent APIs based on the changed field
        const dependentApis = workingSchema;
        try {
          console.log('dependentApis dependentApis', dependentApis);
          const apiRequests = dependentApis.map((realField) => {
            const field = realField?.data;
            const { api } = realField?.data;
            const key = realField?.key;

            console.log('API field:', field);

            const changedField = field?.api?.dependent;
            const changedFieldValue = temp_prefilled_form[changedField];

            // Replace "**" in the payload with changedFieldValue
            const updatedPayload = JSON.parse(
              JSON.stringify(api.payload).replace(/\*\*/g, changedFieldValue)
            );

            const config = {
              method: api.method,
              url: api.url,
              headers: { 'Content-Type': 'application/json' },
              ...(api.method === 'POST' && { data: updatedPayload }),
            };

            if (key) {
              const changedField = key;

              // console.log(`Field changed: ${changedField}, New Value: ${formData[changedField]}`);
              // console.log('dependentSchema', dependentSchema);
              const workingSchema1 = dependentSchema?.filter(
                (item) => item.api && item.api.dependent === changedField
              );
              // console.log('workingSchema1', workingSchema1);
              if (workingSchema1.length > 0) {
                const changedFieldValue = temp_prefilled_form[changedField];

                const getNestedValue = (obj, path) => {
                  if (path === '') {
                    return obj;
                  } else {
                    return path
                      .split('.')
                      .reduce((acc, key) => acc && acc[key], obj);
                  }
                };

                const fetchDependentApis = async () => {
                  // Filter only the dependent APIs based on the changed field
                  const dependentApis = workingSchema1;
                  try {
                    const apiRequests = dependentApis.map((field) => {
                      const { api, key } = field;

                      // Replace "**" in the payload with changedFieldValue
                      const updatedPayload = JSON.parse(
                        JSON.stringify(api.payload).replace(
                          /\*\*/g,
                          changedFieldValue
                        )
                      );

                      const config = {
                        method: api.method,
                        url: api.url,
                        headers: { 'Content-Type': 'application/json' },
                        ...(api.method === 'POST' && { data: updatedPayload }),
                      };

                      return axios(config).then((response) => ({
                        fieldKey: field.key,
                        data: getNestedValue(
                          response.data,
                          api.options.optionObj
                        ),
                      }));
                    });

                    const responses = await Promise.all(apiRequests);
                    // console.log('API Responses:', responses);
                    setFormSchema((prevSchema) => {
                      const updatedProperties = { ...prevSchema.properties };
                      responses.forEach(({ fieldKey, data }) => {
                        // console.log('Data:', data);
                        // console.log('fieldKey:', fieldKey);
                        let label =
                          prevSchema.properties[fieldKey].api.options.label;
                        let value =
                          prevSchema.properties[fieldKey].api.options.value;
                        updatedProperties[fieldKey] = {
                          ...updatedProperties[fieldKey],
                          enum: data.map((item) => item?.[value].toString()),
                          enumNames: data.map((item) =>
                            item?.[label].toString()
                          ),
                        };
                      });

                      return { ...prevSchema, properties: updatedProperties };
                    });
                  } catch (error) {
                    console.error('Error fetching dependent APIs:', error);
                  }
                };

                // Call the function
                fetchDependentApis();
              }
            }

            return axios(config).then((response) => ({
              fieldKey: key,
              data: getNestedValue(response.data, api.options.optionObj),
            }));
          });

          const responses = await Promise.all(apiRequests);
          console.log('API Responses:', responses);
          setFormSchema((prevSchema) => {
            const updatedProperties = { ...prevSchema.properties };
            responses.forEach(({ fieldKey, data }) => {
              console.log('Data:', data);
              console.log('fieldKey:', fieldKey);
              let label = prevSchema.properties[fieldKey].api.options.label;
              let value = prevSchema.properties[fieldKey].api.options.value;
              updatedProperties[fieldKey] = {
                ...updatedProperties[fieldKey],
                enum: data.map((item) => item?.[value].toString()),
                enumNames: data.map((item) => item?.[label].toString()),
              };
            });

            return { ...prevSchema, properties: updatedProperties };
          });
        } catch (error) {
          console.error('Error fetching dependent APIs:', error);
        }
      };

      // Call the function
      fetchDependentApis();

      //setFormData
      setFormData(temp_prefilled_form);

      function getSkipKeys(skipHideObject, formData) {
        let skipKeys = [];

        Object.keys(skipHideObject).forEach((key) => {
          if (formData[key] && skipHideObject[key][formData[key]]) {
            skipKeys = skipKeys.concat(skipHideObject[key][formData[key]]);
          }
        });

        return skipKeys;
      }

      const skipKeys = getSkipKeys(hideAndSkipFields, temp_prefilled_form);
      console.log('skipKeys', skipKeys);
      let updatedUISchema = formUiSchemaOriginal;
      function hideFieldsInUISchema(uiSchema, fieldsToHide) {
        const updatedUISchema = { ...uiSchema };

        fieldsToHide.forEach((field) => {
          if (updatedUISchema[field]) {
            updatedUISchema[field] = {
              ...updatedUISchema[field],
              originalWidget: updatedUISchema[field]['ui:widget'], // Store original widget type
              'ui:widget': 'hidden',
            };
          }
        });

        return updatedUISchema;
      }
      const hiddenUISchema = hideFieldsInUISchema(updatedUISchema, skipKeys);
      setFormUiSchema(hiddenUISchema);
    }
    //Code patch: bug solved for prefilled dependent field options render
    setIsRenderCompleted(true);
  };

  const getDependentKeys = (schema, startKey) => {
    const properties = schema.properties;
    const dependentKeys = [];

    const findDependencies = (key) => {
      Object.keys(properties).forEach((propKey) => {
        const field = properties[propKey];
        if (field.api && field.api.dependent === key) {
          dependentKeys.push(propKey);
          findDependencies(propKey); // Recursively check deeper dependencies
        }
      });
    };

    findDependencies(startKey);
    return dependentKeys;
  };

  const handleChange = ({ formData }: { formData: any }) => {
    const changedField = Object.keys(formData).find(
      (key) => formData[key] !== prevFormData.current[key]
    );

    if (changedField) {
      //find out all dependent keys
      const dependentKeyArray = getDependentKeys(schema, changedField);
      console.log('dependent keys:', dependentKeyArray);
      dependentKeyArray.forEach((key) => {
        delete formData[key]; // Remove the key from formData
      });
      setFormSchema((prevSchema) => {
        const updatedProperties = { ...prevSchema.properties };

        dependentKeyArray.forEach((key) => {
          if (updatedProperties[key]) {
            updatedProperties[key] = {
              ...updatedProperties[key],
              enum: ['Select'], // Clear the enum
              enumNames: ['Select'], // Clear the enumNames
            };
          }
        });

        return { ...prevSchema, properties: updatedProperties };
      });

      // console.log(`Field changed: ${changedField}, New Value: ${formData[changedField]}`);
      // console.log('dependentSchema', dependentSchema);
      const workingSchema = dependentSchema?.filter(
        (item) => item.api && item.api.dependent === changedField
      );
      // console.log('workingSchema', workingSchema);
      if (workingSchema.length > 0) {
        const changedFieldValue = formData[changedField];

        const getNestedValue = (obj, path) => {
          if (path === '') {
            return obj;
          } else {
            return path.split('.').reduce((acc, key) => acc && acc[key], obj);
          }
        };

        const fetchDependentApis = async () => {
          // Filter only the dependent APIs based on the changed field
          const dependentApis = workingSchema;
          try {
            const apiRequests = dependentApis.map((field) => {
              const { api, key } = field;

              // Replace "**" in the payload with changedFieldValue
              const updatedPayload = JSON.parse(
                JSON.stringify(api.payload).replace(/\*\*/g, changedFieldValue)
              );

              const config = {
                method: api.method,
                url: api.url,
                headers: { 'Content-Type': 'application/json' },
                ...(api.method === 'POST' && { data: updatedPayload }),
              };

              return axios(config).then((response) => ({
                fieldKey: field.key,
                data: getNestedValue(response.data, api.options.optionObj),
              }));
            });

            const responses = await Promise.all(apiRequests);
            // console.log('API Responses:', responses);
            setFormSchema((prevSchema) => {
              const updatedProperties = { ...prevSchema.properties };
              responses.forEach(({ fieldKey, data }) => {
                // console.log('Data:', data);
                // console.log('fieldKey:', fieldKey);
                let label = prevSchema.properties[fieldKey].api.options.label;
                let value = prevSchema.properties[fieldKey].api.options.value;
                updatedProperties[fieldKey] = {
                  ...updatedProperties[fieldKey],
                  enum: data.map((item) => item?.[value].toString()),
                  enumNames: data.map((item) => item?.[label].toString()),
                };
              });

              return { ...prevSchema, properties: updatedProperties };
            });
          } catch (error) {
            console.error('Error fetching dependent APIs:', error);
          }
        };

        // Call the function
        fetchDependentApis();
      }
    }

    prevFormData.current = formData;
    console.log('Form data changed:', formData);
    setFormData(formData);

    function getSkipKeys(skipHideObject, formData) {
      let skipKeys = [];

      Object.keys(skipHideObject).forEach((key) => {
        if (formData[key] && skipHideObject[key][formData[key]]) {
          skipKeys = skipKeys.concat(skipHideObject[key][formData[key]]);
        }
      });

      return skipKeys;
    }

    const skipKeys = getSkipKeys(hideAndSkipFields, formData);
    console.log('skipKeys', skipKeys);
    let updatedUISchema = formUiSchemaOriginal;
    function hideFieldsInUISchema(uiSchema, fieldsToHide) {
      const updatedUISchema = { ...uiSchema };

      fieldsToHide.forEach((field) => {
        if (updatedUISchema[field]) {
          updatedUISchema[field] = {
            ...updatedUISchema[field],
            originalWidget: updatedUISchema[field]['ui:widget'], // Store original widget type
            'ui:widget': 'hidden',
          };
        }
      });

      return updatedUISchema;
    }
    const hiddenUISchema = hideFieldsInUISchema(updatedUISchema, skipKeys);
    setFormUiSchema(hiddenUISchema);
  };

  const handleSubmit = ({ formData }: { formData: any }) => {
    //step-1 : Check and remove skipped Data
    function filterFormData(skipHideObject, formData) {
      const updatedFormData = { ...formData };

      Object.keys(skipHideObject).forEach((key) => {
        if (formData[key] && skipHideObject[key][formData[key]]) {
          skipHideObject[key][formData[key]].forEach((fieldToRemove) => {
            delete updatedFormData[fieldToRemove];
          });
        }
      });

      return updatedFormData;
    }
    const filteredData = filterFormData(hideAndSkipFields, formData);
    console.log('formData', formData);
    //step-2 : Validate the form data
    function transformFormData(
      formData: Record<string, any>,
      schema: any,
      extraFields: Record<string, any> = {} // Optional root-level custom fields
    ) {
      const transformedData: Record<string, any> = {
        ...extraFields, // Add optional root-level custom fields dynamically
        customFields: [],
      };

      for (const key in formData) {
        if (schema.properties[key]) {
          const fieldSchema = schema.properties[key];

          if (fieldSchema.coreField === 0 && fieldSchema.fieldId) {
            // Use fieldId for custom fields
            transformedData.customFields.push({
              fieldId: fieldSchema.fieldId,
              value:
                fieldSchema?.maxSelection > 0 ? [formData[key]] : formData[key],
            });
          } else {
            // Use the field name for core fields
            transformedData[key] = formData[key];
          }
        }
      }

      return transformedData;
    }

    // Optional extra root-level fields
    // Extra Field for cohort creation

    const transformedFormData = transformFormData(
      filteredData,
      schema,
      extraFields
    );

    // console.log('formSchema', transformedFormData);
    console.log('Form Data Submitted:', filteredData);
    console.log('formattedFormData', transformedFormData);
    if (!isCallSubmitInHandle) {
      FormSubmitFunction(filteredData, transformedFormData);
    }
  };
  console.log(formSchema);

  return (
    <>
      {!isCallSubmitInHandle ? (
        <Form
          schema={formSchema}
          uiSchema={formUiSchema}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          validator={validator}
          noHtml5Validate
          showErrorList={false} // Hides the error list card at the top
          // liveValidate={submitted} // Only validate on submit or typing
          // onChange={() => setSubmitted(true)} // Show validation when user starts typing
        />
      ) : (
        <Grid container spacing={2}>
          {Object.keys(formSchema.properties).map((key) => (
            <Grid item xs={12} md={4} lg={4} key={key} sx={{ mb: '-40px' }}>
              <Form
                schema={{
                  type: 'object',
                  properties: { [key]: formSchema.properties[key] },
                }}
                uiSchema={{ [key]: formUiSchema[key] }}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                validator={validator}
                // submitButtonProps={{
                //   style: { display: !isCallSubmitInHandle ? 'none' : 'block' },
                // }}
                noHtml5Validate
                showErrorList={false} // Hides the error list card at the top
                // liveValidate={submitted} // Only validate on submit or typing
                // onChange={() => setSubmitted(true)} // Show validation when user starts typing
                // {...(isCallSubmitInHandle
                //   ? { submitButtonProps: { style: { display: 'none' } } }
                //   : {})}
              >
                {!isCallSubmitInHandle ? null : (
                  <button type="submit" style={{ display: 'none' }}>
                    Submit
                  </button>
                )}
              </Form>
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default DynamicForm;

/*
below are sample json


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
    phoneDetails: { 'ui:widget': 'select' },
    district: { 'ui:widget': 'select' },
  };
  */