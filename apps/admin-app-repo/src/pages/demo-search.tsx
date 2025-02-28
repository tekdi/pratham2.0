// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import { setSeconds } from 'date-fns';
import Loader from '@/components/Loader';
import { GenerateSchemaAndUiSchema } from '@/components/GeneratedSchemas';
import { useTranslation } from 'react-i18next';
import {
  TeacherSearchSchema,
  TeacherSearchUISchema,
} from '../constant/Forms/TeacherSearch';
import { CohortTypes, Status } from '@/utils/app.constant';
import { getCohortList } from '@/services/CohortService/cohortService';
import { Grid } from '@mui/material';
import { debounce } from 'lodash';

//import { DynamicForm } from '@shared-lib';

const DemoSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(TeacherSearchSchema);
  const [uiSchema, setUiSchema] = useState(TeacherSearchUISchema);
  const [sortBy, setSortBy] = useState<string>('name');
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});

  const { t, i18n } = useTranslation();

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const debouncedGetCohortList = debounce(async (data) => {
    const resp = await getCohortList(data);
    // console.log('Debounced API Call:', data);
  }, 300);

  const SubmitaFunction = async (formData: any) => {
    const { sortBy, ...restFormData } = formData;

    const filters = {
      type: CohortTypes.COHORT,
      status: [Status.ACTIVE],
      ...Object.entries(restFormData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
    };

    const limit = pageLimit;
    const offset = pageOffset * limit;
    const sort = ['name', sortBy || 'asc'];

    const data = {
      limit,
      offset,
      sort,
      filters,
    };

    if (filters.searchKey) {
      debouncedGetCohortList(data);
    } else {
      const resp = await getCohortList(data);
      console.log('Immediate API Call:', data);
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <Loader />
        </>
      ) : (
        schema &&
        uiSchema && (
          // <Grid container spacing={2}>
          <DynamicForm
            schema={schema}
            uiSchema={updatedUiSchema}
            SubmitaFunction={SubmitaFunction}
            isCallSubmitInHandle={true}
            prefilledFormData={prefilledFormData || {}}
          />
          // </Grid>
        )
      )}
    </>
  );
};

export default DemoSearch;
