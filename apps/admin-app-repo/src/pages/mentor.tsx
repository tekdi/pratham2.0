// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Form from '@rjsf/mui';
import validator from '@rjsf/validator-ajv8';
import axios from 'axios';
import DynamicForm from '@/components/DynamicForm/DynamicForm';
import Loader from '@/components/Loader';
import { useTranslation } from 'react-i18next';
import {
  MentorSearchSchema,
  MentorSearchUISchema,
} from '../constant/Forms/MentorSearch';
import { Status } from '@/utils/app.constant';
import { userList } from '@/services/UserList';
import { Box, Grid, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { Numbers } from '@mui/icons-material';
import PaginatedTable from '@/components/PaginatedTable/PaginatedTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import AddEditMentor from '@/components/EntityForms/AddEditMentor/AddEditMentor';
import SimpleModal from '@/components/SimpleModal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { updateCohortMemberStatus } from '@/services/CohortService/cohortService';
import AddBoxIcon from '@mui/icons-material/AddBox';
import PreviewIcon from '@mui/icons-material/Preview';
import editIcon from '../../public/images/editIcon.svg';
import deleteIcon from '../../public/images/deleteIcon.svg';
import Image from 'next/image';

//import { DynamicForm } from '@shared-lib';

const Mentor = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [schema, setSchema] = useState(MentorSearchSchema);
  const [uiSchema, setUiSchema] = useState(MentorSearchUISchema);
  const [addSchema, setAddSchema] = useState(null);
  const [addUiSchema, setAddUiSchema] = useState(null);
  const [prefilledAddFormData, setPrefilledAddFormData] = useState({});
  const [sortBy, setSortBy] = useState<string>('name');
  const [pageLimit, setPageLimit] = useState<number>(10);
  const [pageOffset, setPageOffset] = useState<number>(0);
  const [prefilledFormData, setPrefilledFormData] = useState({});
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
  useEffect(() => {
    // Fetch form schema from API and set it in state.
    const fetchData = async () => {
      let data = JSON.stringify({
        readForm: [
          {
            fetchUrl:
              'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=USERS&contextType=INSTRUCTOR',
            header: {},
          },
          {
            fetchUrl:
              'https://dev-middleware.prathamdigital.org/user/v1/form/read?context=USERS&contextType=INSTRUCTOR',
            header: {
              tenantid: '6c8b810a-66c2-4f0d-8c0c-c025415a4414',
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
            setAddSchema(response.data?.schema);
          }
          if (response.data?.schema) {
            console.log(`uiSchema`, response.data?.uiSchema);
            setAddUiSchema(response.data?.uiSchema);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  const updatedUiSchema = {
    ...uiSchema,
    'ui:submitButtonOptions': {
      norender: true, // Hide submit button if isHide is true
    },
  };

  const debouncedGetList = debounce(async (data) => {
    const resp = await userList(data);
    console.log('Debounced API Call:', resp);
    // console.log('totalCount', result?.totalCount);
    // console.log('userDetails', result?.getUserDetails);
    setResponse({ result: resp });
  }, 300);

  const SubmitaFunction = async (formData: any) => {
    setPrefilledFormData(formData);
    await searchData(formData, 0);
  };

  const searchData = async (formData, newPage) => {
    const { sortBy, ...restFormData } = formData;

    const filters = {
      role: 'Instructor',
      status: [Status.ACTIVE],
      ...Object.entries(restFormData).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>),
    };

    const sort = ['firstName', sortBy || 'asc'];
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
      debouncedGetList(data);
    } else {
      const resp = await userList(data);
      // console.log('totalCount', result?.totalCount);
      // console.log('userDetails', result?.getUserDetails);
      setResponse({ result: resp });
      console.log('Immediate API Call:', resp);
    }
  };

  // Define table columns
  const columns = [
    {
      keys: ['firstName', 'middleName', 'lastName'],
      label: 'Mentor Name',
      render: (row) =>
        `${row.firstName || ''} ${row.middleName || ''} ${
          row.lastName || ''
        }`.trim(),
    },
    {
      key: 'status',
      label: 'Status',
      getStyle: (row) => ({ color: row.status === 'active' ? 'green' : 'red' }),
    },
    // {
    //   key: 'STATE',
    //   label: 'State',
    //   render: (row) => {
    //     const state =
    //       row.customFields.find((field) => field.label === 'STATE')
    //         ?.selectedValues[0]?.value || '-';
    //     return `${state}`;
    //   },
    // },
    {
      keys: ['STATE', 'DISTRICT', 'BLOCK', 'VILLAGE'],
      label: 'Location (State / District / Block/ Village)',
      render: (row) => {
        const state =
          row.customFields.find((field) => field.label === 'STATE')
            ?.selectedValues[0]?.value || '';
        const district =
          row.customFields.find((field) => field.label === 'DISTRICT')
            ?.selectedValues[0]?.value || '';
        const block =
          row.customFields.find((field) => field.label === 'BLOCK')
            ?.selectedValues[0]?.value || '';
        const village =
          row.customFields.find((field) => field.label === 'VILLAGE')
            ?.selectedValues[0]?.value || '';
        return `${state}, ${district}, ${block}, ${village}`;
      },
    },
  ];

  // Define actions
  const actions = [
    {
      icon: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 234, 240)',
            padding: '10px',
          }}
        >
          <Image src={editIcon} alt="" />
        </Box>
      ),
      callback: (row) => {
        console.log('row:', row);
        console.log('AddSchema', addSchema);
        console.log('AddUISchema', addUiSchema);

        let tempFormData = extractMatchingKeys(row, addSchema);
        // console.log('tempFormData', tempFormData);
        setPrefilledAddFormData(tempFormData);
        setIsEdit(true);
        setEditableUserId(row?.userId);
        handleOpenModal();
      },
    },
    {
      icon: (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'rgb(227, 234, 240)',
            padding: '10px',
          }}
        >
          {' '}
          <Image src={deleteIcon} alt="" />
        </Box>
      ),
      callback: async (row) => {
        console.log('row:', row);
        // setEditableUserId(row?.userId);
        const memberStatus = Status.ARCHIVED;
        const statusReason = '';
        const membershipId = row?.userId;

        const response = await updateCohortMemberStatus({
          memberStatus,
          statusReason,
          membershipId,
        });
        setPrefilledFormData({});
        searchData(prefilledFormData, currentPage);
        setOpenModal(false);
      },
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
          const customField = row.customFields?.find(
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }} mt={4}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setPrefilledAddFormData({});
              setIsEdit(false);
              setEditableUserId('');
              handleOpenModal();
            }}
          >
            Add New
          </Button>
        </Box>

        <SimpleModal
          open={openModal}
          onClose={handleCloseModal}
          showFooter={false}
          modalTitle={
            isEdit ? t('MENTORS.UPDATE_MENTOR') : t('MENTORS.NEW_MENTOR')
          }
        >
          <AddEditMentor
            SuccessCallback={() => {
              setPrefilledFormData({});
              searchData({}, 0);
              setOpenModal(false);
            }}
            schema={addSchema}
            uiSchema={addUiSchema}
            editPrefilledFormData={prefilledAddFormData}
            isEdit={isEdit}
            editableUserId={editableUserId}
            UpdateSuccessCallback={() => {
              setPrefilledFormData({});
              searchData(prefilledFormData, currentPage);
              setOpenModal(false);
            }}
          />
        </SimpleModal>

        {response && response?.result?.getUserDetails ? (
          <Box sx={{ mt: 1 }}>
            <PaginatedTable
              key={renderKey ? 'defaultRender' : 'customRender'}
              count={response?.result?.totalCount}
              data={response?.result?.getUserDetails}
              columns={columns}
              actions={actions}
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
              {t('COMMON.NO_MENTOR_FOUND')}
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

export default Mentor;
