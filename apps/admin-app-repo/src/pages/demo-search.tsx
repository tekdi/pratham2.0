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
  CohortSearchSchema,
  CohortSearchUISchema,
} from '../constant/Forms/CohortSearch';
import { CohortTypes, Status } from '@/utils/app.constant';
import { getCohortList } from '@/services/CohortService/cohortService';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import KaTableComponent from '@/components/KaTableComponent';
import { getCenterTableData } from '@/data/tableColumns';
import { Numbers } from '@mui/icons-material';

//import { DynamicForm } from '@shared-lib';

const DemoSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(CohortSearchSchema);
  const [uiSchema, setUiSchema] = useState(CohortSearchUISchema);
  const [sortBy, setSortBy] = useState<string>('name');
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [cohortData, setCohortData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const { t, i18n } = useTranslation();

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const debouncedGetCohortList = debounce(async (data) => {
    const resp = await getCohortList(data);
    console.log('Debounced API Call:', resp?.results?.cohortDetails || []);
    setCohortData(resp?.results?.cohortDetails);
    setTotalCount(resp?.count || 0);
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
      console.log('Immediate API Call:', resp?.results?.cohortDetails || []);
      setCohortData(resp?.results?.cohortDetails || []);
      setTotalCount(resp?.count || 0);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        schema &&
        uiSchema && (
          <DynamicForm
            schema={schema}
            uiSchema={updatedUiSchema}
            SubmitaFunction={SubmitaFunction}
            isCallSubmitInHandle={true}
            prefilledFormData={prefilledFormData || {}}
          />
        )
      )}
      {loading ? (
        <Box
          width={'100%'}
          id="check"
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Loader showBackdrop={false} loadingText={t('COMMON.LOADING')} />
        </Box>
      ) : cohortData?.length > 0 ? (
        <KaTableComponent
          columns={getCenterTableData(t)}
          data={cohortData}
          limit={pageLimit}
          offset={pageOffset}
          paginationEnable={totalCount > Numbers.TEN}
          // PagesSelector={PagesSelector}
          // pagination={pagination}
          // PageSizeSelector={PageSizeSelectorFunction}
          // pageSizes={pageSizeArray}
          // extraActions={extraActions}
          // showIcons={true}
          // onEdit={handleEdit}
          // onDelete={handleDelete}
          // handleMemberClick={handleMemberClick}
        />
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="20vh"
        >
          <Typography marginTop="10px" textAlign={'center'}>
            {t('COMMON.NO_CENTER_FOUND')}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default DemoSearch;
