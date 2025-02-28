// // @ts-nocheck
// import React, { useState, useEffect, useRef } from 'react';
// import Form from '@rjsf/mui';
// import validator from '@rjsf/validator-ajv8';
// import axios from 'axios';
// import DynamicForm from '@/components/DynamicForm/DynamicForm';
// import { setSeconds } from 'date-fns';
// import Loader from '@/components/Loader';
// import { GenerateSchemaAndUiSchema } from '@/components/GeneratedSchemas';
// import { useTranslation } from 'react-i18next';

// //import { DynamicForm } from '@shared-lib';

// const Center = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [schema, setSchema] = useState(null);
//   const [uiSchema, setUiSchema] = useState(null);
//   const { t, i18n } = useTranslation();
//   useEffect(() => {
//     setIsLoading(true);
//     // Fetch form schema from API and set it in state.
//     const fetchData = async () => {
//       let data = JSON.stringify({
//         readForm: [
//           {
//             fetchUrl:
//               'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=cohorts&contextType=cohort',
//             header: {},
//           },
//           {
//             fetchUrl:
//               'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=cohorts&contextType=cohort',
//             header: {
//               tenantid: 'ef99949b-7f3a-4a5f-806a-e67e683e38f3',
//             },
//           },
//         ],
//       });

//       let config = {
//         method: 'post',
//         maxBodyLength: Infinity,
//         url: '/api/dynamic-form/get-rjsf-form',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         data: data,
//       };

//       await axios
//         .request(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//           if (response.data?.schema) {
//             console.log(`schema`, response.data?.schema);
//             setSchema(response.data?.schema);
//           }
//           if (response.data?.schema) {
//             console.log(`uiSchema`, response.data?.uiSchema);
//             setUiSchema(response.data?.uiSchema);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//         });

//       setIsLoading(false);
//     };
//     fetchData();
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <>
//           <Loader />
//         </>
//       ) : (
//         schema &&
//         uiSchema && <DynamicForm schema={schema} uiSchema={uiSchema} t={t}/>
//       )}
//     </>
//   );
// };

// export default Center;

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
import { getCenterTableData } from '@/data/tableColumns';
import { Numbers } from '@mui/icons-material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

//import { DynamicForm } from '@shared-lib';

const Centers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(CohortSearchSchema);
  const [uiSchema, setUiSchema] = useState(CohortSearchUISchema);
  const [sortBy, setSortBy] = useState<string>('name');
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [renderKey, setRenderKey] = useState(true);

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (response?.count !== 0) {
      searchData(prefilledFormData, 0);
    }
  }, [pageLimit]);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const debouncedGetCohortList = debounce(async (data) => {
    const resp = await getCohortList(data);
    console.log('Debounced API Call:', resp?.results?.cohortDetails || []);
    setResponse(resp);
  }, 300);

  const SubmitaFunction = async (formData: any) => {
    setPrefilledFormData(formData);
    await searchData(formData, 0);
  };

  const searchData = async (formData, newPage) => {
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

    const sort = ['name', sortBy || 'asc'];
    let limit = pageLimit;
    let offset = newPage * limit;
    let pageNumber = newPage;

    setPageOffset(offset);
    setCurrentPage(pageNumber);
    setResponse({});
    setRenderKey((renderKey) => !renderKey);

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
      setResponse(resp);
      console.log('Immediate API Call:', resp?.results?.cohortDetails || []);
    }
  };

  // Define table columns
  const columns = [
    { key: 'name', label: 'Cohort Name' },
    {
      key: 'status',
      label: 'Status',
      getStyle: (row) => ({ color: row.status === 'active' ? 'green' : 'red' }),
    },
    {
      key: 'state',
      label: 'State',
      render: (row) =>
        row.customFields.find((field) => field.label === 'STATE')
          ?.selectedValues[0]?.value || '-',
    },
  ];

  // Define actions
  const actions = [
    {
      icon: <EditIcon color="primary" />,
      callback: (row) => alert(`Editing ${row.name}`),
    },
    {
      icon: <DeleteIcon color="error" />,
      callback: (row) => alert(`Deleting ${row.name}`),
    },
  ];

  // Pagination handlers
  const handlePageChange = (newPage) => {
    console.log('Page changed to:', newPage);
    searchData(prefilledFormData, newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    console.log('Rows per page changed to:', newRowsPerPage);
    setPageLimit(newRowsPerPage);
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
      {response && response?.results?.cohortDetails && (
        <Box sx={{ mt: 5 }}>
          <PaginatedTable
            key={renderKey ? 'defaultRender' : 'customRender'}
            count={response?.count}
            data={response?.results?.cohortDetails}
            columns={columns}
            actions={actions}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            defaultPage={currentPage}
            defaultRowsPerPage={pageLimit}
          />
        </Box>
      )}
    </>
  );
};

export default Centers;
