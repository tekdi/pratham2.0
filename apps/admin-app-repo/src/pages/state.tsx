// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  MasterStateSearchSchema,
  MasterStateUISchema,
} from '../constant/Forms/MasterStateSearch';
import { Status } from '@/utils/app.constant';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { Numbers } from '@mui/icons-material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { updateCohortMemberStatus } from '@/services/CohortService/cohortService';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PreviewIcon from '@mui/icons-material/Preview';
import editIcon from '../../public/images/editIcon.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import Image from 'next/image';
import UserNameCell from '@/components/UserNameCell';
import { fetchStateOptions } from '@/services/MasterDataService';

//import { DynamicForm } from '@shared-lib';

const State = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(MasterStateSearchSchema);
  console.log(schema);

  const [uiSchema, setUiSchema] = useState(MasterStateUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [sortBy, setSortBy] = useState<string>('name');
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [renderKey, setRenderKey] = useState(true);
  // const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editableUserId, setEditableUserId] = useState('');

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (response?.result?.totalCount !== 0) {
      searchData(prefilledFormData, 0);
    }
  }, [pageLimit]);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const debouncedGetList = useCallback(
    debounce(async (data) => {
      console.log('Debounced API Call:', data);
      const resp = await fetchStateOptions(data);
      setResponse({ result: resp?.result });
    }, 1000),
    []
  );

  const SubmitaFunction = async (formData: any) => {
    setPrefilledFormData(formData);
    await searchData(formData, 0);
  };

  const searchData = async (formData = [], newPage) => {
    formData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => !Array.isArray(value) || value.length > 0
      )
    );
    const { sortBy, ...restFormData } = formData;

    const filters = {
      // role: 'Instructor',
      status: [Status.ACTIVE],
      ...Object.entries(restFormData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
    };

    const sort = ['state_name', sortBy ? sortBy : 'asc'];
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
      fieldName: 'state',
      optionName: formData.firstName,
    };

    if (filters.firstName) {
      debouncedGetList(data);
    } else {
      const resp = await fetchStateOptions(data);
      setResponse({ result: resp?.result });
    }
  };

  // Define table columns
  const columns = [
    {
      keys: ['state_name'],
      label: 'State',
      render: (row) => row.state_name,
    },
    {
      keys: ['state_code'],
      label: 'Code',
      render: (row) => row.state_code,
    },
    {
      keys: ['is_active'],
      label: 'Status',
      render: (row) => (row.is_active === 1 ? 'Active' : 'Inactive'),
      getStyle: (row) => ({ color: row.is_active === 1 ? 'green' : 'red' }),
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

  const handleOpenModal = () => setOpenModal(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  function extractMatchingKeys(row, schema) {
    let result = {};

    for (const [key, value] of Object.entries(schema.properties)) {
      if (value.coreField === 0) {
        if (value.fieldId) {
          const customField = row.results?.values?.find(
            (field) => field.fieldId === value.fieldId
          );
          if (customField) {
            result[key] = customField.selectedValues
              .map((v) => v.id)
              .join(', ');
          }
        } else if (row[key] !== undefined) {
          result[key] = row[key];
        }
      } else if (row[key] !== undefined) {
        result[key] = row[key];
      }
    }

    return result;
  }

  return (
    <>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
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

        {response && response?.result ? (
          <Box sx={{ mt: 5 }}>
            <PaginatedTable
              key={renderKey ? 'defaultRender' : 'customRender'}
              count={response?.result?.totalCount}
              data={response?.result?.values}
              columns={columns}
              // actions={actions}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              defaultPage={currentPage}
              defaultRowsPerPage={pageLimit}
            />
          </Box>
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="20vh"
          >
            <Typography marginTop="10px" textAlign={'center'}>
              {t('COMMON.NO_STATE_FOUND')}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};
export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default State;
